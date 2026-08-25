const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const admin = await db.collection("users").findOne({ role: "admin" });
  const adminId = admin?._id?.toString() || "69dfac0adb8037a014ca9178";

  const matiere = await db.collection("matieres").findOne({ code: "AN-AD" });
  if (!matiere) {
    console.log("❌ Matière AN-AD non trouvée");
    await mongoose.disconnect();
    return;
  }
  const matId = matiere._id.toString();
  const matiereId = new mongoose.Types.ObjectId(matId);

  // Nettoyer anciens chapitres Listening et Vocabulary (pour les recréer)
  const oldToClean = await db.collection("chapitres").find({
    matiereId: matiereId, niveau: "Adulte",
    $or: [
      { titre: { $regex: /^L\d+\s*—\s*Listening/i } },
      { titre: { $regex: /^V\d+\s*—\s*Vocabulary/i } },
    ]
  }).toArray();
  for (const c of oldToClean) {
    await db.collection("lecons").deleteMany({ chapitreId: c._id });
    await db.collection("chapitres").deleteOne({ _id: c._id });
  }
  console.log(`🧹 ${oldToClean.length} anciens chapitres Listening/Vocabulary nettoyés`);

  let ordreStart = 20; // Après les 19 chapitres existants

  async function addChapitre(titre, objectif, contenuHTML, ordre) {
    const chap = await db.collection("chapitres").insertOne({
      matiereId: matiereId, titre, niveau: "Adulte", objectif, ordre, actif: true,
      createdAt: new Date(), updatedAt: new Date()
    });

    await db.collection("lecons").insertOne({
      chapitreId: chap.insertedId, titre, matiere: matId, classe: "Adulte", statut: "publie",
      masque: false, creePar: adminId, contenuHTML, contenuBrut: "",
      dureeExercices: 20,
      contenuFormate: { correctionsTypes: [], exercices: [] },
      createdAt: new Date(), updatedAt: new Date()
    });

    console.log(`  📖 ${titre}`);
    return chap.insertedId;
  }

  // ═══════════════════════════════════════════════════════
  //  LISTENING — 6 chapitres avec liens YouTube
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "L1 — Listening : Introduction & Sounds of English",
    "Apprendre à reconnaître les sons de base de l'anglais et s'entraîner avec des ressources audio",
    `<div class="lecon-anglais">
<h1>🎧 L1 — Listening : Introduction & Sounds of English</h1>

<div class="intro-box">
<p>La compréhension orale est souvent le <strong>plus grand défi</strong> pour les apprenants d'anglais. Ce module vous donne les clés pour développer votre oreille et comprendre les locuteurs natifs.</p>
</div>

<h2>🎯 Objectifs de ce chapitre</h2>
<ul>
<li>Comprendre l'importance de l'écoute active</li>
<li>Apprendre les 44 phonèmes de l'anglais</li>
<li>S'entraîner à distinguer les sons similaires</li>
<li>Développer une routine d'écoute quotidienne</li>
</ul>

<h2>📚 Les 44 phonèmes de l'anglais</h2>

<h3>Voyelles (20)</h3>
<table class="conj-table">
<tr><th>Phonème</th><th>Exemple</th><th>Français</th></tr>
<tr><td>/iː/</td><td>see, meet, tree</td><td>Son "i" long</td></tr>
<tr><td>/ɪ/</td><td>sit, big, fish</td><td>"i" court</td></tr>
<tr><td>/e/</td><td>bed, said, head</td><td>"é" ouvert</td></tr>
<tr><td>/æ/</td><td>cat, bad, man</td><td>"a" ouvert (pas en français)</td></tr>
<tr><td>/ɑː/</td><td>car, father, heart</td><td>"a" très ouvert</td></tr>
<tr><td>/ɒ/</td><td>hot, stop, got</td><td>"o" ouvert</td></tr>
<tr><td>/ɔː/</td><td>door, more, law</td><td>"o" long</td></tr>
<tr><td>/ʊ/</td><td>book, good, look</td><td>"ou" court</td></tr>
<tr><td>/uː/</td><td>food, blue, shoe</td><td>"ou" long</td></tr>
<tr><td>/ʌ/</td><td>cup, love, come</td><td>"u" bref</td></tr>
<tr><td>/ɜː/</td><td>bird, work, nurse</td><td>"eure" (UK)</td></tr>
<tr><td>/ə/</td><td>about, banana, sofa</td><td>"e" muet</td></tr>
</table>

<h3>Consonnes (24)</h3>
<table class="conj-table">
<tr><th>Phonème</th><th>Exemple</th><th>Difficulté</th></tr>
<tr><td>/θ/</td><td>think, bath, teeth</td><td>Langue entre les dents</td></tr>
<tr><td>/ð/</td><td>this, mother, breathe</td><td>Langue entre les dents + voix</td></tr>
<tr><td>/ʃ/</td><td>ship, nation, sure</td><td>Comme "ch" français</td></tr>
<tr><td>/ʒ/</td><td>vision, measure, beige</td><td>"j" mou</td></tr>
<tr><td>/ŋ/</td><td>sing, long, think</td><td>"ng" nasal</td></tr>
<tr><td>/w/</td><td>we, wine, queen</td><td>"ou" bref</td></tr>
<tr><td>/j/</td><td>yes, you, yellow</td><td>"y" français</td></tr>
<tr><td>/r/</td><td>red, run, right</td><td>R roulé (US) ou muet (UK)</td></tr>
</table>

<h2>🎬 Ressources vidéo recommandées</h2>

<div class="example-box">
<h3>📺 Chaînes YouTube pour apprendre la prononciation</h3>
<ul>
<li><strong>English with Lucy</strong> — Prononciation britannique claire et structurée</li>
<li><strong>Rachel's English</strong> — Phonétique américaine détaillée</li>
<li><strong>BBC Learning English</strong> — Cours complets avec sous-titres</li>
<li><strong>English Like A Native</strong> — Anglais authentique au quotidien</li>
</ul>

<h3>🎵 Podcasts pour débutants</h3>
<ul>
<li><strong>6 Minute English (BBC)</strong> — Articles courts sur des sujets variés</li>
<li><strong>EnglishClass101</strong> — Leçons par niveau</li>
<li><strong>All Ears English</strong> — Expressions américaines authentiques</li>
</ul>

<h3>🎬 Séries recommandées avec sous-titres anglais</h3>
<ul>
<li><strong>Friends</strong> — Langage quotidien, humour accessible</li>
<li><strong>The Crown</strong> — Anglais britannique formel</li>
<li><strong>Suits</strong> — Anglais des affaires</li>
</ul>
</div>

<h2>📝 Exercice d'écoute</h2>
<p><strong>Écoutez ce son : /θ/ vs /s/</strong></p>
<ol>
<li>Think vs Sink — Faites la différence</li>
<li>Bath vs Bass — Attention à la voyelle aussi</li>
<li>Teeth vs Tease — Un son avec langue, l'autre sans</li>
</ol>

<h2>💡 Conseils pour progresser</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>Écoutez 15 min/jour</strong> — Mieux que 2h une fois par semaine</div>
<div class="vocab-item"><strong>Commencez avec les sous-titres</strong> — Puis sans, quand vous êtes prêt</div>
<div class="vocab-item"><strong>Imitez ce que vous entendez</strong> — Répétez à voix haute</div>
<div class="vocab-item"><strong>Notez les mots nouveaux</strong> — Créez votre propre vocabulaire</div>
</div>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "L2 — Listening : Numbers, Dates & Times",
    "Maîtriser la compréhension des nombres, dates et heures en anglais oral",
    `<div class="lecon-anglais">
