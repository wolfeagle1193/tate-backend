const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const admin = await db.collection("users").findOne({ role: "admin" });
  const adminId = admin?._id?.toString() || "69dfac0adb8037a014ca9178";

  const matiere = await db.collection("matieres").findOne({ code: "AN-AD" });
  if (!matiere) { console.log("❌ Matière AN-AD non trouvée"); await mongoose.disconnect(); return; }
  const matId = matiere._id.toString();
  const matiereId = new mongoose.Types.ObjectId(matId);

  const lastChap = await db.collection("chapitres").find({ matiereId: matiereId, niveau: "Adulte" }).sort({ ordre: -1 }).limit(1).toArray();
  let ordreStart = lastChap.length > 0 ? (lastChap[0].ordre || 0) + 1 : 1;

  // Nettoyer anciens chapitres Practice
  const oldToClean = await db.collection("chapitres").find({
    matiereId: matiereId, niveau: "Adulte",
    $or: [
      { titre: { $regex: /^P\d+\s*—\s*Practice/i } },
      { titre: { $regex: /^PR\d+\s*—\s*Practice/i } }
    ]
  }).toArray();
  for (const c of oldToClean) {
    await db.collection("lecons").deleteMany({ chapitreId: c._id });
    await db.collection("chapitres").deleteOne({ _id: c._id });
  }
  console.log(`🧹 ${oldToClean.length} anciens chapitres Practice nettoyés`);

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
  //  PRACTICE — FILMS (5 films simples)
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "P1 — Practice : Films — Forrest Gump",
    "Apprendre l'anglais avec un film classique simple et émouvant",
    `<div class="lecon-anglais">
<h1>🎬 P1 — Practice : Forrest Gump</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant — Intermédiaire<br/>
<strong>Durée :</strong> 2h22<br/>
<strong>Thème :</strong> Amour, amitié, histoire américaine<br/>
<strong>Pourquoi ce film ?</strong> Forrest parle lentement et clairement. L'histoire est simple et touchante.</p>
</div>

<h2>📖 Résumé simple</h2>
<div class="dialogue-box">
<p>Forrest Gump est un homme gentil mais simple d'esprit. Il vit des aventures incroyables : il rencontre le président, joue au football, va à la guerre du Vietnam, et court à travers l'Amérique. Mais ce qu'il veut le plus, c'est retrouver son amour d'enfance, Jenny.</p>
<p>Le film est raconté par Forrest lui-même. Il parle lentement, avec un accent du Sud des États-Unis. C'est parfait pour apprendre l'anglais !</p>
</div>

<h2>🎥 Vidéo — Bande-annonce</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/bLvqoHBptjg" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Phrases célèbres à apprendre</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>"Life is like a box of chocolates. You never know what you're gonna get."</strong><br/>La vie est comme une boîte de chocolats. On ne sait jamais sur quoi on va tomber.</div>
  <div class="vocab-item"><strong>"Run, Forrest, run!"</strong><br/>Cours, Forrest, cours !</div>
  <div class="vocab-item"><strong>"My mama always said..."</strong><br/>Ma maman disait toujours...</div>
  <div class="vocab-item"><strong>"Stupid is as stupid does."</strong><br/>On est bête quand on fait des bêtises.</div>
</div>

<h2>📚 Vocabulaire du film</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Box of chocolates</td><td>Boîte de chocolats</td></tr>
<tr><td>Run</td><td>Courir</td></tr>
<tr><td>Simple</td><td>Simple</td></tr>
<tr><td>Kind</td><td>Gentil</td></tr>
<tr><td>Friend</td><td>Ami</td></tr>
<tr><td>Love</td><td>Amour</td></tr>
<tr><td>War</td><td>Guerre</td></tr>
<tr><td>Football</td><td>Football américain</td></tr>
<tr><td>Bench</td><td>Banc</td></tr>
<tr><td>Story</td><td>Histoire</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>Regardez le film <strong>avec les sous-titres en anglais</strong>. Quand Forrest parle, essayez de répéter après lui. Son accent est lent et clair — parfait pour débutantes !</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P2 — Practice : Films — The Pursuit of Happyness",
    "Apprendre l'anglais avec une histoire vraie inspirante sur la persévérance",
    `<div class="lecon-anglais">
