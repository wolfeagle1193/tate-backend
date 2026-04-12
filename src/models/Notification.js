const mongoose = require('mongoose');
// ============================================================
// src/models/Notification.js
// Notifications in-app : résultats QCM, maîtrise, alertes
// ============================================================
const notificationSchema = new mongoose.Schema({
  // Destinataire
  destinataireId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Type de notification
  type: {
    type: String,
    enum: ['qcm_resultat', 'qcm_maitrise', 'qcm_difficulte', 'session_resultat', 'nouveau_cours'],
    required: true,
  },

  // Données de la notification
  titre:   { type: String, required: true },
  message: { type: String, required: true },

  // Référence optionnelle à l'élève concerné (pour admin/prof/parent)
  eleveId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  eleveNom:   { type: String, default: '' },

  // Référence au QCM ou chapitre
  qcmId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Qcm', default: null },
  chapitreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapitre', default: null },
  chapitreNom: { type: String, default: '' },

  // Score (pour les résultats)
  score: { type: Number, default: null },

  // État
  lue: { type: Boolean, default: false },
}, { timestamps: true });

// Index pour charger rapidement les notifs d'un utilisateur
notificationSchema.index({ destinataireId: 1, lue: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
