// ============================================================
// clean_chapitres.js — Taté
// Supprime TOUS les chapitres, leçons et sessions d'exercices
// Lance avec : node clean_chapitres.js --confirm
// ============================================================
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/db/connect');

const CONFIRM = process.argv[2] === '--confirm';

if (!CONFIRM) {
  console.log('\n⚠️  Ce script supprimera TOUS les chapitres, leçons et sessions.');
  console.log('   Lance avec : node clean_chapitres.js --confirm\n');
  process.exit(0);
}

async function main() {
  await connectDB();
  console.log('\n🔗 Connecté à MongoDB Atlas\n');

  const chapResult    = await mongoose.connection.db.collection('chapitres').deleteMany({});
  console.log(`✅ Chapitres supprimés  : ${chapResult.deletedCount}`);

  const leconResult   = await mongoose.connection.db.collection('lecons').deleteMany({});
  console.log(`✅ Leçons supprimées    : ${leconResult.deletedCount}`);

  const sessionResult = await mongoose.connection.db.collection('sessions').deleteMany({});
  console.log(`✅ Sessions supprimées  : ${sessionResult.deletedCount}`);

  await mongoose.disconnect();
  console.log('\n🎉 Base nettoyée. Créez vos chapitres via l\'interface admin.\n');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
