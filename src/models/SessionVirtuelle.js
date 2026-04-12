// ============================================================
// src/models/SessionVirtuelle.js
// Sessions de classe en ligne (Zoom, Meet, etc.)
// Créées par admin ou prof — plusieurs élèves peuvent rejoindre
// ============================================================
const mongoose = require('mongoose');

const sessionVirtuelleSchema = new mongoose.Schema({
  titre:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  matiere:     { type: String, default: '' },
  niveau:      { type: String, default: '' },

  // Date et heure
  dateHeure:   { type: Date, required: true },
  dureeMin:    { type: Number, default: 60 }, // durée en minutes

  // Lien de session en ligne
  plateforme:  { type: String, enum: ['zoom', 'meet', 'teams', 'autre'], default: 'zoom' },
  lienSession: { type: String, required: true },
  motDePasse:  { type: String, default: '' },   // mot de passe Zoom optionnel
  idReunion:   { type: String, default: '' },   // ID de réunion Zoom

  // Participants
  animateur:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // admin ou prof
  eleves:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // liste invités
  niveauxCibles: [String],   // si vide → tous niveaux invités

  // Statut
  statut:  { type: String, enum: ['planifiee', 'en_cours', 'terminee', 'annulee'], default: 'planifiee' },
  ouvertATous: { type: Boolean, default: false }, // si true, tous les élèves voient la session

  // Méta
  creePar: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes:   { type: String, default: '' },
}, { timestamps: true });

sessionVirtuelleSchema.index({ dateHeure: 1, statut: 1 });
sessionVirtuelleSchema.index({ eleves: 1 });

module.exports = mongoose.model('SessionVirtuelle', sessionVirtuelleSchema);
