const mongoose = require('mongoose');
// ============================================================
// src/models/Session.js — sessions adaptatives (IA décide)
// ============================================================
const reponseSchema = new mongoose.Schema({
  question:        String,
  reponseEleve:    String,
  reponseAttendue: String,
  correct:         Boolean,
  explication:     String,
  encouragement:   String,
  createdAt:       { type: Date, default: Date.now },
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  eleveId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chapitreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapitre', required: true },
  leconId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Lecon', required: true },
  serie:      { type: Number, default: 1 },
  tentative:  { type: Number, default: 1 },
  reponses:   [reponseSchema],
  questionsEnCours: { type: mongoose.Schema.Types.Mixed, default: [] },
  scorePct:   { type: Number, default: 0 },
  maitrise:   { type: Boolean, default: false },
  verdictIA:  { type: String, default: 'continuer' },
  statut:     { type: String, enum: ['en_cours', 'terminee', 'remediee'], default: 'en_cours' },
  phrasesUtilisees: [String],
  startedAt:  { type: Date, default: Date.now },
  completedAt:{ type: Date, default: null },
}, { timestamps: true });

sessionSchema.index({ eleveId: 1, chapitreId: 1 });
sessionSchema.index({ eleveId: 1, statut: 1 });

module.exports = mongoose.model('Session', sessionSchema);
