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

  // Trouver le prochain ordre disponible
  const lastChap = await db.collection("chapitres").find({ matiereId: matiereId, niveau: "Adulte" }).sort({ ordre: -1 }).limit(1).toArray();
  let ordreStart = lastChap.length > 0 ? (lastChap[0].ordre || 0) + 1 : 1;

  // Nettoyer anciens chapitres "Listening" (qui utilisent des liens YouTube)
  const oldToClean = await db.collection("chapitres").find({
    matiereId: matiereId, niveau: "Adulte",
    titre: { $regex: /^LI\d*\s*—\s*Listening/i }
  }).toArray();
  for (const c of oldToClean) {
    await db.collection("lecons").deleteMany({ chapitreId: c._id });
    await db.collection("chapitres").deleteOne({ _id: c._id });
  }
  console.log(`🧹 ${oldToClean.length} anciens chapitres LI nettoyés`);

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
  //  LISTENING AVEC VIDÉOS YOUTUBE INTÉGRÉES
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "LI1 — Listening : Daily Conversations",
    "Écouter et comprendre des dialogues quotidiens en anglais authentique",
    `<div class="lecon-anglais">
<h1>🎧 LI1 — Listening : Daily Conversations</h1>

<div class="intro-box">
<p>Écoutez des conversations authentiques entre locuteurs natifs. Chaque vidéo est suivie d'exercices de compréhension.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Savoir saluer et se présenter en anglais</li>
<li>Comprendre des conversations de la vie quotidienne</li>
<li>Identifier les expressions familières</li>
<li>Améliorer votre oreille avec l'anglais authentique</li>
</ul>

<h2>🎬 Vidéo 1 — Greetings & Introductions (A1)</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/2TxVyxrOp0s" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Thème :</strong> Salutations et présentations — verbe "be" (singulier et négatif). Niveau A1. Fondamental pour débuter.</p>
</div>

<h2>✏️ Exercice de compréhension</h2>
<div class="bloc-essentiel">
  <h3>Questions (écoutez la vidéo puis répondez)</h3>
  <ol>
    <li>How do you say "Bonjour" in English?</li>
    <li>What is the difference between "Hi" and "Hello"?</li>
    <li>How do you introduce yourself? (ex: "My name is...")</li>
    <li>How do you say "Comment ça va ?" and how do you answer?</li>
  </ol>
</div>

<h2>📝 Vocabulaire de la vidéo</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>Hello / Hi</strong> — Bonjour / Salut</div>
  <div class="vocab-item"><strong>Good morning / Good afternoon</strong> — Bonjour (selon moment)</div>
  <div class="vocab-item"><strong>Goodbye / Bye</strong> — Au revoir</div>
  <div class="vocab-item"><strong>My name is...</strong> — Je m'appelle...</div>
  <div class="vocab-item"><strong>Nice to meet you</strong> — Enchanté(e)</div>
  <div class="vocab-item"><strong>How are you?</strong> — Comment allez-vous ?</div>
  <div class="vocab-item"><strong>I'm fine, thank you</strong> — Je vais bien, merci</div>
</div>

<h2>🎬 Vidéo 2 — Ordering at a Café</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/Zr4SJkF4PfA" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Thème :</strong> Commander dans un café — expressions utiles pour les débutants.</p>
</div>

<h2>✏️ Exercice de compréhension</h2>
<div class="bloc-essentiel">
  <h3>Questions (écoutez la vidéo puis répondez)</h3>
  <ol>
    <li>What does the customer order first?</li>
    <li>Does the customer want the coffee "for here" or "to go"?</li>
    <li>How much does the order cost?</li>
    <li>What size does the customer choose?</li>
  </ol>
</div>

<h2>📝 Vocabulaire de la vidéo</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>For here / To go</strong> — Sur place / À emporter</div>
  <div class="vocab-item"><strong>Can I get...?</strong> — Puis-je avoir...?</div>
  <div class="vocab-item"><strong>That'll be...</strong> — Ça fera... (prix)</div>
  <div class="vocab-item"><strong>Anything else?</strong> — Autre chose?</div>
  <div class="vocab-item"><strong>Grande / Tall / Venti</strong> — Tailles Starbucks</div>
</div>

<h2>🎬 Vidéo 2 — Making Small Talk</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/3egHji8-8Q8" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Thème :</strong> Comment faire la conversation avec des inconnus — small talk.</p>
</div>

<h2>✏️ Exercice de compréhension</h2>
<div class="bloc-essentiel">
  <h3>Questions</h3>
  <ol>
    <li>What are good topics for small talk?</li>
    <li>What topics should you avoid?</li>
    <li>What does the speaker say about the weather?</li>
  </ol>
</div>

<h2>💡 Conseil d'écoute</h2>
<p><strong>Méthode active :</strong></p>
<ol>
  <li>1ère écoute — Écoutez sans sous-titres, capturez l'idée générale</li>
  <li>2ème écoute — Activez les sous-titres EN ANGLAIS, notez les mots nouveaux</li>
  <li>3ème écoute — Écoutez sans sous-titres, vérifiez votre compréhension</li>
  <li>4ème écoute — Pausez et répétez les phrases à voix haute</li>
</ol>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "LI2 — Listening : Job Interviews",
    "Écouter des entretiens d'embauche réels et s'entraîner à répondre",
    `<div class="lecon-anglais">
