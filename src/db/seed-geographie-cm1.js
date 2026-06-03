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
// seed-geographie-cm1.js
// Intègre les 13 leçons de Géographie CM1 dans la plateforme Taté
// Leçons : 2,3,4,5,6,7,8,9,10,11,12,13,14
//
// Usage : node src/db/seed-geographie-cm1.js
// ============================================================

const LECONS_DATA = [

  {
    ordre: 2,
    titre: "Le Planisphère",
    objectif: "Connaître le planisphère, les continents, les océans, l'équateur et les tropiques",
    promptSupplement: "Utilise des exemples concrets africains et sénégalais. Vocabulaire adapté aux élèves de CM1.",
    contenuHTML: `
<h1>🌍 Leçon 2 : Le Planisphère</h1>

<div class="bloc-essentiel">
  <p><strong>Le planisphère</strong> est une <mark>carte</mark> représentant le <mark>monde</mark> avec ses <strong>cinq continents</strong> et ses <strong>cinq océans</strong>.</p>
</div>

<h2>🌎 Les cinq continents</h2>
<ul>
  <li><strong>Afrique</strong></li>
  <li><strong>Amérique</strong></li>
  <li><strong>Asie</strong></li>
  <li><strong>Europe</strong></li>
  <li><strong>Océanie</strong></li>
</ul>

<h2>🌊 Les cinq océans</h2>
<ul>
  <li>L'océan <strong>Atlantique</strong></li>
  <li>L'océan <strong>Pacifique</strong></li>
  <li>L'océan <strong>Arctique</strong></li>
  <li>L'océan <strong>Antarctique</strong></li>
  <li>L'océan <strong>Indien</strong></li>
</ul>

<h2>📏 L'Équateur et les Tropiques</h2>
<div class="bloc-definition">
  <p>🔵 <strong>L'Équateur</strong> est une ligne imaginaire qui sépare la Terre en deux parties égales : <mark>l'hémisphère Nord</mark> et <mark>l'hémisphère Sud</mark>.</p>
</div>
<div class="bloc-definition">
  <p>🟠 <strong>Les tropiques</strong> sont des lignes parallèles à l'Équateur. Il y en a deux :</p>
  <ul>
    <li>Le <strong>tropique du Cancer</strong> → au Nord</li>
    <li>Le <strong>tropique du Capricorne</strong> → au Sud</li>
  </ul>
</div>

<div class="bloc-astuce">
  💡 <strong>Le Sénégal</strong> se trouve sur le continent africain, entre l'Équateur et le tropique du Cancer !
</div>
`,
    exercices: [
      { question: "Qu'est-ce qu'un planisphère ?", reponse: "Une carte représentant le monde avec ses continents et ses océans.", explication: "Le planisphère montre tous les continents et océans du monde à plat." },
      { question: "Cite les cinq continents.", reponse: "Afrique, Amérique, Asie, Europe, Océanie.", explication: "Il existe 5 grands continents sur Terre." },
      { question: "Qu'est-ce que l'Équateur ?", reponse: "Une ligne imaginaire qui sépare la Terre en hémisphère Nord et hémisphère Sud.", explication: "L'Équateur divise le globe en deux parties égales." },
      { question: "Nomme les deux tropiques.", reponse: "Le tropique du Cancer (Nord) et le tropique du Capricorne (Sud).", explication: "Les tropiques sont parallèles à l'Équateur." },
      { question: "Cite trois océans.", reponse: "L'océan Atlantique, le Pacifique, l'Indien (ou Arctique, Antarctique).", explication: "Il y a cinq océans en tout sur la Terre." },
    ,
      { question: "Quels sont les cinq océans de la Terre ?", reponse: "Atlantique, Pacifique, Arctique, Antarctique et Indien.", explication: "Cinq océans couvrent la Terre." },
      { question: "Que sépare l\'Équateur ?", reponse: "La Terre en deux : hémisphère Nord et hémisphère Sud.", explication: "L\'Équateur est une ligne imaginaire." },
      { question: "Où se trouve le tropique du Capricorne ?", reponse: "Au Sud de l\'Équateur.", explication: "Cancer au Nord, Capricorne au Sud." },
      { question: "Sur quel continent se trouve le Sénégal ?", reponse: "Sur le continent africain.", explication: "Le Sénégal est en Afrique de l\'Ouest." },
      { question: "Entre quelles lignes se trouve le Sénégal ?", reponse: "Entre l\'Équateur et le tropique du Cancer.", explication: "Zone intertropicale nord." }
    ],
    qcm: [
      { enonce: "Combien y a-t-il de continents sur Terre ?", options: [{lettre:'A',texte:'Trois'},{lettre:'B',texte:'Quatre'},{lettre:'C',texte:'Cinq'},{lettre:'D',texte:'Six'}], reponseCorrecte:'C', explication:"Il y a cinq continents : Afrique, Amérique, Asie, Europe et Océanie." },
      { enonce: "Qu'est-ce que le planisphère ?", options: [{lettre:'A',texte:"Un globe terrestre"},{lettre:'B',texte:"Une carte du monde à plat"},{lettre:'C',texte:"Un livre de géographie"},{lettre:'D',texte:"Une photo satellite"}], reponseCorrecte:'B', explication:"Le planisphère est une représentation plane (à plat) du monde entier." },
      { enonce: "Quel est le nom de la ligne qui sépare la Terre en hémisphère Nord et Sud ?", options: [{lettre:'A',texte:"Le méridien"},{lettre:'B',texte:"Le tropique"},{lettre:'C',texte:"L'Équateur"},{lettre:'D',texte:"La latitude"}], reponseCorrecte:'C', explication:"L'Équateur est la ligne imaginaire qui sépare le globe en deux hémisphères." },
      { enonce: "Le tropique du Cancer est situé :", options: [{lettre:'A',texte:"Au Sud de l'Équateur"},{lettre:'B',texte:"Au Nord de l'Équateur"},{lettre:'C',texte:"Sur l'Équateur"},{lettre:'D',texte:"En Amérique"}], reponseCorrecte:'B', explication:"Le tropique du Cancer est au Nord, le Capricorne est au Sud." },
      { enonce: "Combien y a-t-il d'océans sur Terre ?", options: [{lettre:'A',texte:'Trois'},{lettre:'B',texte:'Quatre'},{lettre:'C',texte:'Cinq'},{lettre:'D',texte:'Six'}], reponseCorrecte:'C', explication:"Il y a cinq océans : Atlantique, Pacifique, Arctique, Antarctique et Indien." },
    ,
      { enonce: "Le Sénégal se trouve sur quel continent ?", options: [{lettre:"A",texte:"Europe"},{lettre:"B",texte:"Asie"},{lettre:"C",texte:"Afrique"},{lettre:"D",texte:"Amérique"}], reponseCorrecte:'C', explication:"Afrique." },
      { enonce: "Les tropiques sont :", options: [{lettre:"A",texte:"Des lignes parallèles à l'Équateur"},{lettre:"B",texte:"Des pays chauds"},{lettre:"C",texte:"Des océans"},{lettre:"D",texte:"Des montagnes"}], reponseCorrecte:'A', explication:"Parallèles à l'Équateur." },
      { enonce: "Quel océan borde le Sénégal à l'Ouest ?", options: [{lettre:"A",texte:"Pacifique"},{lettre:"B",texte:"Indien"},{lettre:"C",texte:"Atlantique"},{lettre:"D",texte:"Arctique"}], reponseCorrecte:'C', explication:"Océan Atlantique." },
      { enonce: "L'Équateur sépare la Terre en :", options: [{lettre:"A",texte:"Est et Ouest"},{lettre:"B",texte:"Nord et Sud"},{lettre:"C",texte:"Tropiques et pôles"},{lettre:"D",texte:"Continents et océans"}], reponseCorrecte:'B', explication:"Hémisphère Nord et Sud." },
      { enonce: "Quel océan entoure le pôle Sud ?", options: [{lettre:"A",texte:"Arctique"},{lettre:"B",texte:"Antarctique"},{lettre:"C",texte:"Atlantique"},{lettre:"D",texte:"Indien"}], reponseCorrecte:'B', explication:"Océan Antarctique." }
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 3 : LE SÉNÉGAL : SITUATION, LIMITES, ÉTENDUE
  // ══════════════════════════════════════════════════════════

  {
    ordre: 3,
    titre: "Le Sénégal : Situation, Limites, Étendue",
    objectif: "Connaître la situation géographique, les limites et les dimensions du Sénégal",
    promptSupplement: "Insiste sur les pays voisins et la position du Sénégal en Afrique de l'Ouest.",
    contenuHTML: `
<h1>🗺️ Leçon 3 : Le Sénégal — Situation, Limites, Étendue</h1>

<div class="bloc-essentiel">
  <p>Le Sénégal se situe à <mark>l'extrême Ouest de l'Afrique</mark> dans la <strong>zone intertropicale</strong>.</p>
</div>

<h2>🧭 Les limites du Sénégal</h2>
<ul>
  <li>Au <strong>Nord</strong> : la <mark>Mauritanie</mark></li>
  <li>À l'<strong>Est</strong> : le <mark>Mali</mark></li>
  <li>Au <strong>Sud</strong> : la <mark>Guinée Bissau</mark> et la <mark>Guinée Conakry</mark></li>
  <li>À l'<strong>Ouest</strong> : l'<mark>océan Atlantique</mark></li>
</ul>

<div class="bloc-important">
  🔴 <strong>La Gambie</strong> est une <mark>enclave</mark> longue de <strong>300 km</strong> à l'intérieur du Sénégal.
</div>

<h2>📐 L'étendue du Sénégal</h2>
<ul>
  <li>Du <strong>Nord au Sud</strong> : <mark>500 km</mark></li>
  <li>De l'<strong>Ouest à l'Est</strong> : <mark>600 km</mark></li>
  <li><strong>Superficie</strong> : <mark>196 712 km²</mark></li>
</ul>

<div class="bloc-definition">
  📌 <strong>Zone intertropicale</strong> = zone située entre les deux tropiques → zone très chaude.
</div>
`,
    exercices: [
      { question: "Où se situe le Sénégal en Afrique ?", reponse: "À l'extrême Ouest de l'Afrique, dans la zone intertropicale.", explication: "Le Sénégal est le pays le plus à l'ouest du continent africain." },
      { question: "Quel pays est une enclave dans le Sénégal ?", reponse: "La Gambie, longue de 300 km.", explication: "La Gambie est entièrement entourée par le Sénégal sauf à l'ouest où elle touche l'Atlantique." },
      { question: "Quelle est la superficie du Sénégal ?", reponse: "196 712 km².", explication: "C'est la superficie totale du territoire sénégalais." },
      { question: "Quel pays limite le Sénégal à l'Est ?", reponse: "Le Mali.", explication: "Le Mali est le voisin à l'est du Sénégal." },
      { question: "Quelle mer/océan borde le Sénégal à l'Ouest ?", reponse: "L'océan Atlantique.", explication: "Le Sénégal a une façade maritime sur l'Atlantique." },
    ,
      { question: "Quels pays limitent le Sénégal au Sud ?", reponse: "La Guinée Bissau et la Guinée Conakry.", explication: "Les deux Guinées." },
      { question: "Quel pays limite le Sénégal au Nord ?", reponse: "La Mauritanie.", explication: "La Mauritanie au nord." },
      { question: "Qu\'est-ce que la zone intertropicale ?", reponse: "Zone située entre les deux tropiques, très chaude.", explication: "Le Sénégal y est situé." },
      { question: "Quelle est la distance du Nord au Sud du Sénégal ?", reponse: "500 km.", explication: "Du nord au sud." },
      { question: "Quelle est la distance de l\'Ouest à l\'Est du Sénégal ?", reponse: "600 km.", explication: "D\'ouest en est." }
    ],
    qcm: [
      { enonce: "Le Sénégal est situé :", options: [{lettre:'A',texte:"À l'Est de l'Afrique"},{lettre:'B',texte:"À l'extrême Ouest de l'Afrique"},{lettre:'C',texte:"Au centre de l'Afrique"},{lettre:'D',texte:"Au Nord de l'Afrique"}], reponseCorrecte:'B', explication:"Le Sénégal est situé à l'extrême Ouest du continent africain." },
      { enonce: "La Gambie est :", options: [{lettre:'A',texte:"Un fleuve du Sénégal"},{lettre:'B',texte:"Une région du Sénégal"},{lettre:'C',texte:"Une enclave dans le Sénégal"},{lettre:'D',texte:"Un pays au nord du Sénégal"}], reponseCorrecte:'C', explication:"La Gambie est un pays enclavé à l'intérieur du territoire sénégalais." },
      { enonce: "Quelle est la superficie du Sénégal ?", options: [{lettre:'A',texte:"96 712 km²"},{lettre:'B',texte:"196 712 km²"},{lettre:'C',texte:"296 712 km²"},{lettre:'D',texte:"156 000 km²"}], reponseCorrecte:'B', explication:"La superficie du Sénégal est de 196 712 km²." },
      { enonce: "Quel pays borde le Sénégal au Nord ?", options: [{lettre:'A',texte:"Le Mali"},{lettre:'B',texte:"La Guinée Bissau"},{lettre:'C',texte:"La Mauritanie"},{lettre:'D',texte:"La Gambie"}], reponseCorrecte:'C', explication:"La Mauritanie est le pays voisin au nord du Sénégal." },
      { enonce: "Le Sénégal se trouve dans :", options: [{lettre:'A',texte:"La zone polaire"},{lettre:'B',texte:"La zone tempérée"},{lettre:'C',texte:"La zone intertropicale"},{lettre:'D',texte:"La zone arctique"}], reponseCorrecte:'C', explication:"Le Sénégal est dans la zone intertropicale, entre les deux tropiques — zone très chaude." },
    ,
      { enonce: "La Gambie est une enclave longue de :", options: [{lettre:"A",texte:"100 km"},{lettre:"B",texte:"200 km"},{lettre:"C",texte:"300 km"},{lettre:"D",texte:"500 km"}], reponseCorrecte:'C', explication:"300 km." },
      { enonce: "Quels pays limitent le Sénégal au Sud ?", options: [{lettre:"A",texte:"Mali et Mauritanie"},{lettre:"B",texte:"Guinée Bissau et Guinée Conakry"},{lettre:"C",texte:"Gambie et Guinée"},{lettre:"D",texte:"Mali et Gambie"}], reponseCorrecte:'B', explication:"Les deux Guinées." },
      { enonce: "Distance du Nord au Sud du Sénégal ?", options: [{lettre:"A",texte:"400 km"},{lettre:"B",texte:"500 km"},{lettre:"C",texte:"600 km"},{lettre:"D",texte:"700 km"}], reponseCorrecte:'B', explication:"500 km." },
      { enonce: "Distance de l'Ouest à l'Est du Sénégal ?", options: [{lettre:"A",texte:"400 km"},{lettre:"B",texte:"500 km"},{lettre:"C",texte:"600 km"},{lettre:"D",texte:"700 km"}], reponseCorrecte:'C', explication:"600 km." },
      { enonce: "Le Sénégal est à l'extrême Ouest de :", options: [{lettre:"A",texte:"L'Europe"},{lettre:"B",texte:"L'Amérique"},{lettre:"C",texte:"L'Afrique"},{lettre:"D",texte:"L'Asie"}], reponseCorrecte:'C', explication:"Afrique." }
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 4 : LE RELIEF DU SÉNÉGAL
  // ══════════════════════════════════════════════════════════

  {
    ordre: 4,
    titre: "Le Relief du Sénégal",
    objectif: "Identifier les différentes formes de relief du Sénégal et leurs caractéristiques",
    promptSupplement: "Utilise des exemples locaux sénégalais. Explique chaque terme de relief simplement.",
    contenuHTML: `
<h1>⛰️ Leçon 4 : Le Relief du Sénégal</h1>

<div class="bloc-essentiel">
  <p>Le Sénégal est dans l'ensemble une <mark>vaste plaine</mark> au <strong>relief monotone</strong> (peu accidenté).</p>
</div>

<div class="bloc-definition">
  📌 <strong>Le relief</strong> = l'ensemble des irrégularités du sol observées à la surface de la Terre.
</div>

<h2>🏔️ Les principaux accidents du relief</h2>
<ul>
  <li>Le <strong>massif de Ndiass</strong> → <mark>90 m</mark></li>
  <li>Les <strong>collines des Mamelles</strong> → <mark>105 m</mark></li>
  <li>Le <strong>plateau de Thiès</strong> → <mark>128 m</mark></li>
  <li>Les <strong>collines de Kédougou</strong> → <mark>581 m</mark> (le point le plus haut !)</li>
</ul>

<h2>🗻 Les formes du relief</h2>
<p>Le relief se décompose en :</p>
<ul>
  <li><strong>Vallées</strong> — zones basses entre les reliefs</li>
  <li><strong>Plaines</strong> — étendues plates</li>
  <li><strong>Plateaux</strong> — surfaces élevées et planes</li>
  <li><strong>Collines</strong> — petites élévations arrondies</li>
  <li><strong>Montagnes</strong> — grandes élévations</li>
</ul>
`,
    exercices: [
      { question: "Comment est le relief général du Sénégal ?", reponse: "C'est une vaste plaine au relief monotone (peu accidenté).", explication: "Le Sénégal n'a pas de hautes montagnes, c'est un pays essentiellement plat." },
      { question: "Quel est le point le plus haut du Sénégal ?", reponse: "Les collines de Kédougou (581 m).", explication: "Kédougou, au sud-est, est la zone la plus élevée du Sénégal." },
      { question: "Qu'est-ce que le relief ?", reponse: "L'ensemble des irrégularités du sol observées à la surface de la Terre.", explication: "Le relief désigne toutes les formes du terrain : plaines, collines, montagnes, vallées." },
      { question: "Cite deux formes de relief.", reponse: "Les vallées et les plaines (ou plateaux, collines, montagnes).", explication: "Il existe cinq formes de relief principales au Sénégal." },
      { question: "Quelle est la hauteur du plateau de Thiès ?", reponse: "128 m.", explication: "Le plateau de Thiès est une des élévations notables du Sénégal." },
    ,
      { question: "Quels sont les quatre principaux accidents du relief au Sénégal ? Donne leurs hauteurs.", reponse: "Massif de Ndiass 90m, collines des Mamelles 105m, plateau de Thiès 128m, collines de Kédougou 581m.", explication: "Les quatre reliefs principaux." },
      { question: "Quel est le point le plus haut du Sénégal ?", reponse: "Les collines de Kédougou (581 m).", explication: "Point culminant du Sénégal." },
      { question: "Comment est le relief général du Sénégal ?", reponse: "C\'est une vaste plaine au relief peu accidenté.", explication: "Le Sénégal est essentiellement plat." },
      { question: "Qu\'est-ce que le relief ?", reponse: "L\'ensemble des irrégularités du sol à la surface de la Terre.", explication: "Toutes les formes du terrain." },
      { question: "Quelles sont les cinq formes de relief ?", reponse: "Vallées, plaines, plateaux, collines, montagnes.", explication: "Cinq formes principales." },
      { question: "Où se situent les collines de Kédougou ?", reponse: "Au Sud-Est du Sénégal.", explication: "Sud-Est." }
    ],
    qcm: [
      { enonce: "Le relief général du Sénégal est :", options: [{lettre:'A',texte:"Très montagneux"},{lettre:'B',texte:"Une vaste plaine monotone"},{lettre:'C',texte:"Un désert"},{lettre:'D',texte:"Un plateau élevé"}], reponseCorrecte:'B', explication:"Le Sénégal est une vaste plaine au relief peu accidenté." },
      { enonce: "Le point le plus haut du Sénégal est :", options: [{lettre:'A',texte:"Le plateau de Thiès (128m)"},{lettre:'B',texte:"Le massif de Ndiass (90m)"},{lettre:'C',texte:"Les collines de Kédougou (581m)"},{lettre:'D',texte:"Les Mamelles (105m)"}], reponseCorrecte:'C', explication:"Les collines de Kédougou, à 581m, constituent le point culminant du Sénégal." },
      { enonce: "Quelle est la hauteur des Mamelles ?", options: [{lettre:'A',texte:"90 m"},{lettre:'B',texte:"105 m"},{lettre:'C',texte:"128 m"},{lettre:'D',texte:"581 m"}], reponseCorrecte:'B', explication:"Les collines des Mamelles (Dakar) s'élèvent à 105 mètres." },
      { enonce: "Le relief désigne :", options: [{lettre:'A',texte:"Les rivières d'un pays"},{lettre:'B',texte:"Le climat d'une région"},{lettre:'C',texte:"Les irrégularités du sol à la surface de la Terre"},{lettre:'D',texte:"La végétation d'une zone"}], reponseCorrecte:'C', explication:"Le relief = l'ensemble des formes du terrain (plaines, collines, montagnes...)." },
      { enonce: "Le plateau de Thiès s'élève à :", options: [{lettre:'A',texte:"90 m"},{lettre:'B',texte:"105 m"},{lettre:'C',texte:"128 m"},{lettre:'D',texte:"200 m"}], reponseCorrecte:'C', explication:"Le plateau de Thiès culmine à 128 mètres d'altitude." },
    ,
      { enonce: "Le relief général du Sénégal est :", options: [{lettre:"A",texte:"Très montagneux"},{lettre:"B",texte:"Une vaste plaine"},{lettre:"C",texte:"Un désert"},{lettre:"D",texte:"Un plateau élevé"}], reponseCorrecte:'B', explication:"Vaste plaine." },
      { enonce: "Le point culminant du Sénégal est :", options: [{lettre:"A",texte:"Le plateau de Thiès 128m"},{lettre:"B",texte:"Le massif de Ndiass 90m"},{lettre:"C",texte:"Les collines de Kédougou 581m"},{lettre:"D",texte:"Les Mamelles 105m"}], reponseCorrecte:'C', explication:"Collines de Kédougou 581m." },
      { enonce: "Les collines des Mamelles culminent à :", options: [{lettre:"A",texte:"90 m"},{lettre:"B",texte:"105 m"},{lettre:"C",texte:"128 m"},{lettre:"D",texte:"581 m"}], reponseCorrecte:'B', explication:"105 m." },
      { enonce: "Le relief désigne :", options: [{lettre:"A",texte:"Les rivières"},{lettre:"B",texte:"Le climat"},{lettre:"C",texte:"Les irrégularités du sol"},{lettre:"D",texte:"La végétation"}], reponseCorrecte:'C', explication:"Irrégularités du sol." },
      { enonce: "Le plateau de Thiès s'élève à :", options: [{lettre:"A",texte:"90 m"},{lettre:"B",texte:"105 m"},{lettre:"C",texte:"128 m"},{lettre:"D",texte:"200 m"}], reponseCorrecte:'C', explication:"128 m." },
      { enonce: "Le massif de Ndiass culmine à :", options: [{lettre:"A",texte:"90 m"},{lettre:"B",texte:"105 m"},{lettre:"C",texte:"128 m"},{lettre:"D",texte:"200 m"}], reponseCorrecte:'A', explication:"90 m." },
      { enonce: "Les collines de Kédougou culminent à :", options: [{lettre:"A",texte:"90 m"},{lettre:"B",texte:"105 m"},{lettre:"C",texte:"128 m"},{lettre:"D",texte:"581 m"}], reponseCorrecte:'D', explication:"581 m." },
      { enonce: "Combien de formes de relief sont citées ?", options: [{lettre:"A",texte:"3"},{lettre:"B",texte:"4"},{lettre:"C",texte:"5"},{lettre:"D",texte:"6"}], reponseCorrecte:'C', explication:"5 formes." },
      { enonce: "Les collines de Kédougou sont situées :", options: [{lettre:"A",texte:"Au Nord"},{lettre:"B",texte:"À l'Ouest"},{lettre:"C",texte:"Au Sud-Est"},{lettre:"D",texte:"Au Centre"}], reponseCorrecte:'C', explication:"Sud-Est." },
      { enonce: "Les collines sont des :", options: [{lettre:"A",texte:"Grandes élévations"},{lettre:"B",texte:"Petites élévations arrondies"},{lettre:"C",texte:"Surfaces planes"},{lettre:"D",texte:"Zones basses"}], reponseCorrecte:'B', explication:"Petites élévations." }
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 5 : LE CLIMAT DU SÉNÉGAL
  // ══════════════════════════════════════════════════════════

  {
    ordre: 5,
    titre: "Le Climat du Sénégal",
    objectif: "Connaître le type de climat du Sénégal, ses vents et ses zones climatiques",
    promptSupplement: "Utilise des exemples de la vie quotidienne sénégalaise (hivernage, saison sèche).",
    contenuHTML: `
<h1>☀️ Leçon 5 : Le Climat du Sénégal</h1>

<div class="bloc-essentiel">
  <p>Le Sénégal possède un <mark>climat tropical</mark> avec <strong>deux saisons</strong> : une <strong>saison sèche</strong> et une <strong>saison des pluies</strong> (hivernage).</p>
</div>

<div class="bloc-definition">
  📌 Les critères qui définissent un climat : <strong>la température</strong>, <strong>les vents</strong> et <strong>les pluies</strong> (précipitations).
</div>

<h2>💨 Les principaux vents</h2>
<ul>
  <li><strong>L'alizé maritime</strong> → vent frais et humide provenant de la mer</li>
  <li><strong>La mousson</strong> → vent humide qui <mark>apporte la pluie</mark></li>
  <li><strong>L'harmattan</strong> → vent chaud et sec venant du <mark>désert du Sahara</mark></li>
</ul>

<h2>🌡️ Les types de climat au Sénégal</h2>
<ul>
  <li>Le climat <strong>soudanien</strong> → chaud et sec</li>
  <li>Le climat <strong>sahélien</strong> → plus chaud et plus sec</li>
  <li>Le climat <strong>côtier</strong> → frais et humide</li>
  <li>Le climat de la <strong>basse Casamance</strong> → chaud et <mark>très pluvieux</mark></li>
</ul>
`,
    exercices: [
      { question: "Quel type de climat possède le Sénégal ?", reponse: "Un climat tropical avec une saison sèche et une saison des pluies.", explication: "Le Sénégal a deux saisons principales : la saison sèche et l'hivernage." },
      { question: "Qu'est-ce que l'harmattan ?", reponse: "Un vent chaud et sec qui vient du désert du Sahara.", explication: "L'harmattan souffle depuis le Sahara vers la côte, apportant de la chaleur et de la sécheresse." },
      { question: "Cite les trois critères qui définissent un climat.", reponse: "La température, les vents et les pluies (précipitations).", explication: "Ces trois éléments caractérisent le type de climat d'une région." },
      { question: "Quel vent apporte la pluie au Sénégal ?", reponse: "La mousson.", explication: "La mousson est un vent humide qui déclenche la saison des pluies." },
      { question: "Comment est le climat de la basse Casamance ?", reponse: "Chaud et très pluvieux.", explication: "La Casamance est la région la plus arrosée du Sénégal." },
    ,
      { question: "Quels sont les principaux vents qui soufflent au Sénégal ?", reponse: "L\'alizé maritime, la mousson et l\'harmattan.", explication: "Trois vents." },
      { question: "Qu\'est-ce que la mousson ?", reponse: "Un vent humide qui apporte la pluie.", explication: "La mousson amène la pluie." },
      { question: "Qu\'est-ce que l\'harmattan ?", reponse: "Un vent chaud et sec qui vient du désert du Sahara.", explication: "Vent chaud du Sahara." },
      { question: "Qu\'est-ce que l\'alizé maritime ?", reponse: "Un vent frais et humide provenant de la mer.", explication: "L\'alizé adoucit le climat côtier." },
      { question: "Cite les quatre types de climat au Sénégal.", reponse: "Soudanien, sahélien, côtier, basse Casamance.", explication: "Quatre zones climatiques." },
      { question: "Comment est le climat de la basse Casamance ?", reponse: "Chaud et très pluvieux.", explication: "Région la plus arrosée." },
      { question: "Comment est le climat sahélien ?", reponse: "Plus chaud et plus sec.", explication: "Sahel très sec." },
      { question: "Comment est le climat côtier ?", reponse: "Frais et humide.", explication: "Grâce à l\'océan." }
    ],
    qcm: [
      { enonce: "Le Sénégal a un climat :", options: [{lettre:'A',texte:"Polaire"},{lettre:'B',texte:"Tropical"},{lettre:'C',texte:"Désertique"},{lettre:'D',texte:"Tempéré"}], reponseCorrecte:'B', explication:"Le Sénégal a un climat tropical avec saison sèche et saison des pluies." },
      { enonce: "L'harmattan est :", options: [{lettre:'A',texte:"Un vent frais venant de la mer"},{lettre:'B',texte:"Un vent humide apportant la pluie"},{lettre:'C',texte:"Un vent chaud et sec du Sahara"},{lettre:'D',texte:"Un vent froid du nord"}], reponseCorrecte:'C', explication:"L'harmattan est un vent chaud et sec qui vient du désert du Sahara." },
      { enonce: "Quel vent apporte la pluie au Sénégal ?", options: [{lettre:'A',texte:"L'harmattan"},{lettre:'B',texte:"L'alizé"},{lettre:'C',texte:"La mousson"},{lettre:'D',texte:"Le sirocco"}], reponseCorrecte:'C', explication:"La mousson est le vent humide responsable de la saison des pluies." },
      { enonce: "Le climat de la basse Casamance est :", options: [{lettre:'A',texte:"Sahélien"},{lettre:'B',texte:"Soudanien"},{lettre:'C',texte:"Côtier"},{lettre:'D',texte:"Chaud et très pluvieux"}], reponseCorrecte:'D', explication:"La basse Casamance a un climat chaud et très pluvieux, le plus humide du pays." },
      { enonce: "Combien y a-t-il de saisons au Sénégal ?", options: [{lettre:'A',texte:"Une"},{lettre:'B',texte:"Deux"},{lettre:'C',texte:"Trois"},{lettre:'D',texte:"Quatre"}], reponseCorrecte:'B', explication:"Le Sénégal a deux saisons : la saison sèche et la saison des pluies (hivernage)." },
    ,
      { enonce: "Le Sénégal a un climat :", options: [{lettre:"A",texte:"Polaire"},{lettre:"B",texte:"Tropical"},{lettre:"C",texte:"Désertique"},{lettre:"D",texte:"Tempéré"}], reponseCorrecte:'B', explication:"Tropical." },
      { enonce: "L'harmattan est :", options: [{lettre:"A",texte:"Un vent frais de la mer"},{lettre:"B",texte:"Un vent humide apportant la pluie"},{lettre:"C",texte:"Un vent chaud et sec du Sahara"},{lettre:"D",texte:"Un vent froid du nord"}], reponseCorrecte:'C', explication:"Chaud et sec du Sahara." },
      { enonce: "Quel vent apporte la pluie au Sénégal ?", options: [{lettre:"A",texte:"L'harmattan"},{lettre:"B",texte:"L'alizé"},{lettre:"C",texte:"La mousson"},{lettre:"D",texte:"Le sirocco"}], reponseCorrecte:'C', explication:"La mousson." },
      { enonce: "Quels sont les trois vents principaux du Sénégal ?", options: [{lettre:"A",texte:"Alizé, harmattan, cyclone"},{lettre:"B",texte:"Mousson, harmattan, alizé maritime"},{lettre:"C",texte:"Typhon, mousson, tornade"},{lettre:"D",texte:"Alizé, mousson, sirocco"}], reponseCorrecte:'B', explication:"Mousson, harmattan, alizé." },
      { enonce: "Le climat sahélien est :", options: [{lettre:"A",texte:"Frais et humide"},{lettre:"B",texte:"Chaud et très pluvieux"},{lettre:"C",texte:"Plus chaud et plus sec"},{lettre:"D",texte:"Tempéré"}], reponseCorrecte:'C', explication:"Plus chaud et plus sec." },
      { enonce: "Les critères du climat sont :", options: [{lettre:"A",texte:"Le soleil et la lune"},{lettre:"B",texte:"La température, les vents et les pluies"},{lettre:"C",texte:"Les saisons et les années"},{lettre:"D",texte:"Les mers et les océans"}], reponseCorrecte:'B', explication:"Température, vents, pluies." },
      { enonce: "Le climat de la basse Casamance est :", options: [{lettre:"A",texte:"Sahélien"},{lettre:"B",texte:"Soudanien"},{lettre:"C",texte:"Frais et humide"},{lettre:"D",texte:"Chaud et très pluvieux"}], reponseCorrecte:'D', explication:"Chaud et très pluvieux." },
      { enonce: "Le climat côtier au Sénégal est :", options: [{lettre:"A",texte:"Chaud et sec"},{lettre:"B",texte:"Frais et humide"},{lettre:"C",texte:"Très pluvieux"},{lettre:"D",texte:"Glacial"}], reponseCorrecte:'B', explication:"Frais et humide." },
      { enonce: "Combien de saisons au Sénégal ?", options: [{lettre:"A",texte:"Une"},{lettre:"B",texte:"Deux"},{lettre:"C",texte:"Trois"},{lettre:"D",texte:"Quatre"}], reponseCorrecte:'B', explication:"Deux : saison sèche et saison des pluies." },
      { enonce: "Quel vent vient du désert du Sahara ?", options: [{lettre:"A",texte:"L'alizé"},{lettre:"B",texte:"La mousson"},{lettre:"C",texte:"L'harmattan"},{lettre:"D",texte:"Le sirocco"}], reponseCorrecte:'C', explication:"L'harmattan." }
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 6 : LES COURS D'EAU AU SÉNÉGAL
  // ══════════════════════════════════════════════════════════

  {
    ordre: 6,
    titre: "Les Cours d'eau au Sénégal",
    objectif: "Connaître les principaux fleuves et lacs du Sénégal",
    promptSupplement: "Insiste sur l'importance des fleuves pour la vie des sénégalais.",
    contenuHTML: `
<h1>💧 Leçon 6 : Les Cours d'eau au Sénégal</h1>

<div class="bloc-essentiel">
  <p>Le Sénégal possède des cours d'eau dont le <mark>débit</mark> (le régime) <strong>dépend de la pluie</strong>.</p>
</div>

<h2>🏞️ Les principaux fleuves</h2>
<ul>
  <li>Le fleuve <strong>Sénégal</strong> (<mark>1 750 km</mark>) → source à <strong>Mamou</strong> en Guinée</li>
  <li>Le fleuve <strong>Gambie</strong> (<mark>1 150 km</mark>) → source au <strong>Fouta Djalon</strong> (Guinée)</li>
  <li>Le fleuve <strong>Casamance</strong> (petit fleuve) → source à l'intérieur du pays</li>
  <li>Le fleuve <strong>Sine</strong> et le fleuve <strong>Saloum</strong> → bras de mer</li>
</ul>

<h2>🏖️ Les principaux lacs</h2>
<ul>
  <li>Le <strong>lac de Guiers</strong> (Louga) → <mark>alimente Dakar en eau potable</mark></li>
  <li>Le <strong>lac Tanma</strong> (Thiès)</li>
  <li>Le <strong>lac Retba</strong> ou <mark>lac rose</mark> (Dakar)</li>
</ul>
`,
    exercices: [
      { question: "Quel est le fleuve le plus long du Sénégal ?", reponse: "Le fleuve Sénégal (1 750 km).", explication: "Le fleuve Sénégal prend sa source à Mamou en Guinée et fait 1 750 km." },
      { question: "Où prend sa source le fleuve Gambie ?", reponse: "Au Fouta Djalon, en Guinée.", explication: "Comme le fleuve Sénégal, la Gambie prend sa source dans les montagnes guinéennes." },
      { question: "Quel lac alimente Dakar en eau potable ?", reponse: "Le lac de Guiers (région de Louga).", explication: "Le lac de Guiers est la principale source d'eau potable pour la capitale Dakar." },
      { question: "Comment appelle-t-on le lac rose ?", reponse: "Le lac Retba (à Dakar).", explication: "Le lac Retba est célèbre pour sa couleur rose due à des micro-algues." },
      { question: "De quoi dépend le débit des cours d'eau au Sénégal ?", reponse: "De la pluie.", explication: "En saison sèche, les fleuves ont moins d'eau ; en hivernage, ils gonflent." },
    ,
      { question: "Quel est le fleuve le plus long du Sénégal ?", reponse: "Le fleuve Sénégal (1 750 km).", explication: "Source à Mamou en Guinée." },
      { question: "Où prend sa source le fleuve Sénégal ?", reponse: "À Mamou en Guinée.", explication: "Naît dans les montagnes guinéennes." },
      { question: "Où prend sa source le fleuve Gambie ?", reponse: "Au Fouta Djalon en Guinée.", explication: "1 150 km." },
      { question: "Quels sont les principaux lacs du Sénégal ?", reponse: "Lac de Guiers, lac Tanma, lac Retba.", explication: "Trois lacs principaux." },
      { question: "Quel lac alimente Dakar en eau potable ?", reponse: "Le lac de Guiers (Louga).", explication: "Eau potable pour Dakar." },
      { question: "Où se trouve le lac Retba ?", reponse: "À Dakar, c\'est le lac rose.", explication: "Sa couleur est due à des micro-algues." },
      { question: "Que sont le Sine et le Saloum ?", reponse: "Des bras de mer.", explication: "Pas de véritables fleuves." },
      { question: "De quoi dépend le débit des cours d\'eau ?", reponse: "De la pluie.", explication: "En hivernage ils gonflent." }
    ],
    qcm: [
      { enonce: "Le fleuve Sénégal mesure :", options: [{lettre:'A',texte:"1 150 km"},{lettre:'B',texte:"1 500 km"},{lettre:'C',texte:"1 750 km"},{lettre:'D',texte:"2 000 km"}], reponseCorrecte:'C', explication:"Le fleuve Sénégal fait 1 750 km, c'est le plus long fleuve du pays." },
      { enonce: "Le lac de Guiers est important parce qu'il :", options: [{lettre:'A',texte:"Produit du sel"},{lettre:'B',texte:"Alimente Dakar en eau potable"},{lettre:'C',texte:"Est de couleur rose"},{lettre:'D',texte:"Est le plus grand lac d'Afrique"}], reponseCorrecte:'B', explication:"Le lac de Guiers alimente la région de Dakar en eau potable." },
      { enonce: "Où prend sa source le fleuve Sénégal ?", options: [{lettre:'A',texte:"À Dakar"},{lettre:'B',texte:"Au Fouta Djalon"},{lettre:'C',texte:"À Mamou en Guinée"},{lettre:'D',texte:"Au Mali"}], reponseCorrecte:'C', explication:"Le fleuve Sénégal prend sa source à Mamou en Guinée." },
      { enonce: "Le lac rose (lac Retba) se trouve :", options: [{lettre:'A',texte:"À Louga"},{lettre:'B',texte:"À Thiès"},{lettre:'C',texte:"À Dakar"},{lettre:'D',texte:"À Ziguinchor"}], reponseCorrecte:'C', explication:"Le lac Retba ou lac rose est situé près de Dakar." },
      { enonce: "Le débit des fleuves au Sénégal dépend :", options: [{lettre:'A',texte:"Du vent"},{lettre:'B',texte:"De la pluie"},{lettre:'C',texte:"Du soleil"},{lettre:'D',texte:"De la mer"}], reponseCorrecte:'B', explication:"En saison des pluies, les fleuves grossissent ; en saison sèche, ils baissent." },
    ,
      { enonce: "Le fleuve Sénégal mesure :", options: [{lettre:"A",texte:"1 150 km"},{lettre:"B",texte:"1 500 km"},{lettre:"C",texte:"1 750 km"},{lettre:"D",texte:"2 000 km"}], reponseCorrecte:'C', explication:"1 750 km." },
      { enonce: "Le lac de Guiers alimente Dakar en :", options: [{lettre:"A",texte:"Sel"},{lettre:"B",texte:"Eau potable"},{lettre:"C",texte:"Poisson"},{lettre:"D",texte:"Électricité"}], reponseCorrecte:'B', explication:"Eau potable." },
      { enonce: "Où prend sa source le fleuve Sénégal ?", options: [{lettre:"A",texte:"À Dakar"},{lettre:"B",texte:"Au Fouta Djalon"},{lettre:"C",texte:"À Mamou en Guinée"},{lettre:"D",texte:"Au Mali"}], reponseCorrecte:'C', explication:"Mamou en Guinée." },
      { enonce: "Le fleuve Gambie mesure :", options: [{lettre:"A",texte:"750 km"},{lettre:"B",texte:"1 150 km"},{lettre:"C",texte:"1 750 km"},{lettre:"D",texte:"2 000 km"}], reponseCorrecte:'B', explication:"1 150 km." },
      { enonce: "Où prend sa source le fleuve Gambie ?", options: [{lettre:"A",texte:"Mamou"},{lettre:"B",texte:"Fouta Djalon"},{lettre:"C",texte:"Mali"},{lettre:"D",texte:"Bakel"}], reponseCorrecte:'B', explication:"Fouta Djalon." },
      { enonce: "Le lac rose est aussi appelé :", options: [{lettre:"A",texte:"Lac de Guiers"},{lettre:"B",texte:"Lac Tanma"},{lettre:"C",texte:"Lac Retba"},{lettre:"D",texte:"Lac Dakar"}], reponseCorrecte:'C', explication:"Lac Retba." },
      { enonce: "Le Sine et le Saloum sont :", options: [{lettre:"A",texte:"Des fleuves"},{lettre:"B",texte:"Des bras de mer"},{lettre:"C",texte:"Des lacs"},{lettre:"D",texte:"Des rivières"}], reponseCorrecte:'B', explication:"Bras de mer." },
      { enonce: "Le débit des cours d'eau dépend :", options: [{lettre:"A",texte:"Du vent"},{lettre:"B",texte:"De la pluie"},{lettre:"C",texte:"Du soleil"},{lettre:"D",texte:"De la mer"}], reponseCorrecte:'B', explication:"De la pluie." },
      { enonce: "Le lac de Guiers est dans la région de :", options: [{lettre:"A",texte:"Dakar"},{lettre:"B",texte:"Louga"},{lettre:"C",texte:"Thiès"},{lettre:"D",texte:"Kaolack"}], reponseCorrecte:'B', explication:"Louga." },
      { enonce: "Le fleuve Casamance prend sa source :", options: [{lettre:"A",texte:"En Guinée"},{lettre:"B",texte:"Au Mali"},{lettre:"C",texte:"Au Sénégal"},{lettre:"D",texte:"En Mauritanie"}], reponseCorrecte:'C', explication:"Au Sénégal." }
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 7 : LA MISE EN VALEUR DES COURS D'EAU
  // ══════════════════════════════════════════════════════════

  {
    ordre: 7,
    titre: "La Mise en Valeur des Cours d'eau",
    objectif: "Comprendre le rôle de l'OMVS et de l'OMVG dans la valorisation des fleuves",
    promptSupplement: "Explique l'importance des barrages pour les enfants de CM1 avec des exemples concrets.",
    contenuHTML: `
<h1>🏗️ Leçon 7 : La Mise en Valeur des Cours d'eau</h1>

<div class="bloc-essentiel">
  <p>Les pays riverains du fleuve Sénégal ont créé des organisations pour <mark>valoriser les fleuves</mark>.</p>
</div>

<h2>🤝 Les organisations</h2>
<div class="bloc-definition">
  <p>🔵 <strong>OMVS</strong> = Organisation pour la Mise en Valeur du fleuve <mark>Sénégal</mark><br>
  → Membres : <strong>Mauritanie, Mali, Guinée, Sénégal</strong></p>
</div>
<div class="bloc-definition">
  <p>🟢 <strong>OMVG</strong> = Organisation pour la Mise en Valeur du fleuve <mark>Gambie</mark><br>
  → États riverains du fleuve Gambie</p>
</div>

<h2>🏞️ Les réalisations de l'OMVS</h2>
<ul>
  <li>Le <strong>barrage de Diama</strong> (anti-sel) → situé à <mark>Saint-Louis</mark></li>
  <li>Le <strong>barrage de Manantali</strong> (hydro-électrique) → situé au <mark>Mali</mark></li>
</ul>

<h2>✅ Les avantages des barrages</h2>
<ul>
  <li><strong>L'irrigation</strong> des terres pour la culture</li>
  <li>La <strong>navigabilité</strong> du fleuve Sénégal</li>
  <li>L'<strong>approvisionnement en eau potable</strong></li>
  <li>La production d'<strong>électricité</strong></li>
</ul>
`,
    exercices: [
      { question: "Que signifie OMVS ?", reponse: "Organisation pour la Mise en Valeur du fleuve Sénégal.", explication: "L'OMVS regroupe la Mauritanie, le Mali, la Guinée et le Sénégal." },
      { question: "Où se trouve le barrage de Diama ?", reponse: "À Saint-Louis.", explication: "Le barrage de Diama est un barrage anti-sel situé à l'embouchure du fleuve Sénégal." },
      { question: "À quoi sert le barrage de Manantali ?", reponse: "À produire de l'électricité (barrage hydro-électrique).", explication: "Manantali est au Mali et produit de l'électricité pour les pays membres de l'OMVS." },
      { question: "Cite deux avantages des barrages.", reponse: "L'irrigation des terres et la production d'électricité (ou eau potable, navigabilité).", explication: "Les barrages ont plusieurs utilités pour les populations." },
      { question: "Quels pays font partie de l'OMVS ?", reponse: "La Mauritanie, le Mali, la Guinée et le Sénégal.", explication: "Ces quatre pays riverains du fleuve Sénégal ont créé l'OMVS ensemble." },
    ,
      { question: "Que signifie OMVS ?", reponse: "Organisation pour la Mise en Valeur du fleuve Sénégal.", explication: "Regroupe Mauritanie, Mali, Guinée, Sénégal." },
      { question: "Que signifie OMVG ?", reponse: "Organisation pour la Mise en Valeur du fleuve Gambie.", explication: "Pour le fleuve Gambie." },
      { question: "Quels sont les deux grands barrages de l\'OMVS ?", reponse: "Barrage anti-sel de Diama (Saint-Louis) et barrage hydro-électrique de Manantali (Mali).", explication: "Deux barrages." },
      { question: "Où se trouve le barrage de Diama ?", reponse: "À Saint-Louis.", explication: "Barrage anti-sel." },
      { question: "Où se trouve le barrage de Manantali ?", reponse: "Au Mali.", explication: "Barrage hydro-électrique." },
      { question: "Que permet le barrage de Diama ?", reponse: "Empêcher la remontée du sel.", explication: "Protège les terres agricoles." },
      { question: "Que permet le barrage de Manantali ?", reponse: "Produire de l\'électricité.", explication: "Barrage hydro-électrique." },
      { question: "Cite ce que les barrages de l\'OMVS permettent.", reponse: "Irrigation, navigabilité, eau potable, électricité.", explication: "Quatre avantages." }
    ],
    qcm: [
      { enonce: "L'OMVS est :", options: [{lettre:'A',texte:"Une organisation sénégalaise seulement"},{lettre:'B',texte:"L'Organisation pour la Mise en Valeur du fleuve Sénégal"},{lettre:'C',texte:"Un barrage sur le fleuve Gambie"},{lettre:'D',texte:"Une école de pêche"}], reponseCorrecte:'B', explication:"L'OMVS regroupe Mauritanie, Mali, Guinée et Sénégal pour valoriser le fleuve Sénégal." },
      { enonce: "Le barrage de Diama est situé à :", options: [{lettre:'A',texte:"Dakar"},{lettre:'B',texte:"Ziguinchor"},{lettre:'C',texte:"Saint-Louis"},{lettre:'D',texte:"Tambacounda"}], reponseCorrecte:'C', explication:"Le barrage de Diama (anti-sel) est à Saint-Louis, sur le fleuve Sénégal." },
      { enonce: "Le barrage de Manantali produit :", options: [{lettre:'A',texte:"Du sel"},{lettre:'B',texte:"De l'eau potable uniquement"},{lettre:'C',texte:"De l'électricité"},{lettre:'D',texte:"Du poisson"}], reponseCorrecte:'C', explication:"Manantali est un barrage hydro-électrique qui produit de l'électricité." },
      { enonce: "L'OMVG gère le fleuve :", options: [{lettre:'A',texte:"Sénégal"},{lettre:'B',texte:"Casamance"},{lettre:'C',texte:"Gambie"},{lettre:'D',texte:"Sine"}], reponseCorrecte:'C', explication:"L'OMVG = Organisation pour la Mise en Valeur du fleuve Gambie." },
      { enonce: "Les barrages permettent :", options: [{lettre:'A',texte:"L'irrigation, l'électricité et l'eau potable"},{lettre:'B',texte:"La pêche uniquement"},{lettre:'C',texte:"Le tourisme"},{lettre:'D',texte:"La navigation aérienne"}], reponseCorrecte:'A', explication:"Les barrages permettent l'irrigation, la navigation, l'eau potable et l'électricité." },
    ,
      { enonce: "OMVS signifie :", options: [{lettre:"A",texte:"Organisation Mondiale pour la Vallée du Sénégal"},{lettre:"B",texte:"Organisation pour la Mise en Valeur du fleuve Sénégal"},{lettre:"C",texte:"Office de Mise en Valeur"},{lettre:"D",texte:"Organisation du Maghreb"}], reponseCorrecte:'B', explication:"Mise en Valeur du fleuve Sénégal." },
      { enonce: "Le barrage de Diama se trouve :", options: [{lettre:"A",texte:"Au Mali"},{lettre:"B",texte:"À Saint-Louis"},{lettre:"C",texte:"À Dakar"},{lettre:"D",texte:"En Guinée"}], reponseCorrecte:'B', explication:"Saint-Louis." },
      { enonce: "Le barrage de Manantali se trouve :", options: [{lettre:"A",texte:"Au Sénégal"},{lettre:"B",texte:"Au Mali"},{lettre:"C",texte:"En Mauritanie"},{lettre:"D",texte:"En Guinée"}], reponseCorrecte:'B', explication:"Mali." },
      { enonce: "Le barrage de Diama est un barrage :", options: [{lettre:"A",texte:"Hydro-électrique"},{lettre:"B",texte:"Anti-sel"},{lettre:"C",texte:"Anti-crue"},{lettre:"D",texte:"Touristique"}], reponseCorrecte:'B', explication:"Anti-sel." },
      { enonce: "Le barrage de Manantali est un barrage :", options: [{lettre:"A",texte:"Anti-sel"},{lettre:"B",texte:"Hydro-électrique"},{lettre:"C",texte:"Anti-crue"},{lettre:"D",texte:"De navigation"}], reponseCorrecte:'B', explication:"Hydro-électrique." },
      { enonce: "Quels pays font partie de l'OMVS ?", options: [{lettre:"A",texte:"Sénégal, Mali, Guinée, Mauritanie"},{lettre:"B",texte:"Sénégal, Gambie, Guinée"},{lettre:"C",texte:"Sénégal, Mali, Niger"},{lettre:"D",texte:"Sénégal, France, Mali"}], reponseCorrecte:'A', explication:"Sénégal, Mali, Guinée, Mauritanie." },
      { enonce: "Les barrages de l'OMVS permettent :", options: [{lettre:"A",texte:"Uniquement l'irrigation"},{lettre:"B",texte:"Irrigation, navigation, eau potable, électricité"},{lettre:"C",texte:"Seulement l'électricité"},{lettre:"D",texte:"Uniquement la navigation"}], reponseCorrecte:'B', explication:"4 avantages." }
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 8 : LES SOLS
  // ══════════════════════════════════════════════════════════

  {
    ordre: 8,
    titre: "Les Sols",
    objectif: "Connaître les différents types de sols au Sénégal et leurs caractéristiques",
    promptSupplement: "Lie chaque type de sol à une région du Sénégal connue des élèves.",
    contenuHTML: `
<h1>🌱 Leçon 8 : Les Sols</h1>

<div class="bloc-essentiel">
  <p>Au Sénégal, on distingue <mark>plusieurs types de sol</mark> selon les régions.</p>
</div>

<h2>🗺️ Les types de sols</h2>
<ul>
  <li><strong>Les sols pauvres</strong> → dans le Sahel (<mark>Louga, Saint-Louis</mark>)</li>
  <li><strong>Les sols Dior</strong> → propices à la culture de <mark>l'arachide</mark> (Bassin arachidier)</li>
  <li><strong>Les sols humides et fertiles</strong> → culture maraîchère et fruitière (<mark>les Niayes</mark>)</li>
  <li><strong>Les sols argileux</strong> → culture des céréales (mil, maïs) — <mark>Sud-Ouest</mark></li>
  <li><strong>Les sols latéritiques</strong> → difficiles à cultiver (<mark>Tambacounda</mark>)</li>
  <li><strong>Les sols salins</strong> → difficiles pour l'agriculture (<mark>Kaolack, Fatick, Delta du Sénégal</mark>)</li>
</ul>

<div class="bloc-astuce">
  💡 Les sols <strong>Dior</strong> sont les plus importants car ils permettent la culture de l'arachide, principale exportation du Sénégal !
</div>
`,
    exercices: [
      { question: "Où trouve-t-on les sols Dior ?", reponse: "Dans le Bassin arachidier.", explication: "Les sols Dior sont propices à la culture de l'arachide." },
      { question: "Quel type de sol se trouve dans les Niayes ?", reponse: "Les sols humides et fertiles, propices aux cultures maraîchères.", explication: "Les Niayes sont des zones fraîches et humides, favorables aux légumes et fruits." },
      { question: "Pourquoi les sols latéritiques sont-ils difficiles ?", reponse: "Parce qu'ils sont difficiles et parfois impossibles à cultiver.", explication: "Les sols latéritiques (rouges, durs) ne retiennent pas bien l'eau et l'eau." },
      { question: "Où trouve-t-on les sols pauvres ?", reponse: "Dans le Sahel (Louga, Saint-Louis).", explication: "Le Sahel est une zone semi-aride où les sols sont peu fertiles." },
      { question: "Qu'est-ce qu'un sol salin ?", reponse: "Un sol dont la teneur en sel rend difficile toute activité agricole.", explication: "Les sols salins (Kaolack, Fatick) ne permettent pas de faire pousser la plupart des plantes." },
    ,
      { question: "Cite les six types de sols du Sénégal.", reponse: "Sols pauvres, Dior, humides/fertiles (Niayes), argileux, latéritiques, salins.", explication: "Six types." },
      { question: "Où trouve-t-on les sols pauvres ?", reponse: "Dans le Sahel (Louga, Saint-Louis).", explication: "Sols pauvres du Sahel." },
      { question: "Où trouve-t-on les sols Dior et à quoi servent-ils ?", reponse: "Dans le Bassin arachidier, propices à l\'arachide.", explication: "Sols légers pour arachide." },
      { question: "Que sont les Niayes ?", reponse: "Zones aux sols humides et fertiles pour les cultures maraîchères.", explication: "Pour le maraîchage." },
      { question: "Où trouve-t-on les sols argileux ?", reponse: "Au Sud-Ouest, pour les céréales (mil, maïs).", explication: "Céréales." },
      { question: "Où trouve-t-on les sols latéritiques ?", reponse: "À Tambacounda, difficiles à cultiver.", explication: "Sols latéritiques durs." },
      { question: "Où trouve-t-on les sols salins ?", reponse: "À Kaolack, Fatick, Delta du Sénégal.", explication: "Trop salés pour l\'agriculture." }
    ],
    qcm: [
      { enonce: "Les sols Dior sont propices à la culture :", options: [{lettre:'A',texte:"Du riz"},{lettre:'B',texte:"De l'arachide"},{lettre:'C',texte:"Du coton"},{lettre:'D',texte:"Du manioc"}], reponseCorrecte:'B', explication:"Les sols Dior du bassin arachidier sont idéaux pour cultiver l'arachide." },
      { enonce: "Les sols des Niayes sont :", options: [{lettre:'A',texte:"Pauvres et secs"},{lettre:'B',texte:"Salins"},{lettre:'C',texte:"Humides et fertiles"},{lettre:'D',texte:"Latéritiques"}], reponseCorrecte:'C', explication:"Les Niayes ont des sols humides et fertiles favorables aux cultures maraîchères." },
      { enonce: "Les sols pauvres se trouvent dans :", options: [{lettre:'A',texte:"La Casamance"},{lettre:'B',texte:"Le Sahel (Louga, Saint-Louis)"},{lettre:'C',texte:"Les Niayes"},{lettre:'D',texte:"Le bassin arachidier"}], reponseCorrecte:'B', explication:"Le Sahel est une zone aride avec des sols pauvres." },
      { enonce: "Les sols latéritiques se trouvent surtout à :", options: [{lettre:'A',texte:"Dakar"},{lettre:'B',texte:"Saint-Louis"},{lettre:'C',texte:"Tambacounda"},{lettre:'D',texte:"Ziguinchor"}], reponseCorrecte:'C', explication:"Tambacounda est caractérisée par des sols latéritiques rouges et durs." },
      { enonce: "Les sols salins rendent l'agriculture :", options: [{lettre:'A',texte:"Très facile"},{lettre:'B',texte:"Difficile"},{lettre:'C',texte:"Excellente"},{lettre:'D',texte:"Inutile"}], reponseCorrecte:'B', explication:"La teneur en sel des sols salins empêche la plupart des cultures de pousser." },
    ,
      { enonce: "Les sols Dior sont propices à :", options: [{lettre:"A",texte:"Le riz"},{lettre:"B",texte:"L'arachide"},{lettre:"C",texte:"Le mil"},{lettre:"D",texte:"Le coton"}], reponseCorrecte:'B', explication:"Arachide." },
      { enonce: "Les sols pauvres se trouvent à :", options: [{lettre:"A",texte:"Ziguinchor"},{lettre:"B",texte:"Louga et Saint-Louis"},{lettre:"C",texte:"Dakar"},{lettre:"D",texte:"Tambacounda"}], reponseCorrecte:'B', explication:"Louga, Saint-Louis." },
      { enonce: "Les Niayes sont des zones aux sols :", options: [{lettre:"A",texte:"Très secs"},{lettre:"B",texte:"Humides et fertiles"},{lettre:"C",texte:"Salins"},{lettre:"D",texte:"Latéritiques"}], reponseCorrecte:'B', explication:"Humides et fertiles." },
      { enonce: "Les sols argileux sont bons pour :", options: [{lettre:"A",texte:"Les tomates"},{lettre:"B",texte:"Le mil et le maïs"},{lettre:"C",texte:"Les arachides"},{lettre:"D",texte:"Les mangues"}], reponseCorrecte:'B', explication:"Céréales." },
      { enonce: "Les sols latéritiques se trouvent à :", options: [{lettre:"A",texte:"Louga"},{lettre:"B",texte:"Tambacounda"},{lettre:"C",texte:"Kaolack"},{lettre:"D",texte:"Dakar"}], reponseCorrecte:'B', explication:"Tambacounda." },
      { enonce: "Les sols salins posent problème à Kaolack et Fatick car :", options: [{lettre:"A",texte:"Trop acides"},{lettre:"B",texte:"Trop salés"},{lettre:"C",texte:"Trop secs"},{lettre:"D",texte:"Trop humides"}], reponseCorrecte:'B', explication:"Trop salés." },
      { enonce: "Les Niayes sont favorables :", options: [{lettre:"A",texte:"À l'arachide"},{lettre:"B",texte:"Au maraîchage"},{lettre:"C",texte:"À l'élevage"},{lettre:"D",texte:"À la pêche"}], reponseCorrecte:'B', explication:"Maraîchage." },
      { enonce: "Combien de types de sols sont cités ?", options: [{lettre:"A",texte:"4"},{lettre:"B",texte:"5"},{lettre:"C",texte:"6"},{lettre:"D",texte:"7"}], reponseCorrecte:'C', explication:"6 types." }
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 9 : LA VÉGÉTATION
  // ══════════════════════════════════════════════════════════

  {
    ordre: 9,
    titre: "La Végétation",
    objectif: "Identifier les types de végétation au Sénégal et leur importance",
    promptSupplement: "Relie la végétation aux régions sénégalaises que les élèves connaissent.",
    contenuHTML: `
<h1>🌿 Leçon 9 : La Végétation</h1>

<div class="bloc-essentiel">
  <p>L'ensemble des arbres et arbustes forment la <mark>végétation</mark>. Elle dépend du <strong>climat</strong> et des <strong>sols</strong>.</p>
</div>

<h2>🌳 Les types de végétation au Sénégal</h2>
<ul>
  <li><strong>La forêt dense</strong> et <strong>la mangrove</strong> → au <mark>Sud-Ouest</mark></li>
  <li><strong>La savane arborée</strong> et <strong>la brousse épineuse</strong> → au <mark>centre</mark> du pays</li>
  <li><strong>Les palmiers, rizières et cultures maraîchères</strong> → dans les <mark>Niayes</mark></li>
  <li><strong>La steppe</strong> (forêt dégradée) → dans la zone <mark>sahélienne du Nord</mark></li>
</ul>

<h2>🌲 L'importance de la forêt</h2>
<p>La forêt fournit :</p>
<ul>
  <li>Du <strong>bois</strong></li>
  <li>Des <strong>fruits</strong></li>
  <li>Des <strong>plantes médicinales</strong> (<mark>pharmacopée</mark>)</li>
</ul>
<p>La forêt <strong>protège le sol contre l'érosion</strong>.</p>

<div class="bloc-definition">
  📌 <strong>La pharmacopée</strong> = l'ensemble des plantes médicinales.<br>
  📌 <strong>L'érosion</strong> = la dégradation du sol par l'eau, le vent, etc.
</div>
`,
    exercices: [
      { question: "De quoi dépend la végétation ?", reponse: "Du climat et des sols.", explication: "La végétation varie selon les conditions climatiques et la nature du sol." },
      { question: "Où trouve-t-on la forêt dense et la mangrove ?", reponse: "Au Sud-Ouest du Sénégal.", explication: "La Casamance et le sud-ouest ont le plus de forêts denses." },
      { question: "Qu'est-ce que la pharmacopée ?", reponse: "L'ensemble des plantes médicinales.", explication: "La pharmacopée désigne toutes les plantes utilisées pour soigner les maladies." },
      { question: "Qu'est-ce que l'érosion ?", reponse: "La dégradation du sol par l'eau, le vent, etc.", explication: "L'érosion use et emporte progressivement le sol." },
      { question: "Quel type de végétation se trouve dans la zone sahélienne du Nord ?", reponse: "La steppe (forêt dégradée).", explication: "Dans le Sahel, la végétation est rare et clairsemée : c'est la steppe." },
    ,
      { question: "De quoi dépend la végétation ?", reponse: "Du climat et des sols.", explication: "Deux facteurs." },
      { question: "Quels sont les types de végétation au Sénégal ?", reponse: "Forêt dense/mangrove au Sud-Ouest, savane arborée/brousse épineuse au centre, palmiers/rizières dans les Niayes, steppe au Nord.", explication: "Végétation variée." },
      { question: "Quelle végétation trouve-t-on au Sud-Ouest ?", reponse: "La forêt dense et la mangrove.", explication: "Sud-Ouest humide." },
      { question: "Quelle végétation trouve-t-on dans la zone sahélienne du Nord ?", reponse: "La steppe (forêt dégradée).", explication: "Nord sec." },
      { question: "Qu\'est-ce que la pharmacopée ?", reponse: "L\'ensemble des plantes médicinales.", explication: "Plantes qui soignent." },
      { question: "Qu\'est-ce que l\'érosion ?", reponse: "La dégradation du relief par l\'eau et le vent.", explication: "L\'érosion abîme les sols." },
      { question: "Que fournit la forêt ?", reponse: "Du bois, des fruits, des plantes médicinales.", explication: "Ressources de la forêt." },
      { question: "La forêt protège le sol contre quoi ?", reponse: "Contre l\'érosion.", explication: "Les arbres retiennent le sol." }
    ],
    qcm: [
      { enonce: "La végétation dépend de :", options: [{lettre:'A',texte:"La population"},{lettre:'B',texte:"Le climat et les sols"},{lettre:'C',texte:"Les fleuves uniquement"},{lettre:'D',texte:"Le relief uniquement"}], reponseCorrecte:'B', explication:"La végétation dépend des conditions climatiques et de la nature du sol." },
      { enonce: "La forêt dense et la mangrove se trouvent :", options: [{lettre:'A',texte:"Au Nord"},{lettre:'B',texte:"Dans le Sahel"},{lettre:'C',texte:"Au Sud-Ouest"},{lettre:'D',texte:"Dans les Niayes"}], reponseCorrecte:'C', explication:"La forêt dense et la mangrove sont au Sud-Ouest du Sénégal." },
      { enonce: "La steppe est :", options: [{lettre:'A',texte:"Une forêt dense"},{lettre:'B',texte:"Une forêt dégradée"},{lettre:'C',texte:"Une mangrove"},{lettre:'D',texte:"Une savane luxuriante"}], reponseCorrecte:'B', explication:"La steppe est une végétation rase et clairsemée, caractéristique du Nord sahélien." },
      { enonce: "La forêt protège le sol contre :", options: [{lettre:'A',texte:"La pluie"},{lettre:'B',texte:"Le vent"},{lettre:'C',texte:"L'érosion"},{lettre:'D',texte:"La chaleur"}], reponseCorrecte:'C', explication:"Les racines des arbres retiennent le sol et le protègent contre l'érosion." },
      { enonce: "La pharmacopée désigne :", options: [{lettre:'A',texte:"Les arbres fruitiers"},{lettre:'B',texte:"Les plantes médicinales"},{lettre:'C',texte:"Les forêts denses"},{lettre:'D',texte:"Les cultures maraîchères"}], reponseCorrecte:'B', explication:"La pharmacopée = l'ensemble des plantes utilisées en médecine traditionnelle." },
    ,
      { enonce: "La végétation dépend :", options: [{lettre:"A",texte:"Du climat seulement"},{lettre:"B",texte:"Du climat et des sols"},{lettre:"C",texte:"Des sols seulement"},{lettre:"D",texte:"Des animaux"}], reponseCorrecte:'B', explication:"Climat et sols." },
      { enonce: "La forêt dense se trouve :", options: [{lettre:"A",texte:"Au Nord"},{lettre:"B",texte:"Au centre"},{lettre:"C",texte:"Au Sud-Ouest"},{lettre:"D",texte:"Dans le Sahel"}], reponseCorrecte:'C', explication:"Sud-Ouest." },
      { enonce: "La pharmacopée est :", options: [{lettre:"A",texte:"Une pharmacie"},{lettre:"B",texte:"Un hôpital"},{lettre:"C",texte:"Les plantes médicinales"},{lettre:"D",texte:"Un médicament"}], reponseCorrecte:'C', explication:"Plantes médicinales." },
      { enonce: "La forêt protège le sol contre :", options: [{lettre:"A",texte:"Les animaux"},{lettre:"B",texte:"L'érosion"},{lettre:"C",texte:"Le feu"},{lettre:"D",texte:"La pluie"}], reponseCorrecte:'B', explication:"Érosion." },
      { enonce: "La steppe se trouve :", options: [{lettre:"A",texte:"Au Sud-Ouest"},{lettre:"B",texte:"Au centre"},{lettre:"C",texte:"Dans la zone sahélienne du Nord"},{lettre:"D",texte:"Dans les Niayes"}], reponseCorrecte:'C', explication:"Zone sahélienne du Nord." },
      { enonce: "La mangrove se trouve :", options: [{lettre:"A",texte:"Au Nord"},{lettre:"B",texte:"Au centre"},{lettre:"C",texte:"Au Sud-Ouest"},{lettre:"D",texte:"Dans le Sahel"}], reponseCorrecte:'C', explication:"Sud-Ouest." },
      { enonce: "Que trouve-t-on dans les Niayes ?", options: [{lettre:"A",texte:"Steppe"},{lettre:"B",texte:"Palmiers, rizières, maraîchage"},{lettre:"C",texte:"Forêt dense"},{lettre:"D",texte:"Savane"}], reponseCorrecte:'B', explication:"Palmiers, rizières, maraîchage." },
      { enonce: "L'érosion est causée par :", options: [{lettre:"A",texte:"Les arbres"},{lettre:"B",texte:"L'eau et le vent"},{lettre:"C",texte:"Les hommes"},{lettre:"D",texte:"Les animaux"}], reponseCorrecte:'B', explication:"Eau et vent." },
      { enonce: "La forêt fournit :", options: [{lettre:"A",texte:"Uniquement du bois"},{lettre:"B",texte:"Bois, fruits, plantes médicinales"},{lettre:"C",texte:"Seulement des fruits"},{lettre:"D",texte:"Seulement du bois"}], reponseCorrecte:'B', explication:"Bois, fruits, plantes médicinales." }
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 10 : LES RÉGIONS NATURELLES DU SÉNÉGAL
  // ══════════════════════════════════════════════════════════

  {
    ordre: 10,
    titre: "Les Régions Naturelles du Sénégal",
    objectif: "Connaître les six régions naturelles du Sénégal et leurs caractéristiques",
    promptSupplement: "Aide les élèves à mémoriser les 6 régions avec leurs productions.",
    contenuHTML: `
<h1>🗺️ Leçon 10 : Les Régions Naturelles du Sénégal</h1>

<div class="bloc-essentiel">
  <p>Les facteurs qui déterminent une région naturelle sont : <mark>le climat</mark>, <mark>le relief</mark>, <mark>la végétation</mark> et <mark>les précipitations</mark>.</p>
</div>

<h2>🌍 Les six régions naturelles</h2>
<ul>
  <li>🌊 <strong>La vallée du fleuve Sénégal</strong> → culture de <mark>mil, maïs, riz, tomate</mark></li>
  <li>🐄 <strong>Le Centre Est ou Ferlo</strong> → zone de <mark>gomme arabique et d'élevage</mark></li>
  <li>🥜 <strong>Le Centre Ouest ou Bassin arachidier</strong> → zone de <mark>culture de l'arachide</mark></li>
  <li>🥬 <strong>Le Littoral ou les Niayes</strong> → domaine des <mark>cultures maraîchères</mark></li>
  <li>🌴 <strong>La Casamance</strong> → zone de <mark>végétation luxuriante</mark></li>
  <li>🦁 <strong>Le Sud Est</strong> → zone de <mark>savane, d'élevage et de chasse</mark></li>
</ul>
`,
    exercices: [
      { question: "Cite les facteurs qui déterminent une région naturelle.", reponse: "Le climat, le relief, la végétation et les précipitations.", explication: "Ces quatre éléments définissent le type de région naturelle." },
      { question: "Combien y a-t-il de régions naturelles au Sénégal ?", reponse: "Six régions naturelles.", explication: "Le Sénégal est divisé en 6 régions naturelles selon leurs caractéristiques." },
      { question: "Quelle production caractérise le Bassin arachidier ?", reponse: "La culture de l'arachide.", explication: "Le Centre-Ouest (bassin arachidier) est la principale zone de production d'arachide." },
      { question: "Que produit-on dans la vallée du fleuve Sénégal ?", reponse: "Du mil, du maïs, du riz et de la tomate.", explication: "La vallée du fleuve Sénégal est irriguée et fertile, propice aux céréales et légumes." },
      { question: "Comment est la végétation en Casamance ?", reponse: "Luxuriante (très riche et dense).", explication: "La Casamance est la région la plus verte du Sénégal grâce aux fortes pluies." },
    ,
      { question: "Combien de régions naturelles au Sénégal ?", reponse: "Six.", explication: "Six régions naturelles." },
      { question: "Que produit-on dans la vallée du fleuve Sénégal ?", reponse: "Mil, maïs, riz, tomate.", explication: "Agriculture irriguée." },
      { question: "Que trouve-t-on dans le Ferlo ?", reponse: "Gomme arabique et élevage.", explication: "Centre Est." },
      { question: "Que trouve-t-on dans le Bassin arachidier ?", reponse: "Culture de l\'arachide.", explication: "Centre Ouest." },
      { question: "Que trouve-t-on dans les Niayes ?", reponse: "Cultures maraîchères.", explication: "Littoral." },
      { question: "Que trouve-t-on dans le Sud Est ?", reponse: "Savane, élevage et chasse.", explication: "Sud Est." }
    ],
    qcm: [
      { enonce: "Combien y a-t-il de régions naturelles au Sénégal ?", options: [{lettre:'A',texte:"Quatre"},{lettre:'B',texte:"Cinq"},{lettre:'C',texte:"Six"},{lettre:'D',texte:"Sept"}], reponseCorrecte:'C', explication:"Le Sénégal compte six régions naturelles distinctes." },
      { enonce: "Le Bassin arachidier est surtout connu pour :", options: [{lettre:'A',texte:"L'élevage"},{lettre:'B',texte:"La pêche"},{lettre:'C',texte:"La culture de l'arachide"},{lettre:'D',texte:"Le riz"}], reponseCorrecte:'C', explication:"Le bassin arachidier (Centre-Ouest) est la principale zone de production d'arachide." },
      { enonce: "La Casamance est caractérisée par :", options: [{lettre:'A',texte:"Un désert"},{lettre:'B',texte:"Une végétation luxuriante"},{lettre:'C',texte:"Des sols pauvres"},{lettre:'D',texte:"Le Sahel"}], reponseCorrecte:'B', explication:"La Casamance a une végétation très riche grâce à ses pluies abondantes." },
      { enonce: "Le Ferlo (Centre Est) est une zone de :", options: [{lettre:'A',texte:"Culture du riz"},{lettre:'B',texte:"Pêche maritime"},{lettre:'C',texte:"Gomme arabique et d'élevage"},{lettre:'D',texte:"Cultures maraîchères"}], reponseCorrecte:'C', explication:"Le Ferlo est une zone aride de gomme arabique et d'élevage extensif." },
      { enonce: "Les Niayes sont le domaine des :", options: [{lettre:'A',texte:"Cultures céréalières"},{lettre:'B',texte:"Cultures maraîchères"},{lettre:'C',texte:"L'élevage"},{lettre:'D',texte:"La pêche"}], reponseCorrecte:'B', explication:"Le Littoral (Niayes) est le domaine des cultures maraîchères (légumes)." },
    ,
      { enonce: "Le Ferlo est une zone de :", options: [{lettre:"A",texte:"Riz"},{lettre:"B",texte:"Gomme arabique et élevage"},{lettre:"C",texte:"Pêche"},{lettre:"D",texte:"Forêt"}], reponseCorrecte:'B', explication:"Gomme et élevage." },
      { enonce: "Le Bassin arachidier est au :", options: [{lettre:"A",texte:"Nord"},{lettre:"B",texte:"Centre Ouest"},{lettre:"C",texte:"Sud"},{lettre:"D",texte:"Est"}], reponseCorrecte:'B', explication:"Centre Ouest." },
      { enonce: "Le Sud-Est est zone de :", options: [{lettre:"A",texte:"Forêt dense"},{lettre:"B",texte:"Savane, élevage, chasse"},{lettre:"C",texte:"Riz"},{lettre:"D",texte:"Maraîchage"}], reponseCorrecte:'B', explication:"Savane, élevage, chasse." },
      { enonce: "La vallée du fleuve Sénégal cultive :", options: [{lettre:"A",texte:"Arachide"},{lettre:"B",texte:"Mil, maïs, riz, tomate"},{lettre:"C",texte:"Palmiers"},{lettre:"D",texte:"Café"}], reponseCorrecte:'B', explication:"Mil, maïs, riz, tomate." },
      { enonce: "Les Niayes correspondent à la région :", options: [{lettre:"A",texte:"Vallée du fleuve"},{lettre:"B",texte:"Littoral"},{lettre:"C",texte:"Ferlo"},{lettre:"D",texte:"Casamance"}], reponseCorrecte:'B', explication:"Littoral." },
      { enonce: "Quels sont les facteurs d'une région naturelle ?", options: [{lettre:"A",texte:"Population/villes"},{lettre:"B",texte:"Climat/relief/végétation/précipitations"},{lettre:"C",texte:"Routes/transports"},{lettre:"D",texte:"Cultures/élevage"}], reponseCorrecte:'B', explication:"Climat, relief, végétation, précipitations." }
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 11 : LE DÉCOUPAGE ADMINISTRATIF
  // ══════════════════════════════════════════════════════════

  {
    ordre: 11,
    titre: "Le Découpage Administratif",
    objectif: "Connaître les 14 régions administratives du Sénégal et leur organisation",
    promptSupplement: "Aide les élèves à mémoriser les 14 régions. Utilise des exemples locaux.",
    contenuHTML: `
<h1>🏛️ Leçon 11 : Le Découpage Administratif</h1>

<div class="bloc-essentiel">
  <p>Depuis <mark>2008</mark>, le Sénégal compte <strong>14 régions administratives</strong>.</p>
</div>

<h2>📅 L'évolution du découpage</h2>
<ul>
  <li><strong>1960</strong> → 7 régions</li>
  <li><strong>1976</strong> → 8 régions</li>
  <li><strong>1984</strong> → 10 régions</li>
  <li><strong>2002</strong> → 11 régions</li>
  <li><strong>2008</strong> → <mark>14 régions</mark></li>
</ul>

<h2>🗺️ Les 14 régions</h2>
<p>Dakar, Diourbel, Fatick, Kaffrine, Kaolack, Kédougou, Kolda, Louga, Matam, Saint-Louis, Sédhiou, Tambacounda, Thiès, Ziguinchor.</p>

<div class="bloc-definition">
  📌 Les 4 dernières régions créées (2008) : <strong>Matam, Kaffrine, Kédougou, Sédhiou</strong>
</div>

<h2>👔 Les autorités administratives</h2>
<ul>
  <li><strong>Région</strong> → <mark>Gouverneur</mark></li>
  <li><strong>Département</strong> → <mark>Préfet</mark></li>
  <li><strong>Arrondissement</strong> → <mark>Sous-préfet</mark></li>
  <li><strong>Commune</strong> → <mark>Maire</mark></li>
  <li><strong>Quartier</strong> → <mark>Délégué de quartier</mark></li>
  <li><strong>Village</strong> → <mark>Chef de village</mark></li>
</ul>
`,
    exercices: [
      { question: "Combien y a-t-il de régions au Sénégal depuis 2008 ?", reponse: "14 régions administratives.", explication: "En 2008, le Sénégal a porté son nombre de régions à 14." },
      { question: "Qui administre une région ?", reponse: "Le gouverneur.", explication: "Chaque région est dirigée par un gouverneur nommé par l'État." },
      { question: "Cite les 4 dernières régions créées.", reponse: "Matam, Kaffrine, Kédougou et Sédhiou.", explication: "Ces quatre régions ont été créées lors de la réforme de 2008." },
      { question: "Qui dirige une commune ?", reponse: "Le maire.", explication: "Le maire est élu par les habitants de la commune." },
      { question: "Combien de régions y avait-il au Sénégal en 1960 ?", reponse: "7 régions.", explication: "À l'indépendance en 1960, le Sénégal avait 7 régions." },
    ,
      { question: "Qui administre une région ?", reponse: "Le gouverneur.", explication: "Le gouverneur représente le Président." },
      { question: "Qui administre un département ?", reponse: "Le préfet.", explication: "Autorité départementale." },
      { question: "Qui administre un arrondissement ?", reponse: "Le sous-préfet.", explication: "Autorité d\'arrondissement." },
      { question: "Qui administre une commune ?", reponse: "Le maire.", explication: "Autorité municipale." },
      { question: "Qui administre un village ?", reponse: "Le chef de village.", explication: "Autorité villageoise." },
      { question: "Combien de régions depuis 2008 ?", reponse: "14 régions.", explication: "Les 4 dernières : Matam, Kaffrine, Kédougou, Sédhiou." }
    ],
    qcm: [
      { enonce: "Depuis 2008, le Sénégal compte :", options: [{lettre:'A',texte:"10 régions"},{lettre:'B',texte:"11 régions"},{lettre:'C',texte:"12 régions"},{lettre:'D',texte:"14 régions"}], reponseCorrecte:'D', explication:"Depuis la réforme de 2008, le Sénégal compte 14 régions administratives." },
      { enonce: "Qui administre une région ?", options: [{lettre:'A',texte:"Le préfet"},{lettre:'B',texte:"Le maire"},{lettre:'C',texte:"Le gouverneur"},{lettre:'D',texte:"Le sous-préfet"}], reponseCorrecte:'C', explication:"Chaque région est administrée par un gouverneur." },
      { enonce: "Qui dirige un département ?", options: [{lettre:'A',texte:"Le gouverneur"},{lettre:'B',texte:"Le préfet"},{lettre:'C',texte:"Le maire"},{lettre:'D',texte:"Le sous-préfet"}], reponseCorrecte:'B', explication:"Chaque département est administré par un préfet." },
      { enonce: "La dernière réforme administrative a eu lieu en :", options: [{lettre:'A',texte:"1960"},{lettre:'B',texte:"1984"},{lettre:'C',texte:"2002"},{lettre:'D',texte:"2008"}], reponseCorrecte:'D', explication:"La réforme de 2008 a créé 14 régions en ajoutant Matam, Kaffrine, Kédougou et Sédhiou." },
      { enonce: "Qui administre un village ?", options: [{lettre:'A',texte:"Le maire"},{lettre:'B',texte:"Le sous-préfet"},{lettre:'C',texte:"Le délégué de quartier"},{lettre:'D',texte:"Le chef de village"}], reponseCorrecte:'D', explication:"Chaque village est administré par un chef de village." },
    ,
      { enonce: "Combien de régions depuis 2008 ?", options: [{lettre:"A",texte:"11"},{lettre:"B",texte:"12"},{lettre:"C",texte:"13"},{lettre:"D",texte:"14"}], reponseCorrecte:'D', explication:"14 régions." },
      { enonce: "Qui administre une région ?", options: [{lettre:"A",texte:"Le maire"},{lettre:"B",texte:"Le préfet"},{lettre:"C",texte:"Le gouverneur"},{lettre:"D",texte:"Le sous-préfet"}], reponseCorrecte:'C', explication:"Le gouverneur." },
      { enonce: "Qui administre un département ?", options: [{lettre:"A",texte:"Le maire"},{lettre:"B",texte:"Le préfet"},{lettre:"C",texte:"Le gouverneur"},{lettre:"D",texte:"Le chef de village"}], reponseCorrecte:'B', explication:"Le préfet." },
      { enonce: "Une commune est administrée par :", options: [{lettre:"A",texte:"Le préfet"},{lettre:"B",texte:"Le sous-préfet"},{lettre:"C",texte:"Le maire"},{lettre:"D",texte:"Le gouverneur"}], reponseCorrecte:'C', explication:"Le maire." },
      { enonce: "Un arrondissement est administré par :", options: [{lettre:"A",texte:"Le préfet"},{lettre:"B",texte:"Le sous-préfet"},{lettre:"C",texte:"Le maire"},{lettre:"D",texte:"Le gouverneur"}], reponseCorrecte:'B', explication:"Le sous-préfet." }
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 12 : LA POPULATION SÉNÉGALAISE : COMPOSITION
  // ══════════════════════════════════════════════════════════

  {
    ordre: 12,
    titre: "La Population Sénégalaise : Composition",
    objectif: "Connaître la composition ethnique, religieuse et linguistique de la population du Sénégal",
    promptSupplement: "Valorise la diversité culturelle du Sénégal. Exemples adaptés aux élèves de CM1.",
    contenuHTML: `
<h1>👥 Leçon 12 : La Population Sénégalaise — Composition</h1>

<div class="bloc-essentiel">
  <p>La population du Sénégal s'accroît très vite. Elle compte environ <mark>19,5 millions d'habitants</mark> avec une densité de <strong>95 habitants/km²</strong>.</p>
</div>

<h2>👶 Une population jeune</h2>
<p>La moitié de la population a <mark>moins de 18 ans</mark>. C'est une population très jeune !</p>

<h2>🌍 Les ethnies du Sénégal</h2>
<ul>
  <li>Les <strong>Wolofs</strong></li>
  <li>Les <strong>Pulaars</strong> (Toucouleurs et Peuls)</li>
  <li>Les <strong>Sérères</strong></li>
  <li>Les <strong>Diolas</strong></li>
  <li>Les <strong>Mandingues</strong></li>
</ul>

<h2>🕌 Les religions</h2>
<p>La <mark>grande majorité</mark> des Sénégalais sont <strong>musulmans</strong>. On trouve aussi des <strong>chrétiens</strong> et des <strong>animistes</strong>.</p>

<h2>🗣️ Les langues</h2>
<ul>
  <li>Le <strong>wolof</strong> → la langue la plus <mark>répandue</mark></li>
  <li>Le <strong>français</strong> → la langue <mark>officielle</mark></li>
</ul>

<div class="bloc-definition">
  📌 <strong>Densité</strong> = Population ÷ Superficie<br>
  📌 <strong>Population</strong> = Densité × Superficie
</div>
`,
    exercices: [
      { question: "Quelle est la population actuelle du Sénégal ?", reponse: "Environ 19,5 millions d'habitants.", explication: "La population sénégalaise croît rapidement chaque année." },
      { question: "Quelle est la langue officielle du Sénégal ?", reponse: "Le français.", explication: "Le français est la langue officielle, bien que le wolof soit la plus parlée." },
      { question: "Quelle est la religion majoritaire au Sénégal ?", reponse: "L'islam (les Sénégalais sont en grande majorité musulmans).", explication: "Plus de 90% des Sénégalais sont de confession musulmane." },
      { question: "Comment calcule-t-on la densité de population ?", reponse: "Densité = Population ÷ Superficie.", explication: "La densité indique le nombre d'habitants par km²." },
      { question: "Cite deux ethnies du Sénégal.", reponse: "Les Wolofs et les Sérères (ou Diolas, Pulaars, Mandingues).", explication: "Le Sénégal est un pays multiethnique avec de nombreux groupes culturels." },
    ,
      { question: "Quelle est la langue officielle du Sénégal ?", reponse: "Le français.", explication: "Langue officielle." },
      { question: "Quelle est la langue la plus parlée ?", reponse: "Le wolof.", explication: "Langue la plus répandue." },
      { question: "Quelles sont les principales religions ?", reponse: "Musulmane, chrétienne, animiste.", explication: "Majorité musulmane." },
      { question: "Quelle est la densité moyenne ?", reponse: "95 habitants/km².", explication: "Densité moyenne." },
      { question: "Cite trois ethnies du Sénégal.", reponse: "Wolofs, Pulaars, Sérères (ou Diolas, Mandingues).", explication: "Plusieurs ethnies." }
    ],
    qcm: [
      { enonce: "La population du Sénégal est d'environ :", options: [{lettre:'A',texte:"5 millions"},{lettre:'B',texte:"10 millions"},{lettre:'C',texte:"19,5 millions"},{lettre:'D',texte:"30 millions"}], reponseCorrecte:'C', explication:"Le Sénégal compte environ 19,5 millions d'habitants." },
      { enonce: "La langue officielle du Sénégal est :", options: [{lettre:'A',texte:"Le wolof"},{lettre:'B',texte:"L'arabe"},{lettre:'C',texte:"Le français"},{lettre:'D',texte:"Le diola"}], reponseCorrecte:'C', explication:"Le français est la langue officielle, héritée de la colonisation." },
      { enonce: "La religion majoritaire au Sénégal est :", options: [{lettre:'A',texte:"Le christianisme"},{lettre:'B',texte:"L'animisme"},{lettre:'C',texte:"L'islam"},{lettre:'D',texte:"Le bouddhisme"}], reponseCorrecte:'C', explication:"La grande majorité des Sénégalais sont musulmans." },
      { enonce: "La densité de population se calcule :", options: [{lettre:'A',texte:"Population × Superficie"},{lettre:'B',texte:"Population ÷ Superficie"},{lettre:'C',texte:"Superficie ÷ Population"},{lettre:'D',texte:"Population + Superficie"}], reponseCorrecte:'B', explication:"Densité = Population divisée par la Superficie (en km²)." },
      { enonce: "La langue la plus répandue au Sénégal est :", options: [{lettre:'A',texte:"Le français"},{lettre:'B',texte:"Le sérère"},{lettre:'C',texte:"Le wolof"},{lettre:'D',texte:"Le diola"}], reponseCorrecte:'C', explication:"Le wolof est la langue la plus parlée au quotidien au Sénégal." },
    ,
      { enonce: "La langue officielle du Sénégal est :", options: [{lettre:"A",texte:"Le wolof"},{lettre:"B",texte:"Le français"},{lettre:"C",texte:"Le pulaar"},{lettre:"D",texte:"Le sérère"}], reponseCorrecte:'B', explication:"Le français." },
      { enonce: "La langue la plus parlée est :", options: [{lettre:"A",texte:"Le français"},{lettre:"B",texte:"Le wolof"},{lettre:"C",texte:"Le pulaar"},{lettre:"D",texte:"Le diola"}], reponseCorrecte:'B', explication:"Le wolof." },
      { enonce: "La densité moyenne du Sénégal est :", options: [{lettre:"A",texte:"55 hab/km²"},{lettre:"B",texte:"75 hab/km²"},{lettre:"C",texte:"95 hab/km²"},{lettre:"D",texte:"105 hab/km²"}], reponseCorrecte:'C', explication:"95 hab/km²." },
      { enonce: "La population sénégalaise est :", options: [{lettre:"A",texte:"Vieille"},{lettre:"B",texte:"Très jeune"},{lettre:"C",texte:"Agée"},{lettre:"D",texte:"Adulte"}], reponseCorrecte:'B', explication:"Très jeune : moitié moins de 18 ans." },
      { enonce: "La religion majoritaire est :", options: [{lettre:"A",texte:"Chrétienne"},{lettre:"B",texte:"Animiste"},{lettre:"C",texte:"Musulmane"},{lettre:"D",texte:"Juive"}], reponseCorrecte:'C', explication:"Musulmane." }
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 13 : LA POPULATION SÉNÉGALAISE : RÉPARTITION
  // ══════════════════════════════════════════════════════════

  {
    ordre: 13,
    titre: "La Population Sénégalaise : Répartition",
    objectif: "Comprendre comment la population sénégalaise est répartie sur le territoire",
    promptSupplement: "Lie la répartition des ethnies aux régions que les élèves connaissent.",
    contenuHTML: `
<h1>📍 Leçon 13 : La Population Sénégalaise — Répartition</h1>

<div class="bloc-essentiel">
  <p>La population du Sénégal est <mark>inégalement répartie</mark> : concentrée à l'<strong>Ouest</strong> et au <strong>centre</strong>, clairsemée à l'<strong>Est</strong> et au <strong>Nord</strong>.</p>
</div>

<h2>🏙️ Les zones les plus peuplées</h2>
<p>La plus forte densité se trouve à : <mark>Dakar, Thiès, Kaolack, Saint-Louis</mark>.</p>

<h2>🌍 Répartition des ethnies</h2>
<ul>
  <li>Les <strong>Wolofs</strong> → Ouest et Centre-Ouest</li>
  <li>Les <strong>Sérères</strong> → Bassin arachidier (<mark>Kaolack, Fatick</mark>)</li>
  <li>Les <strong>Pulaars</strong> → Nord, le long du fleuve Sénégal</li>
  <li>Les <strong>Diolas, Balantes, Baïnouks, Mandingues</strong> → Casamance et Sud-Est</li>
  <li>Les <strong>Peuls</strong> → Ferlo et Kolda</li>
  <li>Les <strong>Sarakolés</strong> → <mark>Bakel</mark></li>
</ul>
`,
    exercices: [
      { question: "Comment est répartie la population sénégalaise ?", reponse: "Elle est inégalement répartie : concentrée à l'Ouest et au centre, faible à l'Est et au Nord.", explication: "L'Ouest (Dakar) est très dense, tandis que l'Est et le Nord sont peu peuplés." },
      { question: "Quelle est la ville la plus peuplée du Sénégal ?", reponse: "Dakar (la plus forte densité de population).", explication: "Dakar, la capitale, concentre une grande partie de la population sénégalaise." },
      { question: "Où vivent les Pulaars ?", reponse: "Au Nord, le long du fleuve Sénégal.", explication: "Les Pulaars (Toucouleurs et Peuls) sont installés dans la vallée du fleuve Sénégal." },
      { question: "Où vivent principalement les Diolas ?", reponse: "En Casamance et au Sud-Est.", explication: "Les Diolas sont le groupe ethnique dominant en Casamance." },
      { question: "Où vivent les Sarakolés ?", reponse: "À Bakel.", explication: "Les Sarakolés sont concentrés dans la région de Bakel, à l'est du Sénégal." },
    ,
      { question: "Où vivent principalement les Wolofs ?", reponse: "Dans l\'Ouest et le Centre-Ouest.", explication: "Majorité des Wolofs." },
      { question: "Où vivent les Diolas ?", reponse: "En Casamance et au Sud-Est.", explication: "Région de la Casamance." },
      { question: "Où vivent les Pulaars ?", reponse: "Au Nord, le long du fleuve Sénégal.", explication: "Nord du pays." },
      { question: "Où vivent les Sérères ?", reponse: "Dans le Bassin arachidier (Kaolack, Fatick).", explication: "Centre Ouest." },
      { question: "Où vivent les Peuls ?", reponse: "Dans le Ferlo et à Kolda.", explication: "Éleveurs." },
      { question: "Où vivent les Sarakolés ?", reponse: "À Bakel.", explication: "Est du Sénégal." }
    ],
    qcm: [
      { enonce: "La population sénégalaise est :", options: [{lettre:'A',texte:"Uniformément répartie"},{lettre:'B',texte:"Concentrée à l'Est"},{lettre:'C',texte:"Inégalement répartie"},{lettre:'D',texte:"Concentrée au Nord"}], reponseCorrecte:'C', explication:"La population est inégalement répartie, plus dense à l'Ouest et au centre." },
      { enonce: "La plus forte densité se trouve à :", options: [{lettre:'A',texte:"Tambacounda"},{lettre:'B',texte:"Dakar, Thiès, Kaolack"},{lettre:'C',texte:"Kolda"},{lettre:'D',texte:"Ziguinchor"}], reponseCorrecte:'B', explication:"Dakar, Thiès et Kaolack ont les plus fortes densités de population." },
      { enonce: "Les Sérères vivent surtout dans :", options: [{lettre:'A',texte:"La Casamance"},{lettre:'B',texte:"Le Ferlo"},{lettre:'C',texte:"Le bassin arachidier (Kaolack, Fatick)"},{lettre:'D',texte:"Le Nord"}], reponseCorrecte:'C', explication:"Les Sérères sont concentrés dans le bassin arachidier, notamment à Kaolack et Fatick." },
      { enonce: "Les Pulaars vivent surtout :", options: [{lettre:'A',texte:"En Casamance"},{lettre:'B',texte:"Au Nord, le long du fleuve Sénégal"},{lettre:'C',texte:"À Dakar"},{lettre:'D',texte:"Dans les Niayes"}], reponseCorrecte:'B', explication:"Les Pulaars (Toucouleurs et Peuls) vivent dans la vallée du fleuve Sénégal." },
      { enonce: "Les Sarakolés vivent à :", options: [{lettre:'A',texte:"Kolda"},{lettre:'B',texte:"Ziguinchor"},{lettre:'C',texte:"Bakel"},{lettre:'D',texte:"Louga"}], reponseCorrecte:'C', explication:"Les Sarakolés sont installés à Bakel, dans l'est du Sénégal." },
    ,
      { enonce: "Les Wolofs vivent :", options: [{lettre:"A",texte:"Au Nord"},{lettre:"B",texte:"Ouest/Centre-Ouest"},{lettre:"C",texte:"En Casamance"},{lettre:"D",texte:"Dans le Ferlo"}], reponseCorrecte:'B', explication:"Ouest/Centre-Ouest." },
      { enonce: "Les Diolas vivent :", options: [{lettre:"A",texte:"Au Nord"},{lettre:"B",texte:"Ouest"},{lettre:"C",texte:"En Casamance/Sud-Est"},{lettre:"D",texte:"Ferlo"}], reponseCorrecte:'C', explication:"Casamance." },
      { enonce: "Les Pulaars vivent :", options: [{lettre:"A",texte:"En Casamance"},{lettre:"B",texte:"Au Nord, le long du fleuve Sénégal"},{lettre:"C",texte:"À Dakar"},{lettre:"D",texte:"Dans les Niayes"}], reponseCorrecte:'B', explication:"Nord, fleuve Sénégal." },
      { enonce: "Les Sérères vivent dans :", options: [{lettre:"A",texte:"La Casamance"},{lettre:"B",texte:"Le Ferlo"},{lettre:"C",texte:"Le Bassin arachidier"},{lettre:"D",texte:"Le Nord"}], reponseCorrecte:'C', explication:"Bassin arachidier." },
      { enonce: "Les Sarakolés vivent à :", options: [{lettre:"A",texte:"Kolda"},{lettre:"B",texte:"Ziguinchor"},{lettre:"C",texte:"Bakel"},{lettre:"D",texte:"Louga"}], reponseCorrecte:'C', explication:"Bakel." },
      { enonce: "La plus forte densité se trouve à :", options: [{lettre:"A",texte:"Tambacounda"},{lettre:"B",texte:"Dakar, Thiès, Kaolack"},{lettre:"C",texte:"Kolda"},{lettre:"D",texte:"Kédougou"}], reponseCorrecte:'B', explication:"Dakar, Thiès, Kaolack." }
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 14 : L'EXODE RURAL
  // ══════════════════════════════════════════════════════════

  {
    ordre: 14,
    titre: "L'Exode Rural",
    objectif: "Comprendre les causes, les conséquences et les solutions de l'exode rural",
    promptSupplement: "Utilise des exemples de villages sénégalais. Adapte le vocabulaire pour des enfants de CM1.",
    contenuHTML: `
<h1>🚶 Leçon 14 : L'Exode Rural</h1>

<div class="bloc-essentiel">
  <p><strong>L'exode rural</strong> est le <mark>déplacement des populations villageoises vers les villes</mark>.</p>
</div>

<h2>❓ Les causes de l'exode rural</h2>
<ul>
  <li>La <strong>sécheresse</strong></li>
  <li>Le <strong>manque de travail</strong> dans les villages</li>
  <li>La <strong>famine</strong></li>
</ul>

<h2>⚠️ Les conséquences</h2>
<div class="bloc-important">
  <p>🏡 <strong>En campagne :</strong></p>
  <ul>
    <li>Baisse de la <mark>production agricole</mark></li>
    <li>Dépeuplement des villages</li>
    <li>Éclatement des familles</li>
    <li>Disparition des traditions</li>
  </ul>
  <p>🏙️ <strong>En ville :</strong></p>
  <ul>
    <li>Création de <mark>bidonvilles</mark></li>
    <li>Délinquance et banditisme</li>
    <li>Surpopulation</li>
  </ul>
</div>

<h2>✅ Les solutions</h2>
<ul>
  <li>Création de <strong>petits projets ruraux</strong></li>
  <li>Création de <strong>forages</strong> et de <strong>bassins de rétention</strong></li>
  <li>Création de <strong>centres de formation</strong></li>
  <li>Augmentation des <strong>prix des produits locaux</strong></li>
</ul>
`,
    exercices: [
      { question: "Qu'est-ce que l'exode rural ?", reponse: "Le déplacement des populations villageoises vers les villes.", explication: "Les gens quittent les villages pour s'installer en ville." },
      { question: "Cite deux causes de l'exode rural.", reponse: "La sécheresse et le manque de travail (ou la famine).", explication: "Les difficultés en campagne poussent les gens à partir en ville." },
      { question: "Quelle est une conséquence de l'exode rural en ville ?", reponse: "La création de bidonvilles (et la délinquance, la surpopulation).", explication: "L'afflux de population sans logement crée des quartiers précaires en ville." },
      { question: "Quelle est une conséquence de l'exode rural en campagne ?", reponse: "La baisse de la production agricole (et le dépeuplement des villages).", explication: "Quand les jeunes partent, il n'y a plus assez de bras pour cultiver les champs." },
      { question: "Cite une solution pour freiner l'exode rural.", reponse: "La création de petits projets ruraux (ou de forages, centres de formation).", explication: "Améliorer les conditions de vie en campagne incite les gens à rester." },
    ,
      { question: "Qu\'est-ce que l\'exode rural ?", reponse: "Le déplacement des populations villageoises vers les villes.", explication: "Migration campagne vers ville." },
      { question: "Cite une cause de l\'exode rural.", reponse: "La sécheresse, le manque de travail ou la famine.", explication: "Causes multiples." },
      { question: "Cite une conséquence en ville.", reponse: "Création de bidonvilles, délinquance, banditisme.", explication: "Problèmes urbains." },
      { question: "Cite une conséquence en campagne.", reponse: "Baisse de la production agricole, dépeuplement.", explication: "Problèmes ruraux." },
      { question: "Cite une solution contre l\'exode rural.", reponse: "Création de projets ruraux, forages, bassins de rétention.", explication: "Solutions pour fixer les populations." }
    ],
    qcm: [
      { enonce: "L'exode rural est :", options: [{lettre:'A',texte:"Le déplacement de gens vers les villages"},{lettre:'B',texte:"Le déplacement de gens vers les villes"},{lettre:'C',texte:"Un mouvement d'un pays à l'autre"},{lettre:'D',texte:"La migration vers l'Europe"}], reponseCorrecte:'B', explication:"L'exode rural = déplacement des villageois vers les villes." },
      { enonce: "Une cause de l'exode rural est :", options: [{lettre:'A',texte:"Les inondations en ville"},{lettre:'B',texte:"La sécheresse en campagne"},{lettre:'C',texte:"Les grèves"},{lettre:'D',texte:"Le tourisme"}], reponseCorrecte:'B', explication:"La sécheresse rend la vie difficile en campagne et pousse les gens à partir." },
      { enonce: "En ville, l'exode rural provoque :", options: [{lettre:'A',texte:"Plus d'agriculture"},{lettre:'B',texte:"La création de bidonvilles"},{lettre:'C',texte:"Plus de travail pour tous"},{lettre:'D',texte:"Moins de pollution"}], reponseCorrecte:'B', explication:"L'afflux de ruraux en ville sans logement crée des bidonvilles." },
      { enonce: "En campagne, l'exode rural provoque :", options: [{lettre:'A',texte:"Plus de production agricole"},{lettre:'B',texte:"Le dépeuplement et la baisse de production"},{lettre:'C',texte:"De nouveaux emplois"},{lettre:'D',texte:"La construction de routes"}], reponseCorrecte:'B', explication:"Quand les gens partent, les villages se vident et les champs sont abandonnés." },
      { enonce: "Une solution contre l'exode rural est :", options: [{lettre:'A',texte:"Construire plus de bidonvilles"},{lettre:'B',texte:"Interdire les villes"},{lettre:'C',texte:"Créer des projets ruraux et des forages"},{lettre:'D',texte:"Augmenter les impôts"}], reponseCorrecte:'C', explication:"Améliorer la vie en campagne (eau, emploi, formation) retient les populations." },
    ,
      { enonce: "L'exode rural est le déplacement :", options: [{lettre:"A",texte:"Vers les villages"},{lettre:"B",texte:"Vers les villes"},{lettre:"C",texte:"Vers l'étranger"},{lettre:"D",texte:"Saisonnier"}], reponseCorrecte:'B', explication:"Vers les villes." },
      { enonce: "Une cause de l'exode rural est :", options: [{lettre:"A",texte:"Les inondations en ville"},{lettre:"B",texte:"La sécheresse"},{lettre:"C",texte:"Les grèves"},{lettre:"D",texte:"Le tourisme"}], reponseCorrecte:'B', explication:"Sécheresse." },
      { enonce: "Une conséquence en ville est :", options: [{lettre:"A",texte:"Plus d'agriculture"},{lettre:"B",texte:"La création de bidonvilles"},{lettre:"C",texte:"Plus de travail"},{lettre:"D",texte:"Moins de pollution"}], reponseCorrecte:'B', explication:"Bidonvilles." },
      { enonce: "Une conséquence en campagne est :", options: [{lettre:"A",texte:"Plus de production"},{lettre:"B",texte:"Dépeuplement et baisse de production"},{lettre:"C",texte:"Nouveaux emplois"},{lettre:"D",texte:"Routes"}], reponseCorrecte:'B', explication:"Dépeuplement." },
      { enonce: "Une solution contre l'exode rural est :", options: [{lettre:"A",texte:"Construire des bidonvilles"},{lettre:"B",texte:"Créer des projets ruraux et des forages"},{lettre:"C",texte:"Interdire les villes"},{lettre:"D",texte:"Augmenter les impôts"}], reponseCorrecte:'B', explication:"Projets ruraux." },
      { enonce: "L'exode rural est causé principalement par :", options: [{lettre:"A",texte:"Le tourisme"},{lettre:"B",texte:"La sécheresse, le manque de travail, la famine"},{lettre:"C",texte:"Les guerres"},{lettre:"D",texte:"La pollution"}], reponseCorrecte:'B', explication:"Sécheresse, manque de travail, famine." }
    ],
  },

];

;

// ─────────────────────────────────────────────────────────────
// QUIZ DATA — 6 questions par leçon
// ─────────────────────────────────────────────────────────────
const QUIZ_DATA = {
  2: [ // Le Planisphère
    { q:"Combien de continents y a-t-il sur Terre ?", opts:["Trois","Quatre","Cinq","Six"], ok:2 },
    { q:"Quel continent se trouve à l'Ouest de l'Europe ?", opts:["L'Asie","L'Afrique","L'Amérique","L'Océanie"], ok:2 },
    { q:"L'Équateur sépare la Terre en :", opts:["Est et Ouest","Nord et Sud","Haut et Bas","Droite et Gauche"], ok:1 },
    { q:"Le tropique du Cancer est situé :", opts:["Au Sud","À l'Est","Au Nord","À l'Ouest"], ok:2 },
    { q:"Combien d'océans y a-t-il sur Terre ?", opts:["Trois","Quatre","Cinq","Six"], ok:2 },
    { q:"L'océan qui borde le Sénégal à l'Ouest est :", opts:["L'Indien","Le Pacifique","L'Arctique","L'Atlantique"], ok:3 },
  ],
  3: [ // Sénégal : Situation
    { q:"Le Sénégal est situé à :", opts:["L'Est de l'Afrique","L'extrême Ouest de l'Afrique","Au centre de l'Afrique","Au Nord de l'Afrique"], ok:1 },
    { q:"Quel pays borde le Sénégal au Nord ?", opts:["Le Mali","La Gambie","La Mauritanie","La Guinée"], ok:2 },
    { q:"La Gambie est :", opts:["Un fleuve","Une enclave dans le Sénégal","Une île","Un lac"], ok:1 },
    { q:"La superficie du Sénégal est de :", opts:["96 712 km²","196 712 km²","296 712 km²","156 000 km²"], ok:1 },
    { q:"La zone intertropicale est :", opts:["Une zone très froide","Une zone tempérée","Une zone très chaude","Une zone polaire"], ok:2 },
    { q:"Quel pays borde le Sénégal à l'Est ?", opts:["La Mauritanie","La Guinée","La Gambie","Le Mali"], ok:3 },
  ],
  4: [ // Relief
    { q:"Le relief général du Sénégal est :", opts:["Très montagneux","Une vaste plaine","Un désert","Un plateau élevé"], ok:1 },
    { q:"Le point culminant du Sénégal est :", opts:["Le plateau de Thiès","Le massif de Ndiass","Les collines de Kédougou","Les Mamelles"], ok:2 },
    { q:"Quelle est la hauteur des Mamelles ?", opts:["90 m","105 m","128 m","581 m"], ok:1 },
    { q:"Le plateau de Thiès s'élève à :", opts:["90 m","105 m","128 m","200 m"], ok:2 },
    { q:"Le relief est :", opts:["L'ensemble des rivières","Les irrégularités du sol","La végétation","Le climat d'une zone"], ok:1 },
    { q:"Le massif de Ndiass s'élève à :", opts:["581 m","128 m","105 m","90 m"], ok:3 },
  ],
  5: [ // Climat
    { q:"Le Sénégal a un climat :", opts:["Polaire","Tropical","Désertique","Tempéré"], ok:1 },
    { q:"L'harmattan est :", opts:["Un vent frais de la mer","Un vent humide","Un vent chaud et sec du Sahara","Un vent froid du nord"], ok:2 },
    { q:"Quel vent apporte la pluie ?", opts:["L'harmattan","L'alizé","La mousson","Le sirocco"], ok:2 },
    { q:"Le Sénégal a :", opts:["Une saison","Deux saisons","Trois saisons","Quatre saisons"], ok:1 },
    { q:"Le climat de la basse Casamance est :", opts:["Sahélien","Soudanien","Côtier","Chaud et très pluvieux"], ok:3 },
    { q:"Les critères du climat sont :", opts:["La végétation, le sol, les fleuves","La température, les vents, les pluies","Les montagnes, les plaines, les fleuves","Les ethnies, les langues, les religions"], ok:1 },
  ],
  6: [ // Cours d'eau
    { q:"Le fleuve Sénégal fait :", opts:["1 150 km","1 500 km","1 750 km","2 000 km"], ok:2 },
    { q:"Le lac de Guiers alimente en eau potable :", opts:["Ziguinchor","Tambacounda","Dakar","Saint-Louis"], ok:2 },
    { q:"Le fleuve Sénégal prend sa source :", opts:["À Dakar","Au Fouta Djalon","À Mamou en Guinée","Au Mali"], ok:2 },
    { q:"Le lac rose est aussi appelé :", opts:["Lac Tanma","Lac de Guiers","Lac Retba","Lac Bleu"], ok:2 },
    { q:"Le débit des fleuves dépend de :", opts:["Le vent","La pluie","Le soleil","La mer"], ok:1 },
    { q:"Le fleuve Gambie prend sa source :", opts:["À Dakar","Au Fouta Djalon (Guinée)","À Mamou","Au Sénégal"], ok:1 },
  ],
  7: [ // OMVS / Cours d'eau
    { q:"L'OMVS signifie :", opts:["Organisation Mondiale de la Végétation Sénégalaise","Organisation pour la Mise en Valeur du fleuve Sénégal","Organisation Maritime de la Voie Sahélienne","Ordre des Maîtres Villageois du Sénégal"], ok:1 },
    { q:"Le barrage de Diama est situé à :", opts:["Dakar","Ziguinchor","Saint-Louis","Tambacounda"], ok:2 },
    { q:"Le barrage de Manantali est :", opts:["Anti-sel","Hydro-électrique","Anti-inondation","Pour la pêche"], ok:1 },
    { q:"L'OMVS regroupe :", opts:["Le Sénégal seul","Le Sénégal et la Gambie","Mauritanie, Mali, Guinée, Sénégal","Tous les pays d'Afrique de l'Ouest"], ok:2 },
    { q:"Les barrages permettent l'irrigation, c'est-à-dire :", opts:["Pêcher dans les fleuves","Arroser les terres pour la culture","Naviguer plus vite","Produire du sel"], ok:1 },
    { q:"L'OMVG gère le fleuve :", opts:["Sénégal","Casamance","Gambie","Sine"], ok:2 },
  ],
  8: [ // Sols
    { q:"Les sols Dior sont propices à :", opts:["La culture du riz","La culture de l'arachide","L'élevage","La pêche"], ok:1 },
    { q:"Les sols des Niayes sont :", opts:["Pauvres","Salins","Humides et fertiles","Latéritiques"], ok:2 },
    { q:"Les sols pauvres se trouvent dans :", opts:["La Casamance","Le Sahel (Louga, Saint-Louis)","Les Niayes","Le bassin arachidier"], ok:1 },
    { q:"Les sols latéritiques sont :", opts:["Très fertiles","Faciles à cultiver","Difficiles à cultiver","Humides"], ok:2 },
    { q:"Les sols salins se trouvent à :", opts:["Dakar","Saint-Louis","Kaolack, Fatick","Tambacounda"], ok:2 },
    { q:"Dans le Sud-Ouest, les sols argileux favorisent :", opts:["L'arachide","Les céréales (mil, maïs)","Le coton","La gomme arabique"], ok:1 },
  ],
  9: [ // Végétation
    { q:"La végétation dépend de :", opts:["La population","Le climat et les sols","Les fleuves uniquement","Le relief uniquement"], ok:1 },
    { q:"La forêt dense se trouve :", opts:["Au Nord","Dans le Sahel","Au Sud-Ouest","À Dakar"], ok:2 },
    { q:"La steppe est :", opts:["Une forêt dense","Une forêt dégradée","Une savane luxuriante","Une mangrove"], ok:1 },
    { q:"La forêt protège le sol contre :", opts:["La pluie","Le vent","L'érosion","Le froid"], ok:2 },
    { q:"La pharmacopée désigne :", opts:["Les arbres fruitiers","Les plantes médicinales","Les forêts denses","La mangrove"], ok:1 },
    { q:"Dans les Niayes, on trouve surtout :", opts:["La steppe","La forêt dense","Les cultures maraîchères","La brousse épineuse"], ok:2 },
  ],
  10: [ // Régions naturelles
    { q:"Il y a combien de régions naturelles au Sénégal ?", opts:["Quatre","Cinq","Six","Sept"], ok:2 },
    { q:"Le Bassin arachidier est surtout connu pour :", opts:["L'élevage","La pêche","La culture de l'arachide","Le riz"], ok:2 },
    { q:"La Casamance est caractérisée par :", opts:["Un désert","Une végétation luxuriante","Des sols pauvres","La steppe"], ok:1 },
    { q:"Le Ferlo (Centre Est) est une zone de :", opts:["Culture du riz","Pêche maritime","Gomme arabique et d'élevage","Cultures maraîchères"], ok:2 },
    { q:"Les Niayes sont le domaine des :", opts:["Cultures céréalières","Cultures maraîchères","L'élevage","La pêche"], ok:1 },
    { q:"Dans la vallée du fleuve Sénégal, on cultive :", opts:["L'arachide uniquement","Le mil, le maïs, le riz, la tomate","La gomme arabique","La banane"], ok:1 },
  ],
  11: [ // Découpage administratif
    { q:"Depuis 2008, le Sénégal compte :", opts:["10 régions","11 régions","12 régions","14 régions"], ok:3 },
    { q:"Qui administre une région ?", opts:["Le préfet","Le maire","Le gouverneur","Le sous-préfet"], ok:2 },
    { q:"Qui dirige un département ?", opts:["Le gouverneur","Le préfet","Le maire","Le sous-préfet"], ok:1 },
    { q:"En 1960, le Sénégal avait combien de régions ?", opts:["5","7","10","14"], ok:1 },
    { q:"Qui administre une commune ?", opts:["Le gouverneur","Le préfet","Le maire","Le chef de village"], ok:2 },
    { q:"Quelle est l'une des 4 dernières régions créées en 2008 ?", opts:["Dakar","Kaolack","Kaffrine","Thiès"], ok:2 },
  ],
  12: [ // Population : Composition
    { q:"La population du Sénégal est d'environ :", opts:["5 millions","10 millions","19,5 millions","30 millions"], ok:2 },
    { q:"La langue officielle du Sénégal est :", opts:["Le wolof","L'arabe","Le français","Le diola"], ok:2 },
    { q:"La religion majoritaire au Sénégal est :", opts:["Le christianisme","L'animisme","L'islam","Le bouddhisme"], ok:2 },
    { q:"La densité se calcule :", opts:["Population × Superficie","Population ÷ Superficie","Superficie ÷ Population","Population + Superficie"], ok:1 },
    { q:"La langue la plus répandue au Sénégal est :", opts:["Le français","Le sérère","Le wolof","Le diola"], ok:2 },
    { q:"La moitié des Sénégalais a moins de :", opts:["10 ans","15 ans","18 ans","25 ans"], ok:2 },
  ],
  13: [ // Population : Répartition
    { q:"La population sénégalaise est :", opts:["Uniformément répartie","Concentrée à l'Est","Inégalement répartie","Concentrée au Nord"], ok:2 },
    { q:"La plus forte densité se trouve à :", opts:["Tambacounda","Dakar, Thiès, Kaolack","Kolda","Kédougou"], ok:1 },
    { q:"Les Sérères vivent surtout dans :", opts:["La Casamance","Le Ferlo","Le bassin arachidier (Kaolack, Fatick)","Le Nord"], ok:2 },
    { q:"Les Pulaars vivent surtout :", opts:["En Casamance","Au Nord, le long du fleuve Sénégal","À Dakar","Dans les Niayes"], ok:1 },
    { q:"Les Sarakolés vivent à :", opts:["Kolda","Ziguinchor","Bakel","Louga"], ok:2 },
    { q:"Les Diolas vivent principalement :", opts:["Au Nord","En Casamance et au Sud-Est","Dans le Ferlo","À Dakar"], ok:1 },
  ],
  14: [ // Exode rural
    { q:"L'exode rural est :", opts:["Le déplacement vers les villages","Le déplacement vers les villes","L'immigration en Europe","La migration saisonnière"], ok:1 },
    { q:"Une cause de l'exode rural est :", opts:["Les inondations en ville","La sécheresse en campagne","Les grèves","Le tourisme"], ok:1 },
    { q:"En ville, l'exode rural provoque :", opts:["Plus d'agriculture","La création de bidonvilles","Plus de travail pour tous","Moins de pollution"], ok:1 },
    { q:"En campagne, l'exode rural provoque :", opts:["Plus de production agricole","Le dépeuplement et la baisse de production","De nouveaux emplois","La construction de routes"], ok:1 },
    { q:"Une solution contre l'exode rural est :", opts:["Construire plus de bidonvilles","Interdire les villes","Créer des projets ruraux et des forages","Augmenter les impôts"], ok:2 },
    { q:"L'exode rural est causé principalement par :", opts:["Le tourisme","La sécheresse, le manque de travail, la famine","Les guerres","La pollution"], ok:1 },
  ],
};

// ─────────────────────────────────────────────────────────────
// GÉNÉRATEURS HTML pour Quiz et Correction
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

  // ── 1. Trouver la matière Géographie ─────────────────────
  const matiere = await Matiere.findOne({ code: 'GE' });
  if (!matiere) {
    console.error('❌ Matière Géographie (GE) introuvable. Lance d\'abord node src/db/seed.js');
    process.exit(1);
  }
  console.log(`✅ Matière trouvée : ${matiere.nom} (${matiere._id})\n`);

  // ── 2. Trouver un admin ───────────────────────────────────
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.error('❌ Aucun admin trouvé. Lance d\'abord node src/db/seed.js');
    process.exit(1);
  }
  console.log(`✅ Admin trouvé : ${admin.email}\n`);

  let nbChapitres = 0, nbLecons = 0, nbQcms = 0, nbQuiz = 0;

  for (const data of LECONS_DATA) {
    console.log(`📚 Traitement : Leçon ${data.ordre} — ${data.titre}`);

    // ── 3. Créer ou mettre à jour le chapitre ────────────────
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

    // ── 4. Archiver les anciennes leçons publiées ────────────
    await Lecon.updateMany(
      { chapitreId: chapitre._id, statut: 'publie' },
      { statut: 'brouillon' }
    );

    // ── 5. Créer la leçon avec contenuHTML ───────────────────
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

    // ── 6. Supprimer les anciens QCM de ce chapitre ──────────
    await Qcm.deleteMany({ chapitreId: chapitre._id });

    // ── 7. Créer le QCM ──────────────────────────────────────
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

    // ── 8. Supprimer les anciens quiz de ce chapitre ─────────
    await Entrainement.deleteMany({ matiere: 'Géographie', niveau: 'CM1', chapitre: data.titre });

    // ── 9. Créer le Quiz (Entrainement) ──────────────────────
    const quizQuestions = QUIZ_DATA[data.ordre];
    const entrainement = await Entrainement.create({
      matiere:        'Géographie',
      niveau:         'CM1',
      section:        '',
      chapitre:       data.titre,
      ordre:          data.ordre,
      titre:          `Quiz — ${data.titre}`,
      source:         'Cours CM1 Géographie',
      nbExercices:    quizQuestions.length,
      contenuHTML:    genererQuizHTML(data.titre, quizQuestions),
      correctionHTML: genererCorrectionHTML(data.titre, quizQuestions),
      publie:         true,
      creePar:        admin._id,
    });
    nbQuiz++;
    console.log(`   ✅ Quiz publié  : ${entrainement._id} (${quizQuestions.length} questions)\n`);
  }

  // ── Résumé final ──────────────────────────────────────────
  console.log('🎓 ══════════════════════════════════════════════');
  console.log('   Seed Géographie CM1 terminé avec succès !');
  console.log(`   📚 Chapitres créés/mis à jour : ${nbChapitres}`);
  console.log(`   📖 Leçons publiées            : ${nbLecons}`);
  console.log(`   ✏️  QCMs publiés              : ${nbQcms}`);
  console.log(`   ⚡ Quiz publiés               : ${nbQuiz}`);
  console.log('   → Les élèves CM1 peuvent maintenant');
  console.log('     accéder aux cours de Géographie !');
  console.log('══════════════════════════════════════════════\n');

  process.exit(0);
};

seed().catch(e => {
  console.error('❌ Erreur seed Géographie CM1 :', e.message);
  console.error(e.stack);
  process.exit(1);
});