<h1>🎧 L2 — Listening : Numbers, Dates & Times</h1>

<div class="intro-box">
<p>Les nombres, dates et heures sont des <strong>incontournables</strong> de la vie quotidienne. Malheureusement, ils sont souvent prononcés rapidement et de manière réduite, ce qui les rend difficiles à comprendre.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Comprendre les nombres de 0 à 1 000 000</li>
<li>Distinguer les nombres similaires (13 vs 30, 14 vs 40...)</li>
<li>Comprendre les dates et années</li>
<li>Maîtriser les heures et les horaires</li>
</ul>

<h2>🔢 Les nombres — Pièges classiques</h2>

<h3>Nombres teens vs tens</h3>
<table class="conj-table">
<tr><th>Teens (-teen)</th><th>Tens (-ty)</th></tr>
<tr><td>13 — <strong>thir</strong>teen (accent sur la fin)</td><td>30 — <strong>thir</strong>ty (accent sur le début)</td></tr>
<tr><td>14 — four<strong>teen</strong></td><td>40 — <strong>for</strong>ty</td></tr>
<tr><td>15 — fif<strong>teen</strong></td><td>50 — <strong>fif</strong>ty</td></tr>
<tr><td>16 — six<strong>teen</strong></td><td>60 — <strong>six</strong>ty</td></tr>
<tr><td>17 — seven<strong>teen</strong></td><td>70 — <strong>seven</strong>ty</td></tr>
<tr><td>18 — eigh<strong>teen</strong></td><td>80 — <strong>eigh</strong>ty</td></tr>
<tr><td>19 — nine<strong>teen</strong></td><td>90 — <strong>nine</strong>ty</td></tr>
</table>

<h3>Grands nombres</h3>
<div class="example-box">
<p>1,000 — <strong>one thousand</strong></p>
<p>2,500 — <strong>two thousand five hundred</strong> (ou <strong>twenty-five hundred</strong> en US)</p>
<p>1,000,000 — <strong>one million</strong></p>
<p>3,500,000 — <strong>three point five million</strong> (ou <strong>three million five hundred thousand</strong>)</p>
</div>

<h2>📅 Les dates</h2>

<h3>Formats</h3>
<div class="example-box">
<p><strong>UK :</strong> 15 March 2025 → "the fifteenth of March, twenty twenty-five"</p>
<p><strong>US :</strong> March 15, 2025 → "March fifteenth, twenty twenty-five"</p>
<p><strong>Oral rapide :</strong> "March the fifteenth" / "the fifteenth of March"</p>
</div>

<h3>Les mois (à réviser)</h3>
<div class="vocab-grid">
<div class="vocab-item"><strong>January</strong> — /ˈdʒænjuəri/</div>
<div class="vocab-item"><strong>February</strong> — /ˈfebruəri/</div>
<div class="vocab-item"><strong>March</strong> — /mɑːtʃ/</div>
<div class="vocab-item"><strong>April</strong> — /ˈeɪprəl/</div>
<div class="vocab-item"><strong>May</strong> — /meɪ/</div>
<div class="vocab-item"><strong>June</strong> — /dʒuːn/</div>
<div class="vocab-item"><strong>July</strong> — /dʒuˈlaɪ/</div>
<div class="vocab-item"><strong>August</strong> — /ˈɔːɡəst/</div>
<div class="vocab-item"><strong>September</strong> — /sepˈtembə/</div>
<div class="vocab-item"><strong>October</strong> — /ɒkˈtəʊbə/</div>
<div class="vocab-item"><strong>November</strong> — /nəʊˈvembə/</div>
<div class="vocab-item"><strong>December</strong> — /dɪˈsembə/</div>
</div>

<h2>⏰ Les heures</h2>

<h3>Format 12 heures (US / UK informel)</h3>
<div class="example-box">
<p>3:00 AM — "three o'clock in the morning"</p>
<p>3:00 PM — "three o'clock in the afternoon" / "three PM"</p>
<p>6:30 PM — "six thirty" / "half past six"</p>
<p>7:45 AM — "seven forty-five" / "quarter to eight"</p>
</div>

<h3>Expressions de temps courantes</h3>
<div class="vocab-grid">
<div class="vocab-item"><strong>On time</strong> — À l'heure</div>
<div class="vocab-item"><strong>In time</strong> — À temps</div>
<div class="vocab-item"><strong>Just in time</strong> — Juste à temps</div>
<div class="vocab-item"><strong>From... to...</strong> — De... à...</div>
<div class="vocab-item"><strong>Since</strong> — Depuis (point dans le temps)</div>
<div class="vocab-item"><strong>For</strong> — Pendant (durée)</div>
<div class="vocab-item"><strong>Ago</strong> — Il y a</div>
<div class="vocab-item"><strong>Deadline</strong> — Date limite</div>
</div>

<h2>🎬 Exercice d'écoute</h2>
<p><strong>Écoutez et écrivez ce que vous entendez :</strong></p>
<ol>
<li>"The meeting starts at _______"</li>
<li>"My birthday is on the _______ of _______"</li>
<li>"The price is _______ dollars"</li>
<li>"I'll arrive _______ minutes _______"</li>
</ol>

