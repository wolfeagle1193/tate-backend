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
// seed-histoire-cm1.js
// Intègre les 14 leçons d'Histoire CM1 dans la plateforme Taté
// Leçons : 1,2,3,4,5,6,7,8,12,16,17,18,19,20
//
// Usage : node src/db/seed-histoire-cm1.js
// ============================================================

// ─────────────────────────────────────────────────────────────
// DONNÉES DES LEÇONS
// ─────────────────────────────────────────────────────────────
const LECONS_DATA = [

  // ══════════════════════════════════════════════════════════
  // LEÇON 1 : L'HISTOIRE
  // ══════════════════════════════════════════════════════════
  {
    ordre: 1,
    titre: "L'Histoire",
    objectif: "Comprendre ce qu'est l'histoire, ses sources et ses systèmes de datation",
    promptSupplement: "Utilise des exemples africains et sénégalais. Vocabulaire adapté aux élèves de CM1.",
    contenuHTML: `
<h1>🌍 Leçon 1 : L'Histoire</h1>

<div class="bloc-essentiel">
  <p><strong>L'histoire</strong> est une <mark>science</mark> qui étudie le <mark>passé des hommes</mark> et leur <strong>civilisation</strong>. Elle commence depuis la découverte des métaux et de l'écriture.</p>
</div>

<h2>📜 Les sources de l'histoire</h2>
<p>Pour connaître le passé, les historiens utilisent différentes sources :</p>
<ul>
  <li><strong>Les sources orales</strong> : récits transmis de bouche à oreille (griots, anciens)</li>
  <li><strong>Les sources écrites</strong> : textes, livres, manuscrits anciens</li>
  <li><strong>Les vestiges</strong> : objets, outils, ruines découverts</li>
  <li><strong>Les sites historiques</strong> : lieux importants préservés</li>
</ul>

<h2>📅 Les systèmes de datation</h2>
<p>Pour fixer les événements du passé, on utilise <strong>deux systèmes</strong> :</p>
<ul>
  <li><mark>L'ère chrétienne</mark> : à partir de la naissance de <strong>Jésus Christ</strong> (l'an 1)</li>
  <li><mark>L'ère musulmane</mark> : à partir de <strong>l'Hégire</strong> en <strong>622</strong> après Jésus Christ</li>
</ul>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong> L'Hégire = l'exil du prophète <strong>Mohamed (PSL)</strong> de la Mecque vers <strong>Médine</strong>. C'est l'An 1 de l'ère musulmane.
</div>

<h2>📝 Résumé à retenir</h2>
<ul>
  <li>L'histoire étudie le <strong>passé des hommes</strong></li>
  <li>Il existe 4 sources : <strong>orales, écrites, vestiges, sites historiques</strong></li>
  <li>Deux ères : <strong>chrétienne</strong> (naissance de Jésus) et <strong>musulmane</strong> (Hégire, 622)</li>
</ul>
`,
    exercices: [
      { question: "Qu'est-ce que l'histoire ?", reponse: "L'histoire est une science qui étudie le passé des hommes et leur civilisation.", explication: "Elle commence depuis la découverte des métaux et de l'écriture." },
      { question: "Cite 4 sources de l'histoire.", reponse: "Les sources orales, écrites, les vestiges et les sites historiques.", explication: "Ces 4 sources permettent aux historiens de reconstituer le passé." },
      { question: "À partir de quel événement commence l'ère chrétienne ?", reponse: "L'ère chrétienne commence à partir de la naissance de Jésus Christ (l'an 1).", explication: "C'est le premier système de datation utilisé en histoire." },
      { question: "Qu'est-ce que l'Hégire ?", reponse: "L'Hégire est l'exil du prophète Mohamed (PSL) de la Mecque vers Médine.", explication: "C'est l'an 1 de l'ère musulmane, qui correspond à 622 après Jésus Christ." },
      { question: "En quelle année a eu lieu l'Hégire ?", reponse: "L'Hégire a eu lieu en 622 après Jésus Christ.", explication: "C'est le point de départ de l'ère musulmane." },
    ],
    qcm: [
      {
        enonce: "L'histoire est une science qui étudie...",
        options: [
          { lettre: "A", texte: "Le futur des hommes" },
          { lettre: "B", texte: "Le passé des hommes et leur civilisation" },
          { lettre: "C", texte: "La nature et les animaux" },
          { lettre: "D", texte: "Les planètes et l'espace" },
        ],
        reponseCorrecte: "B",
        explication: "L'histoire est bien une science qui étudie le passé des hommes et leur civilisation.",
      },
      {
        enonce: "À partir de quel événement commence l'ère chrétienne ?",
        options: [
          { lettre: "A", texte: "L'Hégire du prophète Mohamed" },
          { lettre: "B", texte: "La découverte des métaux" },
          { lettre: "C", texte: "La naissance de Jésus Christ" },
          { lettre: "D", texte: "La bataille de Danki" },
        ],
        reponseCorrecte: "C",
        explication: "L'ère chrétienne débute à la naissance de Jésus Christ (l'an 1).",
      },
      {
        enonce: "L'ère musulmane commence en quelle année ?",
        options: [
          { lettre: "A", texte: "L'an 1" },
          { lettre: "B", texte: "L'an 622 après Jésus Christ" },
          { lettre: "C", texte: "L'an 1549" },
          { lettre: "D", texte: "L'an 1776" },
        ],
        reponseCorrecte: "B",
        explication: "L'Hégire, qui marque le début de l'ère musulmane, a eu lieu en 622 après Jésus Christ.",
      },
      {
        enonce: "Qu'est-ce que l'Hégire ?",
        options: [
          { lettre: "A", texte: "La naissance de Jésus Christ" },
          { lettre: "B", texte: "Une grande bataille historique" },
          { lettre: "C", texte: "L'exil du prophète Mohamed de la Mecque vers Médine" },
          { lettre: "D", texte: "Un livre religieux ancien" },
        ],
        reponseCorrecte: "C",
        explication: "L'Hégire est l'exil du prophète Mohamed (PSL) de la Mecque vers Médine en 622.",
      },
      {
        enonce: "Lesquelles sont des sources de l'histoire ?",
        options: [
          { lettre: "A", texte: "Les films et les séries télévisées" },
          { lettre: "B", texte: "Les sources orales, écrites, vestiges et sites historiques" },
          { lettre: "C", texte: "Les journaux télévisés modernes" },
          { lettre: "D", texte: "Les réseaux sociaux" },
        ],
        reponseCorrecte: "B",
        explication: "Les 4 sources de l'histoire sont : orales, écrites, vestiges et sites historiques.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 2 : LA PRÉHISTOIRE
  // ══════════════════════════════════════════════════════════
  {
    ordre: 2,
    titre: "La Préhistoire",
    objectif: "Connaître les deux grandes périodes de la préhistoire et le mode de vie des hommes préhistoriques",
    promptSupplement: "Insiste sur la différence nomade/sédentaire et sur le berceau de l'humanité en Afrique.",
    contenuHTML: `
<h1>🪨 Leçon 2 : La Préhistoire</h1>

<div class="bloc-essentiel">
  <p>La préhistoire raconte la vie des <strong>hommes préhistoriques</strong>. Elle commence avec <mark>l'apparition de l'homme sur la Terre</mark> et se termine avec la <mark>découverte des métaux</mark> et <mark>l'invention de l'écriture</mark>.</p>
</div>

<h2>⏳ Les deux grandes périodes</h2>

<h3>1. Le Paléolithique = l'âge de la pierre taillée</h3>
<ul>
  <li>L'homme vivait de <strong>chasse</strong>, de <strong>pêche</strong> et de <strong>cueillette</strong></li>
  <li>L'homme était <mark>nomade</mark> : il se déplaçait constamment sans s'installer</li>
</ul>

<h3>2. Le Néolithique = l'âge de la pierre polie</h3>
<ul>
  <li>L'homme pratiquait l'<strong>agriculture</strong>, l'<strong>élevage</strong>, le <strong>tissage</strong>, la <strong>poterie</strong></li>
  <li>Il maîtrisait le <strong>feu</strong></li>
  <li>L'homme se <mark>sédentarisait</mark> et créait les <strong>premiers villages</strong></li>
</ul>

<div class="bloc-attention">
  <strong>🦴 À retenir :</strong> Les squelettes les plus anciens ont été découverts en <strong>Afrique</strong>. C'est pourquoi l'Afrique est considérée comme le <mark>« berceau de l'humanité »</mark>.
</div>

<h2>📝 Résumé à retenir</h2>
<ul>
  <li><strong>Paléolithique</strong> = pierre taillée → homme <strong>nomade</strong> (chasse, pêche, cueillette)</li>
  <li><strong>Néolithique</strong> = pierre polie → homme <strong>sédentaire</strong> (agriculture, élevage, villages)</li>
  <li>L'Afrique = <strong>berceau de l'humanité</strong></li>
</ul>
`,
    exercices: [
      { question: "Quand commence et quand se termine la préhistoire ?", reponse: "La préhistoire commence avec l'apparition de l'homme sur la Terre et se termine avec la découverte des métaux et l'invention de l'écriture.", explication: "C'est la période qui précède l'histoire proprement dite." },
      { question: "Qu'est-ce que le Paléolithique ?", reponse: "Le Paléolithique est l'âge de la pierre taillée. L'homme était nomade et vivait de chasse, de pêche et de cueillette.", explication: "C'est la première grande période de la préhistoire." },
      { question: "Qu'est-ce que le Néolithique ?", reponse: "Le Néolithique est l'âge de la pierre polie. L'homme se sédentarise, pratique l'agriculture et l'élevage, et crée les premiers villages.", explication: "C'est la seconde grande période de la préhistoire." },
      { question: "Pourquoi l'Afrique est-elle appelée le berceau de l'humanité ?", reponse: "Parce que les squelettes les plus anciens ont été découverts en Afrique.", explication: "Cela prouve que les premiers hommes sont apparus sur le continent africain." },
      { question: "Quelle est la différence entre un homme nomade et un homme sédentaire ?", reponse: "Un nomade se déplace constamment (Paléolithique). Un sédentaire s'installe dans un lieu fixe et crée des villages (Néolithique).", explication: "C'est l'une des grandes évolutions entre les deux périodes de la préhistoire." },
    ],
    qcm: [
      {
        enonce: "Le Paléolithique est aussi appelé...",
        options: [
          { lettre: "A", texte: "L'âge de la pierre polie" },
          { lettre: "B", texte: "L'âge de la pierre taillée" },
          { lettre: "C", texte: "L'âge des métaux" },
          { lettre: "D", texte: "L'âge de l'écriture" },
        ],
        reponseCorrecte: "B",
        explication: "Le Paléolithique est bien l'âge de la pierre taillée, première période de la préhistoire.",
      },
      {
        enonce: "Au Paléolithique, l'homme était...",
        options: [
          { lettre: "A", texte: "Sédentaire et agriculteur" },
          { lettre: "B", texte: "Potier et tisserand" },
          { lettre: "C", texte: "Nomade, vivant de chasse, pêche et cueillette" },
          { lettre: "D", texte: "Commerçant et artisan" },
        ],
        reponseCorrecte: "C",
        explication: "Au Paléolithique, l'homme était nomade et vivait de chasse, de pêche et de cueillette.",
      },
      {
        enonce: "Au Néolithique, l'homme a créé...",
        options: [
          { lettre: "A", texte: "Les premières grandes villes" },
          { lettre: "B", texte: "Les premiers villages" },
          { lettre: "C", texte: "Les premières écoles" },
          { lettre: "D", texte: "Les premiers royaumes" },
        ],
        reponseCorrecte: "B",
        explication: "Au Néolithique, en se sédentarisant, l'homme a créé les premiers villages.",
      },
      {
        enonce: "Pourquoi l'Afrique est-elle appelée 'berceau de l'humanité' ?",
        options: [
          { lettre: "A", texte: "Parce qu'elle est le plus grand continent" },
          { lettre: "B", texte: "Parce que les premiers squelettes humains y ont été découverts" },
          { lettre: "C", texte: "Parce qu'elle a le plus de royaumes" },
          { lettre: "D", texte: "Parce qu'elle est la plus riche" },
        ],
        reponseCorrecte: "B",
        explication: "Les squelettes les plus anciens ont été découverts en Afrique, d'où son titre de berceau de l'humanité.",
      },
      {
        enonce: "Combien de grandes périodes compte la préhistoire ?",
        options: [
          { lettre: "A", texte: "Une seule" },
          { lettre: "B", texte: "Deux : Paléolithique et Néolithique" },
          { lettre: "C", texte: "Trois" },
          { lettre: "D", texte: "Quatre" },
        ],
        reponseCorrecte: "B",
        explication: "La préhistoire compte deux grandes périodes : le Paléolithique et le Néolithique.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 3 : LA PRÉHISTOIRE AU SÉNÉGAL
  // ══════════════════════════════════════════════════════════
  {
    ordre: 3,
    titre: "La Préhistoire au Sénégal",
    objectif: "Connaître les sites préhistoriques du Sénégal et comprendre la méthode de datation par le carbone 14",
    promptSupplement: "Insiste sur la fierté nationale : Cheikh Anta Diop est sénégalais. Citer tous les sites préhistoriques.",
    contenuHTML: `
<h1>🦴 Leçon 3 : La Préhistoire au Sénégal</h1>

<div class="bloc-essentiel">
  <p>Des <strong>ossements et des outils</strong> (silex, grattoirs, perçoirs, pointes, lames...) datant du <mark>Paléolithique</mark> et du <mark>Néolithique</mark> ont été découverts au Sénégal. Cela prouve que le Sénégal avait une <strong>civilisation préhistorique</strong>.</p>
</div>

<h2>🗺️ Les principaux sites préhistoriques du Sénégal</h2>
<ul>
  <li><strong>La Pointe de Fann</strong></li>
  <li><strong>Les Gisements des Madeleines</strong></li>
  <li><strong>Le Site de Bel-Air</strong> (Dakar)</li>
  <li><strong>Les Thiémassas</strong> (Thiès)</li>
  <li><strong>Le Site du Niokolo-Koba</strong> (Tambacounda)</li>
</ul>

<h2>🏛️ Conservation des vestiges</h2>
<p>Les vestiges découverts sont gardés au musée de l'<mark>I.F.A.N</mark> (Institut Fondamental d'Afrique Noire).</p>

<h2>🔬 La datation par le carbone 14</h2>
<p>La datation par le <strong>carbone 14</strong>, inventée par le <mark>Professeur Cheikh Anta Diop</mark> (Sénégalais), permet de déterminer l'âge des ossements et des vestiges préhistoriques.</p>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong><br>
  • <strong>IFAN</strong> = Institut Fondamental d'Afrique Noire<br>
  • <strong>Protohistoire</strong> = période comprise entre la préhistoire et l'histoire
</div>

<h2>📝 Résumé à retenir</h2>
<ul>
  <li>5 sites préhistoriques : <strong>Pointe de Fann, Madeleines, Bel-Air, Thiémassas, Niokolo-Koba</strong></li>
  <li>Vestiges conservés à l'<strong>IFAN</strong></li>
  <li>Datation par <strong>carbone 14</strong> → inventée par <strong>Cheikh Anta Diop</strong></li>
</ul>
`,
    exercices: [
      { question: "Cite 3 sites préhistoriques du Sénégal.", reponse: "La Pointe de Fann, les Gisements des Madeleines, le Site de Bel-Air, les Thiémassas, le Site du Niokolo-Koba.", explication: "Il y a 5 principaux sites préhistoriques au Sénégal." },
      { question: "Où sont conservés les vestiges préhistoriques du Sénégal ?", reponse: "Les vestiges sont conservés au musée de l'IFAN (Institut Fondamental d'Afrique Noire).", explication: "L'IFAN est le principal musée historique du Sénégal." },
      { question: "Qui a inventé la datation par le carbone 14 ?", reponse: "La datation par le carbone 14 a été inventée par le Professeur Cheikh Anta Diop.", explication: "Cheikh Anta Diop était un grand savant sénégalais." },
      { question: "Que signifie IFAN ?", reponse: "IFAN signifie Institut Fondamental d'Afrique Noire.", explication: "C'est un institut de recherche et de conservation du patrimoine africain." },
      { question: "Qu'est-ce que la Protohistoire ?", reponse: "La Protohistoire est la période comprise entre la préhistoire et l'histoire.", explication: "C'est une période de transition entre ces deux grandes époques." },
    ],
    qcm: [
      {
        enonce: "Où sont gardés les vestiges préhistoriques du Sénégal ?",
        options: [
          { lettre: "A", texte: "Au Musée du Louvre à Paris" },
          { lettre: "B", texte: "Au Musée de l'IFAN" },
          { lettre: "C", texte: "Au Palais de la République" },
          { lettre: "D", texte: "À l'Assemblée nationale" },
        ],
        reponseCorrecte: "B",
        explication: "Les vestiges préhistoriques du Sénégal sont conservés au musée de l'IFAN.",
      },
      {
        enonce: "Qui a inventé la datation par le carbone 14 ?",
        options: [
          { lettre: "A", texte: "Léopold Sédar Senghor" },
          { lettre: "B", texte: "Albert Einstein" },
          { lettre: "C", texte: "Professeur Cheikh Anta Diop" },
          { lettre: "D", texte: "Amadou Bamba" },
        ],
        reponseCorrecte: "C",
        explication: "Le Professeur Cheikh Anta Diop, savant sénégalais, a inventé la datation par le carbone 14.",
      },
      {
        enonce: "IFAN signifie...",
        options: [
          { lettre: "A", texte: "Institut Français d'Afrique du Nord" },
          { lettre: "B", texte: "Institut Fondamental d'Afrique Noire" },
          { lettre: "C", texte: "Institut Fédéral d'Afrique Noire" },
          { lettre: "D", texte: "Institut Francophone d'Afrique Noire" },
        ],
        reponseCorrecte: "B",
        explication: "IFAN = Institut Fondamental d'Afrique Noire.",
      },
      {
        enonce: "Le site du Niokolo-Koba se trouve à...",
        options: [
          { lettre: "A", texte: "Dakar" },
          { lettre: "B", texte: "Thiès" },
          { lettre: "C", texte: "Saint-Louis" },
          { lettre: "D", texte: "Tambacounda" },
        ],
        reponseCorrecte: "D",
        explication: "Le site préhistorique du Niokolo-Koba est situé à Tambacounda.",
      },
      {
        enonce: "La Protohistoire est...",
        options: [
          { lettre: "A", texte: "La période avant la préhistoire" },
          { lettre: "B", texte: "La période après l'histoire moderne" },
          { lettre: "C", texte: "La période comprise entre la préhistoire et l'histoire" },
          { lettre: "D", texte: "La période des premiers royaumes" },
        ],
        reponseCorrecte: "C",
        explication: "La Protohistoire est la période de transition entre la préhistoire et l'histoire.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 4 : L'ÉVOLUTION DES SOCIÉTÉS AFRICAINES
  // ══════════════════════════════════════════════════════════
  {
    ordre: 4,
    titre: "L'Évolution des Sociétés Africaines",
    objectif: "Identifier et décrire les 5 structures de la société africaine",
    promptSupplement: "Utilise des exemples concrets tirés de la vie sénégalaise (famille étendue, ethnie wolof, peul, sérère, etc.).",
    contenuHTML: `
<h1>👥 Leçon 4 : L'Évolution des Sociétés Africaines</h1>

<div class="bloc-essentiel">
  <p>L'organisation de la société africaine repose sur <mark>5 structures</mark> fondamentales : la <strong>famille</strong>, le <strong>clan</strong>, la <strong>tribu</strong>, l'<strong>ethnie</strong> et le <strong>royaume</strong>.</p>
</div>

<h2>🏠 Les 5 structures de la société africaine</h2>

<table>
  <thead>
    <tr><th>Structure</th><th>Définition</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>La Famille</strong></td>
      <td>Cellule de base de la société africaine. Elle est <mark>étendue</mark> contrairement à la famille européenne.</td>
    </tr>
    <tr>
      <td><strong>Le Clan</strong></td>
      <td>Ensemble de personnes issues du <mark>même ancêtre</mark>.</td>
    </tr>
    <tr>
      <td><strong>La Tribu</strong></td>
      <td>Groupe social et politique qui regroupe des familles liées par une <mark>solidarité ethnique</mark>.</td>
    </tr>
    <tr>
      <td><strong>L'Ethnie</strong></td>
      <td>Regroupe des personnes ayant en commun la <mark>langue</mark>, la <mark>culture</mark> et les <mark>noms</mark>.</td>
    </tr>
    <tr>
      <td><strong>Le Royaume</strong></td>
      <td>Un pays, un état gouverné par un <mark>roi</mark>.</td>
    </tr>
  </tbody>
</table>

<div class="bloc-attention">
  <strong>🔑 Astuce mémo :</strong> <strong>F</strong>amille → <strong>C</strong>lan → <strong>T</strong>ribu → <strong>E</strong>thnie → <strong>R</strong>oyaume (de la plus petite à la plus grande structure)
</div>

<h2>📝 Résumé à retenir</h2>
<ul>
  <li>La <strong>famille</strong> = base de la société africaine (étendue)</li>
  <li>Le <strong>clan</strong> = même ancêtre</li>
  <li>La <strong>tribu</strong> = solidarité ethnique</li>
  <li>L'<strong>ethnie</strong> = même langue, culture, noms</li>
  <li>Le <strong>royaume</strong> = pays gouverné par un roi</li>
</ul>
`,
    exercices: [
      { question: "Combien de structures composent la société africaine ? Cite-les.", reponse: "5 structures : la famille, le clan, la tribu, l'ethnie et le royaume.", explication: "Ces 5 structures s'organisent de la plus petite (famille) à la plus grande (royaume)." },
      { question: "Quelle est la cellule de base de la société africaine ?", reponse: "La famille est la cellule de base de la société africaine.", explication: "La famille africaine est étendue, contrairement à la famille européenne." },
      { question: "Qu'est-ce qu'un clan ?", reponse: "Un clan est un ensemble de personnes issues du même ancêtre.", explication: "Le clan est plus grand que la famille mais plus petit que la tribu." },
      { question: "Qu'est-ce qu'une ethnie ?", reponse: "Une ethnie regroupe des personnes qui ont en commun la langue, la culture et les noms.", explication: "Par exemple, les Wolof, les Sérères et les Peuls sont des ethnies sénégalaises." },
      { question: "Qu'est-ce qu'un royaume ?", reponse: "Un royaume est un pays, un état gouverné par un roi.", explication: "C'est la structure la plus grande de la société africaine traditionnelle." },
    ],
    qcm: [
      {
        enonce: "Combien de structures composent la société africaine ?",
        options: [
          { lettre: "A", texte: "3" },
          { lettre: "B", texte: "4" },
          { lettre: "C", texte: "5" },
          { lettre: "D", texte: "6" },
        ],
        reponseCorrecte: "C",
        explication: "La société africaine compte 5 structures : famille, clan, tribu, ethnie, royaume.",
      },
      {
        enonce: "La cellule de base de la société africaine est...",
        options: [
          { lettre: "A", texte: "Le clan" },
          { lettre: "B", texte: "La tribu" },
          { lettre: "C", texte: "La famille" },
          { lettre: "D", texte: "Le royaume" },
        ],
        reponseCorrecte: "C",
        explication: "La famille est la cellule de base, la plus petite unité de la société africaine.",
      },
      {
        enonce: "Le clan regroupe des personnes issues du même...",
        options: [
          { lettre: "A", texte: "Village" },
          { lettre: "B", texte: "Pays" },
          { lettre: "C", texte: "Ancêtre" },
          { lettre: "D", texte: "Roi" },
        ],
        reponseCorrecte: "C",
        explication: "Le clan est un ensemble de personnes issues du même ancêtre.",
      },
      {
        enonce: "L'ethnie regroupe des personnes ayant en commun...",
        options: [
          { lettre: "A", texte: "La richesse et le pouvoir" },
          { lettre: "B", texte: "La religion uniquement" },
          { lettre: "C", texte: "La langue, la culture et les noms" },
          { lettre: "D", texte: "La couleur de peau" },
        ],
        reponseCorrecte: "C",
        explication: "L'ethnie se définit par la langue, la culture et les noms communs.",
      },
      {
        enonce: "Le royaume est un pays gouverné par...",
        options: [
          { lettre: "A", texte: "Un président" },
          { lettre: "B", texte: "Un roi" },
          { lettre: "C", texte: "Un chef de tribu" },
          { lettre: "D", texte: "Un conseil d'ancêtres" },
        ],
        reponseCorrecte: "B",
        explication: "Le royaume est bien un pays gouverné par un roi.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 5 : LE DJOLOF
  // ══════════════════════════════════════════════════════════
  {
    ordre: 5,
    titre: "Le Djolof",
    objectif: "Connaître la fondation, l'organisation et la chute du royaume du Djolof",
    promptSupplement: "Insiste sur les dates clés, les noms propres et les titres royaux.",
    contenuHTML: `
<h1>👑 Leçon 5 : Le Djolof</h1>

<div class="bloc-essentiel">
  <p>Le Djolof a été fondé par <mark>Ndiadiane Ndiaye</mark>. Il a existé entre le <strong>13e</strong> et le <strong>14e siècle</strong>.</p>
</div>

<h2>📍 Localisation et organisation</h2>
<ul>
  <li>Situé dans l'actuelle <strong>région de Louga</strong></li>
  <li>Capitale : <mark>Yang-Yang</mark></li>
  <li>Titre du roi : <mark>Bourba</mark></li>
</ul>

<h2>🗺️ L'empire du grand Djolof</h2>
<p>Le grand Djolof dominait : le <strong>Fouta</strong>, le <strong>Cayor</strong>, le <strong>Baol</strong>, le <strong>Walo</strong>, le <strong>Sine</strong> et le <strong>Saloum</strong>.</p>

<h2>⚔️ La chute du Djolof</h2>
<p>Le Djolof se disloqua après la mort du Bourba <strong>Lélé Fouli Fack</strong>, tué par <mark>Amary Ngoné Sobel</mark> à la <strong>bataille de Danki en 1549</strong>.</p>
<p><strong>Alboury Ndiaye</strong> fut le dernier Bourba du Djolof.</p>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong><br>
  Fondateur : <strong>Ndiadiane Ndiaye</strong> | Capitale : <strong>Yang-Yang</strong> | Titre : <strong>Bourba</strong><br>
  Fin : bataille de <strong>Danki (1549)</strong> | Dernier roi : <strong>Alboury Ndiaye</strong>
</div>
`,
    exercices: [
      { question: "Qui a fondé le royaume du Djolof ?", reponse: "Le Djolof a été fondé par Ndiadiane Ndiaye.", explication: "Ndiadiane Ndiaye est le fondateur du grand empire du Djolof." },
      { question: "Quelle était la capitale du Djolof ?", reponse: "La capitale du Djolof était Yang-Yang.", explication: "Yang-Yang était le centre politique de l'empire du Djolof." },
      { question: "Quel titre portait le roi du Djolof ?", reponse: "Le roi du Djolof portait le titre de Bourba.", explication: "Chaque royaume avait son propre titre royal." },
      { question: "À quelle bataille le Djolof s'est-il disloqué ?", reponse: "Le Djolof s'est disloqué à la bataille de Danki en 1549.", explication: "Amary Ngoné Sobel a tué le Bourba Lélé Fouli Fack lors de cette bataille." },
      { question: "Qui était le dernier Bourba du Djolof ?", reponse: "Alboury Ndiaye était le dernier Bourba du Djolof.", explication: "Alboury Ndiaye a résisté aux Français avant de mourir en exil au Niger." },
    ],
    qcm: [
      {
        enonce: "Le Djolof a été fondé par...",
        options: [
          { lettre: "A", texte: "Alboury Ndiaye" },
          { lettre: "B", texte: "Ndiadiane Ndiaye" },
          { lettre: "C", texte: "Lat Dior Diop" },
          { lettre: "D", texte: "Amary Ngoné Sobel" },
        ],
        reponseCorrecte: "B",
        explication: "Ndiadiane Ndiaye est le fondateur du royaume du Djolof.",
      },
      {
        enonce: "Quelle était la capitale du Djolof ?",
        options: [
          { lettre: "A", texte: "Mboul" },
          { lettre: "B", texte: "Nder" },
          { lettre: "C", texte: "Yang-Yang" },
          { lettre: "D", texte: "Diakhao" },
        ],
        reponseCorrecte: "C",
        explication: "Yang-Yang était la capitale du royaume du Djolof.",
      },
      {
        enonce: "Le titre du roi du Djolof était...",
        options: [
          { lettre: "A", texte: "Damel" },
          { lettre: "B", texte: "Brack" },
          { lettre: "C", texte: "Bourba" },
          { lettre: "D", texte: "Bour" },
        ],
        reponseCorrecte: "C",
        explication: "Le roi du Djolof portait le titre de Bourba.",
      },
      {
        enonce: "Le Djolof s'est disloqué à la bataille de...",
        options: [
          { lettre: "A", texte: "Médine" },
          { lettre: "B", texte: "Matam" },
          { lettre: "C", texte: "Danki" },
          { lettre: "D", texte: "Kolomina" },
        ],
        reponseCorrecte: "C",
        explication: "La bataille de Danki en 1549 a marqué la fin du grand empire du Djolof.",
      },
      {
        enonce: "Qui était le dernier Bourba du Djolof ?",
        options: [
          { lettre: "A", texte: "Ndiadiane Ndiaye" },
          { lettre: "B", texte: "Lélé Fouli Fack" },
          { lettre: "C", texte: "Amary Ngoné Sobel" },
          { lettre: "D", texte: "Alboury Ndiaye" },
        ],
        reponseCorrecte: "D",
        explication: "Alboury Ndiaye fut le dernier Bourba du Djolof.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 6 : LE CAYOR
  // ══════════════════════════════════════════════════════════
  {
    ordre: 6,
    titre: "Le Cayor",
    objectif: "Connaître la localisation, l'organisation et les grands souverains du royaume du Cayor",
    promptSupplement: "Mettre en valeur Lat Dior comme héros national. Insister sur le titre Damel et la capitale Mboul.",
    contenuHTML: `
<h1>🏇 Leçon 6 : Le Cayor</h1>

<div class="bloc-essentiel">
  <p>Le Cayor se situait à <strong>l'Ouest du Sénégal</strong>, dans l'actuelle <mark>région de Thiès</mark> et une partie de la <mark>région de Dakar</mark>. C'était une province du Djolof dirigée par des <strong>Lamanes</strong>.</p>
</div>

<h2>🔓 Indépendance du Cayor</h2>
<p>Le Cayor fut libéré de la domination du Djolof par <mark>Amary Ngoné Sobel</mark> à la <strong>bataille de Danki en 1549</strong>.</p>

<h2>🏛️ Organisation du Cayor</h2>
<ul>
  <li>Titre du roi : <mark>Damel</mark> (signifie « briseur »)</li>
  <li>Capitale : <mark>Mboul</mark></li>
  <li>Activités principales : <strong>commerce</strong>, <strong>agriculture</strong> et <strong>élevage</strong></li>
</ul>

<h2>👑 Grands souverains du Cayor</h2>
<ul>
  <li><strong>Lat Soukabé Ngoné Diéye Fall</strong></li>
  <li><strong>Maïssa Bigué</strong></li>
  <li><mark>Lat Dior Ngoné Latyr Diop</mark> (le plus célèbre)</li>
</ul>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong><br>
  Localisation : <strong>Thiès + Dakar</strong> | Capitale : <strong>Mboul</strong> | Titre : <strong>Damel</strong><br>
  Indépendance : <strong>1549 (bataille de Danki)</strong> | Héros : <strong>Lat Dior</strong>
</div>
`,
    exercices: [
      { question: "Où se situait le Cayor ?", reponse: "Le Cayor se situait à l'Ouest du Sénégal, sur l'emplacement actuel de la région de Thiès et une partie de la région de Dakar.", explication: "C'est l'une des régions les plus importantes du Sénégal actuel." },
      { question: "Quelle était la capitale du Cayor ?", reponse: "La capitale du Cayor était Mboul.", explication: "Mboul était le centre politique du royaume du Cayor." },
      { question: "Quel titre portait le roi du Cayor ?", reponse: "Le roi du Cayor portait le titre de Damel, qui signifie 'briseur'.", explication: "Chaque royaume sénégalais avait son propre titre royal." },
      { question: "Qui a libéré le Cayor du Djolof ?", reponse: "Amary Ngoné Sobel a libéré le Cayor du Djolof à la bataille de Danki en 1549.", explication: "C'est à partir de cette date que le Cayor est devenu indépendant." },
      { question: "Cite 2 grands souverains du Cayor.", reponse: "Lat Soukabé Ngoné Diéye Fall, Maïssa Bigué, et Lat Dior Ngoné Latyr Diop.", explication: "Lat Dior est le plus célèbre des Damel du Cayor." },
    ],
    qcm: [
      {
        enonce: "La capitale du Cayor était...",
        options: [
          { lettre: "A", texte: "Yang-Yang" },
          { lettre: "B", texte: "Nder" },
          { lettre: "C", texte: "Mboul" },
          { lettre: "D", texte: "Diakhao" },
        ],
        reponseCorrecte: "C",
        explication: "Mboul était la capitale du royaume du Cayor.",
      },
      {
        enonce: "Le titre du roi du Cayor était...",
        options: [
          { lettre: "A", texte: "Bourba" },
          { lettre: "B", texte: "Brack" },
          { lettre: "C", texte: "Damel" },
          { lettre: "D", texte: "Bour" },
        ],
        reponseCorrecte: "C",
        explication: "Le roi du Cayor portait le titre de Damel, qui signifie briseur.",
      },
      {
        enonce: "Le Cayor a été libéré du Djolof en...",
        options: [
          { lettre: "A", texte: "1490" },
          { lettre: "B", texte: "1549" },
          { lettre: "C", texte: "1776" },
          { lettre: "D", texte: "1886" },
        ],
        reponseCorrecte: "B",
        explication: "La bataille de Danki en 1549 a marqué l'indépendance du Cayor vis-à-vis du Djolof.",
      },
      {
        enonce: "Le Cayor se situait dans l'actuelle région de...",
        options: [
          { lettre: "A", texte: "Saint-Louis et Matam" },
          { lettre: "B", texte: "Thiès et partie de Dakar" },
          { lettre: "C", texte: "Kaolack et Fatick" },
          { lettre: "D", texte: "Ziguinchor et Kolda" },
        ],
        reponseCorrecte: "B",
        explication: "Le Cayor occupait l'actuelle région de Thiès et une partie de la région de Dakar.",
      },
      {
        enonce: "Quel est le plus célèbre Damel du Cayor ?",
        options: [
          { lettre: "A", texte: "Alboury Ndiaye" },
          { lettre: "B", texte: "Lat Dior Ngoné Latyr Diop" },
          { lettre: "C", texte: "Koumba Ndofène Famak Diouf" },
          { lettre: "D", texte: "Mbégane Ndour" },
        ],
        reponseCorrecte: "B",
        explication: "Lat Dior Ngoné Latyr Diop est le plus célèbre des Damel du Cayor, héros national sénégalais.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 7 : LE WALO
  // ══════════════════════════════════════════════════════════
  {
    ordre: 7,
    titre: "Le Walo",
    objectif: "Connaître la localisation, l'organisation, les attaques des Maures et les rois célèbres du Walo",
    promptSupplement: "Mettre en valeur les reines du Walo (Ndaté Yalla, Ndieumbeut Mbodj). Insister sur l'annexion de 1859.",
    contenuHTML: `
<h1>🌊 Leçon 7 : Le Walo</h1>

<div class="bloc-essentiel">
  <p>Le Walo se situait au <strong>nord-ouest du Sénégal</strong>, dans l'actuelle <mark>région de Saint-Louis</mark>.</p>
</div>

<h2>🏛️ Fondation et organisation</h2>
<ul>
  <li>Fondé vers le <strong>13e siècle</strong> par <strong>Ndiadiane Ndiaye</strong>, mais dirigé par son demi-frère <mark>Mbarka Mbo</mark></li>
  <li>Capitale : <mark>Nder</mark></li>
  <li>Titre du roi : <mark>Brack</mark></li>
  <li>Le roi était aidé par : le <strong>Diaodin</strong> (maître de la terre), le <strong>Diogomay</strong> (maître des eaux) et le <strong>Malo</strong> (trésorier)</li>
</ul>

<h2>⚔️ Les attaques des Maures Trarza</h2>
<p>Le Walo subit les attaques des <strong>Maures Trarza</strong>. Pour la paix, le roi maure <strong>Mohamed El Habib</strong> épousa la reine <mark>Ndieumbeut Mbodj</mark> dont le fils <strong>Ely</strong> régna sur le Walo.</p>

<h2>👑 Rois et reines célèbres</h2>
<p><strong>Ndaté Yalla</strong>, <strong>Yérim Mbagnik</strong>, <strong>Ndiak Aram Bakar</strong>.</p>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong><br>
  Capitale : <strong>Nder</strong> | Titre : <strong>Brack</strong> | Région : <strong>Saint-Louis</strong><br>
  Le Walo fut <mark>annexé en 1859 par les Français</mark>.
</div>
`,
    exercices: [
      { question: "Où se situait le Walo ?", reponse: "Le Walo se situait au nord-ouest du Sénégal, dans l'actuelle région de Saint-Louis.", explication: "C'est l'un des royaumes du nord du Sénégal." },
      { question: "Quelle était la capitale du Walo ?", reponse: "La capitale du Walo était Nder.", explication: "Nder était le centre politique du royaume du Walo." },
      { question: "Quel titre portait le roi du Walo ?", reponse: "Le roi du Walo portait le titre de Brack.", explication: "Chaque royaume sénégalais avait son propre titre pour le roi." },
      { question: "Qui était Ndieumbeut Mbodj ?", reponse: "Ndieumbeut Mbodj était une reine du Walo qui épousa le roi maure Mohamed El Habib pour établir la paix.", explication: "Ce mariage permit de mettre fin aux attaques des Maures Trarza contre le Walo." },
      { question: "En quelle année le Walo fut-il annexé par les Français ?", reponse: "Le Walo fut annexé par les Français en 1859.", explication: "C'est ainsi que le Walo perdit son indépendance et fut intégré à la colonie française." },
    ],
    qcm: [
      {
        enonce: "Le Walo se situait au...",
        options: [
          { lettre: "A", texte: "Sud-est du Sénégal" },
          { lettre: "B", texte: "Centre du Sénégal" },
          { lettre: "C", texte: "Nord-ouest du Sénégal" },
          { lettre: "D", texte: "Ouest du Sénégal" },
        ],
        reponseCorrecte: "C",
        explication: "Le Walo était situé au nord-ouest du Sénégal, dans la région de Saint-Louis.",
      },
      {
        enonce: "La capitale du Walo était...",
        options: [
          { lettre: "A", texte: "Mboul" },
          { lettre: "B", texte: "Yang-Yang" },
          { lettre: "C", texte: "Nder" },
          { lettre: "D", texte: "Diakhao" },
        ],
        reponseCorrecte: "C",
        explication: "Nder était la capitale du royaume du Walo.",
      },
      {
        enonce: "Le titre du roi du Walo était...",
        options: [
          { lettre: "A", texte: "Damel" },
          { lettre: "B", texte: "Brack" },
          { lettre: "C", texte: "Bourba" },
          { lettre: "D", texte: "Bour" },
        ],
        reponseCorrecte: "B",
        explication: "Le roi du Walo portait le titre de Brack.",
      },
      {
        enonce: "Le Walo fut annexé par les Français en...",
        options: [
          { lettre: "A", texte: "1776" },
          { lettre: "B", texte: "1849" },
          { lettre: "C", texte: "1859" },
          { lettre: "D", texte: "1886" },
        ],
        reponseCorrecte: "C",
        explication: "Le Walo fut annexé par les Français en 1859.",
      },
      {
        enonce: "Quelle reine a épousé le roi maure Mohamed El Habib ?",
        options: [
          { lettre: "A", texte: "Aline Sitoé Diatta" },
          { lettre: "B", texte: "Ndieumbeut Mbodj" },
          { lettre: "C", texte: "Maïssa Bigué" },
          { lettre: "D", texte: "Ndaté Yalla" },
        ],
        reponseCorrecte: "B",
        explication: "Ndieumbeut Mbodj épousa Mohamed El Habib pour établir la paix avec les Maures Trarza.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 8 : LES ROYAUMES DU SINE ET DU SALOUM
  // ══════════════════════════════════════════════════════════
  {
    ordre: 8,
    titre: "Les Royaumes du Sine et du Saloum",
    objectif: "Connaître la fondation, l'organisation et les rois célèbres du Sine et du Saloum",
    promptSupplement: "Insister sur l'origine sérère des deux royaumes et les capitales distinctes : Diakhao (Sine) et Kahone (Saloum).",
    contenuHTML: `
<h1>🌴 Leçon 8 : Les Royaumes du Sine et du Saloum</h1>

<div class="bloc-essentiel">
  <p>Le Sine et le Saloum furent fondés par des <mark>Sérères</mark> venus du <strong>Fouta</strong>, fuyant la pression des <strong>Almoravides</strong> qui voulaient les convertir à l'Islam.</p>
</div>

<h2>🏛️ Le Sine</h2>
<ul>
  <li>Fondé par <mark>Maïssa Waly Dione Mané</mark>, originaire du <strong>Gabou</strong></li>
  <li>Situé dans l'actuelle <strong>région de Fatick</strong></li>
  <li>Capitale : <mark>Diakhao</mark></li>
  <li>Titre du roi : <mark>Bour</mark></li>
  <li>Rois célèbres : <strong>Koumba Ndofène Famak Diouf</strong>, <strong>Mayékor Diouf</strong></li>
</ul>

<h2>🏛️ Le Saloum</h2>
<ul>
  <li>Fondé par <mark>Mbégane Ndour</mark></li>
  <li>Situé dans l'actuelle <strong>région de Kaolack et de Kaffrine</strong></li>
  <li>Capitale : <mark>Kahone</mark></li>
  <li>Titre du roi : <mark>Bour</mark></li>
  <li><strong>Fodé Ngouy Diouf</strong> = dernier roi du Saloum</li>
</ul>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong><br>
  <strong>Sine</strong> : fondateur Maïssa Waly Dione Mané | capitale <strong>Diakhao</strong> | Bour<br>
  <strong>Saloum</strong> : fondateur Mbégane Ndour | capitale <strong>Kahone</strong> | Bour
</div>
`,
    exercices: [
      { question: "Qui a fondé le royaume du Sine ?", reponse: "Le Sine a été fondé par Maïssa Waly Dione Mané, originaire du Gabou.", explication: "Les Sérères ont fui la pression des Almoravides pour fonder leurs propres royaumes." },
      { question: "Quelle était la capitale du Sine ?", reponse: "La capitale du Sine était Diakhao.", explication: "Diakhao se trouve dans l'actuelle région de Fatick." },
      { question: "Qui a fondé le Saloum ?", reponse: "Le Saloum a été fondé par Mbégane Ndour.", explication: "Il est le fondateur du royaume du Saloum." },
      { question: "Quelle était la capitale du Saloum ?", reponse: "La capitale du Saloum était Kahone.", explication: "Kahone se trouve dans l'actuelle région de Kaolack." },
      { question: "Quel était le titre du roi dans le Sine et le Saloum ?", reponse: "Dans le Sine et le Saloum, le roi portait le titre de Bour.", explication: "Les deux royaumes sérères partageaient le même titre royal." },
    ],
    qcm: [
      {
        enonce: "Le Sine et le Saloum furent fondés par des...",
        options: [
          { lettre: "A", texte: "Mandingues" },
          { lettre: "B", texte: "Peuls" },
          { lettre: "C", texte: "Sérères" },
          { lettre: "D", texte: "Toucouleurs" },
        ],
        reponseCorrecte: "C",
        explication: "Le Sine et le Saloum furent fondés par des Sérères venus du Fouta.",
      },
      {
        enonce: "La capitale du Sine était...",
        options: [
          { lettre: "A", texte: "Kahone" },
          { lettre: "B", texte: "Mboul" },
          { lettre: "C", texte: "Diakhao" },
          { lettre: "D", texte: "Lambaye" },
        ],
        reponseCorrecte: "C",
        explication: "Diakhao était la capitale du royaume du Sine, dans la région de Fatick.",
      },
      {
        enonce: "La capitale du Saloum était...",
        options: [
          { lettre: "A", texte: "Diakhao" },
          { lettre: "B", texte: "Lambaye" },
          { lettre: "C", texte: "Nder" },
          { lettre: "D", texte: "Kahone" },
        ],
        reponseCorrecte: "D",
        explication: "Kahone était la capitale du royaume du Saloum.",
      },
      {
        enonce: "Qui a fondé le Saloum ?",
        options: [
          { lettre: "A", texte: "Maïssa Waly Dione Mané" },
          { lettre: "B", texte: "Koumba Ndofène Diouf" },
          { lettre: "C", texte: "Mbégane Ndour" },
          { lettre: "D", texte: "Fodé Ngouy Diouf" },
        ],
        reponseCorrecte: "C",
        explication: "Mbégane Ndour est le fondateur du royaume du Saloum.",
      },
      {
        enonce: "Le titre du roi du Sine et du Saloum était...",
        options: [
          { lettre: "A", texte: "Damel" },
          { lettre: "B", texte: "Bourba" },
          { lettre: "C", texte: "Brack" },
          { lettre: "D", texte: "Bour" },
        ],
        reponseCorrecte: "D",
        explication: "Dans les deux royaumes sérères (Sine et Saloum), le roi portait le titre de Bour.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 12 : LES ANCIENS ROYAUMES DU SÉNÉGAL (tableau récap)
  // ══════════════════════════════════════════════════════════
  {
    ordre: 12,
    titre: "Les Anciens Royaumes du Sénégal",
    objectif: "Mémoriser les capitales, titres et rois célèbres de tous les anciens royaumes du Sénégal",
    promptSupplement: "Ce chapitre est une synthèse. Insister sur le tableau récapitulatif comme outil de mémorisation.",
    contenuHTML: `
<h1>📊 Leçon 12 : Les Anciens Royaumes du Sénégal</h1>

<div class="bloc-essentiel">
  <p>Voici le tableau récapitulatif des <strong>principaux royaumes du Sénégal</strong> avec leurs capitales, les titres des rois et les souverains célèbres.</p>
</div>

<h2>🗺️ Tableau récapitulatif</h2>

<table>
  <thead>
    <tr>
      <th>ROYAUME</th>
      <th>CAPITALE</th>
      <th>TITRE</th>
      <th>ROI CÉLÈBRE</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>Cayor</strong></td><td>Mboul</td><td>Damel</td><td>Lat Dior Ngoné Latyr Diop</td></tr>
    <tr><td><strong>Djolof</strong></td><td>Yang-Yang</td><td>Bourba</td><td>Alboury Ndiaye</td></tr>
    <tr><td><strong>Walo</strong></td><td>Nder</td><td>Brack</td><td>Barka Mbodj</td></tr>
    <tr><td><strong>Sine</strong></td><td>Diakhao</td><td>Bour</td><td>Koumba Ndoffène Diouf</td></tr>
    <tr><td><strong>Saloum</strong></td><td>Kahone</td><td>Bour</td><td>Mbégane Ndour</td></tr>
    <tr><td><strong>Baol</strong></td><td>Lambaye</td><td>Tègne</td><td>Lat Soukabé Ngoné Latyr Diéye</td></tr>
    <tr><td><strong>Casamance</strong></td><td>Madina</td><td>Mansa</td><td>Fodé Kaba Doumbouya</td></tr>
    <tr><td><strong>Fouta</strong></td><td>Mboumba</td><td>Almamy</td><td>Abdel Kader Kane</td></tr>
    <tr><td><strong>Rip</strong></td><td>Nioro</td><td>Almamy</td><td>Maba Diakhou Ba</td></tr>
  </tbody>
</table>

<div class="bloc-attention">
  <strong>🔑 Astuce :</strong> Apprends ce tableau ligne par ligne ! Chaque royaume a sa propre capitale, son titre et son héros.
</div>

<h2>📝 Les titres royaux à retenir</h2>
<ul>
  <li><strong>Damel</strong> → Cayor</li>
  <li><strong>Bourba</strong> → Djolof</li>
  <li><strong>Brack</strong> → Walo</li>
  <li><strong>Bour</strong> → Sine et Saloum</li>
  <li><strong>Tègne</strong> → Baol</li>
  <li><strong>Mansa</strong> → Casamance</li>
  <li><strong>Almamy</strong> → Fouta et Rip</li>
</ul>
`,
    exercices: [
      { question: "Quelle est la capitale du Djolof ?", reponse: "La capitale du Djolof est Yang-Yang.", explication: "Yang-Yang était le centre politique de l'empire du Djolof." },
      { question: "Quel est le titre du roi du Baol ?", reponse: "Le titre du roi du Baol est Tègne.", explication: "Chaque royaume avait son propre titre royal : Tègne pour le Baol." },
      { question: "Quelle est la capitale de la Casamance ?", reponse: "La capitale de la Casamance était Madina.", explication: "Le royaume de Casamance avait Madina comme capitale." },
      { question: "Quel est le titre du roi du Fouta ?", reponse: "Le titre du roi du Fouta est Almamy.", explication: "Le Fouta et le Rip partageaient le titre d'Almamy pour leurs rois." },
      { question: "Qui est le célèbre roi du Cayor ?", reponse: "Le célèbre roi du Cayor est Lat Dior Ngoné Latyr Diop.", explication: "Lat Dior est un héros national sénégalais qui a résisté à la colonisation française." },
    ],
    qcm: [
      {
        enonce: "Quelle est la capitale du Djolof ?",
        options: [
          { lettre: "A", texte: "Mboul" },
          { lettre: "B", texte: "Diakhao" },
          { lettre: "C", texte: "Yang-Yang" },
          { lettre: "D", texte: "Nder" },
        ],
        reponseCorrecte: "C",
        explication: "Yang-Yang était la capitale du royaume du Djolof.",
      },
      {
        enonce: "Le titre du roi du Baol est...",
        options: [
          { lettre: "A", texte: "Damel" },
          { lettre: "B", texte: "Bour" },
          { lettre: "C", texte: "Brack" },
          { lettre: "D", texte: "Tègne" },
        ],
        reponseCorrecte: "D",
        explication: "Le roi du Baol portait le titre de Tègne.",
      },
      {
        enonce: "Quelle est la capitale de la Casamance ?",
        options: [
          { lettre: "A", texte: "Nder" },
          { lettre: "B", texte: "Lambaye" },
          { lettre: "C", texte: "Kahone" },
          { lettre: "D", texte: "Madina" },
        ],
        reponseCorrecte: "D",
        explication: "Madina était la capitale du royaume de Casamance.",
      },
      {
        enonce: "Lat Dior Ngoné Latyr Diop était le célèbre roi du...",
        options: [
          { lettre: "A", texte: "Djolof" },
          { lettre: "B", texte: "Walo" },
          { lettre: "C", texte: "Cayor" },
          { lettre: "D", texte: "Sine" },
        ],
        reponseCorrecte: "C",
        explication: "Lat Dior Ngoné Latyr Diop est le célèbre Damel du Cayor.",
      },
      {
        enonce: "Le titre Almamy est partagé par...",
        options: [
          { lettre: "A", texte: "Cayor et Djolof" },
          { lettre: "B", texte: "Sine et Saloum" },
          { lettre: "C", texte: "Fouta et Rip" },
          { lettre: "D", texte: "Walo et Baol" },
        ],
        reponseCorrecte: "C",
        explication: "Le Fouta et le Rip avaient tous deux le titre d'Almamy pour leur roi.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 16 : LA RÉSISTANCE ARMÉE
  // ══════════════════════════════════════════════════════════
  {
    ordre: 16,
    titre: "La Résistance Armée",
    objectif: "Comprendre pourquoi et comment les chefs africains ont résisté à la colonisation européenne",
    promptSupplement: "Valoriser le courage des résistants africains. Montrer que les Africains n'ont pas accepté la colonisation sans se battre.",
    contenuHTML: `
<h1>⚔️ Leçon 16 : La Résistance Armée</h1>

<div class="bloc-essentiel">
  <p>Pour mettre fin à la <strong>pénétration européenne</strong>, de courageux <mark>chefs africains</mark> organisèrent la <strong>résistance armée</strong>.</p>
</div>

<h2>🦸 Les grands résistants africains</h2>
<ul>
  <li><mark>El Hadj Omar Tall</mark></li>
  <li><mark>Lat Dior Diop</mark></li>
  <li><mark>Alboury Ndiaye</mark></li>
  <li><mark>Ahmadou Cheikhou Tall</mark></li>
  <li><strong>Samory Touré</strong> (Guinée)</li>
  <li><strong>Béhanzin</strong> (Dahomey/Bénin)</li>
  <li><strong>Rabah</strong> (Afrique centrale)</li>
</ul>

<h2>🎯 Les méthodes des colonisateurs</h2>
<p>Pour venir à bout des résistances africaines, les Français utilisèrent :</p>
<ul>
  <li>La <strong>ruse</strong> et les trahisons</li>
  <li>Des <strong>moyens militaires énormes</strong> (armée puissante, artillerie)</li>
  <li>La stratégie de <strong>division</strong> entre chefs africains</li>
</ul>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong><br>
  Les chefs africains ont <strong>résisté courageusement</strong> à la colonisation.<br>
  Les Français ont utilisé la <strong>ruse et la force</strong> pour les vaincre.
</div>
`,
    exercices: [
      { question: "Pourquoi des chefs africains ont-ils organisé la résistance armée ?", reponse: "Pour mettre fin à la pénétration européenne et défendre leurs royaumes contre la colonisation.", explication: "Les Africains n'ont pas accepté passivement la colonisation, ils ont résisté." },
      { question: "Cite 4 grands résistants africains.", reponse: "El Hadj Omar Tall, Lat Dior Diop, Alboury Ndiaye, Ahmadou Cheikhou Tall, Samory Touré, Béhanzin, Rabah.", explication: "Ces chefs courageux ont mené la résistance armée contre la colonisation." },
      { question: "Quels moyens les Français ont-ils utilisés pour vaincre les résistants africains ?", reponse: "Les Français ont utilisé la ruse, des moyens militaires énormes et la stratégie de division entre chefs africains.", explication: "Malgré le courage des résistants, les Français ont réussi à les vaincre grâce à leur supériorité militaire." },
      { question: "À quel pays Samory Touré appartenait-il ?", reponse: "Samory Touré était un résistant de Guinée (Afrique de l'Ouest).", explication: "La résistance à la colonisation s'est organisée dans toute l'Afrique de l'Ouest." },
      { question: "Qui était Béhanzin ?", reponse: "Béhanzin était un célèbre résistant du Dahomey (actuel Bénin) en Afrique de l'Ouest.", explication: "Il a résisté courageusement à la colonisation française de son royaume." },
    ],
    qcm: [
      {
        enonce: "Les chefs africains ont organisé la résistance armée pour...",
        options: [
          { lettre: "A", texte: "Aider les colonisateurs" },
          { lettre: "B", texte: "Mettre fin à la pénétration européenne" },
          { lettre: "C", texte: "Commercer avec les Français" },
          { lettre: "D", texte: "Apprendre le français" },
        ],
        reponseCorrecte: "B",
        explication: "Les chefs africains ont résisté pour mettre fin à la pénétration européenne et défendre leurs royaumes.",
      },
      {
        enonce: "Lequel n'est PAS un résistant africain célèbre ?",
        options: [
          { lettre: "A", texte: "El Hadj Omar Tall" },
          { lettre: "B", texte: "Lat Dior Diop" },
          { lettre: "C", texte: "Napoléon Bonaparte" },
          { lettre: "D", texte: "Alboury Ndiaye" },
        ],
        reponseCorrecte: "C",
        explication: "Napoléon Bonaparte était un général français, pas un résistant africain.",
      },
      {
        enonce: "Les Français ont vaincu les résistants en utilisant...",
        options: [
          { lettre: "A", texte: "La diplomatie et les cadeaux" },
          { lettre: "B", texte: "La ruse et des moyens militaires énormes" },
          { lettre: "C", texte: "La religion islamique" },
          { lettre: "D", texte: "Le commerce uniquement" },
        ],
        reponseCorrecte: "B",
        explication: "Les Français ont utilisé la ruse, des moyens militaires énormes et la division pour vaincre les résistants.",
      },
      {
        enonce: "Samory Touré était un résistant de...",
        options: [
          { lettre: "A", texte: "L'Afrique du Nord" },
          { lettre: "B", texte: "L'Afrique du Sud" },
          { lettre: "C", texte: "La Guinée (Afrique de l'Ouest)" },
          { lettre: "D", texte: "L'Afrique de l'Est" },
        ],
        reponseCorrecte: "C",
        explication: "Samory Touré était un résistant guinéen qui s'est battu contre la colonisation française.",
      },
      {
        enonce: "Ahmadou Cheikhou Tall est le fils de...",
        options: [
          { lettre: "A", texte: "Lat Dior" },
          { lettre: "B", texte: "Alboury Ndiaye" },
          { lettre: "C", texte: "El Hadj Omar Tall" },
          { lettre: "D", texte: "Samory Touré" },
        ],
        reponseCorrecte: "C",
        explication: "Ahmadou Cheikhou Tall est le fils d'El Hadj Omar Tall.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 17 : EL HADJI OMAR TALL
  // ══════════════════════════════════════════════════════════
  {
    ordre: 17,
    titre: "El Hadji Omar Tall",
    objectif: "Connaître la vie, les combats et la disparition mystérieuse d'El Hadji Omar Tall",
    promptSupplement: "Mettre en valeur sa culture islamique, sa ville de Dinguiraye et sa disparition à Bandiagara.",
    contenuHTML: `
<h1>🕌 Leçon 17 : El Hadji Omar Tall</h1>

<div class="bloc-essentiel">
  <p>El Hadji Omar Tall, de son vrai nom <strong>Omar Seydou Tall</strong>, serait né entre <mark>1794 et 1797</mark> à <strong>Halwar</strong> près de <strong>Podor</strong>. Il appartenait à la prestigieuse lignée des <mark>Torobé</mark>.</p>
</div>

<h2>🕋 Le pèlerinage et l'empire</h2>
<ul>
  <li>En <mark>1827</mark> → pèlerinage à la Mecque → reçut le titre de <strong>El Hadji</strong></li>
  <li>Fonda la ville de <mark>Dinguiraye</mark> et jeta les bases d'un <strong>vaste empire musulman</strong></li>
</ul>

<h2>⚔️ Les grandes batailles</h2>
<ul>
  <li>De 1850 à 1857 : s'empare du <strong>Bambouck</strong> et du <strong>Kaarta</strong>, occupe <strong>Nioro</strong></li>
  <li>Affronte le gouverneur <strong>Faidherbe</strong> à <strong>Médine (1857)</strong> puis à <strong>Matam (1859)</strong></li>
  <li>En <mark>1862</mark> : prend <strong>Hamdallahi</strong>, capitale des Peuls</li>
</ul>

<h2>🏔️ La fin mystérieuse</h2>
<p>El Hadji Omar disparaît dans des conditions mystérieuses dans les <mark>grottes de Bandiagara en 1864</mark>.</p>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong><br>
  Né à : <strong>Halwar / Podor</strong> | Lignée : <strong>Torobé</strong><br>
  Ville fondée : <strong>Dinguiraye</strong> | Adversaire : <strong>Faidherbe</strong><br>
  Disparition : <strong>grottes de Bandiagara (1864)</strong>
</div>
`,
    exercices: [
      { question: "Où est né El Hadji Omar Tall ?", reponse: "El Hadji Omar Tall est né à Halwar, près de Podor.", explication: "Il appartenait à la lignée des Torobé et s'initia très tôt à la culture coranique." },
      { question: "Quel titre El Hadji Omar a-t-il reçu en 1827 ?", reponse: "En 1827, lors de son pèlerinage à la Mecque, il reçut le titre d'El Hadji.", explication: "Ce pèlerinage fut un tournant important dans sa vie religieuse et politique." },
      { question: "Quelle ville El Hadji Omar a-t-il fondée ?", reponse: "El Hadji Omar a fondé la ville de Dinguiraye.", explication: "Dinguiraye devint la base de son empire musulman en Afrique de l'Ouest." },
      { question: "Quel gouverneur français a affronté El Hadji Omar ?", reponse: "El Hadji Omar a affronté le gouverneur Faidherbe à Médine (1857) et à Matam (1859).", explication: "Faidherbe était le gouverneur du Sénégal qui cherchait à stopper l'expansion de l'empire d'Omar Tall." },
      { question: "Comment El Hadji Omar a-t-il disparu et où ?", reponse: "El Hadji Omar a disparu dans des conditions mystérieuses dans les grottes de Bandiagara en 1864.", explication: "Sa disparition reste une grande énigme de l'histoire de l'Afrique de l'Ouest." },
    ],
    qcm: [
      {
        enonce: "El Hadji Omar Tall est né près de...",
        options: [
          { lettre: "A", texte: "Dakar" },
          { lettre: "B", texte: "Podor" },
          { lettre: "C", texte: "Touba" },
          { lettre: "D", texte: "Tivaouane" },
        ],
        reponseCorrecte: "B",
        explication: "El Hadji Omar Tall est né à Halwar, près de Podor.",
      },
      {
        enonce: "En 1827, il reçut le titre de...",
        options: [
          { lettre: "A", texte: "Marabout" },
          { lettre: "B", texte: "El Hadji" },
          { lettre: "C", texte: "Almamy" },
          { lettre: "D", texte: "Bourba" },
        ],
        reponseCorrecte: "B",
        explication: "Lors de son pèlerinage à la Mecque en 1827, il reçut le titre d'El Hadji.",
      },
      {
        enonce: "Il fonda la ville de...",
        options: [
          { lettre: "A", texte: "Touba" },
          { lettre: "B", texte: "Tivaouane" },
          { lettre: "C", texte: "Dinguiraye" },
          { lettre: "D", texte: "Koussan" },
        ],
        reponseCorrecte: "C",
        explication: "El Hadji Omar Tall a fondé la ville de Dinguiraye, base de son empire.",
      },
      {
        enonce: "El Hadji Omar a disparu dans les grottes de...",
        options: [
          { lettre: "A", texte: "Médine" },
          { lettre: "B", texte: "Matam" },
          { lettre: "C", texte: "Nioro" },
          { lettre: "D", texte: "Bandiagara" },
        ],
        reponseCorrecte: "D",
        explication: "El Hadji Omar a disparu mystérieusement dans les grottes de Bandiagara en 1864.",
      },
      {
        enonce: "Il appartenait à la lignée des...",
        options: [
          { lettre: "A", texte: "Torobé" },
          { lettre: "B", texte: "Peuls" },
          { lettre: "C", texte: "Sérères" },
          { lettre: "D", texte: "Mandingues" },
        ],
        reponseCorrecte: "A",
        explication: "El Hadji Omar Tall appartenait à la prestigieuse lignée des Torobé.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 18 : LAT DIOR NGONÉ LATYR DIOP
  // ══════════════════════════════════════════════════════════
  {
    ordre: 18,
    titre: "Lat Dior Ngoné Latyr Diop",
    objectif: "Connaître la vie héroïque et le combat de Lat Dior contre la colonisation française",
    promptSupplement: "Lat Dior est un héros national sénégalais. Insister sur sa résistance contre le chemin de fer et sa mort héroïque à Dékheulé.",
    contenuHTML: `
<h1>🦁 Leçon 18 : Lat Dior Ngoné Latyr Diop</h1>

<div class="bloc-essentiel">
  <p>Lat Dior Ngoné Latyr Diop est né vers <mark>1842</mark> à <strong>Keur Amadou Yalla</strong>. C'est l'un des plus grands héros nationaux du Sénégal.</p>
</div>

<h2>👑 Au pouvoir</h2>
<ul>
  <li>Élu <mark>Damel du Cayor en 1862</mark></li>
  <li>En 1864 → exilé par <strong>Faidherbe</strong></li>
  <li>Se réfugie chez <mark>Maba Diakhou Ba</mark> (Almamy du Rip) → se convertit à l'Islam</li>
  <li>Revient au Cayor → reconnu Damel par les Français en <strong>1871</strong></li>
</ul>

<h2>⚔️ La grande résistance</h2>
<p>Lat Dior s'opposa <strong>farouchement</strong> à la construction du <mark>chemin de fer Dakar — Saint-Louis</mark>. Il considérait ce chemin de fer comme un symbole de l'occupation française de son territoire.</p>
<p>Exilé de nouveau, il rejoignit <strong>Alboury Ndiaye</strong> et continua de lutter.</p>

<h2>💀 La mort héroïque</h2>
<p>Lat Dior fut tué à <mark>Dékheulé le 25 Octobre 1886</mark>, avec ses fils et ses compagnons, par une colonne de spahis commandée par le <strong>capitaine Valois</strong>.</p>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong><br>
  Né en <strong>1842</strong> | Damel du Cayor dès <strong>1862</strong><br>
  Résista contre le <strong>chemin de fer Dakar-Saint Louis</strong><br>
  Mort à <strong>Dékheulé le 25 Octobre 1886</strong>
</div>
`,
    exercices: [
      { question: "En quelle année Lat Dior est-il né ?", reponse: "Lat Dior Ngoné Latyr Diop est né vers 1842.", explication: "Il est né à Keur Amadou Yalla et deviendra l'un des plus grands héros du Sénégal." },
      { question: "En quelle année Lat Dior est-il devenu Damel du Cayor ?", reponse: "Lat Dior a été élu Damel du Cayor en 1862.", explication: "C'est la date à laquelle il a pris la direction du royaume du Cayor." },
      { question: "Contre quoi Lat Dior s'est-il farouchement opposé ?", reponse: "Lat Dior s'est farouchement opposé à la construction du chemin de fer Dakar — Saint-Louis.", explication: "Il voyait ce chemin de fer comme un symbole de l'occupation française de son territoire." },
      { question: "Qui a converti Lat Dior à l'Islam ?", reponse: "Maba Diakhou Ba, l'Almamy du Rip, a converti Lat Dior à l'Islam.", explication: "Lat Dior s'est réfugié chez Maba Diakhou Ba lors de son premier exil en 1864." },
      { question: "Où et quand Lat Dior est-il mort ?", reponse: "Lat Dior est mort à Dékheulé le 25 Octobre 1886, tué par une colonne de spahis commandée par le capitaine Valois.", explication: "Il est mort en héros, défendant son royaume jusqu'au bout." },
    ],
    qcm: [
      {
        enonce: "Lat Dior fut élu Damel du Cayor en...",
        options: [
          { lettre: "A", texte: "1842" },
          { lettre: "B", texte: "1862" },
          { lettre: "C", texte: "1871" },
          { lettre: "D", texte: "1886" },
        ],
        reponseCorrecte: "B",
        explication: "Lat Dior a été élu Damel du Cayor en 1862.",
      },
      {
        enonce: "Lat Dior s'est opposé à la construction du...",
        options: [
          { lettre: "A", texte: "Port de Dakar" },
          { lettre: "B", texte: "Chemin de fer Dakar-Saint Louis" },
          { lettre: "C", texte: "Pont Faidherbe" },
          { lettre: "D", texte: "Canal de navigation" },
        ],
        reponseCorrecte: "B",
        explication: "Lat Dior s'est farouchement opposé à la construction du chemin de fer Dakar - Saint Louis.",
      },
      {
        enonce: "Qui a converti Lat Dior à l'Islam ?",
        options: [
          { lettre: "A", texte: "Cheikh Ahmadou Bamba" },
          { lettre: "B", texte: "Maba Diakhou Ba" },
          { lettre: "C", texte: "El Hadji Malick Sy" },
          { lettre: "D", texte: "El Hadji Omar Tall" },
        ],
        reponseCorrecte: "B",
        explication: "Maba Diakhou Ba, Almamy du Rip, a converti Lat Dior à l'Islam lors de son exil.",
      },
      {
        enonce: "Lat Dior fut tué à Dékheulé en...",
        options: [
          { lettre: "A", texte: "1871" },
          { lettre: "B", texte: "1879" },
          { lettre: "C", texte: "1886" },
          { lettre: "D", texte: "1902" },
        ],
        reponseCorrecte: "C",
        explication: "Lat Dior fut tué à Dékheulé le 25 Octobre 1886.",
      },
      {
        enonce: "Qui commandait la colonne qui a tué Lat Dior ?",
        options: [
          { lettre: "A", texte: "Faidherbe" },
          { lettre: "B", texte: "Archinard" },
          { lettre: "C", texte: "Dodds" },
          { lettre: "D", texte: "Valois" },
        ],
        reponseCorrecte: "D",
        explication: "La colonne de spahis qui a tué Lat Dior était commandée par le capitaine Valois.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 19 : ALBOURY NDIAYE
  // ══════════════════════════════════════════════════════════
  {
    ordre: 19,
    titre: "Alboury Ndiaye",
    objectif: "Connaître la résistance et le destin tragique d'Alboury Ndiaye, dernier Bourba du Djolof",
    promptSupplement: "Insister sur le protectorat de 1885, la guerre ouverte de 1890 et la mort en exil au Niger.",
    contenuHTML: `
<h1>🏰 Leçon 19 : Alboury Ndiaye</h1>

<div class="bloc-essentiel">
  <p>Alboury Ndiaye est né vers <mark>1842</mark>. Il fut nommé <strong>Bourba Djolof de 1875 à 1890</strong>. Il organisa la résistance contre les Français.</p>
</div>

<h2>🇫🇷 Face aux Français</h2>
<ul>
  <li>En <mark>1885</mark> → contraint d'accepter le <strong>protectorat français</strong> sur le Djolof</li>
  <li>En <mark>1890</mark> → entra en <strong>guerre ouverte</strong> contre les Français dirigés par le <strong>commandant Dodds</strong></li>
  <li>Chassé du trône, continua la résistance en exil auprès d'<strong>Ahmadou Cheikhou Tall</strong></li>
</ul>

<h2>🏆 La bataille de Kolomina</h2>
<p>Alboury Ndiaye couvrit <strong>glorieusement</strong> la retraite à la <mark>bataille de Kolomina</mark>, montrant son courage exceptionnel face à l'ennemi.</p>

<h2>💀 La mort en exil</h2>
<p>Il mourut hors du Sénégal, <mark>près de Dogon-Douchi au Niger en 1902</mark>, loin de sa terre natale.</p>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong><br>
  Bourba Djolof : <strong>1875-1890</strong> | Protectorat accepté : <strong>1885</strong><br>
  Guerre ouverte contre : <strong>commandant Dodds (1890)</strong><br>
  Mort en exil : <strong>Niger, 1902</strong><br><br>
  <strong>Protectorat</strong> = protection exercée par un pays puissant sur un pays plus faible
</div>
`,
    exercices: [
      { question: "De quelle année à quelle année Alboury Ndiaye fut-il Bourba Djolof ?", reponse: "Alboury Ndiaye fut Bourba Djolof de 1875 à 1890.", explication: "Il est le dernier Bourba (roi) du Djolof." },
      { question: "Qu'a accepté Alboury Ndiaye en 1885 ?", reponse: "En 1885, Alboury Ndiaye fut contraint d'accepter le protectorat français sur le Djolof.", explication: "Le protectorat signifiait une domination française sur le Djolof, sans liberté réelle." },
      { question: "Contre qui Alboury Ndiaye est-il entré en guerre ouverte en 1890 ?", reponse: "En 1890, Alboury Ndiaye entra en guerre ouverte contre les Français dirigés par le commandant Dodds.", explication: "Cette guerre marqua la fin du règne d'Alboury au Djolof." },
      { question: "Quelle bataille Alboury Ndiaye a-t-il couverte glorieusement ?", reponse: "Alboury Ndiaye couvrit glorieusement la retraite à la bataille de Kolomina.", explication: "Cette bataille montra le grand courage d'Alboury face à l'armée française." },
      { question: "Où et quand Alboury Ndiaye est-il mort ?", reponse: "Alboury Ndiaye est mort près de Dogon-Douchi au Niger en 1902, en exil.", explication: "Il mourut loin de sa terre natale, le Sénégal, où il n'a jamais pu retourner." },
    ],
    qcm: [
      {
        enonce: "Alboury Ndiaye fut Bourba Djolof de...",
        options: [
          { lettre: "A", texte: "1862 à 1870" },
          { lettre: "B", texte: "1875 à 1890" },
          { lettre: "C", texte: "1890 à 1902" },
          { lettre: "D", texte: "1849 à 1875" },
        ],
        reponseCorrecte: "B",
        explication: "Alboury Ndiaye a été Bourba Djolof de 1875 à 1890.",
      },
      {
        enonce: "En 1885, Alboury Ndiaye accepta le...",
        options: [
          { lettre: "A", texte: "Christianisme" },
          { lettre: "B", texte: "Protectorat français sur le Djolof" },
          { lettre: "C", texte: "Commerce avec les Français" },
          { lettre: "D", texte: "Départ définitif du Djolof" },
        ],
        reponseCorrecte: "B",
        explication: "En 1885, Alboury fut contraint d'accepter le protectorat français.",
      },
      {
        enonce: "Où Alboury Ndiaye mourut-il ?",
        options: [
          { lettre: "A", texte: "Au Sénégal à Dakar" },
          { lettre: "B", texte: "Au Mali à Bamako" },
          { lettre: "C", texte: "Près de Dogon-Douchi au Niger" },
          { lettre: "D", texte: "Au Gabon" },
        ],
        reponseCorrecte: "C",
        explication: "Alboury Ndiaye mourut en exil, près de Dogon-Douchi au Niger en 1902.",
      },
      {
        enonce: "Quelle bataille Alboury a-t-il couverte glorieusement ?",
        options: [
          { lettre: "A", texte: "La bataille de Danki" },
          { lettre: "B", texte: "La bataille de Médine" },
          { lettre: "C", texte: "La bataille de Kolomina" },
          { lettre: "D", texte: "La bataille de Matam" },
        ],
        reponseCorrecte: "C",
        explication: "Alboury Ndiaye couvrit glorieusement la retraite à la bataille de Kolomina.",
      },
      {
        enonce: "Qu'est-ce qu'un protectorat ?",
        options: [
          { lettre: "A", texte: "Une liberté totale accordée à un pays" },
          { lettre: "B", texte: "La protection d'un pays puissant sur un pays plus faible" },
          { lettre: "C", texte: "Un accord commercial entre deux pays" },
          { lettre: "D", texte: "Un traité de paix définitif" },
        ],
        reponseCorrecte: "B",
        explication: "Le protectorat est la protection exercée par un pays puissant sur un pays plus faible, qui perd sa liberté.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LEÇON 20 : AHMADOU CHEIKHOU TALL
  // ══════════════════════════════════════════════════════════
  {
    ordre: 20,
    titre: "Ahmadou Cheikhou Tall",
    objectif: "Connaître la vie, la puissance et la chute d'Ahmadou Cheikhou Tall face à la colonisation française",
    promptSupplement: "Insiste sur le lien avec El Hadji Omar (père), la bataille de Ségou en 1890 et le colonel Archinard.",
    contenuHTML: `
<h1>⚔️ Leçon 20 : Ahmadou Cheikhou Tall</h1>

<div class="bloc-essentiel">
  <p>Ahmadou Cheikhou Tall était le <mark>fils d'El Hadji Omar Tall</mark> et d'une femme Haoussa. Il succéda à son père et devint Grand marabout, à la tête de la <strong>confrérie Tidjane</strong>.</p>
</div>

<h2>💪 Sa puissance militaire</h2>
<p>Il disposait d'une <mark>très puissante armée</mark>. Pour l'affaiblir, les Français l'opposèrent à <strong>Mamadou Lamine Dramé</strong>, créant ainsi des divisions entre chefs africains.</p>

<h2>⚔️ La chute de Ségou</h2>
<p>En <mark>1890</mark>, les Français dirigés par le <strong>colonel Archinard</strong> attaquèrent sa capitale <strong>Ségou</strong>. La ville fut prise.</p>

<h2>🕊️ La fin</h2>
<p>Ahmadou Cheikhou Tall se réfugia en <strong>pays Haoussa</strong> où il <mark>mourut libre</mark>, mais presque dépouillé de tous ses territoires.</p>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong><br>
  Père : <strong>El Hadji Omar Tall</strong> | Confrérie : <strong>Tidjane</strong><br>
  Adversaire français : <strong>colonel Archinard</strong><br>
  Capitale prise : <strong>Ségou (1890)</strong> | Mort : <strong>libre en pays Haoussa</strong>
</div>
`,
    exercices: [
      { question: "Qui était le père d'Ahmadou Cheikhou Tall ?", reponse: "Le père d'Ahmadou Cheikhou Tall était El Hadji Omar Tall.", explication: "Ahmadou a succédé à son père à la tête de son empire et de la confrérie Tidjane." },
      { question: "Quelle confrérie Ahmadou Cheikhou Tall dirigeait-il ?", reponse: "Ahmadou Cheikhou Tall dirigeait la confrérie Tidjane.", explication: "Il avait remplacé son père El Hadji Omar à la tête de cette confrérie musulmane." },
      { question: "Comment les Français ont-ils essayé d'affaiblir Ahmadou ?", reponse: "Les Français lui opposèrent Mamadou Lamine Dramé pour le diviser et l'affaiblir.", explication: "La stratégie de division entre chefs africains était une méthode courante des colonisateurs." },
      { question: "Qui a attaqué Ségou en 1890 ?", reponse: "Le colonel Archinard a attaqué Ségou en 1890 et pris la capitale.", explication: "Cette défaite marqua la fin du pouvoir d'Ahmadou Cheikhou Tall." },
      { question: "Comment Ahmadou Cheikhou Tall est-il mort ?", reponse: "Ahmadou Cheikhou Tall mourut libre en pays Haoussa, bien que dépouillé de presque tous ses territoires.", explication: "Même vaincu militairement, il est mort en homme libre, jamais capturé par les Français." },
    ],
    qcm: [
      {
        enonce: "Qui est le père d'Ahmadou Cheikhou Tall ?",
        options: [
          { lettre: "A", texte: "Alboury Ndiaye" },
          { lettre: "B", texte: "El Hadji Omar Tall" },
          { lettre: "C", texte: "Lat Dior Diop" },
          { lettre: "D", texte: "Maba Diakhou Ba" },
        ],
        reponseCorrecte: "B",
        explication: "Ahmadou Cheikhou Tall est le fils d'El Hadji Omar Tall.",
      },
      {
        enonce: "Il dirigeait la confrérie...",
        options: [
          { lettre: "A", texte: "Mouride" },
          { lettre: "B", texte: "Tidjane" },
          { lettre: "C", texte: "Qadriya" },
          { lettre: "D", texte: "Layène" },
        ],
        reponseCorrecte: "B",
        explication: "Ahmadou Cheikhou Tall dirigeait la confrérie Tidjane, héritée de son père.",
      },
      {
        enonce: "Quel colonel français a attaqué Ségou en 1890 ?",
        options: [
          { lettre: "A", texte: "Faidherbe" },
          { lettre: "B", texte: "Dodds" },
          { lettre: "C", texte: "Valois" },
          { lettre: "D", texte: "Archinard" },
        ],
        reponseCorrecte: "D",
        explication: "Le colonel Archinard a attaqué et pris Ségou en 1890.",
      },
      {
        enonce: "Les Français ont opposé à Ahmadou...",
        options: [
          { lettre: "A", texte: "Lat Dior" },
          { lettre: "B", texte: "Alboury Ndiaye" },
          { lettre: "C", texte: "Mamadou Lamine Dramé" },
          { lettre: "D", texte: "El Hadji Omar" },
        ],
        reponseCorrecte: "C",
        explication: "Les Français ont opposé Mamadou Lamine Dramé à Ahmadou pour l'affaiblir.",
      },
      {
        enonce: "Ahmadou Cheikhou Tall mourut...",
        options: [
          { lettre: "A", texte: "À Ségou, prisonnier des Français" },
          { lettre: "B", texte: "Au Sénégal" },
          { lettre: "C", texte: "Libre en pays Haoussa" },
          { lettre: "D", texte: "Au Gabon en exil" },
        ],
        reponseCorrecte: "C",
        explication: "Ahmadou Cheikhou Tall mourut libre en pays Haoussa, jamais capturé par les Français.",
      },
    ],
  },

]; // fin LECONS_DATA

// ─────────────────────────────────────────────────────────────
// DONNÉES QUIZ PAR LEÇON (6 questions MCQ avec timer)
// ─────────────────────────────────────────────────────────────
const QUIZ_DATA = {

  1: [ // L'Histoire
    { q:"Quelle science étudie le passé des hommes ?", opts:["La géographie","L'histoire","Les mathématiques","La biologie"], ok:1 },
    { q:"L'ère chrétienne commence avec...", opts:["L'Hégire","La mort du prophète","La naissance de Jésus Christ","La découverte des métaux"], ok:2 },
    { q:"L'Hégire a eu lieu en quelle année ?", opts:["L'an 1","L'an 100","L'an 622","L'an 1776"], ok:2 },
    { q:"Les vestiges sont des sources...", opts:["Orales","Électroniques","Objets et ruines anciens","Écrits modernes"], ok:2 },
    { q:"L'exil de Mohamed de la Mecque vers Médine s'appelle...", opts:["L'Ère chrétienne","L'Hégire","La Datation","Le Calendrier"], ok:1 },
    { q:"L'histoire commence depuis la découverte...", opts:["De l'écriture et des métaux","Du feu et de la roue","De l'Amérique","De l'électricité"], ok:0 },
  ],

  2: [ // La Préhistoire
    { q:"L'homme du Paléolithique était...", opts:["Sédentaire","Agriculteur","Nomade","Potier"], ok:2 },
    { q:"Quelle période est 'l'âge de la pierre polie' ?", opts:["Paléolithique","Néolithique","Méolithique","Protolithique"], ok:1 },
    { q:"Au Paléolithique, l'homme vivait de...", opts:["Agriculture et élevage","Chasse, pêche et cueillette","Commerce et artisanat","Poterie et tissage"], ok:1 },
    { q:"L'Afrique est le berceau de...", opts:["La démocratie","L'Islam","L'humanité","La civilisation grecque"], ok:2 },
    { q:"Au Néolithique, l'homme a créé...", opts:["Les premières villes industrielles","Les premiers villages","Les premiers avions","Les premiers royaumes"], ok:1 },
    { q:"Combien de grandes périodes compte la préhistoire ?", opts:["Une","Deux","Trois","Quatre"], ok:1 },
  ],

  3: [ // La Préhistoire au Sénégal
    { q:"La Pointe de Fann est un site préhistorique situé à...", opts:["Thiès","Dakar","Tambacounda","Kaolack"], ok:1 },
    { q:"La datation par le carbone 14 permet de...", opts:["Dessiner des cartes","Déterminer l'âge des ossements","Construire des musées","Trouver des trésors"], ok:1 },
    { q:"Les Thiémassas sont un site préhistorique situé à...", opts:["Dakar","Saint-Louis","Thiès","Ziguinchor"], ok:2 },
    { q:"Le Sénégal avait une civilisation...", opts:["Moderne","Grecque","Préhistorique","Romaine"], ok:2 },
    { q:"La Protohistoire est...", opts:["La période avant la préhistoire","La période après l'histoire moderne","La période entre la préhistoire et l'histoire","La période des royaumes"], ok:2 },
    { q:"Les gisements des Madeleines sont un important site...", opts:["Historique","Géographique","Préhistorique","Touristique"], ok:2 },
  ],

  4: [ // Sociétés Africaines
    { q:"La cellule de base de la société africaine est...", opts:["Le clan","Le royaume","La tribu","La famille"], ok:3 },
    { q:"Combien de structures y a-t-il dans la société africaine ?", opts:["3","4","5","7"], ok:2 },
    { q:"Le clan regroupe des personnes issues du même...", opts:["Village","Pays","Ancêtre","Roi"], ok:2 },
    { q:"La tribu est liée par une solidarité...", opts:["Économique","Religieuse","Ethnique","Politique"], ok:2 },
    { q:"L'ethnie se distingue par la langue, la culture et les...", opts:["Habits","Noms","Danses","Richesses"], ok:1 },
    { q:"Le royaume est dirigé par...", opts:["Un président","Un général","Un roi","Un chef de clan"], ok:2 },
  ],

  5: [ // Le Djolof
    { q:"Qui a fondé le Djolof ?", opts:["Alboury Ndiaye","Lat Dior","Ndiadiane Ndiaye","Amary Ngoné Sobel"], ok:2 },
    { q:"Quelle est la capitale du Djolof ?", opts:["Mboul","Yang-Yang","Nder","Diakhao"], ok:1 },
    { q:"Le roi du Djolof s'appelle...", opts:["Damel","Bourba","Brack","Bour"], ok:1 },
    { q:"En quelle année a eu lieu la bataille de Danki ?", opts:["1490","1526","1549","1776"], ok:2 },
    { q:"Qui était le dernier Bourba du Djolof ?", opts:["Ndiadiane Ndiaye","Lélé Fouli Fack","Amary Ngoné Sobel","Alboury Ndiaye"], ok:3 },
    { q:"Le Djolof était situé dans l'actuelle région de...", opts:["Dakar","Thiès","Louga","Kaolack"], ok:2 },
  ],

  6: [ // Le Cayor
    { q:"Quelle est la capitale du Cayor ?", opts:["Yang-Yang","Diakhao","Nder","Mboul"], ok:3 },
    { q:"Le roi du Cayor s'appelle...", opts:["Bourba","Bour","Damel","Brack"], ok:2 },
    { q:"Le Cayor est libéré du Djolof en...", opts:["1490","1549","1776","1886"], ok:1 },
    { q:"Les activités principales du Cayor étaient...", opts:["La pêche et le tourisme","Le commerce, l'agriculture et l'élevage","L'industrie et les mines","La navigation et le commerce"], ok:1 },
    { q:"Le Cayor était une province du...", opts:["Walo","Sine","Djolof","Baol"], ok:2 },
    { q:"Lat Dior Ngoné Latyr Diop était un grand souverain du...", opts:["Walo","Djolof","Sine","Cayor"], ok:3 },
  ],

  7: [ // Le Walo
    { q:"Quelle est la capitale du Walo ?", opts:["Mboul","Yang-Yang","Nder","Lambaye"], ok:2 },
    { q:"Le roi du Walo s'appelle...", opts:["Damel","Bourba","Brack","Bour"], ok:2 },
    { q:"Le Walo se situe dans l'actuelle région de...", opts:["Dakar","Thiès","Kaolack","Saint-Louis"], ok:3 },
    { q:"Les Maures qui attaquaient le Walo s'appelaient les...", opts:["Trarza","Peuls","Mandingues","Sérères"], ok:0 },
    { q:"Le Walo fut annexé en quelle année ?", opts:["1776","1849","1859","1902"], ok:2 },
    { q:"Qui est la reine qui épousa Mohamed El Habib ?", opts:["Aline Sitoé","Ndaté Yalla","Ndieumbeut Mbodj","Maïssa Bigué"], ok:2 },
  ],

  8: [ // Sine et Saloum
    { q:"Qui a fondé le Saloum ?", opts:["Maïssa Waly Dione Mané","Koumba Ndofène Diouf","Mbégane Ndour","Fodé Ngouy Diouf"], ok:2 },
    { q:"La capitale du Sine est...", opts:["Kahone","Diakhao","Nder","Mboul"], ok:1 },
    { q:"Le titre du roi du Sine est...", opts:["Damel","Bourba","Brack","Bour"], ok:3 },
    { q:"Le Sine se situe dans la région de...", opts:["Kaolack","Thiès","Fatick","Diourbel"], ok:2 },
    { q:"Le dernier roi du Saloum était...", opts:["Mbégane Ndour","Koumba Ndofène Diouf","Mayékor Diouf","Fodé Ngouy Diouf"], ok:3 },
    { q:"Les Sérères fuyaient la pression des...", opts:["Peuls","Toucouleurs","Almoravides","Français"], ok:2 },
  ],

  12: [ // Anciens Royaumes
    { q:"Quelle est la capitale du Walo ?", opts:["Mboul","Yang-Yang","Nder","Diakhao"], ok:2 },
    { q:"Le titre du roi du Sine est...", opts:["Damel","Bourba","Brack","Bour"], ok:3 },
    { q:"Qui est le célèbre roi du Djolof ?", opts:["Lat Dior","Alboury Ndiaye","Mbégane Ndour","Barka Mbodj"], ok:1 },
    { q:"Quelle est la capitale du Saloum ?", opts:["Diakhao","Nder","Mboul","Kahone"], ok:3 },
    { q:"Le Mansa est le titre du roi de...", opts:["Cayor","Djolof","Casamance","Walo"], ok:2 },
    { q:"Quelle est la capitale du Baol ?", opts:["Nder","Lambaye","Mboul","Nioro"], ok:1 },
  ],

  16: [ // Résistance Armée
    { q:"Qui a organisé la résistance armée contre la colonisation ?", opts:["Des chefs africains courageux","Les paysans seulement","Les femmes uniquement","Les marchands"], ok:0 },
    { q:"Lat Dior Diop est un résistant du...", opts:["Mali","Guinée","Sénégal","Côte d'Ivoire"], ok:2 },
    { q:"Comment les Français ont-ils vaincu les résistants ?", opts:["Par la diplomatie","Par la ruse et des moyens énormes","Par le commerce","Par la religion"], ok:1 },
    { q:"Béhanzin était un célèbre résistant de...", opts:["La Guinée","Le Sénégal","Le Dahomey (Bénin)","Le Mali"], ok:2 },
    { q:"Alboury Ndiaye est le dernier Bourba du...", opts:["Cayor","Walo","Sine","Djolof"], ok:3 },
    { q:"El Hadj Omar Tall a fondé la ville de...", opts:["Touba","Tivaouane","Dinguiraye","Koussan"], ok:2 },
  ],

  17: [ // El Hadji Omar Tall
    { q:"El Hadji Omar Tall était originaire de...", opts:["Dakar","Thiès","Halwar près de Podor","Touba"], ok:2 },
    { q:"Quelle ville El Hadji Omar a-t-il fondée ?", opts:["Touba","Dinguiraye","Tivaouane","Saint-Louis"], ok:1 },
    { q:"Il a reçu le titre d'El Hadji lors de son pèlerinage à...", opts:["Médine","Jérusalem","La Mecque","Bandiagara"], ok:2 },
    { q:"Où El Hadji Omar a-t-il disparu en 1864 ?", opts:["À Dakar","À Nioro","Dans les grottes de Bandiagara","À Ségou"], ok:2 },
    { q:"Ses troupes ont affronté le gouverneur...", opts:["Archinard","Valois","Faidherbe","Dodds"], ok:2 },
    { q:"La lignée dont Omar Tall était issu s'appelle...", opts:["Peuls","Torobé","Sérères","Lébous"], ok:1 },
  ],

  18: [ // Lat Dior
    { q:"En quelle année Lat Dior est-il né ?", opts:["1820","1830","1842","1860"], ok:2 },
    { q:"Lat Dior fut élu Damel du Cayor en...", opts:["1842","1862","1871","1886"], ok:1 },
    { q:"Qui a exilé Lat Dior en 1864 ?", opts:["Archinard","Valois","Dodds","Faidherbe"], ok:3 },
    { q:"Lat Dior s'est converti à l'Islam chez...", opts:["El Hadji Omar","Cheikh Ahmadou Bamba","Maba Diakhou Ba","El Hadji Malick Sy"], ok:2 },
    { q:"Où Lat Dior est-il mort ?", opts:["Dakar","Saint-Louis","Dékheulé","Médine"], ok:2 },
    { q:"Contre quoi Lat Dior s'est-il battu ?", opts:["La construction du port","Le chemin de fer Dakar-Saint Louis","La religion","Les taxes agricoles"], ok:1 },
  ],

  19: [ // Alboury Ndiaye
    { q:"De quelle année à quelle année Alboury fut-il Bourba ?", opts:["1862-1880","1870-1885","1875-1890","1890-1902"], ok:2 },
    { q:"En quelle année Alboury est-il entré en guerre avec les Français ?", opts:["1875","1885","1890","1902"], ok:2 },
    { q:"Qui commandait les Français contre Alboury en 1890 ?", opts:["Faidherbe","Archinard","Valois","Dodds"], ok:3 },
    { q:"Alboury Ndiaye mourut en...", opts:["1886","1890","1898","1902"], ok:3 },
    { q:"La bataille où Alboury s'est distingué s'appelle...", opts:["Danki","Médine","Kolomina","Matam"], ok:2 },
    { q:"Qu'est-ce qu'un protectorat ?", opts:["Une liberté totale","La protection d'un pays puissant sur un pays faible","Un accord commercial","Un traité de paix"], ok:1 },
  ],

  20: [ // Ahmadou Cheikhou Tall
    { q:"Qui est le père d'Ahmadou Cheikhou Tall ?", opts:["Alboury Ndiaye","El Hadji Omar Tall","Lat Dior Diop","Maba Diakhou Ba"], ok:1 },
    { q:"Quelle confrérie dirigeait Ahmadou Cheikhou Tall ?", opts:["Mouride","Tidjane","Qadriya","Layène"], ok:1 },
    { q:"Quel colonel français a attaqué Ségou en 1890 ?", opts:["Faidherbe","Dodds","Valois","Archinard"], ok:3 },
    { q:"Les Français opposèrent à Ahmadou...", opts:["Lat Dior","Alboury Ndiaye","Mamadou Lamine Dramé","El Hadji Omar"], ok:2 },
    { q:"Où Ahmadou Cheikhou Tall est-il mort ?", opts:["À Ségou","À Dakar","En pays Haoussa (libre)","Au Gabon"], ok:2 },
    { q:"En quelle année Archinard a-t-il attaqué Ségou ?", opts:["1876","1885","1890","1902"], ok:2 },
  ],
};

// ─────────────────────────────────────────────────────────────
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

  // 1. Trouver la matière Histoire
  const matiere = await Matiere.findOne({ code: 'HI' });
  if (!matiere) {
    console.error('❌ Matière Histoire (code: HI) introuvable. Lance d\'abord node src/db/seed.js');
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
