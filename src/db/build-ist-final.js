#!/usr/bin/env node
/**
 * Génère seed-ist-cm1.js — 4 leçons avec la même qualité que l'Histoire
 * Phase 1 : 3,6,9,10
 */
const fs = require('fs');
const path = require('path');
const tmpl = fs.readFileSync(path.join(__dirname, 'seed-histoire-cm1.js'), 'utf8');

// ── HEADER ─────────────────────────────────────────────────
const ls = tmpl.indexOf('const LECONS_DATA = [');
const qs = tmpl.indexOf('const QUIZ_DATA = {');
const qe = tmpl.indexOf('};', qs);
const gs = tmpl.indexOf('// GÉNÉRATEURS HTML POUR QUIZ');

const out = [];
out.push(tmpl.substring(0, ls)
  .replace('seed-histoire-cm1.js','seed-ist-cm1.js')
  .replace("code: 'HI'","code: 'IST'")
  .replace("Leçons : 1,2,3,4,5,6,7,8,12,16,17,18,19,20","Leçons : 3,6,9,10"));

// ── HELPERS ─────────────────────────────────────────────────
const esc = s => s.replace(/\\/g,'\\\\').replace(/`/g,'\\`');
const Z = s => s.replace(/\n/g,'').replace(/  +/g,' ').trim();
const H = (s) => Z(s);
const EX = (q,r,e) => `{question:"${esc(q)}",reponse:"${esc(r)}",explication:"${esc(e)}"}`;
const QCM = (e,opts,ci,expl) => {
  const c=String.fromCharCode(65+ci);
  return `{enonce:"${esc(e)}",options:[${opts.map((o,i)=>`{lettre:"${String.fromCharCode(65+i)}",texte:"${esc(o)}"}`)}],reponseCorrecte:"${c}",explication:"${esc(expl)}"}`;
};
const QZ = (q,opts,ok) => `{q:"${esc(q)}",opts:[${opts.map(o=>'"'+esc(o)+'"')}],ok:${ok}}`;

// ══════════════════════════════════════════════════════════════
// CONTENU HTML DES LEÇONS — qualité = Histoire
// ══════════════════════════════════════════════════════════════

const L3_HTML = H(`
<h1>🔦 Leçon 3 : La Brouette et la Lampe de Poche</h1>
<div class="bloc-essentiel">
  <p>Cette leçon nous fait découvrir deux objets du quotidien : la <strong>brouette</strong> et la <strong>lampe de poche</strong>. Chacun fonctionne grâce à des principes scientifiques simples.</p>
</div>
<h2>🧺 La Brouette — Un Levier Très Utile</h2>
<h3>🔧 Qu'est-ce qu'une brouette ?</h3>
<p>La brouette est un <mark>outil de transport</mark> composé de plusieurs parties :</p>
<ul>
  <li>Une <strong>benne</strong> pour mettre les charges</li>
  <li>Une <strong>roue</strong> à l'avant pour faciliter le déplacement</li>
  <li>Deux <strong>poignées</strong> pour pousser et diriger</li>
  <li>Un <strong>brancard</strong> qui relie les poignées à la roue</li>
  <li>Un <strong>essieu</strong> qui relie la roue au brancard</li>
  <li>Des <strong>pieds</strong> pour la stabiliser à l'arrêt</li>
</ul>
<h3>💪 Pourquoi la brouette facilite-t-elle le travail ?</h3>
<p>La brouette est un <mark>levier</mark>. Grâce à la roue et aux poignées, on peut déplacer des charges lourdes avec moins d'effort. C'est pourquoi le <strong>jardinier</strong>, le <strong>maçon</strong> ou le <strong>commerçant</strong> l'utilisent souvent.</p>
<h2>🔦 La Lampe de Poche — Un Circuit Électrique Simple</h2>
<h3>💡 Qu'est-ce qu'une lampe de poche ?</h3>
<p>La <strong>lampe de poche</strong> est un <mark>appareil électrique portable</mark> qui produit de la lumière. Elle est composée de :</p>
<ul>
  <li>Une ou plusieurs <strong>ampoules</strong> qui émettent la lumière</li>
  <li>Des <strong>piles (batteries)</strong> qui fournissent l'électricité</li>
  <li>Des <strong>fils conducteurs</strong> qui transportent le courant</li>
  <li>Un <strong>interrupteur</strong> pour allumer ou éteindre</li>
</ul>
<div class="bloc-attention">
  <strong>⚡ À retenir :</strong> L'ampoule émet la lumière. Les piles sont les <mark>sources d'alimentation électrique</mark>. Les fils sont les <mark>conducteurs électriques</mark>. L'interrupteur commande le courant.
</div>
<h2>📝 Résumé</h2>
<ul>
  <li>La <strong>brouette</strong> est un outil-levier composé de 6 parties (benne, roue, poignées, brancard, essieu, pieds).</li>
  <li>Elle permet de déplacer des charges lourdes avec moins d'effort.</li>
  <li>La <strong>lampe de poche</strong> est un appareil électrique portable de 4 parties (ampoule, piles, fils, interrupteur).</li>
</ul>
`);

const L6_HTML = H(`
<h1>💻 Leçon 6 : L'Ordinateur</h1>
<div class="bloc-essentiel">
  <p>L'<strong>ordinateur</strong> est un <mark>outil électronique</mark> qui permet de traiter une grande quantité d'informations. Il sert à communiquer, à enregistrer des fichiers, à regarder des vidéos et à naviguer sur Internet.</p>
</div>
<h2>🖥️ Les Parties d'un Ordinateur</h2>
<h3>📦 L'Unité Centrale</h3>
<p>C'est le <mark>cerveau</mark> de l'ordinateur :</p>
<ul>
  <li>Le <strong>disque dur</strong> stocke les fichiers</li>
  <li>La <strong>mémoire vive</strong> exécute les programmes</li>
  <li>Le <strong>processeur</strong> effectue les calculs</li>
  <li>Le <strong>lecteur</strong> lit les CD/DVD</li>
</ul>
<h3>💾 Les Unités de Stockage</h3>
<p>CD ROM, disque dur, DVD.</p>
<h3>⌨️ Les Périphériques d'Entrée</h3>
<p>Ils <mark>envoient des informations</mark> à l'ordinateur : clavier, souris, microphone, scanner, caméra.</p>
<h3>🖨️ Les Périphériques de Sortie</h3>
<p>Ils <mark>reçoivent des informations</mark> de l'ordinateur : imprimante, écran (moniteur), haut-parleur.</p>
<h3>🌐 Le Modem</h3>
<p>Le <strong>modem</strong> permet la connexion à <mark>Internet</mark>.</p>
<div class="bloc-attention">
  <strong>💡 À retenir :</strong> Les périphériques d'entrée envoient des données à l'ordinateur, les périphériques de sortie reçoivent des données de l'ordinateur.
</div>
<h2>📝 Résumé</h2>
<ul>
  <li><strong>Unité centrale</strong> = cerveau (disque dur, mémoire, processeur)</li>
  <li><strong>Entrée</strong> = clavier, souris, micro, scanner</li>
  <li><strong>Sortie</strong> = imprimante, écran, haut-parleur</li>
  <li><strong>Modem</strong> = connexion Internet</li>
</ul>
`);

const L9_HTML = H(`
<h1>🧪 Leçon 9 : Les États de la Matière</h1>
<div class="bloc-essentiel">
  <p>La matière existe sous <strong>trois états</strong> : <mark>l'état solide</mark>, <mark>l'état liquide</mark> et <mark>l'état gazeux</mark>.</p>
</div>
<h2>💧 L'État Liquide</h2>
<ul>
  <li>Les liquides comme l'eau et l'huile <strong>coulent</strong> : ce sont des fluides.</li>
  <li>Ils <strong>prennent la forme</strong> du récipient qui les contient.</li>
  <li><strong>Exemples :</strong> eau, huile, lait, jus de fruit.</li>
</ul>
<h2>🪨 L'État Solide</h2>
<ul>
  <li>Les solides ont une <strong>forme propre</strong> qui ne change pas.</li>
  <li>Certains <strong>fondent</strong> sous l'effet de la chaleur (fer, or).</li>
  <li>D'autres <strong>ne fondent pas</strong> : ce sont des <mark>corps réfractaires</mark> (sable, pierre).</li>
  <li><strong>Exemples :</strong> pierre, bois, glace, fer.</li>
</ul>
<h2>💨 L'État Gazeux</h2>
<ul>
  <li>Les gaz sont <strong>invisibles</strong>, <strong>compressibles</strong> et <strong>élastiques</strong>.</li>
  <li>Ils n'ont pas de forme propre et occupent tout l'espace disponible.</li>
  <li><strong>Exemples :</strong> air, butane, oxygène, gaz carbonique.</li>
</ul>
<div class="bloc-attention">
  <strong>📌 À retenir :</strong> Les solides et les liquides ont un volume invariable. Les gaz n'ont pas de volume fixe (ils sont compressibles).
</div>
<h2>📝 Résumé</h2>
<ul>
  <li><strong>Liquide :</strong> prend la forme du récipient, coule.</li>
  <li><strong>Solide :</strong> forme propre, certains fondent, d'autres non.</li>
  <li><strong>Gaz :</strong> invisible, compressible, sans forme propre.</li>
</ul>
`);

const L10_HTML = H(`
<h1>🔥 Leçon 10 : Les Combustions Vives</h1>
<div class="bloc-essentiel">
  <p>Une <strong>combustion</strong> se produit quand un corps <mark>brûle</mark>. Une <strong>combustion vive</strong> dégage de la chaleur, de la lumière, du gaz carbonique et de la vapeur d'eau.</p>
</div>
<h2>🧱 Les Combustibles</h2>
<p>Les corps qui peuvent brûler sont des <strong>combustibles</strong>. Il en existe trois types :</p>
<ul>
  <li><strong>Liquides :</strong> pétrole, essence, alcool</li>
  <li><strong>Solides :</strong> bois, bougie, charbon</li>
  <li><strong>Gazeux :</strong> butane, propane, gaz naturel</li>
</ul>
<h2>⚡ Les Conditions</h2>
<p>Pour qu'une combustion vive se produise, il faut :</p>
<ol>
  <li><mark>Chauffer le combustible</mark> pour qu'il dégage des gaz</li>
  <li>Le mettre au <mark>contact de l'oxygène</mark> de l'air</li>
</ol>
<div class="bloc-attention">
  <strong>🔥 Exemple :</strong> Quand on allume une bougie, la flamme dégage chaleur et lumière. La cire fond et brûle grâce à l'oxygène de l'air.
</div>
<h2>📝 Résumé</h2>
<ul>
  <li>Une <strong>combustion vive</strong> produit : chaleur + lumière + CO2 + vapeur d'eau.</li>
  <li>Il existe 3 types de combustibles : solides, liquides, gazeux.</li>
  <li>Pour brûler : il faut <strong>chauffer</strong> + <strong>oxygène</strong>.</li>
</ul>
`);

// ══════════════════════════════════════════════════════════════
// LEÇON 3
// ══════════════════════════════════════════════════════════════

const L3_LEÇON = `  {ordre:3,titre:"La Brouette / La Lampe de Poche",objectif:"Comprendre les principes de la brouette (levier) et de la lampe de poche (circuit électrique simple)",promptSupplement:"Utilise des exemples concrets de la vie quotidienne. Vocabulaire adapté aux élèves de CM1.",contenuHTML:\`${L3_HTML}\`,exercices:[
    ${EX("Qu'est-ce qu'une brouette et à quoi sert-elle ?","La brouette est un outil-levier utilisé pour déplacer des objets lourds. Les jardiniers et les maçons l'utilisent beaucoup.","La brouette réduit l'effort grâce au principe du levier.")},
    ${EX("Cite les 6 parties principales de la brouette.","Les deux poignées, le brancard, les pieds, l'essieu, la benne et la roue.","Chaque partie joue un rôle important dans le transport des charges.")},
    ${EX("Qu'est-ce qu'une lampe de poche ?","C'est un appareil électrique portable qui produit de la lumière quand on l'allume.","On s'en sert pour éclairer dans l'obscurité.")},
    ${EX("Cite les 4 parties principales de la lampe de poche.","L'ampoule, les piles, les fils et l'interrupteur.","Chaque partie est essentielle au fonctionnement du circuit électrique.")},
    ${EX("Quel est le rôle de l'ampoule dans une lampe de poche ?","L'ampoule émet la lumière quand le courant électrique passe à travers elle.","C'est elle qui transforme l'électricité en lumière visible.")},
    ${EX("Quel est le rôle des piles dans une lampe de poche ?","Les piles fournissent l'électricité nécessaire au fonctionnement de la lampe.","On les appelle les sources d'alimentation électrique.")},
    ${EX("Quel est le rôle des fils dans une lampe de poche ?","Les fils transportent le courant électrique de la pile jusqu'à l'ampoule.","Ce sont des conducteurs électriques.")},
    ${EX("Quel est le rôle de l'interrupteur dans une lampe de poche ?","L'interrupteur permet d'allumer ou d'éteindre la lumière en fermant ou ouvrant le circuit.","Sans interrupteur, on ne pourrait pas commander la lampe.")},
    ${EX("Pourquoi dit-on que la brouette est un levier ?","Parce qu'elle permet de soulever et déplacer des charges lourdes avec moins de force.","Le principe du levier est aussi utilisé par la pince ou le pied-de-biche.")},
    ${EX("Qui utilise la brouette dans la vie quotidienne ?","Le jardinier, le maçon, le commerçant ou le fermier l'utilisent","Tous ceux qui ont besoin de transporter des objets lourds.")},
  ],qcm:[
    ${QCM("La brouette est un outil qui permet...",["d'écrire sur du papier","de déplacer des objets lourds","de mesurer la température","de couper du bois"],1,"La brouette sert à transporter des charges lourdes.")},
    ${QCM("La brouette est composée de combien de parties principales ?",["4 parties","5 parties","6 parties","7 parties"],2,"La brouette a 6 parties : poignées, brancard, pieds, essieu, benne et roue.")},
    ${QCM("La lampe de poche est un appareil...",["mécanique qui produit du son","électrique qui produit de la lumière","qui sert à chauffer l'eau","qui fonctionne au gaz"],1,"C'est un appareil électrique portable qui éclaire.")},
    ${QCM("Dans une lampe de poche, l'ampoule sert à...",["stocker l'électricité","émettre la lumière","transporter le courant","ouvrir le circuit"],1,"L'ampoule transforme l'électricité en lumière.")},
    ${QCM("Les piles d'une lampe de poche sont...",["des conducteurs","des interrupteurs","des sources d'alimentation","des ampoules"],2,"Les piles fournissent l'énergie électrique.")},
    ${QCM("Les fils électriques dans la lampe servent à...",["produire de la lumière","transporter le courant électrique","stocker l'énergie","nettoyer la lampe"],1,"Les fils relient la pile à l'ampoule.")},
    ${QCM("L'interrupteur de la lampe sert à...",["produire de la lumière","changer la pile","allumer ou éteindre la lumière","nettoyer la lampe"],2,"L'interrupteur commande le passage du courant.")},
    ${QCM("Qui utilise la brouette dans son travail ?",["le cuisinier","le jardinier et le maçon","le musicien","le tailleur"],1,"Le jardinier et le maçon transportent des charges.")},
    ${QCM("La brouette fonctionne grâce au principe du...",["moteur","levier","générateur","transformateur"],1,"La brouette est un levier qui facilite le travail.")},
    ${QCM("Sans les piles, la lampe de poche...",["fonctionne normalement","éclaire moins fort","ne peut pas fonctionner","éclaire plus fort"],2,"Sans piles, il n'y a pas de courant électrique.")},
  ]}`;

// ══════════════════════════════════════════════════════════════
// LEÇON 6
// ══════════════════════════════════════════════════════════════

const L6_LEÇON = `  {ordre:6,titre:"L'Ordinateur",objectif:"Connaître les parties de l'ordinateur et leurs fonctions",promptSupplement:"Utilise des exemples concrets d'utilisation. Vocabulaire adapté aux CM1.",contenuHTML:\`${L6_HTML}\`,exercices:[
    ${EX("Qu'est-ce qu'un ordinateur et à quoi sert-il ?","L'ordinateur est un outil électronique qui traite des informations. Il sert à communiquer, écrire, regarder des vidéos et naviguer sur Internet.","C'est une machine programmable très utile dans la vie quotidienne.")},
    ${EX("Que contient l'unité centrale de l'ordinateur ?","L'unité centrale contient le disque dur, la mémoire vive, le processeur et le lecteur.","Ces éléments sont essentiels au fonctionnement de l'ordinateur.")},
    ${EX("Cite trois unités de stockage.","Le CD ROM, le disque dur et le DVD sont des unités de stockage.","Ils permettent de conserver les fichiers et les programmes.")},
    ${EX("Qu'est-ce qu'un périphérique d'entrée ? Donne trois exemples.","Un périphérique d'entrée envoie des informations à l'ordinateur. Exemples : le clavier, la souris et le microphone.","Ils permettent de donner des instructions à la machine.")},
    ${EX("Qu'est-ce qu'un périphérique de sortie ? Donne trois exemples.","Un périphérique de sortie reçoit des informations de l'ordinateur. Exemples : l'imprimante, l'écran et le haut-parleur.","Ils affichent ou diffusent les résultats.")},
    ${EX("À quoi sert le modem de l'ordinateur ?","Le modem permet à l'ordinateur de se connecter à Internet.","Sans modem, on ne peut pas aller sur le web.")},
    ${EX("Quel est le rôle du processeur dans l'ordinateur ?","Le processeur effectue les calculs et exécute les programmes.","C'est le moteur qui fait tourner toutes les applications.")},
    ${EX("Quel est le rôle du disque dur dans l'ordinateur ?","Le disque dur stocke tous les fichiers et les programmes.","C'est la mémoire permanente de l'ordinateur.")},
    ${EX("Quel périphérique permet de transformer un document papier en fichier numérique ?","C'est le scanner qui numérise les documents papier.","Il crée une copie numérique du document original.")},
    ${EX("Cite trois fonctions principales de l'ordinateur.","L'ordinateur permet de communiquer, d'enregistrer des fichiers et de visionner des vidéos.","Ce sont les usages les plus courants.")},
  ],qcm:[
    ${QCM("L'ordinateur est un outil...",["mécanique qui fabrique des objets","électronique qui traite des informations","manuel qui répare les voitures","chimique qui mélange des produits"],1,"C'est un appareil électronique programmable.")},
    ${QCM("Le cerveau de l'ordinateur s'appelle...",["l'écran","le clavier","l'unité centrale","la souris"],2,"L'unité centrale commande tous les autres éléments.")},
    ${QCM("Le clavier est un périphérique...",["de sortie","d'entrée","de stockage","de connexion"],1,"Le clavier permet d'écrire et d'envoyer des instructions.")},
    ${QCM("L'imprimante est un périphérique...",["d'entrée","de sortie","de stockage","central"],1,"L'imprimante reçoit les données pour imprimer sur papier.")},
    ${QCM("Le modem permet à l'ordinateur de...",["imprimer des documents","se connecter à Internet","écouter de la musique","scanner des images"],1,"Le modem est la passerelle vers le réseau Internet.")},
    ${QCM("Le processeur de l'ordinateur...",["stocke les fichiers","effectue les calculs","affiche les images","imprime les documents"],1,"Le processeur exécute tous les programmes.")},
    ${QCM("Le disque dur de l'ordinateur sert à...",["afficher les images","stocker les fichiers et programmes","imprimer les documents","connecter à Internet"],1,"Le disque dur conserve les données en mémoire.")},
    ${QCM("Le microphone est un périphérique...",["de sortie","d'entrée","de stockage","d'affichage"],1,"Le microphone envoie le son à l'ordinateur.")},
    ${QCM("L'écran de l'ordinateur est aussi appelé...",["clavier","moniteur","processeur","modem"],1,"Moniteur est le nom technique de l'écran.")},
    ${QCM("Quel périphérique permet de numériser un document papier ?",["L'imprimante","Le scanner","La souris","Le haut-parleur"],1,"Le scanner transforme le papier en fichier numérique.")},
  ]}`;

// ══════════════════════════════════════════════════════════════
// LEÇON 9
// ══════════════════════════════════════════════════════════════

const L9_LEÇON = `  {ordre:9,titre:"Les États de la Matière",objectif:"Connaître les trois états de la matière (solide, liquide, gazeux) et leurs propriétés",promptSupplement:"Utilise des exemples concrets de la vie quotidienne. Vocabulaire adapté aux CM1.",contenuHTML:\`${L9_HTML}\`,exercices:[
    ${EX("Quels sont les trois états de la matière ?","Les trois états sont : l'état solide, l'état liquide et l'état gazeux.","La matière peut changer d'état selon la température.")},
    ${EX("Pourquoi dit-on que les liquides sont des fluides ?","Parce que les liquides coulent et s'écoulent facilement.","Un fluide est une substance qui s'écoule librement.")},
    ${EX("Comment s'appelle un solide qui ne fond pas, même quand on le chauffe ?","On l'appelle un corps réfractaire.","Le sable et la pierre sont des corps réfractaires.")},
    ${EX("Cite deux exemples de gaz que tu connais.","L'air et le butane sont des gaz.","On peut aussi citer l'oxygène et le gaz carbonique.")},
    ${EX("Est-ce que les solides et les liquides ont un volume fixe ?","Oui, les solides et les liquides ont un volume qui ne change jamais.","Seuls les gaz peuvent changer de volume.")},
    ${EX("Pourquoi dit-on que les gaz sont compressibles ?","Parce qu'on peut réduire leur volume en appuyant dessus.","L'air dans un ballon se comprime quand on appuie.")},
    ${EX("Donne un exemple de solide qui fond quand on le chauffe.","Le fer, l'or ou la glace fondent sous l'effet de la chaleur.","La glace fond à 0°C et le fer à une température bien plus élevée.")},
    ${EX("Qu'est-ce qu'un fluide ? Donne un exemple.","Un fluide est une substance qui coule. L'eau et l'huile sont des fluides.","Tous les liquides sont des fluides.")},
    ${EX("Cite trois propriétés importantes des gaz.","Les gaz sont invisibles, compressibles et élastiques.","Ces propriétés les rendent très différents des solides et liquides.")},
    ${EX("Donne un exemple de liquide autre que l'eau.","L'huile, le lait ou le jus de fruit sont des liquides.","Tous ces liquides prennent la forme de leur récipient.")},
  ],qcm:[
    ${QCM("Combien d'états de la matière existe-t-il dans la nature ?",["2 états","3 états","4 états","5 états"],1,"Il existe trois états : solide, liquide et gazeux.")},
    ${QCM("Quand on verse un liquide dans un verre, le liquide...",["garde sa forme carrée","prend la forme du verre","devient solide","disparaît complètement"],1,"Le liquide s'adapte à la forme du récipient.")},
    ${QCM("Un corps réfractaire est un solide qui...",["fond facilement au soleil","ne fond pas même sous la chaleur","se transforme en gaz","se transforme en liquide"],1,"Il résiste à la chaleur sans fondre.")},
    ${QCM("Les gaz comme l'air sont...",["visibles à l'œil nu","invisibles","toujours liquides","toujours solides"],1,"Les gaz sont invisibles, on ne les voit pas.")},
    ${QCM("Dans quel état se trouve l'eau quand elle est liquide ?",["État solide","État gazeux","État liquide","État plasma"],2,"L'eau à température ambiante est liquide.")},
    ${QCM("L'air que nous respirons est un exemple d'état...",["liquide","solide","gazeux","plasma"],2,"L'air est un mélange de gaz (oxygène, azote...).")},
    ${QCM("Le volume d'un gaz est...",["toujours fixe et invariable","variable (peut changer)","nul (n'existe pas)","toujours le même"],1,"Les gaz occupent tout l'espace disponible.")},
    ${QCM("Quand on chauffe du fer, il...",["ne fond pas du tout","finit par fondre","se transforme en gaz immédiatement","devient liquide à 0°C"],1,"Le fer fond à très haute température.")},
    ${QCM("Le sable de la plage est un exemple de solide...",["réfractaire (ne fond pas)","fusible (fond facilement)","liquide","gazeux"],0,"Le sable résiste à la chaleur, c'est un réfractaire.")},
    ${QCM("Qu'est-ce qu'un fluide ?",["Un gaz uniquement","Un solide uniquement","Une substance qui coule","Un corps qui ne fond pas"],2,"L'eau, l'huile sont des fluides qui s'écoulent.")},
  ]}`;

// ══════════════════════════════════════════════════════════════
// LEÇON 10
// ══════════════════════════════════════════════════════════════

const L10_LEÇON = `  {ordre:10,titre:"Les Combustions Vives",objectif:"Comprendre ce qu'est une combustion vive, ses caractéristiques et les conditions nécessaires",promptSupplement:"Utilise des exemples concrets comme la cuisson au feu de bois. Vocabulaire adapté aux CM1.",contenuHTML:\`${L10_HTML}\`,exercices:[
    ${EX("Qu'est-ce qu'une combustion vive ?","Une combustion vive se produit quand un corps brûle en dégageant de la chaleur et de la lumière visible.","La flamme d'une bougie est un exemple typique de combustion vive.")},
    ${EX("Qu'est-ce qu'un combustible ?","Un combustible est un corps qui peut brûler et produire de l'énergie.","Le bois, l'essence et le butane sont des combustibles.")},
    ${EX("Cite les trois types de combustibles avec un exemple pour chacun.","Les combustibles solides (bois), liquides (essence) et gazeux (butane).","Chaque type de combustible a des usages différents dans la vie.")},
    ${EX("Quelles sont les deux conditions nécessaires pour qu'une combustion vive se produise ?","Il faut chauffer le combustible et le mettre au contact de l'oxygène de l'air.","Ces deux conditions sont absolument nécessaires.")},
    ${EX("Donne un exemple de combustible liquide.","Le pétrole, l'essence ou l'alcool sont des combustibles liquides.","Ils brûlent facilement et sont utilisés pour les véhicules.")},
    ${EX("Donne un exemple de combustible solide.","Le bois, la bougie ou le charbon sont des combustibles solides.","On les utilise souvent pour le chauffage et la cuisson.")},
    ${EX("Donne un exemple de combustible gazeux.","Le butane, le propane ou le gaz naturel sont des combustibles gazeux.","On les utilise pour la cuisson des aliments.")},
    ${EX("Que produit une combustion vive ?","Elle produit de la chaleur, de la lumière, du gaz carbonique et de la vapeur d'eau.","Ce sont les quatre produits d'une combustion vive.")},
    ${EX("Pourquoi l'oxygène de l'air est-il nécessaire pour qu'une combustion se produise ?","Le combustible a besoin de l'oxygène de l'air pour pouvoir brûler.","Sans oxygène, le feu s'éteint.")},
    ${EX("La flamme d'une bougie est-elle une combustion vive ? Pourquoi ?","Oui, une flamme de bougie dégage de la chaleur et de la lumière visible.","C'est le meilleur exemple de combustion vive.")},
  ],qcm:[
    ${QCM("Une combustion vive produit...",["du froid et de l'obscurité","de la chaleur et de la lumière","du son et du mouvement","de l'eau et du vent"],1,"La combustion vive dégage chaleur et lumière visibles.")},
    ${QCM("Un combustible est un corps qui...",["ne peut pas brûler","peut brûler et produire de l'énergie","n'existe que sous forme liquide","n'existe que sous forme gazeuse"],1,"Un combustible est un corps qui peut brûler.")},
    ${QCM("Le bois que l'on met dans le feu est un combustible...",["liquide","solide","gazeux","plastique"],1,"Le bois est un combustible solide couramment utilisé.")},
    ${QCM("L'essence utilisée par les voitures est un combustible...",["solide","liquide","gazeux","minéral"],1,"L'essence est un combustible liquide.")},
    ${QCM("Le butane utilisé pour la cuisson est un combustible...",["solide","liquide","gazeux","métallique"],2,"Le butane est un combustible gazeux.")},
    ${QCM("Pour qu'une combustion se produise, le combustible doit être...",["mouillé et froid","chauffé et au contact de l'oxygène","caché dans l'obscurité","enterré dans le sable"],1,"Il faut chauffer le combustible en présence d'oxygène.")},
    ${QCM("Le combustible a besoin de quoi pour brûler ?",["d'eau froide","d'oxygène (présent dans l'air)","de sable","de vent fort"],1,"L'oxygène de l'air est indispensable à la combustion.")},
    ${QCM("Si on enlève l'oxygène, une combustion...",["brûle plus fort","s'éteint et ne peut pas continuer","refroidit et ralentit","devient bleue"],1,"Sans oxygène, le feu s'éteint.")},
    ${QCM("Le charbon de bois est un combustible...",["liquide","solide","gazeux","végétal"],1,"Le charbon est un combustible solide.")},
    ${QCM("Si on ne chauffe pas assez le combustible, la combustion...",["se produit quand même","ne peut pas se produire","accélère","refroidit"],1,"La chaleur est nécessaire pour enflammer le combustible.")},
  ]}`;

// ══════════════════════════════════════════════════════════════
// ASSEMBLAGE
// ══════════════════════════════════════════════════════════════

out.push('const LECONS_DATA = [\n');
out.push(L3_LEÇON);
out.push(',\n');
out.push(L6_LEÇON);
out.push(',\n');
out.push(L9_LEÇON);
out.push(',\n');
out.push(L10_LEÇON);
out.push('\n];\n\n');

// ── QUIZ DATA ───────────────────────────────────────────────
out.push('const QUIZ_DATA = {\n');

out.push(`  3: [
    ${QZ("Quel outil utilise-t-on pour déplacer des charges lourdes ?",["La pelle","La brouette","Le seau","Le marteau"],1)},
    ${QZ("De combien de parties principales est composée la brouette ?",["4 parties","5 parties","6 parties","7 parties"],2)},
    ${QZ("Quelle partie de la lampe de poche produit la lumière ?",["La pile","Le fil","L'ampoule","L'interrupteur"],2)},
    ${QZ("À quoi sert l'interrupteur d'une lampe de poche ?",["À produire la lumière","À stocker l'énergie","À allumer ou éteindre","À protéger la lampe"],2)},
    ${QZ("Les piles d'une lampe de poche sont des...",["ampoules","sources d'alimentation","interrupteurs","conducteurs"],1)},
    ${QZ("Qui utilise la brouette dans son travail ?",["Le médecin","Le jardinier","Le professeur","Le musicien"],1)},
  ],
  6: [
    ${QZ("L'ordinateur est un outil...",["Mécanique","Électronique","Manuel","Chimique"],1)},
    ${QZ("Le cerveau de l'ordinateur s'appelle...",["L'écran","L'unité centrale","La souris","Le clavier"],1)},
    ${QZ("Le clavier est un périphérique...",["De sortie","D'entrée","De stockage","D'affichage"],1)},
    ${QZ("L'imprimante est un périphérique...",["D'entrée","De sortie","Central","De réseau"],1)},
    ${QZ("Le modem permet de se connecter à...",["L'imprimante","Internet","L'écran","Le clavier"],1)},
    ${QZ("Le disque dur sert à...",["Stocker des fichiers","Imprimer des documents","Afficher des images","Écouter du son"],0)},
  ],
  9: [
    ${QZ("Combien d'états de la matière existe-t-il ?",["2","3","4","5"],1)},
    ${QZ("Quand on verse un liquide dans un verre, le liquide...",["garde sa forme","prend la forme du verre","devient solide","disparaît"],1)},
    ${QZ("Les gaz comme l'air sont...",["Visibles","Invisibles","Liquides","Solides"],1)},
    ${QZ("À quel état se trouve l'eau quand elle est liquide ?",["Solide","Gaz","Liquide","Vapeur"],2)},
    ${QZ("Le volume d'un gaz est...",["Fixe et invariable","Variable (peut changer)","Nul","Très grand"],1)},
    ${QZ("Un corps réfractaire est un solide qui...",["fond facilement","ne fond pas","coule","brûle"],1)},
  ],
  10: [
    ${QZ("Une combustion vive produit...",["Du froid","De la chaleur et de la lumière","Du son","De l'eau"],1)},
    ${QZ("Le bois est un combustible...",["Liquide","Solide","Gazeux","Plastique"],1)},
    ${QZ("L'essence utilisée par les voitures est un combustible...",["Solide","Liquide","Gazeux","Rocher"],1)},
    ${QZ("Pour brûler, le combustible a besoin de...",["D'eau","D'oxygène présent dans l'air","De sable","De froid"],1)},
    ${QZ("Sans oxygène, une combustion...",["brûle plus fort","s'éteint et ne peut pas continuer","produit du froid","devient plus rapide"],1)},
    ${QZ("Le butane est un gaz...",["Liquide","Solide","Combustible","Naturel"],2)},
  ],
};\n\n`);

// ── SCRIPT (générateurs + seed function) ────────────────────
const script = tmpl.substring(gs)
  .replace("code: 'HI'","code: 'IST'")
  .replace("seed-histoire-cm1.js","seed-ist-cm1.js")
  .replace("Matière Histoire (code: HI)","Matière IST (code: IST)")
  .replace('"Matière Histoire (code: HI)"','"Matière IST (code: IST)"')
  .replace("Histoire","IST");

out.push(script);

// ── ÉCRITURE ────────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, 'seed-ist-cm1.js'), out.join(''), 'utf8');

const { execSync } = require('child_process');
try {
  execSync('node --check ' + path.join(__dirname, 'seed-ist-cm1.js'), { stdio: 'pipe' });
  const c = fs.readFileSync(path.join(__dirname, 'seed-ist-cm1.js'), 'utf8');
  const ords = [...c.matchAll(/ordre:(\d+)/g)].map(m=>m[1]);
  console.log('✅ seed-ist-cm1.js généré avec succès !');
  console.log(`   Leçons : ${ords.join(', ')}`);
  console.log(`   Taille : ${(c.length / 1024).toFixed(1)} Ko`);
} catch(e) {
  console.error('❌ Erreur de syntaxe :', e.stderr.toString().substring(0, 300));
}
