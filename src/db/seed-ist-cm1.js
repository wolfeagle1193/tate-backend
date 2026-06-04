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
// Intègre les 14 leçons d'Histoire CM1 dans la plateforme Taté
// Leçons : 3,6,9,10
//
// Usage : node src/db/seed-histoire-cm1.js
// ============================================================

// ─────────────────────────────────────────────────────────────
// DONNÉES DES LEÇONS
// ─────────────────────────────────────────────────────────────
const LECONS_DATA = [
  {ordre:3,titre:"La Brouette / La Lampe de Poche",objectif:"Comprendre les principes de la brouette (levier) et de la lampe de poche (circuit électrique simple)",promptSupplement:"Utilise des exemples concrets de la vie quotidienne. Vocabulaire adapté aux élèves de CM1.",contenuHTML:`<h1>🔦 Leçon 3 : La Brouette et la Lampe de Poche</h1><div class="bloc-essentiel"> <p>Cette leçon nous fait découvrir deux objets du quotidien : la <strong>brouette</strong> et la <strong>lampe de poche</strong>. Chacun fonctionne grâce à des principes scientifiques simples.</p></div><h2>🧺 La Brouette — Un Levier Très Utile</h2><h3>🔧 Qu'est-ce qu'une brouette ?</h3><p>La brouette est un <mark>outil de transport</mark> composé de plusieurs parties :</p><ul> <li>Une <strong>benne</strong> pour mettre les charges</li> <li>Une <strong>roue</strong> à l'avant pour faciliter le déplacement</li> <li>Deux <strong>poignées</strong> pour pousser et diriger</li> <li>Un <strong>brancard</strong> qui relie les poignées à la roue</li> <li>Un <strong>essieu</strong> qui relie la roue au brancard</li> <li>Des <strong>pieds</strong> pour la stabiliser à l'arrêt</li></ul><h3>💪 Pourquoi la brouette facilite-t-elle le travail ?</h3><p>La brouette est un <mark>levier</mark>. Grâce à la roue et aux poignées, on peut déplacer des charges lourdes avec moins d'effort. C'est pourquoi le <strong>jardinier</strong>, le <strong>maçon</strong> ou le <strong>commerçant</strong> l'utilisent souvent.</p><h2>🔦 La Lampe de Poche — Un Circuit Électrique Simple</h2><h3>💡 Qu'est-ce qu'une lampe de poche ?</h3><p>La <strong>lampe de poche</strong> est un <mark>appareil électrique portable</mark> qui produit de la lumière. Elle est composée de :</p><ul> <li>Une ou plusieurs <strong>ampoules</strong> qui émettent la lumière</li> <li>Des <strong>piles (batteries)</strong> qui fournissent l'électricité</li> <li>Des <strong>fils conducteurs</strong> qui transportent le courant</li> <li>Un <strong>interrupteur</strong> pour allumer ou éteindre</li></ul><div class="bloc-attention"> <strong>⚡ À retenir :</strong> L'ampoule émet la lumière. Les piles sont les <mark>sources d'alimentation électrique</mark>. Les fils sont les <mark>conducteurs électriques</mark>. L'interrupteur commande le courant.</div><h2>📝 Résumé</h2><ul> <li>La <strong>brouette</strong> est un outil-levier composé de 6 parties (benne, roue, poignées, brancard, essieu, pieds).</li> <li>Elle permet de déplacer des charges lourdes avec moins d'effort.</li> <li>La <strong>lampe de poche</strong> est un appareil électrique portable de 4 parties (ampoule, piles, fils, interrupteur).</li></ul>`,exercices:[
    {question:"Qu'est-ce qu'une brouette et à quoi sert-elle ?",reponse:"La brouette est un outil-levier utilisé pour déplacer des objets lourds. Les jardiniers et les maçons l'utilisent beaucoup.",explication:"La brouette réduit l'effort grâce au principe du levier."},
    {question:"Cite les 6 parties principales de la brouette.",reponse:"Les deux poignées, le brancard, les pieds, l'essieu, la benne et la roue.",explication:"Chaque partie joue un rôle important dans le transport des charges."},
    {question:"Qu'est-ce qu'une lampe de poche ?",reponse:"C'est un appareil électrique portable qui produit de la lumière quand on l'allume.",explication:"On s'en sert pour éclairer dans l'obscurité."},
    {question:"Cite les 4 parties principales de la lampe de poche.",reponse:"L'ampoule, les piles, les fils et l'interrupteur.",explication:"Chaque partie est essentielle au fonctionnement du circuit électrique."},
    {question:"Quel est le rôle de l'ampoule dans une lampe de poche ?",reponse:"L'ampoule émet la lumière quand le courant électrique passe à travers elle.",explication:"C'est elle qui transforme l'électricité en lumière visible."},
    {question:"Quel est le rôle des piles dans une lampe de poche ?",reponse:"Les piles fournissent l'électricité nécessaire au fonctionnement de la lampe.",explication:"On les appelle les sources d'alimentation électrique."},
    {question:"Quel est le rôle des fils dans une lampe de poche ?",reponse:"Les fils transportent le courant électrique de la pile jusqu'à l'ampoule.",explication:"Ce sont des conducteurs électriques."},
    {question:"Quel est le rôle de l'interrupteur dans une lampe de poche ?",reponse:"L'interrupteur permet d'allumer ou d'éteindre la lumière en fermant ou ouvrant le circuit.",explication:"Sans interrupteur, on ne pourrait pas commander la lampe."},
    {question:"Pourquoi dit-on que la brouette est un levier ?",reponse:"Parce qu'elle permet de soulever et déplacer des charges lourdes avec moins de force.",explication:"Le principe du levier est aussi utilisé par la pince ou le pied-de-biche."},
    {question:"Qui utilise la brouette dans la vie quotidienne ?",reponse:"Le jardinier, le maçon, le commerçant ou le fermier l'utilisent",explication:"Tous ceux qui ont besoin de transporter des objets lourds."},
  ],qcm:[
    {enonce:"La brouette est un outil qui permet...",options:[{lettre:"A",texte:"d'écrire sur du papier"},{lettre:"B",texte:"de déplacer des objets lourds"},{lettre:"C",texte:"de mesurer la température"},{lettre:"D",texte:"de couper du bois"}],reponseCorrecte:"B",explication:"La brouette sert à transporter des charges lourdes."},
    {enonce:"La brouette est composée de combien de parties principales ?",options:[{lettre:"A",texte:"4 parties"},{lettre:"B",texte:"5 parties"},{lettre:"C",texte:"6 parties"},{lettre:"D",texte:"7 parties"}],reponseCorrecte:"C",explication:"La brouette a 6 parties : poignées, brancard, pieds, essieu, benne et roue."},
    {enonce:"La lampe de poche est un appareil...",options:[{lettre:"A",texte:"mécanique qui produit du son"},{lettre:"B",texte:"électrique qui produit de la lumière"},{lettre:"C",texte:"qui sert à chauffer l'eau"},{lettre:"D",texte:"qui fonctionne au gaz"}],reponseCorrecte:"B",explication:"C'est un appareil électrique portable qui éclaire."},
    {enonce:"Dans une lampe de poche, l'ampoule sert à...",options:[{lettre:"A",texte:"stocker l'électricité"},{lettre:"B",texte:"émettre la lumière"},{lettre:"C",texte:"transporter le courant"},{lettre:"D",texte:"ouvrir le circuit"}],reponseCorrecte:"B",explication:"L'ampoule transforme l'électricité en lumière."},
    {enonce:"Les piles d'une lampe de poche sont...",options:[{lettre:"A",texte:"des conducteurs"},{lettre:"B",texte:"des interrupteurs"},{lettre:"C",texte:"des sources d'alimentation"},{lettre:"D",texte:"des ampoules"}],reponseCorrecte:"C",explication:"Les piles fournissent l'énergie électrique."},
    {enonce:"Les fils électriques dans la lampe servent à...",options:[{lettre:"A",texte:"produire de la lumière"},{lettre:"B",texte:"transporter le courant électrique"},{lettre:"C",texte:"stocker l'énergie"},{lettre:"D",texte:"nettoyer la lampe"}],reponseCorrecte:"B",explication:"Les fils relient la pile à l'ampoule."},
    {enonce:"L'interrupteur de la lampe sert à...",options:[{lettre:"A",texte:"produire de la lumière"},{lettre:"B",texte:"changer la pile"},{lettre:"C",texte:"allumer ou éteindre la lumière"},{lettre:"D",texte:"nettoyer la lampe"}],reponseCorrecte:"C",explication:"L'interrupteur commande le passage du courant."},
    {enonce:"Qui utilise la brouette dans son travail ?",options:[{lettre:"A",texte:"le cuisinier"},{lettre:"B",texte:"le jardinier et le maçon"},{lettre:"C",texte:"le musicien"},{lettre:"D",texte:"le tailleur"}],reponseCorrecte:"B",explication:"Le jardinier et le maçon transportent des charges."},
    {enonce:"La brouette fonctionne grâce au principe du...",options:[{lettre:"A",texte:"moteur"},{lettre:"B",texte:"levier"},{lettre:"C",texte:"générateur"},{lettre:"D",texte:"transformateur"}],reponseCorrecte:"B",explication:"La brouette est un levier qui facilite le travail."},
    {enonce:"Sans les piles, la lampe de poche...",options:[{lettre:"A",texte:"fonctionne normalement"},{lettre:"B",texte:"éclaire moins fort"},{lettre:"C",texte:"ne peut pas fonctionner"},{lettre:"D",texte:"éclaire plus fort"}],reponseCorrecte:"C",explication:"Sans piles, il n'y a pas de courant électrique."},
  ]},
  {ordre:6,titre:"L'Ordinateur",objectif:"Connaître les parties de l'ordinateur et leurs fonctions",promptSupplement:"Utilise des exemples concrets d'utilisation. Vocabulaire adapté aux CM1.",contenuHTML:`<h1>💻 Leçon 6 : L'Ordinateur</h1><div class="bloc-essentiel"> <p>L'<strong>ordinateur</strong> est un <mark>outil électronique</mark> qui permet de traiter une grande quantité d'informations. Il sert à communiquer, à enregistrer des fichiers, à regarder des vidéos et à naviguer sur Internet.</p></div><h2>🖥️ Les Parties d'un Ordinateur</h2><h3>📦 L'Unité Centrale</h3><p>C'est le <mark>cerveau</mark> de l'ordinateur :</p><ul> <li>Le <strong>disque dur</strong> stocke les fichiers</li> <li>La <strong>mémoire vive</strong> exécute les programmes</li> <li>Le <strong>processeur</strong> effectue les calculs</li> <li>Le <strong>lecteur</strong> lit les CD/DVD</li></ul><h3>💾 Les Unités de Stockage</h3><p>CD ROM, disque dur, DVD.</p><h3>⌨️ Les Périphériques d'Entrée</h3><p>Ils <mark>envoient des informations</mark> à l'ordinateur : clavier, souris, microphone, scanner, caméra.</p><h3>🖨️ Les Périphériques de Sortie</h3><p>Ils <mark>reçoivent des informations</mark> de l'ordinateur : imprimante, écran (moniteur), haut-parleur.</p><h3>🌐 Le Modem</h3><p>Le <strong>modem</strong> permet la connexion à <mark>Internet</mark>.</p><div class="bloc-attention"> <strong>💡 À retenir :</strong> Les périphériques d'entrée envoient des données à l'ordinateur, les périphériques de sortie reçoivent des données de l'ordinateur.</div><h2>📝 Résumé</h2><ul> <li><strong>Unité centrale</strong> = cerveau (disque dur, mémoire, processeur)</li> <li><strong>Entrée</strong> = clavier, souris, micro, scanner</li> <li><strong>Sortie</strong> = imprimante, écran, haut-parleur</li> <li><strong>Modem</strong> = connexion Internet</li></ul>`,exercices:[
    {question:"Qu'est-ce qu'un ordinateur et à quoi sert-il ?",reponse:"L'ordinateur est un outil électronique qui traite des informations. Il sert à communiquer, écrire, regarder des vidéos et naviguer sur Internet.",explication:"C'est une machine programmable très utile dans la vie quotidienne."},
    {question:"Que contient l'unité centrale de l'ordinateur ?",reponse:"L'unité centrale contient le disque dur, la mémoire vive, le processeur et le lecteur.",explication:"Ces éléments sont essentiels au fonctionnement de l'ordinateur."},
    {question:"Cite trois unités de stockage.",reponse:"Le CD ROM, le disque dur et le DVD sont des unités de stockage.",explication:"Ils permettent de conserver les fichiers et les programmes."},
    {question:"Qu'est-ce qu'un périphérique d'entrée ? Donne trois exemples.",reponse:"Un périphérique d'entrée envoie des informations à l'ordinateur. Exemples : le clavier, la souris et le microphone.",explication:"Ils permettent de donner des instructions à la machine."},
    {question:"Qu'est-ce qu'un périphérique de sortie ? Donne trois exemples.",reponse:"Un périphérique de sortie reçoit des informations de l'ordinateur. Exemples : l'imprimante, l'écran et le haut-parleur.",explication:"Ils affichent ou diffusent les résultats."},
    {question:"À quoi sert le modem de l'ordinateur ?",reponse:"Le modem permet à l'ordinateur de se connecter à Internet.",explication:"Sans modem, on ne peut pas aller sur le web."},
    {question:"Quel est le rôle du processeur dans l'ordinateur ?",reponse:"Le processeur effectue les calculs et exécute les programmes.",explication:"C'est le moteur qui fait tourner toutes les applications."},
    {question:"Quel est le rôle du disque dur dans l'ordinateur ?",reponse:"Le disque dur stocke tous les fichiers et les programmes.",explication:"C'est la mémoire permanente de l'ordinateur."},
    {question:"Quel périphérique permet de transformer un document papier en fichier numérique ?",reponse:"C'est le scanner qui numérise les documents papier.",explication:"Il crée une copie numérique du document original."},
    {question:"Cite trois fonctions principales de l'ordinateur.",reponse:"L'ordinateur permet de communiquer, d'enregistrer des fichiers et de visionner des vidéos.",explication:"Ce sont les usages les plus courants."},
  ],qcm:[
    {enonce:"L'ordinateur est un outil...",options:[{lettre:"A",texte:"mécanique qui fabrique des objets"},{lettre:"B",texte:"électronique qui traite des informations"},{lettre:"C",texte:"manuel qui répare les voitures"},{lettre:"D",texte:"chimique qui mélange des produits"}],reponseCorrecte:"B",explication:"C'est un appareil électronique programmable."},
    {enonce:"Le cerveau de l'ordinateur s'appelle...",options:[{lettre:"A",texte:"l'écran"},{lettre:"B",texte:"le clavier"},{lettre:"C",texte:"l'unité centrale"},{lettre:"D",texte:"la souris"}],reponseCorrecte:"C",explication:"L'unité centrale commande tous les autres éléments."},
    {enonce:"Le clavier est un périphérique...",options:[{lettre:"A",texte:"de sortie"},{lettre:"B",texte:"d'entrée"},{lettre:"C",texte:"de stockage"},{lettre:"D",texte:"de connexion"}],reponseCorrecte:"B",explication:"Le clavier permet d'écrire et d'envoyer des instructions."},
    {enonce:"L'imprimante est un périphérique...",options:[{lettre:"A",texte:"d'entrée"},{lettre:"B",texte:"de sortie"},{lettre:"C",texte:"de stockage"},{lettre:"D",texte:"central"}],reponseCorrecte:"B",explication:"L'imprimante reçoit les données pour imprimer sur papier."},
    {enonce:"Le modem permet à l'ordinateur de...",options:[{lettre:"A",texte:"imprimer des documents"},{lettre:"B",texte:"se connecter à Internet"},{lettre:"C",texte:"écouter de la musique"},{lettre:"D",texte:"scanner des images"}],reponseCorrecte:"B",explication:"Le modem est la passerelle vers le réseau Internet."},
    {enonce:"Le processeur de l'ordinateur...",options:[{lettre:"A",texte:"stocke les fichiers"},{lettre:"B",texte:"effectue les calculs"},{lettre:"C",texte:"affiche les images"},{lettre:"D",texte:"imprime les documents"}],reponseCorrecte:"B",explication:"Le processeur exécute tous les programmes."},
    {enonce:"Le disque dur de l'ordinateur sert à...",options:[{lettre:"A",texte:"afficher les images"},{lettre:"B",texte:"stocker les fichiers et programmes"},{lettre:"C",texte:"imprimer les documents"},{lettre:"D",texte:"connecter à Internet"}],reponseCorrecte:"B",explication:"Le disque dur conserve les données en mémoire."},
    {enonce:"Le microphone est un périphérique...",options:[{lettre:"A",texte:"de sortie"},{lettre:"B",texte:"d'entrée"},{lettre:"C",texte:"de stockage"},{lettre:"D",texte:"d'affichage"}],reponseCorrecte:"B",explication:"Le microphone envoie le son à l'ordinateur."},
    {enonce:"L'écran de l'ordinateur est aussi appelé...",options:[{lettre:"A",texte:"clavier"},{lettre:"B",texte:"moniteur"},{lettre:"C",texte:"processeur"},{lettre:"D",texte:"modem"}],reponseCorrecte:"B",explication:"Moniteur est le nom technique de l'écran."},
    {enonce:"Quel périphérique permet de numériser un document papier ?",options:[{lettre:"A",texte:"L'imprimante"},{lettre:"B",texte:"Le scanner"},{lettre:"C",texte:"La souris"},{lettre:"D",texte:"Le haut-parleur"}],reponseCorrecte:"B",explication:"Le scanner transforme le papier en fichier numérique."},
  ]},
  {ordre:9,titre:"Les États de la Matière",objectif:"Connaître les trois états de la matière (solide, liquide, gazeux) et leurs propriétés",promptSupplement:"Utilise des exemples concrets de la vie quotidienne. Vocabulaire adapté aux CM1.",contenuHTML:`<h1>🧪 Leçon 9 : Les États de la Matière</h1><div class="bloc-essentiel"> <p>La matière existe sous <strong>trois états</strong> : <mark>l'état solide</mark>, <mark>l'état liquide</mark> et <mark>l'état gazeux</mark>.</p></div><h2>💧 L'État Liquide</h2><ul> <li>Les liquides comme l'eau et l'huile <strong>coulent</strong> : ce sont des fluides.</li> <li>Ils <strong>prennent la forme</strong> du récipient qui les contient.</li> <li><strong>Exemples :</strong> eau, huile, lait, jus de fruit.</li></ul><h2>🪨 L'État Solide</h2><ul> <li>Les solides ont une <strong>forme propre</strong> qui ne change pas.</li> <li>Certains <strong>fondent</strong> sous l'effet de la chaleur (fer, or).</li> <li>D'autres <strong>ne fondent pas</strong> : ce sont des <mark>corps réfractaires</mark> (sable, pierre).</li> <li><strong>Exemples :</strong> pierre, bois, glace, fer.</li></ul><h2>💨 L'État Gazeux</h2><ul> <li>Les gaz sont <strong>invisibles</strong>, <strong>compressibles</strong> et <strong>élastiques</strong>.</li> <li>Ils n'ont pas de forme propre et occupent tout l'espace disponible.</li> <li><strong>Exemples :</strong> air, butane, oxygène, gaz carbonique.</li></ul><div class="bloc-attention"> <strong>📌 À retenir :</strong> Les solides et les liquides ont un volume invariable. Les gaz n'ont pas de volume fixe (ils sont compressibles).</div><h2>📝 Résumé</h2><ul> <li><strong>Liquide :</strong> prend la forme du récipient, coule.</li> <li><strong>Solide :</strong> forme propre, certains fondent, d'autres non.</li> <li><strong>Gaz :</strong> invisible, compressible, sans forme propre.</li></ul>`,exercices:[
    {question:"Quels sont les trois états de la matière ?",reponse:"Les trois états sont : l'état solide, l'état liquide et l'état gazeux.",explication:"La matière peut changer d'état selon la température."},
    {question:"Pourquoi dit-on que les liquides sont des fluides ?",reponse:"Parce que les liquides coulent et s'écoulent facilement.",explication:"Un fluide est une substance qui s'écoule librement."},
    {question:"Comment s'appelle un solide qui ne fond pas, même quand on le chauffe ?",reponse:"On l'appelle un corps réfractaire.",explication:"Le sable et la pierre sont des corps réfractaires."},
    {question:"Cite deux exemples de gaz que tu connais.",reponse:"L'air et le butane sont des gaz.",explication:"On peut aussi citer l'oxygène et le gaz carbonique."},
    {question:"Est-ce que les solides et les liquides ont un volume fixe ?",reponse:"Oui, les solides et les liquides ont un volume qui ne change jamais.",explication:"Seuls les gaz peuvent changer de volume."},
    {question:"Pourquoi dit-on que les gaz sont compressibles ?",reponse:"Parce qu'on peut réduire leur volume en appuyant dessus.",explication:"L'air dans un ballon se comprime quand on appuie."},
    {question:"Donne un exemple de solide qui fond quand on le chauffe.",reponse:"Le fer, l'or ou la glace fondent sous l'effet de la chaleur.",explication:"La glace fond à 0°C et le fer à une température bien plus élevée."},
    {question:"Qu'est-ce qu'un fluide ? Donne un exemple.",reponse:"Un fluide est une substance qui coule. L'eau et l'huile sont des fluides.",explication:"Tous les liquides sont des fluides."},
    {question:"Cite trois propriétés importantes des gaz.",reponse:"Les gaz sont invisibles, compressibles et élastiques.",explication:"Ces propriétés les rendent très différents des solides et liquides."},
    {question:"Donne un exemple de liquide autre que l'eau.",reponse:"L'huile, le lait ou le jus de fruit sont des liquides.",explication:"Tous ces liquides prennent la forme de leur récipient."},
  ],qcm:[
    {enonce:"Combien d'états de la matière existe-t-il dans la nature ?",options:[{lettre:"A",texte:"2 états"},{lettre:"B",texte:"3 états"},{lettre:"C",texte:"4 états"},{lettre:"D",texte:"5 états"}],reponseCorrecte:"B",explication:"Il existe trois états : solide, liquide et gazeux."},
    {enonce:"Quand on verse un liquide dans un verre, le liquide...",options:[{lettre:"A",texte:"garde sa forme carrée"},{lettre:"B",texte:"prend la forme du verre"},{lettre:"C",texte:"devient solide"},{lettre:"D",texte:"disparaît complètement"}],reponseCorrecte:"B",explication:"Le liquide s'adapte à la forme du récipient."},
    {enonce:"Un corps réfractaire est un solide qui...",options:[{lettre:"A",texte:"fond facilement au soleil"},{lettre:"B",texte:"ne fond pas même sous la chaleur"},{lettre:"C",texte:"se transforme en gaz"},{lettre:"D",texte:"se transforme en liquide"}],reponseCorrecte:"B",explication:"Il résiste à la chaleur sans fondre."},
    {enonce:"Les gaz comme l'air sont...",options:[{lettre:"A",texte:"visibles à l'œil nu"},{lettre:"B",texte:"invisibles"},{lettre:"C",texte:"toujours liquides"},{lettre:"D",texte:"toujours solides"}],reponseCorrecte:"B",explication:"Les gaz sont invisibles, on ne les voit pas."},
    {enonce:"Dans quel état se trouve l'eau quand elle est liquide ?",options:[{lettre:"A",texte:"État solide"},{lettre:"B",texte:"État gazeux"},{lettre:"C",texte:"État liquide"},{lettre:"D",texte:"État plasma"}],reponseCorrecte:"C",explication:"L'eau à température ambiante est liquide."},
    {enonce:"L'air que nous respirons est un exemple d'état...",options:[{lettre:"A",texte:"liquide"},{lettre:"B",texte:"solide"},{lettre:"C",texte:"gazeux"},{lettre:"D",texte:"plasma"}],reponseCorrecte:"C",explication:"L'air est un mélange de gaz (oxygène, azote...)."},
    {enonce:"Le volume d'un gaz est...",options:[{lettre:"A",texte:"toujours fixe et invariable"},{lettre:"B",texte:"variable (peut changer)"},{lettre:"C",texte:"nul (n'existe pas)"},{lettre:"D",texte:"toujours le même"}],reponseCorrecte:"B",explication:"Les gaz occupent tout l'espace disponible."},
    {enonce:"Quand on chauffe du fer, il...",options:[{lettre:"A",texte:"ne fond pas du tout"},{lettre:"B",texte:"finit par fondre"},{lettre:"C",texte:"se transforme en gaz immédiatement"},{lettre:"D",texte:"devient liquide à 0°C"}],reponseCorrecte:"B",explication:"Le fer fond à très haute température."},
    {enonce:"Le sable de la plage est un exemple de solide...",options:[{lettre:"A",texte:"réfractaire (ne fond pas)"},{lettre:"B",texte:"fusible (fond facilement)"},{lettre:"C",texte:"liquide"},{lettre:"D",texte:"gazeux"}],reponseCorrecte:"A",explication:"Le sable résiste à la chaleur, c'est un réfractaire."},
    {enonce:"Qu'est-ce qu'un fluide ?",options:[{lettre:"A",texte:"Un gaz uniquement"},{lettre:"B",texte:"Un solide uniquement"},{lettre:"C",texte:"Une substance qui coule"},{lettre:"D",texte:"Un corps qui ne fond pas"}],reponseCorrecte:"C",explication:"L'eau, l'huile sont des fluides qui s'écoulent."},
  ]},
  {ordre:10,titre:"Les Combustions Vives",objectif:"Comprendre ce qu'est une combustion vive, ses caractéristiques et les conditions nécessaires",promptSupplement:"Utilise des exemples concrets comme la cuisson au feu de bois. Vocabulaire adapté aux CM1.",contenuHTML:`<h1>🔥 Leçon 10 : Les Combustions Vives</h1><div class="bloc-essentiel"> <p>Une <strong>combustion</strong> se produit quand un corps <mark>brûle</mark>. Une <strong>combustion vive</strong> dégage de la chaleur, de la lumière, du gaz carbonique et de la vapeur d'eau.</p></div><h2>🧱 Les Combustibles</h2><p>Les corps qui peuvent brûler sont des <strong>combustibles</strong>. Il en existe trois types :</p><ul> <li><strong>Liquides :</strong> pétrole, essence, alcool</li> <li><strong>Solides :</strong> bois, bougie, charbon</li> <li><strong>Gazeux :</strong> butane, propane, gaz naturel</li></ul><h2>⚡ Les Conditions</h2><p>Pour qu'une combustion vive se produise, il faut :</p><ol> <li><mark>Chauffer le combustible</mark> pour qu'il dégage des gaz</li> <li>Le mettre au <mark>contact de l'oxygène</mark> de l'air</li></ol><div class="bloc-attention"> <strong>🔥 Exemple :</strong> Quand on allume une bougie, la flamme dégage chaleur et lumière. La cire fond et brûle grâce à l'oxygène de l'air.</div><h2>📝 Résumé</h2><ul> <li>Une <strong>combustion vive</strong> produit : chaleur + lumière + CO2 + vapeur d'eau.</li> <li>Il existe 3 types de combustibles : solides, liquides, gazeux.</li> <li>Pour brûler : il faut <strong>chauffer</strong> + <strong>oxygène</strong>.</li></ul>`,exercices:[
    {question:"Qu'est-ce qu'une combustion vive ?",reponse:"Une combustion vive se produit quand un corps brûle en dégageant de la chaleur et de la lumière visible.",explication:"La flamme d'une bougie est un exemple typique de combustion vive."},
    {question:"Qu'est-ce qu'un combustible ?",reponse:"Un combustible est un corps qui peut brûler et produire de l'énergie.",explication:"Le bois, l'essence et le butane sont des combustibles."},
    {question:"Cite les trois types de combustibles avec un exemple pour chacun.",reponse:"Les combustibles solides (bois), liquides (essence) et gazeux (butane).",explication:"Chaque type de combustible a des usages différents dans la vie."},
    {question:"Quelles sont les deux conditions nécessaires pour qu'une combustion vive se produise ?",reponse:"Il faut chauffer le combustible et le mettre au contact de l'oxygène de l'air.",explication:"Ces deux conditions sont absolument nécessaires."},
    {question:"Donne un exemple de combustible liquide.",reponse:"Le pétrole, l'essence ou l'alcool sont des combustibles liquides.",explication:"Ils brûlent facilement et sont utilisés pour les véhicules."},
    {question:"Donne un exemple de combustible solide.",reponse:"Le bois, la bougie ou le charbon sont des combustibles solides.",explication:"On les utilise souvent pour le chauffage et la cuisson."},
    {question:"Donne un exemple de combustible gazeux.",reponse:"Le butane, le propane ou le gaz naturel sont des combustibles gazeux.",explication:"On les utilise pour la cuisson des aliments."},
    {question:"Que produit une combustion vive ?",reponse:"Elle produit de la chaleur, de la lumière, du gaz carbonique et de la vapeur d'eau.",explication:"Ce sont les quatre produits d'une combustion vive."},
    {question:"Pourquoi l'oxygène de l'air est-il nécessaire pour qu'une combustion se produise ?",reponse:"Le combustible a besoin de l'oxygène de l'air pour pouvoir brûler.",explication:"Sans oxygène, le feu s'éteint."},
    {question:"La flamme d'une bougie est-elle une combustion vive ? Pourquoi ?",reponse:"Oui, une flamme de bougie dégage de la chaleur et de la lumière visible.",explication:"C'est le meilleur exemple de combustion vive."},
  ],qcm:[
    {enonce:"Une combustion vive produit...",options:[{lettre:"A",texte:"du froid et de l'obscurité"},{lettre:"B",texte:"de la chaleur et de la lumière"},{lettre:"C",texte:"du son et du mouvement"},{lettre:"D",texte:"de l'eau et du vent"}],reponseCorrecte:"B",explication:"La combustion vive dégage chaleur et lumière visibles."},
    {enonce:"Un combustible est un corps qui...",options:[{lettre:"A",texte:"ne peut pas brûler"},{lettre:"B",texte:"peut brûler et produire de l'énergie"},{lettre:"C",texte:"n'existe que sous forme liquide"},{lettre:"D",texte:"n'existe que sous forme gazeuse"}],reponseCorrecte:"B",explication:"Un combustible est un corps qui peut brûler."},
    {enonce:"Le bois que l'on met dans le feu est un combustible...",options:[{lettre:"A",texte:"liquide"},{lettre:"B",texte:"solide"},{lettre:"C",texte:"gazeux"},{lettre:"D",texte:"plastique"}],reponseCorrecte:"B",explication:"Le bois est un combustible solide couramment utilisé."},
    {enonce:"L'essence utilisée par les voitures est un combustible...",options:[{lettre:"A",texte:"solide"},{lettre:"B",texte:"liquide"},{lettre:"C",texte:"gazeux"},{lettre:"D",texte:"minéral"}],reponseCorrecte:"B",explication:"L'essence est un combustible liquide."},
    {enonce:"Le butane utilisé pour la cuisson est un combustible...",options:[{lettre:"A",texte:"solide"},{lettre:"B",texte:"liquide"},{lettre:"C",texte:"gazeux"},{lettre:"D",texte:"métallique"}],reponseCorrecte:"C",explication:"Le butane est un combustible gazeux."},
    {enonce:"Pour qu'une combustion se produise, le combustible doit être...",options:[{lettre:"A",texte:"mouillé et froid"},{lettre:"B",texte:"chauffé et au contact de l'oxygène"},{lettre:"C",texte:"caché dans l'obscurité"},{lettre:"D",texte:"enterré dans le sable"}],reponseCorrecte:"B",explication:"Il faut chauffer le combustible en présence d'oxygène."},
    {enonce:"Le combustible a besoin de quoi pour brûler ?",options:[{lettre:"A",texte:"d'eau froide"},{lettre:"B",texte:"d'oxygène (présent dans l'air)"},{lettre:"C",texte:"de sable"},{lettre:"D",texte:"de vent fort"}],reponseCorrecte:"B",explication:"L'oxygène de l'air est indispensable à la combustion."},
    {enonce:"Si on enlève l'oxygène, une combustion...",options:[{lettre:"A",texte:"brûle plus fort"},{lettre:"B",texte:"s'éteint et ne peut pas continuer"},{lettre:"C",texte:"refroidit et ralentit"},{lettre:"D",texte:"devient bleue"}],reponseCorrecte:"B",explication:"Sans oxygène, le feu s'éteint."},
    {enonce:"Le charbon de bois est un combustible...",options:[{lettre:"A",texte:"liquide"},{lettre:"B",texte:"solide"},{lettre:"C",texte:"gazeux"},{lettre:"D",texte:"végétal"}],reponseCorrecte:"B",explication:"Le charbon est un combustible solide."},
    {enonce:"Si on ne chauffe pas assez le combustible, la combustion...",options:[{lettre:"A",texte:"se produit quand même"},{lettre:"B",texte:"ne peut pas se produire"},{lettre:"C",texte:"accélère"},{lettre:"D",texte:"refroidit"}],reponseCorrecte:"B",explication:"La chaleur est nécessaire pour enflammer le combustible."},
  ]}
];

