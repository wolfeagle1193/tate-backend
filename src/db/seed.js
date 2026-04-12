require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./connect');
const User    = require('../models/User');
const Matiere = require('../models/Matiere');

// ============================================================
// seed.js — Structure de base Taté (sans chapitres)
// Les chapitres sont créés manuellement par l'admin / les profs
// via l'interface, en entraînant l'IA sur leurs propres modèles.
// ============================================================

const NIVEAUX_SCOLAIRES = ['CM1', 'CM2', '6eme', '5eme', '4eme', '3eme', 'Seconde', 'Premiere', 'Terminale'];

const seed = async () => {
  await connectDB();
  console.log('\n✅ Connecté à MongoDB');

  // ─── Compte administrateur ─────────────────────────────────
  const adminExiste = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExiste) {
    await User.create({
      nom: process.env.ADMIN_NOM || 'Administrateur Taté',
      email: process.env.ADMIN_EMAIL,
      passwordHash: process.env.ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log('✅ Compte admin créé');
  } else {
    console.log('ℹ️  Admin déjà existant');
  }

  // ─── Matières académiques ──────────────────────────────────
  // Toutes les matières scolaires (CM1 → Terminale)
  const matieresScolaires = [
    { nom: 'Français',       code: 'FR', niveaux: NIVEAUX_SCOLAIRES, icone: '📖', couleur: '#F4A847', ordre: 1, estLangue: false },
    { nom: 'Mathématiques',  code: 'MA', niveaux: NIVEAUX_SCOLAIRES, icone: '📐', couleur: '#534AB7', ordre: 2, estLangue: false },
    { nom: 'Anglais',        code: 'AN', niveaux: NIVEAUX_SCOLAIRES, icone: '🇬🇧', couleur: '#1D9E75', ordre: 3, estLangue: false },
    { nom: 'Histoire',       code: 'HI', niveaux: NIVEAUX_SCOLAIRES, icone: '🏛️', couleur: '#D85A30', ordre: 4, estLangue: false },
    { nom: 'Géographie',     code: 'GE', niveaux: NIVEAUX_SCOLAIRES, icone: '🌍', couleur: '#0EA5E9', ordre: 5, estLangue: false },
    { nom: 'Sciences',       code: 'SC', niveaux: NIVEAUX_SCOLAIRES, icone: '🔬', couleur: '#7C3AED', ordre: 6, estLangue: false },
    { nom: 'Physique-Chimie',code: 'PC', niveaux: NIVEAUX_SCOLAIRES, icone: '⚗️', couleur: '#0891B2', ordre: 7, estLangue: false },
    { nom: 'SVT',            code: 'SV', niveaux: NIVEAUX_SCOLAIRES, icone: '🌿', couleur: '#16A34A', ordre: 8, estLangue: false },
    { nom: 'Philosophie',    code: 'PH', niveaux: ['Premiere','Terminale'], icone: '💭', couleur: '#9333EA', ordre: 9, estLangue: false },
  ];

  for (const m of matieresScolaires) {
    await Matiere.findOneAndUpdate({ code: m.code }, m, { upsert: true, new: true });
  }

  // Nettoyer les anciennes entrées obsolètes
  await Matiere.deleteMany({ estLangue: true });
  await Matiere.deleteMany({ code: 'HG' });   // ancienne matière remplacée par HI + GE

  console.log('✅ Matières créées : Français, Maths, Anglais, Histoire, Géographie, Sciences, PC, SVT, Philosophie');
  console.log('');
  console.log('📚 Aucun chapitre pré-chargé.');
  console.log('   → Connectez-vous en tant qu\'admin et créez vos chapitres');
  console.log('   → Pour le Français : sélectionne la matière FR + un niveau CM1-3ème');
  console.log('      et tu pourras choisir la sous-section (Grammaire / Conjugaison /');
  console.log('      Orthographe grammaticale / Orthographe d\'usage)');
  console.log('');
  console.log('🎓 ═══════════════════════════════════════════');
  console.log('   Seed Taté terminé avec succès !');
  console.log(`📧 Admin : ${process.env.ADMIN_EMAIL}`);
  console.log('═══════════════════════════════════════════\n');
  process.exit(0);
};

seed().catch(e => {
  console.error('❌ Erreur seed :', e.message);
  process.exit(1);
});
