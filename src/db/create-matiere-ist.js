require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./connect');
const Matiere = require('../models/Matiere');

const seed = async () => {
  await connectDB();
  console.log('✅ Connecté à MongoDB\n');

  const matiere = await Matiere.findOneAndUpdate(
    { code: 'IST' },
    {
      nom: 'Initiation Scientifique et Technologique',
      code: 'IST',
      niveaux: ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'],
      icone: '🔬',
      couleur: '#7C3AED',
      ordre: 6,
      estLangue: false,
    },
    { upsert: true, new: true }
  );

  console.log(`✅ Matière IST créée : ${matiere._id}`);
  process.exit(0);
};

seed().catch(e => {
  console.error('❌ Erreur :', e.message);
  process.exit(1);
});
