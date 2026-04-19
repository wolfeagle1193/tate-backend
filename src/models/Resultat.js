// ============================================================
// src/models/Resultat.js
// Résultat d'un élève après validation du QCM intégré dans le cours HTML
// ============================================================
const mongoose = require('mongoose');

const resultatSchema = new mongoose.Schema({
  eleveId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  chapitreId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Chapitre', required: true },
  leconId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Lecon',   required: true },
  score:       { type: Number, required: true, min: 0, max: 100 },  // %
  nbCorrectes: { type: Number, required: true },
  nbTotal:     { type: Number, required: true },
  nbErreurs:   { type: Number, default: 0 },   // nbTotal - nbCorrectes
  tentative:   { type: Number, default: 1 },   // numéro de la tentative (1, 2, 3…)
  maitrise:    { type: Boolean, default: false }, // true si nbErreurs <= 2 (max 2 fautes)
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Index pour les recherches fréquentes
resultatSchema.index({ eleveId: 1, chapitreId: 1 });
resultatSchema.index({ chapitreId: 1, score: -1 });
resultatSchema.index({ eleveId: 1, completedAt: -1 });

module.exports = mongoose.model('Resultat', resultatSchema);
