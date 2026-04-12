const mongoose = require('mongoose');

// ============================================================
// src/models/TentativeQcm.js
// ============================================================
const tentativeQcmSchema = new mongoose.Schema({
  qcmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Qcm',
    required: true,
  },
  eleveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chapitreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapitre',
  },
  reponses: [
    {
      questionIndex: {
        type: Number,
        required: true,
      },
      reponse: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        required: true,
      },
    },
  ],
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
  nbCorrectes: {
    type: Number,
    default: 0,
  },
  nbTotal: {
    type: Number,
    default: 0,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('TentativeQcm', tentativeQcmSchema);
