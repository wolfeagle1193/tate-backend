
const mongoose = require('mongoose');
// ============================================================
// src/models/LogIA.js
// ============================================================
const logIASchema = new mongoose.Schema({
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Session', default: null },
  typeAppel:        { type: String, enum: ['resume_cours', 'generation_questions', 'correction', 'analyse_lacunes', 'preparation_prof'] },
  promptTokens:     { type: Number, default: 0 },
  completionTokens: { type: Number, default: 0 },
  latencyMs:        { type: Number, default: 0 },
  model:            { type: String, default: 'claude-sonnet-4-20250514' },
  succes:           { type: Boolean, default: true },
  erreur:           { type: String, default: null },
  createdAt:        { type: Date, default: Date.now, expires: '30d' }, // TTL 30 jours
});

     module.exports = mongoose.model('LogIA', logIASchema);