require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./connect');
const User          = require('../models/User');
const Matiere       = require('../models/Matiere');
const Chapitre      = require('../models/Chapitre');
const Lecon         = require('../models/Lecon');
const Qcm           = require('../models/Qcm');
const Entrainement  = require('../models/Entrainement');

// ============================================================
// seed-ist-cm1.js
// Intègre les 14 leçons d'IST CM1 dans la plateforme Taté
// Leçons : 3,6,9,10
//
// Usage : node src/db/seed-histoire-cm1.js
// ============================================================

// ─────────────────────────────────────────────────────────────
// DONNÉES DES LEÇONS
// ─────────────────────────────────────────────────────────────
const LECONS_DATA = [
  {ordre:3,titre:"La Brouette / La Lampe de Poche",objectif:"Comprendre les principes de la brouette (levier) et de la lampe de poche",promptSupplement:"Exemples concrets de la vie quotidienne.",contenuHTML:`<h1>🔦 Leçon 3 : Brouette / Lampe de Poche</h1><p>La brouette est un outil-levier pour déplacer des charges lourdes. Composée de : poignées, brancard, pieds, essieu, benne, roue.</p><p>La lampe de poche est un appareil électrique portable. Composée de : ampoule(s), piles, fils, interrupteur. L'ampoule émet la lumière, les piles fournissent le courant, les fils transportent le courant, l'interrupteur allume/éteint.</p>`,exercices:[{question:"Qu'est-ce qu'une brouette ?",reponse:"Outil-levier pour déplacer des objets lourds.",explication:"Transport."},{question:"6 parties de la brouette ?",reponse:"Poignées, brancard, pieds, essieu, benne, roue.",explication:"Rôle."},{question:"Qu'est-ce qu'une lampe de poche ?",reponse:"Appareil électrique portable qui produit de la lumière.",explication:"Lumière."},{question:"4 parties de la lampe ?",reponse:"Ampoule(s), piles, fils, interrupteur.",explication:"Circuit."},{question:"Rôle de l'ampoule ?",reponse:"Émettre la lumière.",explication:"Visible."},{question:"Rôle des piles ?",reponse:"Sources d'alimentation électrique.",explication:"Courant."},{question:"Rôle des fils ?",reponse:"Conducteurs électriques.",explication:"Transport."},{question:"Rôle de l'interrupteur ?",reponse:"Allumer ou éteindre.",explication:"Commande."},{question:"Pourquoi brouette = levier ?",reponse:"Moins d'effort pour charges lourdes.",explication:"Principe."},{question:"Qui utilise la brouette ?",reponse:"Jardinier, maçon, commerçant.",explication:"Charges."}],qcm:[{enonce:"Brouette = outil...",options:[{lettre:"A",texte:"Musique"},{lettre:"B",texte:"-levier"},{lettre:"C",texte:"Cuisine"},{lettre:"D",texte:"Dessin"}],reponseCorrecte:"B",explication:"Outil-levier."},{enonce:"Parties brouette ?",options:[{lettre:"A",texte:"4"},{lettre:"B",texte:"5"},{lettre:"C",texte:"6"},{lettre:"D",texte:"7"}],reponseCorrecte:"C",explication:"6 parties."},{enonce:"Lampe = appareil...",options:[{lettre:"A",texte:"Mécanique"},{lettre:"B",texte:"Électrique"},{lettre:"C",texte:"Thermique"},{lettre:"D",texte:"Gaz"}],reponseCorrecte:"B",explication:"Électrique."},{enonce:"Ampoule sert à...",options:[{lettre:"A",texte:"Stocker"},{lettre:"B",texte:"Émettre"},{lettre:"C",texte:"Transporter"},{lettre:"D",texte:"Fermer"}],reponseCorrecte:"B",explication:"Émettre."},{enonce:"Piles = ?",options:[{lettre:"A",texte:"Conducteurs"},{lettre:"B",texte:"Interrupteurs"},{lettre:"C",texte:"Alimentation"},{lettre:"D",texte:"Ampoules"}],reponseCorrecte:"C",explication:"Alimentation."},{enonce:"Fils servent à...",options:[{lettre:"A",texte:"Produire"},{lettre:"B",texte:"Transporter"},{lettre:"C",texte:"Stocker"},{lettre:"D",texte:"Protéger"}],reponseCorrecte:"B",explication:"Transporter."},{enonce:"Interrupteur = ?",options:[{lettre:"A",texte:"Produire"},{lettre:"B",texte:"Changer"},{lettre:"C",texte:"Allumer/éteindre"},{lettre:"D",texte:"Nettoyer"}],reponseCorrecte:"C",explication:"Allumer."},{enonce:"Utilisateur brouette ?",options:[{lettre:"A",texte:"Cuisinier"},{lettre:"B",texte:"Jardinier"},{lettre:"C",texte:"Musicien"},{lettre:"D",texte:"Tailleur"}],reponseCorrecte:"B",explication:"Jardinier."},{enonce:"Brouette = ?",options:[{lettre:"A",texte:"Moteur"},{lettre:"B",texte:"Levier"},{lettre:"C",texte:"Générateur"},{lettre:"D",texte:"Transfo"}],reponseCorrecte:"B",explication:"Levier."},{enonce:"Sans piles lampe ?",options:[{lettre:"A",texte:"Marche"},{lettre:"B",texte:"Moins"},{lettre:"C",texte:"Ne marche pas"},{lettre:"D",texte:"Plus"}],reponseCorrecte:"C",explication:"Piles nécessaires."}]},
  {ordre:6,titre:"L'Ordinateur",objectif:"Connaître les parties de l'ordinateur et leurs fonctions",promptSupplement:"Exemples d'utilisation d'un ordinateur.",contenuHTML:`<h1>💻 Leçon 6 : Ordinateur</h1><p>Outil électronique pour traiter des informations. Unité centrale (disque dur, mémoire vive, processeur, lecteur). Stockage : CD ROM, disque dur, DVD. Périphériques d'entrée : clavier, souris, micro, scanner, caméra. Périphériques de sortie : imprimante, écran, haut-parleur. Modem : connexion Internet.</p>`,exercices:[{question:"Qu'est-ce qu'un ordinateur ?",reponse:"Outil électronique pour traiter des informations.",explication:"Machine."},{question:"Unité centrale contient ?",reponse:"Disque dur, mémoire, processeur, lecteur.",explication:"Composants."},{question:"3 unités de stockage ?",reponse:"CD ROM, disque dur, DVD.",explication:"Stockage."},{question:"Qu'est-ce qu'un périphérique d'entrée ? 2 ex.",reponse:"Envoie données à l'ordi. Ex: clavier, souris.",explication:"Instructions."},{question:"Qu'est-ce qu'un périphérique de sortie ? 2 ex.",reponse:"Reçoit données. Ex: imprimante, écran.",explication:"Affichage."},{question:"À quoi sert le modem ?",reponse:"Connecter à Internet.",explication:"Réseau."},{question:"Rôle du processeur ?",reponse:"Calculs et exécution.",explication:"Moteur."},{question:"Rôle du disque dur ?",reponse:"Stocker fichiers et programmes.",explication:"Mémoire."},{question:"Quel périphérique numérise ?",reponse:"Le scanner.",explication:"Scan."},{question:"Cite 3 fonctions de l'ordi.",reponse:"Communiquer, enregistrer, visionner.",explication:"Usages."}],qcm:[{enonce:"Ordinateur = outil...",options:[{lettre:"A",texte:"Mécanique"},{lettre:"B",texte:"Électronique"},{lettre:"C",texte:"Manuel"},{lettre:"D",texte:"Thermique"}],reponseCorrecte:"B",explication:"Électronique."},{enonce:"Cerveau de l'ordi ?",options:[{lettre:"A",texte:"Écran"},{lettre:"B",texte:"Clavier"},{lettre:"C",texte:"Unité centrale"},{lettre:"D",texte:"Souris"}],reponseCorrecte:"C",explication:"UC."},{enonce:"Clavier = périphérique...",options:[{lettre:"A",texte:"Sortie"},{lettre:"B",texte:"Entrée"},{lettre:"C",texte:"Stockage"},{lettre:"D",texte:"Central"}],reponseCorrecte:"B",explication:"Entrée."},{enonce:"Imprimante = périphérique...",options:[{lettre:"A",texte:"Entrée"},{lettre:"B",texte:"Sortie"},{lettre:"C",texte:"Stockage"},{lettre:"D",texte:"Central"}],reponseCorrecte:"B",explication:"Sortie."},{enonce:"Modem sert à...",options:[{lettre:"A",texte:"Imprimer"},{lettre:"B",texte:"Internet"},{lettre:"C",texte:"Écouter"},{lettre:"D",texte:"Scanner"}],reponseCorrecte:"B",explication:"Internet."},{enonce:"Le processeur...",options:[{lettre:"A",texte:"Stocke"},{lettre:"B",texte:"Calcule"},{lettre:"C",texte:"Affiche"},{lettre:"D",texte:"Imprime"}],reponseCorrecte:"B",explication:"Calcule."},{enonce:"Disque dur sert à...",options:[{lettre:"A",texte:"Afficher"},{lettre:"B",texte:"Stocker"},{lettre:"C",texte:"Imprimer"},{lettre:"D",texte:"Connecter"}],reponseCorrecte:"B",explication:"Stocker."},{enonce:"Micro = périphérique...",options:[{lettre:"A",texte:"Sortie"},{lettre:"B",texte:"Entrée"},{lettre:"C",texte:"Stockage"},{lettre:"D",texte:"Affichage"}],reponseCorrecte:"B",explication:"Entrée."},{enonce:"Écran = ?",options:[{lettre:"A",texte:"Clavier"},{lettre:"B",texte:"Moniteur"},{lettre:"C",texte:"Processeur"},{lettre:"D",texte:"Modem"}],reponseCorrecte:"B",explication:"Moniteur."},{enonce:"Périphérique qui numérise ?",options:[{lettre:"A",texte:"Imprimante"},{lettre:"B",texte:"Scanner"},{lettre:"C",texte:"Souris"},{lettre:"D",texte:"HP"}],reponseCorrecte:"B",explication:"Scanner."}]},
  {ordre:9,titre:"Les É·tats de la Matière",objectif:"Connaître les 3 états de la matière et leurs propriétés",promptSupplement:"Exemples concrets de la vie quotidienne.",contenuHTML:`<h1>🧪 Leçon 9 : États de la Matière</h1><p>3 états : <strong>Solide</strong> (forme propre. Certains fondent : fer, or. D'autres non : sable, pierre = réfractaires). <strong>Liquide</strong> (fluide, forme du récipient). <strong>Gaz</strong> (invisible, compressible, élastique).</p><p>NB : les solides et les liquides ont un volume invariable.</p>`,exercices:[{question:"Les 3 états de la matière ?",reponse:"Solide, liquide, gazeux.",explication:"3."},{question:"Pourquoi les liquides sont des fluides ?",reponse:"Parce qu'ils coulent.",explication:"Écoulement."},{question:"Qu'est-ce qu'un corps réfractaire ?",reponse:"Solide qui ne fond pas sous la chaleur.",explication:"Ex: sable, pierre."},{question:"Citez 2 gaz.",reponse:"Air, butane.",explication:"Invisibles."},{question:"Volume des solides et liquides ?",reponse:"Invariable (fixe).",explication:"Seuls gaz varient."},{question:"Pourquoi les gaz sont compressibles ?",reponse:"On peut réduire leur volume.",explication:"Élastiques."},{question:"Donnez un exemple de solide qui fond.",reponse:"Fer, or, glace.",explication:"Chauffage."},{question:"Qu'est-ce qu'un fluide ?",reponse:"Substance qui coule.",explication:"Ex: eau, huile."},{question:"Citez 3 propriétés des gaz.",reponse:"Invisibles, compressibles, élastiques.",explication:"Propriétés."},{question:"Donnez un exemple de liquide.",reponse:"Huile, lait, jus de fruit.",explication:"Coule."}],qcm:[{enonce:"Combien d'états de la matière ?",options:[{lettre:"A",texte:"2"},{lettre:"B",texte:"3"},{lettre:"C",texte:"4"},{lettre:"D",texte:"5"}],reponseCorrecte:"B",explication:"3 états."},{enonce:"Un liquide...",options:[{lettre:"A",texte:"Forme fixe"},{lettre:"B",texte:"Forme du récipient"},{lettre:"C",texte:"Toujours solide"},{lettre:"D",texte:"Invisible"}],reponseCorrecte:"B",explication:"Forme du récipient."},{enonce:"Corps réfractaire = ?",options:[{lettre:"A",texte:"Fond"},{lettre:"B",texte:"Ne fond pas"},{lettre:"C",texte:"Se transforme en gaz"},{lettre:"D",texte:"Se liquéfie"}],reponseCorrecte:"B",explication:"Ne fond pas."},{enonce:"Les gaz sont...",options:[{lettre:"A",texte:"Visibles"},{lettre:"B",texte:"Invisibles"},{lettre:"C",texte:"Liquides"},{lettre:"D",texte:"Solides"}],reponseCorrecte:"B",explication:"Invisibles."},{enonce:"L'eau est un exemple de...",options:[{lettre:"A",texte:"Solide"},{lettre:"B",texte:"Gaz"},{lettre:"C",texte:"Liquide"},{lettre:"D",texte:"Gazeux"}],reponseCorrecte:"C",explication:"Liquide."},{enonce:"L'air est un exemple de...",options:[{lettre:"A",texte:"Liquide"},{lettre:"B",texte:"Solide"},{lettre:"C",texte:"Gaz"},{lettre:"D",texte:"Plasma"}],reponseCorrecte:"C",explication:"Gaz."},{enonce:"Le volume d'un gaz est...",options:[{lettre:"A",texte:"Fixe"},{lettre:"B",texte:"Variable"},{lettre:"C",texte:"Nul"},{lettre:"D",texte:"Constant"}],reponseCorrecte:"B",explication:"Variable."},{enonce:"Le fer chauffé...",options:[{lettre:"A",texte:"Ne fond pas"},{lettre:"B",texte:"Fond"},{lettre:"C",texte:"Se solidifie"},{lettre:"D",texte:"S'évapore"}],reponseCorrecte:"B",explication:"Fond."},{enonce:"Le sable est un solide...",options:[{lettre:"A",texte:"Réfractaire"},{lettre:"B",texte:"Fusible"},{lettre:"C",texte:"Liquide"},{lettre:"D",texte:"Gazeux"}],reponseCorrecte:"A",explication:"Réfractaire."},{enonce:"Un fluide est...",options:[{lettre:"A",texte:"Un gaz"},{lettre:"B",texte:"Un solide"},{lettre:"C",texte:"Une substance qui coule"},{lettre:"D",texte:"Un corps réfractaire"}],reponseCorrecte:"C",explication:"Substance qui coule."}]},
  {ordre:10,titre:"Les Combustions Vives",objectif:"Comprendre ce qu'est une combustion vive et ses conditions",promptSupplement:"Exemples concrets comme la cuisson au feu de bois.",contenuHTML:`<h1>🔥 Leçon 10 : Combustions Vives</h1><p>Une <strong>combustion vive</strong> dégage de la chaleur, de la lumière, du gaz carbonique et de la vapeur d'eau.</p><p><strong>Combustibles</strong> : liquides (pétrole, essence), solides (bois, bougie, charbon), gazeux (butane, propane, gaz naturel).</p><p><strong>Conditions</strong> : 1) Chauffer le combustible. 2) Contact avec l'oxygène de l'air.</p>`,exercices:[{question:"Qu'est-ce qu'une combustion vive ?",reponse:"Dégage chaleur, lumière, CO2 et vapeur d'eau.",explication:"Visible."},{question:"Qu'est-ce qu'un combustible ?",reponse:"Un corps qui peut brûler.",explication:"Ex: bois, essence."},{question:"Citez les 3 types de combustibles avec exemples.",reponse:"Solide (bois), liquide (essence), gazeux (butane).",explication:"Types."},{question:"Quelles sont les 2 conditions pour une combustion vive ?",reponse:"Chauffer le combustible + le mettre au contact de l'oxygène.",explication:"Nécessaires."},{question:"Donnez un exemple de combustible liquide.",reponse:"Pétrole, essence, alcool.",explication:"Brûlent facilement."},{question:"Donnez un exemple de combustible solide.",reponse:"Bois, bougie, charbon.",explication:"Courants."},{question:"Donnez un exemple de combustible gazeux.",reponse:"Butane, propane, gaz naturel.",explication:"Pour la cuisson."},{question:"Que produit une combustion vive ?",reponse:"Chaleur, lumière, gaz carbonique, vapeur d'eau.",explication:"4 produits."},{question:"Pourquoi l'oxygène est-il nécessaire ?",reponse:"Le combustible en a besoin pour brûler.",explication:"L'air fournit l'oxygène."},{question:"La flamme d'une bougie est-elle une combustion vive ?",reponse:"Oui, elle dégage chaleur et lumière.",explication:"Exemple classique."}],qcm:[{enonce:"Une combustion vive produit...",options:[{lettre:"A",texte:"Froid et obscurité"},{lettre:"B",texte:"Chaleur et lumière"},{lettre:"C",texte:"Son et mouvement"},{lettre:"D",texte:"Eau et vent"}],reponseCorrecte:"B",explication:"Chaleur et lumière."},{enonce:"Un combustible est...",options:[{lettre:"A",texte:"Un corps qui ne brûle pas"},{lettre:"B",texte:"Un corps qui brûle"},{lettre:"C",texte:"Un liquide uniquement"},{lettre:"D",texte:"Un gaz uniquement"}],reponseCorrecte:"B",explication:"Corps qui brûle."},{enonce:"Le bois est un combustible...",options:[{lettre:"A",texte:"Liquide"},{lettre:"B",texte:"Solide"},{lettre:"C",texte:"Gazeux"},{lettre:"D",texte:"Plastique"}],reponseCorrecte:"B",explication:"Solide."},{enonce:"L'essence est un combustible...",options:[{lettre:"A",texte:"Solide"},{lettre:"B",texte:"Liquide"},{lettre:"C",texte:"Gazeux"},{lettre:"D",texte:"Minéral"}],reponseCorrecte:"B",explication:"Liquide."},{enonce:"Le butane est un combustible...",options:[{lettre:"A",texte:"Solide"},{lettre:"B",texte:"Liquide"},{lettre:"C",texte:"Gazeux"},{lettre:"D",texte:"Naturel"}],reponseCorrecte:"C",explication:"Gazeux."},{enonce:"Pour brûler, le combustible doit être...",options:[{lettre:"A",texte:"Mouillé"},{lettre:"B",texte:"Chauffé"},{lettre:"C",texte:"Refroidi"},{lettre:"D",texte:"Caché"}],reponseCorrecte:"B",explication:"Chauffé."},{enonce:"Le combustible a besoin de...",options:[{lettre:"A",texte:"D'eau"},{lettre:"B",texte:"D'oxygène"},{lettre:"C",texte:"De sable"},{lettre:"D",texte:"De vent"}],reponseCorrecte:"B",explication:"D'oxygène."},{enonce:"Sans oxygène, une combustion...",options:[{lettre:"A",texte:"Brûle mieux"},{lettre:"B",texte:"Ne peut pas se produire"},{lettre:"C",texte:"Refroidit"},{lettre:"D",texte:"Devient bleue"}],reponseCorrecte:"B",explication:"Ne peut pas."},{enonce:"Le charbon est un combustible...",options:[{lettre:"A",texte:"Liquide"},{lettre:"B",texte:"Solide"},{lettre:"C",texte:"Gazeux"},{lettre:"D",texte:"Végétal"}],reponseCorrecte:"B",explication:"Solide."},{enonce:"Sans chaleur, une combustion...",options:[{lettre:"A",texte:"Se produit quand même"},{lettre:"B",texte:"Ne peut pas se produire"},{lettre:"C",texte:"Accélère"},{lettre:"D",texte:"Ralentit"}],reponseCorrecte:"B",explication:"Ne peut pas."}]}
];

