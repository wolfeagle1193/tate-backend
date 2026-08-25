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
// Intègre les leçons IST CM1 dans la plateforme Taté
// Leçons : 3,6,9,10,11,12,13,15,16,17,18,19,21
//
// Usage : node src/db/seed-ist-cm1.js
// ============================================================

// ─────────────────────────────────────────────────────────────
// DONNÉES DES LEÇONS
// ─────────────────────────────────────────────────────────────
const LECONS_DATA = [
{ordre:3,titre:"La Brouette / La Lampe de Poche",objectif:"Comprendre les principes de la brouette (levier) et de la lampe de poche",promptSupplement:"Exemples concrets. CM1.",contenuHTML:`<h1>🔦 Leçon 3 : La Brouette et la Lampe de Poche</h1>

<div class="bloc-essentiel">
  <p><strong>La brouette</strong> est un <mark>outil-levier</mark> qui permet de déplacer des charges lourdes. <strong>La lampe de poche</strong> est un <mark>appareil électrique portable</mark> qui produit de la lumière.</p>
</div>

<h2>🛠️ La brouette : un levier pratique</h2>
<p>La brouette est composée de <strong>6 parties</strong> :</p>
<ul>
  <li><strong>Les poignées</strong> : pour la tenir et la pousser</li>
  <li><strong>Le brancard</strong> : les deux longues barres</li>
  <li><strong>Les pieds</strong> : pour la stabilité à l'arrêt</li>
  <li><strong>L'essieu</strong> : la barre qui relie la roue</li>
  <li><strong>La benne</strong> : le récipient qui contient la charge</li>
  <li><strong>La roue</strong> : pour faciliter le déplacement</li>
</ul>
<p>Elle fonctionne selon le <mark>principe du levier</mark> : on déplace une charge lourde avec moins de force. Utile pour les <strong>jardiniers</strong>, <strong>maçons</strong> et <strong>commerçants</strong>.</p>

<h2>🔦 La lampe de poche : l'électricité portable</h2>
<p>La lampe de poche est composée de <strong>4 parties</strong> :</p>
<ul>
  <li><mark>L'ampoule</mark> : émet la lumière</li>
  <li><mark>Les piles</mark> : fournissent l'énergie électrique</li>
  <li><mark>Les fils</mark> : transportent le courant électrique</li>
  <li><mark>L'interrupteur</mark> : permet d'allumer ou d'éteindre</li>
</ul>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong> Sans piles, la lampe ne fonctionne pas car il n'y a pas de courant électrique. La brouette a une roue pour réduire la friction et faciliter le déplacement.
</div>

<h2>📝 Résumé à retenir</h2>
<ul>
  <li>La <strong>brouette</strong> a <strong>6 parties</strong> et fonctionne comme un <strong>levier</strong></li>
  <li>La <strong>lampe de poche</strong> a <strong>4 parties</strong> : ampoule, piles, fils, interrupteur</li>
  <li>L'<strong>ampoule</strong> émet la lumière, les <strong>piles</strong> fournissent le courant</li>
</ul>`,exercices:[{question:"Qu'est-ce qu'une brouette ? Cite ses 6 parties.",reponse:"La brouette est un outil-levier. Ses 6 parties : poignees, brancard, pieds, essieu, benne, roue.",explication:"Elle sert a deplacer des charges lourdes."},{question:"Qu'est-ce qu'une lampe de poche ? Cite ses 4 parties.",reponse:"Appareil electrique portable. Ses 4 parties : ampoule, piles, fils, interrupteur.",explication:"Produit de la lumiere."},{question:"Role de l'ampoule ?",reponse:"Emet la lumiere.",explication:"Sans elle, pas de lumiere."},{question:"Role des piles ?",reponse:"Fournissent l'energie electrique.",explication:"Sources d'alimentation."},{question:"Role des fils ?",reponse:"Transportent le courant.",explication:"Conducteurs electriques."},{question:"Role de l'interrupteur ?",reponse:"Allume ou eteint.",explication:"Ouvre ou ferme le circuit."},{question:"Pourquoi la brouette est un levier ?",reponse:"Car elle permet de deplacer des charges lourdes avec moins de force.",explication:"Principe du levier."},{question:"Qui utilise la brouette ?",reponse:"Jardinier, macon, commercant.",explication:"Transport de charges."},{question:"Sans piles, la lampe fonctionne ?",reponse:"Non, sans courant electrique elle ne peut pas s'allumer.",explication:"Piles indispensables."},{question:"Pourquoi la brouette a une roue ?",reponse:"Pour reduire la friction et faciliter le deplacement.",explication:"Sans roue, on traine la charge."}],qcm:[{enonce:"Brouette = outil pour...",options:[{lettre:"A",texte:"ecrire"},{lettre:"B",texte:"deplacer des objets lourds"},{lettre:"C",texte:"mesurer"},{lettre:"D",texte:"couper"}],reponseCorrecte:"B",explication:"Transport."},{enonce:"Parties de la brouette ?",options:[{lettre:"A",texte:"4"},{lettre:"B",texte:"5"},{lettre:"C",texte:"6"},{lettre:"D",texte:"7"}],reponseCorrecte:"C",explication:"6 parties."},{enonce:"Lampe = appareil...",options:[{lettre:"A",texte:"mecanique"},{lettre:"B",texte:"electrique"},{lettre:"C",texte:"a gaz"},{lettre:"D",texte:"thermique"}],reponseCorrecte:"B",explication:"Electrique."},{enonce:"Ampoule sert a...",options:[{lettre:"A",texte:"stocker"},{lettre:"B",texte:"emettre la lumiere"},{lettre:"C",texte:"transporter"},{lettre:"D",texte:"ouvrir"}],reponseCorrecte:"B",explication:"Lumiere."},{enonce:"Piles = ?",options:[{lettre:"A",texte:"conducteurs"},{lettre:"B",texte:"interrupteurs"},{lettre:"C",texte:"alimentation"},{lettre:"D",texte:"ampoules"}],reponseCorrecte:"C",explication:"Alimentation."},{enonce:"Fils = ?",options:[{lettre:"A",texte:"produire"},{lettre:"B",texte:"transporter le courant"},{lettre:"C",texte:"stocker"},{lettre:"D",texte:"proteger"}],reponseCorrecte:"B",explication:"Transport."},{enonce:"Interrupteur = ?",options:[{lettre:"A",texte:"produire"},{lettre:"B",texte:"changer"},{lettre:"C",texte:"allumer/eteindre"},{lettre:"D",texte:"nettoyer"}],reponseCorrecte:"C",explication:"Allumer."},{enonce:"Qui utilise la brouette ?",options:[{lettre:"A",texte:"cuisinier"},{lettre:"B",texte:"jardinier/macon"},{lettre:"C",texte:"musicien"},{lettre:"D",texte:"tailleur"}],reponseCorrecte:"B",explication:"Jardinier."},{enonce:"Brouette = principe du...",options:[{lettre:"A",texte:"moteur"},{lettre:"B",texte:"levier"},{lettre:"C",texte:"generateur"},{lettre:"D",texte:"aimant"}],reponseCorrecte:"B",explication:"Levier."},{enonce:"Sans piles, lampe...",options:[{lettre:"A",texte:"fonctionne"},{lettre:"B",texte:"eclaire moins"},{lettre:"C",texte:"ne marche pas"},{lettre:"D",texte:"eclaire plus"}],reponseCorrecte:"C",explication:"Pas de courant."}]},
{ordre:6,titre:"L'Ordinateur",objectif:"Connaitre les parties de l'ordinateur",promptSupplement:"Exemples concrets. CM1.",contenuHTML:`<h1>💻 Leçon 6 : L'Ordinateur</h1>

<div class="bloc-essentiel">
  <p>L'<strong>ordinateur</strong> est un <mark>outil électronique</mark> qui permet de traiter des informations, de communiquer et d'écrire.</p>
</div>

<h2>🖥️ L'unité centrale : le cerveau</h2>
<p>L'<strong>unité centrale</strong> contient :</p>
<ul>
  <li><mark>Le disque dur</mark> : stocke les fichiers et programmes</li>
  <li><mark>La mémoire vive</mark> : pour travailler sur plusieurs choses</li>
  <li><mark>Le processeur</mark> : calcule et exécute (le moteur)</li>
  <li><mark>Le lecteur</mark> : lit CD, DVD, clés USB</li>
</ul>

<h2>💾 Stockage</h2>
<p>CD ROM, disque dur, DVD</p>

<h2>⌨️ Périphériques</h2>
<p><strong>Entrée :</strong> clavier, souris, micro, scanner</p>
<p><strong>Sortie :</strong> imprimante, écran, haut-parleurs</p>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong> Le <strong>modem</strong> sert à connecter à <strong>Internet</strong>. Avec un ordinateur, on peut communiquer, écrire et regarder des vidéos.
</div>

<h2>📝 Résumé</h2>
<ul>
  <li>Outil <strong>électronique</strong></li>
  <li>UC contient : disque dur, mémoire, processeur, lecteur</li>
  <li>Périphériques d'entrée : clavier, souris, micro, scanner</li>
  <li>Périphériques de sortie : imprimante, écran, HP</li>
</ul>`,exercices:[{question:"Qu'est-ce qu'un ordinateur ?",reponse:"Outil electronique pour traiter des informations, communiquer, ecrire.",explication:"Machine programmable."},{question:"Que contient l'unite centrale ?",reponse:"Disque dur, memoire vive, processeur, lecteur.",explication:"Composants essentiels."},{question:"Cite 3 unites de stockage.",reponse:"CD ROM, disque dur, DVD.",explication:"Conservent les fichiers."},{question:"Qu'est-ce qu'un peripherique d'entree ? Donne 3 ex.",reponse:"Envoie des donnees a l'ordi. Ex: clavier, souris, micro.",explication:"Donnent des instructions."},{question:"Qu'est-ce qu'un peripherique de sortie ? Donne 3 ex.",reponse:"Recoit des donnees de l'ordi. Ex: imprimante, ecran, HP.",explication:"Affichent les resultats."},{question:"A quoi sert le modem ?",reponse:"Connecter l'ordinateur a Internet.",explication:"Sans modem, pas d'Internet."},{question:"Role du processeur ?",reponse:"Calculer et executer les programmes.",explication:"Moteur de l'ordi."},{question:"Role du disque dur ?",reponse:"Stocker les fichiers et programmes.",explication:"Memoire permanente."},{question:"Quel peripherique numerise un document ?",reponse:"Le scanner.",explication:"Transforme papier en fichier."},{question:"Cite 3 choses possibles avec un ordinateur.",reponse:"Communiquer, ecrire, regarder des videos.",explication:"Usages courants."}],qcm:[{enonce:"Ordinateur = outil...",options:[{lettre:"A",texte:"mecanique"},{lettre:"B",texte:"electronique"},{lettre:"C",texte:"manuel"},{lettre:"D",texte:"chimique"}],reponseCorrecte:"B",explication:"Electronique."},{enonce:"Cerveau de l'ordi = ?",options:[{lettre:"A",texte:"ecran"},{lettre:"B",texte:"clavier"},{lettre:"C",texte:"unite centrale"},{lettre:"D",texte:"souris"}],reponseCorrecte:"C",explication:"UC."},{enonce:"Clavier = peripherique...",options:[{lettre:"A",texte:"sortie"},{lettre:"B",texte:"entree"},{lettre:"C",texte:"stockage"},{lettre:"D",texte:"connexion"}],reponseCorrecte:"B",explication:"Entree."},{enonce:"Imprimante = peripherique...",options:[{lettre:"A",texte:"entree"},{lettre:"B",texte:"sortie"},{lettre:"C",texte:"stockage"},{lettre:"D",texte:"central"}],reponseCorrecte:"B",explication:"Sortie."},{enonce:"Modem sert a...",options:[{lettre:"A",texte:"imprimer"},{lettre:"B",texte:"Internet"},{lettre:"C",texte:"ecouter"},{lettre:"D",texte:"scanner"}],reponseCorrecte:"B",explication:"Internet."},{enonce:"Processeur...",options:[{lettre:"A",texte:"stocke"},{lettre:"B",texte:"calcule"},{lettre:"C",texte:"affiche"},{lettre:"D",texte:"imprime"}],reponseCorrecte:"B",explication:"Calcule."},{enonce:"Disque dur sert a...",options:[{lettre:"A",texte:"afficher"},{lettre:"B",texte:"stocker"},{lettre:"C",texte:"imprimer"},{lettre:"D",texte:"connecter"}],reponseCorrecte:"B",explication:"Stocker."},{enonce:"Micro = peripherique...",options:[{lettre:"A",texte:"sortie"},{lettre:"B",texte:"entree"},{lettre:"C",texte:"stockage"},{lettre:"D",texte:"affichage"}],reponseCorrecte:"B",explication:"Entree."},{enonce:"Ecran = ?",options:[{lettre:"A",texte:"clavier"},{lettre:"B",texte:"moniteur"},{lettre:"C",texte:"processeur"},{lettre:"D",texte:"modem"}],reponseCorrecte:"B",explication:"Moniteur."},{enonce:"Qui numerise ?",options:[{lettre:"A",texte:"imprimante"},{lettre:"B",texte:"scanner"},{lettre:"C",texte:"souris"},{lettre:"D",texte:"HP"}],reponseCorrecte:"B",explication:"Scanner."}]},
{ordre:9,titre:"Les Etats de la Matiere",objectif:"Connaitre les 3 etats de la matiere",promptSupplement:"Exemples concrets. CM1.",contenuHTML:`<h1>🧪 Leçon 9 : Les États de la Matière</h1>

<div class="bloc-essentiel">
  <p>La matière existe sous <mark>3 états</mark> : <strong>solide</strong>, <strong>liquide</strong> et <strong>gazeux</strong>.</p>
</div>

<h2>🧊 Solide</h2>
<ul>
  <li>Forme <mark>propre</mark></li>
  <li>Certains <strong>fondent</strong> (fer, or, glace)</li>
  <li>Réfractaires = ne fondent pas (sable, pierre)</li>
</ul>

<h2>💧 Liquide</h2>
<ul>
  <li><mark>Fluide</mark> : coule</li>
  <li>Forme du récipient, volume fixe</li>
</ul>

<h2>💨 Gazeux</h2>
<ul>
  <li><mark>Invisible</mark>, compressible, élastique</li>
  <li>Volume variable</li>
</ul>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong> Un <strong>fluide</strong> coule (liquide ou gaz). Solides et liquides = volume fixe. Gaz = volume variable.
</div>`,exercices:[{question:"Quels sont les 3 etats de la matiere ?",reponse:"Solide, liquide, gazeux.",explication:"3 formes."},{question:"Pourquoi les liquides sont des fluides ?",reponse:"Car ils coulent.",explication:"Un fluide s'ecoule."},{question:"Qu'est-ce qu'un corps refractaire ?",reponse:"Solide qui ne fond pas sous la chaleur.",explication:"Ex: sable, pierre."},{question:"Cite 2 gaz.",reponse:"Air, butane.",explication:"Invisibles."},{question:"Volume solides/liquides ?",reponse:"Invariable (fixe).",explication:"Seuls les gaz varient."},{question:"Pourquoi les gaz sont compressibles ?",reponse:"Car on peut reduire leur volume.",explication:"Elastiques."},{question:"Exemple de solide qui fond ?",reponse:"Fer, or, glace.",explication:"Chauffe."},{question:"Qu'est-ce qu'un fluide ?",reponse:"Substance qui coule.",explication:"Eau, huile."},{question:"3 proprietes des gaz ?",reponse:"Invisibles, compressibles, elastiques.",explication:"3 proprietes."},{question:"Exemple de liquide ?",reponse:"Huile, lait, jus.",explication:"Coule."}],qcm:[{enonce:"Combien d'etats de la matiere ?",options:[{lettre:"A",texte:"2"},{lettre:"B",texte:"3"},{lettre:"C",texte:"4"},{lettre:"D",texte:"5"}],reponseCorrecte:"B",explication:"3."},{enonce:"Un liquide prend...",options:[{lettre:"A",texte:"forme fixe"},{lettre:"B",texte:"forme du recipient"},{lettre:"C",texte:"est solide"},{lettre:"D",texte:"est invisible"}],reponseCorrecte:"B",explication:"S'adapte."},{enonce:"Corps refractaire = ?",options:[{lettre:"A",texte:"fond"},{lettre:"B",texte:"ne fond pas"},{lettre:"C",texte:"devient gaz"},{lettre:"D",texte:"se liquefie"}],reponseCorrecte:"B",explication:"Resiste."},{enonce:"Les gaz sont...",options:[{lettre:"A",texte:"visibles"},{lettre:"B",texte:"invisibles"},{lettre:"C",texte:"liquides"},{lettre:"D",texte:"solides"}],reponseCorrecte:"B",explication:"Invisibles."},{enonce:"Eau = ?",options:[{lettre:"A",texte:"solide"},{lettre:"B",texte:"gaz"},{lettre:"C",texte:"liquide"},{lettre:"D",texte:"gazeux"}],reponseCorrecte:"C",explication:"Liquide."},{enonce:"Air = ?",options:[{lettre:"A",texte:"liquide"},{lettre:"B",texte:"solide"},{lettre:"C",texte:"gaz"},{lettre:"D",texte:"plasma"}],reponseCorrecte:"C",explication:"Gaz."},{enonce:"Volume d'un gaz = ?",options:[{lettre:"A",texte:"fixe"},{lettre:"B",texte:"variable"},{lettre:"C",texte:"nul"},{lettre:"D",texte:"constant"}],reponseCorrecte:"B",explication:"Variable."},{enonce:"Fer chauffe = ?",options:[{lettre:"A",texte:"ne fond pas"},{lettre:"B",texte:"fond"},{lettre:"C",texte:"se solidifie"},{lettre:"D",texte:"s'evapore"}],reponseCorrecte:"B",explication:"Fond."},{enonce:"Sable = solide...",options:[{lettre:"A",texte:"refractaire"},{lettre:"B",texte:"fusible"},{lettre:"C",texte:"liquide"},{lettre:"D",texte:"gazeux"}],reponseCorrecte:"A",explication:"Refractaire."},{enonce:"Fluide = ?",options:[{lettre:"A",texte:"gaz"},{lettre:"B",texte:"solide"},{lettre:"C",texte:"substance qui coule"},{lettre:"D",texte:"refractaire"}],reponseCorrecte:"C",explication:"Coule."}]},
{ordre:10,titre:"Les Combustions Vives",objectif:"Comprendre les combustions vives",promptSupplement:"Exemples concrets. CM1.",contenuHTML:`<h1>🔥 Leçon 10 : Les Combustions Vives</h1>

<div class="bloc-essentiel">
  <p>Une <mark>combustion vive</mark> : un corps brûle en dégageant <strong>chaleur</strong> et <strong>lumière</strong> visibles. Ex : flamme de bougie.</p>
</div>

<h2>🔥 Combustible : 3 types</h2>
<ul>
  <li><strong>Solide</strong> : bois, bougie, charbon</li>
  <li><strong>Liquide</strong> : essence, pétrole, alcool</li>
  <li><strong>Gazeux</strong> : butane, propane</li>
</ul>

<h2>⚡ Conditions</h2>
<ul>
  <li>1. <mark>Chauffer</mark> le combustible</li>
  <li>2. <mark>Oxygène</mark> de l'air</li>
</ul>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong> Sans <strong>oxygène</strong>, le feu s'éteint. Produits : chaleur + lumière + CO₂ + vapeur d'eau.
</div>`,exercices:[{question:"Qu'est-ce qu'une combustion vive ?",reponse:"Un corps brule en degageant chaleur et lumiere visible. Ex: flamme de bougie.",explication:"Produit chaleur + lumiere + CO2 + vapeur."},{question:"Qu'est-ce qu'un combustible ?",reponse:"Un corps qui peut bruler. Ex: bois, essence, butane.",explication:"Peut bruler."},{question:"Cite 3 types de combustibles avec exemples.",reponse:"Solide (bois), liquide (essence), gazeux (butane).",explication:"3 types."},{question:"2 conditions pour qu'un corps brule ?",reponse:"Chauffer le combustible + contact avec l'oxygene de l'air.",explication:"Les deux sont necessaires."},{question:"Exemple de combustible liquide ?",reponse:"Petrole, essence, alcool.",explication:"Pour les vehicules."},{question:"Exemple de combustible solide ?",reponse:"Bois, bougie, charbon.",explication:"Pour le chauffage."},{question:"Exemple de combustible gazeux ?",reponse:"Butane, propane.",explication:"Pour la cuisson."},{question:"Que produit une combustion vive ?",reponse:"Chaleur, lumiere, gaz carbonique, vapeur d'eau.",explication:"4 produits."},{question:"Pourquoi l'oxygene est necessaire ?",reponse:"Le combustible en a besoin pour bruler.",explication:"Sans oxygene, le feu s'eteint."},{question:"La flamme d'une bougie est-elle une combustion vive ?",reponse:"Oui, on voit la lumiere et on sent la chaleur.",explication:"Exemple typique."}],qcm:[{enonce:"Combustion vive = ?",options:[{lettre:"A",texte:"froid"},{lettre:"B",texte:"chaleur et lumiere"},{lettre:"C",texte:"son"},{lettre:"D",texte:"eau"}],reponseCorrecte:"B",explication:"Chaleur+lumiere."},{enonce:"Combustible = ?",options:[{lettre:"A",texte:"ne brule pas"},{lettre:"B",texte:"peut bruler"},{lettre:"C",texte:"uniquement liquide"},{lettre:"D",texte:"uniquement gazeux"}],reponseCorrecte:"B",explication:"Peut bruler."},{enonce:"Bois = combustible...",options:[{lettre:"A",texte:"liquide"},{lettre:"B",texte:"solide"},{lettre:"C",texte:"gazeux"},{lettre:"D",texte:"plastique"}],reponseCorrecte:"B",explication:"Solide."},{enonce:"Essence = combustible...",options:[{lettre:"A",texte:"solide"},{lettre:"B",texte:"liquide"},{lettre:"C",texte:"gazeux"},{lettre:"D",texte:"mineral"}],reponseCorrecte:"B",explication:"Liquide."},{enonce:"Butane = combustible...",options:[{lettre:"A",texte:"solide"},{lettre:"B",texte:"liquide"},{lettre:"C",texte:"gazeux"},{lettre:"D",texte:"metallique"}],reponseCorrecte:"C",explication:"Gazeux."},{enonce:"Pour bruler, besoin de...",options:[{lettre:"A",texte:"d'eau"},{lettre:"B",texte:"d'oxygene"},{lettre:"C",texte:"de sable"},{lettre:"D",texte:"de froid"}],reponseCorrecte:"B",explication:"Oxygene."},{enonce:"Sans oxygene = ?",options:[{lettre:"A",texte:"brule plus fort"},{lettre:"B",texte:"s'eteint"},{lettre:"C",texte:"froid"},{lettre:"D",texte:"accelere"}],reponseCorrecte:"B",explication:"S'eteint."},{enonce:"Charbon = combustible...",options:[{lettre:"A",texte:"liquide"},{lettre:"B",texte:"solide"},{lettre:"C",texte:"gazeux"},{lettre:"D",texte:"vegetal"}],reponseCorrecte:"B",explication:"Solide."},{enonce:"Sans chaleur = ?",options:[{lettre:"A",texte:"se produit"},{lettre:"B",texte:"ne peut pas demarrer"},{lettre:"C",texte:"accelere"},{lettre:"D",texte:"devient plus fort"}],reponseCorrecte:"B",explication:"Ne peut pas."},{enonce:"Oxygene dans ?",options:[{lettre:"A",texte:"l'eau"},{lettre:"B",texte:"l'air"},{lettre:"C",texte:"le sol"},{lettre:"D",texte:"le feu"}],reponseCorrecte:"B",explication:"Air."}]},
{ordre:11,titre:"Les Combustions Lentes",objectif:"Comprendre l'oxydation et la rouille",promptSupplement:"Exemples concrets. CM1.",contenuHTML:`<h1>🧰 Leçon 11 : Les Combustions Lentes</h1>

<div class="bloc-essentiel">
  <p>Une <mark>combustion lente</mark> ne produit <strong>ni chaleur ni lumière</strong>. Exemple : la <strong>rouille</strong>.</p>
</div>

<h2>🔄 Oxydation</h2>
<p>Action de l'<mark>oxygène de l'air</mark> sur un métal. Combustion lente.</p>

<h2>🟫 Rouille</h2>
<p>Oxydation du fer. Elle est <mark>poreuse</mark> : l'air traverse et attaque l'intérieur.</p>

<h2>✨ Métaux inoxydables</h2>
<p><strong>Or, argent, nickel, chrome</strong> — ne rouillent jamais.</p>

<h2>🛡️ Protection du fer</h2>
<ul>
  <li><mark>Graisse</mark>, peinture, minium, zinc</li>
</ul>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong> Le cuivre et le zinc s'oxydent seulement en surface (ça les protège).
</div>`,exercices:[{question:"Qu'est-ce qu'une combustion lente ? Exemple ?",reponse:"Ne produit ni chaleur ni lumiere visible. Ex: la rouille du fer.",explication:"Invisible, contrairement a une flamme."},{question:"Qu'est-ce que l'oxydation ?",reponse:"Action de l'oxygene de l'air sur un metal.",explication:"Combustion lente."},{question:"Qu'est-ce que la rouille ?",reponse:"Oxydation du fer. Elle est poreuse et attaque en profondeur.",explication:"Fragilise le metal."},{question:"Cite 2 metaux inoxydables.",reponse:"Or, argent, nickel, chrome.",explication:"Ne rouillent jamais."},{question:"Comment proteger le fer de la rouille ?",reponse:"Graisse, peinture, minium, couche de zinc.",explication:"Empechent l'air d'atteindre le fer."},{question:"Cuivre et zinc rouillent-ils comme le fer ?",reponse:"Non, ils s'oxydent seulement en surface (protection).",explication:"Leur oxydation les protege."},{question:"Pourquoi la rouille est poreuse ?",reponse:"L'oxygene traverse et attaque le fer a l'interieur.",explication:"Le fer rouille de l'interieur."},{question:"Qu'est-ce que le minium ?",reponse:"Peinture anti-rouille pour le fer.",explication:"Protege les structures."},{question:"Difference flamme bougie / rouille clou ?",reponse:"Flamme = vive (visible), rouille = lente (invisible).",explication:"Les deux sont des combustions."},{question:"3 manieres de proteger le fer ?",reponse:"Peinture, graisse, galvanisation (zinc).",explication:"Couper l'air."}],qcm:[{enonce:"Combustion lente = ?",options:[{lettre:"A",texte:"degage chaleur/lumiere"},{lettre:"B",texte:"ne dégage rien"},{lettre:"C",texte:"produit CO2"},{lettre:"D",texte:"a besoin de flamme"}],reponseCorrecte:"B",explication:"Invisible."},{enonce:"Oxydation = ?",options:[{lettre:"A",texte:"vive"},{lettre:"B",texte:"lente"},{lettre:"C",texte:"fusion"},{lettre:"D",texte:"evaporation"}],reponseCorrecte:"B",explication:"Lente."},{enonce:"Rouille causee par ?",options:[{lettre:"A",texte:"eau de pluie"},{lettre:"B",texte:"oxygene de l'air"},{lettre:"C",texte:"soleil"},{lettre:"D",texte:"vent"}],reponseCorrecte:"B",explication:"Oxygene."},{enonce:"Metal inoxydable ?",options:[{lettre:"A",texte:"Fer"},{lettre:"B",texte:"Or"},{lettre:"C",texte:"Cuivre"},{lettre:"D",texte:"Zinc"}],reponseCorrecte:"B",explication:"Or."},{enonce:"Proteger fer = ?",options:[{lettre:"A",texte:"eau"},{lettre:"B",texte:"graisse/peinture"},{lettre:"C",texte:"sable"},{lettre:"D",texte:"poussiere"}],reponseCorrecte:"B",explication:"Graisse."},{enonce:"Rouille poreuse = ?",options:[{lettre:"A",texte:"protege le fer"},{lettre:"B",texte:"laisse passer l'air"},{lettre:"C",texte:"le rend solide"},{lettre:"D",texte:"disparait"}],reponseCorrecte:"B",explication:"L'air passe."},{enonce:"Cuivre s'oxyde ?",options:[{lettre:"A",texte:"en profondeur"},{lettre:"B",texte:"en surface"},{lettre:"C",texte:"pas du tout"},{lettre:"D",texte:"vite"}],reponseCorrecte:"B",explication:"Surface."},{enonce:"Minium = ?",options:[{lettre:"A",texte:"colle"},{lettre:"B",texte:"peinture anti-rouille"},{lettre:"C",texte:"nettoyant"},{lettre:"D",texte:"aimant"}],reponseCorrecte:"B",explication:"Peinture."},{enonce:"Combustion vive = ?",options:[{lettre:"A",texte:"invisible"},{lettre:"B",texte:"visible"},{lettre:"C",texte:"lente"},{lettre:"D",texte:"froide"}],reponseCorrecte:"B",explication:"Visible."},{enonce:"3 methodes ?",options:[{lettre:"A",texte:"peinture,graisse,zinc"},{lettre:"B",texte:"eau,sable,vent"},{lettre:"C",texte:"feu,glace,soleil"},{lettre:"D",texte:"pierre,bois,fer"}],reponseCorrecte:"A",explication:"Anti-rouille."}]},
{ordre:12,titre:"Les Etats de l'Eau",objectif:"Connaitre les changements d'etat de l'eau",promptSupplement:"Exemples concrets. CM1.",contenuHTML:`<h1>💧 Leçon 12 : Les États de l'Eau</h1>

<div class="bloc-essentiel">
  <p>L'eau existe sous <mark>3 états</mark> : <strong>liquide</strong>, <strong>solide</strong> (glace), <strong>gazeux</strong> (vapeur).</p>
</div>

<h2>🔄 Changements d'état</h2>

<table>
  <tr><th>Changement</th><th>De → Vers</th><th>Température</th></tr>
  <tr><td><mark>Solidification</mark></td><td>Eau → Glace</td><td><strong>0°C</strong></td></tr>
  <tr><td><mark>Fusion</mark></td><td>Glace → Eau</td><td><strong>0°C</strong></td></tr>
  <tr><td><mark>Évaporation</mark></td><td>Eau → Vapeur</td><td><strong>100°C</strong></td></tr>
  <tr><td><mark>Condensation</mark></td><td>Vapeur → Eau</td><td>Refroidissement</td></tr>
</table>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong> La <strong>vapeur d'eau</strong> est invisible. La buée que l'on voit est de l'<strong>eau liquide</strong> (condensation).
</div>`,exercices:[{question:"Quels sont les 3 etats de l'eau ?",reponse:"Liquide, solide (glace), gazeux (vapeur).",explication:"Selon la temperature."},{question:"Solidification ?",reponse:"Eau liquide devient glace a 0°C.",explication:"Refroidissement."},{question:"Fusion ?",reponse:"Glace devient eau liquide.",explication:"Rechauffement."},{question:"Evaporation ?",reponse:"Eau devient vapeur. L'eau bout a 100°C.",explication:"Chauffage."},{question:"Condensation ?",reponse:"Vapeur devient eau liquide (ex: buee).",explication:"Refroidissement."},{question:"Eau bout a ?",reponse:"100°C.",explication:"Ebullition."},{question:"Eau gele a ?",reponse:"0°C.",explication:"Solidification."},{question:"Vapeur d'eau visible ?",reponse:"Non, invisible. La buee qu'on voit est de l'eau liquide.",explication:"Gaz transparent."},{question:"Que devient l'eau chauffee longtemps ?",reponse:"Elle s'evapore en vapeur invisible.",explication:"Disparait dans l'air."},{question:"Exemple de condensation ?",reponse:"Buee sur vitre froide ou miroir apres douche.",explication:"Vapeur au contact du froid."}],qcm:[{enonce:"Solidification = ?",options:[{lettre:"A",texte:"liquide→solide"},{lettre:"B",texte:"solide→liquide"},{lettre:"C",texte:"liquide→gaz"},{lettre:"D",texte:"gaz→liquide"}],reponseCorrecte:"A",explication:"Eau→glace."},{enonce:"Fusion = ?",options:[{lettre:"A",texte:"liquide→solide"},{lettre:"B",texte:"solide→liquide"},{lettre:"C",texte:"liquide→gaz"},{lettre:"D",texte:"gaz→liquide"}],reponseCorrecte:"B",explication:"Glace→eau."},{enonce:"Evaporation = ?",options:[{lettre:"A",texte:"liquide→solide"},{lettre:"B",texte:"solide→liquide"},{lettre:"C",texte:"liquide→gaz"},{lettre:"D",texte:"gaz→liquide"}],reponseCorrecte:"C",explication:"Eau→vapeur."},{enonce:"Condensation = ?",options:[{lettre:"A",texte:"liquide→solide"},{lettre:"B",texte:"solide→liquide"},{lettre:"C",texte:"liquide→gaz"},{lettre:"D",texte:"gaz→liquide"}],reponseCorrecte:"D",explication:"Vapeur→eau."},{enonce:"Eau bout a ?",options:[{lettre:"A",texte:"0°C"},{lettre:"B",texte:"50°C"},{lettre:"C",texte:"100°C"},{lettre:"D",texte:"200°C"}],reponseCorrecte:"C",explication:"100°C."},{enonce:"Eau gele a ?",options:[{lettre:"A",texte:"0°C"},{lettre:"B",texte:"-10°C"},{lettre:"C",texte:"50°C"},{lettre:"D",texte:"100°C"}],reponseCorrecte:"A",explication:"0°C."},{enonce:"Vapeur d'eau = ?",options:[{lettre:"A",texte:"visible"},{lettre:"B",texte:"invisible"},{lettre:"C",texte:"chaude"},{lettre:"D",texte:"coloree"}],reponseCorrecte:"B",explication:"Invisible."},{enonce:"Buee = ?",options:[{lettre:"A",texte:"solidification"},{lettre:"B",texte:"fusion"},{lettre:"C",texte:"evaporation"},{lettre:"D",texte:"condensation"}],reponseCorrecte:"D",explication:"Condensation."},{enonce:"Chauffer eau = ?",options:[{lettre:"A",texte:"gele"},{lettre:"B",texte:"s'evapore"},{lettre:"C",texte:"fond"},{lettre:"D",texte:"durcit"}],reponseCorrecte:"B",explication:"Evaporation."},{enonce:"Glace fond a ?",options:[{lettre:"A",texte:"-10°C"},{lettre:"B",texte:"0°C"},{lettre:"C",texte:"50°C"},{lettre:"D",texte:"100°C"}],reponseCorrecte:"B",explication:"0°C."}]},
{ordre:13,titre:"Le Cycle de l'Eau",objectif:"Comprendre le cycle de l'eau",promptSupplement:"Exemples concrets. CM1.",contenuHTML:`<h1>🌊 Leçon 13 : Le Cycle de l'Eau</h1>

<div class="bloc-essentiel">
  <p>Le <mark>cycle de l'eau</mark> est le mouvement <strong>perpétuel</strong> de l'eau entre Terre et atmosphère.</p>
</div>

<h2>🔄 4 étapes</h2>

<table>
  <tr><th>Étape</th><th>Description</th></tr>
  <tr><td><strong>1. Évaporation</strong></td><td>Le <mark>soleil</mark> chauffe les mers → vapeur monte</td></tr>
  <tr><td><strong>2. Condensation</strong></td><td>Vapeur refroidit → gouttelettes → <strong>nuages</strong></td></tr>
  <tr><td><strong>3. Précipitation</strong></td><td>Nuages lourds → <strong>pluie</strong></td></tr>
  <tr><td><strong>4. Ruissellement</strong></td><td>Eau retourne à la mer (sources, rivières)</td></tr>
</table>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong> Le <strong>soleil</strong> est le moteur du cycle. Sans lui, le cycle s'arrête.
</div>`,exercices:[{question:"Qu'est-ce que le cycle de l'eau ?",reponse:"Mouvement perpetuel de l'eau entre Terre et atmosphere.",explication:"L'eau ne se perd jamais."},{question:"Les 4 etapes du cycle ?",reponse:"Evaporation, condensation, precipitation, ruissellement.",explication:"Dans cet ordre."},{question:"Que fait l'eau des mers sous le soleil ?",reponse:"Elle s'evapore en vapeur.",explication:"Premiere etape."},{question:"Comment se forment les nuages ?",reponse:"La vapeur se condense en gouttelettes.",explication:"Condensation."},{question:"Quand les nuages sont trop lourds ?",reponse:"Ils donnent de la pluie.",explication:"Precipitation."},{question:"Ou va l'eau de pluie ?",reponse:"Infiltration dans le sol ou ruissellement vers la mer.",explication:"Retour a la mer."},{question:"Pourquoi le cycle est important ?",reponse:"Il renouvelle l'eau douce pour la vie.",explication:"Essentiel."},{question:"Role du soleil ?",reponse:"Chauffer l'eau pour l'evaporation.",explication:"Moteur du cycle."},{question:"Ou ressort l'eau infiltree ?",reponse:"Par les sources.",explication:"Eau souterraine."},{question:"Le cycle a-t-il une fin ?",reponse:"Non, perpetuel depuis des millions d'annees.",explication:"Recommence sans cesse."}],qcm:[{enonce:"Cycle commence par ?",options:[{lettre:"A",texte:"pluie"},{lettre:"B",texte:"evaporation"},{lettre:"C",texte:"nuages"},{lettre:"D",texte:"vent"}],reponseCorrecte:"B",explication:"Evaporation."},{enonce:"Nuages par ?",options:[{lettre:"A",texte:"evaporation"},{lettre:"B",texte:"condensation"},{lettre:"C",texte:"solidification"},{lettre:"D",texte:"fusion"}],reponseCorrecte:"B",explication:"Condensation."},{enonce:"Eau nuages = ?",options:[{lettre:"A",texte:"neige"},{lettre:"B",texte:"pluie"},{lettre:"C",texte:"grele"},{lettre:"D",texte:"tout"}],reponseCorrecte:"B",explication:"Precipitation."},{enonce:"Eau retourne ?",options:[{lettre:"A",texte:"nuages"},{lettre:"B",texte:"mer"},{lettre:"C",texte:"soleil"},{lettre:"D",texte:"nulle part"}],reponseCorrecte:"B",explication:"Mer."},{enonce:"Eau infiltree = ?",options:[{lettre:"A",texte:"nuages"},{lettre:"B",texte:"sources"},{lettre:"C",texte:"puits"},{lettre:"D",texte:"mers"}],reponseCorrecte:"B",explication:"Sources."},{enonce:"Cycle = ?",options:[{lettre:"A",texte:"fini"},{lettre:"B",texte:"perpetuel"},{lettre:"C",texte:"inutile"},{lettre:"D",texte:"lent"}],reponseCorrecte:"B",explication:"Sans fin."},{enonce:"Sans soleil ?",options:[{lettre:"A",texte:"accelere"},{lettre:"B",texte:"s'arrete"},{lettre:"C",texte:"continue"},{lettre:"D",texte:"ralentit"}],reponseCorrecte:"B",explication:"Arret."},{enonce:"Evaporation = ?",options:[{lettre:"A",texte:"eau→glace"},{lettre:"B",texte:"eau→vapeur"},{lettre:"C",texte:"pluie"},{lettre:"D",texte:"nuages"}],reponseCorrecte:"B",explication:"Vapeur."},{enonce:"Condensation = ?",options:[{lettre:"A",texte:"glace"},{lettre:"B",texte:"gouttelettes"},{lettre:"C",texte:"pluie"},{lettre:"D",texte:"vent"}],reponseCorrecte:"B",explication:"Eau liquide."},{enonce:"Etapes du cycle ?",options:[{lettre:"A",texte:"2"},{lettre:"B",texte:"3"},{lettre:"C",texte:"4"},{lettre:"D",texte:"5"}],reponseCorrecte:"C",explication:"4."}]},
{ordre:15,titre:"L'Eau est un Solvant",objectif:"Comprendre le pouvoir dissolvant de l'eau",promptSupplement:"Sucre, sel. CM1.",contenuHTML:`<h1>💧 Leçon 15 : L'Eau est un Solvant</h1>

<div class="bloc-essentiel">
  <p>L'eau est un <mark>solvant</mark> : elle <strong>dissout</strong> certains corps. Le sucre et le sel sont <strong>solubles</strong>.</p>
</div>

<h2>🧪 Dissolution</h2>
<p>Sucre + eau = <mark>solution sucrée</mark>. Le sucre devient invisible mais reste présent.</p>

<h2>🧂 Solution saturée</h2>
<p>Ne peut plus dissoudre : limite atteinte.</p>

<h2>🔮 Cristaux</h2>
<p>Par <strong>évaporation</strong> de l'eau, le sucre ou le sel forme des cristaux. Ex : sel des marais salants.</p>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong> Le sable ne se dissout pas dans l'eau. Seuls certains corps sont <strong>solubles</strong>.
</div>`,exercices:[{question:"Qu'est-ce qu'un solvant ? Exemple ?",reponse:"Liquide qui dissout d'autres corps. Ex: l'eau.",explication:"L'eau dissout sucre et sel."},{question:"Qu'est-ce qu'un corps soluble ? Exemples ?",reponse:"Corps qui peut se dissoudre. Ex: sucre, sel.",explication:"Disparait dans l'eau."},{question:"Sucre + eau = ?",reponse:"Solution sucree. Le sucre se dissout, invisible.",explication:"Toujours present mais invisible."},{question:"Solution saturee ?",reponse:"Eau ne peut plus dissoudre le sucre.",explication:"Limite atteinte."},{question:"Cristaux de sucre ?",reponse:"Par evaporation de l'eau sucre.",explication:"L'eau part, le sucre reste."},{question:"Sel de table ?",reponse:"Des marais salants : l'eau de mer s'evapore, le sel reste.",explication:"Evaporation naturelle."},{question:"Tous les solides se dissolvent dans l'eau ?",reponse:"Non. Le sable ne se dissout pas.",explication:"Seulement certains."},{question:"Pourquoi l'eau est un bon solvant ?",reponse:"Car elle dissout beaucoup de choses : sucre, sel, cafe.",explication:"Tres utile."},{question:"Ou va le sucre dissous ?",reponse:"Il reste dans l'eau, melange de facon invisible.",explication:"En solution."},{question:"Difference solvant/soluble ?",reponse:"Solvant = qui dissout (eau). Soluble = qui est dissous (sucre).",explication:"L'eau dissout le sucre."}],qcm:[{enonce:"L'eau est un...",options:[{lettre:"A",texte:"solide"},{lettre:"B",texte:"solvant"},{lettre:"C",texte:"gaz"},{lettre:"D",texte:"metal"}],reponseCorrecte:"B",explication:"Liquide qui dissout."},{enonce:"Soluble dans eau ?",options:[{lettre:"A",texte:"sable"},{lettre:"B",texte:"sucre"},{lettre:"C",texte:"huile"},{lettre:"D",texte:"pierre"}],reponseCorrecte:"B",explication:"Sucre."},{enonce:"Saturee = ?",options:[{lettre:"A",texte:"peut encore dissoudre"},{lettre:"B",texte:"ne peut plus dissoudre"},{lettre:"C",texte:"tres chaude"},{lettre:"D",texte:"tres froide"}],reponseCorrecte:"B",explication:"Limite."},{enonce:"Cristaux par ?",options:[{lettre:"A",texte:"chauffage"},{lettre:"B",texte:"evaporation"},{lettre:"C",texte:"congelation"},{lettre:"D",texte:"friture"}],reponseCorrecte:"B",explication:"Evaporation."},{enonce:"Sel vient ?",options:[{lettre:"A",texte:"montagnes"},{lettre:"B",texte:"marais salants"},{lettre:"C",texte:"rivieres"},{lettre:"D",texte:"volcans"}],reponseCorrecte:"B",explication:"Marais salants."},{enonce:"Soluble = ?",options:[{lettre:"A",texte:"ne se dissout pas"},{lettre:"B",texte:"peut se dissoudre"},{lettre:"C",texte:"toujours solide"},{lettre:"D",texte:"toujours liquide"}],reponseCorrecte:"B",explication:"Se dissout."},{enonce:"Solvant = ?",options:[{lettre:"A",texte:"ce qui est dissous"},{lettre:"B",texte:"liquide qui dissout"},{lettre:"C",texte:"gaz"},{lettre:"D",texte:"solide"}],reponseCorrecte:"B",explication:"Qui dissout."},{enonce:"Sucre+eau = ?",options:[{lettre:"A",texte:"solution sucree"},{lettre:"B",texte:"salee"},{lettre:"C",texte:"huileuse"},{lettre:"D",texte:"pate"}],reponseCorrecte:"A",explication:"Sucree."},{enonce:"Sucre et sel = ?",options:[{lettre:"A",texte:"solvants"},{lettre:"B",texte:"solubles"},{lettre:"C",texte:"insolubles"},{lettre:"D",texte:"gazeux"}],reponseCorrecte:"B",explication:"Se dissolvent."},{enonce:"Eau dissout...",options:[{lettre:"A",texte:"tout"},{lettre:"B",texte:"certains corps"},{lettre:"C",texte:"rien"},{lettre:"D",texte:"les gaz"}],reponseCorrecte:"B",explication:"Certains."}]},
{ordre:16,titre:"L'Air",objectif:"Connaitre la composition et proprietes de l'air",promptSupplement:"Exemples concrets. CM1.",contenuHTML:`<h1>💨 Leçon 16 : L'Air</h1>

<div class="bloc-essentiel">
  <p>L'<strong>air</strong> est un <mark>gaz invisible</mark> composé d'<strong>oxygène</strong> + <strong>azote</strong> + CO₂ + vapeur d'eau.</p>
</div>

<h2>🧪 4 propriétés</h2>
<ul>
  <li><mark>Fluide</mark></li>
  <li><mark>Expansible</mark></li>
  <li><mark>Compressible</mark></li>
  <li><mark>Élastique</mark></li>
</ul>

<h2>🌡️ Poids</h2>
<p>1 litre d'air = <strong>1,3 grammes</strong></p>

<h2>🌬️ Vent et atmosphère</h2>
<ul>
  <li><strong>Vent</strong> = air en mouvement</li>
  <li><strong>Atmosphère</strong> = couche d'air autour de la Terre</li>
</ul>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong> L'air est vital. Il freine la chute des corps. Les avions volent grâce à l'air.
</div>`,exercices:[{question:"Composition de l'air ?",reponse:"Oxygene et azote, avec un peu de CO2 et vapeur d'eau.",explication:"Melange de gaz."},{question:"4 proprietes de l'air ?",reponse:"Fluide, expansible, compressible, elastique.",explication:"4 proprietes."},{question:"Qu'est-ce que le vent ?",reponse:"De l'air en mouvement.",explication:"Deplacement d'air."},{question:"Poids d'1 litre d'air ?",reponse:"1,3 grammes.",explication:"L'air a un poids."},{question:"Atmosphere ?",reponse:"Couche d'air autour de la Terre.",explication:"Nous protege."},{question:"A quoi sert l'air ?",reponse:"A respirer (oxygene).",explication:"Vital."},{question:"Pourquoi les avions volent ?",reponse:"L'air les maintient (portance).",explication:"Propriete de l'air."},{question:"L'air est-il visible ?",reponse:"Non, invisible.",explication:"Gaz transparent."},{question:"Air freine les corps ?",reponse:"Oui, freine leur chute.",explication:"Resistance de l'air."},{question:"Le vent est-il dangereux ?",reponse:"Oui, les tempetes peuvent causer des degats.",explication:"Force du vent."}],qcm:[{enonce:"Air compose d'...",options:[{lettre:"A",texte:"oxygene/azote"},{lettre:"B",texte:"eau/sel"},{lettre:"C",texte:"sable/pierre"},{lettre:"D",texte:"fer/or"}],reponseCorrecte:"A",explication:"O2+N2."},{enonce:"L'air = ?",options:[{lettre:"A",texte:"gaz"},{lettre:"B",texte:"liquide"},{lettre:"C",texte:"solide"},{lettre:"D",texte:"metal"}],reponseCorrecte:"A",explication:"Gaz."},{enonce:"1L air = ?",options:[{lettre:"A",texte:"0g"},{lettre:"B",texte:"1,3g"},{lettre:"C",texte:"10g"},{lettre:"D",texte:"100g"}],reponseCorrecte:"B",explication:"1,3g."},{enonce:"Vent = ?",options:[{lettre:"A",texte:"gaz froid"},{lettre:"B",texte:"air en mouvement"},{lettre:"C",texte:"eau"},{lettre:"D",texte:"nuage"}],reponseCorrecte:"B",explication:"Air."},{enonce:"Atmosphere = ?",options:[{lettre:"A",texte:"eau"},{lettre:"B",texte:"air"},{lettre:"C",texte:"soleil"},{lettre:"D",texte:"lune"}],reponseCorrecte:"B",explication:"Air."},{enonce:"Air permet ?",options:[{lettre:"A",texte:"manger"},{lettre:"B",texte:"respirer"},{lettre:"C",texte:"dormir"},{lettre:"D",texte:"courir"}],reponseCorrecte:"B",explication:"Respirer."},{enonce:"L'air = ?",options:[{lettre:"A",texte:"pesant"},{lettre:"B",texte:"leger"},{lettre:"C",texte:"sans poids"},{lettre:"D",texte:"mou"}],reponseCorrecte:"A",explication:"1,3g/L."},{enonce:"Air freine ?",options:[{lettre:"A",texte:"oiseaux"},{lettre:"B",texte:"chute des corps"},{lettre:"C",texte:"vent"},{lettre:"D",texte:"nuages"}],reponseCorrecte:"B",explication:"Chute."},{enonce:"L'air = ?",options:[{lettre:"A",texte:"compressible"},{lettre:"B",texte:"incompressible"},{lettre:"C",texte:"mou"},{lettre:"D",texte:"dur"}],reponseCorrecte:"A",explication:"Comprimable."},{enonce:"Ou est l'air ?",options:[{lettre:"A",texte:"partout"},{lettre:"B",texte:"sous l'eau"},{lettre:"C",texte:"dans le sol"},{lettre:"D",texte:"nulle part"}],reponseCorrecte:"A",explication:"Partout."}]},
{ordre:17,titre:"La Pression Atmospherique",objectif:"Comprendre la pression atmospherique",promptSupplement:"Siphon, seringue. CM1.",contenuHTML:`<h1>📏 Leçon 17 : La Pression Atmosphérique</h1>

<div class="bloc-essentiel">
  <p>La <mark>pression atmosphérique</mark> est la <strong>force</strong> de l'air sur les corps, dans <strong>tous les sens</strong>.</p>
</div>

<h2>🔧 Appareils utilisant la pression</h2>
<ul>
  <li><strong>Siphon</strong> : eau monte par différence de pression</li>
  <li><strong>Seringue</strong> : piston aspire le liquide</li>
  <li><strong>Compte-gouttes</strong></li>
  <li><strong>Pipette</strong></li>
</ul>

<h2>📐 Baromètre</h2>
<p>Mesure la <strong>pression</strong>. 2 types : <mark>à mercure</mark> et <mark>métallique</mark>.</p>

<div class="bloc-attention">
  <strong>📌 À retenir :</strong> En altitude, pression diminue. Haute pression = beau temps.
</div>`,exercices:[{question:"Pression atmospherique ?",reponse:"Force que l'air exerce sur les corps, dans tous les sens.",explication:"Omnidirectionnelle."},{question:"4 appareils utilisant la pression ?",reponse:"Siphon, seringue, compte-gouttes, pipette.",explication:"Fonctionnent par pression."},{question:"Instrument pour mesurer la pression ?",reponse:"Le barometre.",explication:"Mesure la pression de l'air."},{question:"2 types de barometres ?",reponse:"A mercure et metallique.",explication:"Deux technologies."},{question:"Comment fonctionne une seringue ?",reponse:"En tirant le piston, la pression aspire le liquide.",explication:"La pression de l'air pousse."},{question:"Siphon ?",reponse:"L'eau monte par difference de pression atmospherique.",explication:"Pression."},{question:"Compte-gouttes ?",reponse:"Aspire le liquide en relachant la poire.",explication:"Pression de l'air."},{question:"Sens de la pression ?",reponse:"Dans tous les sens (haut, bas, cotes).",explication:"Omnidirectionnelle."},{question:"En altitude ?",reponse:"Pression diminue car moins d'air.",explication:"Moins d'air."},{question:"Utilitie du barometre ?",reponse:"Prevoir le temps (haute pression = beau temps).",explication:"Meteo."}],qcm:[{enonce:"Pression = ?",options:[{lettre:"A",texte:"force eau"},{lettre:"B",texte:"force air"},{lettre:"C",texte:"force vent"},{lettre:"D",texte:"force sol"}],reponseCorrecte:"B",explication:"Air."},{enonce:"Siphon utilise ?",options:[{lettre:"A",texte:"chaleur"},{lettre:"B",texte:"pression"},{lettre:"C",texte:"froid"},{lettre:"D",texte:"electricite"}],reponseCorrecte:"B",explication:"Pression."},{enonce:"Barometre mesure ?",options:[{lettre:"A",texte:"temperature"},{lettre:"B",texte:"pression"},{lettre:"C",texte:"vent"},{lettre:"D",texte:"pluie"}],reponseCorrecte:"B",explication:"Pression."},{enonce:"Barometres ?",options:[{lettre:"A",texte:"eau/air"},{lettre:"B",texte:"mercure/metal"},{lettre:"C",texte:"vent/pluie"},{lettre:"D",texte:"gaz"}],reponseCorrecte:"B",explication:"2 types."},{enonce:"Pression s'exerce ?",options:[{lettre:"A",texte:"haut"},{lettre:"B",texte:"bas"},{lettre:"C",texte:"tous sens"},{lettre:"D",texte:"cote"}],reponseCorrecte:"C",explication:"Tous."},{enonce:"Altitude = ?",options:[{lettre:"A",texte:"augmente"},{lettre:"B",texte:"diminue"},{lettre:"C",texte:"pareil"},{lettre:"D",texte:"disparait"}],reponseCorrecte:"B",explication:"Moins air."},{enonce:"Seringue utilise ?",options:[{lettre:"A",texte:"chaleur"},{lettre:"B",texte:"pression"},{lettre:"C",texte:"froid"},{lettre:"D",texte:"eau"}],reponseCorrecte:"B",explication:"Pression."},{enonce:"Baro mercure contient ?",options:[{lettre:"A",texte:"eau"},{lettre:"B",texte:"mercure"},{lettre:"C",texte:"air"},{lettre:"D",texte:"sable"}],reponseCorrecte:"B",explication:"Mercure."},{enonce:"Compte-gouttes ?",options:[{lettre:"A",texte:"electricite"},{lettre:"B",texte:"pression"},{lettre:"C",texte:"chaleur"},{lettre:"D",texte:"vent"}],reponseCorrecte:"B",explication:"Pression."},{enonce:"En haut air = ?",options:[{lettre:"A",texte:"dense"},{lettre:"B",texte:"rare"},{lettre:"C",texte:"lourd"},{lettre:"D",texte:"epais"}],reponseCorrecte:"B",explication:"Rare."}]},
{ordre:18,titre:"La Dilatation et le Thermometre",objectif:"Comprendre la dilatation et le thermometre",promptSupplement:"Exemples concrets. CM1.",contenuHTML:`<h1>🌡️ Leçon 18 : Dilatation et Thermomètre</h1>

<div class="bloc-essentiel">
  <p><mark>Dilatation</mark> = volume augmente avec chaleur. <mark>Contraction</mark> = volume diminue au froid. <strong>Tous les corps</strong> se dilatent/contractent.</p>
</div>

<h2>🌡️ Thermomètre</h2>
<p>Mesure la <strong>température</strong>. Composé d'une planchette graduée + tube avec <strong>alcool</strong> ou <strong>mercure</strong>.</p>
<ul>
  <li>Chaud → mercure <mark>monte</mark></li>
  <li>Froid → mercure <mark>descend</mark></li>
</ul>

<div class="bloc-attention">
  <strong>📌 Exemple :</strong> Espace entre les rails du train pour la dilatation en été. Ballon chauffé = air se dilate et gonfle.
</div>`,exercices:[{question:"Qu'est-ce que la dilatation ?",reponse:"Augmentation du volume d'un corps sous l'action de la chaleur.",explication:"Prend plus de place."},{question:"Qu'est-ce que la contraction ?",reponse:"Retour a la taille normale en refroidissant.",explication:"Reprend sa place."},{question:"Quels corps se dilatent ?",reponse:"Tous : solides, liquides et gaz.",explication:"Ex: rails, mercure, air."},{question:"A quoi sert un thermometre ?",reponse:"A mesurer la temperature (chaud/froid).",explication:"Instrument de mesure."},{question:"De quoi est fait un thermometre ?",reponse:"Planchette graduee + tube en verre avec alcool ou mercure.",explication:"Deux parties."},{question:"Que fait le mercure quand il fait chaud ?",reponse:"Il monte dans le tube (dilatation).",explication:"Monte au chaud."},{question:"Que fait le mercure quand il fait froid ?",reponse:"Il descend dans le tube (contraction).",explication:"Descend au froid."},{question:"Cite 2 types de thermometres.",reponse:"Medical et d'ambiance.",explication:"Usages differents."},{question:"Pourquoi un espace entre les rails ?",reponse:"Pour permettre la dilatation en ete, eviter les deformations.",explication:"La dilatation des metaux."},{question:"Que se passe-t-il si on chauffe un ballon ?",reponse:"L'air se dilate et le ballon gonfle (ou explose).",explication:"Les gaz aussi se dilatent."}],qcm:[{enonce:"Dilatation = ?",options:[{lettre:"A",texte:"volume diminue"},{lettre:"B",texte:"volume augmente"},{lettre:"C",texte:"poids change"},{lettre:"D",texte:"couleur change"}],reponseCorrecte:"B",explication:"+ sous chaleur."},{enonce:"Contraction = ?",options:[{lettre:"A",texte:"volume augmente"},{lettre:"B",texte:"volume diminue"},{lettre:"C",texte:"chaud"},{lettre:"D",texte:"rien"}],reponseCorrecte:"B",explication:"- au froid."},{enonce:"Thermometre mesure ?",options:[{lettre:"A",texte:"pression"},{lettre:"B",texte:"temperature"},{lettre:"C",texte:"vent"},{lettre:"D",texte:"humidite"}],reponseCorrecte:"B",explication:"Temperature."},{enonce:"Thermometre contient ?",options:[{lettre:"A",texte:"eau"},{lettre:"B",texte:"alcool/mercure"},{lettre:"C",texte:"sable"},{lettre:"D",texte:"air"}],reponseCorrecte:"B",explication:"Liquide."},{enonce:"Mercure monte = ?",options:[{lettre:"A",texte:"froid"},{lettre:"B",texte:"chaud"},{lettre:"C",texte:"humide"},{lettre:"D",texte:"sec"}],reponseCorrecte:"B",explication:"Chaud."},{enonce:"Quels corps se dilatent ?",options:[{lettre:"A",texte:"soldes"},{lettre:"B",texte:"liquides"},{lettre:"C",texte:"gaz"},{lettre:"D",texte:"tous"}],reponseCorrecte:"D",explication:"Tous."},{enonce:"Refroidir = ?",options:[{lettre:"A",texte:"dilate"},{lettre:"B",texte:"contracte"},{lettre:"C",texte:"rien"},{lettre:"D",texte:"fond"}],reponseCorrecte:"B",explication:"Contracte."},{enonce:"Chaleur = ?",options:[{lettre:"A",texte:"dilate"},{lettre:"B",texte:"contracte"},{lettre:"C",texte:"rien"},{lettre:"D",texte:"fond"}],reponseCorrecte:"A",explication:"Dilate."},{enonce:"Espace rail = ?",options:[{lettre:"A",texte:"dilatation"},{lettre:"B",texte:"poids"},{lettre:"C",texte:"couleur"},{lettre:"D",texte:"bruit"}],reponseCorrecte:"A",explication:"Dilatation."},{enonce:"Tous les corps ?",options:[{lettre:"A",texte:"se dilatent"},{lettre:"B",texte:"ne se dilatent pas"},{lettre:"C",texte:"sont solides"},{lettre:"D",texte:"sont gazeux"}],reponseCorrecte:"A",explication:"Se dilatent."}]},
{ordre:19,titre:"La Digestion",objectif:"Connaitre l'appareil digestif et la digestion",promptSupplement:"Alimentation. CM1.",contenuHTML:`<h1>🍽️ Leçon 19 : La Digestion</h1>

<div class="bloc-essentiel">
  <p>La <mark>digestion</mark> transforme les aliments en <strong>nutriments</strong> dans le <strong>tube digestif</strong>.</p>
</div>

<h2>🔬 5 parties</h2>

<table>
  <tr><th>Organe</th><th>Rôle</th></tr>
  <tr><td><strong>1. Bouche</strong></td><td>Mâche et broie</td></tr>
  <tr><td><strong>2. Œsophage</strong></td><td>Conduit à l'estomac</td></tr>
  <tr><td><strong>3. Estomac</strong></td><td>Brasse avec sucs gastriques</td></tr>
  <tr><td><strong>4. Intestin grêle</strong></td><td>Absorbe les nutriments</td></tr>
  <tr><td><strong>5. Gros intestin</strong></td><td>Absorbe l'eau, évacue les déchets</td></tr>
</table>

<div class="bloc-attention">
  <strong>💡 Conseils :</strong> Bien mâcher, manger sain, à heures régulières, sans excès.
</div>`,exercices:[{question:"Qu'est-ce que la digestion ?",reponse:"Transformation des aliments en nutriments dans le tube digestif.",explication:"Nutriments dans le sang."},{question:"Cite les 5 parties de l'appareil digestif.",reponse:"Bouche, oesophage, estomac, intestin grele, gros intestin.",explication:"Dans l'ordre."},{question:"Role de la bouche ?",reponse:"Macher et broyer (mastication).",explication:"Premiere etape."},{question:"Role de l'oesophage ?",reponse:"Conduire les aliments a l'estomac.",explication:"Tube de descente."},{question:"Role de l'estomac ?",reponse:"Brasser les aliments avec les sucs gastriques.",explication:"Transforme en bouillie."},{question:"Role de l'intestin grele ?",reponse:"Absorber les nutriments dans le sang.",explication:"Le corps recupere l'energie."},{question:"Role du gros intestin ?",reponse:"Absorber l'eau et evacuer les dechets solides.",explication:"Derniere etape."},{question:"Que produisent les glandes digestives ?",reponse:"Des sucs digestifs pour transformer les aliments.",explication:"Aident a digerer."},{question:"Donne 4 conseils pour bien digerer.",reponse:"Bien macher, manger sain, a heures regulieres, sans exces.",explication:"Bonnes habitudes."},{question:"Pourquoi bien macher ?",reponse:"Pour faciliter le travail de l'estomac (predigestion).",explication:"L'estomac travaille moins."}],qcm:[{enonce:"Digestion se fait dans ?",options:[{lettre:"A",texte:"coeur"},{lettre:"B",texte:"tube digestif"},{lettre:"C",texte:"poumons"},{lettre:"D",texte:"cerveau"}],reponseCorrecte:"B",explication:"Tube digestif."},{enonce:"Premier organe ?",options:[{lettre:"A",texte:"oesophage"},{lettre:"B",texte:"bouche"},{lettre:"C",texte:"estomac"},{lettre:"D",texte:"intestin"}],reponseCorrecte:"B",explication:"Bouche."},{enonce:"Oesophage conduit ?",options:[{lettre:"A",texte:"bouche"},{lettre:"B",texte:"estomac"},{lettre:"C",texte:"intestin"},{lettre:"D",texte:"coeur"}],reponseCorrecte:"B",explication:"Estomac."},{enonce:"Estomac ?",options:[{lettre:"A",texte:"absorbe eau"},{lettre:"B",texte:"brasse aliments"},{lettre:"C",texte:"mache"},{lettre:"D",texte:"evacue"}],reponseCorrecte:"B",explication:"Brassage."},{enonce:"Nutriments absorbes dans ?",options:[{lettre:"A",texte:"estomac"},{lettre:"B",texte:"intestin grele"},{lettre:"C",texte:"gros intestin"},{lettre:"D",texte:"bouche"}],reponseCorrecte:"B",explication:"Intestin grele."},{enonce:"Eau absorbe dans ?",options:[{lettre:"A",texte:"estomac"},{lettre:"B",texte:"intestin grele"},{lettre:"C",texte:"gros intestin"},{lettre:"D",texte:"bouche"}],reponseCorrecte:"C",explication:"Gros intestin."},{enonce:"Glandes = ?",options:[{lettre:"A",texte:"sang"},{lettre:"B",texte:"sucs"},{lettre:"C",texte:"air"},{lettre:"D",texte:"os"}],reponseCorrecte:"B",explication:"Sucs."},{enonce:"Parties appareil digestif ?",options:[{lettre:"A",texte:"3"},{lettre:"B",texte:"4"},{lettre:"C",texte:"5"},{lettre:"D",texte:"6"}],reponseCorrecte:"C",explication:"5."},{enonce:"Bien macher = ?",options:[{lettre:"A",texte:"conseil"},{lettre:"B",texte:"exercice"},{lettre:"C",texte:"jeu"},{lettre:"D",texte:"regle"}],reponseCorrecte:"A",explication:"Conseil."},{enonce:"Alcool mauvais pour ?",options:[{lettre:"A",texte:"digestion"},{lettre:"B",texte:"vue"},{lettre:"C",texte:"ouie"},{lettre:"D",texte:"peau"}],reponseCorrecte:"A",explication:"Digestion."}]},
{ordre:21,titre:"La Circulation du Sang",objectif:"Comprendre la composition du sang et la circulation",promptSupplement:"Explications simples. CM1.",contenuHTML:`<h1>❤️ Leçon 21 : La Circulation du Sang</h1>

<div class="bloc-essentiel">
  <p>Le <strong>sang</strong> contient : <mark>plasma</mark> (liquide clair), <mark>globules rouges</mark> (couleur rouge), <mark>globules blancs</mark> (défense). Environ <strong>5 litres</strong>.</p>
</div>

<h2>🔄 Deux circulations</h2>
<ul>
  <li><strong>Grande</strong> : cœur → organes (oxygène aux organes)</li>
  <li><strong>Petite</strong> : cœur → poumons (oxygène renouvelé)</li>
</ul>

<h2>🩸 Caillot</h2>
<p>Sang coagulé qui bouche les plaies.</p>

<div class="bloc-attention">
  <strong>📌 Santé :</strong> L'<strong>alcool</strong> et le <strong>tabac</strong> sont mauvais pour le cœur. Le <strong>sport</strong> (course, natation, vélo) favorise une bonne circulation.
</div>`,exercices:[{question:"Que contient le sang ?",reponse:"Plasma (liquide clair), globules rouges (couleur), globules blancs (defense).",explication:"3 composants."},{question:"Quantite de sang dans le corps ?",reponse:"Environ 5 litres.",explication:"Quantite moyenne."},{question:"Grande circulation ?",reponse:"Le sang va du coeur vers tous les organes.",explication:"Coeur→organes."},{question:"Petite circulation ?",reponse:"Le sang va du coeur vers les poumons.",explication:"Coeur→poumons."},{question:"Role des globules rouges ?",reponse:"Donner sa couleur rouge au sang.",explication:"Couleur."},{question:"Role des globules blancs ?",reponse:"Defendre le corps contre les microbes.",explication:"Immunite."},{question:"Qu'est-ce que le plasma ?",reponse:"La partie liquide et claire du sang.",explication:"Liquide."},{question:"Qu'est-ce qu'un caillot ?",reponse:"Du sang coagule qui bouche les plaies pour arreter le saignement.",explication:"Arrete les saignements."},{question:"Qu'est-ce qui est mauvais pour le coeur ?",reponse:"L'alcool et le tabac.",explication:"Nuisibles au coeur."},{question:"Qu'est-ce qui favorise la circulation ?",reponse:"Le sport (course, natation, velo).",explication:"Active le coeur."}],qcm:[{enonce:"Litres de sang ?",options:[{lettre:"A",texte:"2L"},{lettre:"B",texte:"3L"},{lettre:"C",texte:"5L"},{lettre:"D",texte:"10L"}],reponseCorrecte:"C",explication:"5L."},{enonce:"Plasma = ?",options:[{lettre:"A",texte:"liquide clair"},{lettre:"B",texte:"gaz"},{lettre:"C",texte:"solide"},{lettre:"D",texte:"cellule"}],reponseCorrecte:"A",explication:"Liquide."},{enonce:"Grande circ = ?",options:[{lettre:"A",texte:"coeur→poumons"},{lettre:"B",texte:"coeur→organes"},{lettre:"C",texte:"poumons→coeur"},{lettre:"D",texte:"organes→poumons"}],reponseCorrecte:"B",explication:"Organes."},{enonce:"Petite circ = ?",options:[{lettre:"A",texte:"coeur→poumons"},{lettre:"B",texte:"coeur→organes"},{lettre:"C",texte:"poumons→organes"},{lettre:"D",texte:"organes→coeur"}],reponseCorrecte:"A",explication:"Poumons."},{enonce:"Alcool/tabac = ?",options:[{lettre:"A",texte:"bon coeur"},{lettre:"B",texte:"mauvais coeur"},{lettre:"C",texte:"sans effet"},{lettre:"D",texte:"bon poumon"}],reponseCorrecte:"B",explication:"Mauvais."},{enonce:"Sport = ?",options:[{lettre:"A",texte:"paresse"},{lettre:"B",texte:"bonne circulation"},{lettre:"C",texte:"maladie"},{lettre:"D",texte:"sommeil"}],reponseCorrecte:"B",explication:"Bonne circ."},{enonce:"Caillot = ?",options:[{lettre:"A",texte:"liquide"},{lettre:"B",texte:"coagule"},{lettre:"C",texte:"gazeux"},{lettre:"D",texte:"transparent"}],reponseCorrecte:"B",explication:"Coagule."},{enonce:"Globules blancs = ?",options:[{lettre:"A",texte:"couleur"},{lettre:"B",texte:"defense"},{lettre:"C",texte:"transport"},{lettre:"D",texte:"chaleur"}],reponseCorrecte:"B",explication:"Defense."},{enonce:"Globules rouges = ?",options:[{lettre:"A",texte:"defense"},{lettre:"B",texte:"couleur"},{lettre:"C",texte:"coagulation"},{lettre:"D",texte:"transport"}],reponseCorrecte:"B",explication:"Couleur."},{enonce:"Tabac = ?",options:[{lettre:"A",texte:"bon"},{lettre:"B",texte:"mauvais"},{lettre:"C",texte:"sans effet"},{lettre:"D",texte:"bon poumon"}],reponseCorrecte:"B",explication:"Mauvais."}]}
];