<h2>📝 Tips de compréhension</h2>
<ul>
<li>Prenez des notes en chiffres, pas en lettres</li>
<li>Repérez les mots-clés contextuels ("price", "time", "date")</li>
<li>Demandez de répéter poliment : "Could you repeat the number, please?"</li>
</ul>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "L3 — Listening : Understanding Fast Speech",
    "Décoder l'anglais rapide des locuteurs natifs : liaisons, réductions, contractions",
    `<div class="lecon-anglais">
<h1>🎧 L3 — Listening : Understanding Fast Speech</h1>

<div class="intro-box">
<p>Les locuteurs natifs parlent vite, réduisent les mots, et lient tout ensemble. Ce chapitre vous apprend à <strong>décoder</strong> l'anglais rapide.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Identifier les sons réduits dans la parole rapide</li>
<li>Comprendre les liaisons entre les mots</li>
<li>Reconnaître les contractions orales</li>
<li>Écouter des conversations authentiques</li>
</ul>

<h2>✂️ Les réductions orales</h2>

<table class="verb-table">
<tr><th>Écrit</th><th>Parlé (rapide)</th><th>Exemple</th></tr>
<tr><td>want to</td><td><strong>wanna</strong> /ˈwɒnə/</td><td>"I wanna go."</td></tr>
<tr><td>going to</td><td><strong>gonna</strong> /ˈɡɒnə/</td><td>"I'm gonna leave."</td></tr>
<tr><td>got to</td><td><strong>gotta</strong> /ˈɡɒtə/</td><td>"I gotta run."</td></tr>
<tr><td>have to</td><td><strong>hafta</strong> /ˈhæftə/</td><td>"I hafta work."</td></tr>
<tr><td>has to</td><td><strong>hasta</strong> /ˈhæstə/</td><td>"She hasta go."</td></tr>
<tr><td>don't know</td><td><strong>dunno</strong> /dəˈnəʊ/</td><td>"I dunno."</td></tr>
<tr><td>let me</td><td><strong>lemme</strong> /ˈlemɪ/</td><td>"Lemme see."</td></tr>
<tr><td>give me</td><td><strong>gimme</strong> /ˈɡɪmɪ/</td><td>"Gimme a minute."</td></tr>
<tr><td>should have</td><td><strong>shoulda</strong> /ˈʃʊdə/</td><td>"I shoulda called."</td></tr>
<tr><td>could have</td><td><strong>coulda</strong> /ˈkʊdə/</td><td>"I coulda won."</td></tr>
<tr><td>would have</td><td><strong>woulda</strong> /ˈwʊdə/</td><td>"I woulda helped."</td></tr>
<tr><td>kind of</td><td><strong>kinda</strong> /ˈkaɪndə/</td><td>"It's kinda cold."</td></tr>
<tr><td>sort of</td><td><strong>sorta</strong> /ˈsɔːtə/</td><td>"I'm sorta tired."</td></tr>
</table>

<h2>🔗 Les liaisons (Linking)</h2>

<div class="example-box">
<h3>Règles de liaison</h3>
<p><strong>Consonne + Voyelle :</strong> Les mots se collent</p>
<ul>
<li>"an apple" → /ə<strong>næ</strong>pəl/</li>
<li>"pick up" → /pɪ<strong>kʌ</strong>p/</li>
<li>"turn on" → /tɜː<strong>nɒ</strong>n/</li>
</ul>

<p><strong>T + Y = CH :</strong></p>
<ul>
<li>"don't you" → /dəʊ<strong>ntʃu</strong>/</li>
<li>"can't you" → /kɑː<strong>ntʃu</strong>/</li>
<li>"meet you" → /miː<strong>tʃu</strong>/</li>
</ul>

<p><strong>D + Y = J :</strong></p>
<ul>
<li>"did you" → /dɪ<strong>dʒu</strong>/</li>
<li>"would you" → /wʊ<strong>dʒu</strong>/</li>
<li>"had you" → /hæ<strong>dʒu</strong>/</li>
</ul>

<p><strong>S + Y = SH :</strong></p>
<ul>
<li>"miss you" → /mɪ<strong>ʃu</strong>/</li>
<li>"bless you" → /ble<strong>ʃu</strong>/</li>
</ul>
</div>

<h2>💬 Dialogue — Conversation rapide</h2>
<div class="dialogue-box">
<p><strong>A:</strong> "Hey, whaddaya <strong>wanna</strong> do tonight?" <em>(Hey, qu'est-ce que tu veux faire ce soir ?)</em></p>
<p><strong>B:</strong> "I <strong>dunno</strong>. <strong>Lemme</strong> think... <strong>Kinda</strong> tired, actually." <em>(Je sais pas. Laisse-moi réfléchir... Plutôt fatigué, en fait.)</em></p>
<p><strong>A:</strong> "You <strong>gotta</strong> come out! It's <strong>gonna</strong> be fun!" <em>(Tu dois sortir ! Ça va être fun !)</em></p>
<p><strong>B:</strong> "Alright, <strong>gimme</strong> ten minutes. I <strong>hafta</strong> change first." <em>(D'accord, donne-moi dix minutes. Je dois d'abord me changer.)</em></p>
</div>

<h2>🎬 Ressources pour s'entraîner</h2>
<div class="example-box">
<h3>Vidéos YouTube recommandées</h3>
<ul>
<li><strong>English with Lucy</strong> — "How to Understand Fast English Speakers"</li>
<li><strong>Rachel's English</strong> — Séries sur les réductions orales</li>
<li><strong>English Like A Native</strong> — Conversations authentiques avec transcriptions</li>
</ul>

<h3>Exercice pratique</h3>
<p>Écoutez une vidéo YouTube en anglais (avec sous-titres) :</p>
<ol>
<li>1ère écoute : écoutez sans sous-titres — qu'est-ce que vous avez compris ?</li>
<li>2ème écoute : écoutez avec les sous-titres anglais — notez les mots manquants</li>
<li>3ème écoute : écoutez sans sous-titres — avez-vous progressé ?</li>
</ol>
</div>

<h2>📝 Astuces pour suivre une conversation rapide</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>Ne paniquez pas</strong> — Même les natifs ne comprennent pas tout</div>
<div class="vocab-item"><strong>Concentrez-vous sur les mots-clés</strong> — Noms, verbes, adjectifs</div>
<div class="vocab-item"><strong>Utilisez le contexte</strong> — Le reste du dialogue vous aidera</div>
<div class="vocab-item"><strong>Demandez de ralentir</strong> — "Could you speak more slowly, please?"</div>
</div>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "L4 — Listening : British vs American Accents",
    "Distinguer et comprendre les accents britannique et américain",
    `<div class="lecon-anglais">
<h1>🎧 L4 — Listening : British vs American Accents</h1>

<div class="intro-box">
<p>L'anglais britannique et américain ont des différences de prononciation, de vocabulaire et même de grammaire. Savoir les reconnaître vous aide à comprendre les deux.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Reconnaître les différences de prononciation clés</li>
<li>Comprendre le vocabulaire différent entre UK et US</li>
<li>S'adapter aux deux accents</li>
</ul>

<h2>🔊 Différences de prononciation</h2>

<table class="compare-table">
<tr><th>Mot</th><th>Britannique (UK)</th><th>Américain (US)</th></tr>
<tr><td>water</td><td>/ˈwɔː.tə/ (pas de R)</td><td>/ˈwɔː.t̬ɚ/ (R prononcé)</td></tr>
<tr><td>car</td><td>/kɑː/ (pas de R)</td><td>/kɑːr/ (R prononcé)</td></tr>
<tr><td>dance</td><td>/dɑːns/ (a ouvert)</td><td>/dæns/ (a fermé)</td></tr>
<tr><td>can't</td><td>/kɑːnt/</td><td>/kænt/</td></tr>
<tr><td>better</td><td>/ˈbet.ə/</td><td>/ˈbe.t̬ɚ/ (T devient D)</td></tr>
<tr><td>bottle</td><td>/ˈbɒt.əl/ (T clair)</td><td>/ˈbɑː.t̬əl/ (T devient D)</td></tr>
<tr><td>schedule</td><td>/ˈʃed.juːl/</td><td>/ˈskedʒ.uːl/</td></tr>
<tr><td>advertisement</td><td>/ədˈvɜː.tɪs.mənt/</td><td>/ˌæd.vɚˈtaɪz.mənt/</td></tr>
</table>

<h2>📚 Vocabulaire UK vs US</h2>

<table class="verb-table">
<tr><th>Sens</th><th>Britannique</th><th>Américain</th></tr>
<tr><td>Appartement</td><td>flat</td><td>apartment</td></tr>
<tr><td>Ascenseur</td><td>lift</td><td>elevator</td></tr>
<tr><td>Camion</td><td>lorry</td><td>truck</td></tr>
<tr><td>Essence</td><td>petrol</td><td>gas / gasoline</td></tr>
<tr><td>Frites</td><td>chips</td><td>fries</td></tr>
<tr><td>Chips (paquet)</td><td>crisps</td><td>chips</td></tr>
<tr><td>Poubelle</td><td>bin</td><td>trash can</td></tr>
<tr><td>Jardin</td><td>garden</td><td>yard</td></tr>
<tr><td>Mail</td><td>post</td><td>mail</td></tr>
<tr><td>Trousers</td><td>trousers</td><td>pants</td></tr>
<tr><td>Pants (sous-vêtements)</td><td>pants / underwear</td><td>underwear</td></tr>
<tr><td>Autoroute</td><td>motorway</td><td>highway / freeway</td></tr>
<tr><td>Traverser (rue)</td><td>cross the road</td><td>cross the street</td></tr>
<tr><td>Ground floor</td><td>ground floor</td><td>first floor</td></tr>
<tr><td>First floor</td><td>first floor</td><td>second floor</td></tr>
</table>

<h2>🎬 Ressources recommandées</h2>
<div class="example-box">
<h3>Pour l'accent britannique</h3>
<ul>
<li><strong>The Crown</strong> (Netflix) — Anglais royal/formel</li>
<li><strong>Peaky Blinders</strong> — Accent Birmingham (difficile !)</li>
<li><strong>BBC News</strong> — Anglais standard UK</li>
</ul>