const QUIZ_DATA = {
  3: [
{q:"Outil pour charges lourdes ?",opts:["Pelle","Brouette","Seau","Marteau"],ok:1},
{q:"Parties brouette ?",opts:["4","5","6","7"],ok:2},
{q:"Partie qui produit lumière ?",opts:["Pile","Fil","Ampoule","Interrupteur"],ok:2},
{q:"Interrupteur sert à ?",opts:["Produire","Stocker","Allumer/éteindre","Protéger"],ok:2},
{q:"Les piles sont ?",opts:["Ampoules","Alimentation","Interrupteurs","Conducteurs"],ok:1},
{q:"Qui utilise la brouette ?",opts:["Médecin","Jardinier","Professeur","Musicien"],ok:1}
  ],
  6: [
{q:"L'ordinateur est un outil...",opts:["Mécanique","Électronique","Manuel","Chimique"],ok:1},
{q:"Cerveau de l'ordi s'appelle ?",opts:["Écran","Unité centrale","Souris","Clavier"],ok:1},
{q:"Clavier = périphérique...",opts:["Sortie","Entrée","Stockage","Affichage"],ok:1},
{q:"Imprimante = périphérique...",opts:["Entrée","Sortie","Central","Réseau"],ok:1},
{q:"Le modem connecte à...",opts:["L'imprimante","Internet","L'écran","Le clavier"],ok:1},
{q:"Le disque dur...",opts:["Stocke","Imprime","Affiche","Sonorise"],ok:0}
  ],
  9: [
{q:"Combien d'états de la matière ?",opts:["2","3","4","5"],ok:1},
{q:"Un liquide prend...",opts:["Forme fixe","Forme du récipient","Aucune forme","Forme carrée"],ok:1},
{q:"Les gaz sont...",opts:["Visibles","Invisibles","Liquides","Solides"],ok:1},
{q:"L'eau est un...",opts:["Solide","Gaz","Liquide","Vapeur"],ok:2},
{q:"Le volume d'un gaz est...",opts:["Fixe","Variable","Nul","Énorme"],ok:1},
{q:"Réfractaire signifie...",opts:["Qui fond","Qui ne fond pas","Qui coule","Qui brûle"],ok:1}
  ],
  10: [
{q:"Une combustion vive produit...",opts:["Froid","Chaleur et lumière","Son","Eau"],ok:1},
{q:"Le bois est un combustible...",opts:["Liquide","Solide","Gazeux","Plastique"],ok:1},
{q:"L'essence est un combustible...",opts:["Solide","Liquide","Gazeux","Rocher"],ok:1},
{q:"La combustion a besoin de...",opts:["D'eau","D'oxygène","De sable","De froid"],ok:1},
{q:"Sans oxygène, la combustion...",opts:["Marche mieux","Ne marche pas","Produit du froid","S'arrête"],ok:1},
{q:"Le butane est un gaz...",opts:["Liquide","Solide","Combustible","Naturel"],ok:2}
  ],
};

