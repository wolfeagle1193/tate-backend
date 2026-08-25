const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const admin = await db.collection("users").findOne({ role: "admin" });
  const adminId = admin?._id?.toString() || "69dfac0adb8037a014ca9178";

  const matiere = await db.collection("matieres").findOne({ code: "AN-AD" });
  if (!matiere) { console.log("❌ Matière non trouvée"); await mongoose.disconnect(); return; }
  const matId = matiere._id.toString();

  const lastChap = await db.collection("chapitres").find({ matiereId: new mongoose.Types.ObjectId(matId), niveau: "Adulte" }).sort({ ordre: -1 }).limit(1).toArray();
  let ordreStart = lastChap.length > 0 ? (lastChap[0].ordre || 0) + 1 : 1;

  async function addChapitre(titre, objectif, contenuHTML, ordre) {
    const chap = await db.collection("chapitres").insertOne({
      matiereId: new mongoose.Types.ObjectId(matId), titre, niveau: "Adulte", objectif, ordre, actif: true,
      createdAt: new Date(), updatedAt: new Date()
    });
    await db.collection("lecons").insertOne({
      chapitreId: chap.insertedId, titre, matiere: matId, classe: "Adulte", statut: "publie",
      masque: false, creePar: adminId, contenuHTML, contenuBrut: "",
      dureeExercices: 20, contenuFormate: { correctionsTypes: [], exercices: [] },
      createdAt: new Date(), updatedAt: new Date()
    });
    console.log(`  ✅ ${titre}`);
    return chap.insertedId;
  }

  // ═══════════════════════════════════════════════════════
  //  PRONUNCIATION — 6 chapitres
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "L1 — Pronunciation : Introduction & Sounds of English",
    "Apprendre les sons de base de l'anglais et comment les prononcer",
    `<div class="lecon-anglais">
<h1>🎤 L1 — Pronunciation : Introduction & Sounds of English</h1>
<div class="intro-box">
<p>La prononciation est la clé pour être comprise. Ce chapitre vous apprend les sons de base.</p>
</div>
<h2>🎯 Objectifs</h2>
<ul>
<li>Apprendre les voyelles anglaises</li>
<li>Maîtriser les consonnes difficiles</li>
<li>Savoir quand le 'r' se prononce</li>
</ul>
<h2>📝 Voyelles essentielles</h2>
<table class="conj-table">
<tr><th>Anglais</th><th>Exemple</th><th>Français</th></tr>
<tr><td>/iː/</td><td>see, tree, meet</td><td>"i" long</td></tr>
<tr><td>/ɪ/</td><td>sit, big, fish</td><td>"i" court</td></tr>
<tr><td>/æ/</td><td>cat, bad, man</td><td>"a" ouvert (spécial)</td></tr>
<tr><td>/ʌ/</td><td>cup, love, come</td><td>"u" bref</td></tr>
<tr><td>/ɑː/</td><td>car, father</td><td>"a" très ouvert</td></tr>
<tr><td>/uː/</td><td>food, blue</td><td>"ou" long</td></tr>
</table>
<h2>🔥 Consonnes difficiles</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>/θ/ (think)</strong> — Langue entre les dents</div>
<div class="vocab-item"><strong>/ð/ (this)</strong> — Langue entre les dents + voix</div>
<div class="vocab-item"><strong>/ʃ/ (ship)</strong> — Comme "ch" français</div>
<div class="vocab-item"><strong>/ŋ/ (sing)</strong> — "ng" nasal</div>
<div class="vocab-item"><strong>/r/ (red)</strong> — R roulé (US) ou muet (UK)</div>
</div>
<h2>💡 Conseil</h2>
<p>Regardez votre bouche dans un miroir quand vous pratiquez. La position des lèvres et de la langue est importante !</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "L2 — Pronunciation : Numbers, Dates & Times",
    "Prononcer correctement les nombres, dates et heures en anglais",
    `<div class="lecon-anglais">