<h1>🎧 LI2 — Listening : Job Interviews</h1>

<div class="intro-box">
<p>Préparez-vous aux entretiens d'embauche en écoutant des simulations réelles et en analysant les réponses.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Comprendre les questions classiques d'entretien</li>
<li>Analyser des réponses modèles</li>
<li>S'entraîner à répondre à voix haute</li>
</ul>

<h2>🎬 Vidéo 1 — Common Interview Questions</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/1mHjMNZZvFo" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Thème :</strong> Les 10 questions les plus fréquentes en entretien d'embauche.</p>
</div>

<h2>✏️ Exercice — Remplissez les blancs</h2>
<div class="bloc-essentiel">
  <p>Écoutez et complétez :</p>
  <ol>
    <li>"Tell me about _______" — Question classique d'introduction</li>
    <li>"What is your greatest _______?" — Question sur les forces</li>
    <li>"Where do you see yourself in _______ years?" — Question sur l'avenir</li>
    <li>"Why should we _______ you?" — Question difficile</li>
  </ol>
</div>

<h2>🎬 Vidéo 2 — Mock Interview Example</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/HG68Ymazo18" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Thème :</strong> Simulation complète d'un entretien d'embauche en anglais.</p>
</div>

<h2>📝 Expressions clés à retenir</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>I'm a good fit for this role</strong> — Je suis fait pour ce poste</div>
  <div class="vocab-item"><strong>I thrive under pressure</strong> — Je m'épanouis sous pression</div>
  <div class="vocab-item"><strong>I'm a team player</strong> — Je travaille bien en équipe</div>
  <div class="vocab-item"><strong>My strength is...</strong> — Mon point fort est...</div>
  <div class="vocab-item"><strong>I'm working on improving...</strong> — Je travaille à améliorer...</div>
</div>

<h2>🎓 Exercice pratique</h2>
<p><strong>Enregistrez-vous</strong> en répondant à ces 3 questions :</p>
<ol>
  <li>"Tell me about yourself."</li>
  <li>"What are your strengths?"</li>
  <li>"Why do you want this job?"</li>