<h1>🎬 P2 — Practice : The Pursuit of Happyness</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant — Intermédiaire<br/>
<strong>Durée :</strong> 1h57<br/>
<strong>Thème :</strong> Famille, courage, persévérance<br/>
<strong>Pourquoi ce film ?</strong> Will Smith parle clairement. L'histoire est émouvante et facile à suivre.</p>
</div>

<h2>📖 Résumé simple</h2>
<div class="dialogue-box">
<p>Chris Gardner est un père célibataire. Il n'a pas d'argent, pas de maison, et il s'occupe de son petit garçon Christopher. Chris veut devenir courtier en bourse (stockbroker). Il trav très dur, même quand tout semble impossible.</p>
<p>C'est une histoire vraie ! Chris Gardner est devenu très riche plus tard. Le film montre que si on travaille dur, on peut réussir.</p>
</div>

<h2>🎥 Vidéo — Scène "Don't ever let somebody tell you..."</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/DsS7pQtDoNs" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Phrases célèbres à apprendre</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>"Don't ever let somebody tell you, you can't do something."</strong><br/>Ne laisse jamais quelqu'un te dire que tu ne peux pas faire quelque chose.</div>
  <div class="vocab-item"><strong>"You got a dream, you gotta protect it."</strong><br/>Quand tu as un rêve, tu dois le protéger.</div>
  <div class="vocab-item"><strong>"I am not happy."</strong><br/>Je ne suis pas heureux. (Scène du orthographe !)</div>
  <div class="vocab-item"><strong>"Hey, don't ever let somebody tell you..."</strong><br/>Hé, ne laisse jamais quelqu'un te dire...</div>
</div>

<h2>📚 Vocabulaire du film</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Pursuit</td><td>Poursuite / Recherche</td></tr>
<tr><td>Happiness</td><td>Bonheur</td></tr>
<tr><td>Dream</td><td>Rêve</td></tr>
<tr><td>Protect</td><td>Protéger</td></tr>
<tr><td>Stockbroker</td><td>Courtier en bourse</td></tr>
<tr><td>Internship</td><td>Stage</td></tr>
<tr><td>Homeless</td><td>Sans-abri</td></tr>
<tr><td>Never give up</td><td>Ne jamais abandonner</td></tr>
<tr><td>Internship</td><td>Stage</td></tr>
<tr><td>Job interview</td><td>Entretien d'embauche</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>La scène dans le métro est parfaite pour les débutants. Chris parle avec son fils — langage simple et clair. Regardez-la plusieurs fois !</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P3 — Practice : Films — The Lion King (2019)",
    "Apprendre l'anglais avec un conte africain familier et magnifique",
    `<div class="lecon-anglais">
<h1>🎬 P3 — Practice : The Lion King (2019)</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant<br/>
<strong>Durée :</strong> 1h58<br/>
<strong>Thème :</strong> Famille, responsabilité, courage<br/>
<strong>Pourquoi ce film ?</strong> Vous connaissez déjà l'histoire en français ! C'est plus facile de comprendre quand on connaît le contexte.</p>
</div>

<h2>📖 Résumé simple</h2>
<div class="dialogue-box">
<p>Simba est un petit lionceau. Il est le fils du roi Mufasa. Son oncle Scar est méchant et jaloux. Un jour, il y a un accident tragique. Simba pense que c'est sa faute. Il s'enfuit et rencontre Timon et Pumbaa, qui deviennent ses amis. Plus tard, Simba doit revenir pour devenir le vrai roi.</p>
</div>

<h2>🎥 Vidéo — "Hakuna Matata"</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/nbY_aP-alkw" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Phrases célèbres à apprendre</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>"Hakuna Matata! It means no worries."</strong><br/>Hakuna Matata ! Ça veut dire pas de soucis.</div>
  <div class="vocab-item"><strong>"The past can hurt. But the way I see it, you can either run from it, or learn from it."</strong><br/>Le passé peut faire mal. Mais de mon point de vue, tu peux soit t'enfuir, soit apprendre de lui.</div>
  <div class="vocab-item"><strong>"Remember who you are."</strong><br/>Souviens-toi de qui tu es.</div>
  <div class="vocab-item"><strong>"I just can't wait to be king!"</strong><br/>J'ai tellement hâte d'être roi !</div>
</div>

<h2>📚 Vocabulaire du film</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>King</td><td>Roi</td></tr>
<tr><td>Queen</td><td>Reine</td></tr>
<tr><td>Prince</td><td>Prince</td></tr>
<tr><td>Pride</td><td>Fierté / Troupe de lions</td></tr>
<tr><td>Circle of life</td><td>Cercle de la vie</td></tr>
<tr><td>Worry</td><td>Souci</td></tr>
<tr><td>Remember</td><td>Se souvenir</td></tr>
<tr><td>Family</td><td>Famille</td></tr>
<tr><td>Friend</td><td>Ami</td></tr>
<tr><td>BRAVE</td><td>Courageux</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>Chantez "Hakuna Matata" ! C'est facile à retenir et ça apprend du vocabulaire de la vie quotidienne.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P4 — Practice : Films — The Princess Diaries",
    "Apprendre l'anglais avec une comédie romantique drôle et tendre",
    `<div class="lecon-anglais">