const QUIZ_DATA = {
  3: [
{q:"Outil pour charges lourdes ?",opts:["Pelle","Brouette","Seau","Marteau"],ok:1},
{q:"Parties brouette ?",opts:["4","5","6","7"],ok:2},
{q:"Qui produit la lumiere ?",opts:["Pile","Fil","Ampoule","Interrupteur"],ok:2},
{q:"Interrupteur = ?",opts:["Produire","Allumer/eteindre","Stocker","Proteger"],ok:1},
{q:"Piles = ?",opts:["Ampoules","Alimentation","Interrupteurs","Conducteurs"],ok:1},
{q:"Qui utilise brouette ?",opts:["Medecin","Jardinier","Professeur","Musicien"],ok:1}
  ],
  6: [
{q:"Ordinateur = ?",opts:["Mecanique","Electronique","Manuel","Chimique"],ok:1},
{q:"Cerveau ordi ?",opts:["Ecran","Unite centrale","Souris","Clavier"],ok:1},
{q:"Clavier = ?",opts:["Sortie","Entree","Stockage","Affichage"],ok:1},
{q:"Imprimante = ?",opts:["Entree","Sortie","Central","Reseau"],ok:1},
{q:"Modem = ?",opts:["Imprimer","Internet","Ecouter","Scanner"],ok:1},
{q:"Disque dur = ?",opts:["Stocke","Imprime","Affiche","Sonorise"],ok:0}
  ],
  9: [
{q:"Etats matiere ?",opts:["2","3","4","5"],ok:1},
{q:"Liquide = ?",opts:["Fixe","Forme recipient","Invisible","Solide"],ok:1},
{q:"Gaz sont ?",opts:["Visibles","Invisibles","Liquides","Solides"],ok:1},
{q:"Eau = ?",opts:["Solide","Gaz","Liquide","Vapeur"],ok:2},
{q:"Volume gaz ?",opts:["Fixe","Variable","Nul","Enorme"],ok:1},
{q:"Refractaire = ?",opts:["Fond","Ne fond pas","Coule","Brule"],ok:1}
  ],
  10: [
{q:"Combustion vive = ?",opts:["Froid","Chaleur+lumiere","Son","Eau"],ok:1},
{q:"Bois = ?",opts:["Liquide","Solide","Gazeux","Plastique"],ok:1},
{q:"Essence = ?",opts:["Solide","Liquide","Gazeux","Rocher"],ok:1},
{q:"Combustion besoin ?",opts:["Eau","Oxygene","Sable","Froid"],ok:1},
{q:"Sans oxygene ?",opts:["Marche mieux","S'eteint","Froid","Accelere"],ok:1},
{q:"Butane = ?",opts:["Liquide","Solide","Combustible","Naturel"],ok:2}
  ],
  11: [
{q:"Combustion lente ?",opts:["Chaleur/lumiere","Rien","Flamme","Bruit"],ok:1},
{q:"Oxydation = ?",opts:["Vive","Lente","Fusion","Glace"],ok:1},
{q:"Rouille = ?",opts:["Gaz","Oxydation fer","Liquide","Peinture"],ok:1},
{q:"Inoxydable ?",opts:["Fer","Or","Cuivre","Zinc"],ok:1},
{q:"Anti-rouille ?",opts:["Eau","Graisse","Sable","Charbon"],ok:1},
{q:"Rouille poreuse = ?",opts:["Protege","Laisse air passer","Solide","Disparait"],ok:1}
  ],
  12: [
{q:"Solidification ?",opts:["Eau->glace","Glace->eau","Eau->vapeur","Vapeur->eau"],ok:0},
{q:"Fusion ?",opts:["Eau->glace","Glace->eau","Eau->vapeur","Vapeur->eau"],ok:1},
{q:"Evaporation ?",opts:["Eau->glace","Glace->eau","Eau->vapeur","Vapeur->eau"],ok:2},
{q:"Condensation ?",opts:["Eau->glace","Glace->eau","Eau->vapeur","Vapeur->eau"],ok:3},
{q:"Eau bout a ?",opts:["0°","50°","100°","200°"],ok:2},
{q:"Eau gele a ?",opts:["0°","-10°","50°","100°"],ok:0}
  ],
  13: [
{q:"Cycle commence ?",opts:["Pluie","Evaporation","Condensation","Vent"],ok:1},
{q:"Nuages = ?",opts:["Evaporation","Condensation","Solidification","Fusion"],ok:1},
{q:"Eau nuages = ?",opts:["Neige","Pluie","Grele","Tout"],ok:1},
{q:"Eau retourne ?",opts:["Nuages","Mer","Soleil","Nulle part"],ok:1},
{q:"Eau infiltree = ?",opts:["Nuages","Sources","Puits","Mers"],ok:1},
{q:"Cycle = ?",opts:["Fini","Perpetuel","Inutile","Lent"],ok:1}
  ],
  15: [
{q:"Eau = ?",opts:["Solide","Solvant","Gaz","Metal"],ok:1},
{q:"Soluble eau ?",opts:["Sable","Sucre","Huile","Pierre"],ok:1},
{q:"Saturee = ?",opts:["Peut","Ne peut plus","Chaude","Froide"],ok:1},
{q:"Cristaux par ?",opts:["Chauffage","Evaporation","Congelation","Fusion"],ok:1},
{q:"Sel vient ?",opts:["Montagnes","Marais","Rivieres","Usines"],ok:1},
{q:"Soluble = ?",opts:["Pas","Se dissout","Liquide","Gaz"],ok:1}
  ],
  16: [
{q:"Air compose ?",opts:["O2+N2","Eau+sel","Sable","Fer"],ok:0},
{q:"L'air = ?",opts:["Gaz","Liquide","Solide","Metal"],ok:0},
{q:"1L air = ?",opts:["0g","1,3g","10g","100g"],ok:1},
{q:"Vent = ?",opts:["Froid","Air mouv.","Eau","Nuage"],ok:1},
{q:"Atmosphere = ?",opts:["Eau","Air","Soleil","Lune"],ok:1},
{q:"Air permet ?",opts:["Manger","Respirer","Dormir","Courir"],ok:1}
  ],
  17: [
{q:"Pression = ?",opts:["Eau","Air","Vent","Sol"],ok:1},
{q:"Siphon = ?",opts:["Chaleur","Pression","Froid","Elec."],ok:1},
{q:"Baro mesure ?",opts:["Temp.","Pression","Vent","Pluie"],ok:1},
{q:"Barometres ?",opts:["Eau/air","Mercure/metal","Vent/pluie","Gaz"],ok:1},
{q:"Pression sens ?",opts:["Haut","Bas","Tous","Cote"],ok:2},
{q:"Altitude = ?",opts:["Augmente","Diminue","Pareil","Disparait"],ok:1}
  ],
  18: [
{q:"Dilatation = ?",opts:["Volume-","Volume+","Poids","Couleur"],ok:1},
{q:"Contraction = ?",opts:["Volume+","Volume-","Chaud","Rien"],ok:1},
{q:"Thermo mesure ?",opts:["Pression","Temp","Vent","Humidite"],ok:1},
{q:"Thermo contient ?",opts:["Eau","Alcool/mercure","Sable","Air"],ok:1},
{q:"Mercure monte ?",opts:["Froid","Chaud","Humide","Sec"],ok:1},
{q:"Corps dilates ?",opts:["Solides","Liquides","Gaz","Tous"],ok:3}
  ],
  19: [
{q:"Digestion dans ?",opts:["Coeur","Tube dig.","Poumons","Cerveau"],ok:1},
{q:"1er organe ?",opts:["Oesophage","Bouche","Estomac","Intestin"],ok:1},
{q:"Oesophage = ?",opts:["Bouche","Estomac","Intestin","Coeur"],ok:1},
{q:"Estomac ?",opts:["Absorbe eau","Brasse","Mache","Evacue"],ok:1},
{q:"Nutriments ?",opts:["Estomac","Int. grele","Gros int.","Bouche"],ok:1},
{q:"Parties ?",opts:["3","4","5","6"],ok:2}
  ],
  21: [
{q:"Litres sang ?",opts:["2L","3L","5L","10L"],ok:2},
{q:"Plasma = ?",opts:["Liquide clair","Gaz","Solide","Cellule"],ok:0},
{q:"Grande circ ?",opts:["Coeur->poumons","Coeur->organes","Poumons->coeur","Org->poumons"],ok:1},
{q:"Petite circ ?",opts:["Coeur->poumons","Coeur->org.","Poumons->org.","Org->coeur"],ok:0},
{q:"Alcool/tabac ?",opts:["Bon coeur","Mauvais coeur","Sans effet","Bon poumon"],ok:1},
{q:"Sport = ?",opts:["Paresse","Bonne circ.","Maladie","Sommeil"],ok:1}
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