</ol>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "LI3 — Listening : TED Talks — Ideas Worth Spreading",
    "Comprendre des conférences TED en anglais avec des sous-titres",
    `<div class="lecon-anglais">
<h1>🎧 LI3 — Listening : TED Talks</h1>

<div class="intro-box">
<p>Les TED Talks sont des conférences courtes et inspirantes. Elles utilisent un anglais clair et sont idéales pour progresser.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Comprendre des présentations structurées en anglais</li>
<li>Apprendre du vocabulaire sur des sujets variés</li>
<li>Suivre un discours de 10-15 minutes</li>
</ul>

<h2>🎬 Vidéo 1 — The Power of Vulnerability (Brené Brown)</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/iCvmsMzlF7o" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Thème :</strong> Le pouvoir de la vulnérabilité — une des TED Talks les plus vues.</p>
  <p><strong>Niveau :</strong> Intermédiaire-avancé</p>
</div>

<h2>✏️ Exercice de compréhension</h2>
<div class="bloc-essentiel">
  <h3>Vrai ou Faux ?</h3>
  <ol>
    <li>Brené Brown is a researcher on shame and vulnerability.</li>
    <li>She believes vulnerability is a weakness.</li>
    <li>People who are vulnerable are also courageous.</li>
    <li>She mentions "wholehearted" people.</li>
  </ol>
</div>

<h2>🎬 Vidéo 2 — How Great Leaders Inspire Action (Simon Sinek)</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/qp0HIF3SfI4" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Thème :</strong> Comment les grands leaders inspirent l'action — le célèbre "Golden Circle".</p>
  <p><strong>Niveau :</strong> Intermédiaire</p>
</div>

<h2>📝 Vocabulaire des TED Talks</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>Vulnerability</strong> — Vulnérabilité</div>
  <div class="vocab-item"><strong>Worth spreading</strong> — Qui mérite d'être partagé</div>
  <div class="vocab-item"><strong>Inspire</strong> — Inspirer</div>
  <div class="vocab-item"><strong>Research</strong> — Recherche</div>
  <div class="vocab-item"><strong>Evidence</strong> — Preuve / Evidence</div>
  <div class="vocab-item"><strong>Connection</strong> — Connexion</div>
</div>

<h2>💡 Conseil</h2>
<p>Commencez par regarder avec les <strong>sous-titres en anglais</strong>, puis essayez sans. Les TED Talks ont des transcripts complets disponibles sur le site ted.com.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "LI4 — Listening : News & BBC 6 Minute English",
    "Suivre l'actualité en anglais et apprendre avec BBC Learning English",
    `<div class="lecon-anglais">
<h1>🎧 LI4 — Listening : News & BBC 6 Minute English</h1>

<div class="intro-box">
<p>Apprenez l'anglais avec l'actualité et les programmes éducatifs de la BBC. Contenu riche, prononciation claire.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Comprendre les journaux télévisés en anglais</li>
<li>Suivre les programmes éducatifs de la BBC</li>
<li>Apprendre du vocabulaire d'actualité</li>
</ul>

<h2>🎬 Vidéo 1 — BBC 6 Minute English : Sleep</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/8pQsRfte1t8" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Thème :</strong> Le sommeil — vocabulaire de la santé et du bien-être.</p>
  <p><strong>Niveau :</strong> Intermédiaire</p>
</div>

<h2>✏️ Exercice</h2>
<div class="bloc-essentiel">
  <h3>Complétez avec les mots de la vidéo</h3>
  <ol>
    <li>Sleep _______ is when you don't get enough sleep. (déficit)</li>
    <li>Adults need about 7-9 hours of sleep per _______. (nuit)</li>
    <li>Your body has a natural sleep _______. (rythme)</li>
    <li>Lack of sleep can affect your _______ and health. (humeur)</li>
  </ol>
</div>

<h2>🎬 Vidéo 2 — BBC News Report</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/r4pNEdIt_l4" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Thème :</strong> BBC News — apprenez le vocabulaire des médias.</p>
</div>

<h2>📝 Vocabulaire des news</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>Breaking news</strong> — Dernières nouvelles</div>
  <div class="vocab-item"><strong>Headlines</strong> — Titres</div>
  <div class="vocab-item"><strong>Report</strong> — Reportage</div>
  <div class="vocab-item"><strong>Anchor</strong> — Présentateur</div>
  <div class="vocab-item"><strong>Interview</strong> — Entretien</div>
  <div class="vocab-item"><strong>Source</strong> — Source</div>
</div>

