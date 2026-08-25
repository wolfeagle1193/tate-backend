const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const matiere = await db.collection("matieres").findOne({ code: "AN-AD" });
  if (!matiere) { console.log("❌ Matière non trouvée"); await mongoose.disconnect(); return; }
  const matId = matiere._id.toString();

  // Supprimer anciens chapitres Listening (LI et L)
  const oldListening = await db.collection("chapitres").find({
    matiereId: new mongoose.Types.ObjectId(matId), niveau: "Adulte",
    $or: [
      { titre: { $regex: /^LI\d+/i } },
      { titre: { $regex: /^L\d+\s*—\s*Listening/i } },
      { titre: { $regex: /^L\d+\s*—\s*Pronunciation/i } }
    ]
  }).toArray();
  
  for (const c of oldListening) {
    await db.collection("lecons").deleteMany({ chapitreId: c._id });
    await db.collection("chapitres").deleteOne({ _id: c._id });
  }
  console.log(`🧹 ${oldListening.length} anciens chapitres Listening/Pronunciation supprimés`);

  const admin = await db.collection("users").findOne({ role: "admin" });
  const adminId = admin?._id?.toString() || "69dfac0adb8037a014ca9178";

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
  //  LISTENING POUR DÉBUTANTES — 6 vidéos simples
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "LI1 — Listening : How to Introduce Yourself",
    "Apprendre à se présenter en anglais avec une vidéo simple et lente",
    `<div class="lecon-anglais">
<h1>🎧 LI1 — Listening : How to Introduce Yourself</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant total<br/>
<strong>Durée :</strong> 3 minutes<br/>
<strong>Objectif :</strong> Après cette vidéo, vous saurez vous présenter en anglais.</p>
</div>

<h2>🎬 Vidéo — Apprendre à se présenter</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/Ol_0kip4dfU" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><em>English Singsing — "Hello! My Name Is..." — Parfait pour débutants !</em></p>
</div>

<h2>📝 Ce qu'on apprend dans cette vidéo</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>Hello! / Hi!</strong> — Bonjour ! / Salut !</div>
  <div class="vocab-item"><strong>My name is...</strong> — Je m'appelle...</div>
  <div class="vocab-item"><strong>What's your name?</strong> — Comment tu t'appelles ?</div>
  <div class="vocab-item"><strong>Nice to meet you.</strong> — Enchanté(e).</div>
  <div class="vocab-item"><strong>How are you?</strong> — Comment ça va ?</div>
  <div class="vocab-item"><strong>I'm fine, thank you.</strong> — Je vais bien, merci.</div>
  <div class="vocab-item"><strong>Goodbye! / Bye!</strong> — Au revoir ! / Salut !</div>
</div>

<h2>✏️ Exercice — Répétez après la vidéo</h2>
<div class="bloc-essentiel">
  <ol>
    <li>Regardez la vidéo une première fois.</li>
    <li>La deuxième fois, <strong>répétez à voix haute</strong> chaque phrase.</li>
    <li>Essayez de vous présenter seule : "Hello! My name is [votre nom]. Nice to meet you!"</li>
  </ol>
</div>

<h2>💡 Conseil</h2>
<p>Cette vidéo est faite pour les enfants, mais c'est <strong>parfait pour une débutante</strong> ! L'anglais est très lent, les images aident à comprendre, et les phrases sont courtes.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "LI2 — Listening : At the Restaurant",
    "Apprendre commander au restaurant en anglais avec une conversation simple",
    `<div class="lecon-anglais">
<h1>🎧 LI2 — Listening : At the Restaurant</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant<br/>
<strong>Durée :</strong> 4 minutes<br/>
<strong>Objectif :</strong> Commander une pizza, demander l'addition, dire merci.</p>
</div>

<h2>🎬 Vidéo — Conversation au restaurant</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/3egHji8-8Q8" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><em>Easy English — "At the Pizza Place" — Vocabulaire de la nourriture.</em></p>
</div>