<h3>Pour l'accent américain</h3>
<ul>
<li><strong>Friends</strong> — Anglais quotidien neutre</li>
<li><strong>The Office (US)</strong> — Expressions américaines</li>
<li><strong>CNN / NBC News</strong> — Anglais des médias US</li>
</ul>
</div>

<h2>💡 Conseil final</h2>
<p>Choisissez <strong>un accent principal</strong> à maîtriser (celui qui vous est le plus utile), mais soyez capable de <strong>comprendre les deux</strong>.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "L5 — Listening : News & Media",
    "Comprendre les informations télévisées, podcasts et médias en anglais",
    `<div class="lecon-anglais">
<h1>🎧 L5 — Listening : News & Media</h1>

<div class="intro-box">
<p>Les médias anglophones sont une excellente source pour progresser. Ce chapitre vous apprend à comprendre les journaux télévisés, podcasts d'actualité, et documentaires.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Comprendre le vocabulaire des médias</li>
<li>Suivre un journal télévisé en anglais</li>
<li>Écouter des podcasts d'actualité</li>
<li>Utiliser les médias comme outil d'apprentissage</li>
</ul>

<h2>📺 Vocabulaire des médias</h2>

<div class="vocab-grid">
<div class="vocab-item"><strong>Breaking news</strong> — Dernières nouvelles</div>
<div class="vocab-item"><strong>Headlines</strong> — Titres / Gros titres</div>
<div class="vocab-item"><strong>Reporter / Journalist</strong> — Journaliste</div>
<div class="vocab-item"><strong>Anchor / Presenter</strong> — Présentateur</div>
<div class="vocab-item"><strong>Broadcast</strong> — Diffusion / Émission</div>
<div class="vocab-item"><strong>Live</strong> — En direct</div>
<div class="vocab-item"><strong>Interview</strong> — Entretien</div>
<div class="vocab-item"><strong>Source</strong> — Source</div>
<div class="vocab-item"><strong>Official / Unofficial</strong> — Officiel / Officieux</div>
<div class="vocab-item"><strong>Rumors</strong> — Rumeurs</div>
<div class="vocab-item"><strong>Statement</strong> — Déclaration</div>
<div class="vocab-item"><strong>Press conference</strong> — Conférence de presse</div>
</div>

<h2>📻 Chaînes et podcasts recommandés</h2>

<div class="example-box">
<h3>🇬🇧 Médias britanniques</h3>
<ul>
<li><strong>BBC News</strong> — Anglais clair, sous-titres disponibles</li>
<li><strong>The Guardian Podcasts</strong> — Analyses approfondies</li>
<li><strong>Today (BBC Radio 4)</strong> — Actualités du matin</li>
</ul>

<h3>🇺🇸 Médias américains</h3>
<ul>
<li><strong>CNN 10</strong> — Journal de 10 min pour les étudiants</li>
<li><strong>NPR</strong> — Podcasts d'actualité variés</li>
<li><strong>The Daily (NYT)</strong> — Un sujet par jour, en profondeur</li>
</ul>

<h3>🌍 Médias internationaux</h3>
<ul>
<li><strong>Al Jazeera English</strong> — Perspective internationale</li>
<li><strong>France 24 English</strong> — Actualités francophones en anglais</li>
</ul>
</div>

<h2>📝 Technique d'écoute : Le "3-pass method"</h2>

<div class="example-box">
<h3>Pass 1 — Écoute globale (sans sous-titres)</h3>
<p>Quel est le sujet principal ? Qui parle ? Quel est le ton ?</p>

<h3>Pass 2 — Écoute détaillée (avec sous-titres anglais)</h3>
<p>Notez les mots nouveaux. Comprenez chaque phrase.</p>

<h3>Pass 3 — Écoute active (sans sous-titres)</h3>
<p>Pouvez-vous résumer l'article en 3 phrases ?</p>
</div>

<h2>💡 Conseils</h2>
<ul>
<li>Commencez par des sujets que vous connaissez déjà</li>
<li>Utilisez la vitesse 0.75x si c'est trop rapide</li>
<li>Écoutez le même reportage plusieurs fois</li>
</ul>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "L6 — Listening : Songs & Movies",
    "Apprendre l'anglais avec la musique et les films",
    `<div class="lecon-anglais">
<h1>🎧 L6 — Listening : Songs & Movies</h1>

<div class="intro-box">
<p>La musique et le cinéma sont des outils <strong>puissants</strong> pour apprendre l'anglais. Ils rendent l'apprentissage ludique et mémorable.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Utiliser les chansons pour améliorer la prononciation</li>
<li>Apprendre le vocabulaire à travers les films</li>
<li>Comprendre les expressions idiomatiques culturelles</li>
</ul>

<h2>🎵 Chansons recommandées par niveau</h2>

<div class="example-box">
<h3>Débutant — Paroles claires, lent</h3>
<ul>
<li><strong>"Hello" — Adele</strong> — Prononciation claire, vocabulaire simple</li>
<li><strong>"Perfect" — Ed Sheeran</strong> — Love story, vocabulaire quotidien</li>
<li><strong>"Count on Me" — Bruno Mars</strong> — Amitié, paroles répétitives</li>
<li><strong>"Lemon Tree" — Fool's Garden</strong> — Passé simple, vocabulaire simple</li>
</ul>

<h3>Intermédiaire — Plus de vocabulaire</h3>
<ul>
<li><strong>"Shape of You" — Ed Sheeran</strong> — Expressions modernes</li>
<li><strong>"Cheap Thrills" — Sia</strong> — Vocabulaire de la fête</li>
<li><strong>"Roar" — Katy Perry</strong> — Métaphores, empowerment</li>
<li><strong>"Fix You" — Coldplay</strong> — Émotions, expressions</li>
</ul>

<h3>Avancé — Paroles rapides ou complexes</h3>
<ul>
<li><strong>"Rap God" — Eminem</strong> — Rap ultra-rapide (défi !)</li>
<li><strong>"Bohemian Rhapsody" — Queen</strong> — Vocabulaire riche</li>
<li><strong>"Hotel California" — Eagles</strong> — Métaphores complexes</li>
</ul>
</div>

<h2>🎬 Films recommandés avec sous-titres</h2>

<div class="example-box">
<h3>Pour débutants</h3>
<ul>
<li><strong>The Lion King</strong> — Dialogues simples, émotions claires</li>
<li><strong>Finding Nemo</strong> — Vocabulaire familial</li>
<li><strong>Forrest Gump</strong> — Southern accent, histoire linéaire</li>
</ul>

<h3>Pour intermédiaires</h3>
<ul>
<li><strong>The Social Network</strong> — Anglais des affaires/tech</li>
<li><strong>The Pursuit of Happyness</strong> — Vocabulaire quotidien</li>
<li><strong>Love Actually</strong> — Anglais britannique varié</li>
</ul>

<h3>Pour avancés</h3>
<ul>
<li><strong>The Crown</strong> — Anglais royal, historique</li>
<li><strong>Suits</strong> — Juridique, des affaires</li>
<li><strong>Breaking Bad</strong> — Slang américain, expressions</li>
</ul>
</div>

<h2>📝 Méthode d'apprentissage avec une chanson</h2>
<ol>
<li><strong>Écoutez</strong> la chanson sans lire les paroles</li>
<li><strong>Lisez</strong> les paroles en écoutant</li>
<li><strong>Notez</strong> les mots/expressions nouvelles</li>
<li><strong>Chantez</strong> avec l'artiste</li>
<li><strong>Chantez</strong> sans l'aide — vous apprenez par cœur !</li>
</ol>

