// ============================================================
// src/models/User.js
// ============================================================
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const NIVEAUX = ['CM1','CM2','6eme','5eme','4eme','3eme','Seconde','Premiere','Terminale'];

const userSchema = new mongoose.Schema({
  nom:          { type: String, required: true, trim: true },
  email:        { type: String, default: null, unique: true, sparse: true, lowercase: true, trim: true },
  telephone:    { type: String, default: null, unique: true, sparse: true, trim: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['admin','prof','eleve','parent'], required: true },
  niveau:       { type: String, enum: NIVEAUX, default: null },
  classeId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', default: null },

  // ── Relations famille ──────────────────────────────────────
  // Pour les parents : liste des élèves liés
  enfants:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Pour les élèves : parent lié
  parentId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  // Email parent fourni à l'inscription (pour auto-linking)
  parentEmail:  { type: String, default: null, lowercase: true, trim: true },

  // ── Abonnement ─────────────────────────────────────────────
  abonnement:       { type: String, enum: ['gratuit','premium'], default: 'gratuit' },
  abonnementExpiry: { type: Date, default: null },
  // Nb de chapitres gratuits consultés (limite freemium)
  chapitresGratuits: { type: Number, default: 0 },

  // Paiement d'abonnement en attente de confirmation admin
  abonnementPending: {
    reference:  { type: String, default: null },  // ex: TATE-SUB-1748001234-AB3X
    methode:    { type: String, default: null },   // 'wave' | 'orange_money'
    montant:    { type: Number, default: 2000 },
    initieAt:   { type: Date,   default: null },
  },

  // Compteur exercices quotidiens (limite 10/jour pour les gratuits)
  exercicesStats: {
    date:  { type: Date,   default: null },  // date du dernier reset
    count: { type: Number, default: 0 },     // nb d'exercices démarrés aujourd'hui
  },

  // ── Statut du compte ───────────────────────────────────────
  // 'en_attente' pour profs (avant validation admin), 'actif' sinon
  statutCompte:   { type: String, enum: ['actif','en_attente','rejete'], default: 'actif' },

  // ── Dossier prof ───────────────────────────────────────────
  // Chemins des fichiers uploadés (CV, diplômes)
  documents:      [{ nom: String, chemin: String, typeDoc: String, uploadedAt: Date }],
  // Matières que le prof peut enseigner
  matieresCodes:  [{ type: String }],
  niveauxEnseignes: [{ type: String, enum: NIVEAUX }],
  bioPro:         { type: String, default: '' },
  noteAdmin:      { type: String, default: '' }, // note de l'admin lors de la validation

  // ── Progression élève ──────────────────────────────────────
  chapitresValides: [{
    chapitreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapitre' },
    scoreFinal: Number,
    valideAt:   Date,
    etoiles:    { type: Number, min:1, max:3 },
  }],
  badges:       [{ type: String }],
  streak:       { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },

  // ── Auth ───────────────────────────────────────────────────
  actif:        { type: Boolean, default: true },
  googleId:     { type: String, default: null },
  avatar:       { type: String, default: null },
  refreshToken: { type: String, default: null },
}, { timestamps: true });

// ── Helpers abonnement ─────────────────────────────────────
userSchema.virtual('estPremium').get(function() {
  if (this.role !== 'eleve') return true; // profs/admin/parents pas de limite
  if (this.abonnement === 'premium' && this.abonnementExpiry > new Date()) return true;
  return false;
});

// ── Pre-save hash ──────────────────────────────────────────
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.verifierMotDePasse = async function(mdp) {
  return bcrypt.compare(mdp, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