<h2>💡 Conseil</h2>
<p>Regardez <strong>CNN 10</strong> (10 minutes) chaque jour. C'est un journal conçu pour les étudiants d'anglais — vocabulaire accessible, sujets variés.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "LI5 — Listening : Movies & TV Shows",
    "Apprendre l'anglais avec des extraits de films et séries TV",
    `<div class="lecon-anglais">
<h1>🎧 LI5 — Listening : Movies & TV Shows</h1>

<div class="intro-box">
<p>Apprenez l'anglais authentique avec des extraits de films et séries. L'anglais des films est rapide, avec du slang et des expressions culturelles.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Comprendre l'anglais parlé rapidement</li>
<li>Apprendre des expressions idiomatiques</li>
<li>S'habituer aux différents accents</li>
</ul>

<h2>🎬 Vidéo 1 — Friends : The One with the Routine</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/LSau2lWY3DQ" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Thème :</strong> Friends — l'anglais américain quotidien, humour et expressions familières.</p>
</div>

<h2>✏️ Exercice</h2>
<div class="bloc-essentiel">
  <h3>Quelles expressions reconnaissez-vous ?</h3>
  <ol>
    <li>"How you doin'?" — Expression signature de Joey</li>
    <li>"We were on a break!" — Célèbre dispute de Ross et Rachel</li>
    <li>"I know!" — Expression de Monica</li>
  </ol>
  <p><strong>Exercice :</strong> Notez 5 nouvelles expressions que vous entendez dans l'extrait.</p>
</div>

<h2>🎬 Vidéo 2 — The Crown : Formal British English</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/JW3WfSFUbk" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Thème :</strong> The Crown — anglais britannique formel et royal.</p>
</div>

<h2>📝 Expressions de films/séries</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>Quote</strong> — Citation</div>
  <div class="vocab-item"><strong>Script</strong> — Scénario</div>
  <div class="vocab-item"><strong>Scene</strong> — Scène</div>
  <div class="vocab-item"><strong>Plot</strong> — Intrigue</div>
  <div class="vocab-item"><strong>Spoiler</strong> — Révélation de l'intrigue</div>
  <div class="vocab-item"><strong>Binge-watch</strong> — Regarder en marathon</div>
</div>

<h2>💡 Conseil</h2>
<p>Commencez par regarder avec les <strong>sous-titres en anglais</strong>, pas en français. Cela force votre cerveau à faire le lien direct entre le son et le sens.</p>
</div>`,
    ordreStart++
  );

  await addChapitre(
    "LI6 — Listening : Songs & Music",
    "Apprendre l'anglais avec des chansons populaires et leurs paroles",
    `<div class="lecon-anglais">
<h1>🎧 LI6 — Listening : Songs & Music</h1>

<div class="intro-box">
<p>La musique est un outil puissant pour apprendre l'anglais. Les paroles restent en mémoire plus facilement que les listes de vocabulaire.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Comprendre les paroles de chansons anglaises</li>
<li>Apprendre du vocabulaire en contexte émotionnel</li>
<li>Améliorer la prononciation en chantant</li>
</ul>

<h2>🎬 Vidéo 1 — Perfect — Ed Sheeran (Lyrics)</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/2Vv-BfVoq4g" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Thème :</strong> Chanson d'amour — vocabulaire romantique, présent simple.</p>
</div>

<h2>✏️ Exercice — Complétez les paroles</h2>
<div class="bloc-essentiel">
  <p>Écoutez et complétez :</p>
  <ol>
    <li>"I found a love for _______"</li>
    <li>"Darling, just dive right in and follow my _______"</li>
    <li>"Well, I found a girl, beautiful and _______"</li>
    <li>"We are still kids, but we're so in _______"</li>
  </ol>
</div>

<h2>🎬 Vidéo 2 — Shape of You — Ed Sheeran (Lyrics)</h2>
<div class="example-box">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/JGwWNGJdvx8" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Thème :</strong> Expressions modernes et slang dans la pop.</p>
</div>

<h2>📝 Vocabulaire des chansons</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>Darling</strong> — Chéri(e)</div>
  <div class="vocab-item"><strong>I'm in love</strong> — Je suis amoureux</div>
  <div class="vocab-item"><strong>Heartbeat</strong> — Battement de cœur</div>
  <div class="vocab-item"><strong>Barefoot</strong> — Pieds nus</div>
  <div class="vocab-item"><strong>Come over</strong> — Passer (chez quelqu'un)</div>
  <div class="vocab-item"><strong>Grab a bite</strong> — Manger quelque chose rapidement</div>
</div>

<h2>💡 Conseil</h2>
<p>Utilisez <strong>LyricsTraining.com</strong> — un jeu interactif où vous complétez les mots manquants en écoutant. Très efficace et amusant !</p>

<h2>🎓 Exercice</h2>
<p><strong>Choisissez votre chanson préférée en anglais.</strong></p>
<ol>
  <li>Écoutez-la et écrivez les paroles</li>
  <li>Traduisez les expressions nouvelles</li>
  <li>Apprenez-la par cœur et chantez !</li>
</ol>
</div>`,
    ordreStart++
  );


  await addChapitre(
    "LI7 — Listening : Séries de Conversations (Oxford English)",
    "Regarder des séries de dialogues avec sous-titres pour progresser en compréhension orale",
    `<div class="lecon-anglais">
<h1>🎧 LI7 — Listening : Séries de Conversations</h1>

<div class="intro-box">
<p>Ces vidéos sont de véritables séries de conversations en anglais, avec sous-titres intégrés. Idéal pour s'immerger dans l'anglais quotidien.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Suivre une longue conversation en anglais</li>
<li>Associer les sons aux mots écrits (sous-titres)</li>
<li>Acquérir le rythme et l'intonation naturels</li>
</ul>

<h2>🎬 Série 1 — Oxford English Daily Conversation</h2>
<div class="example-box">
  <p><strong>Partie 1</strong> (recommandée pour débuter)</p>
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/DPmtnb8NBog" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Chaîne :</strong> English7Levels (2.43M abonnés) — 27M vues</p>
  <p><strong>Astuce :</strong> Regardez d'abord avec sous-titres anglais, puis sans. Répétez les phrases à voix haute.</p>
</div>

<h2>✏️ Exercice de compréhension</h2>
<div class="bloc-essentiel">
  <h3>Observez et notez</h3>
  <ol>
    <li>Quels sont les premiers mots échangés quand deux personnes se rencontrent ?</li>
    <li>Comment les gens se présentent-ils ?</li>
    <li>Quelles questions posent-ils pour faire connaissance ?</li>
    <li>Notez 5 expressions utiles que vous avez entendues.</li>
  </ol>
</div>

<h2>📝 Vocabulaire clé</h2>
<div class="vocab-grid">
  <div class="vocab-item"><strong>Where are you from?</strong> — D'où viens-tu ?</div>
  <div class="vocab-item"><strong>What do you do?</strong> — Que fais-tu dans la vie ?</div>
  <div class="vocab-item"><strong>Nice to meet you too</strong> — Enchanté(e) aussi</div>
  <div class="vocab-item"><strong>See you later</strong> — À plus tard</div>
  <div class="vocab-item"><strong>Have a nice day</strong> — Bonne journée</div>
</div>

<h2>🎬 Série 2 — English Comedy Speaking Part 1</h2>
<div class="example-box">
  <p><strong>Longue vidéo (2h42)</strong> — Parfaite pour une séance d'immersion</p>
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:1rem 0;">
    <iframe src="https://www.youtube.com/embed/_KXmZKW_cag" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p><strong>Style :</strong> Sketches comiques avec sous-titres. Léger et motivant.</p>
</div>

<h2>💡 Méthode d'écoute active</h2>
<div class="bloc-essentiel">
  <ol>
    <li><strong>1ère écoute</strong> — Regardez avec sous-titres anglais, suivez le fil</li>
    <li><strong>2ème écoute</strong> — Sans sous-titres, essayez de tout comprendre</li>
    <li><strong>3ème écoute</strong> — Pausez après chaque phrase et répétez à voix haute</li>
    <li><strong>Répétition</strong> — Regardez 1-2 scènes par jour pour ancrer le vocabulaire</li>
  </ol>
</div>
</div>`,
    ordreStart++
  );

  console.log("\n✅=== LISTENING AVEC VIDÉOS YOUTUBE CRÉÉS ===");
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

