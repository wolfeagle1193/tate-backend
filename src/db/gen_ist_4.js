#!/usr/bin/env node
/**
 * Generate seed-ist-cm1.js with EXACTLY 4 lessons (3,6,9,10)
 * Compact, clean, no orphaned commas, syntax-verified.
 */
const fs = require('fs');
const path = require('path');
const tmpl = fs.readFileSync(path.join(__dirname, 'seed-histoire-cm1.js'), 'utf8');

// ── HELPERS ────────────────────────────────────────────────
const esc = s => s.replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\n/g,'').replace(/\r/g,'');

function jsonToJS(obj) {
  // Convert JSON to JS with proper template literals for contenuHTML
  let s = JSON.stringify(obj, null, 2);
  // Replace the contenuHTML key to use backtick
  s = s.replace(/"contenuHTML": "(.+?)"(,?)$/m, (m, p1, comma) => 'contenuHTML: `' + p1 + '`' + comma);
  // Remove quotes around property names in objects
  s = s.replace(/"(\w+)":/g, '$1:');
  // Fix: the JSON.stringify puts contenuHTML on multiple lines
  // Let me just build manually instead
  return s;
}

function Q(q,r,e) { return `{question:"${esc(q)}",reponse:"${esc(r)}",explication:"${esc(e)}"}`; }
function QA(enonce,ops,ci,expl) {
  const c = String.fromCharCode(65+ci);
  return `{enonce:"${esc(enonce)}",options:[${ops.map((o,i)=>`{lettre:"${String.fromCharCode(65+i)}",texte:"${esc(o)}"}`)}],reponseCorrecte:"${c}",explication:"${esc(expl)}"}`;
}
function QZ(q,opts,ok) {
  return `{q:"${esc(q)}",opts:[${opts.map(o=>'"'+esc(o)+'"')}],ok:${ok}}`;
}

function L(o,t,obj,pr,html,exos,qcm) {
  return `  {ordre:${o},titre:"${esc(t)}",objectif:"${esc(obj)}",promptSupplement:"${esc(pr)}",contenuHTML:\`${html}\`,exercices:[${exos.join(',')}],qcm:[${qcm.join(',')}]}`;
}

// ── HEADER ─────────────────────────────────────────────────
const leconsStart = tmpl.indexOf('const LECONS_DATA = [');
const quizStart = tmpl.indexOf('const QUIZ_DATA = {');
const quizEnd = tmpl.indexOf('};', quizStart);

const out = [];
out.push(tmpl.substring(0, leconsStart)
  .replace('seed-histoire-cm1.js', 'seed-ist-cm1.js')
  .replace("code: 'HI'", "code: 'IST'")
  .replace("Leçons : 1,2,3,4,5,6,7,8,12,16,17,18,19,20", "Leçons : 3,6,9,10"));

out.push('const LECONS_DATA = [\n');

const lessons = [];
const quizzes = {};

