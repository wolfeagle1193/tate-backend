/**
 * Script de nettoyage de la base de données Taté
 * Supprime : Lecons, Chapitres, QCM, Sessions, Notifications, TentativeQcm, LogIA
 * Supprime tous les Users SAUF le compte admin principal
 * Conserve : Matieres, Classes
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@tate.sn';

async function nettoyerBDD() {
  console.log('🔌 Connexion à MongoDB Atlas…');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connecté\n');

  const db = mongoose.connection.db;

  // ── Supprimer les collections de données ──────────────────
  const collections = [
    { nom: 'lecons',         label: 'Leçons/Cours' },
    { nom: 'chapitres',      label: 'Chapitres' },
    { nom: 'qcms',           label: 'QCM' },
    { nom: 'tentativecqms',  label: 'Tentatives QCM' },
    { nom: 'sessions',       label: 'Sessions élèves' },
    { nom: 'notifications',  label: 'Notifications' },
    { nom: 'logias',         label: 'Logs IA' },
    { nom: 'reservations',   label: 'Réservations' },
    { nom: 'epreuves',       label: 'Épreuves' },
  ];

  for (const col of collections) {
    try {
      const result = await db.collection(col.nom).deleteMany({});
      console.log(`🗑️  ${col.label.padEnd(22)} → ${result.deletedCount} document(s) supprimé(s)`);
    } catch (e) {
      console.log(`⚠️  ${col.label.padEnd(22)} → ${e.message}`);
    }
  }

  // ── Supprimer tous les utilisateurs SAUF l'admin ─────────
  try {
    const result = await db.collection('users').deleteMany({
      email: { $ne: ADMIN_EMAIL },
    });
    console.log(`🗑️  ${'Utilisateurs (hors admin)'.padEnd(22)} → ${result.deletedCount} document(s) supprimé(s)`);
  } catch (e) {
    console.log(`⚠️  Utilisateurs → ${e.message}`);
  }

  // ── Vérification : admin toujours présent ─────────────────
  const admin = await db.collection('users').findOne({ email: ADMIN_EMAIL });
  if (admin) {
    console.log(`\n✅ Compte admin conservé : ${admin.email} (${admin.nom || admin.prenom || 'admin'})`);
  } else {
    console.log(`\n⚠️  Compte admin introuvable pour ${ADMIN_EMAIL}`);
  }

  console.log('\n🎉 Base de données nettoyée. Prête pour les vraies données.\n');
  await mongoose.disconnect();
  process.exit(0);
}

nettoyerBDD().catch(e => {
  console.error('❌ Erreur :', e.message);
  process.exit(1);
});
