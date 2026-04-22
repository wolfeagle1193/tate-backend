// ============================================================
// src/routes/planning.routes.js
// Planification des cours/exercices par l'admin pour les élèves
// ============================================================
const express        = require('express');
const PlanningCours  = require('../models/PlanningCours');
const Notification   = require('../models/Notification');
const Chapitre       = require('../models/Chapitre');
const User           = require('../models/User');
const { authJWT, roleCheck } = require('../middlewares');

const router = express.Router();
router.use(authJWT);

const ok  = (res, d, s = 200) => res.status(s).json({ success: true,  data: d });
const err = (res, m, s = 400) => res.status(s).json({ success: false, error: m });

// ─────────────────────────────────────────────────────────────
// POST /api/planning  — Admin programme un devoir pour un élève
// ─────────────────────────────────────────────────────────────
router.post('/', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const { eleveId, chapitreId, leconId, type, titre, noteAdmin, dateProgrammee } = req.body;
    if (!eleveId || !chapitreId || !dateProgrammee)
      return err(res, 'eleveId, chapitreId et dateProgrammee sont requis');

    const plan = await PlanningCours.create({
      eleveId, chapitreId, leconId: leconId || null,
      adminId: req.user._id,
      type: type || 'exercice',
      titre: titre || '',
      noteAdmin: noteAdmin || '',
      dateProgrammee: new Date(dateProgrammee),
    });

    // Notification immédiate pour l'élève
    const chapitre  = await Chapitre.findById(chapitreId).select('titre');
    const eleve     = await User.findById(eleveId).select('nom prenom');
    const typeLabel = type === 'cours' ? 'cours' : type === 'revision' ? 'révision' : 'exercice';
    const dateStr   = new Date(dateProgrammee).toLocaleDateString('fr-SN', { day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' });

    await Notification.create({
      destinataireId: eleveId,
      type:    'planning_nouveau',
      titre:   `📅 Nouveau devoir programmé`,
      message: `Ton professeur t'a programmé un ${typeLabel} : "${chapitre?.titre || chapitreId}" pour le ${dateStr}${noteAdmin ? `. Message : "${noteAdmin}"` : ''}`,
      eleveId, chapitreId,
      chapitreNom: chapitre?.titre,
    });

    ok(res, plan, 201);
  } catch (e) { err(res, e.message, 500); }
});

// ─────────────────────────────────────────────────────────────
// GET /api/planning  — Admin voit les plannings (filtrables par élève)
// ─────────────────────────────────────────────────────────────
router.get('/', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const filtre = {};
    if (req.query.eleveId)  filtre.eleveId  = req.query.eleveId;
    if (req.query.statut)   filtre.statut   = req.query.statut;

    const plans = await PlanningCours.find(filtre)
      .populate('eleveId',    'nom prenom niveau')
      .populate('chapitreId', 'titre niveau matiereId')
      .sort({ dateProgrammee: -1 })
      .limit(100);

    ok(res, plans);
  } catch (e) { err(res, e.message, 500); }
});

// ─────────────────────────────────────────────────────────────
// GET /api/planning/mes-devoirs  — Élève voit ses propres plannings
// ─────────────────────────────────────────────────────────────
router.get('/mes-devoirs', roleCheck('eleve'), async (req, res) => {
  try {
    const plans = await PlanningCours.find({ eleveId: req.user._id })
      .populate({ path: 'chapitreId', select: 'titre niveau matiereId', populate: { path: 'matiereId', select: 'code nom' } })
      .sort({ dateProgrammee: 1 })
      .limit(20);
    ok(res, plans);
  } catch (e) { err(res, e.message, 500); }
});

// ─────────────────────────────────────────────────────────────
// GET /api/planning/verifier-rappels  — Vérifie les rappels à envoyer
// Appelé par le frontend élève à chaque chargement de l'app
// ─────────────────────────────────────────────────────────────
router.get('/verifier-rappels', roleCheck('eleve'), async (req, res) => {
  try {
    const eleveId  = req.user._id;
    const maintenant = new Date();
    const demain     = new Date(maintenant.getTime() + 24 * 60 * 60 * 1000);

    // Plans en attente pour cet élève
    const plans = await PlanningCours.find({
      eleveId,
      statut: { $in: ['en_attente', 'en_cours'] },
    }).populate('chapitreId', 'titre');

    const notifsAAjouter = [];

    for (const p of plans) {
      const dateP    = new Date(p.dateProgrammee);
      const depasse  = dateP < maintenant;
      const demainJ  = dateP < demain && dateP > maintenant;
      const chapNom  = p.chapitreId?.titre || 'Chapitre';
      const typeLabel = p.type === 'cours' ? 'cours' : p.type === 'revision' ? 'révision' : 'exercice';
      const dateStr   = dateP.toLocaleDateString('fr-SN', { day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' });

      if (depasse && !p.rappelRetard) {
        notifsAAjouter.push({
          destinataireId: eleveId,
          type:    'planning_retard',
          titre:   `⚠️ Devoir en retard !`,
          message: `Tu n'as pas encore fait ton ${typeLabel} "${chapNom}" prévu pour le ${dateStr}. Fais-le maintenant !`,
          chapitreId: p.chapitreId?._id,
          chapitreNom: chapNom,
        });
        await PlanningCours.findByIdAndUpdate(p._id, { rappelRetard: true });
      } else if (demainJ && !p.rappelUrgent) {
        notifsAAjouter.push({
          destinataireId: eleveId,
          type:    'planning_rappel',
          titre:   `🔔 Rappel : devoir pour aujourd'hui`,
          message: `N'oublie pas ton ${typeLabel} "${chapNom}" prévu pour ${dateStr}.`,
          chapitreId: p.chapitreId?._id,
          chapitreNom: chapNom,
        });
        await PlanningCours.findByIdAndUpdate(p._id, { rappelUrgent: true });
      }
    }

    if (notifsAAjouter.length > 0) {
      await Notification.insertMany(notifsAAjouter, { ordered: false }).catch(() => {});
    }

    ok(res, { rappelsEnvoyes: notifsAAjouter.length, plans: plans.length });
  } catch (e) { err(res, e.message, 500); }
});

// ─────────────────────────────────────────────────────────────
// PUT /api/planning/:id  — Admin modifie un planning
// ─────────────────────────────────────────────────────────────
router.put('/:id', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const plan = await PlanningCours.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return err(res, 'Planning introuvable', 404);
    ok(res, plan);
  } catch (e) { err(res, e.message, 500); }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/planning/:id  — Admin supprime un planning
// ─────────────────────────────────────────────────────────────
router.delete('/:id', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    await PlanningCours.findByIdAndDelete(req.params.id);
    ok(res, { message: 'Supprimé' });
  } catch (e) { err(res, e.message, 500); }
});

module.exports = router;
