/**
 * fix-null-index.js
 * ─────────────────────────────────────────────────────────
 * Corrige l'erreur E11000 : met à jour tous les documents
 * qui ont email=null ou telephone=null pour que ces champs
 * soient ABSENTS du document (non définis), afin que
 * l'index sparse unique fonctionne correctement.
 *
 * Lancer une seule fois :
 *   node src/db/fix-null-index.js
 * ─────────────────────────────────────────────────────────
 */
require('dotenv').config();
const mongoose = require('mongoose');

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connecté à MongoDB');

  const col = mongoose.connection.collection('users');

  // Remplacer email:null par champ absent
  const r1 = await col.updateMany(
    { email: null },
    { $unset: { email: '' } }
  );
  console.log(`📧 email null corrigés : ${r1.modifiedCount}`);

  // Remplacer telephone:null par champ absent
  const r2 = await col.updateMany(
    { telephone: null },
    { $unset: { telephone: '' } }
  );
  console.log(`📱 telephone null corrigés : ${r2.modifiedCount}`);

  // Supprimer et recréer les index pour forcer la mise à jour
  try {
    await col.dropIndex('email_1');
    console.log('🗑️  Index email_1 supprimé');
  } catch (e) { console.log('Index email_1 inexistant ou déjà supprimé'); }

  try {
    await col.dropIndex('telephone_1');
    console.log('🗑️  Index telephone_1 supprimé');
  } catch (e) { console.log('Index telephone_1 inexistant ou déjà supprimé'); }

  // Recréer l'index email : unique strict (obligatoire)
  await col.createIndex({ email: 1 }, { unique: true, background: true });
  console.log('✅ Index email recrée (unique obligatoire)');

  await col.createIndex({ telephone: 1 }, { unique: true, sparse: true, background: true });
  console.log('✅ Index telephone recrée (unique + sparse)');

  console.log('\n🎉 Migration terminée — l\'erreur E11000 est corrigée.');
  await mongoose.disconnect();
}

fix().catch(e => {
  console.error('❌ Erreur :', e.message);
  process.exit(1);
});