// ══════════════════ LEÇON 3 ══════════════════════════════
lessons.push(L(3,
  "La Brouette / La Lampe de Poche",
  "Comprendre les principes de la brouette (levier) et de la lampe de poche",
  "Exemples concrets de la vie quotidienne.",
  "<h1>\u{1f526} Le\u00e7on 3 : Brouette / Lampe de Poche</h1><p>La brouette est un outil-levier pour d\u00e9placer des charges lourdes. Compos\u00e9e de : poign\u00e9es, brancard, pieds, essieu, benne, roue.</p><p>La lampe de poche est un appareil \u00e9lectrique portable. Compos\u00e9e de : ampoule(s), piles, fils, interrupteur. L'ampoule \u00e9met la lumi\u00e8re, les piles fournissent le courant, les fils transportent le courant, l'interrupteur allume/\u00e9teint.</p>",
  [
    Q("Qu'est-ce qu'une brouette ?","Outil-levier pour déplacer des objets lourds.","Transport."),
    Q("6 parties de la brouette ?","Poignées, brancard, pieds, essieu, benne, roue.","Rôle."),
    Q("Qu'est-ce qu'une lampe de poche ?","Appareil électrique portable qui produit de la lumière.","Lumière."),
    Q("4 parties de la lampe ?","Ampoule(s), piles, fils, interrupteur.","Circuit."),
    Q("Rôle de l'ampoule ?","Émettre la lumière.","Visible."),
    Q("Rôle des piles ?","Sources d'alimentation électrique.","Courant."),
    Q("Rôle des fils ?","Conducteurs électriques.","Transport."),
    Q("Rôle de l'interrupteur ?","Allumer ou éteindre.","Commande."),
    Q("Pourquoi brouette = levier ?","Moins d'effort pour charges lourdes.","Principe."),
    Q("Qui utilise la brouette ?","Jardinier, maçon, commerçant.","Charges."),
  ],
  [
    QA("Brouette = outil...",["Musique","-levier","Cuisine","Dessin"],1,"Outil-levier."),
    QA("Parties brouette ?",["4","5","6","7"],2,"6 parties."),
    QA("Lampe = appareil...",["Mécanique","Électrique","Thermique","Gaz"],1,"Électrique."),
    QA("Ampoule sert à...",["Stocker","Émettre","Transporter","Fermer"],1,"Émettre."),
    QA("Piles = ?",["Conducteurs","Interrupteurs","Alimentation","Ampoules"],2,"Alimentation."),
    QA("Fils servent à...",["Produire","Transporter","Stocker","Protéger"],1,"Transporter."),
    QA("Interrupteur = ?",["Produire","Changer","Allumer/éteindre","Nettoyer"],2,"Allumer."),
    QA("Utilisateur brouette ?",["Cuisinier","Jardinier","Musicien","Tailleur"],1,"Jardinier."),
    QA("Brouette = ?",["Moteur","Levier","Générateur","Transfo"],1,"Levier."),
    QA("Sans piles lampe ?",["Marche","Moins","Ne marche pas","Plus"],2,"Piles nécessaires."),
  ]
));
quizzes[3] = [
  QZ("Outil pour charges lourdes ?",["Pelle","Brouette","Seau","Marteau"],1),
  QZ("Parties brouette ?",["4","5","6","7"],2),
  QZ("Partie qui produit lumière ?",["Pile","Fil","Ampoule","Interrupteur"],2),
  QZ("Interrupteur sert à ?",["Produire","Stocker","Allumer/éteindre","Protéger"],2),
  QZ("Les piles sont ?",["Ampoules","Alimentation","Interrupteurs","Conducteurs"],1),
  QZ("Qui utilise la brouette ?",["Médecin","Jardinier","Professeur","Musicien"],1),
];

