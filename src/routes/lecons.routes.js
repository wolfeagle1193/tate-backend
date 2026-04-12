
// src/routes/lecons.routes.js
// ============================================================
const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const mongoose = require('mongoose');
const Chapitre = require('../models/Chapitre');
const Lecon    = require('../models/Lecon');
const claude   = require('../services/claudeService');
const { modifierHTML, genererExercicesHTML } = require('../services/claude.cours');
const { authJWT, roleCheck, limiterClaude } = require('../middlewares');
const uploadLecon = require('../middlewares/upload.lecon');

const router = express.Router();
router.use(authJWT);
const ok  = (res, d, s=200) => res.status(s).json({ success:true, data:d });
const err = (res, m, s=400) => res.status(s).json({ success:false, error:m });

// POST /api/lecons/preparer
// Accepte multipart/form-data (avec fichiers) OU JSON (sans fichiers)
router.post('/preparer', roleCheck('admin','prof'), limiterClaude,
  uploadLecon.array('documents', 5),
  async (req, res) => {
    const fichiersTemp = req.files || [];
    try {
      // Les champs texte sont dans req.body (multer parse aussi les champs texte)
      const chapitreId    = req.body.chapitreId;
      const contenuBrut   = req.body.contenuBrut   || undefined;
      const promptProf    = req.body.promptProf    || '';
      // formStructure peut être envoyé en JSON stringifié
      let formStructure;
      if (req.body.formStructure) {
        try { formStructure = JSON.parse(req.body.formStructure); }
        catch { formStructure = req.body.formStructure; }
      }

      if (!chapitreId) return err(res, 'chapitreId obligatoire');

      const chapitre = await Chapitre.findById(chapitreId).populate('matiereId');
      if (!chapitre) return err(res, 'Chapitre introuvable', 404);

      // ── Documents de référence : chapitre (permanents) + prof (temporaires) ──
      const docsProf = fichiersTemp.map(f => ({
        nom:    f.originalname,
        chemin: `lecons/temp/${f.filename}`,
        type:   path.extname(f.originalname).toLowerCase().slice(1),
        taille: f.size,
      }));
      const tousLesDocs = [...(chapitre.documentsRef || []), ...docsProf];

      // ── Consignes combinées : chapitre + prof ──────────────────────────────
      const promptCombine = [chapitre.promptSupplement, promptProf]
        .filter(Boolean).join('\n\n');

      const resultat = await claude.preparerCoursProfesseur({
        contenuBrut,
        formStructure,
        chapitre:         chapitre.titre,
        niveau:           chapitre.niveau,
        matiere:          chapitre.matiereId.nom,
        promptSupplement: promptCombine,
        documentsRef:     tousLesDocs,
        userId:           req.user._id,
      });

      // ── Fusionner le cours formaté + exercices en un seul objet contenuFormate ──
      // correctionsTypes est au niveau racine du résultat Claude — on l'intègre ici
      const contenuFormate = {
        ...(resultat.coursFormate || {}),
        correctionsTypes: Array.isArray(resultat.correctionsTypes)
          ? resultat.correctionsTypes
          : [],
      };

      // NE PAS dépublier l'ancienne leçon ici : elle reste accessible aux élèves
      // pendant que l'admin/prof révise le nouveau contenu.
      // La dépublication se fait dans /valider quand le nouveau cours est approuvé.
      // Archiver seulement les brouillons et en_preparation précédents de ce chapitre
      await Lecon.updateMany(
        { chapitreId, statut: 'en_preparation' },
        { statut: 'brouillon' }
      );

      const lecon = await Lecon.create({
        chapitreId,
        titre:          contenuFormate.titre || chapitre.titre,
        contenuBrut:    contenuBrut || '',
        formStructure:  formStructure || {},
        contenuFormate,
        statut:         'en_preparation',  // En attente de validation admin/prof
        creePar:        req.user._id,
      });

      ok(res, {
        lecon,
        nbExercices:      contenuFormate.correctionsTypes.length,
        correctionsTypes: contenuFormate.correctionsTypes,
        notesProf:        resultat.notesProf,
      }, 201);
    } catch (e) {
      err(res, e.message, 500);
    } finally {
      // Supprimer les fichiers temporaires du prof (dans tous les cas)
      fichiersTemp.forEach(f => {
        try { fs.unlinkSync(f.path); } catch {}
      });
    }
  }
);