<h2>💡 Conseil</h2>
<p>Utilisez <strong>LyricsTraining.com</strong> — un jeu où vous devez remplir les mots manquants dans les paroles. Très addictif et efficace !</p>
</div>`,
    ordreStart++
  );

  // ═══════════════════════════════════════════════════════
  //  VOCABULARY — 6 chapitres avec textes et vocabulaire
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "V1 — Vocabulary : Family & Relationships",
    "Maîtriser le vocabulaire de la famille, des relations et des émotions",
    `<div class="lecon-anglais">
<h1>📚 V1 — Vocabulary : Family & Relationships</h1>

<div class="intro-box">
<p>Parler de sa famille, de ses amis et de ses relations est incontournable. Ce chapitre vous donne tout le vocabulaire nécessaire.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Décrire sa famille en détail</li>
<li>Parler des relations et des émotions</li>
<li>Utiliser le vocabulaire des sentiments</li>
</ul>

<h2>📖 Texte — My Family</h2>

<div class="dialogue-box">
<p>I come from a <strong>large family</strong>. I have two <strong>siblings</strong> — an older <strong>brother</strong> and a younger <strong>sister</strong>. My <strong>parents</strong> live in Dakar, where my father works as an <strong>engineer</strong> and my mother is a <strong>teacher</strong>.</p>
<p>My <strong>extended family</strong> is also very close. My <strong>grandparents</strong> on my mother's side live nearby, and I have many <strong>cousins</strong>, <strong>aunts</strong>, and <strong>uncles</strong>. We often have <strong>family gatherings</strong> during holidays.</p>
<p>I am very <strong>grateful</strong> for my family. They are always <strong>supportive</strong> and <strong>encouraging</strong>. Even when we <strong>disagree</strong>, we know that we <strong>love</strong> each other deeply.</p>
</div>

<h2>📝 Vocabulaire du texte</h2>

<div class="vocab-grid">
<div class="vocab-item"><strong>large family</strong> — Grande famille</div>
<div class="vocab-item"><strong>siblings</strong> — Frères et sœurs</div>
<div class="vocab-item"><strong>older brother</strong> — Grand frère</div>
<div class="vocab-item"><strong>younger sister</strong> — Petite sœur</div>
<div class="vocab-item"><strong>parents</strong> — Parents</div>
<div class="vocab-item"><strong>engineer</strong> — Ingénieur</div>
<div class="vocab-item"><strong>teacher</strong> — Enseignant</div>
<div class="vocab-item"><strong>extended family</strong> — Famille élargie</div>
<div class="vocab-item"><strong>grandparents</strong> — Grands-parents</div>
<div class="vocab-item"><strong>cousins</strong> — Cousins</div>
<div class="vocab-item"><strong>aunts</strong> — Tantes</div>
<div class="vocab-item"><strong>uncles</strong> — Oncles</div>
<div class="vocab-item"><strong>family gatherings</strong> — Réunions de famille</div>
<div class="vocab-item"><strong>grateful</strong> — Reconnaissant</div>
<div class="vocab-item"><strong>supportive</strong> — Soutenant</div>
<div class="vocab-item"><strong>encouraging</strong> — Encourageant</div>
<div class="vocab-item"><strong>disagree</strong> — Être en désaccord</div>
<div class="vocab-item"><strong>love</strong> — Aimer</div>
</div>

<h2>❤️ Vocabulaire des émotions</h2>

<table class="verb-table">
<tr><th>Positif</th><th>Négatif</th><th>Neutre</th></tr>
<tr><td>Happy — Heureux</td><td>Sad — Triste</td><td>Surprised — Surpris</td></tr>
<tr><td>Excited — Excité</td><td>Angry — En colère</td><td>Confused — Confus</td></tr>
<tr><td>Proud — Fier</td><td>Scared — Effrayé</td><td>Curious — Curieux</td></tr>
<tr><td>Grateful — Reconnaissant</td><td>Disappointed — Déçu</td><td>Tired — Fatigué</td></tr>
<tr><td>Relieved — Soulagé</td><td>Embarrassed — Gêné</td><td>Bored — Ennuyé</td></tr>
<tr><td>Hopeful — Plein d'espoir</td><td>Jealous — Jaloux</td><td>Shocked — Choqué</td></tr>
</table>

<h2>💬 Dialogue — Talking about family</h2>
<div class="dialogue-box">
<p><strong>A:</strong> "Tell me about your family. Do you have any siblings?"</p>
<p><strong>B:</strong> "Yes, I have an older brother. He's a doctor in Paris. What about you?"</p>
<p><strong>A:</strong> "I'm an only child, but I'm very close to my cousins. We grew up together."</p>
<p><strong>B:</strong> "That sounds nice. Family is so important. I'm really grateful for mine."</p>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Décrivez votre famille en 8-10 phrases.</strong> Utilisez au moins 8 mots du vocabulaire ci-dessus.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "V2 — Vocabulary : Work & Career",
    "Maîtriser le vocabulaire du monde professionnel et des métiers",
    `<div class="lecon-anglais">
<h1>📚 V2 — Vocabulary : Work & Career</h1>

<div class="intro-box">
<p>Que vous cherchiez un emploi, travailliez en entreprise, ou parliez de votre carrière, ce chapitre vous donne le vocabulaire essentiel.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Décrire son métier et ses responsabilités</li>
<li>Comprendre le vocabulaire des ressources humaines</li>
<li>Parler de ses ambitions professionnelles</li>
</ul>

<h2>📖 Texte — A Day at the Office</h2>

<div class="dialogue-box">
<p>Every morning, I <strong>commute</strong> to work by bus. It takes about 45 minutes. When I arrive at the <strong>office</strong>, I check my <strong>emails</strong> and plan my <strong>schedule</strong> for the day.</p>
<p>I work as a <strong>marketing manager</strong> for a tech company. My main <strong>responsibilities</strong> include managing social media campaigns, analyzing <strong>data</strong>, and <strong>coordinating</strong> with the sales team. I also <strong>attend</strong> meetings with clients and <strong>present</strong> our products.</p>
<p>At noon, I usually have <strong>lunch</strong> with my <strong>colleagues</strong>. We talk about work, but also about our personal lives. It's a good way to <strong>relax</strong> before the afternoon.</p>
<p>I typically <strong>finish work</strong> at 6 PM. Sometimes I have to <strong>work overtime</strong> when we have an important <strong>deadline</strong>. But I try to maintain a good <strong>work-life balance</strong>.</p>
</div>

<h2>📝 Vocabulaire du texte</h2>

<div class="vocab-grid">
<div class="vocab-item"><strong>commute</strong> — Faire le trajet domicile-travail</div>
<div class="vocab-item"><strong>office</strong> — Bureau</div>
<div class="vocab-item"><strong>emails</strong> — Emails</div>
<div class="vocab-item"><strong>schedule</strong> — Emploi du temps / Planning</div>
<div class="vocab-item"><strong>marketing manager</strong> — Responsable marketing</div>
<div class="vocab-item"><strong>responsibilities</strong> — Responsabilités</div>
<div class="vocab-item"><strong>data</strong> — Données</div>
<div class="vocab-item"><strong>coordinating</strong> — Coordonner</div>
<div class="vocab-item"><strong>attend</strong> — Assister à / Participer</div>
<div class="vocab-item"><strong>present</strong> — Présenter</div>
<div class="vocab-item"><strong>colleagues</strong> — Collègues</div>
<div class="vocab-item"><strong>relax</strong> — Se détendre</div>
<div class="vocab-item"><strong>finish work</strong> — Finir le travail</div>
<div class="vocab-item"><strong>work overtime</strong> — Faire des heures supplémentaires</div>
<div class="vocab-item"><strong>deadline</strong> — Date butoir</div>
<div class="vocab-item"><strong>work-life balance</strong> — Équilibre vie pro / vie perso</div>
</div>

<h2>💼 Métiers et professions</h2>

<table class="verb-table">
<tr><th>Métier</th><th>Traduction</th><th>Lieu de travail</th></tr>
<tr><td>Doctor</td><td>Médecin</td><td>Hospital / Clinic</td></tr>
<tr><td>Teacher</td><td>Enseignant</td><td>School / University</td></tr>
<tr><td>Engineer</td><td>Ingénieur</td><td>Company / Factory</td></tr>
<tr><td>Lawyer</td><td>Avocat</td><td>Law firm / Court</td></tr>
<tr><td>Accountant</td><td>Comptable</td><td>Office</td></tr>
<tr><td>Chef</td><td>Chef cuisinier</td><td>Restaurant</td></tr>
<tr><td>Journalist</td><td>Journaliste</td><td>Newsroom</td></tr>
<tr><td>Developer</td><td>Développeur</td><td>Tech company</td></tr>
<tr><td>Consultant</td><td>Consultant</td><td>Various clients</td></tr>
<tr><td>Entrepreneur</td><td>Entrepreneur</td><td>Own business</td></tr>
</table>

<h2>💬 Dialogue — At a networking event</h2>
<div class="dialogue-box">
<p><strong>A:</strong> "Hi, I'm James. What do you do?"</p>
<p><strong>B:</strong> "Nice to meet you, James. I'm Aminata. I work in marketing for a tech startup."</p>
<p><strong>A:</strong> "That sounds interesting! What does your day-to-day look like?"</p>
<p><strong>B:</strong> "I manage our social media campaigns and coordinate with the sales team. It's busy but rewarding. How about you?"</p>
<p><strong>A:</strong> "I'm a software developer. I mostly work from home, which gives me a good work-life balance."</p>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Décrivez votre journée de travail typique en 8-10 phrases.</strong> Utilisez au moins 6 mots du vocabulaire ci-dessus.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "V3 — Vocabulary : Health & Body",
    "Maîtriser le vocabulaire de la santé, du corps et des symptômes",
    `<div class="lecon-anglais">
