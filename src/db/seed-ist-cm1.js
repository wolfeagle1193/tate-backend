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
,
{ordre:11,titre:"Les Combustions Lentes",objectif:"Comprendre l'oxydation et la rouille",promptSupplement:"Exemples concrets. CM1.",contenuHTML:`<h1>🟤 Leçon 11 : Les Combustions Lentes</h1><div class="bloc-essentiel"><p>Une <strong>combustion lente</strong> ne dégage ni chaleur ni lumière. L'action de l'oxygène sur les métaux = <mark>oxydation</mark>.</p></div><h2>🟤 La Rouille</h2><p>La <strong>rouille</strong> du fer est une oxydation. Elle est <mark>poreuse</mark>. Métaux qui s'oxydent en surface : cuivre, plomb, zinc, aluminium. Inoxydables : or, argent, nickel, chrome.</p><h2>🛡️ Éviter la Rouille</h2><p>Recouvrir le fer de : graisse, peinture à huile, minium, métal inoxydable.</p><div class="bloc-attention"><strong>⚠️</strong> La rouille fragilise le fer en profondeur. Protéger le fer évite la casse.</div><h2>📝 Résumé</h2><ul><li>Combustion lente = oxydation (ni chaleur ni lumière)</li><li>Rouille = oxydation du fer, poreuse</li><li>Protection : graisse, peinture, minium</li></ul>`,exercices:[
  {question:"Qu'est-ce qu'une combustion lente ?",reponse:"Ne dégage ni chaleur ni lumière. Ex: oxydation.",explication:"Invisible, contrairement à la flamme."},
  {question:"Qu'est-ce que l'oxydation ?",reponse:"Action de l'oxygène sur les métaux.",explication:"C'est une combustion lente."},
  {question:"Qu'est-ce que la rouille ?",reponse:"Oxydation du fer, poreuse.",explication:"Attaque le fer en profondeur."},
  {question:"Cite 2 métaux inoxydables.",reponse:"Or, argent, nickel, chrome.",explication:"Ne rouillent jamais."},
  {question:"Comment protéger le fer de la rouille ?",reponse:"Graisse, peinture, minium, métal inoxydable.",explication:"Empêchent l'oxygène d'atteindre le fer."},
  {question:"Cuivre et zinc s'oxydent comment ?",reponse:"En surface seulement.",explication:"Forme une couche protectrice."},
  {question:"Pourquoi la rouille est poreuse ?",reponse:"L'oxygène traverse et attaque en profondeur.",explication:"Le fer rouille de l'intérieur."},
  {question:"Qu'est-ce que le minium ?",reponse:"Peinture anti-rouille.",explication:"Protège le fer."},
  {question:"Différence combustion vive/lente ?",reponse:"Vive = chaleur+lumière. Lente = rien de visible.",explication:"Ex: flamme vs rouille."},
  {question:"3 moyens anti-rouille ?",reponse:"Graisser, peindre, recouvrir de métal.",explication:"Couper l'air du fer."},
],qcm:[
  {enonce:"Une combustion lente...",options:[{lettre:"A",texte:"dégage chaleur et lumière"},{lettre:"B",texte:"ne dégage rien de visible"},{lettre:"C",texte:"produit du CO2"},{lettre:"D",texte:"nécessite une flamme"}],reponseCorrecte:"B",explication:"Invisible."},
  {enonce:"L'oxydation est une...",options:[{lettre:"A",texte:"combustion vive"},{lettre:"B",texte:"combustion lente"},{lettre:"C",texte:"fusion"},{lettre:"D",texte:"évaporation"}],reponseCorrecte:"B",explication:"Lente."},
  {enonce:"La rouille est...",options:[{lettre:"A",texte:"l'oxydation du fer"},{lettre:"B",texte:"un gaz"},{lettre:"C",texte:"un liquide"},{lettre:"D",texte:"une peinture"}],reponseCorrecte:"A",explication:"Oxydation."},
  {enonce:"Métal inoxydable ?",options:[{lettre:"A",texte:"Fer"},{lettre:"B",texte:"Or"},{lettre:"C",texte:"Cuivre"},{lettre:"D",texte:"Zinc"}],reponseCorrecte:"B",explication:"Or."},
  {enonce:"Anti-rouille :",options:[{lettre:"A",texte:"Eau"},{lettre:"B",texte:"Graisse"},{lettre:"C",texte:"Sable"},{lettre:"D",texte:"Charbon"}],reponseCorrecte:"B",explication:"Graisse."},
  {enonce:"La rouille est...",options:[{lettre:"A",texte:"étanche"},{lettre:"B",texte:"poreuse"},{lettre:"C",texte:"lisse"},{lettre:"D",texte:"brillante"}],reponseCorrecte:"B",explication:"Poreuse."},
  {enonce:"Cuivre s'oxyde...",options:[{lettre:"A",texte:"en profondeur"},{lettre:"B",texte:"en surface"},{lettre:"C",texte:"pas du tout"},{lettre:"D",texte:"vite"}],reponseCorrecte:"B",explication:"Surface."},
  {enonce:"L'argent est...",options:[{lettre:"A",texte:"rouillé"},{lettre:"B",texte:"inoxydable"},{lettre:"C",texte:"poreux"},{lettre:"D",texte:"liquide"}],reponseCorrecte:"B",explication:"Inoxydable."},
  {enonce:"Minium = ?",options:[{lettre:"A",texte:"Gaz"},{lettre:"B",texte:"Peinture"},{lettre:"C",texte:"Métal"},{lettre:"D",texte:"Acide"}],reponseCorrecte:"B",explication:"Peinture."},
  {enonce:"Combustion vive = ?",options:[{lettre:"A",texte:"visible"},{lettre:"B",texte:"invisible"},{lettre:"C",texte:"lente"},{lettre:"D",texte:"froide"}],reponseCorrecte:"A",explication:"Visible."},
]},
{ordre:12,titre:"Les États de l'Eau",objectif:"Connaître les changements d'état de l'eau",promptSupplement:"Exemples concrets. CM1.",contenuHTML:`<h1>💧 Leçon 12 : Les États de l'Eau</h1><div class="bloc-essentiel"><p>L'eau existe sous <strong>trois états</strong> : <mark>liquide</mark>, <mark>solide (glace)</mark>, <mark>gazeux (vapeur)</mark>.</p></div><h2>❄️ Solidification</h2><p>Eau refroidie à <strong>0°C</strong> → glace.</p><h2>☀️ Fusion</h2><p>Glace réchauffée → eau liquide.</p><h2>💨 Évaporation</h2><p>Eau chauffée → vapeur. Eau bout à <strong>100°C</strong>.</p><h2>💧 Condensation</h2><p>Vapeur refroidie → eau liquide (ex: buée).</p><div class="bloc-attention"><strong>📌</strong> Eau bout à 100°C, gèle à 0°C. La vapeur est invisible.</div><h2>📝 Résumé</h2><ul><li>Solidification : eau→glace (0°C)</li><li>Fusion : glace→eau</li><li>Évaporation : eau→vapeur (100°C)</li><li>Condensation : vapeur→eau</li></ul>`,exercices:[
  {question:"3 états de l'eau ?",reponse:"Liquide, solide (glace), gazeux (vapeur).",explication:"3 états."},
  {question:"Solidification ?",reponse:"Eau liquide → glace à 0°C.",explication:"Refroidissement."},
  {question:"Fusion ?",reponse:"Glace → eau liquide.",explication:"Réchauffement."},
  {question:"Évaporation ?",reponse:"Eau → vapeur.",explication:"Chauffage, 100°C."},
  {question:"Condensation ?",reponse:"Vapeur → eau liquide.",explication:"Ex: buée."},
  {question:"Eau bout à ?",reponse:"100°C.",explication:"Ébullition."},
  {question:"Eau gèle à ?",reponse:"0°C.",explication:"Solidification."},
  {question:"Vapeur d'eau visible ?",reponse:"Non, invisible.",explication:"Transparente."},
  {question:"Où va l'eau évaporée ?",reponse:"Dans l'atmosphère.",explication:"Vapeur dans l'air."},
  {question:"Exemple condensation ?",reponse:"Buée sur vitre froide.",explication:"Vapeur → gouttes."},
],qcm:[
  {enonce:"Solidification = ?",options:[{lettre:"A",texte:"liquide→solide"},{lettre:"B",texte:"solide→liquide"},{lettre:"C",texte:"liquide→gaz"},{lettre:"D",texte:"gaz→liquide"}],reponseCorrecte:"A",explication:"Eau→glace."},
  {enonce:"Fusion = ?",options:[{lettre:"A",texte:"liquide→solide"},{lettre:"B",texte:"solide→liquide"},{lettre:"C",texte:"liquide→gaz"},{lettre:"D",texte:"gaz→liquide"}],reponseCorrecte:"B",explication:"Glace→eau."},
  {enonce:"Évaporation = ?",options:[{lettre:"A",texte:"liquide→solide"},{lettre:"B",texte:"solide→liquide"},{lettre:"C",texte:"liquide→gaz"},{lettre:"D",texte:"gaz→liquide"}],reponseCorrecte:"C",explication:"Eau→vapeur."},
  {enonce:"Condensation = ?",options:[{lettre:"A",texte:"liquide→solide"},{lettre:"B",texte:"solide→liquide"},{lettre:"C",texte:"liquide→gaz"},{lettre:"D",texte:"gaz→liquide"}],reponseCorrecte:"D",explication:"Vapeur→eau."},
  {enonce:"Eau bout à ?",options:[{lettre:"A",texte:"0°C"},{lettre:"B",texte:"50°C"},{lettre:"C",texte:"100°C"},{lettre:"D",texte:"200°C"}],reponseCorrecte:"C",explication:"100°C."},
  {enonce:"Eau gèle à ?",options:[{lettre:"A",texte:"0°C"},{lettre:"B",texte:"-10°C"},{lettre:"C",texte:"50°C"},{lettre:"D",texte:"100°C"}],reponseCorrecte:"A",explication:"0°C."},
  {enonce:"Vapeur d'eau est...",options:[{lettre:"A",texte:"visible"},{lettre:"B",texte:"invisible"},{lettre:"C",texte:"solide"},{lettre:"D",texte:"liquide"}],reponseCorrecte:"B",explication:"Invisible."},
  {enonce:"Buée = ?",options:[{lettre:"A",texte:"solidification"},{lettre:"B",texte:"fusion"},{lettre:"C",texte:"évaporation"},{lettre:"D",texte:"condensation"}],reponseCorrecte:"D",explication:"Condensation."},
  {enonce:"Chauffer eau = ?",options:[{lettre:"A",texte:"gèle"},{lettre:"B",texte:"s'évapore"},{lettre:"C",texte:"fond"},{lettre:"D",texte:"durcit"}],reponseCorrecte:"B",explication:"Évaporation."},
  {enonce:"Glace fond à...",options:[{lettre:"A",texte:"-10°C"},{lettre:"B",texte:"0°C"},{lettre:"C",texte:"50°C"},{lettre:"D",texte:"100°C"}],reponseCorrecte:"B",explication:"0°C."},
]},
{ordre:13,titre:"Le Cycle de l'Eau",objectif:"Comprendre le cycle de l'eau",promptSupplement:"Exemples au Sénégal. CM1.",contenuHTML:`<h1>🌊 Leçon 13 : Le Cycle de l'Eau</h1><div class="bloc-essentiel"><p>Le <strong>cycle de l'eau</strong> est le mouvement perpétuel de l'eau entre la Terre et l'atmosphère.</p></div><h2>📋 4 Étapes</h2><ol><li><mark>Évaporation</mark> : soleil chauffe l'eau des mers → vapeur</li><li><mark>Condensation</mark> : vapeur refroidie → nuages</li><li><mark>Précipitation</mark> : nuages → pluie</li><li><mark>Ruisselement</mark> : eau retourne à la mer</li></ol><div class="bloc-attention"><strong>🌍</strong> Le cycle de l'eau est essentiel à la vie. L'eau ne se perd jamais.</div><h2>📝 Résumé</h2><ul><li>Évaporation → Condensation → Précipitation → Retour à la mer</li></ul>`,exercices:[
  {question:"Cycle de l'eau ?",reponse:"Mouvement perpétuel eau Terre/atmosphère.",explication:"L'eau se recycle."},
  {question:"4 étapes ?",reponse:"Évaporation, condensation, précipitation, ruissellement.",explication:"Étapes clés."},
  {question:"Que fait l'eau des mers au soleil ?",reponse:"Elle s'évapore.",explication:"Vapeur."},
  {question:"Où va la vapeur ?",reponse:"Atmosphère → nuages.",explication:"Condensation."},
  {question:"Formation des nuages ?",reponse:"Condensation de la vapeur.",explication:"Gouttelettes."},
  {question:"Les nuages donnent ?",reponse:"La pluie.",explication:"Précipitation."},
  {question:"Où va l'eau de pluie ?",reponse:"Infiltration ou ruissellement vers la mer.",explication:"Retour."},
  {question:"Pourquoi important ?",reponse:"Renouvelle l'eau douce.",explication:"Essentiel."},
  {question:"Eau infiltrée ressort ?",reponse:"Par les sources.",explication:"Souterraine."},
  {question:"Cycle a une fin ?",reponse:"Non, perpétuel.",explication:"Recommence sans cesse."},
],qcm:[
  {enonce:"Cycle commence par ?",options:[{lettre:"A",texte:"Pluie"},{lettre:"B",texte:"Évaporation"},{lettre:"C",texte:"Condensation"},{lettre:"D",texte:"Vent"}],reponseCorrecte:"B",explication:"Évaporation."},
  {enonce:"Nuages par ?",options:[{lettre:"A",texte:"Évaporation"},{lettre:"B",texte:"Condensation"},{lettre:"C",texte:"Solidification"},{lettre:"D",texte:"Fusion"}],reponseCorrecte:"B",explication:"Condensation."},
  {enonce:"Eau nuages = ?",options:[{lettre:"A",texte:"Neige"},{lettre:"B",texte:"Pluie"},{lettre:"C",texte:"Grêle"},{lettre:"D",texte:"Tout"}],reponseCorrecte:"B",explication:"Pluie."},
  {enonce:"Eau retourne ?",options:[{lettre:"A",texte:"Nuages"},{lettre:"B",texte:"Mer"},{lettre:"C",texte:"Soleil"},{lettre:"D",texte:"Nulle part"}],reponseCorrecte:"B",explication:"Mer."},
  {enonce:"Eau infiltrée = ?",options:[{lettre:"A",texte:"Nuages"},{lettre:"B",texte:"Sources"},{lettre:"C",texte:"Puits"},{lettre:"D",texte:"Mers"}],reponseCorrecte:"B",explication:"Sources."},
  {enonce:"Cycle est...",options:[{lettre:"A",texte:"Fini"},{lettre:"B",texte:"Perpétuel"},{lettre:"C",texte:"Inutile"},{lettre:"D",texte:"Lent"}],reponseCorrecte:"B",explication:"Perpétuel."},
  {enonce:"Sans soleil ?",options:[{lettre:"A",texte:"S'accélère"},{lettre:"B",texte:"S'arrête"},{lettre:"C",texte:"Continue"},{lettre:"D",texte:"Ralentit"}],reponseCorrecte:"B",explication:"Arrêt."},
  {enonce:"Évaporation = ?",options:[{lettre:"A",texte:"Eau→glace"},{lettre:"B",texte:"Eau→vapeur"},{lettre:"C",texte:"Pluie"},{lettre:"D",texte:"Nuages"}],reponseCorrecte:"B",explication:"Vapeur."},
  {enonce:"Condensation = ?",options:[{lettre:"A",texte:"Glace"},{lettre:"B",texte:"Eau liquide"},{lettre:"C",texte:"Pluie"},{lettre:"D",texte:"Vent"}],reponseCorrecte:"B",explication:"Eau."},
  {enonce:"Combien étapes ?",options:[{lettre:"A",texte:"2"},{lettre:"B",texte:"3"},{lettre:"C",texte:"4"},{lettre:"D",texte:"5"}],reponseCorrecte:"C",explication:"4."},
]},
{ordre:15,titre:"L'Eau est un Solvant",objectif:"Comprendre le pouvoir dissolvant de l'eau",promptSupplement:"Sucre, sel. CM1.",contenuHTML:`<h1>💧 Leçon 15 : L'Eau est un Solvant</h1><div class="bloc-essentiel"><p>L'eau est un <mark>solvant</mark> : elle dissout certains corps (sucre, sel = <mark>solubles</mark>).</p></div><h2>🧪 Solution et Saturation</h2><p>Sucre/self + eau → <strong>solution</strong>. Quand l'eau ne peut plus dissoudre → <strong>solution saturée</strong>.</p><h2>🔬 Cristaux</h2><p>Par évaporation de l'eau sucrée → cristaux de sucre. Sel de table = évaporation dans les <strong>marais salants</strong>.</p><div class="bloc-attention"><strong>📌</strong> Solvant = liquide qui dissout. Soluble = corps qui se dissout.</div><h2>📝 Résumé</h2><ul><li>Eau = solvant (dissout sucre et sel)</li><li>Solution saturée = ne peut plus dissoudre</li><li>Sel des marais salants (évaporation)</li></ul>`,exercices:[
  {question:"Solvant ?",reponse:"Liquide qui dissout.",explication:"Ex: eau."},
  {question:"Corps soluble ?",reponse:"Se dissout dans un liquide.",explication:"Ex: sucre."},
  {question:"Sucre + eau = ?",reponse:"Solution sucrée.",explication:"Invisible mais présent."},
  {question:"Solution saturée ?",reponse:"Eau ne peut plus dissoudre.",explication:"Limite atteinte."},
  {question:"Cristaux de sucre ?",reponse:"Par évaporation de l'eau sucrée.",explication:"L'eau s'en va."},
  {question:"Sel de table ?",reponse:"Des marais salants par évaporation.",explication:"Eau de mer."},
  {question:"L'eau dissout-elle tout ?",reponse:"Non, seulement certains corps.",explication:"Pas le sable."},
  {question:"Pourquoi eau = bon solvant ?",reponse:"Dissout beaucoup de corps.",explication:"Sucre, sel, café."},
  {question:"Où est le sucre dissous ?",reponse:"Dans l'eau, invisible.",explication:"En solution."},
  {question:"Différence solvant/soluble ?",reponse:"Solvant = liquide qui dissout. Soluble = ce qui est dissous.",explication:"Eau (solvant) dissout sucre (soluble)."},
],qcm:[
  {enonce:"L'eau est un...",options:[{lettre:"A",texte:"solide"},{lettre:"B",texte:"solvant"},{lettre:"C",texte:"gaz"},{lettre:"D",texte:"métal"}],reponseCorrecte:"B",explication:"Liquide qui dissout."},
  {enonce:"Soluble dans eau ?",options:[{lettre:"A",texte:"Sable"},{lettre:"B",texte:"Sucre"},{lettre:"C",texte:"Huile"},{lettre:"D",texte:"Pierre"}],reponseCorrecte:"B",explication:"Sucre."},
  {enonce:"Saturée = ?",options:[{lettre:"A",texte:"Peut encore"},{lettre:"B",texte:"Ne peut plus"},{lettre:"C",texte:"Très chaude"},{lettre:"D",texte:"Très froide"}],reponseCorrecte:"B",explication:"Limite."},
  {enonce:"Cristaux par ?",options:[{lettre:"A",texte:"Chauffage direct"},{lettre:"B",texte:"Évaporation"},{lettre:"C",texte:"Congélation"},{lettre:"D",texte:"Friture"}],reponseCorrecte:"B",explication:"Évaporation."},
  {enonce:"Sel vient ?",options:[{lettre:"A",texte:"Montagnes"},{lettre:"B",texte:"Marais salants"},{lettre:"C",texte:"Rivières"},{lettre:"D",texte:"Volcans"}],reponseCorrecte:"B",explication:"Marais."},
  {enonce:"Soluble = ?",options:[{lettre:"A",texte:"Ne se dissout pas"},{lettre:"B",texte:"Peut se dissoudre"},{lettre:"C",texte:"Solide"},{lettre:"D",texte:"Gaz"}],reponseCorrecte:"B",explication:"Se dissout."},
  {enonce:"Solvant = ?",options:[{lettre:"A",texte:"Ce qui est dissous"},{lettre:"B",texte:"Liquide qui dissout"},{lettre:"C",texte:"Gaz"},{lettre:"D",texte:"Solide"}],reponseCorrecte:"B",explication:"Dissout."},
  {enonce:"Sucre+eau = ?",options:[{lettre:"A",texte:"Solution sucrée"},{lettre:"B",texte:"Salée"},{lettre:"C",texte:"Huileuse"},{lettre:"D",texte:"Pâte"}],reponseCorrecte:"A",explication:"Sucrée."},
  {enonce:"Sucre et sel = ?",options:[{lettre:"A",texte:"Solvants"},{lettre:"B",texte:"Solubles"},{lettre:"C",texte:"Insolubles"},{lettre:"D",texte:"Gaz"}],reponseCorrecte:"B",explication:"Solubles."},
  {enonce:"Eau dissout...",options:[{lettre:"A",texte:"Tout"},{lettre:"B",texte:"Certains corps"},{lettre:"C",texte:"Rien"},{lettre:"D",texte:"Les gaz"}],reponseCorrecte:"B",explication:"Certains."},
]}
,
{ordre:16,titre:"L'Air",objectif:"Connaître la composition et les propriétés de l'air",promptSupplement:"Exemples concrets. CM1.",contenuHTML:`<h1>💨 Leçon 16 : L'Air</h1><div class="bloc-essentiel"><p>L'air est un <mark>gaz invisible</mark> formé d'<strong>oxygène</strong> et d'<strong>azote</strong>, avec un peu de gaz carbonique et de vapeur d'eau.</p></div><h2>🔵 Propriétés</h2><ul><li>Fluide, expansible, compressible, élastique</li><li>Il freine la chute des corps</li><li><strong>Pesant :</strong> 1 litre d'air pèse <mark>1,3 grammes</mark></li></ul><h2>💨 Le Vent</h2><p>Le <strong>vent</strong> est de l'air en mouvement.</p><h2>🌍 L'Atmosphère</h2><p>L'<strong>atmosphère</strong> est l'épaisse couche d'air qui entoure la Terre. Elle permet aux êtres vivants de <mark>respirer</mark> et maintient les oiseaux et les avions dans le ciel.</p><div class="bloc-attention"><strong>📌</strong> L'air est invisible mais il existe partout autour de nous. Sans air, il n'y aurait pas de vie sur Terre.</div><h2>📝 Résumé</h2><ul><li>Air = oxygène + azote + CO2 + vapeur d'eau</li><li>Propriétés : fluide, compressible, élastique</li><li>1L d'air = 1,3g. Vent = air en mouvement.</li></ul>`,exercices:[
  {question:"De quoi est composé l'air ?",reponse:"Oxygène + azote + un peu de CO2 et vapeur d'eau.",explication:"Mélange de gaz."},
  {question:"Cite 3 propriétés de l'air.",reponse:"Fluide, compressible, élastique.",explication:"4 propriétés."},
  {question:"Qu'est-ce que le vent ?",reponse:"De l'air en mouvement.",explication:"Déplacement d'air."},
  {question:"Combien pèse 1 litre d'air ?",reponse:"1,3 grammes.",explication:"L'air a un poids."},
  {question:"Qu'est-ce que l'atmosphère ?",reponse:"Couche d'air autour de la Terre.",explication:"Protège la Terre."},
  {question:"À quoi sert l'air pour les êtres vivants ?",reponse:"À respirer (grâce à l'oxygène).",explication:"Vital."},
  {question:"Pourquoi les avions volent-ils ?",reponse:"L'air les maintient en vol (portance).",explication:"Propriété de l'air."},
  {question:"L'air est-il visible ?",reponse:"Non, il est invisible.",explication:"Gaz transparent."},
  {question:"L'air freine-t-il les corps qui tombent ?",reponse:"Oui, il freine leur chute.",explication:"Résistance de l'air."},
  {question:"Que devient l'air quand il est chauffé ?",reponse:"Il se dilate et monte.",explication:"Air chaud = léger."},
],qcm:[
  {enonce:"L'air est composé...",options:[{lettre:"A",texte:"d'oxygène et d'azote"},{lettre:"B",texte:"d'eau et de sel"},{lettre:"C",texte:"de sable"},{lettre:"D",texte:"de fer"}],reponseCorrecte:"A",explication:"O2 + N2."},
  {enonce:"L'air est...",options:[{lettre:"A",texte:"un gaz invisible"},{lettre:"B",texte:"un liquide"},{lettre:"C",texte:"un solide"},{lettre:"D",texte:"un métal"}],reponseCorrecte:"A",explication:"Gaz."},
  {enonce:"1 litre d'air pèse...",options:[{lettre:"A",texte:"0g"},{lettre:"B",texte:"1,3g"},{lettre:"C",texte:"10g"},{lettre:"D",texte:"100g"}],reponseCorrecte:"B",explication:"1,3g."},
  {enonce:"Le vent est...",options:[{lettre:"A",texte:"un gaz froid"},{lettre:"B",texte:"de l'air en mouvement"},{lettre:"C",texte:"de l'eau"},{lettre:"D",texte:"un nuage"}],reponseCorrecte:"B",explication:"Air qui bouge."},
  {enonce:"L'atmosphère est...",options:[{lettre:"A",texte:"de l'eau"},{lettre:"B",texte:"de l'air"},{lettre:"C",texte:"le soleil"},{lettre:"D",texte:"la lune"}],reponseCorrecte:"B",explication:"Air terrestre."},
  {enonce:"L'air permet de...",options:[{lettre:"A",texte:"manger"},{lettre:"B",texte:"respirer"},{lettre:"C",texte:"dormir"},{lettre:"D",texte:"courir"}],reponseCorrecte:"B",explication:"Respiration."},
  {enonce:"L'air est...",options:[{lettre:"A",texte:"pesant (a un poids)"},{lettre:"B",texte:"léger (sans poids)"},{lettre:"C",texte:"lourd"},{lettre:"D",texte:"immobile"}],reponseCorrecte:"A",explication:"1,3g/L."},
  {enonce:"L'air freine...",options:[{lettre:"A",texte:"les oiseaux"},{lettre:"B",texte:"la chute des corps"},{lettre:"C",texte:"le vent"},{lettre:"D",texte:"les nuages"}],reponseCorrecte:"B",explication:"Résistance."},
  {enonce:"L'air est...",options:[{lettre:"A",texte:"compressible"},{lettre:"B",texte:"incompressible"},{lettre:"C",texte:"mou"},{lettre:"D",texte:"dur"}],reponseCorrecte:"A",explication:"Se comprime."},
  {enonce:"Où trouve-t-on de l'air ?",options:[{lettre:"A",texte:"partout"},{lettre:"B",texte:"sous l'eau"},{lettre:"C",texte:"dans le sol"},{lettre:"D",texte:"nulle part"}],reponseCorrecte:"A",explication:"Partout."},
]},
{ordre:17,titre:"La Pression Atmosphérique",objectif:"Comprendre la pression atmosphérique et ses applications",promptSupplement:"Siphon, seringue. CM1.",contenuHTML:`<h1>📏 Leçon 17 : La Pression Atmosphérique</h1><div class="bloc-essentiel"><p>La <strong>pression atmosphérique</strong> est la <mark>force que l'air exerce</mark> sur tous les corps qu'il entoure. Elle s'exerce dans tous les sens.</p></div><h2>🔄 Applications</h2><p>Fonctionnent grâce à la pression atmosphérique :</p><ul><li>Le <strong>siphon</strong></li><li>La <strong>seringue</strong></li><li>Le <strong>compte-gouttes</strong></li><li>La <strong>pipette</strong></li></ul><h2>📊 Le Baromètre</h2><p>Le <strong>baromètre</strong> permet de mesurer la pression atmosphérique. Il en existe deux types :</p><ul><li>Le <strong>baromètre à mercure</strong></li><li>Le <strong>baromètre métallique</strong></li></ul><div class="bloc-attention"><strong>📌</strong> En montant en altitude, la pression atmosphérique diminue car il y a moins d'air au-dessus de nous.</div><h2>📝 Résumé</h2><ul><li>Pression atmosphérique = force de l'air</li><li>Appareils : siphon, seringue, compte-gouttes, pipette</li><li>Mesure : baromètre (mercure ou métallique)</li></ul>`,exercices:[
  {question:"Qu'est-ce que la pression atmosphérique ?",reponse:"Force que l'air exerce sur les corps.",explication:"S'exerce dans tous les sens."},
  {question:"Cite 4 appareils utilisant la pression atmosphérique.",reponse:"Siphon, seringue, compte-gouttes, pipette.",explication:"Fonctionnent par pression."},
  {question:"Avec quoi mesure-t-on la pression atmosphérique ?",reponse:"Avec un baromètre.",explication:"Instrument de mesure."},
  {question:"Cite 2 types de baromètres.",reponse:"Baromètre à mercure et baromètre métallique.",explication:"2 technologies."},
  {question:"Comment fonctionne une seringue ?",reponse:"Elle aspire le liquide grâce à la pression atmosphérique.",explication:"La pression pousse le liquide."},
  {question:"Pourquoi l'eau monte-t-elle dans un siphon ?",reponse:"Grâce à la différence de pression atmosphérique.",explication:"Pression."},
  {question:"Comment fonctionne un compte-gouttes ?",reponse:"En relâchant la poire, la pression aspire le liquide.",explication:"Pression."},
  {question:"Dans quel sens s'exerce la pression atmosphérique ?",reponse:"Dans tous les sens.",explication:"Omnidirectionnelle."},
  {question:"Que se passe-t-il quand on monte en altitude ?",reponse:"La pression atmosphérique diminue.",explication:"Moins d'air au-dessus."},
  {question:"À quoi sert un baromètre ?",reponse:"À prévoir le temps et mesurer les changements de pression.",explication:"Météo."},
],qcm:[
  {enonce:"Pression atmosphérique = ?",options:[{lettre:"A",texte:"force de l'eau"},{lettre:"B",texte:"force de l'air"},{lettre:"C",texte:"force du vent"},{lettre:"D",texte:"force du sol"}],reponseCorrecte:"B",explication:"Force de l'air."},
  {enonce:"Le siphon utilise...",options:[{lettre:"A",texte:"la chaleur"},{lettre:"B",texte:"la pression atmosphérique"},{lettre:"C",texte:"le froid"},{lettre:"D",texte:"l'électricité"}],reponseCorrecte:"B",explication:"Pression."},
  {enonce:"Le baromètre mesure...",options:[{lettre:"A",texte:"la température"},{lettre:"B",texte:"la pression"},{lettre:"C",texte:"le vent"},{lettre:"D",texte:"la pluie"}],reponseCorrecte:"B",explication:"Pression."},
  {enonce:"Types de baromètres ?",options:[{lettre:"A",texte:"à eau/air"},{lettre:"B",texte:"à mercure/métallique"},{lettre:"C",texte:"à vent/pluie"},{lettre:"D",texte:"à gaz"}],reponseCorrecte:"B",explication:"Mercure/métal."},
  {enonce:"La pression s'exerce...",options:[{lettre:"A",texte:"vers le haut"},{lettre:"B",texte:"vers le bas"},{lettre:"C",texte:"dans tous les sens"},{lettre:"D",texte:"de côté"}],reponseCorrecte:"C",explication:"Tous sens."},
  {enonce:"En altitude, la pression...",options:[{lettre:"A",texte:"augmente"},{lettre:"B",texte:"diminue"},{lettre:"C",texte:"reste pareille"},{lettre:"D",texte:"disparaît"}],reponseCorrecte:"B",explication:"Moins d'air."},
  {enonce:"La seringue utilise...",options:[{lettre:"A",texte:"la chaleur"},{lettre:"B",texte:"la pression"},{lettre:"C",texte:"le froid"},{lettre:"D",texte:"l'eau"}],reponseCorrecte:"B",explication:"Pression."},
  {enonce:"Baromètre à mercure contient...",options:[{lettre:"A",texte:"de l'eau"},{lettre:"B",texte:"du mercure"},{lettre:"C",texte:"de l'air"},{lettre:"D",texte:"du sable"}],reponseCorrecte:"B",explication:"Mercure."},
  {enonce:"Le compte-gouttes utilise...",options:[{lettre:"A",texte:"l'électricité"},{lettre:"B",texte:"la pression"},{lettre:"C",texte:"la chaleur"},{lettre:"D",texte:"le vent"}],reponseCorrecte:"B",explication:"Pression."},
  {enonce:"En haut = air plus...",options:[{lettre:"A",texte:"dense"},{lettre:"B",texte:"rare"},{lettre:"C",texte:"lourd"},{lettre:"D",texte:"épais"}],reponseCorrecte:"B",explication:"Rare = moins de pression."},
]},
{ordre:18,titre:"La Dilatation et le Thermomètre",objectif:"Comprendre la dilatation des corps et le thermomètre",promptSupplement:"Exemples concrets. CM1.",contenuHTML:`<h1>🌡️ Leçon 18 : La Dilatation et le Thermomètre</h1><div class="bloc-essentiel"><p>La <strong>dilatation</strong> est l'<mark>augmentation du volume</mark> d'un corps sous l'action de la chaleur. En refroidissant, le corps chauffé reprend sa taille normale : c'est la <strong>contraction</strong>.</p></div><h2>🔬 Quels Corps se Dilatent ?</h2><p>Tous les corps se dilatent et se contractent :</p><ul><li>Les <strong>solides</strong> (ex: rails de train)</li><li>Les <strong>liquides</strong> (ex: mercure du thermomètre)</li><li>Les <strong>gaz</strong> (ex: air chauffé)</li></ul><h2>🌡️ Le Thermomètre</h2><p>Le <strong>thermomètre</strong> permet de mesurer la température. Il est composé d'une <mark>planchette graduée</mark> et d'un <mark>tube en verre</mark> contenant de l'alcool ou du mercure.</p><p>Quand il fait chaud, le mercure <strong>monte</strong> (dilatation). Quand il fait froid, le mercure <strong>descend</strong> (contraction).</p><div class="bloc-attention"><strong>📌</strong> Les rails de chemin de fer ont un espace entre eux pour permettre la dilatation sans déformation.</div><h2>📝 Résumé</h2><ul><li>Dilatation = volume + sous chaleur</li><li>Contraction = retour à la normale au froid</li><li>Tous les corps se dilatent</li><li>Thermomètre = mesure la température (mercure monte/descend)</li></ul>`,exercices:[
  {question:"Qu'est-ce que la dilatation ?",reponse:"Augmentation du volume d'un corps sous la chaleur.",explication:"Se dilate en chauffant."},
  {question:"Qu'est-ce que la contraction ?",reponse:"Retour à la taille normale en refroidissant.",explication:"Se contracte au froid."},
  {question:"Quels corps se dilatent ?",reponse:"Solides, liquides et gaz.",explication:"Tous les corps."},
  {question:"Qu'est-ce qu'un thermomètre ?",reponse:"Instrument qui mesure la température.",explication:"Mesure le chaud/froid."},
  {question:"De quoi est composé un thermomètre ?",reponse:"Planchette graduée + tube en verre avec alcool ou mercure.",explication:"2 parties."},
  {question:"Que fait le mercure quand il fait chaud ?",reponse:"Il monte dans le tube.",explication:"Dilatation du mercure."},
  {question:"Que fait le mercure quand il fait froid ?",reponse:"Il descend dans le tube.",explication:"Contraction du mercure."},
  {question:"Cite 2 types de thermomètres.",reponse:"Thermomètre médical, thermomètre d'ambiance.",explication:"Usages différents."},
  {question:"Pourquoi le mercure monte-t-il quand il fait chaud ?",reponse:"Parce qu'il se dilate sous la chaleur.",explication:"Dilatation."},
  {question:"Pourquoi les rails ont-ils un espace entre eux ?",reponse:"Pour permettre la dilatation sans déformation.",explication:"Évite les accidents."},
],qcm:[
  {enonce:"Dilatation = ?",options:[{lettre:"A",texte:"volume diminue"},{lettre:"B",texte:"volume augmente"},{lettre:"C",texte:"poids change"},{lettre:"D",texte:"couleur change"}],reponseCorrecte:"B",explication:"Volume +."},
  {enonce:"Contraction = ?",options:[{lettre:"A",texte:"volume augmente"},{lettre:"B",texte:"volume diminue"},{lettre:"C",texte:"chaud"},{lettre:"D",texte:"rien"}],reponseCorrecte:"B",explication:"Volume -."},
  {enonce:"Le thermomètre mesure...",options:[{lettre:"A",texte:"la pression"},{lettre:"B",texte:"la température"},{lettre:"C",texte:"le vent"},{lettre:"D",texte:"l'humidité"}],reponseCorrecte:"B",explication:"Température."},
  {enonce:"Le thermomètre contient...",options:[{lettre:"A",texte:"de l'eau"},{lettre:"B",texte:"de l'alcool ou mercure"},{lettre:"C",texte:"du sable"},{lettre:"D",texte:"de l'air"}],reponseCorrecte:"B",explication:"Alcool/mercure."},
  {enonce:"Mercure monte = ?",options:[{lettre:"A",texte:"froid"},{lettre:"B",texte:"chaud"},{lettre:"C",texte:"humide"},{lettre:"D",texte:"sec"}],reponseCorrecte:"B",explication:"Chaud."},
  {enonce:"Quels corps se dilatent ?",options:[{lettre:"A",texte:"solides"},{lettre:"B",texte:"liquides"},{lettre:"C",texte:"gaz"},{lettre:"D",texte:"tous"}],reponseCorrecte:"D",explication:"Tous."},
  {enonce:"Refroidir un corps = ?",options:[{lettre:"A",texte:"dilatation"},{lettre:"B",texte:"contraction"},{lettre:"C",texte:"rien"},{lettre:"D",texte:"fusion"}],reponseCorrecte:"B",explication:"Contraction."},
  {enonce:"Chauffer = ?",options:[{lettre:"A",texte:"dilate"},{lettre:"B",texte:"contracte"},{lettre:"C",texte:"rien"},{lettre:"D",texte:"fond"}],reponseCorrecte:"A",explication:"Dilate."},
  {enonce:"Espace rail = ?",options:[{lettre:"A",texte:"dilatation"},{lettre:"B",texte:"poids"},{lettre:"C",texte:"couleur"},{lettre:"D",texte:"bruit"}],reponseCorrecte:"A",explication:"Dilatation."},
  {enonce:"Tous les corps...",options:[{lettre:"A",texte:"se dilatent"},{lettre:"B",texte:"ne se dilatent pas"},{lettre:"C",texte:"sont solides"},{lettre:"D",texte:"sont gazeux"}],reponseCorrecte:"A",explication:"Se dilatent."},
]},
{ordre:19,titre:"La Digestion",objectif:"Connaître l'appareil digestif et les étapes de la digestion",promptSupplement:"Alimentation. CM1.",contenuHTML:`<h1>🍽️ Leçon 19 : La Digestion</h1><div class="bloc-essentiel"><p>La <strong>digestion</strong> est la <mark>transformation des aliments</mark> dans le tube digestif pour les transformer en nutriments que le corps peut utiliser.</p></div><h2>🔬 L'Appareil Digestif</h2><p>L'appareil digestif de l'homme comprend <strong>5 parties</strong> :</p><ol><li>La <strong>bouche</strong> (mastication)</li><li>L'<strong>œsophage</strong> (descente des aliments)</li><li>L'<strong>estomac</strong> (brassage avec les sucs gastriques)</li><li>L'<strong>intestin grêle</strong> (absorption des nutriments)</li><li>Le <strong>gros intestin</strong> (absorption d'eau, évacuation)</li></ol><p>Les <strong>glandes digestives</strong> produisent des <mark>sucs</mark> qui transforment les aliments en bouillie puis en liquide.</p><h2>✅ Conseils pour Bien Digérer</h2><ul><li><strong>Bien mâcher</strong> les aliments</li><li>Manger des aliments <strong>sains</strong></li><li>À des <strong>heures régulières</strong></li><li><strong>Sans excès</strong></li></ul><div class="bloc-attention"><strong>📌</strong> La digestion commence dans la bouche par la mastication. Bien mâcher facilite le travail de l'estomac.</div><h2>📝 Résumé</h2><ul><li>5 organes : bouche, œsophage, estomac, intestin grêle, gros intestin</li><li>Les sucs digestifs transforment les aliments</li><li>Bien mâcher = bonne digestion</li></ul>`,exercices:[
  {question:"Qu'est-ce que la digestion ?",reponse:"Transformation des aliments dans le tube digestif.",explication:"Processus de transformation."},
  {question:"Cite les 5 parties de l'appareil digestif.",reponse:"Bouche, œsophage, estomac, intestin grêle, gros intestin.",explication:"5 organes."},
  {question:"Rôle de la bouche ?",reponse:"Mâcher et broyer les aliments (mastication).",explication:"1ère étape."},
  {question:"Rôle de l'œsophage ?",reponse:"Conduire les aliments vers l'estomac.",explication:"Tube de descente."},
  {question:"Rôle de l'estomac ?",reponse:"Brasser les aliments avec les sucs gastriques.",explication:"Mixage."},
  {question:"Rôle de l'intestin grêle ?",reponse:"Absorber les nutriments dans le sang.",explication:"Nourriture."},
  {question:"Rôle du gros intestin ?",reponse:"Absorber l'eau et évacuer les déchets.",explication:"Dernière étape."},
  {question:"Que produisent les glandes digestives ?",reponse:"Des sucs qui transforment les aliments.",explication:"Sucs digestifs."},
  {question:"Comment bien digérer ?",reponse:"Bien mâcher, manger sain, heures régulières, sans excès.",explication:"4 conseils."},
  {question:"Pourquoi bien mâcher ?",reponse:"Pour faciliter le travail de l'estomac.",explication:"Prédigestion."},
],qcm:[
  {enonce:"La digestion se fait...",options:[{lettre:"A",texte:"dans le cœur"},{lettre:"B",texte:"dans le tube digestif"},{lettre:"C",texte:"dans les poumons"},{lettre:"D",texte:"dans le cerveau"}],reponseCorrecte:"B",explication:"Tube digestif."},
  {enonce:"Premier organe digestif ?",options:[{lettre:"A",texte:"Œsophage"},{lettre:"B",texte:"Bouche"},{lettre:"C",texte:"Estomac"},{lettre:"D",texte:"Intestin"}],reponseCorrecte:"B",explication:"Bouche."},
  {enonce:"L'œsophage conduit à...",options:[{lettre:"A",texte:"la bouche"},{lettre:"B",texte:"l'estomac"},{lettre:"C",texte:"l'intestin"},{lettre:"D",texte:"le cœur"}],reponseCorrecte:"B",explication:"Estomac."},
  {enonce:"L'estomac...",options:[{lettre:"A",texte:"absorbe l'eau"},{lettre:"B",texte:"brasse les aliments"},{lettre:"C",texte:"mâche"},{lettre:"D",texte:"évacue"}],reponseCorrecte:"B",explication:"Brassage."},
  {enonce:"Les nutriments sont absorbés dans...",options:[{lettre:"A",texte:"l'estomac"},{lettre:"B",texte:"l'intestin grêle"},{lettre:"C",texte:"le gros intestin"},{lettre:"D",texte:"la bouche"}],reponseCorrecte:"B",explication:"Intestin grêle."},
  {enonce:"L'eau est absorbée dans...",options:[{lettre:"A",texte:"l'estomac"},{lettre:"B",texte:"l'intestin grêle"},{lettre:"C",texte:"le gros intestin"},{lettre:"D",texte:"la bouche"}],reponseCorrecte:"C",explication:"Gros intestin."},
  {enonce:"Les glandes produisent...",options:[{lettre:"A",texte:"du sang"},{lettre:"B",texte:"des sucs"},{lettre:"C",texte:"de l'air"},{lettre:"D",texte:"des os"}],reponseCorrecte:"B",explication:"Sucs."},
  {enonce:"Parties digestives ?",options:[{lettre:"A",texte:"3"},{lettre:"B",texte:"4"},{lettre:"C",texte:"5"},{lettre:"D",texte:"6"}],reponseCorrecte:"C",explication:"5."},
  {enonce:"Bien mâcher est un...",options:[{lettre:"A",texte:"conseil"},{lettre:"B",texte:"exercice"},{lettre:"C",texte:"jeu"},{lettre:"D",texte:"obligation"}],reponseCorrecte:"A",explication:"Conseil."},
  {enonce:"L'alcool est mauvais pour...",options:[{lettre:"A",texte:"la digestion"},{lettre:"B",texte:"la vue"},{lettre:"C",texte:"l'ouïe"},{lettre:"D",texte:"la peau"}],reponseCorrecte:"A",explication:"Digestion."},
]},
{ordre:21,titre:"La Circulation du Sang",objectif:"Comprendre la composition du sang et la circulation sanguine",promptSupplement:"Explications simples. CM1.",contenuHTML:`<h1>❤️ Leçon 21 : La Circulation du Sang</h1><div class="bloc-essentiel"><p>Le sang contient du <strong>plasma</strong> (liquide clair), des <mark>globules rouges</mark> (qui donnent la couleur rouge) et des <mark>globules blancs</mark> (qui défendent le corps). Le corps humain contient environ <strong>5 litres</strong> de sang.</p></div><h2>🔄 La Circulation</h2><p>Le sang circule dans deux circuits :</p><ul><li><strong>Grande circulation :</strong> le sang va du cœur vers tous les organes du corps</li><li><strong>Petite circulation :</strong> le sang va du cœur vers les poumons pour prendre de l'oxygène</li></ul><h2>⚠️ Bonnes et Mauvaises Habitudes</h2><ul><li>❌ <strong>L'alcool</strong> et le <strong>tabac</strong> sont mauvais pour le cœur</li><li>✅ Le <strong>sport</strong> favorise la circulation du sang</li></ul><div class="bloc-attention"><strong>📌</strong> Quand on se coupe, le sang coagule et forme un caillot qui arrête le saignement. Le sang coagulé contient un liquide clair (sérum) et une masse rouge brun (caillot).</div><h2>📝 Résumé</h2><ul><li>Sang = plasma + globules rouges + globules blancs (~5L)</li><li>Grande circulation : cœur → organes</li><li>Petite circulation : cœur → poumons</li><li>Alcool et tabac = mauvais. Sport = bon</li></ul>`,exercices:[
  {question:"Que contient le sang ?",reponse:"Plasma, globules rouges et globules blancs.",explication:"3 composants."},
  {question:"Combien de litres de sang dans le corps ?",reponse:"Environ 5 litres.",explication:"Quantité moyenne."},
  {question:"Qu'est-ce que la grande circulation ?",reponse:"Le sang va du cœur vers tous les organes.",explication:"Cœur → organes."},
  {question:"Qu'est-ce que la petite circulation ?",reponse:"Le sang va du cœur vers les poumons.",explication:"Cœur → poumons."},
  {question:"Rôle des globules rouges ?",reponse:"Donner la couleur rouge au sang.",explication:"Couleur."},
  {question:"Rôle des globules blancs ?",reponse:"Défendre le corps contre les microbes.",explication:"Immunité."},
  {question:"Qu'est-ce que le plasma ?",reponse:"Le liquide clair du sang.",explication:"Partie liquide."},
  {question:"Qu'est-ce qu'un caillot ?",reponse:"Du sang coagulé qui arrête les saignements.",explication:"Coagulation."},
  {question:"Qu'est-ce qui est mauvais pour le cœur ?",reponse:"L'alcool et le tabac.",explication:"Nuisibles."},
  {question:"Qu'est-ce qui favorise la circulation ?",reponse:"Le sport.",explication:"Activation du sang."},
],qcm:[
  {enonce:"Litres de sang ?",options:[{lettre:"A",texte:"2L"},{lettre:"B",texte:"3L"},{lettre:"C",texte:"5L"},{lettre:"D",texte:"10L"}],reponseCorrecte:"C",explication:"5L."},
  {enonce:"Le plasma est...",options:[{lettre:"A",texte:"un liquide clair"},{lettre:"B",texte:"un gaz"},{lettre:"C",texte:"un solide"},{lettre:"D",texte:"une cellule"}],reponseCorrecte:"A",explication:"Liquide."},
  {enonce:"Grande circ = ?",options:[{lettre:"A",texte:"cœur→poumons"},{lettre:"B",texte:"cœur→organes"},{lettre:"C",texte:"poumons→cœur"},{lettre:"D",texte:"organes→poumons"}],reponseCorrecte:"B",explication:"→ organes."},
  {enonce:"Petite circ = ?",options:[{lettre:"A",texte:"cœur→poumons"},{lettre:"B",texte:"cœur→organes"},{lettre:"C",texte:"poumons→organes"},{lettre:"D",texte:"organes→cœur"}],reponseCorrecte:"A",explication:"→ poumons."},
  {enonce:"Alcool/tabac = ?",options:[{lettre:"A",texte:"bon cœur"},{lettre:"B",texte:"mauvais cœur"},{lettre:"C",texte:"sans effet"},{lettre:"D",texte:"bon poumon"}],reponseCorrecte:"B",explication:"Mauvais."},
  {enonce:"Sport = ?",options:[{lettre:"A",texte:"paresse"},{lettre:"B",texte:"bonne circulation"},{lettre:"C",texte:"maladie"},{lettre:"D",texte:"sommeil"}],reponseCorrecte:"B",explication:"Bonne circ."},
  {enonce:"Caillot = ?",options:[{lettre:"A",texte:"liquide"},{lettre:"B",texte:"coagulé"},{lettre:"C",texte:"gazeux"},{lettre:"D",texte:"transparent"}],reponseCorrecte:"B",explication:"Coagulé."},
  {enonce:"Globules blancs = ?",options:[{lettre:"A",texte:"couleur"},{lettre:"B",texte:"défense"},{lettre:"C",texte:"transport"},{lettre:"D",texte:"chaleur"}],reponseCorrecte:"B",explication:"Défense."},
  {enonce:"Globules rouges = ?",options:[{lettre:"A",texte:"défense"},{lettre:"B",texte:"couleur rouge"},{lettre:"C",texte:"coagulation"},{lettre:"D",texte:"oxygène"}],reponseCorrecte:"B",explication:"Couleur."},
  {enonce:"Tabac = ?",options:[{lettre:"A",texte:"bon"},{lettre:"B",texte:"mauvais"},{lettre:"C",texte:"sans effet"},{lettre:"D",texte:"bon poumon"}],reponseCorrecte:"B",explication:"Mauvais."},
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
  11: [
{q:"Combustion lente ?",opts:["Chaleur/lumière","Rien","Flamme","Bruit"],ok:1},
{q:"Oxydation = ?",opts:["Vive","Lente","Fusion","Glace"],ok:1},
{q:"Rouille = ?",opts:["Gaz","Oxydation fer","Liquide","Peinture"],ok:1},
{q:"Métal inoxydable ?",opts:["Fer","Or","Cuivre","Zinc"],ok:1},
{q:"Anti-rouille ?",opts:["Eau","Graisse","Sable","Charbon"],ok:1},
{q:"Rouille = ?",opts:["Étanche","Poreuse","Lisse","Brillante"],ok:1}
  ],
  12: [
{q:"Solidification ?",opts:["Eau→glace","Glace→eau","Eau→vapeur","Vapeur→eau"],ok:0},
{q:"Fusion ?",opts:["Eau→glace","Glace→eau","Eau→vapeur","Vapeur→eau"],ok:1},
{q:"Évaporation ?",opts:["Eau→glace","Glace→eau","Eau→vapeur","Vapeur→eau"],ok:2},
{q:"Condensation ?",opts:["Eau→glace","Glace→eau","Eau→vapeur","Vapeur→eau"],ok:3},
{q:"Eau bout à ?",opts:["0°","50°","100°","200°"],ok:2},
{q:"Eau gèle à ?",opts:["0°","-10°","50°","100°"],ok:0}
  ],
  13: [
{q:"Cycle commence ?",opts:["Pluie","Évaporation","Condensation","Vent"],ok:1},
{q:"Nuages = ?",opts:["Évaporation","Condensation","Solidification","Fusion"],ok:1},
{q:"Eau nuages = ?",opts:["Neige","Pluie","Grêle","Tout"],ok:1},
{q:"Eau retourne ?",opts:["Nuages","Mer","Soleil","Nulle part"],ok:1},
{q:"Eau infiltrée = ?",opts:["Nuages","Sources","Puits","Mers"],ok:1},
{q:"Cycle = ?",opts:["Fini","Perpétuel","Inutile","Lent"],ok:1}
  ],
  15: [
{q:"Eau = ?",opts:["Solide","Solvant","Gaz","Métal"],ok:1},
{q:"Soluble eau ?",opts:["Sable","Sucre","Huile","Pierre"],ok:1},
{q:"Saturée = ?",opts:["Peut","Ne peut plus","Chaude","Froide"],ok:1},
{q:"Cristaux par ?",opts:["Chauffage","Évaporation","Congélation","Fusion"],ok:1},
{q:"Sel vient ?",opts:["Montagnes","Marais","Rivières","Usines"],ok:1},
{q:"Soluble = ?",opts:["Pas","Se dissout","Gaz","Solide"],ok:1}
  ],

  16: [
{q:"Air composé ?",opts:["Oxygène+azote","Eau+sel","Sable","Fer"],ok:0},
{q:"L'air = ?",opts:["Gaz","Liquide","Solide","Métal"],ok:0},
{q:"1L air = ?",opts:["0g","1,3g","10g","100g"],ok:1},
{q:"Vent = ?",opts:["Froid","Air mouv.","Eau","Nuage"],ok:1},
{q:"Atmosphère = ?",opts:["Eau","Air","Soleil","Lune"],ok:1},
{q:"Air permet ?",opts:["Manger","Respirer","Dormir","Courir"],ok:1}
  ],
  17: [
{q:"Pression = ?",opts:["Eau","Air","Vent","Sol"],ok:1},
{q:"Siphon utilise ?",opts:["Chaleur","Pression","Froid","Électricité"],ok:1},
{q:"Baro mesure ?",opts:["Température","Pression","Vent","Pluie"],ok:1},
{q:"Baromètres ?",opts:["Eau/air","Mercure/métal","Vent/pluie","Gaz"],ok:1},
{q:"Pression sens ?",opts:["Haut","Bas","Tous","Côté"],ok:2},
{q:"Altitude = ?",opts:["Augmente","Diminue","Pareil","Disparaît"],ok:1}
  ],
  18: [
{q:"Dilatation = ?",opts:["Volume-","Volume+","Poids","Couleur"],ok:1},
{q:"Contraction = ?",opts:["Volume+","Volume-","Chaud","Rien"],ok:1},
{q:"Thermo = ?",opts:["Pression","Température","Vent","Humidité"],ok:1},
{q:"Thermo contient ?",opts:["Eau","Alcool/mercure","Sable","Air"],ok:1},
{q:"Mercure monte = ?",opts:["Froid","Chaud","Humide","Sec"],ok:1},
{q:"Corps dilatés ?",opts:["Solides","Liquides","Gaz","Tous"],ok:3}
  ],
  19: [
{q:"Digestion dans ?",opts:["Cœur","Tube digestif","Poumons","Cerveau"],ok:1},
{q:"1er organe ?",opts:["Œsophage","Bouche","Estomac","Intestin"],ok:1},
{q:"Œsophage = ?",opts:["Bouche","Estomac","Intestin","Cœur"],ok:1},
{q:"Estomac ?",opts:["Absorbe eau","Brasse","Mâche","Évacue"],ok:1},
{q:"Nutriments dans ?",opts:["Estomac","Intestin grêle","Gros intestin","Bouche"],ok:1},
{q:"Parties ?",opts:["3","4","5","6"],ok:2}
  ],
  21: [
{q:"Litres sang ?",opts:["2L","3L","5L","10L"],ok:2},
{q:"Plasma = ?",opts:["Liquide clair","Gaz","Solide","Cellule"],ok:0},
{q:"Grande circ = ?",opts:["Cœur→poum.","Cœur→org.","Poum.→cœur","Org.→poum."],ok:1},
{q:"Petite circ = ?",opts:["Cœur→poum.","Cœur→org.","Poum.→org.","Org.→cœur"],ok:0},
{q:"Alcool = ?",opts:["Cœur","Os","Cheveux","Peau"],ok:0},
{q:"Sport = ?",opts:["Paresse","Circulation","Maladie","Sommeil"],ok:1}
  ],};

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