// ═══════════════════════════════════════════════════════════════
// POST /api/lecons/creer-html
// Crée un cours à partir d'un fichier HTML complet (rendu tel quel)
// Body : { chapitreId, contenuHTML: "<!DOCTYPE html>...", exercices: [{ question, reponse, explication }] }
// ═══════════════════════════════════════════════════════════════
router.post('/creer-html', roleCheck('admin','prof'), async (req, res) => {
  try {
    const {
      chapitreId,
      contenuHTML,
      exercices          = [],
      instructionsHTML   = '',   // consigne IA pour modifier le HTML (optionnel)
      instructionsExos   = '',   // consigne IA pour générer des exercices (optionnel)
      genererExos        = false, // true = demande à Claude de générer des exercices
    } = req.body;

    if (!chapitreId) return err(res, 'chapitreId obligatoire');
    if (!contenuHTML || contenuHTML.trim().length < 20)
      return err(res, 'contenuHTML est requis — colle ou uploade le code HTML du cours');

    const chapitre = await Chapitre.findById(chapitreId).populate('matiereId');
    if (!chapitre) return err(res, 'Chapitre introuvable', 404);

    const niveau  = chapitre.niveau  || 'CM1';
    const matiere = chapitre.matiereId?.nom || 'Matière';
    const userId  = req.user._id;

    // ── 1. Modifier le HTML avec l'IA si demandé ──────────────────
    let htmlFinal = contenuHTML;
    if (instructionsHTML && instructionsHTML.trim().length > 5) {
      htmlFinal = await modifierHTML({
        contenuHTML,
        instructions: instructionsHTML.trim(),
        chapitre: chapitre.titre,
        niveau, matiere, userId,
      });
    }

    // ── 2. Générer des exercices avec l'IA si demandé ─────────────
    let exercicesIA = [];
    if (genererExos) {
      const raw = await genererExercicesHTML({
        contenuHTML: htmlFinal,
        instructions: instructionsExos.trim(),
        chapitre: chapitre.titre,
        niveau, matiere, userId,
      });
      if (Array.isArray(raw)) exercicesIA = raw;
    }

    // ── 3. Fusionner exercices manuels + exercices IA ─────────────
    const exercicesManuels = exercices
      .filter(e => e.question?.trim())
      .map(e => ({
        question:    e.question.trim(),
        reponse:     (e.reponse     || '').trim(),
        explication: (e.explication || '').trim(),
      }));

    const exercicesIA_clean = exercicesIA
      .filter(e => e.question?.trim())
      .map(e => ({
        question:    (e.question    || '').trim(),
        reponse:     (e.reponse     || '').trim(),
        explication: (e.explication || '').trim(),
      }));

    const correctionsTypes = [...exercicesManuels, ...exercicesIA_clean];

    // Exercices optionnels pour les cours HTML : l'admin peut ajouter un QCM séparément

    // ── 4. Archiver les anciens brouillons ─────────────────────────
    await Lecon.updateMany(
      { chapitreId, statut: 'en_preparation' },
      { statut: 'brouillon' }
    );

    // ── 5. Créer la leçon ──────────────────────────────────────────
    const lecon = await Lecon.create({
      chapitreId,
      titre:        chapitre.titre,
      contenuBrut:  '',
      contenuHTML:  htmlFinal,           // HTML original ou modifié par l'IA
      contenuFormate: {
        resume:          '',
        objectif:        '',
        correctionsTypes,
      },
      statut:  'en_preparation',
      creePar: req.user._id,
    });

    ok(res, {
      lecon,
      nbExercices:    correctionsTypes.length,
      nbManuels:      exercicesManuels.length,
      nbIA:           exercicesIA_clean.length,
      htmlModifieIA:  !!instructionsHTML,
      correctionsTypes,
    }, 201);
  } catch (e) { err(res, e.message, 500); }
});

// ═══════════════════════════════════════════════════════════════
// POST /api/lecons/creer-manuel
// Crée un cours manuellement avec des blocs structurés (sans Claude)
// Body : { chapitreId, contenuStructure: [{ type, titre, texte, correction, explication }] }
// ═══════════════════════════════════════════════════════════════
router.post('/creer-manuel', roleCheck('admin','prof'), async (req, res) => {
  try {
    const { chapitreId, contenuStructure } = req.body;
    if (!chapitreId) return err(res, 'chapitreId obligatoire');
    if (!Array.isArray(contenuStructure) || contenuStructure.length === 0)
      return err(res, 'contenuStructure[] est requis — ajoute au moins un bloc');

    const chapitre = await Chapitre.findById(chapitreId).populate('matiereId');
    if (!chapitre) return err(res, 'Chapitre introuvable', 404);

    // ── Extraire les exercices pour les stocker dans correctionsTypes ──
    const exercices      = contenuStructure.filter(b => b.type === 'exercice');
    const correctionsTypes = exercices.map(b => ({
      question:    b.texte       || '',
      reponse:     b.correction  || '',
      explication: b.explication || '',
    })).filter(e => e.question.trim().length > 0);

    // ── Construire un résumé textuel à partir des blocs non-exercice ──
    const lignesResume = contenuStructure
      .filter(b => b.type !== 'exercice')
      .map(b => b.texte || b.titre || '')
      .filter(Boolean);
    const resumeTexte = lignesResume.join('\n\n');

    // ── Archiver les anciens brouillons en_preparation ────────────
    await Lecon.updateMany(
      { chapitreId, statut: 'en_preparation' },
      { statut: 'brouillon' }
    );

    // ── Créer la leçon ─────────────────────────────────────────────
    const lecon = await Lecon.create({
      chapitreId,
      titre:          chapitre.titre,
      contenuBrut:    '',
      contenuStructure,
      contenuFormate: {
        resume:          resumeTexte,
        objectif:        '',
        regle:           '',
        exemples:        [],
        pieges:          [],
        resumeMemo:      [],
        correctionsTypes,
      },
      statut:  'en_preparation',
      creePar: req.user._id,
    });

    ok(res, { lecon, nbExercices: correctionsTypes.length, correctionsTypes }, 201);
  } catch (e) { err(res, e.message, 500); }
});