<h1>📚 V3 — Vocabulary : Health & Body</h1>

<div class="intro-box">
<p>Parler de sa santé, décrire des symptômes, et comprendre un médecin sont essentiels. Ce chapitre vous équipe pour toutes ces situations.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Nommer les parties du corps</li>
<li>Décrire des symptômes et douleurs</li>
<li>Communiquer avec un professionnel de santé</li>
</ul>

<h2>📖 Texte — At the Doctor's Office</h2>

<div class="dialogue-box">
<p>"Good morning, Doctor. I've been feeling unwell for three days."</p>
<p>"What are your symptoms?"</p>
<p>"I have a <strong>headache</strong>, a <strong>sore throat</strong>, and I feel <strong>feverish</strong>. I also have a <strong>runny nose</strong> and I keep <strong>sneezing</strong>."</p>
<p>"Let me check your <strong>temperature</strong>. Hmm, you have a slight <strong>fever</strong>. Let me listen to your <strong>chest</strong> with my <strong>stethoscope</strong>. Breathe in deeply, please."</p>
<p>"It sounds like you have a <strong>cold</strong>. I'll prescribe some <strong>medication</strong>. Take one <strong>tablet</strong> three times a day after <strong>meals</strong>. Drink plenty of <strong>fluids</strong> and <strong>rest</strong> for a few days."</p>
<p>"Thank you, Doctor. Should I come back if it gets worse?"</p>
<p>"Yes, if your <strong>condition</strong> doesn't improve after five days, please <strong>schedule</strong> another <strong>appointment</strong>."</p>
</div>

<h2>📝 Vocabulaire du texte</h2>

<div class="vocab-grid">
<div class="vocab-item"><strong>unwell</strong> — Indisposé / Pas bien</div>
<div class="vocab-item"><strong>symptoms</strong> — Symptômes</div>
<div class="vocab-item"><strong>headache</strong> — Mal de tête</div>
<div class="vocab-item"><strong>sore throat</strong> — Mal de gorge</div>
<div class="vocab-item"><strong>feverish</strong> — Fiévreux</div>
<div class="vocab-item"><strong>runny nose</strong> — Nez qui coule</div>
<div class="vocab-item"><strong>sneezing</strong> — Éternuer</div>
<div class="vocab-item"><strong>temperature</strong> — Température</div>
<div class="vocab-item"><strong>fever</strong> — Fièvre</div>
<div class="vocab-item"><strong>chest</strong> — Poitrine</div>
<div class="vocab-item"><strong>stethoscope</strong> — Stéthoscope</div>
<div class="vocab-item"><strong>cold</strong> — Rhume</div>
<div class="vocab-item"><strong>medication</strong> — Médicament</div>
<div class="vocab-item"><strong>tablet</strong> — Comprimé</div>
<div class="vocab-item"><strong>meals</strong> — Repas</div>
<div class="vocab-item"><strong>fluids</strong> — Liquides</div>
<div class="vocab-item"><strong>rest</strong> — Repos</div>
<div class="vocab-item"><strong>condition</strong> — État / Condition</div>
<div class="vocab-item"><strong>schedule</strong> — Planifier</div>
<div class="vocab-item"><strong>appointment</strong> — Rendez-vous</div>
</div>

<h2>🦴 Parties du corps</h2>

<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Head</td><td>Tête</td></tr>
<tr><td>Eye / Eyes</td><td>Œil / Yeux</td></tr>
<tr><td>Nose</td><td>Nez</td></tr>
<tr><td>Mouth</td><td>Bouche</td></tr>
<tr><td>Ear / Ears</td><td>Oreille(s)</td></tr>
<tr><td>Neck</td><td>Cou</td></tr>
<tr><td>Shoulder</td><td>Épaule</td></tr>
<tr><td>Arm</td><td>Bras</td></tr>
<tr><td>Hand</td><td>Main</td></tr>
<tr><td>Finger</td><td>Doigt</td></tr>
<tr><td>Chest</td><td>Poitrine</td></tr>
<tr><td>Stomach / Belly</td><td>Ventre</td></tr>
<tr><td>Back</td><td>Dos</td></tr>
<tr><td>Leg</td><td>Jambe</td></tr>
<tr><td>Knee</td><td>Genou</td></tr>
<tr><td>Foot / Feet</td><td>Pied / Pieds</td></tr>
</table>