// GÉNÉRATEURS HTML POUR QUIZ
// ─────────────────────────────────────────────────────────────
const LETTRES = ['A', 'B', 'C', 'D'];

function genererQuizHTML(titre, questions) {
  const qs = questions.map((q, i) => `
  <div class="question">
    <p class="enonce"><strong>Question ${i + 1} :</strong> ${q.q}</p>
    <ul class="options">
      ${q.opts.map((o, j) => `<li><span class="lettre">${LETTRES[j]}.</span> ${o}</li>`).join('\n      ')}
    </ul>
  </div>`).join('\n');

  return `<div class="quiz-container">
  <h2>⚡ Quiz — ${titre}</h2>
  <p class="consigne">Pour chaque question, entoure la bonne réponse (A, B, C ou D).</p>
  ${qs}
</div>`;
}

// Génère le HTML du QCM interactif (radio buttons) à intégrer dans contenuHTML
function genererQCMEmbed(questions) {
  const qHtml = questions.map((q, i) => {
    const opts = q.options.map(o => {
      const correct = o.lettre === q.reponseCorrecte ? ' data-correct="true"' : '';
      return `  <label><input type="radio" name="q${i + 1}" value="${o.lettre}"${correct}> ${o.lettre}. ${o.texte}</label>`;
    }).join('\n');
    return `<div class="question">
  <p><strong>${i + 1}. ${q.enonce}</strong></p>
${opts}
</div>`;
  }).join('\n\n');

  return `\n\n<h2>✏️ QCM — Vérifie tes connaissances</h2>
<p style="font-size:0.9rem;color:#92400e;margin-bottom:16px">Choisis la bonne réponse pour chaque question, puis valide !</p>
${qHtml}`;
}