<h1>🎬 P4 — Practice : The Princess Diaries</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant — Intermédiaire<br/>
<strong>Durée :</strong> 1h55<br/>
<strong>Thème :</strong> Identité, amitié, première amour<br/>
<strong>Pourquoi ce film ?</strong> C'est une comédie légère avec des jeunes filles. Le vocabulaire est quotidien et facile.</p>
</div>

<h2>📖 Résumé simple</h2>
<div class="dialogue-box">
<p>Mia Thermopolis est une ado de 15 ans. Elle est maladroite et pas très populaire à l'école. Un jour, sa grand-mère Clarisse arrive et lui dit une surprise : Mia est une princesse ! Elle doit apprendre à devenir une vraie princesse. Mais est-ce qu'elle veut vraiment ça ?</p>
</div>

<h2>🎥 Vidéo — "A Princess ? Shut up!"</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/WCgd_chA-6I" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Phrases célèbres à apprendre</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>"A princess? Shut up!"</strong><br/>Une princesse ? Tais-toi ! (Expression américaine de surprise)</div>
  <div class="vocab-item"><strong>"I can't be a princess! I'm still waiting for normal body parts to arrive!"</strong><br/>Je ne peux pas être une princesse ! J'attends encore que mes parties du corps normales arrivent !</div>
  <div class="vocab-item"><strong>"The brave may not live forever, but the cautious do not live at all."</strong><br/>Les courageux ne vivent pas éternellement, mais les prudents ne vivent pas du tout.</div>
  <div class="vocab-item"><strong>"Just in case I am not enough of a freak already, let's add a tiara!"</strong><br/>Au cas où je ne serais pas assez bizarre déjà, ajoutons une tiare !</div>
</div>

