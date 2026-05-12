// ============================================================
// src/models/Entrainement.js — Exercices d'entraînement non-officiels
// Source : fascicules, devoirs maison, concours blancs, etc.
// ============================================================
const mongoose = require('mongoose');

const entrainementSchema = new mongoose.Schema({
  matiere:   { type: String, required: true },          // 'Physique-Chimie'
  niveau:    { type: String, required: true },           // '3eme'
  section:   { type: String, default: '' },              // 'Physique' | 'Chimie'
  chapitre:  { type: String, required: true },           // 'Lentilles minces'
  ordre:     { type: Number, default: 99 },              // tri d'affichage
  titre:     { type: String, default: '' },              // libellé affiché
  source:    { type: String, default: '' },              // 'BST Joseph Turpin 2019-2020'
  nbExercices: { type: Number, default: 0 },             // pour affichage dans la carte

  // Contenu HTML — énoncé des exercices
  contenuHTML:    { type: String, default: '' },
  // Correction complète HTML — masquée côté front (premium ou prof)
  correctionHTML: { type: String, default: '' },

  publie: { type: Boolean, default: false },
  creePar: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Auto-titre si absent
entrainementSchema.pre('save', function(next) {
  if (!this.titre) {
    this.titre = `${this.chapitre} — Entraînements`;
  }
  next();
});

module.exports = mongoose.model('Entrainement', entrainementSchema);