<h2>📝 Phrases clés de la vidéo</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>Can I have...?</strong> — Puis-je avoir... ?</div>
  <div class="vocab-item"><strong>I'd like a pizza, please.</strong> — Je voudrais une pizza, s'il vous plaît.</div>
  <div class="vocab-item"><strong>Anything else?</strong> — Autre chose ?</div>
  <div class="vocab-item"><strong>No, that's all.</strong> — Non, c'est tout.</div>
  <div class="vocab-item"><strong>How much is it?</strong> — C'est combien ?</div>
  <div class="vocab-item"><strong>The bill, please.</strong> — L'addition, s'il vous plaît.</div>
  <div class="vocab-item"><strong>Thank you! / You're welcome!</strong> — Merci ! / Je vous en prie !</div>
</div>

<h2>✏️ Exercice</h2>
<div class="bloc-essentiel">
  <p><strong>Simulez une commande :</strong></p>
  <ol>
    <li>"Hello, can I have a pizza, please?"</li>
    <li>"And a glass of water, please."</li>
    <li>"How much is it?"</li>
    <li>"Thank you! Goodbye!"</li>
  </ol>
</div>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "LI3 — Listening : Shopping & Buying Clothes",
    "Apprendre les phrases pour faire du shopping en anglais",
    `<div class="lecon-anglais">
<h1>🎧 LI3 — Listening : Shopping & Buying Clothes</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant<br/>
<strong>Durée :</strong> 4 minutes<br/>
<strong>Objectif :</strong> Demander la taille, la couleur, le prix en anglais.</p>
</div>

<h2>🎬 Vidéo — Shopping Conversation</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/t7ZjC3P9M4Q" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><em>Easy English — Shopping dialogue — Vocabulaire simple du shopping.</em></p>
</div>

<h2>📝 Phrases clés</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>Can I help you?</strong> — Puis-je vous aider ?</div>
  <div class="vocab-item"><strong>I'm just looking, thank you.</strong> — Je regarde seulement, merci.</div>
  <div class="vocab-item"><strong>Do you have this in blue?</strong> — L'avez-vous en bleu ?</div>
  <div class="vocab-item"><strong>What size is this?</strong> — Quelle taille est-ce ?</div>
  <div class="vocab-item"><strong>Can I try it on?</strong> — Puis-je l'essayer ?</div>
  <div class="vocab-item"><strong>It's too expensive.</strong> — C'est trop cher.</div>
  <div class="vocab-item"><strong>I'll take it!</strong> — Je le prends !</div>
</div>

<h2>✏️ Exercice</h2>
<div class="bloc-essentiel">
  <p><strong>Rôle-play :</strong> Vous êtes dans un magasin. Vous voulez acheter une robe rouge.</p>
  <ol>
    <li>Vendeur : "Can I help you?"</li>
    <li>Vous : "Yes, I'm looking for a red dress."</li>
    <li>Vendeur : "What size?"</li>
    <li>Vous : "Medium, please. Can I try it on?"</li>
  </ol>
</div>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "LI4 — Listening : Family Members & Numbers",
    "Apprendre le vocabulaire de la famille et les nombres en anglais",
    `<div class="lecon-anglais">
<h1>🎧 LI4 — Listening : Family Members & Numbers</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant total<br/>
<strong>Durée :</strong> 5 minutes<br/>
<strong>Objectif :</strong> Connaître les membres de la famille et compter jusqu'à 20.</p>
</div>

<h2>🎬 Vidéo — Family Members</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/kg-8bbde5H8" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><em>English Singsing — "Family Members" — Avec images et prononciation claire.</em></p>
</div>

