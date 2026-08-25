const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const admin = await db.collection("users").findOne({ role: "admin" });
  const adminId = admin?._id?.toString() || "69dfac0adb8037a014ca9178";

  // Vérifier si matière existe déjà
  let matiere = await db.collection("matieres").findOne({ code: "AN-AD" });
  let matId;

  if (!matiere) {
    const mat = await db.collection("matieres").insertOne({
      code: "AN-AD", nom: "Anglais Adultes", icone: "🇬🇧", couleur: "#1D9E75",
      niveaux: ["Adulte"], actif: true, estLangue: true, ordre: 12,
      createdAt: new Date(), updatedAt: new Date()
    });
    matId = mat.insertedId.toString();
    console.log("✅ Matière AN-AD créée");
  } else {
    matId = matiere._id.toString();
    console.log("ℹ️ Matière AN-AD existe déjà");
    // Nettoyer anciens chapitres
    const oldChaps = await db.collection("chapitres").find({ matiereId: new mongoose.Types.ObjectId(matId), niveau: "Adulte" }).toArray();
    for (const c of oldChaps) {
      await db.collection("lecons").deleteMany({ chapitreId: c._id });
      await db.collection("chapitres").deleteOne({ _id: c._id });
    }
    console.log("🧹 Anciens chapitres nettoyés");
  }

  const matiereId = new mongoose.Types.ObjectId(matId);

  async function addChapitre(titre, objectif, contenuHTML, questions, ordre) {
    const chap = await db.collection("chapitres").insertOne({
      matiereId: matiereId, titre, niveau: "Adulte", objectif, ordre, actif: true,
      createdAt: new Date(), updatedAt: new Date()
    });

    const correctionsTypes = questions.map((q, i) => ({
      question: q.q, reponse: q.r, type: "q", explication: q.exp || ""
    }));

    await db.collection("lecons").insertOne({
      chapitreId: chap.insertedId, titre, matiere: matId, classe: "Adulte", statut: "publie",
      masque: false, creePar: adminId, contenuHTML, contenuBrut: "",
      dureeExercices: 20,
      contenuFormate: { correctionsTypes, exercices: [] },
      createdAt: new Date(), updatedAt: new Date()
    });

    console.log(`  📖 ${titre}`);
    return chap.insertedId;
  }

  // ═══════════════════════════════════════════════════════
  //  MODULE 1 : ENGLISH FUNDAMENTALS
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "M1 — Ch1 : The Verb 'To Be' & Personal Introductions",
    "Maîtriser le verbe TO BE et savoir se présenter dans toutes les situations",
    `<div class="lecon-anglais">
<h1>👋 Module 1 — Chapitre 1 : The Verb "To Be" & Personal Introductions</h1>

<div class="intro-box">
<p>Le verbe <strong>TO BE</strong> est le fondement de l'anglais. Sans lui, impossible de dire qui vous êtes, où vous êtes, ou comment vous vous sentez. Ce chapitre vous donne les bases solides pour toute conversation.</p>
</div>

<h2>🎯 Objectifs du chapitre</h2>
<ul>
<li>Conjuguer TO BE à tous les temps du présent</li>
<li>Se présenter formellement et informellement</li>
<li>Poser des questions sur l'identité</li>
<li>Utiliser les salutations adaptées au contexte</li>
</ul>

<h2>📚 Conjugaison de TO BE (Présent)</h2>
<table class="conj-table">
<tr><th>Sujet</th><th>Affirmatif</th><th>Négatif</th><th>Interrogatif</th></tr>
<tr><td>I</td><td><strong>am</strong></td><td>am not</td><td>Am I...?</td></tr>
<tr><td>You</td><td><strong>are</strong></td><td>are not (aren't)</td><td>Are you...?</td></tr>
<tr><td>He/She/It</td><td><strong>is</strong></td><td>is not (isn't)</td><td>Is he/she/it...?</td></tr>
<tr><td>We</td><td><strong>are</strong></td><td>are not (aren't)</td><td>Are we...?</td></tr>
<tr><td>They</td><td><strong>are</strong></td><td>are not (aren't)</td><td>Are they...?</td></tr>
</table>

<h2>💬 Dialogues types</h2>

<div class="dialogue-box">
<h3>🟢 Situation informelle (entre amis)</h3>
<p><strong>A:</strong> Hi! I'm Sarah. <em>(Salut ! Je suis Sarah.)</em></p>
<p><strong>B:</strong> Hey Sarah, nice to meet you! I'm Mike. <em>(Hé Sarah, enchanté ! Je suis Mike.)</em></p>
<p><strong>A:</strong> Where are you from, Mike? <em>(D'où viens-tu, Mike ?)</em></p>
<p><strong>B:</strong> I'm from Canada. And you? <em>(Je viens du Canada. Et toi ?)</em></p>
<p><strong>A:</strong> I'm from Senegal, but I live in Paris now. <em>(Je viens du Sénégal, mais je vis à Paris maintenant.)</em></p>
</div>

<div class="dialogue-box">
<h3>🔵 Situation professionnelle (réunion, entretien)</h3>
<p><strong>A:</strong> Good morning. My name is James Anderson. I am the project manager. <em>(Bonjour. Je m'appelle James Anderson. Je suis le chef de projet.)</em></p>
<p><strong>B:</strong> Pleased to meet you, Mr. Anderson. I am Aminata Diallo, the marketing director. <em>(Enchanté de vous rencontrer, M. Anderson. Je suis Aminata Diallo, la directrice marketing.)</em></p>
<p><strong>A:</strong> Is this your first time in London? <em>(Est-ce votre première fois à Londres ?)</em></p>
<p><strong>B:</strong> No, it isn't. I was here last year for a conference. <em>(Non. J'étais ici l'année dernière pour une conférence.)</em></p>
</div>

<h2>📝 Vocabulaire essentiel</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>Good morning</strong> — Bonjour (matin)</div>
<div class="vocab-item"><strong>Good afternoon</strong> — Bonjour (après-midi)</div>
<div class="vocab-item"><strong>Good evening</strong> — Bonsoir</div>
<div class="vocab-item"><strong>Hello / Hi</strong> — Salut</div>
<div class="vocab-item"><strong>Nice to meet you</strong> — Enchanté(e)</div>
<div class="vocab-item"><strong>Pleased to meet you</strong> — Ravi(e) de vous rencontrer</div>
<div class="vocab-item"><strong>How are you?</strong> — Comment allez-vous ?</div>
<div class="vocab-item"><strong>I'm fine, thanks</strong> — Je vais bien, merci</div>
<div class="vocab-item"><strong>What is your name?</strong> — Comment vous appelez-vous ?</div>
<div class="vocab-item"><strong>Where are you from?</strong> — D'où venez-vous ?</div>
<div class="vocab-item"><strong>How old are you?</strong> — Quel âge avez-vous ?</div>
<div class="vocab-item"><strong>What do you do?</strong> — Que faites-vous dans la vie ?</div>
</div>

<h2>⚠️ Erreurs fréquentes à éviter</h2>
<ul>
<li>❌ <em>I am agree</em> → ✅ <em>I agree</em> (Pas de BE avec agree)</li>
<li>❌ <em>She have</em> → ✅ <em>She has</em> (BE ≠ HAVE)</li>
<li>❌ <em>I am 25 years</em> → ✅ <em>I am 25 years old</em></li>
<li>❌ <em>He is engineer</em> → ✅ <em>He is an engineer</em> (article indéfini)</li>
</ul>

<h2>🎓 Exercice pratique</h2>
<p><strong>Présentez-vous en 5 phrases minimum :</strong></p>
<ol>
<li>Your name and origin</li>
<li>Your age</li>
<li>Your profession</li>
<li>Where you live now</li>
<li>One thing you like</li>
</ol>
<p><em>Exemple : "My name is Jean. I am from Ivory Coast. I am 28 years old. I am a software developer. I live in Abidjan. I like playing football."</em></p>
</div>`,
    [
      { q: "Quelle est la forme de TO BE avec 'I' ?", r: "am", exp: "I am = Je suis" },
      { q: "Comment dit-on 'Enchanté' en anglais formel ?", r: "Pleased to meet you", exp: "Nice to meet you est plus informel" },
      { q: "Quelle question pose-t-on pour demander l'origine ?", r: "Where are you from?", exp: "Réponse type : I am from Senegal" },
      { q: "Complétez : He ___ a doctor.", r: "is", exp: "3ème personne du singulier = is" },
      { q: "Forme négative de 'They are students'", r: "They aren't students / They are not students", exp: "Contraction : aren't" }
    ],
    1
  );

  await addChapitre(
    "M1 — Ch2 : Present Simple & Daily Routines",
    "Maîtriser le présent simple pour parler de ses habitudes et routines quotidiennes",
    `<div class="lecon-anglais">
<h1>📅 Module 1 — Chapitre 2 : Present Simple & Daily Routines</h1>

<div class="intro-box">
<p>Le <strong>Present Simple</strong> sert à décrire des actions habituelles, des faits généraux, et des routines. C'est le temps le plus utilisé au quotidien.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Former le Present Simple (affirmatif, négatif, interrogatif)</li>
<li>Utiliser les adverbes de fréquence (always, usually, often...)</li>
<li>Décrire sa journée type en anglais</li>
<li>Poser des questions sur les habitudes</li>
</ul>

<h2>📚 Formation du Present Simple</h2>

<h3>✅ Affirmatif</h3>
<ul>
<li>I / You / We / They + <strong>verbe simple</strong> → I work, they eat</li>
<li>He / She / It + <strong>verbe + s/es</strong> → He works, she eats, it goes</li>
</ul>

<h3>❌ Négatif</h3>
<ul>
<li>I / You / We / They + <strong>do not (don't)</strong> + verbe → I don't like</li>
<li>He / She / It + <strong>does not (doesn't)</strong> + verbe → She doesn't play</li>
</ul>

<h3>❓ Interrogatif</h3>
<ul>
<li><strong>Do</strong> + I/you/we/they + verbe ? → Do you speak English?</li>
<li><strong>Does</strong> + he/she/it + verbe ? → Does he live here?</li>
</ul>

<h2>⏰ Adverbes de fréquence</h2>
<table class="freq-table">
<tr><th>Adverbe</th><th>Français</th><th>Position</th></tr>
<tr><td><strong>Always</strong></td><td>Toujours (100%)</td><td>Avant le verbe principal</td></tr>
<tr><td><strong>Usually</strong></td><td>Habituellement</td><td>Avant le verbe principal</td></tr>
<tr><td><strong>Often</strong></td><td>Souvent</td><td>Avant le verbe principal</td></tr>
<tr><td><strong>Sometimes</strong></td><td>Parfois</td><td>Avant le verbe principal OU en début/fin</td></tr>
<tr><td><strong>Rarely</strong></td><td>Rarement</td><td>Avant le verbe principal</td></tr>
<tr><td><strong>Never</strong></td><td>Jamais (0%)</td><td>Avant le verbe principal</td></tr>
</table>

<h2>💬 Exemples de routine quotidienne</h2>

<div class="dialogue-box">
<h3>🌅 Ma journée type (A Day in My Life)</h3>
<p><strong>6:30 AM</strong> — I <strong>wake up</strong> and I <strong>stretch</strong>. <em>(Je me réveille et je m'étire.)</em></p>
<p><strong>7:00 AM</strong> — I <strong>have breakfast</strong>. I usually <strong>eat</strong> bread with butter and I <strong>drink</strong> coffee. <em>(Je prends le petit-déjeuner. Je mange habituellement du pain avec du beurre et je bois du café.)</em></p>
<p><strong>8:00 AM</strong> — I <strong>go to work</strong> by bus. <em>(Je vais au travail en bus.)</em></p>
<p><strong>12:30 PM</strong> — I <strong>have lunch</strong> with my colleagues. We often <strong>eat</strong> at a restaurant near the office. <em>(Je déjeune avec mes collègues. Nous mangeons souvent au restaurant près du bureau.)</em></p>
<p><strong>5:00 PM</strong> — I <strong>finish work</strong> and I <strong>go home</strong>. <em>(Je finis le travail et je rentre chez moi.)</em></p>
<p><strong>7:00 PM</strong> — I <strong>have dinner</strong> with my family. After dinner, I sometimes <strong>watch TV</strong> or I <strong>read a book</strong>. <em>(Je dîne avec ma famille. Après le dîner, je regarde parfois la télé ou je lis un livre.)</em></p>
<p><strong>10:30 PM</strong> — I <strong>go to bed</strong>. I never <strong>go to bed</strong> after midnight. <em>(Je me couche. Je ne me couche jamais après minuit.)</em></p>
</div>

<h2>📝 Verbes essentiels pour la routine</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>Wake up</strong> — Se réveiller</div>
<div class="vocab-item"><strong>Get up</strong> — Se lever</div>
<div class="vocab-item"><strong>Take a shower</strong> — Prendre une douche</div>
<div class="vocab-item"><strong>Brush teeth</strong> — Se brosser les dents</div>
<div class="vocab-item"><strong>Get dressed</strong> — S'habiller</div>
<div class="vocab-item"><strong>Have breakfast/lunch/dinner</strong> — Petit-déj/déjeuner/dîner</div>
<div class="vocab-item"><strong>Go to work</strong> — Aller au travail</div>
<div class="vocab-item"><strong>Start work</strong> — Commencer le travail</div>
<div class="vocab-item"><strong>Have a break</strong> — Faire une pause</div>
<div class="vocab-item"><strong>Finish work</strong> — Finir le travail</div>
<div class="vocab-item"><strong>Go home</strong> — Rentrer chez soi</div>
<div class="vocab-item"><strong>Cook</strong> — Cuisiner</div>
<div class="vocab-item"><strong>Do housework</strong> — Faire le ménage</div>
<div class="vocab-item"><strong>Go to bed</strong> — Se coucher</div>
<div class="vocab-item"><strong>Sleep</strong> — Dormir</div>
</div>

<h2>⚠️ Erreurs fréquentes</h2>
<ul>
<li>❌ <em>She don't like</em> → ✅ <em>She doesn't like</em> (3e pers. = does)</li>
<li>❌ <em>He works not</em> → ✅ <em>He doesn't work</em></li>
<li>❌ <em>I am go to work</em> → ✅ <em>I go to work</em> (Pas de BE + verbe simple)</li>
<li>❌ <em>Do he live here?</em> → ✅ <em>Does he live here?</em></li>
</ul>

<h2>🎓 Exercice</h2>
<p><strong>Décrivez votre journée type en 8-10 phrases.</strong> Utilisez au moins 3 adverbes de fréquence.</p>
</div>`,
    [
      { q: "Quel auxiliaire utilise-t-on avec 'He' au négatif ?", r: "does not / doesn't", exp: "3ème personne = does" },
      { q: "Où place-t-on les adverbes de fréquence ?", r: "Avant le verbe principal", exp: "Ex: I always eat breakfast" },
      { q: "Quel adverbe signifie 'jamais' ?", r: "Never", exp: "Never = 0% de fréquence" },
      { q: "Forme interrogative : 'You speak English' → ?", r: "Do you speak English?", exp: "Do + sujet + verbe" },
      { q: "Conjuguez : She (to work) → 3ème personne", r: "She works", exp: "Ajout de -s en 3ème personne" }
    ],
    2
  );

  await addChapitre(
    "M1 — Ch3 : Present Continuous & Actions in Progress",
    "Décrire des actions en cours et faire la différence avec le Present Simple",
    `<div class="lecon-anglais">
<h1>🎬 Module 1 — Chapitre 3 : Present Continuous & Actions in Progress</h1>

<div class="intro-box">
<p>Le <strong>Present Continuous</strong> (ou Present Progressive) décrit une action qui se passe <strong>maintenant</strong>, au moment où on parle. Il sert aussi à parler de projets futurs proches.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Former le Present Continuous correctement</li>
<li>Différencier Present Simple et Present Continuous</li>
<li>Utiliser les expressions de temps du moment présent</li>
<li>Parler de projets futurs arrêtés</li>
</ul>

<h2>📚 Formation du Present Continuous</h2>
<p><strong>TO BE + verbe en -ING</strong></p>

<table class="conj-table">
<tr><th>Sujet</th><th>Affirmatif</th><th>Négatif</th><th>Interrogatif</th></tr>
<tr><td>I</td><td>I <strong>am working</strong></td><td>I am not working</td><td>Am I working?</td></tr>
<tr><td>You</td><td>You <strong>are eating</strong></td><td>You aren't eating</td><td>Are you eating?</td></tr>
<tr><td>He/She/It</td><td>He <strong>is reading</strong></td><td>He isn't reading</td><td>Is he reading?</td></tr>
<tr><td>We</td><td>We <strong>are talking</strong></td><td>We aren't talking</td><td>Are we talking?</td></tr>
<tr><td>They</td><td>They <strong>are playing</strong></td><td>They aren't playing</td><td>Are they playing?</td></tr>
</table>

<h2>🔧 Règles d'orthographe pour le -ING</h2>
<ul>
<li><strong>Verbe simple</strong> → add -ing : <em>work → working, read → reading</em></li>
<li><strong>Verbe en -e</strong> → drop e + -ing : <em>make → making, write → writing</em></li>
<li><strong>CVC (consonne-voyelle-consonne) accentué</strong> → double consonnes : <em>run → running, swim → swimming, sit → sitting</em></li>
<li><strong>Verbe en -ie</strong> → change en y + -ing : <em>die → dying, lie → lying</em></li>
</ul>

<h2>⏱️ Quand utiliser le Present Continuous ?</h2>

<h3>1️⃣ Action en cours maintenant</h3>
<p>"I <strong>am studying</strong> English right now." <em>(J'étudie l'anglais en ce moment.)</em></p>
<p>"She <strong>is talking</strong> on the phone at the moment." <em>(Elle est au téléphone en ce moment.)</em></p>

<h3>2️⃣ Action temporaire (pas habituelle)</h3>
<p>"I usually walk to work, but this week I <strong>am taking</strong> the bus because my car is broken." <em>(D'habitude je vais au travail à pied, mais cette semaine je prends le bus car ma voiture est en panne.)</em></p>

<h3>3️⃣ Changement / évolution</h3>
<p>"The climate <strong>is getting</strong> warmer every year." <em>(Le climat se réchauffe chaque année.)</em></p>

<h3>4️⃣ Projet futur proche (arrangé)</h3>
<p>"I <strong>am meeting</strong> my boss tomorrow at 9 AM." <em>(Je rencontre mon patron demain à 9h — c'est prévu.)</em></p>
<p>"We <strong>are flying</strong> to Paris next Monday." <em>(Nous volons vers Paris lundi prochain.)</em></p>

<h2>⚔️ Present Simple vs Present Continuous</h2>
<table class="compare-table">
<tr><th>Present Simple</th><th>Present Continuous</th></tr>
<tr><td>Habitudes, routines</td><td>Actions en cours maintenant</td></tr>
<tr><td>Vérités générales</td><td>Situations temporaires</td></tr>
<tr><td>Horaires, programmes fixes</td><td>Projets futurs proches</td></tr>
<tr><td>"I <strong>work</strong> in Dakar."</td><td>"I <strong>am working</strong> on a project this week."</td></tr>
<tr><td>"The train <strong>leaves</strong> at 8."</td><td>"I <strong>am leaving</strong> tomorrow."</td></tr>
</table>

<h2>💬 Dialogue</h2>
<div class="dialogue-box">
<p><strong>A:</strong> Hey, what <strong>are you doing</strong>? <em>(Hé, qu'est-ce que tu fais ?)</em></p>
<p><strong>B:</strong> I <strong>am cooking</strong> dinner. I <strong>am making</strong> chicken with rice. <em>(Je cuisine le dîner. Je fais du poulet avec du riz.)</em></p>
<p><strong>A:</strong> That smells good! Usually, <strong>do you cook</strong> every day? <em>(Ça sent bon ! D'habitude, est-ce que tu cuisines tous les jours ?)</em></p>
<p><strong>B:</strong> No, I <strong>don't</strong>. I usually <strong>order</strong> food. But this week I <strong>am trying</strong> to eat healthier. <em>(Non. D'habitude je commande à manger. Mais cette semaine j'essaie de manger plus sain.)</em></p>
</div>

<h2>📝 Expressions de temps avec le Continuous</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>Right now</strong> — En ce moment</div>
<div class="vocab-item"><strong>At the moment</strong> — Pour le moment</div>
<div class="vocab-item"><strong>Currently</strong> — Actuellement</div>
<div class="vocab-item"><strong>Now</strong> — Maintenant</div>
<div class="vocab-item"><strong>Today</strong> — Aujourd'hui (dans le contexte)</div>
<div class="vocab-item"><strong>This week/month</strong> — Cette semaine/ce mois</div>
<div class="vocab-item"><strong>These days</strong> — Ces temps-ci</div>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Décrivez ce que vous faites en ce moment et ce que vous faites habituellement.</strong></p>
<p><em>Exemple : Right now, I am sitting at my desk and I am reading an English lesson. Usually, I work in an office, but today I am studying from home.</em></p>
</div>`,
    [
      { q: "Quelle est la formule du Present Continuous ?", r: "TO BE + verbe-ing", exp: "Ex: I am working" },
      { q: "Quand utilise-t-on le Present Continuous pour le futur ?", r: "Pour les projets futurs proches et arrêtés", exp: "Ex: I am meeting him tomorrow" },
      { q: "Quelle est la différence entre 'I work' et 'I am working' ?", r: "Work = habitude, am working = action en cours", exp: "Simple = habituel, Continuous = temporaire/maintenant" },
      { q: "Comment forme-t-on le -ING de 'write' ?", r: "writing", exp: "On enlève le -e final : write → writing" },
      { q: "Complétez : Look! She ___ (dance) beautifully.", r: "is dancing", exp: "Action visible en ce moment = Present Continuous" }
    ],
    3
  );

  await addChapitre(
    "M1 — Ch4 : Simple Past & Life Stories",
    "Raconter des événements passés et maîtriser les verbes irréguliers essentiels",
    `<div class="lecon-anglais">
<h1>📖 Module 1 — Chapitre 4 : Simple Past & Life Stories</h1>

<div class="intro-box">
<p>Le <strong>Simple Past</strong> sert à raconter des histoires, des souvenirs, des expériences passées. C'est le temps du récit.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Conjuguer les verbes réguliers et irréguliers au passé</li>
<li>Maîtriser les 50 verbes irréguliers les plus courants</li>
<li>Former des questions et phrases négatives au passé</li>
<li>Raconter une expérience personnelle de manière fluide</li>
</ul>

<h2>📚 Formation du Simple Past</h2>

<h3>✅ Verbes réguliers : +ED</h3>
<p>I worked / You played / She watched / We studied / They lived</p>

<h3>⚠️ Orthographe des réguliers</h3>
<ul>
<li><strong>Verbe en -e</strong> → +d : <em>live → lived, dance → danced</em></li>
<li><strong>Consonne + y</strong> → -y + ied : <em>study → studied, carry → carried</em> (MAIS : play → played)</li>
<li><strong>CVC accentué</strong> → double + ed : <em>stop → stopped, plan → planned</em></li>
</ul>

<h3>🔥 Verbes irréguliers essentiels (à mémoriser absolument)</h3>
<table class="verb-table">
<tr><th>Infinitif</th><th>Passé</th><th>Participe passé</th><th>Traduction</th></tr>
<tr><td>be</td><td>was/were</td><td>been</td><td>être</td></tr>
<tr><td>have</td><td>had</td><td>had</td><td>avoir</td></tr>
<tr><td>do</td><td>did</td><td>done</td><td>faire</td></tr>
<tr><td>go</td><td>went</td><td>gone</td><td>aller</td></tr>
<tr><td>come</td><td>came</td><td>come</td><td>venir</td></tr>
<tr><td>see</td><td>saw</td><td>seen</td><td>voir</td></tr>
<tr><td>take</td><td>took</td><td>taken</td><td>prendre</td></tr>
<tr><td>get</td><td>got</td><td>got/gotten</td><td>obtenir</td></tr>
<tr><td>make</td><td>made</td><td>made</td><td>faire/créer</td></tr>
<tr><td>say</td><td>said</td><td>said</td><td>dire</td></tr>
<tr><td>know</td><td>knew</td><td>known</td><td>savoir/connaître</td></tr>
<tr><td>think</td><td>thought</td><td>thought</td><td>penser</td></tr>
<tr><td>eat</td><td>ate</td><td>eaten</td><td>manger</td></tr>
<tr><td>drink</td><td>drank</td><td>drunk</td><td>boire</td></tr>
<tr><td>sleep</td><td>slept</td><td>slept</td><td>dormir</td></tr>
<tr><td>speak</td><td>spoke</td><td>spoken</td><td>parler</td></tr>
<tr><td>write</td><td>wrote</td><td>written</td><td>écrire</td></tr>
<tr><td>read</td><td>read</td><td>read</td><td>lire</td></tr>
<tr><td>give</td><td>gave</td><td>given</td><td>donner</td></tr>
<tr><td>find</td><td>found</td><td>found</td><td>trouver</td></tr>
<tr><td>tell</td><td>told</td><td>told</td><td>raconter/dire</td></tr>
<tr><td>feel</td><td>felt</td><td>felt</td><td>sentir</td></tr>
<tr><td>leave</td><td>left</td><td>left</td><td>quitter/laisser</td></tr>
<tr><td>begin</td><td>began</td><td>begun</td><td>commencer</td></tr>
<tr><td>bring</td><td>brought</td><td>brought</td><td>apporter</td></tr>
</table>

<h2>❓ Questions et négation au passé</h2>
<p>Tous les verbes (réguliers et irréguliers) utilisent <strong>DID</strong> pour les questions et la négation.</p>

<div class="example-box">
<p><strong>Affirmatif :</strong> I <strong>went</strong> to Paris last year.</p>
<p><strong>Négatif :</strong> I <strong>didn't go</strong> to Paris last year. <em>(Did + not + infinitif)</em></p>
<p><strong>Interrogatif :</strong> <strong>Did</strong> you <strong>go</strong> to Paris last year? <em>(Did + sujet + infinitif)</em></p>
<p><strong>Réponse courte :</strong> Yes, I did. / No, I didn't.</p>
</div>

<h2>⏰ Expressions de temps au passé</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>Yesterday</strong> — Hier</div>
<div class="vocab-item"><strong>Last week/month/year</strong> — La semaine/le mois/l'année dernière</div>
<div class="vocab-item"><strong>Two days ago</strong> — Il y a deux jours</div>
<div class="vocab-item"><strong>In 2020</strong> — En 2020</div>
<div class="vocab-item"><strong>When I was young</strong> — Quand j'étais jeune</div>
<div class="vocab-item"><strong>Once upon a time</strong> — Il était une fois</div>
<div class="vocab-item"><strong>Previously / Before</strong> — Auparavant / Avant</div>
<div class="vocab-item"><strong>At that time</strong> — À cette époque</div>
</div>

<h2>💬 Raconter une histoire</h2>
<div class="dialogue-box">
<h3>📖 Mon premier voyage à l'étranger</h3>
<p>"Three years ago, I <strong>decided</strong> to travel abroad for the first time. I <strong>chose</strong> to visit Morocco because I <strong>wanted</strong> to discover a new culture.</p>
<p>I <strong>took</strong> a plane from Dakar to Casablanca. The flight <strong>was</strong> long but exciting. When I <strong>arrived</strong>, a friend <strong>met</strong> me at the airport. We <strong>went</strong> to a traditional restaurant and I <strong>ate</strong> the best couscous of my life!</p>
<p>During my stay, I <strong>visited</strong> Marrakech, Fes, and Rabat. I <strong>saw</strong> beautiful palaces and I <strong>learned</strong> a few words in Arabic. I <strong>made</strong> many friends and I <strong>took</strong> hundreds of photos.</p>
<p>It <strong>was</strong> an unforgettable experience. I <strong>returned</strong> home with wonderful memories. Since that day, I <strong>have loved</strong> traveling!"</p>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Racontez un événement important de votre vie</strong> (voyage, diplôme, rencontre, premier travail...) en 8-12 phrases au Simple Past.</p>
<p>Utilisez au moins 5 verbes irréguliers différents.</p>
</div>`,
    [
      { q: "Quel auxiliaire utilise-t-on pour les questions au Simple Past ?", r: "Did", exp: "Did + sujet + verbe à l'infinitif" },
      { q: "Quel est le passé de 'go' ?", r: "went", exp: "Go → went → gone" },
      { q: "Comment dit-on 'hier' en anglais ?", r: "Yesterday", exp: "Yesterday = le jour avant aujourd'hui" },
      { q: "Forme négative : She played tennis.", r: "She didn't play tennis.", exp: "Did not + infinitif" },
      { q: "Quel est le passé de 'eat' ?", r: "ate", exp: "Eat → ate → eaten" }
    ],
    4
  );

  await addChapitre(
    "M1 — Ch5 : Future Tenses & Projects",
    "Exprimer le futur avec will, going to, et le Present Continuous",
    `<div class="lecon-anglais">
<h1>🔮 Module 1 — Chapitre 5 : Future Tenses & Projects</h1>

<div class="intro-box">
<p>L'anglais propose plusieurs façons de parler du futur. Chacune a sa nuance. Savoir les distinguer et les utiliser correctement est essentiel pour parler de projets, faire des prédictions, et prendre des décisions.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Maîtriser WILL, GOING TO, et le Present Continuous futur</li>
<li>Faire des prédictions, promesses, et offres</li>
<li>Parler de projets arrêtés vs décisions spontanées</li>
<li>Utiliser le Future Continuous et Future Perfect (niveau avancé)</li>
</ul>

<h2>📚 Les 3 façons de parler du futur</h2>

<h3>1️⃣ WILL — Décision spontanée / Prédiction / Promesse</h3>
<p><strong>Formation :</strong> Sujet + will + infinitif</p>
<div class="example-box">
<p>🎯 <strong>Prédiction :</strong> "I think it <strong>will rain</strong> tomorrow." <em>(Je pense qu'il pleuvra demain.)</em></p>
<p>⚡ <strong>Décision spontanée :</strong> "Oh, the phone is ringing! I <strong>will answer</strong> it." <em>(Oh, le téléphone sonne ! Je vais répondre.)</em></p>
<p>🤝 <strong>Promesse :</strong> "I <strong>will always love</strong> you." <em>(Je t'aimerai toujours.)</em></p>
<p>🎁 <strong>Offre :</strong> "<strong>Will</strong> I <strong>help</strong> you with your bags?" <em>(Puis-je t'aider avec tes sacs ?)</em></p>
</div>

<h3>2️⃣ GOING TO — Projet prévu / Prédiction basée sur des indices</h3>
<p><strong>Formation :</strong> Sujet + to be + going to + infinitif</p>
<div class="example-box">
<p>📋 <strong>Projet prévu :</strong> "I <strong>am going to study</strong> medicine at university." <em>(Je vais étudier la médecine à l'université — c'est décidé.)</em></p>
<p>👀 <strong>Prédiction avec indices :</strong> "Look at those black clouds! It <strong>is going to rain</strong>." <em>(Regarde ces nuages noirs ! Il va pleuvoir — on le voit venir.)</em></p>
</div>

<h3>3️⃣ Present Continuous — Arrangement futur proche</h3>
<div class="example-box">
<p>📅 <strong>Arrangement confirmé :</strong> "I <strong>am meeting</strong> my boss tomorrow at 10 AM." <em>(J'ai un rendez-vous avec mon patron demain à 10h — c'est confirmé.)</em></p>
<p>✈️ <strong>Voyage planifié :</strong> "We <strong>are flying</strong> to London next week." <em>(Nous prenons l'avion pour Londres la semaine prochaine.)</em></p>
</div>

<h2>⚔️ WILL vs GOING TO — Résumé rapide</h2>
<table class="compare-table">
<tr><th>WILL</th><th>GOING TO</th></tr>
<tr><td>Décision prise AU MOMENT où on parle</td><td>Projet DÉJÀ DÉCIDÉ avant</td></tr>
<tr><td>Prédiction basée sur une opinion</td><td>Prédiction basée sur des FAITS visibles</td></tr>
<tr><td>Promesse, offre, menace</td><td>Intention, plan</td></tr>
<tr><td>"I'm thirsty. I <strong>will get</strong> some water."</td><td>"I <strong>am going to get</strong> married next year."</td></tr>
</table>

<h2>🔮 Future Continuous & Future Perfect</h2>

<h3>Future Continuous — Action en cours à un moment futur</h3>
<p><strong>Will + be + verbe-ing</strong></p>
<p>"This time tomorrow, I <strong>will be flying</strong> to New York." <em>(À cette heure demain, je serai en train de voler vers New York.)</em></p>

<h3>Future Perfect — Action terminée avant un moment futur</h3>
<p><strong>Will + have + participe passé</strong></p>
<p>"By 2027, I <strong>will have finished</strong> my studies." <em>(D'ici 2027, j'aurai terminé mes études.)</em></p>
<p>"By the time you arrive, I <strong>will have prepared</strong> dinner." <em>(Au moment où tu arriveras, j'aurai préparé le dîner.)</em></p>

<h2>⏰ Expressions de temps pour le futur</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>Tomorrow</strong> — Demain</div>
<div class="vocab-item"><strong>Next week/month/year</strong> — La semaine/le mois/l'année prochain(e)</div>
<div class="vocab-item"><strong>In two days</strong> — Dans deux jours</div>
<div class="vocab-item"><strong>Soon</strong> — Bientôt</div>
<div class="vocab-item"><strong>Later</strong> — Plus tard</div>
<div class="vocab-item"><strong>In the future</strong> — Dans le futur</div>
<div class="vocab-item"><strong>By 2030</strong> — D'ici 2030</div>
<div class="vocab-item"><strong>One day</strong> — Un jour</div>
</div>

<h2>💬 Dialogue — Projets d'avenir</h2>
<div class="dialogue-box">
<p><strong>A:</strong> What <strong>are you going to do</strong> after you finish your studies? <em>(Qu'est-ce que tu vas faire après tes études ?)</em></p>
<p><strong>B:</strong> I <strong>am going to start</strong> my own business. I <strong>will open</strong> a small restaurant in Dakar. <em>(Je vais créer ma propre entreprise. J'ouvrirai un petit restaurant à Dakar.)</em></p>
<p><strong>A:</strong> That sounds great! <strong>Will</strong> you <strong>need</strong> investors? <em>(Ça a l'air génial ! Tu auras besoin d'investisseurs ?)</em></p>
<p><strong>B:</strong> Maybe. I <strong>am meeting</strong> a potential partner next Monday. We <strong>are going to discuss</strong> the business plan. <em>(Peut-être. Je rencontre un partenaire potentiel lundi prochain. Nous allons discuter du business plan.)</em></p>
<p><strong>A:</strong> Good luck! By this time next year, you <strong>will have opened</strong> your restaurant! <em>(Bonne chance ! D'ici un an à cette époque, tu auras ouvert ton restaurant !)</em></p>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Décrivez vos projets pour les 5 prochaines années.</strong> Utilisez WILL, GOING TO, et le Present Continuous.</p>
<p><em>Exemple : Next year, I am going to finish my degree. After that, I will look for a job abroad. In 3 years, I will have saved enough money to buy a car.</em></p>
</div>`,
    [
      { q: "Quand utilise-t-on WILL pour une décision ?", r: "Quand la décision est prise au moment de parler", exp: "Ex: Oh, I'll help you!" },
      { q: "Quelle est la différence entre WILL et GOING TO pour les prédictions ?", r: "WILL = opinion, GOING TO = indices visibles", exp: "Going to = on voit que ça va arriver" },
      { q: "Forme le Future Perfect : By 2025, I (finish) my studies.", r: "By 2025, I will have finished my studies.", exp: "Will + have + participe passé" },
      { q: "Quand utilise-t-on le Present Continuous pour le futur ?", r: "Pour les arrangements et projets confirmés", exp: "Ex: I'm meeting him tomorrow" },
      { q: "Traduis : 'Je vais déménager à Paris l'année prochaine' (projet décidé)", r: "I am going to move to Paris next year.", exp: "Projet décidé = going to" }
    ],
    5
  );

  await addChapitre(
    "M1 — Ch6 : Modal Verbs — Can, Must, Should, May",
    "Maîtriser les verbes modaux pour exprimer capacité, obligation, conseil et permission",
    `<div class="lecon-anglais">
<h1>🎛️ Module 1 — Chapitre 6 : Modal Verbs — Can, Must, Should, May</h1>

<div class="intro-box">
<p>Les <strong>verbes modaux</strong> sont des auxiliaires qui expriment des nuances : capacité, obligation, conseil, permission, possibilité... Ils sont incontournables pour un anglais naturel et fluide.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Utiliser CAN, COULD, MUST, SHOULD, MAY, MIGHT correctement</li>
<li>Exprimer la capacité, l'obligation, le conseil, la permission</li>
<li>Différencier MUST et HAVE TO</li>
<li>Utiliser les modaux au passé</li>
</ul>

<h2>📚 Les modaux essentiels</h2>

<h3>1️⃣ CAN — Capacité / Permission / Possibilité</h3>
<div class="example-box">
<p>💪 <strong>Capacité :</strong> "I <strong>can</strong> speak three languages." <em>(Je peux parler trois langues.)</em></p>
<p>✅ <strong>Permission (informel) :</strong> "<strong>Can</strong> I use your phone?" <em>(Puis-je utiliser ton téléphone ?)</em></p>
<p>❓ <strong>Possibilité :</strong> "It <strong>can</strong> get very cold here at night." <em>(Il peut faire très froid ici la nuit.)</em></p>
</div>

<h3>2️⃣ COULD — Capacité passée / Politesse / Possibilité</h3>
<div class="example-box">
<p>⏮️ <strong>Capacité passée :</strong> "When I was young, I <strong>could</strong> run very fast." <em>(Quand j'étais jeune, je pouvais courir très vite.)</em></p>
<p>🙏 <strong>Politesse :</strong> "<strong>Could</strong> you help me, please?" <em>(Pourriez-vous m'aider, s'il vous plaît ? — plus poli que 'Can you')</em></p>
<p>🤔 <strong>Possibilité théorique :</strong> "It <strong>could</strong> rain tomorrow." <em>(Il pourrait pleuvoir demain.)</em></p>
</div>

<h3>3️⃣ MUST — Obligation forte / Déduction logique</h3>
<div class="example-box">
<p>📜 <strong>Obligation (personnelle, interne) :</strong> "I <strong>must</strong> finish this report today." <em>(Je dois finir ce rapport aujourd'hui.)</em></p>
<p>🕵️ <strong>Déduction :</strong> "He <strong>must be</strong> tired. He worked all night." <em>(Il doit être fatigué. Il a travaillé toute la nuit.)</em></p>
</div>

<h3>4️⃣ HAVE TO — Obligation externe / Nécessité</h3>
<div class="example-box">
<p>🏛️ <strong>Obligation externe :</strong> "I <strong>have to</strong> wear a uniform at work." <em>(Je dois porter un uniforme au travail — c'est la règle.)</em></p>
<p>⏰ <strong>Nécessité :</strong> "You <strong>have to</strong> arrive before 9 AM." <em>(Tu dois arriver avant 9h.)</em></p>
</div>

<h3>5️⃣ SHOULD — Conseil / Recommandation</h3>
<div class="example-box">
<p>💡 <strong>Conseil :</strong> "You <strong>should</strong> drink more water." <em>(Tu devrais boire plus d'eau.)</em></p>
<p>🎯 <strong>Recommandation :</strong> "You <strong>shouldn't</strong> eat too much sugar." <em>(Tu ne devrais pas manger trop de sucre.)</em></p>
</div>

<h3>6️⃣ MAY — Permission formelle / Possibilité</h3>
<div class="example-box">
<p>🏢 <strong>Permission formelle :</strong> "<strong>May</strong> I come in?" <em>(Puis-je entrer ? — très formel)</em></p>
<p>🎲 <strong>Possibilité :</strong> "It <strong>may</strong> snow tomorrow." <em>(Il neigera peut-être demain.)</em></p>
</div>

<h3>7️⃣ MIGHT — Possibilité faible / Incertitude</h3>
<div class="example-box">
<p>🌫️ <strong>Incertitude :</strong> "I <strong>might</strong> go to the party, but I'm not sure." <em>(J'irai peut-être à la fête, mais je ne suis pas sûr.)</em></p>
<p>"It <strong>might</strong> be true, but I doubt it." <em>(C'est peut-être vrai, mais j'en doute.)</em></p>
</div>

<h2>⚔️ MUST vs HAVE TO</h2>
<table class="compare-table">
<tr><th>MUST</th><th>HAVE TO</th></tr>
<tr><td>Obligation <strong>interne</strong> (on se l'impose)</td><td>Obligation <strong>externe</strong> (règle, loi)</td></tr>
<tr><td>"I <strong>must</strong> study harder." (choix perso)</td><td>"I <strong>have to</strong> pay taxes." (loi)</td></tr>
<tr><td>Interdit : MUSTN'T</td><td>Interdit : DON'T HAVE TO (pas obligé)</td></tr>
<tr><td>"You <strong>mustn't</strong> smoke here." (interdit)</td><td>"You <strong>don't have to</strong> come." (pas obligé)</td></tr>
</table>

<h2>📊 Tableau récapitulatif des modaux</h2>
<table class="verb-table">
<tr><th>Modal</th><th>Utilisation</th><th>Exemple</th></tr>
<tr><td>Can</td><td>Capacité, permission</td><td>I can swim.</td></tr>
<tr><td>Could</td><td>Capacité passée, politesse</td><td>Could you help me?</td></tr>
<tr><td>Must</td><td>Obligation forte, déduction</td><td>You must be careful.</td></tr>
<tr><td>Have to</td><td>Obligation externe</td><td>I have to work.</td></tr>
<tr><td>Should</td><td>Conseil</td><td>You should rest.</td></tr>
<tr><td>May</td><td>Permission, possibilité</td><td>May I sit here?</td></tr>
<tr><td>Might</td><td>Possibilité faible</td><td>It might rain.</td></tr>
</table>

<h2>💬 Dialogue — À l'aéroport</h2>
<div class="dialogue-box">
<p><strong>Passenger:</strong> Excuse me, <strong>could</strong> you tell me where the check-in counter is? <em>(Excusez-moi, pourriez-vous me dire où est le comptoir d'enregistrement ?)</em></p>
<p><strong>Agent:</strong> Of course. You <strong>can</strong> find it on the second floor. <strong>May</strong> I see your passport, please? <em>(Bien sûr. Vous pouvez le trouver au deuxième étage. Puis-je voir votre passeport ?)</em></p>
<p><strong>Passenger:</strong> Here it is. <strong>Do I have to</strong> check in my hand luggage too? <em>(Le voici. Dois-je enregistrer mon bagage à main aussi ?)</em></p>
<p><strong>Agent:</strong> No, you <strong>don't have to</strong>. But you <strong>must</strong> put it through security screening. You <strong>should</strong> arrive at the gate 30 minutes before departure. <em>(Non, ce n'est pas obligé. Mais vous devez le passer au contrôle de sécurité. Vous devriez arriver à la porte 30 minutes avant le départ.)</em></p>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Complétez les phrases avec le modal approprié (can, could, must, should, may, might) :</strong></p>
<ol>
<li>I _________ speak French and English.</li>
<li>You _________ see a doctor if you feel sick.</li>
<li>_________ I borrow your pen?</li>
<li>It _________ be true, but I don't believe it.</li>
<li>We _________ finish the project before Friday.</li>
</ol>
</div>`,
    [
      { q: "Quel modal exprime la capacité ?", r: "Can", exp: "Can = savoir faire / être capable" },
      { q: "Quelle est la différence entre MUST et HAVE TO ?", r: "Must = obligation interne, Have to = obligation externe", exp: "Must = on s'impose, Have to = règle extérieure" },
      { q: "Quel modal est le plus poli pour demander la permission ?", r: "May", exp: "May I... ? = très formel et poli" },
      { q: "Quel modal exprime un conseil ?", r: "Should", exp: "You should... = Tu devrais..." },
      { q: "Comment dit-on 'Peut-être qu'il pleuvra' avec un modal ?", r: "It might rain.", exp: "Might = possibilité faible / incertitude" }
    ],
    6
  );

  // ═══════════════════════════════════════════════════════
  //  MODULE 2 : BUSINESS ENGLISH
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "M2 — Ch1 : Professional Emails & Communication",
    "Rédiger des emails professionnels clairs, efficaces et adaptés au contexte",
    `<div class="lecon-anglais">
<h1>💼 Module 2 — Chapitre 1 : Professional Emails & Communication</h1>

<div class="intro-box">
<p>L'email est l'outil de communication professionnelle le plus utilisé au monde. Savoir rédiger un email clair, poli et efficace est une compétence essentielle pour toute carrière internationale.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Structurer un email professionnel (sujet, salutation, corps, formule de politesse)</li>
<li>Adapter le ton selon le destinataire (formel, semi-formel, informel)</li>
<li>Utiliser les formules standard de l'anglais des affaires</li>
<li>Rédiger des emails pour différentes situations (demande, réclamation, remerciement)</li>
</ul>

<h2>📧 Structure d'un email professionnel</h2>

<h3>1️⃣ Ligne d'objet (Subject Line)</h3>
<p>Claire, concise, informative. Le destinataire doit comprendre le sujet en un coup d'œil.</p>
<div class="example-box">
<p>✅ <strong>Bon :</strong> "Meeting Request — Project Alpha Review, June 15th"</p>
<p>✅ <strong>Bon :</strong> "RE: Invoice #4521 — Payment Confirmation"</p>
<p>❌ <strong>Éviter :</strong> "Hello" / "Question" / "Important!!!"</p>
</div>

<h3>2️⃣ Salutation (Greeting)</h3>
<table class="verb-table">
<tr><th>Contexte</th><th>Formule</th></tr>
<tr><td>Inconnu (très formel)</td><td>Dear Sir or Madam, / To Whom It May Concern,</td></tr>
<tr><td>Connu de nom seulement</td><td>Dear Mr. Smith, / Dear Ms. Johnson,</td></tr>
<tr><td>Contact régulier</td><td>Dear John, / Dear Sarah,</td></tr>
<tr><td>Collègue proche</td><td>Hi John, / Hello Sarah,</td></tr>
</table>

<h3>3️⃣ Introduction — Pourquoi vous écrivez</h3>
<div class="example-box">
<p>📌 <strong>Premier contact :</strong> "I am writing to inquire about..." <em>(Je vous écris pour me renseigner sur...)</em></p>
<p>📌 <strong>Réponse :</strong> "Thank you for your email regarding..." <em>(Merci pour votre email concernant...)</em></p>
<p>📌 <strong>Suivi :</strong> "I am writing to follow up on..." <em>(Je vous écris pour faire suite à...)</em></p>
<p>📌 <strong>Plainte :</strong> "I am writing to express my dissatisfaction with..." <em>(Je vous écris pour exprimer mon mécontentement concernant...)</em></p>
</div>

<h3>4️⃣ Corps du message — Clarté et concision</h3>
<p>Une idée par paragraphe. Utilisez des puces pour les listes.</p>

<h3>5️⃣ Conclusion et appel à l'action</h3>
<div class="example-box">
<p>"I look forward to hearing from you." <em>(Dans l'attente de votre réponse.)</em></p>
<p>"Please let me know if you need any further information." <em>(N'hésitez pas à me contacter si vous avez besoin d'informations complémentaires.)</em></p>
<p>"Could you please confirm your availability by Friday?" <em>(Pourriez-vous confirmer votre disponibilité avant vendredi ?)</em></p>
</div>

<h3>6️⃣ Formule de politesse (Closing)</h3>
<table class="verb-table">
<tr><th>Ton</th><th>Formule</th></tr>
<tr><td>Très formel</td><td>Yours faithfully, (si vous ne connaissez pas le nom)<br/>Yours sincerely, (si vous connaissez le nom)</td></tr>
<tr><td>Formel</td><td>Best regards, / Kind regards, / Sincerely,</td></tr>
<tr><td>Semi-formel</td><td>Best, / Regards, / Warm regards,</td></tr>
<tr><td>Informel</td><td>Cheers, / Thanks, / Talk soon,</td></tr>
</table>

<h2>✉️ Exemples d'emails complets</h2>

<div class="dialogue-box">
<h3>🟢 Email formel — Demande d'information</h3>
<p><strong>Subject:</strong> Inquiry — Partnership Opportunities with ABC Company</p>
<p>Dear Mr. Thompson,</p>
<p>I am writing to inquire about potential partnership opportunities between our companies. I recently read about your expansion into the African market, and I believe our organization could offer valuable support.</p>
<p>Specifically, we specialize in:</p>
<ul>
<li>Market research and analysis</li>
<li>Local distribution networks</li>
<li>Regulatory compliance consulting</li>
</ul>
<p>Would you be available for a brief call next week to discuss this further? I am free on Tuesday afternoon or Thursday morning.</p>
<p>I look forward to hearing from you.</p>
<p>Best regards,</p>
<p>Aminata Diallo<br/>Business Development Manager<br/>Global Partners Ltd.<br/>Tel: +221 77 123 45 67</p>
</div>

<div class="dialogue-box">
<h3>🟡 Email semi-formel — Suivi</h3>
<p><strong>Subject:</strong> RE: Project Phoenix — Timeline Update Needed</p>
<p>Hi Sarah,</p>
<p>I hope you're doing well.</p>
<p>I'm following up on the Project Phoenix timeline we discussed last week. Could you please send me the updated schedule by Wednesday? We need to present it to the client on Friday.</p>
<p>Also, please confirm if the design team has finished the mockups.</p>
<p>Thanks in advance for your help!</p>
<p>Best,</p>
<p>James</p>
</div>

<h2>📝 Expressions clés pour les emails</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>I am writing to...</strong> — Je vous écris pour...</div>
<div class="vocab-item"><strong>With reference to...</strong> — En référence à...</div>
<div class="vocab-item"><strong>Please find attached...</strong> — Veuillez trouver ci-joint...</div>
<div class="vocab-item"><strong>I would appreciate it if...</strong> — J'apprécierais si...</div>
<div class="vocab-item"><strong>Could you please...?</strong> — Pourriez-vous...?</div>
<div class="vocab-item"><strong>I apologize for the delay</strong> — Je m'excuse pour le retard</div>
<div class="vocab-item"><strong>As discussed...</strong> — Comme convenu...</div>
<div class="vocab-item"><strong>Please do not hesitate to contact me</strong> — N'hésitez pas à me contacter</div>
<div class="vocab-item"><strong>I look forward to...</strong> — Dans l'attente de...</div>
<div class="vocab-item"><strong>Thank you in advance</strong> — Merci d'avance</div>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Rédigez un email professionnel pour l'une des situations suivantes :</strong></p>
<ol>
<li>Demander un rendez-vous avec un client potentiel</li>
<li>Répondre à une offre d'emploi</li>
<li>Demander des informations sur un produit</li>
<li>Confirmer une réservation d'hôtel</li>
</ol>
<p>Respectez la structure complète et utilisez au moins 5 expressions du cours.</p>
</div>`,
    [
      { q: "Quelle salutation utilise-t-on quand on ne connaît pas le nom ?", r: "Dear Sir or Madam, / To Whom It May Concern,", exp: "Très formel, quand le destinataire est inconnu" },
      { q: "Comment signe-t-on un email très formel si on connaît le nom ?", r: "Yours sincerely,", exp: "Yours faithfully = nom inconnu, Yours sincerely = nom connu" },
      { q: "Que signifie 'I look forward to hearing from you' ?", r: "Dans l'attente de votre réponse", exp: "Formule standard de conclusion" },
      { q: "Comment demande-t-on poliment quelque chose dans un email ?", r: "Could you please...? / I would appreciate it if...", exp: "Formes polies et professionnelles" },
      { q: "Quelle expression utilise-t-on pour dire 'Veuillez trouver ci-joint' ?", r: "Please find attached...", exp: "Standard pour les pièces jointes" }
    ],
    7
  );

  await addChapitre(
    "M2 — Ch2 : Meetings & Presentations",
    "Participer à des réunions et faire des présentations en anglais avec aisance",
    `<div class="lecon-anglais">
<h1>🎯 Module 2 — Chapitre 2 : Meetings & Presentations</h1>

<div class="intro-box">
<p>Les réunions et présentations en anglais sont incontournables dans le monde professionnel international. Ce chapitre vous donne les outils pour vous exprimer avec clarté, gérer les interactions, et convaincre votre audience.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Animer et participer à une réunion en anglais</li>
<li>Structurer une présentation professionnelle</li>
<li>Utiliser le vocabulaire des réunions (agenda, action items, minutes...)</li>
<li>Gérer les questions et objections</li>
</ul>

<h2>📋 Vocabulaire des réunions</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>Meeting / Conference call</strong> — Réunion / Visioconférence</div>
<div class="vocab-item"><strong>Agenda</strong> — Ordre du jour</div>
<div class="vocab-item"><strong>Chairperson / Host</strong> — Président de séance / Animateur</div>
<div class="vocab-item"><strong>Attendee / Participant</strong> — Participant</div>
<div class="vocab-item"><strong>Minutes</strong> — Compte-rendu</div>
<div class="vocab-item"><strong>Action items</strong> — Actions à suivre</div>
<div class="vocab-item"><strong>Deadline</strong> — Date butoir</div>
<div class="vocab-item"><strong>Follow-up</strong> — Suivi</div>
<div class="vocab-item"><strong>Quorum</strong> — Quorum</div>
<div class="vocab-item"><strong>Minutes of the last meeting</strong> — Compte-rendu de la dernière réunion</div>
<div class="vocab-item"><strong>Any other business (AOB)</strong> — Questions diverses</div>
<div class="vocab-item"><strong>To table a motion</strong> — Soumettre une motion</div>
</div>

<h2>🎤 Animer une réunion</h2>

<h3>Introduction</h3>
<div class="example-box">
<p>"Good morning, everyone. Thank you for coming. Let's get started." <em>(Bonjour à tous. Merci d'être là. Commençons.)</em></p>
<p>"The purpose of today's meeting is to discuss the Q3 results and plan our strategy for Q4." <em>(Le but de la réunion d'aujourd'hui est de discuter des résultats du T3 et de planifier notre stratégie pour le T4.)</em></p>
<p>"Let's go through the agenda. First, we'll review the budget. Then, Sarah will present the marketing plan." <em>(Parcourons l'ordre du jour. D'abord, nous examinerons le budget. Ensuite, Sarah présentera le plan marketing.)</em></p>
</div>

<h3>Gérer la parole</h3>
<div class="example-box">
<p>"James, would you like to start?" <em>(James, voulez-vous commencer ?)</em></p>
<p>"Let's hear from the finance team." <em>(Écoutons l'équipe finance.)</em></p>
<p>"Sorry to interrupt, but we need to move on." <em>(Désolé d'interrompre, mais nous devons avancer.)</em></p>
<p>"Could you keep it brief, please? We have a lot to cover." <em>(Pourriez-vous être bref ? Nous avons beaucoup à aborder.)</em></p>
</div>

<h3>Clôturer</h3>
<div class="example-box">
<p>"Before we wrap up, let's summarize the action items." <em>(Avant de conclure, résumons les actions.)</em></p>
<p>"Thank you all for your input. The next meeting will be on March 15th at 2 PM." <em>(Merci à tous pour vos contributions. La prochaine réunion aura lieu le 15 mars à 14h.)</em></p>
<p>"I'll send the minutes by end of day." <em>(J'enverrai le compte-rendu avant la fin de la journée.)</em></p>
</div>

<h2>📊 Faire une présentation</h2>

<h3>Structure classique</h3>
<ol>
<li><strong>Hook / Accroche</strong> — Attirer l'attention</li>
<li><strong>Introduction</strong> — Se présenter, annoncer le sujet</li>
<li><strong>Body / Corps</strong> — 3 points maximum, avec exemples</li>
<li><strong>Conclusion</strong> — Résumer, appel à l'action</li>
<li><strong>Q&A</strong> — Questions/réponses</li>
</ol>

<h3>Phrases clés pour chaque section</h3>

<div class="example-box">
<h4>🎣 Accroche</h4>
<p>"Did you know that 70% of our customers prefer online shopping?" <em>(Saviez-vous que 70% de nos clients préfèrent les achats en ligne ?)</em></p>
<p>"Imagine a world where..." <em>(Imaginez un monde où...)</em></p>
<p>"Today, I'm going to show you how we can increase revenue by 30%." <em>(Aujourd'hui, je vais vous montrer comment augmenter nos revenus de 30%.)</em></p>
</div>

<div class="example-box">
<h4>📖 Introduction</h4>
<p>"Good morning. My name is [Name], and I'm [position] at [Company]."</p>
<p>"Today, I'd like to talk about..." <em>(Aujourd'hui, j'aimerais parler de...)</em></p>
<p>"My presentation is divided into three parts." <em>(Ma présentation est divisée en trois parties.)</em></p>
</div>

<div class="example-box">
<h4>🔄 Transitions</h4>
<p>"Let's move on to the next point." <em>(Passons au point suivant.)</em></p>
<p>"Now, let's look at..." <em>(Regardons maintenant...)</em></p>
<p>"This brings me to my second point." <em>(Cela m'amène à mon deuxième point.)</em></p>
<p>"On the other hand..." <em>(D'autre part...)</em></p>
<p>"To sum up..." <em>(Pour résumer...)</em></p>
</div>

<div class="example-box">
<h4>🔚 Conclusion</h4>
<p>"To conclude, we have seen that..." <em>(Pour conclure, nous avons vu que...)</em></p>
<p>"In summary, our three key takeaways are..." <em>(En résumé, nos trois points clés sont...)</em></p>
<p>"Thank you for your attention. I'm happy to take any questions." <em>(Merci pour votre attention. Je suis disponible pour vos questions.)</em></p>
</div>

<h3>Gérer les questions</h3>
<div class="example-box">
<p>"That's a great question." <em>(C'est une excellente question.)</em></p>
<p>"I'm glad you asked." <em>(Je suis content que vous posiez cette question.)</em></p>
<p>"Could you repeat that, please?" <em>(Pourriez-vous répéter ?)</em></p>
<p>"I'll get back to you on that." <em>(Je reviendrai vers vous là-dessus.)</em></p>
<p>"I'm afraid I don't have that information right now." <em>(Je crains de ne pas avoir cette information pour l'instant.)</em></p>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Préparez une mini-présentation de 3 minutes sur l'un des sujets suivants :</strong></p>
<ol>
<li>Votre entreprise / projet actuel</li>
<li>Un produit ou service que vous recommandez</li>
<li>Une idée pour améliorer votre quartier ou ville</li>
</ol>
<p>Utilisez la structure Hook → Introduction → 3 points → Conclusion → Q&A.</p>
</div>`,
    [
      { q: "Que signifie 'action items' dans une réunion ?", r: "Les actions à suivre / tâches assignées", exp: "Ce que chaque personne doit faire après la réunion" },
      { q: "Comment dit-on 'Ordre du jour' en anglais ?", r: "Agenda", exp: "L'agenda liste tous les sujets à discuter" },
      { q: "Quelle phrase utilise-t-on pour passer au point suivant ?", r: "Let's move on to the next point.", exp: "Transition classique en réunion" },
      { q: "Comment demande-t-on poliment à quelqu'un d'être bref ?", r: "Could you keep it brief, please?", exp: "Formule polie pour gagner du temps" },
      { q: "Que signifie 'I'll get back to you on that' ?", r: "Je reviendrai vers vous là-dessus", exp: "Quand on ne sait pas la réponse tout de suite" }
    ],
    8
  );

  await addChapitre(
    "M2 — Ch3 : Job Interviews & CV",
    "Préparer son CV en anglais et réussir son entretien d'embauche",
    `<div class="lecon-anglais">
<h1>🎤 Module 2 — Chapitre 3 : Job Interviews & CV</h1>

<div class="intro-box">
<p>Le CV et l'entretien d'embauche en anglais sont des étapes cruciales pour une carrière internationale. Ce chapitre vous donne les outils pour vous démarquer et convaincre les recruteurs.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Rédiger un CV en anglais (format, contenu, vocabulaire)</li>
<li>Se préparer aux questions classiques d'entretien</li>
<li>Présenter ses compétences et expériences de manière convaincante</li>
<li>Négocier son salaire et poser des questions au recruteur</li>
</ul>

<h2>📄 Le CV en anglais (Resume / CV)</h2>

<h3>Différences CV français vs anglais</h3>
<ul>
<li><strong>Photo :</strong> Non obligatoire (et parfois déconseillée aux USA/UK pour éviter la discrimination)</li>
<li><strong>Date de naissance / état civil :</strong> Jamais mentionné</li>
<li><strong>Longueur :</strong> 1 page idéalement (2 max pour les profils seniors)</li>
<li><strong>Langue :</strong> Action verbs forts, chiffrés, résultats concrets</li>
</ul>

<h3>Structure du CV</h3>
<ol>
<li><strong>Contact Information</strong> — Nom, email, téléphone, LinkedIn, ville</li>
<li><strong>Professional Summary</strong> — 2-3 phrases qui résument votre profil</li>
<li><strong>Work Experience</strong> — Expériences du plus récent au plus ancien</li>
<li><strong>Education</strong> — Diplômes</li>
<li><strong>Skills</strong> — Compétences techniques et soft skills</li>
<li><strong>Certifications / Languages</strong> — Certificats, langues parlées</li>
</ol>

<h3>Verbes d'action puissants</h3>
<div class="vocab-grid">
<div class="vocab-item"><strong>Managed</strong> — Géré</div>
<div class="vocab-item"><strong>Led</strong> — Dirigé</div>
<div class="vocab-item"><strong>Developed</strong> — Développé</div>
<div class="vocab-item"><strong>Implemented</strong> — Mis en œuvre</div>
<div class="vocab-item"><strong>Increased</strong> — Augmenté</div>
<div class="vocab-item"><strong>Reduced</strong> — Réduit</div>
<div class="vocab-item"><strong>Achieved</strong> — Atteint</div>
<div class="vocab-item"><strong>Created</strong> — Créé</div>
<div class="vocab-item"><strong>Negotiated</strong> — Négocié</div>
<div class="vocab-item"><strong>Resolved</strong> — Résolu</div>
<div class="vocab-item"><strong>Trained</strong> — Formé</div>
<div class="vocab-item"><strong>Collaborated</strong> — Collaboré</div>
</div>

<h3>Exemple de bullet point efficace</h3>
<div class="example-box">
<p>❌ <em>"I was responsible for sales."</em> (faible, passif)</p>
<p>✅ <em>"<strong>Increased</strong> annual sales by 35% ($2M to $2.7M) by <strong>implementing</strong> a new CRM strategy and <strong>training</strong> a team of 5 sales representatives."</em></p>
</div>

<h2>🎤 L'entretien d'embauche</h2>

<h3>Questions classiques et réponses modèles</h3>

<div class="dialogue-box">
<h4>1. "Tell me about yourself." (Parlez-moi de vous.)</h4>
<p><strong>Structure :</strong> Passé → Présent → Futur</p>
<p>"I graduated from [University] with a degree in [Field]. For the past three years, I've worked at [Company] as a [Position], where I [accomplishment]. I'm now looking for an opportunity to [goal], which is why I'm excited about this position at [Company]."</p>
</div>

<div class="dialogue-box">
<h4>2. "What are your strengths?" (Quels sont vos points forts ?)</h4>
<p>"One of my key strengths is my ability to [skill]. For example, at my previous job, I [specific example with results]. I'm also very [second strength], which helps me [benefit]."</p>
</div>

<div class="dialogue-box">
<h4>3. "What is your greatest weakness?" (Quel est votre plus grand défaut ?)</h4>
<p><strong>Règle d'or :</strong> Vrai défaut mais avec une solution en cours</p>
<p>"I tend to [weakness], but I've been working on it by [solution]. For example, I now [specific action], which has helped me [positive result]."</p>
<p><em>Exemple : "I used to struggle with public speaking, but I joined Toastmasters six months ago, and I've already given three presentations to audiences of 50+ people."</em></p>
</div>

<div class="dialogue-box">
<h4>4. "Why do you want to work here?" (Pourquoi voulez-vous travailler ici ?)</h4>
<p>"I've been following [Company] for a while, and I'm impressed by [specific achievement or value]. I believe my experience in [field] would allow me to contribute to [specific project or goal]. I'm particularly excited about [aspect of the role]."</p>
</div>

<div class="dialogue-box">
<h4>5. "Where do you see yourself in 5 years?" (Où vous voyez-vous dans 5 ans ?)</h4>
<p>"In five years, I see myself [realistic goal related to the company]. I want to [skill to develop] and eventually [career progression]. I'm looking for a company where I can grow and take on increasing responsibilities."</p>
</div>

<h3>Questions à poser au recruteur</h3>
<div class="vocab-grid">
<div class="vocab-item"><strong>"What does a typical day look like in this role?"</strong></div>
<div class="vocab-item"><strong>"What are the biggest challenges facing the team right now?"</strong></div>
<div class="vocab-item"><strong>"How do you measure success in this position?"</strong></div>
<div class="vocab-item"><strong>"What opportunities for growth and development do you offer?"</strong></div>
<div class="vocab-item"><strong>"What is the company culture like?"</strong></div>
<div class="vocab-item"><strong>"What are the next steps in the hiring process?"</strong></div>
</div>

<h2>💰 Négocier son salaire</h2>
<div class="example-box">
<p>"Based on my research and experience, I was expecting a salary in the range of [X] to [Y]. However, I'm open to discussion, and I'm more interested in the total compensation package, including benefits and growth opportunities."</p>
<p>"What is the salary range for this position?" <em>(Quelle est la fourchette de salaire pour ce poste ?)</em></p>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Préparez vos réponses aux 5 questions classiques en les adaptant à votre profil réel.</strong> Entraînez-vous à les dire à voix haute en 1-2 minutes chacune.</p>
</div>`,
    [
      { q: "Quelle est la différence entre un CV français et un CV anglais concernant la photo ?", r: "Le CV anglais ne met pas obligatoirement de photo", exp: "Aux USA/UK, la photo peut causer des problèmes de discrimination" },
      { q: "Quel verbe d'action signifie 'Augmenter' ?", r: "Increased", exp: "Ex: Increased sales by 30%" },
      { q: "Comment répondre à 'What is your greatest weakness' ?", r: "Un vrai défaut avec une solution en cours", exp: "Ne jamais dire 'je suis perfectionniste' — trop cliché" },
      { q: "Quelle question pose-t-on pour connaître la fourchette de salaire ?", r: "What is the salary range for this position?", exp: "Question indirecte et professionnelle" },
      { q: "Comment structure-t-on la réponse à 'Tell me about yourself' ?", r: "Passé → Présent → Futur", exp: "Formation → Expérience actuelle → Objectif futur" }
    ],
    9
  );

  await addChapitre(
    "M2 — Ch4 : Negotiations & Diplomacy",
    "Négocier, persuader, et gérer les conflits en anglais professionnel",
    `<div class="lecon-anglais">
<h1>⚖️ Module 2 — Chapitre 4 : Negotiations & Diplomacy</h1>

<div class="intro-box">
<p>La négociation est un art. En anglais professionnel, savoir exprimer son point de vue, faire des concessions, et trouver un terrain d'entente est essentiel pour réussir dans les affaires.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Préparer et mener une négociation en anglais</li>
<li>Exprimer l'accord, le désaccord, et la concession</li>
<li>Utiliser un langage diplomatique et persuasif</li>
<li>Gérer les objections et les conflits</li>
</ul>

<h2>📚 Phases d'une négociation</h2>

<h3>1️⃣ Préparation</h3>
<p>"Before we begin, let's outline our objectives." <em>(Avant de commencer, définissons nos objectifs.)</em></p>
<p>"Our bottom line is..." <em>(Notre ligne rouge est...)</em></p>
<p>"We have some room for negotiation on..." <em>(Nous avons une marge de négociation sur...)</em></p>

<h3>2️⃣ Faire une offre</h3>
<div class="example-box">
<p>"We are prepared to offer..." <em>(Nous sommes prêts à offrir...)</em></p>
<p>"Our initial proposal is..." <em>(Notre proposition initiale est...)</em></p>
<p>"In exchange for..., we would expect..." <em>(En échange de..., nous attendrions...)</em></p>
</div>

<h3>3️⃣ Répondre à une offre</h3>
<div class="example-box">
<p>✅ <strong>Positif :</strong> "That seems reasonable." <em>(Ça semble raisonnable.)</em></p>
<p>🤔 <strong>Nuancé :</strong> "That's a starting point, but we were hoping for..." <em>(C'est un point de départ, mais nous espérions...)</em></p>
<p>❌ <strong>Négatif (diplomatique) :</strong> "I'm afraid that doesn't quite meet our expectations." <em>(Je crains que cela ne réponde pas tout à fait à nos attentes.)</em></p>
</div>

<h3>4️⃣ Faire des concessions</h3>
<div class="example-box">
<p>"If you can..., then we would be willing to..." <em>(Si vous pouvez..., alors nous serions disposés à...)</em></p>
<p>"We could meet you halfway on..." <em>(Nous pourrions faire un compromis sur...)</em></p>
<p>"As a gesture of goodwill, we are prepared to..." <em>(En signe de bonne volonté, nous sommes prêts à...)</em></p>
</div>

<h3>5️⃣ Clôturer</h3>
<div class="example-box">
<p>"I think we've reached a mutually beneficial agreement." <em>(Je pense que nous sommes parvenus à un accord mutuellement bénéfique.)</em></p>
<p>"Let's shake on it." <em>(Faisons-nous la main / C'est d'accord.)</em></p>
<p>"I'll have the contract drawn up by tomorrow." <em>(Je ferai rédiger le contrat d'ici demain.)</em></p>
</div>

<h2>🗣️ Langage diplomatique</h2>

<h3>Exprimer le désaccord sans froisser</h3>
<table class="verb-table">
<tr><th>Direct (trop fort)</th><th>Diplomatique</th></tr>
<tr><td>"You're wrong."</td><td>"I see your point, but..."</td></tr>
<tr><td>"I don't agree."</td><td>"I'm not sure I fully agree with that."</td></tr>
<tr><td>"That's a bad idea."</td><td>"I'm concerned that might not work because..."</td></tr>
<tr><td>"You don't understand."</td><td>"Perhaps I didn't make myself clear."</td></tr>
<tr><td>"That's impossible."</td><td>"That might be challenging, but let's explore..."</td></tr>
</table>

<h3>Exprimer l'accord</h3>
<div class="vocab-grid">
<div class="vocab-item"><strong>I agree.</strong> — Je suis d'accord.</div>
<div class="vocab-item"><strong>I couldn't agree more.</strong> — Je suis tout à fait d'accord.</div>
<div class="vocab-item"><strong>That's a valid point.</strong> — C'est un argument valide.</div>
<div class="vocab-item"><strong>You have a point there.</strong> — Vous n'avez pas tort.</div>
<div class="vocab-item"><strong>I'm with you on that.</strong> — Je suis de votre avis là-dessus.</div>
<div class="vocab-item"><strong>That makes sense.</strong> — C'est logique.</div>
</div>

<h3>Exprimer le désaccord</h3>
<div class="vocab-grid">
<div class="vocab-item"><strong>I'm afraid I have to disagree.</strong> — Je crains devoir être en désaccord.</div>
<div class="vocab-item"><strong>I see it differently.</strong> — Je vois les choses différemment.</div>
<div class="vocab-item"><strong>With respect, I think...</strong> — Avec tout le respect, je pense...</div>
<div class="vocab-item"><strong>I'm not convinced that...</strong> — Je ne suis pas convaincu que...</div>
<div class="vocab-item"><strong>I understand your position, but...</strong> — Je comprends votre position, mais...</div>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Simulez une négociation avec un partenaire (imaginaire ou réel) :</strong></p>
<p>Scénario : Vous négociez un contrat de fourniture. Le fournisseur demande 100€/unité. Votre budget max est 80€.</p>
<ol>
<li>Faites une contre-offre à 75€</li>
<li>Gérez une objection du fournisseur</li>
<li>Trouvez un compromis à 85€ avec une condition (livraison gratuite, paiement anticipé...)</li>
<li>Concluez l'accord</li>
</ol>
</div>`,
    [
      { q: "Quelle phrase utilise-t-on pour faire une concession ?", r: "If you can..., then we would be willing to...", exp: "Structure conditionnelle de négociation" },
      { q: "Comment dit-on diplomatiquement 'Je ne suis pas d'accord' ?", r: "I'm afraid I have to disagree.", exp: "Forme polie et professionnelle" },
      { q: "Que signifie 'Let's shake on it' ?", r: "Faisons-nous la main / C'est d'accord", exp: "Expression idiomatique de conclusion" },
      { q: "Quelle est une alternative diplomatique à 'You're wrong' ?", r: "I see your point, but...", exp: "Reconnaître l'autre avant de contredire" },
      { q: "Comment demande-t-on poliment à quelqu'un de clarifier ?", r: "Perhaps I didn't make myself clear.", exp: "On prend la responsabilité sur soi, poli" }
    ],
    10
  );

  await addChapitre(
    "M2 — Ch5 : Phone Calls & Video Conferences",
    "Maîtriser les appels téléphoniques et visioconférences en anglais professionnel",
    `<div class="lecon-anglais">
<h1>📞 Module 2 — Chapitre 5 : Phone Calls & Video Conferences</h1>

<div class="intro-box">
<p>Les appels téléphoniques et visioconférences sont au cœur de la communication professionnelle moderne. Sans le langage corporel, la clarté de la voix et la structure du discours deviennent cruciales.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Passer et recevoir des appels professionnels en anglais</li>
<li>Gérer les visioconférences (Zoom, Teams, Meet)</li>
<li>Prendre des notes efficaces pendant un appel</li>
<li>Gérer les problèmes techniques et les interruptions</li>
</ul>

<h2>📞 Passer un appel professionnel</h2>

<h3>Introduction</h3>
<div class="example-box">
<p><strong>Appelant :</strong> "Good morning. This is [Name] from [Company]. May I speak with [Person], please?" <em>(Bonjour. C'est [Nom] de [Société]. Puis-je parler à [Personne], s'il vous plaît ?)</em></p>
<p><strong>Réceptionniste :</strong> "Certainly. May I ask what it's regarding?" <em>(Bien sûr. Puis-je savoir de quoi il s'agit ?)</em></p>
<p><strong>Appelant :</strong> "It's about the contract we discussed last week." <em>(C'est à propos du contrat dont nous avons discuté la semaine dernière.)</em></p>
</div>

<h3>Quand la personne n'est pas disponible</h3>
<div class="example-box">
<p>"I'm afraid she's in a meeting right now. Would you like to leave a message?" <em>(Elle est en réunion pour l'instant. Voulez-vous laisser un message ?)</em></p>
<p>"Could I take your number and have her call you back?" <em>(Puis-je prendre votre numéro pour qu'elle vous rappelle ?)</em></p>
<p>"When would be a good time to call back?" <em>(Quel serait un bon moment pour rappeler ?)</em></p>
</div>

<h3>Laisser un message</h3>
<div class="example-box">
<p>"Could you please tell her that [Name] from [Company] called?" <em>(Pourriez-vous lui dire que [Nom] de [Société] a appelé ?)</em></p>
<p>"My number is [number]. I'm available until 6 PM." <em>(Mon numéro est [numéro]. Je suis disponible jusqu'à 18h.)</em></p>
<p>"It's urgent. Could you ask her to call me as soon as possible?" <em>(C'est urgent. Pourriez-vous lui demander de me rappeler dès que possible ?)</em></p>
</div>

<h3>Clôturer un appel</h3>
<div class="example-box">
<p>"Thank you for your time. I'll send you a summary by email." <em>(Merci pour votre temps. Je vous enverrai un résumé par email.)</em></p>
<p>"It was great speaking with you. Have a wonderful day!" <em>(C'était un plaisir de parler avec vous. Passez une excellente journée !)</em></p>
<p>"I'll follow up on this next week. Goodbye!" <em>(Je ferai un suivi là-dessus la semaine prochaine. Au revoir !)</em></p>
</div>

<h2>💻 Visioconférence — Bonnes pratiques</h2>

<h3>Au début</h3>
<div class="example-box">
<p>"Can everyone hear me?" <em>(Est-ce que tout le monde m'entend ?)</em></p>
<p>"Please mute your microphone when you're not speaking." <em>(Veuillez couper votre micro quand vous ne parlez pas.)</em></p>
<p>"Let's wait a moment for everyone to join." <em>(Attendons un moment que tout le monde rejoigne.)</em></p>
</div>

<h3>Pendant</h3>
<div class="example-box">
<p>"Could you share your screen, please?" <em>(Pourriez-vous partager votre écran ?)</em></p>
<p>"I think there's a lag. Could you repeat that?" <em>(Il y a un délai. Pourriez-vous répéter ?)</em></p>
<p>"I'll share the presentation now." <em>(Je vais partager la présentation maintenant.)</em></p>
<p>"Let's take a five-minute break." <em>(Faisons une pause de cinq minutes.)</em></p>
</div>

<h3>Problèmes techniques</h3>
<div class="example-box">
<p>"You're frozen. Can you hear me?" <em>(Vous êtes figé. Pouvez-vous m'entendre ?)</em></p>
<p>"I think you lost connection." <em>(Je pense que vous avez perdu la connexion.)</em></p>
<p>"My camera isn't working. I'll join by audio only." <em>(Ma caméra ne marche pas. Je participe en audio seulement.)</em></p>
<p>"The connection is unstable. Let me try turning my video off." <em>(La connexion est instable. Laissez-moi essayer de couper ma vidéo.)</em></p>
</div>

<h2>📝 Prendre des notes pendant un appel</h2>
<p>Structurez vos notes ainsi :</p>
<ol>
<li><strong>Date, heure, participants</strong></li>
<li><strong>Sujet principal</strong></li>
<li><strong>Points clés discutés</strong> (bullet points)</li>
<li><strong>Décisions prises</strong></li>
<li><strong>Actions à suivre</strong> (qui fait quoi, quand)</li>
<li><strong>Prochaine réunion / échéances</strong></li>
</ol>

<h2>🎓 Exercice</h2>
<p><strong>Simulez un appel téléphonique professionnel avec un partenaire.</strong></p>
<p>Scénario : Vous appelez un fournisseur pour demander un devis et négocier les délais de livraison.</p>
<ol>
<li>Présentez-vous et expliquez le motif de l'appel</li>
<li>Demandez un devis détaillé</li>
<li>Négociez les délais</li>
<li>Demandez une confirmation par email</li>
<li>Clôturez poliment</li>
</ol>
</div>`,
    [
      { q: "Comment demande-t-on poliment à parler à quelqu'un au téléphone ?", r: "May I speak with [Name], please?", exp: "Formule standard et polie" },
      { q: "Que demande-t-on quand on veut que quelqu'un partage son écran ?", r: "Could you share your screen, please?", exp: "Standard en visioconférence" },
      { q: "Comment dit-on 'Veuillez couper votre micro' ?", r: "Please mute your microphone.", exp: "Essentiel pour éviter le bruit de fond" },
      { q: "Quelle phrase utilise-t-on quand quelqu'un a des problèmes de connexion ?", r: "I think you lost connection.", exp: "Ou : You're frozen / The connection is unstable" },
      { q: "Comment demande-t-on à quelqu'un de répéter à cause d'un délai ?", r: "I think there's a lag. Could you repeat that?", exp: "Lag = délai / latence" }
    ],
    11
  );

  // ═══════════════════════════════════════════════════════
  //  MODULE 3 : EVERYDAY CONVERSATIONS
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "M3 — Ch1 : At the Restaurant & Food",
    "Commander au restaurant, parler de nourriture, et comprendre un menu en anglais",
    `<div class="lecon-anglais">
<h1>🍽️ Module 3 — Chapitre 1 : At the Restaurant & Food</h1>

<div class="intro-box">
<p>Que ce soit pour un déjeuner d'affaires, un dîner romantique, ou un voyage à l'étranger, savoir commander au restaurant et parler de nourriture est essentiel.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Lire et comprendre un menu en anglais</li>
<li>Commander, demander des modifications, et payer</li>
<li>Décrire des goûts, textures, et préférences alimentaires</li>
<li>Gérer les restrictions alimentaires et allergies</li>
</ul>

<h2>📖 Lire un menu</h2>

<h3>Sections typiques d'un menu</h3>
<div class="vocab-grid">
<div class="vocab-item"><strong>Starters / Appetizers</strong> — Entrées</div>
<div class="vocab-item"><strong>Main Course / Entrée (US)</strong> — Plat principal</div>
<div class="vocab-item"><strong>Sides</strong> — Accompagnements</div>
<div class="vocab-item"><strong>Desserts</strong> — Desserts</div>
<div class="vocab-item"><strong>Beverages / Drinks</strong> — Boissons</div>
<div class="vocab-item"><strong>Specials / Today's Special</strong> — Plats du jour</div>
<div class="vocab-item"><strong>Chef's Recommendation</strong> — Recommandation du chef</div>
</div>

<h3>Types de cuisson</h3>
<div class="vocab-grid">
<div class="vocab-item"><strong>Grilled</strong> — Grillé</div>
<div class="vocab-item"><strong>Fried</strong> — Frit</div>
<div class="vocab-item"><strong>Roasted</strong> — Rôti</div>
<div class="vocab-item"><strong>Baked</strong> — Cuit au four</div>
<div class="vocab-item"><strong>Steamed</strong> — Cuit à la vapeur</div>
<div class="vocab-item"><strong>Boiled</strong> — Bouilli</div>
<div class="vocab-item"><strong>Stir-fried</strong> — Sauté (wok)</div>
<div class="vocab-item"><strong>Smoked</strong> — Fumé</div>
</div>

<h2>💬 Commander au restaurant</h2>

<h3>Arrivée</h3>
<div class="dialogue-box">
<p><strong>Client :</strong> "Good evening. I have a reservation for two under the name Diallo." <em>(Bonsoir. J'ai une réservation pour deux personnes au nom de Diallo.)</em></p>
<p><strong>Hôte :</strong> "Welcome! Right this way, please. Here's your table by the window." <em>(Bienvenue ! Par ici, s'il vous plaît. Voici votre table près de la fenêtre.)</em></p>
<p><strong>Client :</strong> "Could we have a table outside, please?" <em>(Pourrions-nous avoir une table en terrasse ?)</em></p>
</div>

<h3>Avec le serveur</h3>
<div class="dialogue-box">
<p><strong>Serveur :</strong> "Are you ready to order, or would you like a few more minutes?" <em>(Êtes-vous prêts à commander, ou souhaitez-vous encore quelques minutes ?)</em></p>
<p><strong>Client :</strong> "We're ready. I'd like the grilled salmon, please. Could I have it with a side of vegetables instead of fries?" <em>(Nous sommes prêts. Je prendrai le saumon grillé, s'il vous plaît. Pourrais-je l'avoir avec des légumes au lieu des frites ?)</em></p>
<p><strong>Serveur :</strong> "Of course. And for you, sir?" <em>(Bien sûr. Et pour vous, monsieur ?)</em></p>
<p><strong>Client :</strong> "I'll have the steak, medium-rare, please. And could you bring us some water?" <em>(Je prendrai le steak, saignant, s'il vous plaît. Et pourriez-vous nous apporter de l'eau ?)</em></p>
</div>

<h3>Restrictions alimentaires</h3>
<div class="dialogue-box">
<p>"I'm allergic to nuts. Is there any nuts in this dish?" <em>(Je suis allergique aux noix. Y a-t-il des noix dans ce plat ?)</em></p>
<p>"I'm vegetarian. What options do you have without meat?" <em>(Je suis végétarien. Quelles options avez-vous sans viande ?)</em></p>
<p>"Is this gluten-free?" <em>(Est-ce sans gluten ?)</em></p>
<p>"Could you make it less spicy?" <em>(Pourriez-vous le faire moins épicé ?)</em></p>
</div>

<h3>Pendant le repas</h3>
<div class="dialogue-box">
<p>"Excuse me, could we have some more bread, please?" <em>(Excusez-moi, pourrions-nous avoir plus de pain ?)</em></p>
<p>"This is delicious! My compliments to the chef." <em>(C'est délicieux ! Mes compliments au chef.)</em></p>
<p>"I'm sorry, but this isn't what I ordered." <em>(Je suis désolé, mais ce n'est pas ce que j'ai commandé.)</em></p>
<p>"Could we have the bill, please?" <em>(Pourrions-nous avoir l'addition ?)</em></p>
<p>"Could we split the bill?" <em>(Pourrions-nous partager l'addition ?)</em></p>
</div>

<h2>🍷 Décrire la nourriture</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>Delicious / Tasty</strong> — Délicieux</div>
<div class="vocab-item"><strong>Flavorful</strong> — Savoureux</div>
<div class="vocab-item"><strong>Spicy / Hot</strong> — Épicé</div>
<div class="vocab-item"><strong>Mild</strong> — Doux (pas épicé)</div>
<div class="vocab-item"><strong>Sweet</strong> — Sucré</div>
<div class="vocab-item"><strong>Sour</strong> — Acide</div>
<div class="vocab-item"><strong>Bitter</strong> — Amer</div>
<div class="vocab-item"><strong>Salty</strong> — Salé</div>
<div class="vocab-item"><strong>Crispy / Crunchy</strong> — Croustillant</div>
<div class="vocab-item"><strong>Tender / Juicy</strong> — Tendre / Juteux</div>
<div class="vocab-item"><strong>Creamy</strong> — Crémeux</div>
<div class="vocab-item"><strong>Fresh</strong> — Frais</div>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Simulez une scène au restaurant.</strong> Vous dînez avec un collègue étranger. Vous devez :</p>
<ol>
<li>Réserver une table pour deux</li>
<li>Lire le menu et demander des recommandations</li>
<li>Commander (avec une modification)</li>
<li>Parler de vos préférences alimentaires</li>
<li>Demander l'addition et laisser un pourboire</li>
</ol>
</div>`,
    [
      { q: "Comment demande-t-on poliment l'addition ?", r: "Could we have the bill, please?", exp: "Formule standard en restaurant" },
      { q: "Que signifie 'medium-rare' pour un steak ?", r: "Saignant", exp: "Cooking levels: rare, medium-rare, medium, well-done" },
      { q: "Comment demande-t-on si un plat contient des allergènes ?", r: "Is there any [allergen] in this dish?", exp: "Ex: Is there any nuts in this dish?" },
      { q: "Que signifie 'starters' sur un menu anglais ?", r: "Entrées", exp: "Starters/Appetizers = ce qu'on mange avant le plat principal" },
      { q: "Comment demande-t-on de partager l'addition ?", r: "Could we split the bill?", exp: "Split = diviser / partager" }
    ],
    12
  );

  await addChapitre(
    "M3 — Ch2 : Shopping & Bargaining",
    "Faire du shopping, demander des prix, et négocier en anglais",
    `<div class="lecon-anglais">
<h1>🛍️ Module 3 — Chapitre 2 : Shopping & Bargaining</h1>

<div class="intro-box">
<p>Que ce soit pour acheter des vêtements, des souvenirs, ou négocier au marché, savoir communiquer en anglais dans un contexte commercial est très utile.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Demander des renseignements sur un produit</li>
<li>Demander la taille, la couleur, et essayer</li>
<li>Négocier le prix (bargaining)</li>
<li>Gérer les retours et remboursements</li>
</ul>

<h2>💬 Dans un magasin</h2>

<div class="dialogue-box">
<p><strong>Client :</strong> "Excuse me, do you have this shirt in a medium?" <em>(Excusez-moi, avez-vous cette chemise en taille M ?)</em></p>
<p><strong>Vendeur :</strong> "Let me check. Yes, we do. Would you like to try it on?" <em>(Laissez-moi vérifier. Oui, nous l'avons. Voulez-vous l'essayer ?)</em></p>
<p><strong>Client :</strong> "Yes, please. Where is the fitting room?" <em>(Oui, s'il vous plaît. Où sont les cabines d'essayage ?)</em></p>
<p><strong>Vendeur :</strong> "Right over there. Let me know if you need a different size." <em>(Juste là. Faites-moi savoir si vous avez besoin d'une autre taille.)</em></p>
</div>

<h3>Demander des informations</h3>
<div class="example-box">
<p>"How much is this?" <em>(Combien coûte ceci ?)</em></p>
<p>"Is this on sale?" <em>(Est-ce en solde ?)</em></p>
<p>"Do you have this in blue?" <em>(L'avez-vous en bleu ?)</em></p>
<p>"What's your return policy?" <em>(Quelle est votre politique de retour ?)</em></p>
<p>"Can I get a discount if I buy two?" <em>(Puis-je avoir une remise si j'en achète deux ?)</em></p>
</div>

<h2>💰 Négocier (Bargaining)</h2>
<p>Dans les marchés et certains pays, négocier est normal et attendu.</p>

<div class="dialogue-box">
<p><strong>Client :</strong> "How much is this bag?" <em>(Combien coûte ce sac ?)</em></p>
<p><strong>Vendeur :</strong> "It's 50 dollars." <em>(50 dollars.)</em></p>
<p><strong>Client :</strong> "That's a bit expensive. Would you take 30?" <em>(C'est un peu cher. Accepteriez-vous 30 ?)</em></p>
<p><strong>Vendeur :</strong> "I can't go that low. How about 45?" <em>(Je ne peux pas descendre aussi bas. Que diriez-vous de 45 ?)</em></p>
<p><strong>Client :</strong> "I'll give you 35. That's my final offer." <em>(Je vous donne 35. C'est ma dernière offre.)</em></p>
<p><strong>Vendeur :</strong> "Okay, 40 and it's yours." <em>(D'accord, 40 et il est à vous.)</em></p>
<p><strong>Client :</strong> "Deal!" <em>(Marché conclu !)</em></p>
</div>

<h3>Phrases pour négocier</h3>
<div class="vocab-grid">
<div class="vocab-item"><strong>That's too expensive.</strong> — C'est trop cher.</div>
<div class="vocab-item"><strong>Can you give me a better price?</strong> — Pouvez-vous me faire un meilleur prix ?</div>
<div class="vocab-item"><strong>What's your best price?</strong> — Quel est votre meilleur prix ?</div>
<div class="vocab-item"><strong>I'll take it for...</strong> — Je le prends pour...</div>
<div class="vocab-item"><strong>Is there any discount?</strong> — Y a-t-il une remise ?</div>
<div class="vocab-item"><strong>That's my final offer.</strong> — C'est ma dernière offre.</div>
<div class="vocab-item"><strong>It's a deal!</strong> — Marché conclu !</div>
<div class="vocab-item"><strong>I'll think about it.</strong> — Je vais y réfléchir.</div>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Simulez une scène de négociation au marché.</strong></p>
<p>Vous voulez acheter un tableau. Le vendeur demande 80€. Votre budget est 50€.</p>
<ol>
<li>Demandez le prix</li>
<li>Dites que c'est trop cher</li>
3. Faites une contre-offre
<li>Continuez la négociation jusqu'à trouver un accord</li>
</ol>
</div>`,
    [
      { q: "Comment demande-t-on la taille d'un vêtement ?", r: "Do you have this in a [size]?", exp: "Ex: Do you have this in a medium?" },
      { q: "Que signifie 'fitting room' ?", r: "Cabine d'essayage", exp: "Où on essaie les vêtements" },
      { q: "Comment demande-t-on une remise ?", r: "Is there any discount? / Can you give me a better price?", exp: "Deux formules courantes" },
      { q: "Que signifie 'That's my final offer' ?", r: "C'est ma dernière offre", exp: "Montre qu'on ne négociera plus" },
      { q: "Comment dit-on 'Marché conclu' ?", r: "It's a deal!", exp: "Expression idiomatique" }
    ],
    13
  );

  // ═══════════════════════════════════════════════════════
  //  MODULE 4 : TRAVEL & TOURISM
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "M4 — Ch1 : Airport & Check-in",
    "Naviguer dans un aéroport, s'enregistrer, et passer la sécurité en anglais",
    `<div class="lecon-anglais">
<h1>✈️ Module 4 — Chapitre 1 : Airport & Check-in</h1>

<div class="intro-box">
<p>Voyager en avion implique plusieurs étapes : enregistrement, sécurité, embarquement... Savoir quoi dire et comprendre les instructions en anglais rend le voyage beaucoup plus fluide.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>S'enregistrer et enregistrer ses bagages</li>
<li>Passer la sécurité et la douane</li>
<li>Comprendre les annonces à l'aéroport</li>
<li>Gérer les problèmes (vol retardé, bagage perdu...)</li>
</ul>

<h2>📋 Vocabulaire de l'aéroport</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>Check-in counter / desk</strong> — Comptoir d'enregistrement</div>
<div class="vocab-item"><strong>Boarding pass</strong> — Carte d'embarquement</div>
<div class="vocab-item"><strong>Gate</strong> — Porte d'embarquement</div>
<div class="vocab-item"><strong>Terminal</strong> — Terminal</div>
<div class="vocab-item"><strong>Security check</strong> — Contrôle de sécurité</div>
<div class="vocab-item"><strong>Customs</strong> — Douane</div>
<div class="vocab-item"><strong>Immigration</strong> — Immigration</div>
<div class="vocab-item"><strong>Baggage claim</strong> — Retrait des bagages</div>
<div class="vocab-item"><strong>Carry-on luggage</strong> — Bagage à main</div>
<div class="vocab-item"><strong>Checked baggage</strong> — Bagage enregistré</div>
<div class="vocab-item"><strong>Connecting flight</strong> — Vol de correspondance</div>
<div class="vocab-item"><strong>Layover / Stopover</strong> — Escale</div>
</div>

<h2>💬 À l'enregistrement</h2>

<div class="dialogue-box">
<p><strong>Agent :</strong> "Good morning. May I see your passport and ticket, please?" <em>(Bonjour. Puis-je voir votre passeport et votre billet ?)</em></p>
<p><strong>Voyageur :</strong> "Here you are. I'm flying to London on flight BA234." <em>(Les voici. Je vole vers Londres sur le vol BA234.)</em></p>
<p><strong>Agent :</strong> "Thank you. Do you have any checked baggage?" <em>(Merci. Avez-vous des bagages à enregistrer ?)</em></p>
<p><strong>Voyageur :</strong> "Yes, just one suitcase. And I have a carry-on bag." <em>(Oui, juste une valise. Et j'ai un bagage à main.)</em></p>
<p><strong>Agent :</strong> "Please place your suitcase on the scale. Hmm, it's 2 kilos overweight. You'll need to pay an excess baggage fee of 50€." <em>(Veuillez poser votre valise sur la balance. Hum, elle dépasse de 2 kilos. Vous devrez payer un supplément de 50€.)</em></p>
<p><strong>Voyageur :</strong> "Can I remove some items and put them in my carry-on instead?" <em>(Puis-je retirer quelques articles et les mettre dans mon bagage à main ?)</em></p>
<p><strong>Agent :</strong> "Of course. Here's your boarding pass. Your flight departs from Gate 12 at 2:30 PM. Please be at the gate 45 minutes before departure." <em>(Bien sûr. Voici votre carte d'embarquement. Votre vol part de la porte 12 à 14h30. Veuillez être à la porte 45 minutes avant le départ.)</em></p>
</div>

<h2>🔒 À la sécurité</h2>
<div class="dialogue-box">
<p><strong>Agent :</strong> "Please place your belongings in the tray. Laptops and liquids must be removed from your bag." <em>(Veuillez placer vos effets dans le bac. Les ordinateurs portables et les liquides doivent être retirés de votre sac.)</em></p>
<p><strong>Agent :</strong> "Please walk through the metal detector." <em>(Veuillez passer par le détecteur de métaux.)</em></p>
<p><strong>Agent :</strong> "Sir, you've been randomly selected for a additional screening. Please step aside." <em>(Monsieur, vous avez été sélectionné au hasard pour un contrôle supplémentaire. Veuillez vous mettre sur le côté.)</em></p>
</div>

<h2>🛂 À l'immigration</h2>
<div class="dialogue-box">
<p><strong>Officier :</strong> "Passport, please. Where are you flying from today?" <em>(Passeport, s'il vous plaît. D'où volez-vous aujourd'hui ?)</em></p>
<p><strong>Voyageur :</strong> "I'm coming from Dakar, Senegal." <em>(Je viens de Dakar, au Sénégal.)</em></p>
<p><strong>Officier :</strong> "What is the purpose of your visit?" <em>(Quel est le but de votre visite ?)</em></p>
<p><strong>Voyageur :</strong> "I'm here for business / tourism / to visit family." <em>(Je suis ici pour affaires / du tourisme / pour rendre visite à ma famille.)</em></p>
<p><strong>Officier :</strong> "How long will you be staying?" <em>(Combien de temps resterez-vous ?)</em></p>
<p><strong>Voyageur :</strong> "I'll be here for two weeks." <em>(Je resterai deux semaines.)</em></p>
<p><strong>Officier :</strong> "Where will you be staying?" <em>(Où séjournerez-vous ?)</em></p>
<p><strong>Voyageur :</strong> "At the Hilton Hotel in downtown." <em>(À l'hôtel Hilton en centre-ville.)</em></p>
</div>

<h2>📢 Annonces à l'aéroport</h2>
<div class="example-box">
<p>"Passengers on flight BA234 to London, please proceed to Gate 12. Boarding will begin shortly." <em>(Passagers du vol BA234 à destination de Londres, veuillez vous rendre à la porte 12. L'embarquement commencera bientôt.)</em></p>
<p>"Would passenger Diallo please come to the information desk?" <em>(Le passager Diallo est prié de se présenter au bureau d'information ?)</em></p>
<p>"Flight AF123 to Paris is now boarding at Gate 5." <em>(Le vol AF123 à destination de Paris embarque maintenant à la porte 5.)</em></p>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Simulez votre arrivée à l'aéroport.</strong></p>
<ol>
<li>Demandez où se trouve le comptoir d'enregistrement</li>
<li>Enregistrez votre valise</li>
<li>Passez la sécurité</li>
<li>Répondez aux questions de l'officier d'immigration</li>
<li>Trouvez votre porte d'embarquement</li>
</ol>
</div>`,
    [
      { q: "Comment demande-t-on la carte d'embarquement en anglais ?", r: "Boarding pass", exp: "Boarding pass = carte d'embarquement" },
      { q: "Que signifie 'carry-on luggage' ?", r: "Bagage à main", exp: "Ce qu'on emporte dans l'avion" },
      { q: "Quelle question pose l'officier d'immigration sur le but du voyage ?", r: "What is the purpose of your visit?", exp: "Réponse : business, tourism, studies..." },
      { q: "Que signifie 'layover' ?", r: "Escale", exp: "Le temps d'attente entre deux vols" },
      { q: "Comment dit-on 'surpoids' pour les bagages ?", r: "Overweight", exp: "Excess baggage fee = supplément bagage" }
    ],
    14
  );

  await addChapitre(
    "M4 — Ch2 : Hotel & Accommodation",
    "Réserver un hôtel, s'installer, et gérer son séjour en anglais",
    `<div class="lecon-anglais">
<h1>🏨 Module 4 — Chapitre 2 : Hotel & Accommodation</h1>

<div class="intro-box">
<p>Réserver un hôtel, demander des services, et résoudre des problèmes de logement sont des compétences essentielles pour tout voyageur.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Réserver une chambre par téléphone ou email</li>
<li>Enregistrer son arrivée et départ</li>
<li>Demander des services et signaler des problèmes</li>
<li>Comprendre les différents types d'hébergement</li>
</ul>

<h2>📋 Types de chambres</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>Single room</strong> — Chambre simple (1 personne)</div>
<div class="vocab-item"><strong>Double room</strong> — Chambre double (1 grand lit)</div>
<div class="vocab-item"><strong>Twin room</strong> — Chambre avec 2 lits simples</div>
<div class="vocab-item"><strong>Suite</strong> — Suite (plusieurs pièces)</div>
<div class="vocab-item"><strong>Deluxe room</strong> — Chambre de luxe</div>
<div class="vocab-item"><strong>Sea view / City view</strong> — Vue mer / Vue ville</div>
</div>

<h2>💬 À la réception</h2>

<div class="dialogue-box">
<h3>Arrivée</h3>
<p><strong>Client :</strong> "Good afternoon. I have a reservation for two nights under the name Diallo." <em>(Bonjour. J'ai une réservation pour deux nuits au nom de Diallo.)</em></p>
<p><strong>Réception :</strong> "Welcome, Mr. Diallo. Yes, I see your booking. A double room with breakfast included. May I see your passport, please?" <em>(Bienvenue, M. Diallo. Oui, je vois votre réservation. Une chambre double avec petit-déjeuner inclus. Puis-je voir votre passeport ?)</em></p>
<p><strong>Client :</strong> "Here it is. Is breakfast served in the restaurant?" <em>(Le voici. Le petit-déjeuner est servi au restaurant ?)</em></p>
<p><strong>Réception :</strong> "Yes, from 6:30 to 10 AM. Here's your key card. Your room is 305, on the third floor. The elevator is to your left. Enjoy your stay!" <em>(Oui, de 6h30 à 10h. Voici votre carte-clé. Votre chambre est la 305, au troisième étage. L'ascenseur est à votre gauche. Bon séjour !)</em></p>
</div>

<h3>Demander des services</h3>
<div class="dialogue-box">
<p>"Could I have some extra towels, please?" <em>(Pourrais-je avoir des serviettes supplémentaires ?)</em></p>
<p>"What time is check-out?" <em>(À quelle heure est le départ ?)</em></p>
<p>"Is there a laundry service?" <em>(Y a-t-il un service de blanchisserie ?)</em></p>
<p>"Could you call a taxi for me at 7 AM?" <em>(Pourriez-vous m'appeler un taxi pour 7h ?)</em></p>
<p>"The air conditioning isn't working. Could someone come and fix it?" <em>(La climatisation ne marche pas. Quelqu'un pourrait venir la réparer ?)</em></p>
</div>

<h3>Départ</h3>
<div class="dialogue-box">
<p><strong>Client :</strong> "I'd like to check out, please. Room 305." <em>(Je voudrais partir, s'il vous plaît. Chambre 305.)</em></p>
<p><strong>Réception :</strong> "Of course. Let me prepare your bill. You have a minibar charge of 15€. The total is 230€. How would you like to pay?" <em>(Bien sûr. Laissez-moi préparer votre note. Vous avez une consommation au minibar de 15€. Le total est de 230€. Comment souhaitez-vous payer ?)</em></p>
<p><strong>Client :</strong> "By credit card, please. Could I also leave my luggage here until 4 PM?" <em>(Par carte de crédit, s'il vous plaît. Pourrais-je aussi laisser mes bagages ici jusqu'à 16h ?)</em></p>
<p><strong>Réception :</strong> "Certainly. We have a luggage storage room. Here's your receipt. Have a safe trip!" <em>(Bien sûr. Nous avons une consigne. Voici votre reçu. Bon voyage !)</em></p>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Simulez votre enregistrement à l'hôtel.</strong></p>
<ol>
<li>Confirmez votre réservation</li>
<li>Demandez des informations sur le petit-déjeuner et le Wi-Fi</li>
<li>Signalez un problème (la douche ne fonctionne pas)</li>
<li>Demandez un réveil pour le lendemain</li>
<li>Enregistrez votre départ</li>
</ol>
</div>`,
    [
      { q: "Quelle est la différence entre 'double room' et 'twin room' ?", r: "Double = 1 grand lit, Twin = 2 lits simples", exp: "Important pour bien réserver !" },
      { q: "Comment demande-t-on des serviettes supplémentaires ?", r: "Could I have some extra towels, please?", exp: "Extra = supplémentaire" },
      { q: "Que signifie 'check-out' ?", r: "Le départ de l'hôtel / vider la chambre", exp: "Check-in = arriver, Check-out = partir" },
      { q: "Comment demande-t-on de laisser ses bagages après le départ ?", r: "Could I leave my luggage here until...?", exp: "Luggage storage = consigne" },
      { q: "Comment demande-t-on qu'on répare quelque chose ?", r: "Could someone come and fix it?", exp: "Fix = réparer" }
    ],
    15
  );

  // ═══════════════════════════════════════════════════════
  //  MODULE 5 : WRITING & COMMUNICATION
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "M5 — Ch1 : Formal vs Informal Writing",
    "Maîtriser le registre de langue et adapter son écriture au contexte",
    `<div class="lecon-anglais">
<h1>✍️ Module 5 — Chapitre 1 : Formal vs Informal Writing</h1>

<div class="intro-box">
<p>L'anglais écrit varie énormément selon le contexte. Un SMS à un ami n'a rien à voir avec un rapport professionnel. Savoir adapter son registre est une compétence clé.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Différencier les registres formel, semi-formel, et informel</li>
<li>Transformer un texte informel en texte formel</li>
<li>Utiliser les connecteurs logiques appropriés</li>
<li>Rédiger des textes clairs et structurés</li>
</ul>

<h2>📊 Les 3 registres</h2>

<table class="compare-table">
<tr><th>Formel</th><th>Semi-formel</th><th>Informel</th></tr>
<tr><td>Emails professionnels, rapports, lettres officielles</td><td>Emails à collègues connus, demandes de service</td><td>SMS, chat, conversations entre amis</td></tr>
<tr><td>Pas de contractions</td><td>Contractions acceptables</td><td>Contractions, abréviations</td></tr>
<tr><td>Vocabulaire soutenu</td><td>Vocabulaire standard</td><td>Vocabulaire familier, slang</td></tr>
<tr><td>Phrases complètes</td><td>Phrases complètes</td><td>Phrases fragmentaires</td></tr>
<tr><td>Pas de smileys</td><td>Smileys occasionnels</td><td>Smileys, GIFs</td></tr>
</table>

<h2>🔄 Transformer informel → formel</h2>

<table class="verb-table">
<tr><th>Informel</th><th>Formel</th></tr>
<tr><td>"I wanna go."</td><td>"I would like to attend."</td></tr>
<tr><td>"Can't make it."</td><td>"I am unable to attend."</td></tr>
<tr><td>"Thanks a lot!"</td><td>"I would like to express my gratitude."</td></tr>
<tr><td>"Need more info."</td><td>"I would appreciate additional information."</td></tr>
<tr><td>"It's gonna be great!"</td><td>"It promises to be a successful event."</td></tr>
<tr><td>"Let me know."</td><td>"Please inform me at your earliest convenience."</td></tr>
<tr><td>"Sorry for the wait."</td><td>"I apologize for the delay."</td></tr>
<tr><td>"No problem."</td><td>"It is my pleasure. / You are most welcome."</td></tr>
</table>

<h2>📝 Connecteurs logiques</h2>

<h3>Addition</h3>
<div class="vocab-grid">
<div class="vocab-item"><strong>Furthermore / Moreover</strong> — De plus (formel)</div>
<div class="vocab-item"><strong>In addition</strong> — En outre</div>
<div class="vocab-item"><strong>Also / Besides</strong> — Aussi / D'ailleurs (semi-formel)</div>
<div class="vocab-item"><strong>And / Plus</strong> — Et / En plus (informel)</div>
</div>

<h3>Opposition</h3>
<div class="vocab-grid">
<div class="vocab-item"><strong>However / Nevertheless</strong> — Cependant / Néanmoins</div>
<div class="vocab-item"><strong>Although / Even though</strong> — Bien que</div>
<div class="vocab-item"><strong>On the other hand</strong> — D'autre part</div>
<div class="vocab-item"><strong>But / Yet</strong> — Mais / Pourtant</div>
</div>

<h3>Cause et conséquence</h3>
<div class="vocab-grid">
<div class="vocab-item"><strong>Therefore / Consequently</strong> — Par conséquent</div>
<div class="vocab-item"><strong>As a result</strong> — En conséquence</div>
<div class="vocab-item"><strong>Because / Since</strong> — Parce que / Étant donné que</div>
<div class="vocab-item"><strong>So</strong> — Donc (informel)</div>
</div>

<h3>Exemples</h3>
<div class="vocab-grid">
<div class="vocab-item"><strong>For instance / For example</strong> — Par exemple</div>
<div class="vocab-item"><strong>Such as</strong> — Tel que</div>
<div class="vocab-item"><strong>Like</strong> — Comme (informel)</div>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Transformez ces phrases informelles en phrases formelles :</strong></p>
<ol>
<li>"I can't come to the meeting."</li>
<li>"Thanks for your help!"</li>
<li>"We need to talk about the budget."</li>
<li>"The report is gonna be late."</li>
<li>"Let me know if you need anything."</li>
</ol>
</div>`,
    [
      { q: "Quelle est la différence entre 'However' et 'But' ?", r: "However = formel, But = informel", exp: "However se place souvent en début de phrase avec une virgule" },
      { q: "Comment dit-on formellement 'I can't come' ?", r: "I am unable to attend.", exp: "Unable to attend = ne pas pouvoir participer" },
      { q: "Quel connecteur signifie 'Par conséquent' ?", r: "Therefore / Consequently", exp: "Utilisé pour introduire une conséquence" },
      { q: "Quelle est la version formelle de 'Thanks a lot' ?", r: "I would like to express my gratitude.", exp: "Ou : I am most grateful" },
      { q: "Dans quel registre évite-t-on les contractions ?", r: "Formel", exp: "Do not → pas de don't en formel" }
    ],
    16
  );

  await addChapitre(
    "M5 — Ch2 : Essays & Reports",
    "Rédiger des essais et rapports structurés en anglais académique et professionnel",
    `<div class="lecon-anglais">
<h1>📄 Module 5 — Chapitre 2 : Essays & Reports</h1>

<div class="intro-box">
<p>Rédiger un essai ou un rapport en anglais demande une structure claire, un vocabulaire précis, et des arguments bien organisés. Ce chapitre vous donne les outils pour écrire comme un pro.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Structurer un essai académique (introduction, body, conclusion)</li>
<li>Rédiger un rapport professionnel</li>
<li>Utiliser le vocabulaire académique et des transitions</li>
<li>Citer des sources et données</li>
</ul>

<h2>📐 Structure d'un essai académique</h2>

<h3>Introduction (10% du texte)</h3>
<div class="example-box">
<p><strong>Hook :</strong> Accrochez le lecteur avec une statistique, une question, ou une citation.</p>
<p><strong>Context :</strong> Présentez le sujet et son importance.</p>
<p><strong>Thesis statement :</strong> Votre argument principal en une phrase.</p>
<p><strong>Roadmap :</strong> Annoncez les points que vous allez traiter.</p>
</div>

<h3>Body Paragraphs (80% du texte)</h3>
<div class="example-box">
<p>Chaque paragraphe suit la structure <strong>PEEL</strong> :</p>
<ul>
<li><strong>P</strong>oint — Idée principale du paragraphe</li>
<li><strong>E</strong>vidence — Preuve, exemple, donnée</li>
<li><strong>E</strong>xplanation — Expliquez pourquoi c'est pertinent</li>
<li><strong>L</strong>ink — Reliez au sujet global</li>
</ul>
</div>

<h3>Conclusion (10% du texte)</h3>
<div class="example-box">
<p><strong>Restate thesis :</strong> Reformulez votre argument.</p>
<p><strong>Summarize main points :</strong> Résumez les points clés.</p>
<p><strong>Closing thought :</strong> Une réflexion finale ou une ouverture.</p>
</div>

<h2>📊 Structure d'un rapport professionnel</h2>

<ol>
<li><strong>Executive Summary</strong> — Résumé pour les décideurs pressés</li>
<li><strong>Introduction</strong> — Contexte et objectifs du rapport</li>
<li><strong>Methodology</strong> — Comment les données ont été collectées</li>
<li><strong>Findings / Results</strong> — Ce qu'on a découvert</li>
<li><strong>Analysis / Discussion</strong> — Interprétation des résultats</li>
<li><strong>Recommendations</strong> — Actions suggérées</li>
<li><strong>Conclusion</strong> — Synthèse finale</li>
<li><strong>Appendix</strong> — Données supplémentaires</li>
</ol>

<h2>📝 Vocabulaire académique</h2>
<div class="vocab-grid">
<div class="vocab-item"><strong>According to</strong> — Selon</div>
<div class="vocab-item"><strong>Furthermore</strong> — De plus</div>
<div class="vocab-item"><strong>Nevertheless</strong> — Néanmoins</div>
<div class="vocab-item"><strong>Consequently</strong> — Par conséquent</div>
<div class="vocab-item"><strong>It is evident that</strong> — Il est évident que</div>
<div class="vocab-item"><strong>Research suggests</strong> — La recherche suggère</div>
<div class="vocab-item"><strong>A significant number of</strong> — Un nombre significatif de</div>
<div class="vocab-item"><strong>On the contrary</strong> — Au contraire</div>
<div class="vocab-item"><strong>With regard to</strong> — En ce qui concerne</div>
<div class="vocab-item"><strong>In conclusion</strong> — En conclusion</div>
</div>

<h2>🎓 Exercice</h2>
<p><strong>Rédigez un essai de 250 mots sur l'un des sujets suivants :</strong></p>
<ol>
<li>"The importance of learning English in today's world"</li>
<li>"Should remote work become the new standard?"</li>
<li>"The impact of social media on society"</li>
</ol>
<p>Utilisez la structure PEEL et au moins 5 mots du vocabulaire académique.</p>
</div>`,
    [
      { q: "Que signifie PEEL dans la structure d'un paragraphe ?", r: "Point, Evidence, Explanation, Link", exp: "Structure pour un paragraphe argumenté" },
      { q: "Quelle section d'un rapport résume le tout pour les décideurs pressés ?", r: "Executive Summary", exp: "Généralement en début de rapport" },
      { q: "Quel connecteur signifie 'Selon' en académique ?", r: "According to", exp: "Ex: According to recent studies..." },
      { q: "Où place-t-on la thèse principale dans un essai ?", r: "Dans l'introduction (thesis statement)", exp: "Généralement à la fin de l'introduction" },
      { q: "Quelle section du rapport contient les actions suggérées ?", r: "Recommendations", exp: "Après l'analyse des résultats" }
    ],
    17
  );

  // ═══════════════════════════════════════════════════════
  //  MODULE 6 : LISTENING & COMPREHENSION
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "M6 — Ch1 : Understanding Native Speakers",
    "Techniques pour mieux comprendre l'anglais oral des locuteurs natifs",
    `<div class="lecon-anglais">
<h1>🎧 Module 6 — Chapitre 1 : Understanding Native Speakers</h1>

<div class="intro-box">
<p>Comprendre les locuteurs natifs est souvent le défi le plus difficile. Les accents, la vitesse, et les contractions rendent la compréhension orale complexe. Ce chapitre vous donne des techniques concrètes.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Comprendre les accents principaux (britannique, américain, australien)</li>
<li>Identifier les sons réduits et les liaisons</li>
<li>Utiliser des techniques d'écoute active</li>
<li>Développer son oreille avec des ressources adaptées</li>
</ul>

<h2>🌍 Les accents principaux</h2>

<h3>Britannique (British English)</h3>
<div class="example-box">
<p><strong>Caractéristiques :</strong> R non prononcé avant une consonne, voyelles longues distinctes</p>
<p>"Water" → /ˈwɔː.tə/ (pas de R à la fin)</p>
<p>"Can't" → /kɑːnt/ (voyelle ouverte)</p>
<p>"Dance" → /dɑːns/ (pas de /æ/ comme en américain)</p>
</div>

<h3>Américain (American English)</h3>
<div class="example-box">
<p><strong>Caractéristiques :</strong> R roulé, T entre voyelles devient /d/</p>
<p>"Water" → /ˈwɔː.t̬ɚ/ (R prononcé)</p>
<p>"Better" → /ˈbe.t̬ɚ/ (T devient un son entre T et D)</p>
<p>"Can't" → /kænt/ (voyelle fermée)</p>
</div>

<h3>Australien (Australian English)</h3>
<div class="example-box">
<p><strong>Caractéristiques :</strong> I devient un son proche de /oi/, phrases montantes à la fin</p>
<p>"Nice day" → /nois dei/ (I → OI)</p>
</div>

<h2>🔊 Sons réduits et liaisons</h2>

<h3>Reductions fréquentes</h3>
<table class="verb-table">
<tr><th>Écrit</th><th>Prononcé (rapide)</th><th>Exemple</th></tr>
<tr><td>want to</td><td>wanna</td><td>"I wanna go."</td></tr>
<tr><td>going to</td><td>gonna</td><td>"I'm gonna leave."</td></tr>
<tr><td>have to</td><td>hafta</td><td>"I hafta work."</td></tr>
<tr><td>got to</td><td>gotta</td><td>"I gotta run."</td></tr>
<tr><td>don't know</td><td>dunno</td><td>"I dunno."</td></tr>
<tr><td>let me</td><td>lemme</td><td>"Lemme see."</td></tr>
<tr><td>give me</td><td>gimme</td><td>"Gimme a minute."</td></tr>
<tr><td>should have</td><td>shoulda</td><td>"I shoulda called."</td></tr>
</table>

<h3>Liaisons (Linking)</h3>
<p>En anglais rapide, les mots se lient :</p>
<div class="example-box">
<p>"An apple" → /ə.næ.pəl/ (le N se lie au A)</p>
<p>"Pick up" → /pɪ.kʌp/ (le K se lie au U)</p>
<p>"Did you" → /dɪdʒu/ (D+Y = DJ)</p>
<p>"Would you" → /wʊdʒu/ (D+Y = DJ)</p>
</div>

<h2>👂 Techniques d'écoute active</h2>

<h3>1. Écoute globale d'abord</h3>
<p>Ne cherchez pas à comprendre chaque mot. Capturez l'idée générale.</p>

<h3>2. Identifiez les mots-clés</h3>
<p>Les mots de contenu (noms, verbes, adjectifs) portent le sens. Les mots grammaticaux sont souvent réduits.</p>

<h3>3. Utilisez le contexte</h3>
<p>Si vous ne comprenez pas un mot, continuez. Le contexte vous aidera à deviner.</p>

<h3>4. Écoutez plusieurs fois</h3>
<p>1ère écoute : idée générale<br/>2ème écoute : détails<br/>3ème écoute : avec transcription</p>

<h2>📺 Ressources recommandées par niveau</h2>

<h3>Débutant</h3>
<ul>
<li>EnglishClass101 (YouTube)</li>
<li>BBC Learning English</li>
<li>Podcasts lents avec transcription</li>
</ul>

<h3>Intermédiaire</h3>
<ul>
<li>TED Talks avec sous-titres anglais</li>
<li>Podcasts : 6 Minute English (BBC)</li>
<li>Séries TV avec sous-titres anglais</li>
</ul>

<h3>Avancé</h3>
<ul>
<li>Films et séries sans sous-titres</li>
<li>Podcasts natifs (NPR, BBC Radio)</li>
<li>Conférences et débats en direct</li>
</ul>

<h2>🎓 Exercice</h2>
<p><strong>Écoutez une vidéo TED Talk de 5 minutes.</strong></p>
<ol>
<li>1ère écoute : Quel est le sujet principal ?</li>
<li>2ème écoute : Notez 3 arguments clés</li>
<li>3ème écoute avec transcription : Identifiez 5 mots nouveaux</li>
</ol>
</div>`,
    [
      { q: "Que signifie 'wanna' en anglais oral rapide ?", r: "want to", exp: "Réduction fréquente en conversation" },
      { q: "Quelle est la différence de prononciation de 'water' entre UK et US ?", r: "UK: /wɔː.tə/ (pas de R), US: /wɔː.t̬ɚ/ (R prononcé)", exp: "Le R post-vocalique est un marqueur clé" },
      { q: "Quelle technique consiste à ne pas chercher à comprendre chaque mot ?", r: "Écoute globale", exp: "Capturez l'idée générale d'abord" },
      { q: "Que devient 'did you' en anglais rapide ?", r: "didju", exp: "D+Y = son DJ" },
      { q: "Quelle ressource recommande-t-on pour le niveau intermédiaire ?", r: "TED Talks avec sous-titres anglais", exp: "Contenu varié et sous-titres disponibles" }
    ],
    18
  );

  // ═══════════════════════════════════════════════════════
  //  BILAN FINAL
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "🎓 Final Assessment & Certification",
    "Révision complète et évaluation finale du programme Anglais Adultes",
    `<div class="lecon-anglais">
<h1>🎓 Final Assessment & Certification</h1>

<div class="intro-box">
<p>Félicitations ! Vous avez parcouru l'ensemble du programme Anglais Adultes Tate. Ce chapitre final vous permet de réviser l'essentiel et de tester vos connaissances.</p>
</div>

<h2>📚 Récapitulatif des modules</h2>

<h3>Module 1 — English Fundamentals</h3>
<ul>
<li><strong>Ch1</strong> : TO BE & Personal Introductions</li>
<li><strong>Ch2</strong> : Present Simple & Daily Routines</li>
<li><strong>Ch3</strong> : Present Continuous & Actions in Progress</li>
<li><strong>Ch4</strong> : Simple Past & Life Stories</li>
<li><strong>Ch5</strong> : Future Tenses & Projects</li>
<li><strong>Ch6</strong> : Modal Verbs (Can, Must, Should, May)</li>
</ul>

<h3>Module 2 — Business English</h3>
<ul>
<li><strong>Ch1</strong> : Professional Emails</li>
<li><strong>Ch2</strong> : Meetings & Presentations</li>
<li><strong>Ch3</strong> : Job Interviews & CV</li>
<li><strong>Ch4</strong> : Negotiations & Diplomacy</li>
<li><strong>Ch5</strong> : Phone Calls & Video Conferences</li>
</ul>

<h3>Module 3 — Everyday Conversations</h3>
<ul>
<li><strong>Ch1</strong> : At the Restaurant & Food</li>
<li><strong>Ch2</strong> : Shopping & Bargaining</li>
</ul>

<h3>Module 4 — Travel & Tourism</h3>
<ul>
<li><strong>Ch1</strong> : Airport & Check-in</li>
<li><strong>Ch2</strong> : Hotel & Accommodation</li>
</ul>

<h3>Module 5 — Writing & Communication</h3>
<ul>
<li><strong>Ch1</strong> : Formal vs Informal Writing</li>
<li><strong>Ch2</strong> : Essays & Reports</li>
</ul>

<h3>Module 6 — Listening & Comprehension</h3>
<ul>
<li><strong>Ch1</strong> : Understanding Native Speakers</li>
</ul>

<h2>📝 Grammaire — Points clés à retenir</h2>

<table class="verb-table">
<tr><th>Temps</th><th>Formation</th><th>Utilisation</th></tr>
<tr><td>Present Simple</td><td>V / V+s</td><td>Habitudes, vérités générales</td></tr>
<tr><td>Present Continuous</td><td>BE + V-ing</td><td>Action en cours, projet futur</td></tr>
<tr><td>Simple Past</td><td>V+ed / irrégulier</td><td>Actions passées terminées</td></tr>
<tr><td>Future (Will)</td><td>Will + V</td><td>Décision spontanée, prédiction</td></tr>
<tr><td>Future (Going to)</td><td>BE + going to + V</td><td>Projet prévu</td></tr>
<tr><td>Present Perfect</td><td>Have/Has + V3</td><td>Expérience passée liée au présent</td></tr>
</table>

<h2>🗣️ Les modaux essentiels</h2>
<ul>
<li><strong>Can</strong> = capacité, permission</li>
<li><strong>Could</strong> = capacité passée, politesse</li>
<li><strong>Must</strong> = obligation forte, déduction</li>
<li><strong>Have to</strong> = obligation externe</li>
<li><strong>Should</strong> = conseil</li>
<li><strong>May</strong> = permission formelle, possibilité</li>
<li><strong>Might</strong> = possibilité faible</li>
</ul>

<h2>💼 Business English — Phrases incontournables</h2>
<ul>
<li>"I am writing to inquire about..."</li>
<li>"Could you please...?"</li>
<li>"I look forward to hearing from you."</li>
<li>"Let's move on to the next point."</li>
<li>"That's a great question."</li>
<li>"I'll get back to you on that."</li>
</ul>

<h2>🎓 Test final — Auto-évaluation</h2>

<p><strong>Partie 1 — Grammaire</strong></p>
<ol>
<li>Conjuguez : She (to work) in Paris since 2020. → ___________</li>
<li>Transformez au passé : I go to the market every Sunday. → ___________</li>
<li>Choisissez : "Look! It (rain) ___________ outside."</li>
<li>Modal : Vous devez finir ce rapport aujourd'hui → You ___________ finish this report today.</li>
</ol>

<p><strong>Partie 2 — Vocabulaire professionnel</strong></p>
<ol>
<li>Quelle formule de politesse utilise-t-on pour conclure un email formel ?</li>
<li>Comment demande-t-on poliment à quelqu'un de répéter ?</li>
<li>Que signifie "action items" dans une réunion ?</li>
</ol>

<p><strong>Partie 3 — Expression orale</strong></p>
<ol>
<li>Présentez-vous en 1 minute (nom, origine, profession, projets)</li>
<li>Racontez un voyage ou événement marquant de votre vie (2 minutes)</li>
<li>Présentez un projet professionnel (3 minutes)</li>
</ol>

<h2>🏆 Certification</h2>
<p>Complétez l'ensemble des chapitres et réussissez les quiz pour obtenir votre <strong>Certificat Tate English — Adult Level</strong>.</p>
<p>Niveau visé à l'issue du programme : <strong>B1-B2 du CECRL</strong> (utilisateur indépendant à avancé)</p>

<h2>🚀 Prochaines étapes</h2>
<ul>
<li>Pratiquez quotidiennement (15-30 min)</li>
<li>Regardez des films/séries en anglais avec sous-titres anglais</li>
<li>Parlez avec des natifs sur des applications d'échange linguistique</li>
<li>Lisez des articles en anglais sur des sujets qui vous intéressent</li>
<li>Continuez avec le <strong>Tutorat personnalisé Tate</strong> pour un suivi individualisé</li>
</ul>

<p><strong>Remember: The more you practice, the more confident you become! 💪</strong></p>
</div>`,
    [
      { q: "Quel temps utilise-t-on pour les habitudes ?", r: "Present Simple", exp: "Ex: I work every day" },
      { q: "Quel modal exprime un conseil ?", r: "Should", exp: "You should practice every day" },
      { q: "Que signifie 'I look forward to hearing from you' ?", r: "Dans l'attente de votre réponse", exp: "Formule de conclusion d'email" },
      { q: "Quel est le passé de 'go' ?", r: "went", exp: "Verbe irrégulier essentiel" },
      { q: "Quelle formule utilise-t-on pour passer au point suivant en réunion ?", r: "Let's move on to the next point.", exp: "Transition standard" }
    ],
    19
  );

  console.log("\n✅=== 19 CHAPITRES ANGLAIS ADULTES CRÉÉS AVEC SUCCÈS ===");
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
