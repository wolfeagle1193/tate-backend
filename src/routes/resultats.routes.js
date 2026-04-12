// ============================================================
// src/routes/resultats.routes.js
// Enregistrement et consultation des résultats QCM des élèves
// ============================================================
const express     = require('express');
const Resultat    = require('../models/Resultat');
const Chapitre    = require('../models/Chapitre');
const Lecon       = require('../models/Lecon');
const User        = require('../models/User');
const Notification = require('../models/Notification');
const { authJWT, roleCheck } = require('../middlewares');

const router = express.Router();
router.use(authJWT);

const ok  = (res, d, s = 200) => res.status(s).json({ success: true,  data: d });
const err = (res, m, s = 400) => res.status(s).json({ success: false, error: m });

// ─────────────────────────────────────────────────────────────
// POST /api/resultats/soumettre
// L'élève soumet son score (calculé côté client depuis le HTML)
// ─────────────────────────────────────────────────────────────
router.post('/soumettre', roleCheck('eleve'), async (req, res) => {
  try {
    const { chapitreId, leconId, score, nbCorrectes, nbTotal } = req.body;

    if (!chapitreId || !leconId || score === undefined || !nbTotal)
      return err(res, 'chapitreId, leconId, score et nbTotal sont requis');

    const eleveId = req.user._id;
    const maitrise = score >= 80;

    // Compter combien de tentatives l'élève a déjà faites sur ce chapitre
    const nbTentativesPrecedentes = await Resultat.countDocuments({ eleveId, chapitreId });
    const tentative = nbTentativesPrecedentes + 1;

    // Sauvegarder le résultat
    const resultat = await Resultat.create({
      eleveId, chapitreId, leconId,
      score, nbCorrectes, nbTotal,
      tentative, maitrise,
    });

    // Marquer le chapitre comme validé dans le profil de l'élève si score >= 80
    if (maitrise) {
      await User.findByIdAndUpdate(eleveId, {
        $addToSet: {
          chapitresValides: {
            chapitreId,
            scoreFinal: score,
            valideAt:   new Date(),
          },
        },
      });
    }

    // ── Notifications asynchrones (ne bloquent pas la réponse) ──
    notifierResultat({ eleveId, chapitreId, leconId, score, maitrise, tentative }).catch(() => {});

    ok(res, { resultat, maitrise, tentative });
  } catch (e) {
    err(res, e.message, 500);
  }
});

// ─────────────────────────────────────────────────────────────
// Fonction interne : créer les notifications
// ─────────────────────────────────────────────────────────────
async function notifierResultat({ eleveId, chapitreId, score, maitrise, tentative }) {
  try {
    const eleve    = await User.findById(eleveId).select('nom prenom parentId');
    const chapitre = await Chapitre.findById(chapitreId).select('titre');
    const admins   = await User.find({ role: 'admin', actif: true }).select('_id');

    const eleveNom    = `${eleve?.prenom || ''} ${eleve?.nom || ''}`.trim() || 'Un élève';
    const chapitreNom = chapitre?.titre || 'Chapitre';
    const emoji = maitrise ? '⭐' : score >= 60 ? '📊' : '⚠️';

    const notifs = [];

    // Notification élève
    notifs.push({
      destinataireId: eleveId,
      type:    maitrise ? 'qcm_maitrise' : 'qcm_resultat',
      titre:   maitrise ? `${emoji} Bravo ! Chapitre maîtrisé !` : `${emoji} Résultat : ${score}%`,
      message: maitrise
        ? `Tu as obtenu ${score}% au QCM "${chapitreNom}". Excellent travail !`
        : `Tu as obtenu ${score}% au QCM "${chapitreNom}". Il faut au moins 80% pour valider. Réessaie !`,
      eleveId, eleveNom, chapitreId, chapitreNom, score,
    });

    // Notifications admins
    const adminIds = new Set();
    for (const admin of admins) {
      adminIds.add(String(admin._id));
      notifs.push({
        destinataireId: admin._id,
        type:    maitrise ? 'qcm_maitrise' : score < 60 ? 'qcm_difficulte' : 'qcm_resultat',
        titre:   `📋 Résultat QCM : ${eleveNom}`,
        message: `${eleveNom} — "${chapitreNom}" : ${score}% (tentative n°${tentative})${maitrise ? ' ✅ Maîtrisé' : ''}`,
        eleveId, eleveNom, chapitreId, chapitreNom, score,
      });
    }

    // Notification parent
    if (eleve?.parentId) {
      notifs.push({
        destinataireId: eleve.parentId,
        type:    maitrise ? 'qcm_maitrise' : 'qcm_resultat',
        titre:   `📋 Résultat de ${eleveNom}`,
        message: `${eleveNom} a obtenu ${score}% au QCM "${chapitreNom}"${maitrise ? ' — Maîtrisé ✅' : `. Tentative n°${tentative}`}.`,
        eleveId, eleveNom, chapitreId, chapitreNom, score,
      });
    }

    if (notifs.length > 0) await Notification.insertMany(notifs);
  } catch (e) {
    console.error('⚠️ Erreur notifications résultat:', e.message);
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/resultats/mes-resultats   (élève : ses propres résultats)
// ─────────────────────────────────────────────────────────────
router.get('/mes-resultats', roleCheck('eleve'), async (req, res) => {
  try {
    const resultats = await Resultat.find({ eleveId: req.user._id })
      .populate('chapitreId', 'titre niveau matiereId')
      .sort({ completedAt: -1 });
    ok(res, resultats);
  } catch (e) { err(res, e.message, 500); }
});

// ─────────────────────────────────────────────────────────────
// GET /api/resultats   (admin/prof : tous les résultats filtrables)
// Query params : eleveId, chapitreId, maitrise, depuis
// ─────────────────────────────────────────────────────────────
router.get('/', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const filtre = {};
    if (req.query.eleveId)   filtre.eleveId   = req.query.eleveId;
    if (req.query.chapitreId) filtre.chapitreId = req.query.chapitreId;
    if (req.query.maitrise !== undefined) filtre.maitrise = req.query.maitrise === 'true';
    if (req.query.depuis) filtre.completedAt = { $gte: new Date(req.query.depuis) };

    const resultats = await Resultat.find(filtre)
      .populate('eleveId',    'nom prenom niveau email')
      .populate('chapitreId', 'titre niveau matiereId')
      .sort({ completedAt: -1 })
      .limit(200);

    ok(res, resultats);
  } catch (e) { err(res, e.message, 500); }
});

// ─────────────────────────────────────────────────────────────
// GET /api/resultats/chapitre/:chapitreId   (résultats d'un chapitre)
// ─────────────────────────────────────────────────────────────
router.get('/chapitre/:chapitreId', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const resultats = await Resultat.find({ chapitreId: req.params.chapitreId })
      .populate('eleveId', 'nom prenom niveau email')
      .sort({ score: -1, completedAt: -1 });
    ok(res, resultats);
  } catch (e) { err(res, e.message, 500); }
});

// ─────────────────────────────────────────────────────────────
// GET /api/resultats/eleve/:eleveId   (résultats d'un élève)
// ─────────────────────────────────────────────────────────────
router.get('/eleve/:eleveId', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const resultats = await Resultat.find({ eleveId: req.params.eleveId })
      .populate('chapitreId', 'titre niveau matiereId')
      .sort({ completedAt: -1 });
    ok(res, resultats);
  } catch (e) { err(res, e.message, 500); }
});

module.exports = router;