<h2>💬 Dialogue — At the pharmacy</h2>
<div class="dialogue-box">
<p><strong>Pharmacist:</strong> "Can I help you?"</p>
<p><strong>Customer:</strong> "Yes, I need something for a headache. And do you have cough syrup?"</p>
<p><strong>Pharmacist:</strong> "For the headache, these tablets work well. For the cough, this syrup is very effective. Do you have any allergies?"</p>
<p><strong>Customer:</strong> "No, I'm not allergic to anything. How often should I take these?"</p>
<p><strong>Pharmacist:</strong> "Take one tablet every 4 hours, and one spoon of syrup three times a day. If you don't feel better in three days, see a doctor."</p>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Décrivez 3 symptômes que vous avez déjà eus.</strong> Utilisez le vocabulaire du texte.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "V4 — Vocabulary : Technology & Internet",
    "Maîtriser le vocabulaire de la technologie, d'Internet et des réseaux sociaux",
    `<div class="lecon-anglais">
<h1>📚 V4 — Vocabulary : Technology & Internet</h1>

<div class="intro-box">
<p>Dans le monde numérique d'aujourd'hui, savoir parler de technologie en anglais est indispensable. Ce chapitre couvre tout le vocabulaire tech essentiel.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Décrire du matériel informatique et des applications</li>
<li>Parler des réseaux sociaux et d'Internet</li>
<li>Résoudre des problèmes techniques</li>
</ul>

<h2>📖 Texte — A Digital Day</h2>

<div class="dialogue-box">
<p>Every morning, the first thing I do is check my <strong>smartphone</strong>. I <strong>scroll</strong> through my <strong>social media</strong> feeds — <strong>Instagram</strong>, <strong>Twitter</strong>, and <strong>LinkedIn</strong>. Then I check my <strong>emails</strong> on my <strong>laptop</strong>.</p>
<p>For work, I use many <strong>apps</strong> and <strong>software</strong>. We communicate through <strong>Slack</strong> and have video meetings on <strong>Zoom</strong>. All our files are stored in the <strong>cloud</strong> — mostly on <strong>Google Drive</strong> and <strong>Dropbox</strong>.</p>
<p>Yesterday, my <strong>Wi-Fi</strong> stopped working. I had to <strong>restart</strong> my <strong>router</strong> and check the <strong>cables</strong>. It turned out the problem was with my <strong>Internet provider</strong>. After calling their <strong>customer service</strong>, they fixed it remotely.</p>
<p>In the evening, I like to <strong>stream</strong> movies on <strong>Netflix</strong> or play video games on my <strong>console</strong>. Technology makes life easier, but sometimes I need a <strong>digital detox</strong> — a day without screens!</p>
</div>

<h2>📝 Vocabulaire du texte</h2>

<div class="vocab-grid">
<div class="vocab-item"><strong>smartphone</strong> — Smartphone</div>
<div class="vocab-item"><strong>scroll</strong> — Faire défiler</div>
<div class="vocab-item"><strong>social media</strong> — Réseaux sociaux</div>
<div class="vocab-item"><strong>feeds</strong> — Flux / Fil d'actualité</div>
<div class="vocab-item"><strong>emails</strong> — Emails</div>
<div class="vocab-item"><strong>laptop</strong> — Ordinateur portable</div>
<div class="vocab-item"><strong>apps</strong> — Applications</div>
<div class="vocab-item"><strong>software</strong> — Logiciel</div>
<div class="vocab-item"><strong>cloud</strong> — Cloud / Nuage</div>
<div class="vocab-item"><strong>Wi-Fi</strong> — Wi-Fi</div>
<div class="vocab-item"><strong>restart</strong> — Redémarrer</div>
<div class="vocab-item"><strong>router</strong> — Routeur</div>
<div class="vocab-item"><strong>cables</strong> — Câbles</div>
<div class="vocab-item"><strong>Internet provider</strong> — Fournisseur d'accès Internet</div>
<div class="vocab-item"><strong>customer service</strong> — Service client</div>
<div class="vocab-item"><strong>stream</strong> — Streamer / Diffuser</div>
<div class="vocab-item"><strong>console</strong> — Console</div>
<div class="vocab-item"><strong>digital detox</strong> — Détox numérique</div>
</div>

<h2>💻 Vocabulaire tech essentiel</h2>

<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Computer / PC</td><td>Ordinateur</td></tr>
<tr><td>Keyboard</td><td>Clavier</td></tr>
<tr><td>Mouse</td><td>Souris</td></tr>
<tr><td>Screen / Monitor</td><td>Écran</td></tr>
<tr><td>Printer</td><td>Imprimante</td></tr>
<tr><td>Headphones</td><td>Casque audio</td></tr>
<tr><td>Charger</td><td>Chargeur</td></tr>
<tr><td>Battery</td><td>Batterie</td></tr>
<tr><td>Password</td><td>Mot de passe</td></tr>
<tr><td>Username</td><td>Nom d'utilisateur</td></tr>
<tr><td>Download</td><td>Télécharger</td></tr>
<tr><td>Upload</td><td>Mettre en ligne</td></tr>
<tr><td>Update</td><td>Mettre à jour</td></tr>
<tr><td>Backup</td><td>Sauvegarde</td></tr>
<tr><td>Virus</td><td>Virus</td></tr>
<tr><td>Browser</td><td>Navigateur</td></tr>
</table>

<h2>💬 Dialogue — Tech support</h2>
<div class="dialogue-box">
<p><strong>Support:</strong> "Tech support, how can I help you?"</p>
<p><strong>User:</strong> "Hi, I can't connect to the Wi-Fi. It says 'password incorrect' but I'm sure it's right."</p>
<p><strong>Support:</strong> "Have you tried restarting your router?"</p>
<p><strong>User:</strong> "Yes, twice. The lights are on but my laptop still won't connect."</p>
<p><strong>Support:</strong> "Let's try forgetting the network and reconnecting. Go to your Wi-Fi settings..."</p>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Décrivez votre utilisation quotidienne de la technologie.</strong> Utilisez au moins 8 mots du vocabulaire.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "V5 — Vocabulary : Environment & Nature",
    "Maîtriser le vocabulaire de l'environnement, de la nature et du climat",
    `<div class="lecon-anglais">
<h1>📚 V5 — Vocabulary : Environment & Nature</h1>

<div class="intro-box">
<p>Parler de l'environnement, du climat et de la nature est de plus en plus important. Ce chapitre vous donne le vocabulaire pour débattre de ces sujets cruciaux.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Décrire la météo et les saisons</li>
<li>Parler de l'environnement et du changement climatique</li>
<li>Utiliser le vocabulaire de la nature et des animaux</li>
</ul>

<h2>📖 Texte — Our Changing Planet</h2>

<div class="dialogue-box">
<p>The Earth is facing many <strong>environmental challenges</strong>. <strong>Climate change</strong> is causing <strong>rising temperatures</strong>, <strong>melting ice caps</strong>, and <strong>extreme weather events</strong> like <strong>hurricanes</strong> and <strong>droughts</strong>.</p>
<p>Many species are <strong>endangered</strong> due to <strong>deforestation</strong> and <strong>pollution</strong>. Our <strong>oceans</strong> are full of <strong>plastic waste</strong>, and the air in big cities is often <strong>polluted</strong>.</p>
<p>However, there is hope. People are adopting <strong>sustainable</strong> lifestyles. We can use <strong>renewable energy</strong> like <strong>solar</strong> and <strong>wind power</strong>. We can <strong>recycle</strong>, <strong>reduce</strong> waste, and <strong>reuse</strong> products.</p>
<p>Every small action counts. Planting <strong>trees</strong>, saving <strong>water</strong>, and using <strong>public transportation</strong> can make a big difference for future <strong>generations</strong>.</p>
</div>

<h2>📝 Vocabulaire du texte</h2>

<div class="vocab-grid">
<div class="vocab-item"><strong>environmental challenges</strong> — Défis environnementaux</div>
<div class="vocab-item"><strong>climate change</strong> — Changement climatique</div>
<div class="vocab-item"><strong>rising temperatures</strong> — Hausse des températures</div>
<div class="vocab-item"><strong>melting ice caps</strong> — Fonte des calottes glaciaires</div>
<div class="vocab-item"><strong>extreme weather events</strong> — Événements météorologiques extrêmes</div>
<div class="vocab-item"><strong>hurricanes</strong> — Ouragans</div>
<div class="vocab-item"><strong>droughts</strong> — Sécheresses</div>
<div class="vocab-item"><strong>endangered</strong> — En danger</div>
<div class="vocab-item"><strong>deforestation</strong> — Déforestation</div>
<div class="vocab-item"><strong>pollution</strong> — Pollution</div>
<div class="vocab-item"><strong>oceans</strong> — Océans</div>
<div class="vocab-item"><strong>plastic waste</strong> — Déchets plastiques</div>
<div class="vocab-item"><strong>polluted</strong> — Pollué</div>
<div class="vocab-item"><strong>sustainable</strong> — Durable</div>
<div class="vocab-item"><strong>renewable energy</strong> — Énergie renouvelable</div>
<div class="vocab-item"><strong>solar</strong> — Solaire</div>
<div class="vocab-item"><strong>wind power</strong> — Énergie éolienne</div>
<div class="vocab-item"><strong>recycle</strong> — Recycler</div>
<div class="vocab-item"><strong>reduce</strong> — Réduire</div>
<div class="vocab-item"><strong>reuse</strong> — Réutiliser</div>
</div>

