// ============================================================
// src/routes/chapitres.routes.js
// ============================================================
const express        = require('express');
const path           = require('path');
const fs             = require('fs');
const Chapitre       = require('../models/Chapitre');
const Matiere        = require('../models/Matiere');
const Lecon          = require('../models/Lecon');
const { authJWT, roleCheck, limiterClaude } = require('../middlewares');
const uploadChapitre = require('../middlewares/upload.chapitre');
const { genererFicheMemo } = require('../services/claude.cours');

const router = express.Router();
router.use(authJWT);
const ok  = (res, d, s=200) => res.status(s).json({ success:true, data:d });
const err = (res, m, s=400) => res.status(s).json({ success:false, error:m });

router.get('/', async (req, res) => {
  try {
    const { niveau, matiereId, matiereCode, estLangue } = req.query;
    const filtre = { actif: true };
    if (niveau) filtre.niveau = niveau;
    if (matiereId) {
      filtre.matiereId = matiereId;
    } else if (matiereCode) {
      // Cherche par code matière (ex: 'WO' pour Wolof)
      const mat = await Matiere.findOne({ code: matiereCode });
      if (mat) filtre.matiereId = mat._id;
      else return ok(res, []);
    } else if (estLangue !== undefined) {
      // Filtrer toutes les matières langue ou non
      const mats = await Matiere.find({ estLangue: estLangue === 'true' });
      filtre.matiereId = { $in: mats.map(m => m._id) };
    }
    const chapitres = await Chapitre.find(filtre)
      .populate('matiereId', 'nom code couleur icone estLangue')
      .sort({ ordre: 1 });
    ok(res, chapitres);
  } catch (e) { err(res, e.message, 500); }
});

router.post('/', roleCheck('admin'), async (req, res) => {
  try {
    const chapitre = await Chapitre.create(req.body);
    ok(res, chapitre, 201);
  } catch (e) { err(res, e.message, 500); }
});

router.put('/:id', roleCheck('admin'), async (req, res) => {
  try {
    const chapitre = await Chapitre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    ok(res, chapitre);
  } catch (e) { err(res, e.message, 500); }
});

// DELETE /api/chapitres/:id — désactiver (soft) ou supprimer définitivement
// ?permanent=true → suppression physique + toutes ses leçons
router.delete('/:id', roleCheck('admin'), async (req, res) => {
  try {
    if (req.query.permanent === 'true') {
      // Supprimer toutes les leçons du chapitre
      await Lecon.deleteMany({ chapitreId: req.params.id });
      await Chapitre.findByIdAndDelete(req.params.id);
      return ok(res, { message: 'Chapitre et toutes ses leçons supprimés définitivement' });
    }
    await Chapitre.findByIdAndUpdate(req.params.id, { actif: false });
    ok(res, { message: 'Chapitre masqué (désactivé)' });
  } catch (e) { err(res, e.message, 500); }
});

// ── POST /:id/upload-doc ─────────────────────────────────────
// Upload jusqu'à 5 documents de référence pour l'IA
router.post('/:id/upload-doc', roleCheck('admin', 'prof'),
  uploadChapitre.array('documents', 5),
  async (req, res) => {
    try {
      const chapitre = await Chapitre.findById(req.params.id);
      if (!chapitre) return err(res, 'Chapitre introuvable', 404);

      if (!req.files || req.files.length === 0) {
        return err(res, 'Aucun fichier reçu');
      }

      // Vérif : max 5 docs par chapitre
      const totalApres = (chapitre.documentsRef?.length || 0) + req.files.length;
      if (totalApres > 5) {
        // Supprimer les fichiers uploadés (quota dépassé)
        req.files.forEach(f => fs.unlink(f.path, () => {}));
        return err(res, `Maximum 5 documents par chapitre (vous en avez déjà ${chapitre.documentsRef?.length || 0})`);
      }

      const nouveauxDocs = req.files.map(f => {
        const ext = path.extname(f.originalname).toLowerCase().slice(1); // 'pdf', 'txt', etc.
        // Chemin relatif depuis uploads/
        const relatif = `chapitres/${req.params.id}/${f.filename}`;
        return {
          nom:    f.originalname,
          chemin: relatif,
          type:   ext,
          taille: f.size,
        };
      });

      chapitre.documentsRef = [...(chapitre.documentsRef || []), ...nouveauxDocs];
      await chapitre.save();

      ok(res, {
        chapitre,
        message: `${req.files.length} document(s) ajouté(s) — l'IA pourra s'en inspirer`,
      });
    } catch (e) { err(res, e.message, 500); }
  }
);

