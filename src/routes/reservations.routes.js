// ============================================================
// src/routes/reservations.routes.js — Cours particuliers Taté
// ============================================================
const express     = require('express');
const Reservation = require('../models/Reservation');
const User        = require('../models/User');
const { authJWT, roleCheck } = require('../middlewares');

const router = express.Router();
router.use(authJWT);
const ok  = (res, d, s=200) => res.status(s).json({ success:true,  data:d });
const err = (res, m, s=400) => res.status(s).json({ success:false, error:m });

// Forfaits disponibles
const FORFAITS = {
  consultation: { dureeMin: 30,   prix: 0     }, // 1ère consultation GRATUITE
  '1h':         { dureeMin: 60,   prix: 1500  },
  '3h':         { dureeMin: 180,  prix: 4000  },
  '5h':         { dureeMin: 300,  prix: 6000  },
  '10h':        { dureeMin: 600,  prix: 12000 },
  '20h':        { dureeMin: 1200, prix: 22000 },
};

// ─── GET /api/reservations/forfaits ──────────────────────
// Public : liste des forfaits
router.get('/forfaits', (req, res) => {
  ok(res, FORFAITS);
});

// ─── GET /api/reservations ────────────────────────────────
// Mes réservations (élève, prof, parent)
router.get('/', async (req, res) => {
  try {
    let filtre = {};
    if      (req.user.role === 'prof')   filtre = { profId:   req.user._id };
    else if (req.user.role === 'eleve')  filtre = { eleveId:  req.user._id };
    else if (req.user.role === 'parent') filtre = { parentId: req.user._id };
    else if (req.user.role === 'admin')  filtre = {}; // admin voit tout

    const reservations = await Reservation.find(filtre)
      .populate('eleveId',  'nom email niveau')
      .populate('profId',   'nom email matieresCodes')
      .populate('parentId', 'nom email')
      .sort({ createdAt: -1 })
      .limit(50);
    ok(res, reservations);
  } catch (e) { err(res, e.message, 500); }
});

// ─── POST /api/reservations ───────────────────────────────
// Créer une demande de cours particulier (élève)
router.post('/', roleCheck('eleve'), async (req, res) => {
  try {
    const { matiere, sujet, forfait = 'consultation' } = req.body;
    if (!matiere || !sujet) return err(res, 'Matière et description du besoin requis');
    if (!FORFAITS[forfait])  return err(res, 'Forfait invalide');

    const infos = FORFAITS[forfait];
    const estConsultation = forfait === 'consultation';

    // Vérifier si l'élève a déjà eu sa consultation gratuite
    if (estConsultation) {
      const consultExiste = await Reservation.findOne({
        eleveId:              req.user._id,
        premiereConsultation: true,
      });
      if (consultExiste) return err(res, 'Vous avez déjà bénéficié de votre consultation gratuite. Choisissez un forfait payant.');
    }

    // Trouver le parent lié à l'élève
    const eleve = await User.findById(req.user._id);

    const reservation = await Reservation.create({
      eleveId:  req.user._id,
      parentId: eleve.parentId || null,
      matiere,
      niveau:   req.user.niveau || 'Non précisé',
      sujet,
      forfait,
      dureeMin: infos.dureeMin,
      prix:     infos.prix,
      premiereConsultation: estConsultation,
      statut:   'en_attente',
    });

    ok(res, {
      reservation,
      message: estConsultation
        ? 'Consultation gratuite demandée ! Un professeur vous contactera sous 24h pour comprendre vos besoins.'
        : `Demande de ${forfait} enregistrée (${infos.prix} FCFA). Un professeur vous sera assigné.`,
    }, 201);
  } catch (e) { err(res, e.message, 500); }
});

// ─── PATCH /api/reservations/:id/assigner-prof ───────────
// Admin assigne un prof à une réservation
router.patch('/:id/assigner-prof', roleCheck('admin'), async (req, res) => {
  try {
    const { profId } = req.body;
    if (!profId) return err(res, 'profId requis');

    const prof = await User.findOne({ _id: profId, role: 'prof', actif: true });
    if (!prof) return err(res, 'Professeur introuvable');

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { profId, statut: 'consultation_planifiee' },
      { new: true }
    ).populate('eleveId', 'nom niveau').populate('profId', 'nom email');

    if (!reservation) return err(res, 'Réservation introuvable', 404);
    ok(res, { reservation, message: `Professeur ${prof.nom} assigné avec succès.` });
  } catch (e) { err(res, e.message, 500); }
});

// ─── PATCH /api/reservations/:id/preparer-cours ──────────
// Prof prépare le cours particulier + génère le lien Jitsi
router.patch('/:id/preparer-cours', roleCheck('prof'), async (req, res) => {
  try {
    const { titre, objectif, contenu, planSeance, ressources, dateDebut } = req.body;
    if (!titre || !contenu) return err(res, 'Titre et contenu du cours requis');

    const reservation = await Reservation.findOne({ _id: req.params.id, profId: req.user._id });
    if (!reservation) return err(res, 'Réservation introuvable', 404);

    // Générer le lien Jitsi automatiquement
    reservation.genererLienVisio();

    reservation.coursPrepare = {
      titre,
      objectif:   objectif   || '',
      contenu,
      planSeance: planSeance || '',
      ressources: ressources || [],
      prepareAt:  new Date(),
    };
    reservation.statut   = 'cours_prepare';
    reservation.dateDebut = dateDebut ? new Date(dateDebut) : null;
    await reservation.save();

    ok(res, {
      reservation,
      lienVisio: reservation.lienVisio,
      message: 'Cours préparé ! Le lien de visioconférence a été généré et transmis à l\'élève.',
    });
  } catch (e) { err(res, e.message, 500); }
});

