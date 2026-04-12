// ============================================================
// src/routes/sessions-virtuelles.routes.js
// Cours en ligne groupés (Zoom/Meet) — admin/prof crée, élèves rejoignent
// ============================================================
const express          = require('express');
const SessionVirtuelle = require('../models/SessionVirtuelle');
const User             = require('../models/User');
const { authJWT, roleCheck } = require('../middlewares');

const router = express.Router();
router.use(authJWT);
const ok  = (res, d, s=200) => res.status(s).json({ success:true, data:d });
const err = (res, m, s=400) => res.status(s).json({ success:false, error:m });

// ─── GET /api/sessions-virtuelles ────────────────────────────
// Élève : ses sessions (invité + ouvertATous)
// Admin/prof : toutes les sessions
router.get('/', async (req, res) => {
  try {
    let filtre = {};
    if (req.user.role === 'eleve') {
      // L'élève voit les sessions où il est invité OU ouvertes à tous
      filtre = {
        statut: { $in: ['planifiee', 'en_cours'] },
        $or: [
          { eleves: req.user._id },
          { ouvertATous: true },
          { niveauxCibles: { $in: [req.user.niveau, ''] } },
        ],
      };
    }
    const sessions = await SessionVirtuelle.find(filtre)
      .populate('animateur', 'nom email')
      .populate('eleves', 'nom niveau')
      .populate('creePar', 'nom')
      .sort({ dateHeure: 1 })
      .limit(50);
    ok(res, sessions);
  } catch (e) { err(res, e.message, 500); }
});

// ─── GET /api/sessions-virtuelles/toutes ─────────────────────
// Admin/prof : toutes les sessions avec historique
router.get('/toutes', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const sessions = await SessionVirtuelle.find()
      .populate('animateur', 'nom email')
      .populate('eleves', 'nom niveau email')
      .populate('creePar', 'nom')
      .sort({ dateHeure: -1 })
      .limit(100);
    ok(res, sessions);
  } catch (e) { err(res, e.message, 500); }
});

// ─── POST /api/sessions-virtuelles ───────────────────────────
// Admin/prof crée une session
router.post('/', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const {
      titre, description, matiere, niveau,
      dateHeure, dureeMin, plateforme, lienSession, motDePasse, idReunion,
      elevesIds, niveauxCibles, ouvertATous, notes,
    } = req.body;

    if (!titre)       return err(res, 'Le titre est obligatoire');
    if (!lienSession) return err(res, 'Le lien de session est obligatoire');
    if (!dateHeure)   return err(res, 'La date et heure sont obligatoires');

    const session = await SessionVirtuelle.create({
      titre:      titre.trim(),
      description: description || '',
      matiere:    matiere || '',
      niveau:     niveau || '',
      dateHeure:  new Date(dateHeure),
      dureeMin:   dureeMin || 60,
      plateforme: plateforme || 'zoom',
      lienSession: lienSession.trim(),
      motDePasse: motDePasse || '',
      idReunion:  idReunion || '',
      animateur:  req.user._id,
      eleves:     Array.isArray(elevesIds) ? elevesIds : [],
      niveauxCibles: Array.isArray(niveauxCibles) ? niveauxCibles : [],
      ouvertATous: !!ouvertATous,
      creePar:    req.user._id,
      notes:      notes || '',
    });

    const sessionPeuplee = await SessionVirtuelle.findById(session._id)
      .populate('animateur', 'nom email')
      .populate('eleves', 'nom niveau');

    ok(res, sessionPeuplee, 201);
  } catch (e) { err(res, e.message, 500); }
});

// ─── PATCH /api/sessions-virtuelles/:id ──────────────────────
// Admin/prof modifie une session
router.patch('/:id', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const session = await SessionVirtuelle.findById(req.params.id);
    if (!session) return err(res, 'Session introuvable', 404);

    const champs = ['titre','description','matiere','niveau','dateHeure','dureeMin',
                    'plateforme','lienSession','motDePasse','idReunion','niveauxCibles',
                    'ouvertATous','statut','notes'];
    for (const c of champs) {
      if (req.body[c] !== undefined) session[c] = req.body[c];
    }
    if (req.body.elevesIds !== undefined) {
      session.eleves = Array.isArray(req.body.elevesIds) ? req.body.elevesIds : [];
    }
    await session.save();

    const sessionPeuplee = await SessionVirtuelle.findById(session._id)
      .populate('animateur', 'nom email')
      .populate('eleves', 'nom niveau');
    ok(res, sessionPeuplee);
  } catch (e) { err(res, e.message, 500); }
});

// ─── POST /api/sessions-virtuelles/:id/inviter ───────────────
// Ajouter des élèves à une session
router.post('/:id/inviter', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const session = await SessionVirtuelle.findById(req.params.id);
    if (!session) return err(res, 'Session introuvable', 404);
    const { elevesIds } = req.body;
    if (!Array.isArray(elevesIds)) return err(res, 'elevesIds[] requis');

    // Ajouter sans doublons
    const existants = session.eleves.map(String);
    const nouveaux  = elevesIds.filter(id => !existants.includes(String(id)));
    session.eleves.push(...nouveaux);
    await session.save();
    ok(res, { message: `${nouveaux.length} élève(s) invité(s)`, total: session.eleves.length });
  } catch (e) { err(res, e.message, 500); }
});

// ─── DELETE /api/sessions-virtuelles/:id ─────────────────────
// Admin supprime une session (ou annule)
router.delete('/:id', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const session = await SessionVirtuelle.findById(req.params.id);
    if (!session) return err(res, 'Session introuvable', 404);

    // Si déjà planifiée → annuler plutôt que supprimer
    if (session.statut === 'planifiee') {
      session.statut = 'annulee';
      await session.save();
      return ok(res, { message: 'Session annulée' });
    }
    await session.deleteOne();
    ok(res, { message: 'Session supprimée' });
  } catch (e) { err(res, e.message, 500); }
});

module.exports = router;