<h1>🎤 L2 — Pronunciation : Numbers, Dates & Times</h1>
<div class="intro-box">
<p>Les nombres sont souvent mal prononcés. Apprenez les pièges classiques.</p>
</div>
<h2>🔢 Teens vs Tens</h2>
<table class="conj-table">
<tr><th>Teens (-teen)</th><th>Tens (-ty)</th></tr>
<tr><td>13 thir<strong>teen</strong></td><td>30 <strong>thir</strong>ty</td></tr>
<tr><td>14 four<strong>teen</strong></td><td>40 <strong>for</strong>ty</td></tr>
<tr><td>15 fif<strong>teen</strong></td><td>50 <strong>fif</strong>ty</td></tr>
</table>
<h2>⏰ Heures</h2>
<div class="example-box">
<p>3:00 → "three o'clock"</p>
<p>3:30 → "three thirty" ou "half past three"</p>
<p>7:45 → "seven forty-five" ou "quarter to eight"</p>
</div>
<h2>📅 Dates</h2>
<div class="example-box">
<p>15 March → "the fifteenth of March" (UK)</p>
<p>March 15 → "March fifteenth" (US)</p>
</div>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "L3 — Pronunciation : Understanding Fast Speech",
    "Décoder l'anglais rapide : liaisons et réductions",
    `<div class="lecon-anglais">
<h1>🎤 L3 — Pronunciation : Fast Speech & Reductions</h1>
<div class="intro-box">
<p>Les natifs parlent vite et réduisent les mots. Apprenez à les comprendre.</p>
</div>
<h2>✂️ Réductions courantes</h2>
<table class="verb-table">
<tr><th>Écrit</th><th>Parlé</th><th>Exemple</th></tr>
<tr><td>want to</td><td>wanna</td><td>"I wanna go"</td></tr>
<tr><td>going to</td><td>gonna</td><td>"I'm gonna eat"</td></tr>
<tr><td>got to</td><td>gotta</td><td>"I gotta run"</td></tr>
<tr><td>don't know</td><td>dunno</td><td>"I dunno"</td></tr>
<tr><td>let me</td><td>lemme</td><td>"Lemme see"</td></tr>
</table>
<h2>🔗 Liaisons</h2>
<div class="example-box">
<p>"an apple" → /ə.næ.pəl/</p>
<p>"don't you" → /dəʊntʃu/</p>
<p>"did you" → /dɪdʒu/</p>
</div>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "L4 — Pronunciation : British vs American Accents",
    "Distinguer et comprendre les accents britannique et américain",
    `<div class="lecon-anglais">
<h1>🎤 L4 — British vs American Accents</h1>
<div class="intro-box">
<p>UK et US ont des différences de prononciation importantes.</p>
</div>
<h2>🔊 Différences clés</h2>
<table class="compare-table">
<tr><th>Mot</th><th>UK</th><th>US</th></tr>
<tr><td>water</td><td>/ˈwɔː.tə/ (pas de R)</td><td>/ˈwɔː.t̬ɚ/ (R)</td></tr>
<tr><td>car</td><td>/kɑː/</td><td>/kɑːr/</td></tr>
<tr><td>dance</td><td>/dɑːns/</td><td>/dæns/</td></tr>
<tr><td>can't</td><td>/kɑːnt/</td><td>/kænt/</td></tr>
</table>
<h2>📚 Vocabulaire différent</h2>
<table class="verb-table">
<tr><th>UK</th><th>US</th></tr>
<tr><td>flat</td><td>apartment</td></tr>
<tr><td>lift</td><td>elevator</td></tr>
<tr><td>petrol</td><td>gas</td></tr>
<tr><td>chips</td><td>fries</td></tr>
</table>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "L5 — Pronunciation : News & Media Listening",
    "S'habituer à l'anglais des médias",
    `<div class="lecon-anglais">
<h1>🎤 L5 — Pronunciation : News & Media</h1>
<div class="intro-box">
<p>Les présentateurs parlent vite et utilisent un vocabulaire spécifique.</p>
</div>
<h2>📺 Vocabulaire média</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>Breaking news</strong> — Dernières nouvelles</div>
<div class="vocab-item"><strong>Headlines</strong> — Titres</div>
<div class="vocab-item"><strong>Live</strong> — En direct</div>
<div class="vocab-item"><strong>Interview</strong> — Entretien</div>
<div class="vocab-item"><strong>Report</strong> — Reportage</div>
<div class="vocab-item"><strong>Source</strong> — Source</div>
</div>
<h2>💡 Conseil</h2>
<p>Commencez par CNN 10 — un journal de 10 minutes pour les étudiants d'anglais.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "L6 — Pronunciation : Songs & Music for Pronunciation",
    "Améliorer sa prononciation en chantant",
    `<div class="lecon-anglais">
