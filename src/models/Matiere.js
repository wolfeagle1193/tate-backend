const mongoose = require('mongoose');
// ============================================================
// src/models/Matiere.js
// ============================================================
const matiereSchema = new mongoose.Schema({
  nom:       { type: String, required: true, trim: true },
  code:      { type: String, required: true, unique: true },
  niveaux:   [{ type: String, enum: ['CM1','CM2','6eme','5eme','4eme','3eme','Seconde','Premiere','Terminale'] }],
  icone:     { type: String, default: '📚' },
  couleur:   { type: String, default: '#F4A847' },
  ordre:     { type: Number, default: 0 },
  actif:     { type: Boolean, default: true },
  estLangue: { type: Boolean, default: false }, // true pour les langues (Wolof, Pulaar, etc.)
}, { timestamps: true });

module.exports = mongoose.model('Matiere', matiereSchema);