// ── DELETE /:id/documents/:docIndex ─────────────────────────
// Supprimer un document de référence (par son index dans le tableau)
router.delete('/:id/documents/:docIndex', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const chapitre = await Chapitre.findById(req.params.id);
    if (!chapitre) return err(res, 'Chapitre introuvable', 404);

    const idx = parseInt(req.params.docIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= (chapitre.documentsRef?.length || 0)) {
      return err(res, 'Index de document invalide');
    }

    const doc = chapitre.documentsRef[idx];
    // Supprimer le fichier physique
    const fullPath = path.join(__dirname, '../../uploads', doc.chemin);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    chapitre.documentsRef.splice(idx, 1);
    await chapitre.save();

    ok(res, { chapitre, message: `Document "${doc.nom}" supprimé` });
  } catch (e) { err(res, e.message, 500); }
});

// ── POST /:id/generer-fiche ──────────────────────────────────
// Admin/prof génère ou regénère la fiche mémo via l'IA
router.post('/:id/generer-fiche', roleCheck('admin', 'prof'), limiterClaude, async (req, res) => {
  try {
    const chapitre = await Chapitre.findById(req.params.id).populate('matiereId', 'nom code');
    if (!chapitre) return err(res, 'Chapitre introuvable', 404);

    // Chercher le contenu brut d'une leçon publiée si disponible
    const lecon = await Lecon.findOne({ chapitreId: chapitre._id, statut: 'publie' });

    const fiche = await genererFicheMemo({
      chapitre:         chapitre.titre,
      niveau:           chapitre.niveau || 'Libre',
      matiere:          chapitre.matiereId?.nom || '',
      contenuBrut:      lecon?.contenuBrut || '',
      promptSupplement: chapitre.promptSupplement || '',
      documentsRef:     chapitre.documentsRef || [],
      userId:           req.user._id,
    });

    if (!fiche || !fiche.pointsACretenir) {
      return err(res, 'L\'IA n\'a pas pu générer la fiche mémo');
    }

    chapitre.ficheMemo = {
      pointsACretenir:   fiche.pointsACretenir   || [],
      questionsReponses: fiche.questionsReponses || [],
      genereAt:          new Date(),
      genereParIA:       true,
    };
    await chapitre.save();

    ok(res, {
      ficheMemo: chapitre.ficheMemo,
      message:   `Fiche mémo générée : ${fiche.pointsACretenir.length} points + ${fiche.questionsReponses?.length || 0} Q&R`,
    });
  } catch (e) { err(res, e.message, 500); }
});

// ── PUT /:id/fiche-memo ──────────────────────────────────────
// Admin/prof édite manuellement la fiche mémo
router.put('/:id/fiche-memo', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const { pointsACretenir, questionsReponses } = req.body;
    const chapitre = await Chapitre.findById(req.params.id);
    if (!chapitre) return err(res, 'Chapitre introuvable', 404);

    chapitre.ficheMemo = {
      pointsACretenir:   pointsACretenir   || chapitre.ficheMemo?.pointsACretenir || [],
      questionsReponses: questionsReponses || chapitre.ficheMemo?.questionsReponses || [],
      genereAt:          new Date(),
      genereParIA:       false,
    };
    await chapitre.save();
    ok(res, { ficheMemo: chapitre.ficheMemo });
  } catch (e) { err(res, e.message, 500); }
});

// ── GET /:id/fiche-memo ──────────────────────────────────────
// Élève récupère la fiche mémo d'un chapitre
router.get('/:id/fiche-memo', async (req, res) => {
  try {
    const chapitre = await Chapitre.findById(req.params.id)
      .select('titre niveau ficheMemo matiereId')
      .populate('matiereId', 'nom code');
    if (!chapitre) return err(res, 'Chapitre introuvable', 404);
    ok(res, {
      chapitreId:   chapitre._id,
      titreChapitre: chapitre.titre,
      niveau:       chapitre.niveau,
      matiere:      chapitre.matiereId?.nom,
      ficheMemo:    chapitre.ficheMemo || null,
    });
  } catch (e) { err(res, e.message, 500); }
});

module.exports = router;
