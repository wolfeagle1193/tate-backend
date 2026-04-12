// ============================================================
// src/models/Reservation.js — Cours particuliers Taté
// ============================================================
const mongoose = require('mongoose');

// Forfaits disponibles
const FORFAITS = [
  { code: '1h',  dureeMin: 60,   prix: 1500  },
  { code: '3h',  dureeMin: 180,  prix: 4000  },
  { code: '5h',  dureeMin: 300,  prix: 6000  },
  { code: '10h', dureeMin: 600,  prix: 12000 },
  { code: '20h', dureeMin: 1200, prix: 22000 },
];

const reservationSchema = new mongoose.Schema({
  eleveId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  // ── Détails de la demande ─────────────────────
  matiere:  { type: String, required: true },
  niveau:   { type: String, required: true },
  sujet:    { type: String, required: true }, // Besoin décrit par l'élève

  // ── Forfait choisi ────────────────────────────
  forfait:  { type: String, enum: ['1h','3h','5h','10h','20h','consultation'], default: '1h' },
  dureeMin: { type: Number, default: 60 },  // en minutes
  prix:     { type: Number, default: 0 },   // 0 = consultation gratuite

  // ── Première consultation gratuite ───────────
  // La 1ère consultation sert à comprendre les besoins → gratuite
  premiereConsultation: { type: Boolean, default: false },

  // ── Planning ──────────────────────────────────
  dateDebut:  { type: Date, default: null },
  dateFin:    { type: Date, default: null },

  // ── Statut ────────────────────────────────────
  statut: {
    type: String,
    enum: ['en_attente','consultation_planifiee','cours_prepare','confirme','en_cours','termine','annule'],
    default: 'en_attente',
  },

  // ── Cours particulier préparé par le prof ─────
  coursPrepare: {
    titre:     { type: String, default: '' },
    objectif:  { type: String, default: '' },
    contenu:   { type: String, default: '' }, // Le fond : contenu pédagogique
    planSeance: { type: String, default: '' }, // La forme : déroulé de la séance
    ressources: [{ nom: String, lien: String }],
    prepareAt:  { type: Date, default: null },
  },

  // ── Visioconférence (Jitsi Meet auto) ─────────
  lienVisio:   { type: String, default: null }, // URL Jitsi générée automatiquement
  roomJitsi:   { type: String, default: null }, // Nom de la salle Jitsi

  // ── Paiement ──────────────────────────────────
  paiement: {
    methode:   { type: String, enum: ['wave','orange_money','carte','non_paye'], default: 'non_paye' },
    statut:    { type: String, enum: ['en_attente','valide','echec'], default: 'en_attente' },
    reference: { type: String, default: null },
    payeAt:    { type: Date, default: null },
  },

  notes: { type: String, default: '' }, // Notes admin / prof
}, { timestamps: true });

// ── Index ────────────────────────────────────
reservationSchema.index({ eleveId: 1 });
reservationSchema.index({ profId: 1 });
reservationSchema.index({ statut: 1 });

// ── Méthode : générer lien Jitsi ─────────────
reservationSchema.methods.genererLienVisio = function() {
  const room = `tate-${this._id.toString().slice(-8)}-${Date.now().toString(36)}`;
  this.roomJitsi  = room;
  this.lienVisio  = `https://meet.jit.si/${room}`;
  return this.lienVisio;
};

// ── Constante forfaits (exportée pour le frontend) ──
reservationSchema.statics.FORFAITS = FORFAITS;

module.exports = mongoose.model('Reservation', reservationSchema);