<h2>📚 Vocabulaire du film</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Princess</td><td>Princesse</td></tr>
<tr><td>Princess</td><td>Princesse</td></tr>
<tr><td>Awkward</td><td>Maladroite / Gênante</td></tr>
<tr><td>Grandmother</td><td>Grand-mère</td></tr>
<tr><td>School</td><td>École</td></tr>
<tr><td>Best friend</td><td>Meilleure amie</td></tr>
<tr><td>Makeover</td><td>Transformation / Relooking</td></tr>
<tr><td>Tiara</td><td>Tiare</td></tr>
<tr><td>Ball</td><td>Bal</td></tr>
<tr><td>Speech</td><td>Discours</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>Ce film utilise beaucoup de vocabulaire d'adolescente ("shut up", "freak", "best friend"). Parfait pour comprendre comment les jeunes parlent en anglais américain !</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P5 — Practice : Films — Love Actually",
    "Apprendre l'anglais britannique avec une comédie romantique douce",
    `<div class="lecon-anglais">
<h1>🎬 P5 — Practice : Love Actually</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Intermédiaire<br/>
<strong>Durée :</strong> 2h15<br/>
<strong>Thème :</strong> Amour, Noël, relations humaines<br/>
<strong>Pourquoi ce film ?</strong> C'est un classique de Noël avec plusieurs histoires. L'anglais britannique est clair et élégant.</p>
</div>

<h2>📖 Résumé simple</h2>
<div class="dialogue-box">
<p>Le film raconte 10 histoires d'amour différentes à Londres, juste avant Noël. Il y a un Premier ministre qui tombe amoureux, un garçon qui est amoureux d'une fille de sa classe, un homme qui découvre que sa femme le trompe, et d'autres histoires touchantes.</p>
<p>Chaque histoire est courte et simple à suivre. C'est parfait pour apprendre l'anglais britannique !</p>
</div>

<h2>🎥 Vidéo — "To me, you are perfect"</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/zcygpp-g4iE" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Phrases célèbres à apprendre</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>"To me, you are perfect."</strong><br/>Pour moi, tu es parfaite.</div>
  <div class="vocab-item"><strong>"Love actually is all around."</strong><br/>L'amour est partout, en fait.</div>
  <div class="vocab-item"><strong>"If you look for it, I've got a sneaky feeling you'll find that love actually is all around."</strong><br/>Si tu cherches, j'ai l'impression sournoise que tu trouveras que l'amour est partout.</div>
</div>

<h2>📚 Vocabulaire du film</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Actually</td><td>En fait</td></tr>
<tr><td>Christmas</td><td>Noël</td></tr>
<tr><td>Perfect</td><td>Parfait</td></tr>
<tr><td>Love</td><td>Amour</td></tr>
<tr><td>Prime Minister</td><td>Premier ministre</td></tr>
<tr><td>Secretary</td><td>Secrétaire</td></tr>
<tr><td>Writer</td><td>Écrivain</td></tr>
<tr><td>Translation</td><td>Traduction</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>L'histoire du Premier ministre et de Natalie est la plus simple. Commencez par celle-là !</p>
</div>`,
    ordreStart++
  );

  // ═══════════════════════════════════════════════════════
  //  PRACTICE — DESSINS ANIMÉS (5 dont Tom Sawyer)
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "P6 — Practice : Dessins Animés — Tom Sawyer",
    "Apprendre l'anglais avec les aventures de Tom Sawyer",
    `<div class="lecon-anglais">
<h1>📺 P6 — Practice : Tom Sawyer</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant<br/>
<strong>Épisodes :</strong> 49 épisodes (26 min chacun)<br/>
<strong>Thème :</strong> Aventure, amitié, enfance<br/>
<strong>Pourquoi ce dessin animé ?</strong> Histoire classique, vocabulaire simple, aventures amusantes. Parfait pour débutantes !</p>
</div>

<h2>📖 Qu'est-ce que Tom Sawyer ?</h2>
<div class="dialogue-box">
<p>Tom Sawyer est un garçon qui vit dans une petite ville en Amérique au 19ème siècle. Il est espiègle, courageux et aime les aventures. Son meilleur ami est Huckleberry Finn (Huck). Ensemble, ils découvrent un trésor, aident un innocent, et vivent plein d'aventures.</p>
<p>Le dessin animé utilise un anglais simple et clair. Les épisodes sont courts (26 minutes) — parfait pour une session d'apprentissage !</p>
</div>

<h2>🎥 Vidéo — Episode 1 (version anglaise)</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/J_9hA3W1T-Q" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Épisode 1 :</strong> Tom et Huck découvrent un secret.</p>
</div>

<h2>📝 Phrases simples à apprendre</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>"Let's go on an adventure!"</strong><br/>Partons à l'aventure !</div>
  <div class="vocab-item"><strong>"I promise."</strong><br/>Je promets.</div>
  <div class="vocab-item"><strong>"You're my best friend."</strong><br/>Tu es mon meilleur ami.</div>
  <div class="vocab-item"><strong>"It's a secret!"</strong><br/>C'est un secret !</div>
</div>

<h2>📚 Vocabulaire de Tom Sawyer</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Adventure</td><td>Aventure</td></tr>
<tr><td>Treasure</td><td>Trésor</td></tr>
<tr><td>Friend</td><td>Ami</td></tr>
<tr><td>Promise</td><td>Promesse</td></tr>
<tr><td>Secret</td><td>Secret</td></tr>
<tr><td>Brave</td><td>Courageux</td></tr>
<tr><td>Explore</td><td>Explorer</td></tr>
<tr><td>Small town</td><td>Petite ville</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>Regardez un épisode par jour (26 min). C'est court, amusant, et l'anglais est très clair. Commencez par l'épisode 1 !</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P7 — Practice : Dessins Animés — Peppa Pig",
    "Apprendre l'anglais avec des épisodes courts et drôles pour toute la famille",
    `<div class="lecon-anglais">
