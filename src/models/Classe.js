
const mongoose = require('mongoose');
// ============================================================
// src/models/Classe.js
// ============================================================
const classeSchema = new mongoose.Schema({
  nom:           { type: String, required: true, trim: true },
  niveau:        { type: String, enum: ['CM1', 'CM2', '6eme', '5eme', '4eme', '3eme', 'Seconde', 'Premiere', 'Terminale'], required: true },
  enseignantId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eleves:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  actif:         { type: Boolean, default: true },
}, { timestamps: true });

    module.exports = mongoose.model('Classe', classeSchema);