// ══════════════════ LEÇON 6 ══════════════════════════════
lessons.push(L(6,
  "L'Ordinateur",
  "Connaître les parties de l'ordinateur et leurs fonctions",
  "Exemples d'utilisation d'un ordinateur.",
  "<h1>\u{1f4bb} Le\u00e7on 6 : Ordinateur</h1><p>Outil \u00e9lectronique pour traiter des informations. Unit\u00e9 centrale (disque dur, m\u00e9moire vive, processeur, lecteur). Stockage : CD ROM, disque dur, DVD. P\u00e9riph\u00e9riques d'entr\u00e9e : clavier, souris, micro, scanner, cam\u00e9ra. P\u00e9riph\u00e9riques de sortie : imprimante, \u00e9cran, haut-parleur. Modem : connexion Internet.</p>",
  [
    Q("Qu'est-ce qu'un ordinateur ?","Outil électronique pour traiter des informations.","Machine."),
    Q("Unité centrale contient ?","Disque dur, mémoire, processeur, lecteur.","Composants."),
    Q("3 unités de stockage ?","CD ROM, disque dur, DVD.","Stockage."),
    Q("Qu'est-ce qu'un périphérique d'entrée ? 2 ex.","Envoie données à l'ordi. Ex: clavier, souris.","Instructions."),
    Q("Qu'est-ce qu'un périphérique de sortie ? 2 ex.","Reçoit données. Ex: imprimante, écran.","Affichage."),
    Q("À quoi sert le modem ?","Connecter à Internet.","Réseau."),
    Q("Rôle du processeur ?","Calculs et exécution.","Moteur."),
    Q("Rôle du disque dur ?","Stocker fichiers et programmes.","Mémoire."),
    Q("Quel périphérique numérise ?","Le scanner.","Scan."),
    Q("Cite 3 fonctions de l'ordi.","Communiquer, enregistrer, visionner.","Usages."),
  ],
  [
    QA("Ordinateur = outil...",["Mécanique","Électronique","Manuel","Thermique"],1,"Électronique."),
    QA("Cerveau de l'ordi ?",["Écran","Clavier","Unité centrale","Souris"],2,"UC."),
    QA("Clavier = périphérique...",["Sortie","Entrée","Stockage","Central"],1,"Entrée."),
    QA("Imprimante = périphérique...",["Entrée","Sortie","Stockage","Central"],1,"Sortie."),
    QA("Modem sert à...",["Imprimer","Internet","Écouter","Scanner"],1,"Internet."),
    QA("Le processeur...",["Stocke","Calcule","Affiche","Imprime"],1,"Calcule."),
    QA("Disque dur sert à...",["Afficher","Stocker","Imprimer","Connecter"],1,"Stocker."),
    QA("Micro = périphérique...",["Sortie","Entrée","Stockage","Affichage"],1,"Entrée."),
    QA("Écran = ?",["Clavier","Moniteur","Processeur","Modem"],1,"Moniteur."),
    QA("Périphérique qui numérise ?",["Imprimante","Scanner","Souris","HP"],1,"Scanner."),
  ]
));
quizzes[6] = [
  QZ("L'ordinateur est un outil...",["Mécanique","Électronique","Manuel","Chimique"],1),
  QZ("Cerveau de l'ordi s'appelle ?",["Écran","Unité centrale","Souris","Clavier"],1),
  QZ("Clavier = périphérique...",["Sortie","Entrée","Stockage","Affichage"],1),
  QZ("Imprimante = périphérique...",["Entrée","Sortie","Central","Réseau"],1),
  QZ("Le modem connecte à...",["L'imprimante","Internet","L'écran","Le clavier"],1),
  QZ("Le disque dur...",["Stocke","Imprime","Affiche","Sonorise"],0),
];