<h2>📝 Vocabulaire de la famille</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>Mother / Mom</strong> — Mère / Maman</div>
  <div class="vocab-item"><strong>Father / Dad</strong> — Père / Papa</div>
  <div class="vocab-item"><strong>Sister</strong> — Sœur</div>
  <div class="vocab-item"><strong>Brother</strong> — Frère</div>
  <div class="vocab-item"><strong>Grandmother / Grandma</strong> — Grand-mère</div>
  <div class="vocab-item"><strong>Grandfather / Grandpa</strong> — Grand-père</div>
  <div class="vocab-item"><strong>Aunt</strong> — Tante</div>
  <div class="vocab-item"><strong>Uncle</strong> — Oncle</div>
  <div class="vocab-item"><strong>Cousin</strong> — Cousin(e)</div>
  <div class="vocab-item"><strong>Family</strong> — Famille</div>
</div>

<h2>🎬 Vidéo bonus — Les nombres 1 à 20</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/byUNtK1k4aY" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><em>Numbers 1-20 — Avec chanson pour retenir !</em></p>
</div>

<h2>✏️ Exercice</h2>
<div class="bloc-essentiel">
  <p><strong>Présentez votre famille :</strong></p>
  <p>"In my family, I have a mother, a father, and two sisters. My grandmother lives with us. I love my family."</p>
  <p><em>Dans ma famille, j'ai une mère, un père, et deux sœurs. Ma grand-mère vit avec nous. J'aime ma famille.</em></p>
</div>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "LI5 — Listening : Weather & Days of the Week",
    "Apprendre le vocabulaire de la météo et les jours de la semaine",
    `<div class="lecon-anglais">
<h1>🎧 LI5 — Listening : Weather & Days of the Week</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant total<br/>
<strong>Durée :</strong> 4 minutes<br/>
<strong>Objectif :</strong> Dire la météo et les jours en anglais.</p>
</div>

<h2>🎬 Vidéo — Weather Vocabulary</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/0MYN1_g6g8U" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><em>English Singsing — "How's the Weather?" — Chanson facile à retenir.</em></p>
</div>

<h2>📝 Vocabulaire de la météo</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>Sunny</strong> — Ensoleillé</div>
  <div class="vocab-item"><strong>Cloudy</strong> — Nuageux</div>
  <div class="vocab-item"><strong>Rainy</strong> — Pluvieux</div>
  <div class="vocab-item"><strong>Windy</strong> — Venteux</div>
  <div class="vocab-item"><strong>Snowy</strong> — Neigeux</div>
  <div class="vocab-item"><strong>Hot</strong> — Chaud</div>
  <div class="vocab-item"><strong>Cold</strong> — Froid</div>
  <div class="vocab-item"><strong>How's the weather?</strong> — Quel temps fait-il ?</div>
  <div class="vocab-item"><strong>It's sunny!</strong> — Il fait soleil !</div>
</div>

<h2>📝 Les jours de la semaine</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Monday</td><td>Lundi</td></tr>
<tr><td>Tuesday</td><td>Mardi</td></tr>
<tr><td>Wednesday</td><td>Mercredi</td></tr>
<tr><td>Thursday</td><td>Jeudi</td></tr>
<tr><td>Friday</td><td>Vendredi</td></tr>
<tr><td>Saturday</td><td>Samedi</td></tr>
<tr><td>Sunday</td><td>Dimanche</td></tr>
</table>

<h2>✏️ Exercice</h2>
<div class="bloc-essentiel">
  <p><strong>Décrivez la météo aujourd'hui :</strong></p>
  <p>"Today is Monday. It is sunny and hot. I like sunny days!"</p>
  <p><em>Aujourd'hui c'est lundi. Il fait soleil et chaud. J'aime les journées ensoleillées !</em></p>
</div>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "LI6 — Listening : Simple Daily Conversations",
    "Apprendre des conversations quotidiennes simples pour débutants",
    `<div class="lecon-anglais">
<h1>🎧 LI6 — Listening : Simple Daily Conversations</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant<br/>
<strong>Durée :</strong> 10 conversations courtes<br/>
<strong>Objectif :</strong> Comprendre et répéter des dialogues de la vie quotidienne.</p>
</div>