function genererCorrectionHTML(titre, questions) {
  const qs = questions.map((q, i) => `
  <div class="correction-item">
    <p class="enonce"><strong>Question ${i + 1} :</strong> ${q.q}</p>
    <p class="reponse">✅ <strong>Réponse : ${LETTRES[q.ok]}. ${q.opts[q.ok]}</strong></p>
  </div>`).join('\n');

  return `<div class="correction-container">
  <h2>✅ Correction du Quiz — ${titre}</h2>
  ${qs}
</div>`;
}

// ─────────────────────────────────────────────────────────────
// SCRIPT PRINCIPAL
// ─────────────────────────────────────────────────────────────
const seed = async () => {
  await connectDB();
  console.log('\n✅ Connecté à MongoDB\n');

  // 1. Trouver la matière IST
  const matiere = await Matiere.findOne({ code: 'IST' });
  if (!matiere) {
    console.error('❌ Matière IST (code: IST) introuvable. Lance d\'abord node src/db/seed.js');
    process.exit(1);
  }
  console.log(`✅ Matière IST trouvée : ${matiere._id}`);

  // 2. Trouver l'admin
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.error('❌ Aucun admin trouvé. Lance d\'abord node src/db/seed.js');
    process.exit(1);
  }
  console.log(`✅ Admin trouvé : ${admin.email}\n`);

  let nbChapitres = 0, nbLecons = 0, nbQcms = 0, nbQuiz = 0;

  for (const data of LECONS_DATA) {
    console.log(`📚 Traitement : Leçon ${data.ordre} — ${data.titre}`);

    // ── 3. Créer ou mettre à jour le chapitre ────────────────────
    const chapitre = await Chapitre.findOneAndUpdate(
      { matiereId: matiere._id, niveau: 'CM1', ordre: data.ordre },
      {
        matiereId:        matiere._id,
        titre:            data.titre,
        niveau:           'CM1',
        objectif:         data.objectif,
        ordre:            data.ordre,
        actif:            true,
        sectionFr:        null,
        promptSupplement: data.promptSupplement,
      },
      { upsert: true, new: true }
    );
    nbChapitres++;
    console.log(`   ✅ Chapitre créé/mis à jour : ${chapitre._id}`);

    // ── 4. Archiver les anciennes leçons publiées ────────────────
    await Lecon.updateMany(
      { chapitreId: chapitre._id, statut: 'publie' },
      { statut: 'brouillon' }
    );

    // ── 5. Créer la leçon avec contenuHTML ───────────────────────
    const lecon = await Lecon.create({
      chapitreId:   chapitre._id,
      titre:        data.titre,
      contenuBrut:  '',
      contenuHTML:  data.contenuHTML.trim() + genererQCMEmbed(data.qcm),
      contenuFormate: {
        resume:          '',
        objectif:        data.objectif,
        regle:           '',
        exemples:        [],
        pieges:          [],
        resumeMemo:      [],
        correctionsTypes: data.exercices,
      },
      dureeExercices: null,
      statut:        'publie',
      creePar:       admin._id,
      valideePar:    admin._id,
      valideeAt:     new Date(),
    });
    nbLecons++;
    console.log(`   ✅ Leçon publiée : ${lecon._id} (${data.exercices.length} exercices)`);

    // ── 6. Supprimer les anciens QCM de ce chapitre ──────────────
    await Qcm.deleteMany({ chapitreId: chapitre._id });

    // ── 7. Créer le QCM ─────────────────────────────────────────
    const qcm = await Qcm.create({
      chapitreId:  chapitre._id,
      leconId:     lecon._id,
      titre:       `QCM — ${data.titre}`,
      questions:   data.qcm,
      statut:      'publie',
      creePar:     admin._id,
      valideePar:  admin._id,
      valideeAt:   new Date(),
    });
    nbQcms++;
    console.log(`   ✅ QCM publié : ${qcm._id} (${data.qcm.length} questions)`);

    // ── 8. Supprimer les anciens quiz de ce chapitre ─────────────
    await Entrainement.deleteMany({ matiere: 'IST', niveau: 'CM1', chapitre: data.titre });

    // ── 9. Créer le Quiz (Entrainement) ──────────────────────────
    const quizQuestions = QUIZ_DATA[data.ordre];
    const entrainement = await Entrainement.create({
      matiere:        'IST',
      niveau:         'CM1',
      section:        '',
      chapitre:       data.titre,
      ordre:          data.ordre,
      titre:          `Quiz — ${data.titre}`,
      source:         'Cours CM1 IST',
      nbExercices:    quizQuestions.length,
      contenuHTML:    genererQuizHTML(data.titre, quizQuestions),
      correctionHTML: genererCorrectionHTML(data.titre, quizQuestions),
      publie:         true,
      creePar:        admin._id,
    });
    nbQuiz++;
    console.log(`   ✅ Quiz publié  : ${entrainement._id} (${quizQuestions.length} questions)\n`);
  }

  // ── Résumé final ─────────────────────────────────────────────
  console.log('🎓 ══════════════════════════════════════════════');
  console.log('   Seed IST CM1 terminé avec succès !');
  console.log(`   📚 Chapitres créés/mis à jour : ${nbChapitres}`);
  console.log(`   📖 Leçons publiées            : ${nbLecons}`);
  console.log(`   ✏️  QCMs publiés              : ${nbQcms}`);
  console.log(`   ⚡ Quiz publiés               : ${nbQuiz}`);
  console.log('   → Les élèves CM1 peuvent maintenant');
  console.log('     accéder aux cours, QCMs et Quiz d\'IST !');
  console.log('══════════════════════════════════════════════\n');

  process.exit(0);
};

seed().catch(e => {
  console.error('❌ Erreur seed IST CM1 :', e.message);
  console.error(e.stack);
  process.exit(1);
});
