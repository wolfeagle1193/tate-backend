// ============================================================
// src/routes/entrainements.routes.js — Exercices d'entraînement
// ============================================================
const express       = require('express');
const Entrainement  = require('../models/Entrainement');
const { authJWT, roleCheck } = require('../middlewares');

const router = express.Router();
router.use(authJWT);

const ok  = (res, d, s=200) => res.status(s).json({ success:true, data:d });
const err = (res, m, s=400) => res.status(s).json({ success:false, error:m });

// ── GET /api/entrainements ─────────────────────────────────────
// Lister les entraînements publiés, filtrés par niveau / matière / section
router.get('/', async (req, res) => {
  try {
    const { niveau, matiere, section } = req.query;
    const filtre = {};
    if (req.user.role !== 'admin') filtre.publie = true;
    if (niveau)  filtre.niveau  = niveau;
    if (matiere) filtre.matiere = matiere;
    if (section) filtre.section = section;

    const items = await Entrainement.find(filtre)
      .select('titre chapitre section ordre source nbExercices publie createdAt')
      .sort({ ordre: 1 });

    ok(res, items);
  } catch (e) { err(res, e.message, 500); }
});

// ── GET /api/entrainements/:id ─────────────────────────────────
// Détail d'un entraînement — correction accessible si premium / prof / admin
router.get('/:id', async (req, res) => {
  try {
    const item = await Entrainement.findById(req.params.id);
    if (!item) return err(res, 'Entraînement introuvable', 404);
    if (!item.publie && req.user.role !== 'admin') {
      return err(res, 'Entraînement non disponible', 403);
    }

    const obj = item.toObject();

    // Déterminer si l'utilisateur peut voir les corrections
    const voirCorrections = req.query.corrections === 'true';
    const isPremium = req.user.abonnement === 'premium';
    const isProf    = ['prof', 'admin'].includes(req.user.role);

    if (!voirCorrections || (!isPremium && !isProf)) {
      obj.correctionHTML = null;  // masquée
    }

    ok(res, obj);
  } catch (e) { err(res, e.message, 500); }
});

// ── POST /api/entrainements ────────────────────────────────────
// Créer un entraînement (admin uniquement)
router.post('/', roleCheck('admin'), async (req, res) => {
  try {
    const {
      matiere, niveau, section, chapitre, ordre, titre, source,
      nbExercices, contenuHTML, correctionHTML,
    } = req.body;
    if (!matiere || !niveau || !chapitre) {
      return err(res, 'matiere, niveau et chapitre sont requis');
    }
    const item = await Entrainement.create({
      matiere, niveau,
      section:     section     || '',
      chapitre,
      ordre:       ordre       ?? 99,
      titre:       titre       || '',
      source:      source      || '',
      nbExercices: nbExercices || 0,
      contenuHTML:    contenuHTML    || '',
      correctionHTML: correctionHTML || '',
      publie:  false,
      creePar: req.user._id,
    });
    ok(res, item, 201);
  } catch (e) { err(res, e.message, 500); }
});

// ── PUT /api/entrainements/:id ─────────────────────────────────
router.put('/:id', roleCheck('admin'), async (req, res) => {
  try {
    const champs = [
      'matiere','niveau','section','chapitre','ordre','titre','source',
      'nbExercices','contenuHTML','correctionHTML','publie',
    ];
    const update = {};
    champs.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const item = await Entrainement.findByIdAndUpdate(
      req.params.id, update, { new: true, runValidators: true }
    );
    if (!item) return err(res, 'Entraînement introuvable', 404);
    ok(res, item);
  } catch (e) { err(res, e.message, 500); }
});

// ── DELETE /api/entrainements/:id ─────────────────────────────
router.delete('/:id', roleCheck('admin'), async (req, res) => {
  try {
    await Entrainement.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Entraînement supprimé' });
  } catch (e) { err(res, e.message, 500); }
});

// ── PATCH /api/entrainements/:id/publier ──────────────────────
router.patch('/:id/publier', roleCheck('admin'), async (req, res) => {
  try {
    const item = await Entrainement.findById(req.params.id);
    if (!item) return err(res, 'Entraînement introuvable', 404);
    item.publie = !item.publie;
    await item.save();
    ok(res, { publie: item.publie });
  } catch (e) { err(res, e.message, 500); }
});

module.exports = router;