// ─── PATCH /api/reservations/:id/planifier ───────────────
// Prof planifie la date de la séance
router.patch('/:id/planifier', roleCheck('prof'), async (req, res) => {
  try {
    const { dateDebut } = req.body;
    if (!dateDebut) return err(res, 'Date de début requise');

    const reservation = await Reservation.findOne({ _id: req.params.id, profId: req.user._id });
    if (!reservation) return err(res, 'Réservation introuvable', 404);

    reservation.dateDebut = new Date(dateDebut);
    reservation.dateFin   = new Date(new Date(dateDebut).getTime() + reservation.dureeMin * 60 * 1000);
    reservation.statut    = 'confirme';

    // Générer lien Jitsi si pas encore fait
    if (!reservation.lienVisio) reservation.genererLienVisio();
    await reservation.save();

    ok(res, { reservation, lienVisio: reservation.lienVisio });
  } catch (e) { err(res, e.message, 500); }
});

// ─── POST /api/reservations/:id/payer ────────────────────
// Initier le paiement (élève)
router.post('/:id/payer', roleCheck('eleve'), async (req, res) => {
  try {
    const { methode } = req.body; // wave | orange_money | carte
    if (!['wave','orange_money','carte'].includes(methode))
      return err(res, 'Méthode de paiement invalide (wave, orange_money, carte)');

    const reservation = await Reservation.findOne({ _id: req.params.id, eleveId: req.user._id });
    if (!reservation) return err(res, 'Réservation introuvable', 404);
    if (reservation.prix === 0) return err(res, 'Cette consultation est gratuite');

    const reference = `TATE-${Date.now()}-${Math.random().toString(36).substr(2,6).toUpperCase()}`;
    reservation.paiement = { methode, statut:'en_attente', reference };
    await reservation.save();

    // Instructions selon la méthode
    const instructions = {
      wave:         `Ouvre ton app Wave → Payer un marchand → Code TATE → Référence ${reference} → Montant ${reservation.prix} FCFA`,
      orange_money: `Compose le *144# → Paiements → Référence marchande → Entre ${reference} pour ${reservation.prix} FCFA`,
      carte:        `Tu vas être redirigé vers le paiement sécurisé par carte pour ${reservation.prix} FCFA`,
    };

    ok(res, {
      reference,
      montant:     reservation.prix,
      methode,
      instruction: instructions[methode],
      forfait:     reservation.forfait,
    });
  } catch (e) { err(res, e.message, 500); }
});

// ─── POST /api/reservations/:id/confirmer-paiement ───────
// Webhook ou confirmation admin
router.post('/:id/confirmer-paiement', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('eleveId', 'nom email')
      .populate('profId',  'nom email');
    if (!reservation) return err(res, 'Réservation introuvable', 404);

    reservation.paiement.statut = 'valide';
    reservation.paiement.payeAt = new Date();
    reservation.statut = 'confirme';
    await reservation.save();

    ok(res, {
      message:   'Paiement confirmé ! La séance est réservée.',
      reservation,
      lienVisio: reservation.lienVisio,
    });
  } catch (e) { err(res, e.message, 500); }
});

// ─── PATCH /api/reservations/:id/planifier-admin ─────────
// Admin valide le cours préparé et programme les dates de séance
router.patch('/:id/planifier-admin', roleCheck('admin'), async (req, res) => {
  try {
    const { dateDebut, dateFin, notes } = req.body;
    if (!dateDebut) return err(res, 'Date de début requise');

    const reservation = await Reservation.findById(req.params.id)
      .populate('eleveId', 'nom email niveau')
      .populate('profId',  'nom email');
    if (!reservation) return err(res, 'Réservation introuvable', 404);

    // Générer ou conserver le lien Jitsi
    if (!reservation.lienVisio) reservation.genererLienVisio();

    reservation.dateDebut = new Date(dateDebut);
    reservation.dateFin   = dateFin
      ? new Date(dateFin)
      : new Date(new Date(dateDebut).getTime() + reservation.dureeMin * 60 * 1000);
    reservation.statut = 'confirme';
    if (notes) reservation.notes = notes;
    await reservation.save();

    ok(res, {
      reservation,
      lienVisio: reservation.lienVisio,
      message:   `Séance planifiée le ${new Date(dateDebut).toLocaleString('fr-FR')}. Lien Jitsi transmis à l'élève et au professeur.`,
    });
  } catch (e) { err(res, e.message, 500); }
});

// ─── PATCH /api/reservations/:id/terminer ────────────────
router.patch('/:id/terminer', roleCheck('prof'), async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, profId: req.user._id },
      { statut: 'termine' },
      { new: true }
    );
    if (!reservation) return err(res, 'Réservation introuvable', 404);
    ok(res, reservation);
  } catch (e) { err(res, e.message, 500); }
});

// ─── DELETE /api/reservations/:id ────────────────────────
// Annuler (élève, si encore en attente)
router.delete('/:id', async (req, res) => {
  try {
    const filtre = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, eleveId: req.user._id, statut: { $in: ['en_attente','consultation_planifiee'] } };

    const reservation = await Reservation.findOne(filtre);
    if (!reservation) return err(res, 'Réservation introuvable ou non annulable', 404);
    reservation.statut = 'annule';
    await reservation.save();
    ok(res, { message: 'Réservation annulée.' });
  } catch (e) { err(res, e.message, 500); }
});

module.exports = router;
