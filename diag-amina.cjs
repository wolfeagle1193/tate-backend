// diag-amina.cjs — diagnostic complet des données d'Amina dans la vraie base "tate"
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  // Trouver Amina
  const amina = await db.collection('users').findOne({ nom: { $regex: /amina/i } });
  if (!amina) { console.log('❌ Amina introuvable'); await mongoose.disconnect(); return; }
  console.log(`✅ Amina : ${amina.nom} | _id: ${amina._id}`);
  console.log(`   parentId: ${amina.parentId || 'AUCUN'}`);
  console.log(`   chapitresValides: ${(amina.chapitresValides || []).length} entrées`);

  // Trouver le parent
  const parent = await db.collection('users').findOne({ email: 'toubibadiouf@gmail.com' });
  if (parent) {
    const enfants = (parent.enfants || []).map(String);
    const aminaId = amina._id.toString();
    console.log(`\n✅ Parent : ${parent.nom}`);
    console.log(`   enfants[] : ${enfants.join(', ')}`);
    console.log(`   Amina dans enfants[] : ${enfants.includes(aminaId) ? '✅ OUI' : '❌ NON'}`);
  } else {
    console.log('\n❌ Parent toubibadiouf@gmail.com introuvable');
  }

  // Résultats d'Amina
  const resultats = await db.collection('resultats')
    .find({ eleveId: amina._id })
    .sort({ completedAt: -1 })
    .toArray();

  console.log(`\n=== RÉSULTATS AMINA (${resultats.length}) ===`);
  if (resultats.length === 0) {
    console.log('   ⚠️  Aucun résultat QCM enregistré pour Amina');
  } else {
    // Grouper par chapitre
    const chapMap = {};
    for (const r of resultats) {
      const cid = r.chapitreId?.toString();
      if (!chapMap[cid]) chapMap[cid] = { cid, resultats: [] };
      chapMap[cid].resultats.push(r);
    }
    console.log(`   ${Object.keys(chapMap).length} chapitres travaillés`);

    // Afficher les 10 plus récents
    console.log('\n   10 derniers résultats :');
    resultats.slice(0, 10).forEach(r => {
      const date = r.completedAt ? new Date(r.completedAt).toLocaleString('fr-FR') : '—';
      console.log(`   • score: ${r.score}% | maitrise: ${r.maitrise} | tentative: ${r.tentative} | ${date} | chapId: ${r.chapitreId}`);
    });

    // Stats globales
    const maitrises = resultats.filter(r => r.maitrise);
    console.log(`\n   ✅ Résultats maîtrisés (maitrise=true) : ${maitrises.length}`);
    console.log(`   ❌ Non maîtrisés : ${resultats.length - maitrises.length}`);

    // Activité cette semaine et ce mois
    const now = new Date();
    const il7j = new Date(now - 7 * 24 * 3600 * 1000);
    const il30j = new Date(now - 30 * 24 * 3600 * 1000);
    const cetteSemaine = resultats.filter(r => r.completedAt && new Date(r.completedAt) >= il7j);
    const ceMois = resultats.filter(r => r.completedAt && new Date(r.completedAt) >= il30j);
    console.log(`\n   📅 Cette semaine (7j) : ${cetteSemaine.length} résultat(s)`);
    console.log(`   📅 Ce mois (30j) : ${ceMois.length} résultat(s)`);

    // Dates distinctes cette semaine
    const joursActifs = new Set(cetteSemaine.map(r => new Date(r.completedAt).toISOString().slice(0, 10)));
    console.log(`   📅 Jours distincts cette semaine : ${[...joursActifs].join(', ') || 'aucun'}`);
  }

  // Sessions d'Amina
  const sessions = await db.collection('sessions')
    .find({ eleveId: amina._id })
    .sort({ startedAt: -1 })
    .limit(10)
    .toArray();
  console.log(`\n=== SESSIONS AMINA (${sessions.length} récentes) ===`);
  if (sessions.length === 0) {
    console.log('   ⚠️  Aucune session enregistrée pour Amina');
  } else {
    sessions.forEach(s => {
      const date = s.startedAt ? new Date(s.startedAt).toLocaleString('fr-FR') : '—';
      console.log(`   • scorePct: ${s.scorePct}% | maitrise: ${s.maitrise} | ${date}`);
    });
  }

  await mongoose.disconnect();
}
main().catch(e => { console.error('❌', e.message); process.exit(1); });