<h1>📺 P7 — Practice : Peppa Pig</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant total<br/>
<strong>Épisodes :</strong> 5-7 minutes chacun<br/>
<strong>Thème :</strong> Famille, quotidien, humour<br/>
<strong>Pourquoi ce dessin animé ?</strong> Épisodes très courts, anglais britannique clair, vocabulaire de base parfait.</p>
</div>

<h2>📖 Qu'est-ce que Peppa Pig ?</h2>
<div class="dialogue-box">
<p>Peppa est un petit cochon rose. Elle vit avec son petit frère George, sa maman et son papa. Chaque épisode raconte une petite aventure de la vie quotidienne : aller au parc, faire un pique-nique, visiter la plage, etc.</p>
<p>L'anglais est <strong>très simple</strong>. C'est parfait pour commencer ! Même les adultes peuvent apprendre beaucoup.</p>
</div>

<h2>🎥 Vidéo — "Muddy Puddles" (1er épisode)</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/VRWH1HuSK0E" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Phrases à apprendre</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>"I'm Peppa Pig. This is my little brother George."</strong><br/>Je suis Peppa Pig. Voici mon petit frère George.</div>
  <div class="vocab-item"><strong>"Jumping up and down in muddy puddles!"</strong><br/>Sauter dans les flaques de boue !</div>
  <div class="vocab-item"><strong>"It's raining today, so Peppa and George cannot play outside."</strong><br/>Il pleut aujourd'hui, donc Peppa et George ne peuvent pas jouer dehors.</div>
</div>

