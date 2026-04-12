// ============================================================
// src/models/Epreuve.js — Épreuves officielles BFEM & BAC Sénégal
// ============================================================
const mongoose = require('mongoose');

const sousQuestionSchema = new mongoose.Schema({
  lettre:     { type: String },           // 'a', 'b', 'c'…
  intitule:   { type: String, required: true },
  points:     { type: Number, default: 0 },
  correction: { type: String, default: '' },
}, { _id: false });

const questionSchema = new mongoose.Schema({
  numero:       { type: Number, required: true },
  intitule:     { type: String, required: true },
  points:       { type: Number, default: 0 },        // barème
  correction:   { type: String, default: '' },       // correction détaillée (masquée côté front)
  sousQuestions:[sousQuestionSchema],                // optionnel : subdivisions
}, { _id: true });

const epreuveSchema = new mongoose.Schema({
  type:      { type: String, enum: ['BFEM','BAC'], required: true },
  matiere:   { type: String, required: true },       // 'Français', 'Maths', 'Anglais', etc.
  niveau:    { type: String, enum: ['3eme','Terminale'], required: true },
  annee:     { type: Number, required: true },       // ex: 2024
  session:   { type: String, default: 'Normale' },   // 'Normale' | 'Remplacement'
  titre:     { type: String, default: '' },          // auto-rempli ou manuel
  duree:     { type: String, default: '' },          // ex: '4h'
  coefficient:{ type: Number, default: 1 },

  // Texte introductif / documents joints à l'épreuve
  enonce:    { type: String, default: '' },

  // Questions avec corrections masquées
  questions: [questionSchema],

  publie:    { type: Boolean, default: false },
  creePar:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Auto-titre si absent
epreuveSchema.pre('save', function(next) {
  if (!this.titre) {
    this.titre = `${this.type} ${this.annee} — ${this.matiere}`;
    if (this.session !== 'Normale') this.titre += ` (${this.session})`;
  }
  next();
});

module.exports = mongoose.model('Epreuve', epreuveSchema);
