const mongoose = require('mongoose');
// ============================================================
// src/models/Chapitre.js
// ============================================================
const chapitreSchema = new mongoose.Schema({
  matiereId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere', required: true },
  titre:            { type: String, required: true, trim: true },
  // null = cours libre (langues, etc.) | sinon niveau scolaire
  niveau:           {
    type: String,
    enum: ['CM1','CM2','6eme','5eme','4eme','3eme','Seconde','Premiere','Terminale','Libre', null],
    default: null,
  },
  objectif:         { type: String, required: true },
  ordre:            { type: Number, default: 0 },
  actif:            { type: Boolean, default: true },

  // ── Section Français (CM1→3ème uniquement) ───────────────────
  // Null pour toutes les autres matières
  sectionFr: {
    type: String,
    enum: ['Grammaire', 'Orthographe grammaticale', "Orthographe d'usage", 'Conjugaison', null],
    default: null,
  },

  // ── Instructions générales pour l'IA (ton, style, contexte) ──
  promptSupplement: { type: String, default: '' },

  // ── Format précis des exercices que l'IA DOIT respecter ──────
  // Ex: "Toujours poser des questions à trous. Chaque question doit
  //      contenir une phrase en contexte africain. Pas de QCM."
  formatExercices:  { type: String, default: '' },

  prerequis:        { type: mongoose.Schema.Types.ObjectId, ref: 'Chapitre', default: null },

  // ── Fiche mémo générée par l'IA ──────────────────────────────
  // Points à retenir + Q&R pour auto-évaluation
  ficheMemo: {
    pointsACretenir: [{ type: String }],          // 5-8 points essentiels
    questionsReponses: [{                          // flashcards Q&R
      question: { type: String },
      reponse:  { type: String },
    }],
    genereAt:     { type: Date,    default: null },
    genereParIA:  { type: Boolean, default: false },
  },

  // ── Documents de référence pour l'IA ─────────────────────────
  // PDFs, TXT, images fournis par admin/prof pour nourrir l'IA
  documentsRef: [{
    nom:        { type: String, required: true },      // nom original du fichier
    chemin:     { type: String, required: true },      // chemin relatif depuis uploads/
    type:       { type: String, required: true },      // 'pdf' | 'txt' | 'jpg' | 'png' | 'docx'
    taille:     { type: Number, default: 0 },          // taille en octets
    uploadedAt: { type: Date,   default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Chapitre', chapitreSchema);