// ══════════════════ LEÇON 9 ══════════════════════════════
lessons.push(L(9,
  "Les É·tats de la Matière",
  "Connaître les 3 états de la matière et leurs propriétés",
  "Exemples concrets de la vie quotidienne.",
  "<h1>\u{1f9ea} Le\u00e7on 9 : \u00c9tats de la Mati\u00e8re</h1><p>3 \u00e9tats : <strong>Solide</strong> (forme propre. Certains fondent : fer, or. D'autres non : sable, pierre = r\u00e9fractaires). <strong>Liquide</strong> (fluide, forme du r\u00e9cipient). <strong>Gaz</strong> (invisible, compressible, \u00e9lastique).</p><p>NB : les solides et les liquides ont un volume invariable.</p>",
  [
    Q("Les 3 états de la matière ?","Solide, liquide, gazeux.","3."),
    Q("Pourquoi les liquides sont des fluides ?","Parce qu'ils coulent.","Écoulement."),
    Q("Qu'est-ce qu'un corps réfractaire ?","Solide qui ne fond pas sous la chaleur.","Ex: sable, pierre."),
    Q("Citez 2 gaz.","Air, butane.","Invisibles."),
    Q("Volume des solides et liquides ?","Invariable (fixe).","Seuls gaz varient."),
    Q("Pourquoi les gaz sont compressibles ?","On peut réduire leur volume.","Élastiques."),
    Q("Donnez un exemple de solide qui fond.","Fer, or, glace.","Chauffage."),
    Q("Qu'est-ce qu'un fluide ?","Substance qui coule.","Ex: eau, huile."),
    Q("Citez 3 propriétés des gaz.","Invisibles, compressibles, élastiques.","Propriétés."),
    Q("Donnez un exemple de liquide.","Huile, lait, jus de fruit.","Coule."),
  ],
  [
    QA("Combien d'états de la matière ?",["2","3","4","5"],1,"3 états."),
    QA("Un liquide...",["Forme fixe","Forme du récipient","Toujours solide","Invisible"],1,"Forme du récipient."),
    QA("Corps réfractaire = ?",["Fond","Ne fond pas","Se transforme en gaz","Se liquéfie"],1,"Ne fond pas."),
    QA("Les gaz sont...",["Visibles","Invisibles","Liquides","Solides"],1,"Invisibles."),
    QA("L'eau est un exemple de...",["Solide","Gaz","Liquide","Gazeux"],2,"Liquide."),
    QA("L'air est un exemple de...",["Liquide","Solide","Gaz","Plasma"],2,"Gaz."),
    QA("Le volume d'un gaz est...",["Fixe","Variable","Nul","Constant"],1,"Variable."),
    QA("Le fer chauffé...",["Ne fond pas","Fond","Se solidifie","S'évapore"],1,"Fond."),
    QA("Le sable est un solide...",["Réfractaire","Fusible","Liquide","Gazeux"],0,"Réfractaire."),
    QA("Un fluide est...",["Un gaz","Un solide","Une substance qui coule","Un corps réfractaire"],2,"Substance qui coule."),
  ]
));
quizzes[9] = [
  QZ("Combien d'états de la matière ?",["2","3","4","5"],1),
  QZ("Un liquide prend...",["Forme fixe","Forme du récipient","Aucune forme","Forme carrée"],1),
  QZ("Les gaz sont...",["Visibles","Invisibles","Liquides","Solides"],1),
  QZ("L'eau est un...",["Solide","Gaz","Liquide","Vapeur"],2),
  QZ("Le volume d'un gaz est...",["Fixe","Variable","Nul","Énorme"],1),
  QZ("Réfractaire signifie...",["Qui fond","Qui ne fond pas","Qui coule","Qui brûle"],1),
];

