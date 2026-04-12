
const mongoose = require('mongoose');
// ============================================================
// src/models/Lecon.js
// ============================================================
const leconSchema = new mongoose.Schema({
  chapitreId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Chapitre', required: true },
  titre:            { type: String, required: true },
  // Option A : texte brut saisi par le prof/admin
  contenuBrut:      { type: String, default: '' },
  // Option B : formulaire structuré
  formStructure: {
    reglePrincipale: String,
    motsVocabulaire: [String],
    exemplesProf:    [String],
    pieges:          [String],
  },
  // Cours HTML uploadé directement par l'admin/prof (rendu tel quel dans un iframe)
  contenuHTML: { type: String, default: '' },

  // Cours structuré manuellement par l'admin/prof (blocs visuels)
  contenuStructure: [{
    type:        { type: String, enum: ['resume','section','definition','important','attention','astuce','formule','exemple','exercice'], default: 'resume' },
    titre:       { type: String, default: '' },
    texte:       { type: String, default: '' },
    correction:  { type: String, default: '' },
    explication: { type: String, default: '' },
  }],

  // Cours reformaté par Claude selon le modèle pédagogique
  contenuFormate: {
    resume:                  String,
    objectif:                String,
    regle:                   String,
    exemples:                [String],
    pieges:                  [String],
    resumeMemo:              [String],  // 3-5 points clés
    questionComprehension:   String,   // Question ouverte après le résumé
    // Banque d'exercices pré-générés (réponses masquées pour l'élève)
    correctionsTypes: [{
      question:    String,
      reponse:     String,  // Réponse attendue (masquée jusqu'à correction)
      explication: String,  // Explication pédagogique (révélée après correction)
    }],
  },
  statut:     { type: String, enum: ['brouillon', 'en_preparation', 'valide', 'publie'], default: 'brouillon' },
  masque:     { type: Boolean, default: false },   // masqué temporairement (visible admin, caché élèves)
  masquePar:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  masqueAt:   { type: Date, default: null },
  creePar:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  valideePar: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  valideeAt:  { type: Date, default: null },
}, { timestamps: true });

    module.exports = mongoose.model('Lecon', leconSchema);