<h2>📚 Vocabulaire de Peppa Pig</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Puddle</td><td>Flaque</td></tr>
<tr><td>Rain</td><td>Pluie</td></tr>
<tr><td>Jump</td><td>Sauter</td></tr>
<tr><td>Brother</td><td>Frère</td></tr>
<tr><td>Sister</td><td>Sœur</td></tr>
<tr><td>Mummy</td><td>Maman</td></tr>
<tr><td>Daddy</td><td>Papa</td></tr>
<tr><td>Outside</td><td>Dehors</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>Regardez 3 épisodes par jour (15 min total). Répétez les phrases à voix haute. C'est le meilleur début pour une débutante !</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P8 — Practice : Dessins Animés — Dora the Explorer",
    "Apprendre l'anglais en interactif avec Dora l'exploratrice",
    `<div class="lecon-anglais">
<h1>📺 P8 — Practice : Dora the Explorer</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant total<br/>
<strong>Épisodes :</strong> 23 minutes<br/>
<strong>Thème :</strong> Aventure, espagnol + anglais, éducation<br/>
<strong>Pourquoi ce dessin animé ?</strong> Dora parle lentement et pose des questions au spectateur. C'est interactif !</p>
</div>

<h2>📖 Qu'est-ce que Dora ?</h2>
<div class="dialogue-box">
<p>Dora est une petite fille qui part à l'aventure avec son singe Babouche (Boots). Elle doit résoudre des énigmes et traverser des obstacles. À chaque étape, elle pose des questions au spectateur : "Où est la montagne ?" "Quel chemin prendre ?"</p>
<p>C'est parfait car <strong>Dora attend votre réponse</strong> ! Vous parlez avec elle.</p>
</div>

<h2>🎥 Vidéo — "The Legend of the Big Red Chicken"</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/8H6dYUj1GCM" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Phrases à apprendre</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>"Hola! Soy Dora!"</strong><br/>Bonjour ! Je suis Dora ! (Espagnol + Anglais)</div>
  <div class="vocab-item"><strong>"Can you say... ?"</strong><br/>Peux-tu dire... ?</div>
  <div class="vocab-item"><strong>"We did it!"</strong><br/>On a réussi !</div>
  <div class="vocab-item"><strong>" swiper no swiping!"</strong><br/>Renard, pas de vol !</div>
</div>

<h2>📚 Vocabulaire de Dora</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Explorer</td><td>Explorer</td></tr>
<tr><td>Map</td><td>Carte</td></tr>
<tr><td>Backpack</td><td>Sac à dos</td></tr>
<tr><td>Say</td><td>Dire</td></tr>
<tr><td>Where is...?</td><td>Où est... ?</td></tr>
<tr><td>We did it!</td><td>On a réussi !</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>Répondez à voix haute quand Dora pose une question ! C'est comme avoir une prof d'anglais à la maison.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P9 — Practice : Dessins Animés — Frozen",
    "Apprendre l'anglais avec la Reine des Neiges et ses chansons magnifiques",
    `<div class="lecon-anglais">
<h1>📺 P9 — Practice : Frozen</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant — Intermédiaire<br/>
<strong>Durée :</strong> 1h42<br/>
<strong>Thème :</strong> Sœurs, amour, courage<br/>
<strong>Pourquoi ce film ?</strong> Chansons célèbres, histoire connue, vocabulaire émotionnel.</p>
</div>

<h2>📖 Résumé simple</h2>
<div class="dialogue-box">
<p>Elsa est une princesse avec un pouvoir magique : elle peut créer de la glace et de la neige. Un jour, elle perd le contrôle et s'enfuit. Sa sœur Anna part à sa recherche avec Kristoff, Sven (le renne), et Olaf (le bonhomme de neige).</p>
<p>C'est une histoire sur <strong>l'amour entre sœurs</strong>. La chanson "Let It Go" est devenue célèbre dans le monde entier !</p>
</div>

<h2>🎥 Vidéo — "Let It Go" (chanson complète)</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/L0MK7qz13bU" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Paroles de "Let It Go" avec traduction</h2>
<div class="dialogue-box">
  <p><strong>The snow glows white on the mountain tonight</strong><br/><em>La neige brille blanche sur la montagne ce soir</em></p>
  <p><strong>Not a footprint to be seen</strong><br/><em>Pas une empreinte à voir</em></p>
  <p><strong>A kingdom of isolation</strong><br/><em>Un royaume d'isolement</em></p>
  <p><strong>And it looks like I'm the queen</strong><br/><em>Et il semble que je sois la reine</em></p>
  <p><strong>The wind is howling like this swirling storm inside</strong><br/><em>Le vent hurle comme cette tempête tourbillonnante à l'intérieur</em></p>
  <p><strong>Couldn't keep it in, heaven knows I tried</strong><br/><em>Je ne pouvais plus le garder en moi, le ciel sait que j'ai essayé</em></p>
  <br/>
  <p><strong>Let it go, let it go</strong><br/><em>Laissez-passer, laissez-passer</em></p>
  <p><strong>Can't hold it back anymore</strong><br/><em>Je ne peux plus le retenir</em></p>
  <p><strong>Let it go, let it go</strong><br/><em>Laissez-passer, laissez-passer</em></p>
  <p><strong>Turn away and slam the door</strong><br/><em>Détourne-toi et claque la porte</em></p>
  <p><strong>I don't care what they're going to say</strong><br/><em>Je me fiche de ce qu'ils vont dire</em></p>
  <p><strong>Let the storm rage on</strong><br/><em>Laisse la tempête faire rage</em></p>
  <p><strong>The cold never bothered me anyway</strong><br/><em>Le froid ne m'a jamais dérangée de toute façon</em></p>
