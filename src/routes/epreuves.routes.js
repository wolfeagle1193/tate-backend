// ============================================================
// src/routes/epreuves.routes.js — Épreuves BFEM & BAC Sénégal
// ============================================================
const express  = require('express');
const Epreuve  = require('../models/Epreuve');
const { authJWT, roleCheck } = require('../middlewares');

const router = express.Router();
router.use(authJWT);
const ok  = (res, d, s=200) => res.status(s).json({ success:true, data:d });
const err = (res, m, s=400) => res.status(s).json({ success:false, error:m });

// ── GET /api/epreuves ─────────────────────────────────────────
// Lister les épreuves publiées (élève/parent/prof) ou toutes (admin)
router.get('/', async (req, res) => {
  try {
    const { type, niveau, matiere, annee } = req.query;
    const filtre = {};
    if (req.user.role !== 'admin') filtre.publie = true; // non-admin ne voit que les publiées
    if (type)    filtre.type    = type;
    if (niveau)  filtre.niveau  = niveau;
    if (matiere) filtre.matiere = matiere;
    if (annee)   filtre.annee   = parseInt(annee);

    const epreuves = await Epreuve.find(filtre)
      .select('type matiere niveau annee session titre duree coefficient publie createdAt questions')
      .sort({ annee: -1, matiere: 1 });

    // Pour les élèves : on ne retourne PAS les corrections dans la liste
    const data = epreuves.map(ep => {
      const obj = ep.toObject();
      if (req.user.role !== 'admin') {
        obj.questions = obj.questions.map(q => ({
          ...q,
          correction: undefined,         // masquée, l'élève doit faire l'effort
          sousQuestions: (q.sousQuestions || []).map(sq => ({ ...sq, correction: undefined })),
        }));
      }
      return obj;
    });

    ok(res, data);
  } catch (e) { err(res, e.message, 500); }
});

// ── GET /api/epreuves/:id ─────────────────────────────────────
// Détail d'une épreuve — corrections accessibles via query ?corrections=true
router.get('/:id', async (req, res) => {
  try {
    const epreuve = await Epreuve.findById(req.params.id);
    if (!epreuve) return err(res, 'Épreuve introuvable', 404);
    if (!epreuve.publie && req.user.role !== 'admin') {
      return err(res, 'Épreuve non disponible', 403);
    }

    const obj = epreuve.toObject();
    // Corrections disponibles uniquement si ?corrections=true ET (premium OU admin)
    const voirCorrections = req.query.corrections === 'true';
    const estPremium = req.user.abonnement === 'premium'
      && req.user.abonnementExpiry
      && new Date(req.user.abonnementExpiry) > new Date();

    if (!voirCorrections || (!estPremium && req.user.role !== 'admin' && req.user.role !== 'prof')) {
      obj.questions = obj.questions.map(q => ({
        ...q,
        correction: null,
        sousQuestions: (q.sousQuestions || []).map(sq => ({ ...sq, correction: null })),
      }));
    }
    ok(res, obj);
  } catch (e) { err(res, e.message, 500); }
});

// ── POST /api/epreuves ────────────────────────────────────────
// Créer une nouvelle épreuve (admin uniquement)
router.post('/', roleCheck('admin'), async (req, res) => {
  try {
    const { type, matiere, niveau, annee, session, titre, duree, coefficient, enonce, questions } = req.body;
    if (!['BFEM','BAC'].includes(type))          return err(res, 'type doit être BFEM ou BAC');
    if (!['3eme','Terminale'].includes(niveau))   return err(res, 'niveau doit être 3eme ou Terminale');
    if (!matiere || !annee)                       return err(res, 'matiere et annee sont requis');

    const epreuve = await Epreuve.create({
      type, matiere, niveau, annee,
      session:     session     || 'Normale',
      titre:       titre       || '',
      duree:       duree       || '',
      coefficient: coefficient || 1,
      enonce:      enonce      || '',
      questions:   questions   || [],
      publie:      false,
      creePar:     req.user._id,
    });
    ok(res, epreuve, 201);
  } catch (e) { err(res, e.message, 500); }
});

// ── PUT /api/epreuves/:id ─────────────────────────────────────
// Mettre à jour une épreuve (admin)
router.put('/:id', roleCheck('admin'), async (req, res) => {
  try {
    const autorise = ['type','matiere','niveau','annee','session','titre','duree',
                      'coefficient','enonce','questions','publie'];
    const update = {};
    autorise.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

    const epreuve = await Epreuve.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!epreuve) return err(res, 'Épreuve introuvable', 404);
    ok(res, epreuve);
  } catch (e) { err(res, e.message, 500); }
});

// ── DELETE /api/epreuves/:id ──────────────────────────────────
// Supprimer une épreuve (admin)
router.delete('/:id', roleCheck('admin'), async (req, res) => {
  try {
    await Epreuve.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Épreuve supprimée' });
  } catch (e) { err(res, e.message, 500); }
});

// ── PATCH /api/epreuves/:id/publier ──────────────────────────
// Publier / dépublier une épreuve (admin)
router.patch('/:id/publier', roleCheck('admin'), async (req, res) => {
  try {
    const epreuve = await Epreuve.findById(req.params.id);
    if (!epreuve) return err(res, 'Épreuve introuvable', 404);
    epreuve.publie = !epreuve.publie;
    await epreuve.save();
    ok(res, { publie: epreuve.publie, message: epreuve.publie ? 'Épreuve publiée' : 'Épreuve dépubliée' });
  } catch (e) { err(res, e.message, 500); }
});

module.exports = router;