<h2>🌤️ Météo et saisons</h2>

<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Spring</td><td>Printemps</td></tr>
<tr><td>Summer</td><td>Été</td></tr>
<tr><td>Autumn / Fall</td><td>Automne</td></tr>
<tr><td>Winter</td><td>Hiver</td></tr>
<tr><td>Sunny</td><td>Ensoleillé</td></tr>
<tr><td>Cloudy</td><td>Nuageux</td></tr>
<tr><td>Rainy</td><td>Pluvieux</td></tr>
<tr><td>Windy</td><td>Venteux</td></tr>
<tr><td>Snowy</td><td>Neigeux</td></tr>
<tr><td>Foggy</td><td>Brumeux</td></tr>
<tr><td>Stormy</td><td>Orageux</td></tr>
<tr><td>Dry</td><td>Sec</td></tr>
<tr><td>Humid</td><td>Humide</td></tr>
</table>

<h2>💬 Dialogue — Talking about the weather</h2>
<div class="dialogue-box">
<p><strong>A:</strong> "Beautiful day, isn't it?"</p>
<p><strong>B:</strong> "Yes, it's so sunny! Perfect for a picnic."</p>
<p><strong>A:</strong> "Did you hear the forecast for tomorrow?"</p>
<p><strong>B:</strong> "I think it's going to rain. We should check the weather app."</p>
<p><strong>A:</strong> "You're right. If it rains, we can meet at a café instead."</p>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Décrivez le climat de votre pays et parlez d'un problème environnemental.</strong> Utilisez au moins 8 mots du vocabulaire.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "V6 — Vocabulary : Money & Finance",
    "Maîtriser le vocabulaire de l'argent, de la finance et des transactions",
    `<div class="lecon-anglais">
<h1>📚 V6 — Vocabulary : Money & Finance</h1>

<div class="intro-box">
<p>Que ce soit pour ouvrir un compte bancaire, faire un budget, ou négocier un salaire, le vocabulaire financier est essentiel dans la vie adulte.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Utiliser le vocabulaire bancaire et financier</li>
<li>Parler de budgets, salaires et investissements</li>
<li>Comprendre une conversation d'affaires sur l'argent</li>
</ul>

<h2>📖 Texte — Managing My Finances</h2>

<div class="dialogue-box">
<p>Every month, I receive my <strong>salary</strong> on the 25th. The money goes directly to my <strong>bank account</strong>. First, I pay my <strong>bills</strong> — <strong>rent</strong>, <strong>electricity</strong>, <strong>water</strong>, and <strong>Internet</strong>.</p>
<p>Then, I put some money into my <strong>savings account</strong>. I try to save at least 20% of my income. I also have a small <strong>budget</strong> for <strong>groceries</strong>, <strong>transportation</strong>, and <strong>entertainment</strong>.</p>
<p>Last year, I started <strong>investing</strong> in the <strong>stock market</strong>. I bought some <strong>shares</strong> of tech companies. It's risky, but the <strong>returns</strong> can be high. I also have some <strong>insurance</strong> — health insurance and car insurance.</p>
<p>I use a <strong>budgeting app</strong> to track my <strong>expenses</strong>. It helps me avoid <strong>debt</strong> and plan for the future. My goal is to buy a <strong>house</strong> in five years.</p>
</div>

<h2>📝 Vocabulaire du texte</h2>

<div class="vocab-grid">
<div class="vocab-item"><strong>salary</strong> — Salaire</div>
<div class="vocab-item"><strong>bank account</strong> — Compte bancaire</div>
<div class="vocab-item"><strong>bills</strong> — Factures</div>
<div class="vocab-item"><strong>rent</strong> — Loyer</div>
<div class="vocab-item"><strong>electricity</strong> — Électricité</div>
<div class="vocab-item"><strong>water</strong> — Eau</div>
<div class="vocab-item"><strong>Internet</strong> — Internet</div>
<div class="vocab-item"><strong>savings account</strong> — Compte d'épargne</div>
<div class="vocab-item"><strong>income</strong> — Revenu</div>
<div class="vocab-item"><strong>budget</strong> — Budget</div>
<div class="vocab-item"><strong>groceries</strong> — Courses alimentaires</div>
<div class="vocab-item"><strong>transportation</strong> — Transport</div>
<div class="vocab-item"><strong>entertainment</strong> — Loisirs / Divertissement</div>
<div class="vocab-item"><strong>investing</strong> — Investir</div>
<div class="vocab-item"><strong>stock market</strong> — Bourse</div>
<div class="vocab-item"><strong>shares</strong> — Actions</div>
<div class="vocab-item"><strong>returns</strong> — Rendements</div>
<div class="vocab-item"><strong>insurance</strong> — Assurance</div>
<div class="vocab-item"><strong>expenses</strong> — Dépenses</div>
<div class="vocab-item"><strong>debt</strong> — Dette</div>
</div>

<h2>💰 Expressions financières</h2>

<table class="verb-table">
<tr><th>Expression</th><th>Signification</th></tr>
<tr><td>Make money</td><td>Gagner de l'argent</td></tr>
<tr><td>Save money</td><td>Économiser de l'argent</td></tr>
<tr><td>Spend money</td><td>Dépenser de l'argent</td></tr>
<tr><td>Waste money</td><td>Gaspiller de l'argent</td></tr>
<tr><td>Afford something</td><td>Pouvoir se permettre quelque chose</td></tr>
<tr><td>Go bankrupt</td><td>Faire faillite</td></tr>
<tr><td>Break even</td><td>Atteindre le seuil de rentabilité</td></tr>
<tr><td>Cash flow</td><td>Flux de trésorerie</td></tr>
<tr><td>Interest rate</td><td>Taux d'intérêt</td></tr>
<tr><td>Credit card</td><td>Carte de crédit</td></tr>
<tr><td>Loan</td><td>Prêt</td></tr>
<tr><td>Mortgage</td><td>Hypothèque</td></tr>
</table>

<h2>💬 Dialogue — At the bank</h2>
<div class="dialogue-box">
<p><strong>Client:</strong> "I'd like to open a savings account, please."</p>
<p><strong>Banker:</strong> "Of course. What is your monthly income, and how much would you like to deposit?"</p>
<p><strong>Client:</strong> "I earn about 2,000 dollars a month. I'd like to start with 500 dollars."</p>
<p><strong>Banker:</strong> "Great. Our savings account offers a 3% interest rate. Would you also like a debit card?"</p>
<p><strong>Client:</strong> "Yes, please. And can I set up automatic transfers from my current account?"</p>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Décrivez votre budget mensuel.</strong> Utilisez au moins 8 mots du vocabulaire.</p>
</div>`,
    ordreStart++
  );

  console.log("\n✅=== LISTENING + VOCABULARY CHAPITRES CRÉÉS AVEC SUCCÈS ===");
  console.log(`Total nouveaux chapitres : ${ordreStart - 20}`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