// ══════════════════ LEÇON 10 ══════════════════════════════
lessons.push(L(10,
  "Les Combustions Vives",
  "Comprendre ce qu'est une combustion vive et ses conditions",
  "Exemples concrets comme la cuisson au feu de bois.",
  "<h1>\u{1f525} Le\u00e7on 10 : Combustions Vives</h1><p>Une <strong>combustion vive</strong> d\u00e9gage de la chaleur, de la lumi\u00e8re, du gaz carbonique et de la vapeur d'eau.</p><p><strong>Combustibles</strong> : liquides (p\u00e9trole, essence), solides (bois, bougie, charbon), gazeux (butane, propane, gaz naturel).</p><p><strong>Conditions</strong> : 1) Chauffer le combustible. 2) Contact avec l'oxyg\u00e8ne de l'air.</p>",
  [
    Q("Qu'est-ce qu'une combustion vive ?","Dégage chaleur, lumière, CO2 et vapeur d'eau.","Visible."),
    Q("Qu'est-ce qu'un combustible ?","Un corps qui peut brûler.","Ex: bois, essence."),
    Q("Citez les 3 types de combustibles avec exemples.","Solide (bois), liquide (essence), gazeux (butane).","Types."),
    Q("Quelles sont les 2 conditions pour une combustion vive ?","Chauffer le combustible + le mettre au contact de l'oxygène.","Nécessaires."),
    Q("Donnez un exemple de combustible liquide.","Pétrole, essence, alcool.","Brûlent facilement."),
    Q("Donnez un exemple de combustible solide.","Bois, bougie, charbon.","Courants."),
    Q("Donnez un exemple de combustible gazeux.","Butane, propane, gaz naturel.","Pour la cuisson."),
    Q("Que produit une combustion vive ?","Chaleur, lumière, gaz carbonique, vapeur d'eau.","4 produits."),
    Q("Pourquoi l'oxygène est-il nécessaire ?","Le combustible en a besoin pour brûler.","L'air fournit l'oxygène."),
    Q("La flamme d'une bougie est-elle une combustion vive ?","Oui, elle dégage chaleur et lumière.","Exemple classique."),
  ],
  [
    QA("Une combustion vive produit...",["Froid et obscurité","Chaleur et lumière","Son et mouvement","Eau et vent"],1,"Chaleur et lumière."),
    QA("Un combustible est...",["Un corps qui ne brûle pas","Un corps qui brûle","Un liquide uniquement","Un gaz uniquement"],1,"Corps qui brûle."),
    QA("Le bois est un combustible...",["Liquide","Solide","Gazeux","Plastique"],1,"Solide."),
    QA("L'essence est un combustible...",["Solide","Liquide","Gazeux","Minéral"],1,"Liquide."),
    QA("Le butane est un combustible...",["Solide","Liquide","Gazeux","Naturel"],2,"Gazeux."),
    QA("Pour brûler, le combustible doit être...",["Mouillé","Chauffé","Refroidi","Caché"],1,"Chauffé."),
    QA("Le combustible a besoin de...",["D'eau","D'oxygène","De sable","De vent"],1,"D'oxygène."),
    QA("Sans oxygène, une combustion...",["Brûle mieux","Ne peut pas se produire","Refroidit","Devient bleue"],1,"Ne peut pas."),
    QA("Le charbon est un combustible...",["Liquide","Solide","Gazeux","Végétal"],1,"Solide."),
    QA("Sans chaleur, une combustion...",["Se produit quand même","Ne peut pas se produire","Accélère","Ralentit"],1,"Ne peut pas."),
  ]
));
quizzes[10] = [
  QZ("Une combustion vive produit...",["Froid","Chaleur et lumière","Son","Eau"],1),
  QZ("Le bois est un combustible...",["Liquide","Solide","Gazeux","Plastique"],1),
  QZ("L'essence est un combustible...",["Solide","Liquide","Gazeux","Rocher"],1),
  QZ("La combustion a besoin de...",["D'eau","D'oxygène","De sable","De froid"],1),
  QZ("Sans oxygène, la combustion...",["Marche mieux","Ne marche pas","Produit du froid","S'arrête"],1),
  QZ("Le butane est un gaz...",["Liquide","Solide","Combustible","Naturel"],2),
];

// ── WRITE ───────────────────────────────────────────────────
out.push(lessons.join(',\n'));
out.push('\n];\n\n');

// Quiz data
out.push('const QUIZ_DATA = {\n');
Object.keys(quizzes).sort((a,b) => a-b).forEach(k => {
  out.push(`  ${k}: [\n${quizzes[k].join(',\n')}\n  ],\n`);
});
out.push('};\n\n');

// Script part (generators + seed function)
const genStart = tmpl.indexOf('// GÉNÉRATEURS HTML POUR QUIZ');
let script = tmpl.substring(genStart);
script = script.replace("code: 'HI'", "code: 'IST'");
script = script.replace("Matière Histoire (code: HI)", "Matière IST (code: IST)");
script = script.replace('seed-histoire-cm1.js', 'seed-ist-cm1.js');
script = script.replace('CM1 Histoire', 'CM1 IST');
script = script.replace("'HI'", "'IST'");

out.push(script);

const filepath = path.join(__dirname, 'seed-ist-cm1.js');
fs.writeFileSync(filepath, out.join(''), 'utf8');

// ── VERIFY ──────────────────────────────────────────────────
const { execSync } = require('child_process');
try {
  execSync(`node --check "${filepath}"`, { stdio: 'pipe' });
  const content = fs.readFileSync(filepath, 'utf8');
  const ords = [...content.matchAll(/ordre:(\d+)/g)].map(m => m[1]);
  const quizzes_found = [...content.matchAll(/^  (\d+): \[$/gm)].map(m => m[1]);
  console.log(`✅ Syntax OK`);
  console.log(`   Lessons: ${ords.join(', ')}`);
  console.log(`   Quizzes: ${quizzes_found.join(', ')}`);
} catch(e) {
  console.error('❌ Syntax error:', e.stderr.toString().substring(0, 300));
  process.exit(1);
}