const QUIZ_DATA = {
  3: [
    {q:"Quel outil utilise-t-on pour déplacer des charges lourdes ?",opts:["La pelle","La brouette","Le seau","Le marteau"],ok:1},
    {q:"De combien de parties principales est composée la brouette ?",opts:["4 parties","5 parties","6 parties","7 parties"],ok:2},
    {q:"Quelle partie de la lampe de poche produit la lumière ?",opts:["La pile","Le fil","L'ampoule","L'interrupteur"],ok:2},
    {q:"À quoi sert l'interrupteur d'une lampe de poche ?",opts:["À produire la lumière","À stocker l'énergie","À allumer ou éteindre","À protéger la lampe"],ok:2},
    {q:"Les piles d'une lampe de poche sont des...",opts:["ampoules","sources d'alimentation","interrupteurs","conducteurs"],ok:1},
    {q:"Qui utilise la brouette dans son travail ?",opts:["Le médecin","Le jardinier","Le professeur","Le musicien"],ok:1},
  ],
  6: [
    {q:"L'ordinateur est un outil...",opts:["Mécanique","Électronique","Manuel","Chimique"],ok:1},
    {q:"Le cerveau de l'ordinateur s'appelle...",opts:["L'écran","L'unité centrale","La souris","Le clavier"],ok:1},
    {q:"Le clavier est un périphérique...",opts:["De sortie","D'entrée","De stockage","D'affichage"],ok:1},
    {q:"L'imprimante est un périphérique...",opts:["D'entrée","De sortie","Central","De réseau"],ok:1},
    {q:"Le modem permet de se connecter à...",opts:["L'imprimante","Internet","L'écran","Le clavier"],ok:1},
    {q:"Le disque dur sert à...",opts:["Stocker des fichiers","Imprimer des documents","Afficher des images","Écouter du son"],ok:0},
  ],
  9: [
    {q:"Combien d'états de la matière existe-t-il ?",opts:["2","3","4","5"],ok:1},
    {q:"Quand on verse un liquide dans un verre, le liquide...",opts:["garde sa forme","prend la forme du verre","devient solide","disparaît"],ok:1},
    {q:"Les gaz comme l'air sont...",opts:["Visibles","Invisibles","Liquides","Solides"],ok:1},
    {q:"À quel état se trouve l'eau quand elle est liquide ?",opts:["Solide","Gaz","Liquide","Vapeur"],ok:2},
    {q:"Le volume d'un gaz est...",opts:["Fixe et invariable","Variable (peut changer)","Nul","Très grand"],ok:1},
    {q:"Un corps réfractaire est un solide qui...",opts:["fond facilement","ne fond pas","coule","brûle"],ok:1},
  ],
  10: [
    {q:"Une combustion vive produit...",opts:["Du froid","De la chaleur et de la lumière","Du son","De l'eau"],ok:1},
    {q:"Le bois est un combustible...",opts:["Liquide","Solide","Gazeux","Plastique"],ok:1},
    {q:"L'essence utilisée par les voitures est un combustible...",opts:["Solide","Liquide","Gazeux","Rocher"],ok:1},
    {q:"Pour brûler, le combustible a besoin de...",opts:["D'eau","D'oxygène présent dans l'air","De sable","De froid"],ok:1},
    {q:"Sans oxygène, une combustion...",opts:["brûle plus fort","s'éteint et ne peut pas continuer","produit du froid","devient plus rapide"],ok:1},
    {q:"Le butane est un gaz...",opts:["Liquide","Solide","Combustible","Naturel"],ok:2},
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
  console.log(`✅ Matière Histoire trouvée : ${matiere._id}`);

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
    await Entrainement.deleteMany({ matiere: 'Histoire', niveau: 'CM1', chapitre: data.titre });

    // ── 9. Créer le Quiz (Entrainement) ──────────────────────────
    const quizQuestions = QUIZ_DATA[data.ordre];
    const entrainement = await Entrainement.create({
      matiere:        'Histoire',
      niveau:         'CM1',
      section:        '',
      chapitre:       data.titre,
      ordre:          data.ordre,
      titre:          `Quiz — ${data.titre}`,
      source:         'Cours CM1 Histoire',
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
  console.log('   Seed Histoire CM1 terminé avec succès !');
  console.log(`   📚 Chapitres créés/mis à jour : ${nbChapitres}`);
  console.log(`   📖 Leçons publiées            : ${nbLecons}`);
  console.log(`   ✏️  QCMs publiés              : ${nbQcms}`);
  console.log(`   ⚡ Quiz publiés               : ${nbQuiz}`);
  console.log('   → Les élèves CM1 peuvent maintenant');
  console.log('     accéder aux cours, QCMs et Quiz d\'Histoire !');
  console.log('══════════════════════════════════════════════\n');

  process.exit(0);
};

seed().catch(e => {
  console.error('❌ Erreur seed Histoire CM1 :', e.message);
  console.error(e.stack);
  process.exit(1);
});
