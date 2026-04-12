// ============================================================
// reset-admin.js — Force la création/mise à jour du compte admin
// Usage : node src/db/reset-admin.js
// ============================================================
require('dotenv').config();
const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');
const connectDB = require('./connect');
const User      = require('../models/User');

const reset = async () => {
  await connectDB();
  console.log('\n✅ Connecté à MongoDB\n');

  const email    = process.env.ADMIN_EMAIL    || 'admin@tate.sn';
  const password = process.env.ADMIN_PASSWORD || 'TateAdmin2024!';
  const nom      = process.env.ADMIN_NOM      || 'Administrateur Taté';

  // Hash direct (évite le double-hash du pre-save hook sur findOneAndUpdate)
  const passwordHash = await bcrypt.hash(password, 12);

  await User.findOneAndUpdate(
    { email },
    { $set: { nom, email, passwordHash, role: 'admin', actif: true } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('✅ Admin créé / mot de passe réinitialisé\n');
  console.log('─────────────────────────────────');
  console.log(`  📧 Email    : ${email}`);
  console.log(`  🔑 Password : ${password}`);
  console.log('─────────────────────────────────\n');
  mongoose.disconnect();
};

reset().catch(e => {
  console.error('❌ Erreur :', e.message);
  process.exit(1);
});