// GET /api/lecons/mes-lecons
router.get('/mes-lecons', roleCheck('admin','prof'), async (req, res) => {
  try {
    const lecons = await Lecon.find({ creePar: req.user._id }).sort({ createdAt: -1 });
    ok(res, lecons);
  } catch (e) { err(res, e.message, 500); }
});

// GET /api/lecons?statut=...&all=true (admin voit tout, sinon filtre masqué)
router.get('/', async (req, res) => {
  try {
    const filtre = {};
    if (req.query.statut) filtre.statut = req.query.statut;
    // Les non-admins ne voient pas les cours masqués
    if (req.user.role !== 'admin' && !req.query.all) {
      filtre.masque = { $ne: true };
    }
    const lecons = await Lecon.find(filtre)
      .populate('chapitreId', 'titre niveau')
      .sort({ createdAt: -1 });
    ok(res, lecons);
  } catch (e) { err(res, e.message, 500); }
});

// GET /api/lecons/admin/tous — admin voit toutes les leçons publiées avec gestion
router.get('/admin/tous', roleCheck('admin'), async (req, res) => {
  try {
    const lecons = await Lecon.find({ statut: 'publie' })
      .populate('chapitreId', 'titre niveau')
      .populate('creePar', 'nom')
      .sort({ createdAt: -1 });
    ok(res, lecons);
  } catch (e) { err(res, e.message, 500); }
});

// PUT /api/lecons/:id/valider
// Publie la leçon : archive toutes les autres leçons publiées du même chapitre,
// puis passe celle-ci à 'publie'. Les élèves voient immédiatement le nouveau contenu.
router.put('/:id/valider', roleCheck('admin','prof'), async (req, res) => {
  try {
    const lecon = await Lecon.findById(req.params.id);
    if (!lecon) return err(res, 'Leçon introuvable', 404);

    // Archiver toutes les leçons précédemment publiées de ce chapitre
    await Lecon.updateMany(
      { chapitreId: lecon.chapitreId, statut: 'publie', _id: { $ne: lecon._id } },
      { statut: 'brouillon' }
    );

    // Publier la nouvelle leçon
    lecon.statut     = 'publie';
    lecon.valideePar = req.user._id;
    lecon.valideeAt  = new Date();
    await lecon.save();

    ok(res, lecon);
  } catch (e) { err(res, e.message, 500); }
});

// PATCH /api/lecons/:id/masquer — masquer/démasquer (admin)
router.patch('/:id/masquer', roleCheck('admin'), async (req, res) => {
  try {
    const lecon = await Lecon.findById(req.params.id);
    if (!lecon) return err(res, 'Leçon introuvable', 404);
    lecon.masque    = !lecon.masque;
    lecon.masquePar = lecon.masque ? req.user._id : null;
    lecon.masqueAt  = lecon.masque ? new Date() : null;
    await lecon.save();
    ok(res, { masque: lecon.masque, message: lecon.masque ? 'Leçon masquée' : 'Leçon visible' });
  } catch (e) { err(res, e.message, 500); }
});

// DELETE /api/lecons/:id  (admin uniquement)
router.delete('/:id', roleCheck('admin'), async (req, res) => {
  try {
    const lecon = await Lecon.findById(req.params.id);
    if (!lecon) return err(res, 'Leçon introuvable', 404);
    await lecon.deleteOne();
    ok(res, { message: 'Leçon supprimée' });
  } catch (e) { err(res, e.message, 500); }
});

// GET /api/lecons/:chapitreId — élève : publiée ET non masquée seulement
router.get('/:chapitreId', async (req, res) => {
  try {
    const filtre = { chapitreId: req.params.chapitreId, statut: 'publie' };
    // Les admins voient tout ; les élèves/profs ne voient pas les cours masqués
    if (req.user.role !== 'admin') filtre.masque = { $ne: true };
    const lecon = await Lecon.findOne(filtre);
    if (!lecon) return err(res, 'Aucune leçon publiée pour ce chapitre', 404);
    ok(res, lecon);
  } catch (e) { err(res, e.message, 500); }
});

module.exports = router;
