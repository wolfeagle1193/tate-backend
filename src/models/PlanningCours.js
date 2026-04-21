// ============================================================
// src/models/PlanningCours.js
// Devoir / cours programmé par l'admin pour un élève
// ============================================================
const mongoose = require('mongoose');

const planningCoursSchema = new mongoose.Schema({
  eleveId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User',     required: true },
  chapitreId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Chapitre', required: true },
  leconId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Lecon',    default: null  },
  adminId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User',     required: true },

  type:           { type: String, enum: ['cours', 'exercice', 'revision'], default: 'exercice' },
  titre:          { type: String, default: '' },   // Titre personnalisé par l'admin
  noteAdmin:      { type: String, default: '' },   // Message/conseil de l'admin à l'élève
  dateProgrammee: { type: Date, required: true },  // Quand l'élève doit le faire

  statut: {
    type: String,
    enum: ['en_attente', 'en_cours', 'fait_sans_validation', 'valide', 'expire'],
    default: 'en_attente',
  },

  // Notifications
  rappelNotifie:   { type: Boolean, default: false }, // rappel J-1 envoyé ?
  rappelUrgent:    { type: Boolean, default: false }, // rappel le jour J envoyé ?
  rappelRetard:    { type: Boolean, default: false }, // rappel après J envoyé ?

  completedAt:    { type: Date, default: null },
}, { timestamps: true });

planningCoursSchema.index({ eleveId: 1, dateProgrammee: -1 });
planningCoursSchema.index({ statut: 1, dateProgrammee: 1 });

module.exports = mongoose.model('PlanningCours', planningCoursSchema);