</div>

<h2>📚 Vocabulaire de Frozen</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Snow</td><td>Neige</td></tr>
<tr><td>Ice</td><td>Glace</td></tr>
<tr><td>Queen</td><td>Reine</td></tr>
<tr><td>Princess</td><td>Princesse</td></tr>
<tr><td>Let it go</td><td>Laisse tomber / Libère-toi</td></tr>
<tr><td>Storm</td><td>Tempête</td></tr>
<tr><td>Cold</td><td>Froid</td></tr>
<tr><td>Door</td><td>Porte</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>Apprenez "Let It Go" par cœur ! Chantez sous la douche, dans la voiture... C'est le meilleur exercice de prononciation.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "P10 — Practice : Dessins Animés — Mulan",
    "Apprendre l'anglais avec une histoire de courage et de détermination",
    `<div class="lecon-anglais">
<h1>📺 P10 — Practice : Mulan</h1>

<div class="intro-box">
<p><strong>Niveau :</strong> Débutant — Intermédiaire<br/>
<strong>Durée :</strong> 1h28 (version 1998)<br/>
<strong>Thème :</strong> Courage, famille, identité<br/>
<strong>Pourquoi ce film ?</strong> Histoire inspirante de femme forte. Chansons mémorables.</p>
</div>

<h2>📖 Résumé simple</h2>
<div class="dialogue-box">
<p>Mulan est une jeune Chinoise. Quand les Huns attaquent la Chine, chaque famille doit envoyer un homme à l'armée. Le père de Mulan est vieux et malade. Mulan décide de se déguiser en homme et de partir à sa place. Elle devient une grande guerrière.</p>
<p>C'est une histoire sur le <strong>courage d'une femme</strong> qui désobéit pour sauver sa famille.</p>
</div>

<h2>🎥 Vidéo — "Reflection" (chanson)</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/39nQoaz7x_w" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>

<h2>📝 Phrases célèbres</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>"The flower that blooms in adversity is the most rare and beautiful of all."</strong><br/>La fleur qui s'épanouit dans l'adversité est la plus rare et la plus belle de toutes.</div>
  <div class="vocab-item"><strong>"My duty is to my heart."</strong><br/>Mon devoir est envers mon cœur.</div>
  <div class="vocab-item"><strong>"Let's get down to business."</strong><br/>Mettons-nous au travail. (Chanson célèbre)</div>
</div>

<h2>📚 Vocabulaire de Mulan</h2>
<table class="verb-table">
<tr><th>Anglais</th><th>Français</th></tr>
<tr><td>Warrior</td><td>Guerrière</td></tr>
<tr><td>Duty</td><td>Devoir</td></tr>
<tr><td>Honor</td><td>Honneur</td></tr>
<tr><td>Reflection</td><td>Reflet / Réflexion</td></tr>
<tr><td>Adversity</td><td>Adversité</td></tr>
<tr><td>Army</td><td>Armée</td></tr>
<tr><td>Brave</td><td>Courageuse</td></tr>
<tr><td>True</td><td>Vrai</td></tr>
</table>

<h2>💡 Conseil</h2>
<p>La chanson "Reflection" est belle et lente. Parfaite pour apprendre la prononciation. Essayez de la chanter !</p>
</div>`,
    ordreStart++
  );

  console.log("\n✅=== PRACTICE (Films + Dessins Animés) CRÉÉS ===");
  console.log("Prochain ordre : " + ordreStart);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