<h2>🎬 Vidéo — 50 Daily English Conversations</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/X3JsF3p5x7Q" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><em>Easy English — "50 Daily English Conversations" — Très utile pour débutants !</em></p>
</div>

<h2>📝 10 conversations essentielles</h2>

<h3>1. Salutations</h3>
<div class="dialogue-box">
  <p><strong>A:</strong> Hello! How are you?</p>
  <p><strong>B:</strong> I'm fine, thanks. And you?</p>
  <p><strong>A:</strong> I'm good, thank you!</p>
</div>

<h3>2. Demander le nom</h3>
<div class="dialogue-box">
  <p><strong>A:</strong> What's your name?</p>
  <p><strong>B:</strong> My name is Sarah. What's yours?</p>
  <p><strong>A:</strong> I'm John. Nice to meet you!</p>
  <p><strong>B:</strong> Nice to meet you too!</p>
</div>

<h3>3. Demander l'heure</h3>
<div class="dialogue-box">
  <p><strong>A:</strong> Excuse me, what time is it?</p>
  <p><strong>B:</strong> It's 3 o'clock.</p>
  <p><strong>A:</strong> Thank you!</p>
</div>

<h3>4. Au restaurant</h3>
<div class="dialogue-box">
  <p><strong>A:</strong> Can I have a coffee, please?</p>
  <p><strong>B:</strong> Sure. Anything else?</p>
  <p><strong>A:</strong> No, thank you. How much is it?</p>
  <p><strong>B:</strong> Two dollars.</p>
</div>

<h3>5. Demander le chemin</h3>
<div class="dialogue-box">
  <p><strong>A:</strong> Excuse me, where is the bathroom?</p>
  <p><strong>B:</strong> It's down the hall, on the right.</p>
  <p><strong>A:</strong> Thank you very much!</p>
</div>

<h3>6. Parler de la météo</h3>
<div class="dialogue-box">
  <p><strong>A:</strong> Nice weather today!</p>
  <p><strong>B:</strong> Yes, it's very sunny.</p>
  <p><strong>A:</strong> I love sunny days!</p>
</div>

<h3>7. Faire les courses</h3>
<div class="dialogue-box">
  <p><strong>A:</strong> How much are these apples?</p>
  <p><strong>B:</strong> They're three dollars a kilo.</p>
  <p><strong>A:</strong> I'll take two kilos, please.</p>
</div>

<h3>8. Au téléphone</h3>
<div class="dialogue-box">
  <p><strong>A:</strong> Hello, this is Mary. Can I speak to John?</p>
  <p><strong>B:</strong> Sorry, he's not here. Can I take a message?</p>
  <p><strong>A:</strong> Yes, please tell him to call me.</p>
</div>

<h3>9. Dire au revoir</h3>
<div class="dialogue-box">
  <p><strong>A:</strong> I have to go now. Goodbye!</p>
  <p><strong>B:</strong> Goodbye! See you tomorrow!</p>
  <p><strong>A:</strong> See you!</p>
</div>

<h3>10. Dire merci</h3>
<div class="dialogue-box">
  <p><strong>A:</strong> Thank you for your help!</p>
  <p><strong>B:</strong> You're welcome!</p>
  <p><strong>A:</strong> Have a nice day!</p>
  <p><strong>B:</strong> You too!</p>
</div>

<h2>✏️ Exercice final</h2>
<div class="bloc-essentiel">
  <p><strong>Choisissez 3 dialogues et jouez-les avec une amie ou seule devant un miroir !</strong></p>
  <p>Plus vous pratiquez, plus vous devenez confiante. Vous pouvez le faire ! 💪</p>
</div>
</div>`,
    ordreStart++
  );

  console.log("\n✅=== LISTENING POUR DÉBUTANTES CRÉÉ ===");
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