<h1>🎤 L6 — Pronunciation : Songs & Music</h1>
<div class="intro-box">
<p>Chanter est le meilleur exercice de prononciation. Les paroles restent en mémoire.</p>
</div>
<h2>🎵 Chansons recommandées</h2>
<div class="example-box">
<h3>Débutant</h3>
<ul>
<li>"Perfect" — Ed Sheeran (paroles claires)</li>
<li>"Count on Me" — Bruno Mars (lent, répétitif)</li>
<li>"Yesterday" — The Beatles (simple)</li>
</ul>
<h3>Intermédiaire</h3>
<ul>
<li>"Shape of You" — Ed Sheeran</li>
<li>"Roar" — Katy Perry</li>
</ul>
</div>
<h2>💡 Conseil</h2>
<p>Utilisez LyricsTraining.com — un jeu où vous complétez les mots manquants !</p>
</div>`,
    ordreStart++
  );

  // ═══════════════════════════════════════════════════════
  //  FIX LIENS PRACTICE MORTS
  // ═══════════════════════════════════════════════════════

  // Trouver les chapitres Practice avec liens morts
  const practiceChaps = await db.collection("chapitres").find({
    matiereId: new mongoose.Types.ObjectId(matId), niveau: "Adulte",
    titre: { $regex: /^P\d+/i }
  }).toArray();

  for (const chap of practiceChaps) {
    const lecon = await db.collection("lecons").findOne({ chapitreId: chap._id });
    if (!lecon || !lecon.contenuHTML) continue;

    let html = lecon.contenuHTML;
    let changed = false;

    // Mapping des IDs morts → IDs qui marchent
    const replacements = {
      'DsS7pQtDoNs': 'DMOBlEcRuw8',  // Pursuit of Happyness
      '8H6dYUj1GCM': 'xTq5dYGiIeE',  // Dora (utiliser un autre)
      '39nQoaz7x_w': '01ON04GCwKs',  // Mulan
      'BoVKSCWfiqM': 'JPJjwHAIny4',  // Shallow
      'NrgmdOz227U': '8xg3vE8Ie_E',  // Yesterday
      'EJzH8Z1V9J8': 'TdrL3QxjyVw',  // Can't Help Falling in Love
    };

    for (const [oldId, newId] of Object.entries(replacements)) {
      if (html.includes(oldId)) {
        html = html.replace(new RegExp(oldId, 'g'), newId);
        changed = true;
        console.log(`  🔧 ${chap.titre}: remplacé ${oldId} → ${newId}`);
      }
    }

    // Pour les IDs que je n'ai pas trouvé de remplaçant, ajouter un message
    const deadIds = ['WCgd_chA-6I', 'zcygpp-g4iE', 'VRWH1HuSK0E', 'J_9hA3W1T-Q'];
    for (const deadId of deadIds) {
      if (html.includes(deadId)) {
        // Remplacer l'iframe par un message
        const iframeRegex = new RegExp(`<iframe[^>]*${deadId}[^>]*>[^<]*</iframe>`, 'g');
        html = html.replace(iframeRegex, `
          <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:1.5rem;text-align:center;margin:1rem 0;">
            <p style="color:#94a3b8;font-size:0.9rem;">🎬 <strong>Vidéo indisponible</strong></p>
            <p style="color:#64748b;font-size:0.8rem;margin-top:0.5rem;">Recherchez sur YouTube : "${chap.titre.replace(/^P\d+\s*—\s*Practice\s*:\s*/, '')}"</p>
            <p style="color:#64748b;font-size:0.8rem;">Utilisez les sous-titres en anglais pour suivre.</p>
          </div>
        `);
        changed = true;
        console.log(`  ⚠️  ${chap.titre}: vidéo ${deadId} indisponible, message ajouté`);
      }
    }

    if (changed) {
      await db.collection("lecons").updateOne(
        { _id: lecon._id },
        { $set: { contenuHTML: html, updatedAt: new Date() } }
      );
    }
  }

  console.log("\n✅=== PRONUNCIATION RECRÉÉE + LIENS PRACTICE CORRIGÉS ===");
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
