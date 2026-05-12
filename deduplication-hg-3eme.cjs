// ============================================================
// deduplication-hg-3eme.cjs
// Supprime les chapitres doublons d'Histoire (HI) et de
// Géographie (GE) pour la classe de 3ème.
//
// Logique : pour chaque paire de chapitres ayant le même
// titre + même niveau + même matiereId, on conserve le plus
// ancien (premier créé) et on supprime tous les suivants,
// ainsi que leurs leçons et QCMs associés.
//
// Usage : node deduplication-hg-3eme.cjs
// ============================================================
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI manquant dans .env'); process.exit(1); }

// ── Schémas minimalistes ──────────────────────────────────────
const matiereSchema = new mongoose.Schema({ nom: String, code: String });
const chapitreSchema = new mongoose.Schema({
  matiereId: { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere' },
  titre:     String,
  niveau:    String,
  actif:     Boolean,
  ordre:     Number,
}, { timestamps: true });
const leconSchema = new mongoose.Schema({ chapitreId: mongoose.Schema.Types.ObjectId });
const qcmSchema   = new mongoose.Schema({ chapitreId: mongoose.Schema.Types.ObjectId });

const Matiere  = mongoose.model('Matiere',  matiereSchema);
const Chapitre = mongoose.model('Chapitre', chapitreSchema);
const Lecon    = mongoose.model('Lecon',    leconSchema);
const Qcm      = mongoose.model('Qcm',      qcmSchema);

async function deduplication() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connecté à MongoDB Atlas');

  // Récupérer les matières HI et GE
  const matieres = await Matiere.find({ code: { $in: ['HI', 'GE'] } });
  if (!matieres.length) {
    console.log('⚠️  Aucune matière HI ou GE trouvée.');
    process.exit(0);
  }

  let totalSupprimes = 0;

  for (const matiere of matieres) {
    console.log(`\n── Traitement : ${matiere.nom} (${matiere.code}) ──`);

    // Récupérer tous les chapitres de cette matière pour le niveau 3ème
    const chapitres = await Chapitre.find({
      matiereId: matiere._id,
      niveau: '3eme',
    }).sort({ createdAt: 1 }); // du plus ancien au plus récent

    console.log(`   Chapitres trouvés : ${chapitres.length}`);

    // Regrouper par titre (insensible à la casse et aux espaces)
    const groupes = {};
    for (const ch of chapitres) {
      const cle = ch.titre.trim().toLowerCase();
      if (!groupes[cle]) groupes[cle] = [];
      groupes[cle].push(ch);
    }

    // Pour chaque groupe avec des doublons, supprimer les extras
    for (const [titre, liste] of Object.entries(groupes)) {
      if (liste.length <= 1) continue;

      console.log(`\n   🔍 Doublon détecté : "${liste[0].titre}" (${liste.length} exemplaires)`);

      // Garder le premier (plus ancien), supprimer les suivants
      const aGarder    = liste[0];
      const aSupprimer = liste.slice(1);

      for (const dup of aSupprimer) {
        // Supprimer les leçons associées
        const nbLecons = await Lecon.countDocuments({ chapitreId: dup._id });
        await Lecon.deleteMany({ chapitreId: dup._id });

        // Supprimer les QCMs associés
        const nbQcms = await Qcm.countDocuments({ chapitreId: dup._id });
        await Qcm.deleteMany({ chapitreId: dup._id });

        // Supprimer le chapitre doublon
        await Chapitre.findByIdAndDelete(dup._id);

        console.log(`   ✅ Supprimé : _id=${dup._id} · ${nbLecons} leçon(s) · ${nbQcms} QCM(s)`);
        totalSupprimes++;
      }

      console.log(`   ✔  Conservé  : _id=${aGarder._id} (ordre: ${aGarder.ordre})`);
    }
  }

  console.log(`\n==========================================`);
  console.log(`  ✅ Dédoublonnage terminé !`);
  console.log(`  ${totalSupprimes} chapitre(s) doublon(s) supprimé(s).`);
  console.log(`==========================================`);
  process.exit(0);
}

deduplication().catch(e => {
  console.error('❌ Erreur :', e.message);
  process.exit(1);
});
