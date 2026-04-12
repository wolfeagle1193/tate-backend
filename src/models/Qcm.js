const mongoose = require('mongoose');

// ============================================================
// src/models/Qcm.js
// ============================================================
const qcmSchema = new mongoose.Schema({
  chapitreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapitre',
    required: true,
  },
  leconId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecon',
    default: null,
  },
  titre: {
    type: String,
    required: true,
    trim: true,
  },
  questions: [
    {
      enonce: {
        type: String,
        required: true,
      },
      options: [
        {
          lettre: {
            type: String,
            enum: ['A', 'B', 'C', 'D'],
            required: true,
          },
          texte: {
            type: String,
            required: true,
          },
        },
      ],
      reponseCorrecte: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        required: true,
      },
      explication: {
        type: String,
        default: '',
      },
    },
  ],
  statut: {
    type: String,
    enum: ['en_preparation', 'publie'],
    default: 'en_preparation',
  },
  creePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  valideePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  valideeAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Qcm', qcmSchema);
