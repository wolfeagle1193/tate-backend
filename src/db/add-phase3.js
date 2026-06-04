#!/usr/bin/env node
// Ajoute les leçons 16,17,18,19,21 au seed-ist-cm1.js (Phase 3 finale)
const fs=require('fs'),path=require('path');
const p=path.join(__dirname,'seed-ist-cm1.js');
let c=fs.readFileSync(p,'utf8');
const esc=s=>s.replace(/\\/g,'\\\\').replace(/`/g,'\\`');
const H=s=>s.replace(/\n/g,'').replace(/  +/g,' ').trim();
const EX=(q,r,e)=>`{question:"${esc(q)}",reponse:"${esc(r)}",explication:"${esc(e)}"}`;
const QC=(e,opts,ci,expl)=>{
  const c2=String.fromCharCode(65+ci);
  return `{enonce:"${esc(e)}",options:[${opts.map((o,i)=>`{lettre:"${String.fromCharCode(65+i)}",texte:"${esc(o)}"}`)}],reponseCorrecte:"${c2}",explication:"${esc(expl)}"}`;
};
const QZ=(q,opts,ok)=>`{q:"${esc(q)}",opts:[${opts.map(o=>'"'+esc(o)+'"')}],ok:${ok}}`;

// ── HTML ───────────────────────────────────────────────────

const L16=H(`<h1>💨 Leçon 16 : L'Air</h1><div class="bloc-essentiel"><p>L'air est un <mark>gaz invisible</mark> formé d'<strong>oxygène</strong> et d'<strong>azote</strong>, avec un peu de gaz carbonique et de vapeur d'eau.</p></div><h2>🔵 Propriétés</h2><ul><li>Fluide, expansible, compressible, élastique</li><li>Il freine la chute des corps</li><li><strong>Pesant :</strong> 1 litre d'air pèse <mark>1,3 grammes</mark></li></ul><h2>💨 Le Vent</h2><p>Le <strong>vent</strong> est de l'air en mouvement.</p><h2>🌍 L'Atmosphère</h2><p>L'<strong>atmosphère</strong> est l'épaisse couche d'air qui entoure la Terre. Elle permet aux êtres vivants de <mark>respirer</mark> et maintient les oiseaux et les avions dans le ciel.</p><div class="bloc-attention"><strong>📌</strong> L'air est invisible mais il existe partout autour de nous. Sans air, il n'y aurait pas de vie sur Terre.</div><h2>📝 Résumé</h2><ul><li>Air = oxygène + azote + CO2 + vapeur d'eau</li><li>Propriétés : fluide, compressible, élastique</li><li>1L d'air = 1,3g. Vent = air en mouvement.</li></ul>`);

const L17=H(`<h1>📏 Leçon 17 : La Pression Atmosphérique</h1><div class="bloc-essentiel"><p>La <strong>pression atmosphérique</strong> est la <mark>force que l'air exerce</mark> sur tous les corps qu'il entoure. Elle s'exerce dans tous les sens.</p></div><h2>🔄 Applications</h2><p>Fonctionnent grâce à la pression atmosphérique :</p><ul><li>Le <strong>siphon</strong></li><li>La <strong>seringue</strong></li><li>Le <strong>compte-gouttes</strong></li><li>La <strong>pipette</strong></li></ul><h2>📊 Le Baromètre</h2><p>Le <strong>baromètre</strong> permet de mesurer la pression atmosphérique. Il en existe deux types :</p><ul><li>Le <strong>baromètre à mercure</strong></li><li>Le <strong>baromètre métallique</strong></li></ul><div class="bloc-attention"><strong>📌</strong> En montant en altitude, la pression atmosphérique diminue car il y a moins d'air au-dessus de nous.</div><h2>📝 Résumé</h2><ul><li>Pression atmosphérique = force de l'air</li><li>Appareils : siphon, seringue, compte-gouttes, pipette</li><li>Mesure : baromètre (mercure ou métallique)</li></ul>`);

const L18=H(`<h1>🌡️ Leçon 18 : La Dilatation et le Thermomètre</h1><div class="bloc-essentiel"><p>La <strong>dilatation</strong> est l'<mark>augmentation du volume</mark> d'un corps sous l'action de la chaleur. En refroidissant, le corps chauffé reprend sa taille normale : c'est la <strong>contraction</strong>.</p></div><h2>🔬 Quels Corps se Dilatent ?</h2><p>Tous les corps se dilatent et se contractent :</p><ul><li>Les <strong>solides</strong> (ex: rails de train)</li><li>Les <strong>liquides</strong> (ex: mercure du thermomètre)</li><li>Les <strong>gaz</strong> (ex: air chauffé)</li></ul><h2>🌡️ Le Thermomètre</h2><p>Le <strong>thermomètre</strong> permet de mesurer la température. Il est composé d'une <mark>planchette graduée</mark> et d'un <mark>tube en verre</mark> contenant de l'alcool ou du mercure.</p><p>Quand il fait chaud, le mercure <strong>monte</strong> (dilatation). Quand il fait froid, le mercure <strong>descend</strong> (contraction).</p><div class="bloc-attention"><strong>📌</strong> Les rails de chemin de fer ont un espace entre eux pour permettre la dilatation sans déformation.</div><h2>📝 Résumé</h2><ul><li>Dilatation = volume + sous chaleur</li><li>Contraction = retour à la normale au froid</li><li>Tous les corps se dilatent</li><li>Thermomètre = mesure la température (mercure monte/descend)</li></ul>`);

const L19=H(`<h1>🍽️ Leçon 19 : La Digestion</h1><div class="bloc-essentiel"><p>La <strong>digestion</strong> est la <mark>transformation des aliments</mark> dans le tube digestif pour les transformer en nutriments que le corps peut utiliser.</p></div><h2>🔬 L'Appareil Digestif</h2><p>L'appareil digestif de l'homme comprend <strong>5 parties</strong> :</p><ol><li>La <strong>bouche</strong> (mastication)</li><li>L'<strong>œsophage</strong> (descente des aliments)</li><li>L'<strong>estomac</strong> (brassage avec les sucs gastriques)</li><li>L'<strong>intestin grêle</strong> (absorption des nutriments)</li><li>Le <strong>gros intestin</strong> (absorption d'eau, évacuation)</li></ol><p>Les <strong>glandes digestives</strong> produisent des <mark>sucs</mark> qui transforment les aliments en bouillie puis en liquide.</p><h2>✅ Conseils pour Bien Digérer</h2><ul><li><strong>Bien mâcher</strong> les aliments</li><li>Manger des aliments <strong>sains</strong></li><li>À des <strong>heures régulières</strong></li><li><strong>Sans excès</strong></li></ul><div class="bloc-attention"><strong>📌</strong> La digestion commence dans la bouche par la mastication. Bien mâcher facilite le travail de l'estomac.</div><h2>📝 Résumé</h2><ul><li>5 organes : bouche, œsophage, estomac, intestin grêle, gros intestin</li><li>Les sucs digestifs transforment les aliments</li><li>Bien mâcher = bonne digestion</li></ul>`);

const L21=H(`<h1>❤️ Leçon 21 : La Circulation du Sang</h1><div class="bloc-essentiel"><p>Le sang contient du <strong>plasma</strong> (liquide clair), des <mark>globules rouges</mark> (qui donnent la couleur rouge) et des <mark>globules blancs</mark> (qui défendent le corps). Le corps humain contient environ <strong>5 litres</strong> de sang.</p></div><h2>🔄 La Circulation</h2><p>Le sang circule dans deux circuits :</p><ul><li><strong>Grande circulation :</strong> le sang va du cœur vers tous les organes du corps</li><li><strong>Petite circulation :</strong> le sang va du cœur vers les poumons pour prendre de l'oxygène</li></ul><h2>⚠️ Bonnes et Mauvaises Habitudes</h2><ul><li>❌ <strong>L'alcool</strong> et le <strong>tabac</strong> sont mauvais pour le cœur</li><li>✅ Le <strong>sport</strong> favorise la circulation du sang</li></ul><div class="bloc-attention"><strong>📌</strong> Quand on se coupe, le sang coagule et forme un caillot qui arrête le saignement. Le sang coagulé contient un liquide clair (sérum) et une masse rouge brun (caillot).</div><h2>📝 Résumé</h2><ul><li>Sang = plasma + globules rouges + globules blancs (~5L)</li><li>Grande circulation : cœur → organes</li><li>Petite circulation : cœur → poumons</li><li>Alcool et tabac = mauvais. Sport = bon</li></ul>`);

// ── LESSONS ────────────────────────────────────────────────

const lessons=[];

// LEÇON 16
lessons.push(`{ordre:16,titre:"L'Air",objectif:"Connaître la composition et les propriétés de l'air",promptSupplement:"Exemples concrets. CM1.",contenuHTML:\`${L16}\`,exercices:[
  ${EX("De quoi est composé l'air ?","Oxygène + azote + un peu de CO2 et vapeur d'eau.","Mélange de gaz.")},
  ${EX("Cite 3 propriétés de l'air.","Fluide, compressible, élastique.","4 propriétés.")},
  ${EX("Qu'est-ce que le vent ?","De l'air en mouvement.","Déplacement d'air.")},
  ${EX("Combien pèse 1 litre d'air ?","1,3 grammes.","L'air a un poids.")},
  ${EX("Qu'est-ce que l'atmosphère ?","Couche d'air autour de la Terre.","Protège la Terre.")},
  ${EX("À quoi sert l'air pour les êtres vivants ?","À respirer (grâce à l'oxygène).","Vital.")},
  ${EX("Pourquoi les avions volent-ils ?","L'air les maintient en vol (portance).","Propriété de l'air.")},
  ${EX("L'air est-il visible ?","Non, il est invisible.","Gaz transparent.")},
  ${EX("L'air freine-t-il les corps qui tombent ?","Oui, il freine leur chute.","Résistance de l'air.")},
  ${EX("Que devient l'air quand il est chauffé ?","Il se dilate et monte.","Air chaud = léger.")},
],qcm:[
  ${QC("L'air est composé...",["d'oxygène et d'azote","d'eau et de sel","de sable","de fer"],0,"O2 + N2.")},
  ${QC("L'air est...",["un gaz invisible","un liquide","un solide","un métal"],0,"Gaz.")},
  ${QC("1 litre d'air pèse...",["0g","1,3g","10g","100g"],1,"1,3g.")},
  ${QC("Le vent est...",["un gaz froid","de l'air en mouvement","de l'eau","un nuage"],1,"Air qui bouge.")},
  ${QC("L'atmosphère est...",["de l'eau","de l'air","le soleil","la lune"],1,"Air terrestre.")},
  ${QC("L'air permet de...",["manger","respirer","dormir","courir"],1,"Respiration.")},
  ${QC("L'air est...",["pesant (a un poids)","léger (sans poids)","lourd","immobile"],0,"1,3g/L.")},
  ${QC("L'air freine...",["les oiseaux","la chute des corps","le vent","les nuages"],1,"Résistance.")},
  ${QC("L'air est...",["compressible","incompressible","mou","dur"],0,"Se comprime.")},
  ${QC("Où trouve-t-on de l'air ?",["partout","sous l'eau","dans le sol","nulle part"],0,"Partout.")},
]}`);

// LEÇON 17
lessons.push(`{ordre:17,titre:"La Pression Atmosphérique",objectif:"Comprendre la pression atmosphérique et ses applications",promptSupplement:"Siphon, seringue. CM1.",contenuHTML:\`${L17}\`,exercices:[
  ${EX("Qu'est-ce que la pression atmosphérique ?","Force que l'air exerce sur les corps.","S'exerce dans tous les sens.")},
  ${EX("Cite 4 appareils utilisant la pression atmosphérique.","Siphon, seringue, compte-gouttes, pipette.","Fonctionnent par pression.")},
  ${EX("Avec quoi mesure-t-on la pression atmosphérique ?","Avec un baromètre.","Instrument de mesure.")},
  ${EX("Cite 2 types de baromètres.","Baromètre à mercure et baromètre métallique.","2 technologies.")},
  ${EX("Comment fonctionne une seringue ?","Elle aspire le liquide grâce à la pression atmosphérique.","La pression pousse le liquide.")},
  ${EX("Pourquoi l'eau monte-t-elle dans un siphon ?","Grâce à la différence de pression atmosphérique.","Pression.")},
  ${EX("Comment fonctionne un compte-gouttes ?","En relâchant la poire, la pression aspire le liquide.","Pression.")},
  ${EX("Dans quel sens s'exerce la pression atmosphérique ?","Dans tous les sens.","Omnidirectionnelle.")},
  ${EX("Que se passe-t-il quand on monte en altitude ?","La pression atmosphérique diminue.","Moins d'air au-dessus.")},
  ${EX("À quoi sert un baromètre ?","À prévoir le temps et mesurer les changements de pression.","Météo.")},
],qcm:[
  ${QC("Pression atmosphérique = ?",["force de l'eau","force de l'air","force du vent","force du sol"],1,"Force de l'air.")},
  ${QC("Le siphon utilise...",["la chaleur","la pression atmosphérique","le froid","l'électricité"],1,"Pression.")},
  ${QC("Le baromètre mesure...",["la température","la pression","le vent","la pluie"],1,"Pression.")},
  ${QC("Types de baromètres ?",["à eau/air","à mercure/métallique","à vent/pluie","à gaz"],1,"Mercure/métal.")},
  ${QC("La pression s'exerce...",["vers le haut","vers le bas","dans tous les sens","de côté"],2,"Tous sens.")},
  ${QC("En altitude, la pression...",["augmente","diminue","reste pareille","disparaît"],1,"Moins d'air.")},
  ${QC("La seringue utilise...",["la chaleur","la pression","le froid","l'eau"],1,"Pression.")},
  ${QC("Baromètre à mercure contient...",["de l'eau","du mercure","de l'air","du sable"],1,"Mercure.")},
  ${QC("Le compte-gouttes utilise...",["l'électricité","la pression","la chaleur","le vent"],1,"Pression.")},
  ${QC("En haut = air plus...",["dense","rare","lourd","épais"],1,"Rare = moins de pression.")},
]}`);

// LEÇON 18
lessons.push(`{ordre:18,titre:"La Dilatation et le Thermomètre",objectif:"Comprendre la dilatation des corps et le thermomètre",promptSupplement:"Exemples concrets. CM1.",contenuHTML:\`${L18}\`,exercices:[
  ${EX("Qu'est-ce que la dilatation ?","Augmentation du volume d'un corps sous la chaleur.","Se dilate en chauffant.")},
  ${EX("Qu'est-ce que la contraction ?","Retour à la taille normale en refroidissant.","Se contracte au froid.")},
  ${EX("Quels corps se dilatent ?","Solides, liquides et gaz.","Tous les corps.")},
  ${EX("Qu'est-ce qu'un thermomètre ?","Instrument qui mesure la température.","Mesure le chaud/froid.")},
  ${EX("De quoi est composé un thermomètre ?","Planchette graduée + tube en verre avec alcool ou mercure.","2 parties.")},
  ${EX("Que fait le mercure quand il fait chaud ?","Il monte dans le tube.","Dilatation du mercure.")},
  ${EX("Que fait le mercure quand il fait froid ?","Il descend dans le tube.","Contraction du mercure.")},
  ${EX("Cite 2 types de thermomètres.","Thermomètre médical, thermomètre d'ambiance.","Usages différents.")},
  ${EX("Pourquoi le mercure monte-t-il quand il fait chaud ?","Parce qu'il se dilate sous la chaleur.","Dilatation.")},
  ${EX("Pourquoi les rails ont-ils un espace entre eux ?","Pour permettre la dilatation sans déformation.","Évite les accidents.")},
],qcm:[
  ${QC("Dilatation = ?",["volume diminue","volume augmente","poids change","couleur change"],1,"Volume +.")},
  ${QC("Contraction = ?",["volume augmente","volume diminue","chaud","rien"],1,"Volume -.")},
  ${QC("Le thermomètre mesure...",["la pression","la température","le vent","l'humidité"],1,"Température.")},
  ${QC("Le thermomètre contient...",["de l'eau","de l'alcool ou mercure","du sable","de l'air"],1,"Alcool/mercure.")},
  ${QC("Mercure monte = ?",["froid","chaud","humide","sec"],1,"Chaud.")},
  ${QC("Quels corps se dilatent ?",["solides","liquides","gaz","tous"],3,"Tous.")},
  ${QC("Refroidir un corps = ?",["dilatation","contraction","rien","fusion"],1,"Contraction.")},
  ${QC("Chauffer = ?",["dilate","contracte","rien","fond"],0,"Dilate.")},
  ${QC("Espace rail = ?",["dilatation","poids","couleur","bruit"],0,"Dilatation.")},
  ${QC("Tous les corps...",["se dilatent","ne se dilatent pas","sont solides","sont gazeux"],0,"Se dilatent.")},
]}`);

// LEÇON 19
lessons.push(`{ordre:19,titre:"La Digestion",objectif:"Connaître l'appareil digestif et les étapes de la digestion",promptSupplement:"Alimentation. CM1.",contenuHTML:\`${L19}\`,exercices:[
  ${EX("Qu'est-ce que la digestion ?","Transformation des aliments dans le tube digestif.","Processus de transformation.")},
  ${EX("Cite les 5 parties de l'appareil digestif.","Bouche, œsophage, estomac, intestin grêle, gros intestin.","5 organes.")},
  ${EX("Rôle de la bouche ?","Mâcher et broyer les aliments (mastication).","1ère étape.")},
  ${EX("Rôle de l'œsophage ?","Conduire les aliments vers l'estomac.","Tube de descente.")},
  ${EX("Rôle de l'estomac ?","Brasser les aliments avec les sucs gastriques.","Mixage.")},
  ${EX("Rôle de l'intestin grêle ?","Absorber les nutriments dans le sang.","Nourriture.")},
  ${EX("Rôle du gros intestin ?","Absorber l'eau et évacuer les déchets.","Dernière étape.")},
  ${EX("Que produisent les glandes digestives ?","Des sucs qui transforment les aliments.","Sucs digestifs.")},
  ${EX("Comment bien digérer ?","Bien mâcher, manger sain, heures régulières, sans excès.","4 conseils.")},
  ${EX("Pourquoi bien mâcher ?","Pour faciliter le travail de l'estomac.","Prédigestion.")},
],qcm:[
  ${QC("La digestion se fait...",["dans le cœur","dans le tube digestif","dans les poumons","dans le cerveau"],1,"Tube digestif.")},
  ${QC("Premier organe digestif ?",["Œsophage","Bouche","Estomac","Intestin"],1,"Bouche.")},
  ${QC("L'œsophage conduit à...",["la bouche","l'estomac","l'intestin","le cœur"],1,"Estomac.")},
  ${QC("L'estomac...",["absorbe l'eau","brasse les aliments","mâche","évacue"],1,"Brassage.")},
  ${QC("Les nutriments sont absorbés dans...",["l'estomac","l'intestin grêle","le gros intestin","la bouche"],1,"Intestin grêle.")},
  ${QC("L'eau est absorbée dans...",["l'estomac","l'intestin grêle","le gros intestin","la bouche"],2,"Gros intestin.")},
  ${QC("Les glandes produisent...",["du sang","des sucs","de l'air","des os"],1,"Sucs.")},
  ${QC("Parties digestives ?",["3","4","5","6"],2,"5.")},
  ${QC("Bien mâcher est un...",["conseil","exercice","jeu","obligation"],0,"Conseil.")},
  ${QC("L'alcool est mauvais pour...",["la digestion","la vue","l'ouïe","la peau"],0,"Digestion.")},
]}`);

// LEÇON 21
lessons.push(`{ordre:21,titre:"La Circulation du Sang",objectif:"Comprendre la composition du sang et la circulation sanguine",promptSupplement:"Explications simples. CM1.",contenuHTML:\`${L21}\`,exercices:[
  ${EX("Que contient le sang ?","Plasma, globules rouges et globules blancs.","3 composants.")},
  ${EX("Combien de litres de sang dans le corps ?","Environ 5 litres.","Quantité moyenne.")},
  ${EX("Qu'est-ce que la grande circulation ?","Le sang va du cœur vers tous les organes.","Cœur → organes.")},
  ${EX("Qu'est-ce que la petite circulation ?","Le sang va du cœur vers les poumons.","Cœur → poumons.")},
  ${EX("Rôle des globules rouges ?","Donner la couleur rouge au sang.","Couleur.")},
  ${EX("Rôle des globules blancs ?","Défendre le corps contre les microbes.","Immunité.")},
  ${EX("Qu'est-ce que le plasma ?","Le liquide clair du sang.","Partie liquide.")},
  ${EX("Qu'est-ce qu'un caillot ?","Du sang coagulé qui arrête les saignements.","Coagulation.")},
  ${EX("Qu'est-ce qui est mauvais pour le cœur ?","L'alcool et le tabac.","Nuisibles.")},
  ${EX("Qu'est-ce qui favorise la circulation ?","Le sport.","Activation du sang.")},
],qcm:[
  ${QC("Litres de sang ?",["2L","3L","5L","10L"],2,"5L.")},
  ${QC("Le plasma est...",["un liquide clair","un gaz","un solide","une cellule"],0,"Liquide.")},
  ${QC("Grande circ = ?",["cœur→poumons","cœur→organes","poumons→cœur","organes→poumons"],1,"→ organes.")},
  ${QC("Petite circ = ?",["cœur→poumons","cœur→organes","poumons→organes","organes→cœur"],0,"→ poumons.")},
  ${QC("Alcool/tabac = ?",["bon cœur","mauvais cœur","sans effet","bon poumon"],1,"Mauvais.")},
  ${QC("Sport = ?",["paresse","bonne circulation","maladie","sommeil"],1,"Bonne circ.")},
  ${QC("Caillot = ?",["liquide","coagulé","gazeux","transparent"],1,"Coagulé.")},
  ${QC("Globules blancs = ?",["couleur","défense","transport","chaleur"],1,"Défense.")},
  ${QC("Globules rouges = ?",["défense","couleur rouge","coagulation","oxygène"],1,"Couleur.")},
  ${QC("Tabac = ?",["bon","mauvais","sans effet","bon poumon"],1,"Mauvais.")},
]}`);

// ── INSERT ──
const qi=c.indexOf('const QUIZ_DATA = {');
const bfr=c.substring(0,qi);
const aft=c.substring(qi);
const lc=bfr.lastIndexOf('];');
const part1=c.substring(0,lc);
const part2=c.substring(lc+2);
c=part1+',\n'+lessons.join(',\n')+'\n];\n'+aft;

// ── QUIZZES ──
const q16=[
  QZ("Air composé ?",["Oxygène+azote","Eau+sel","Sable","Fer"],0),
  QZ("L'air = ?",["Gaz","Liquide","Solide","Métal"],0),
  QZ("1L air = ?",["0g","1,3g","10g","100g"],1),
  QZ("Vent = ?",["Froid","Air mouv.","Eau","Nuage"],1),
  QZ("Atmosphère = ?",["Eau","Air","Soleil","Lune"],1),
  QZ("Air permet ?",["Manger","Respirer","Dormir","Courir"],1),
];
const q17=[
  QZ("Pression = ?",["Eau","Air","Vent","Sol"],1),
  QZ("Siphon utilise ?",["Chaleur","Pression","Froid","Électricité"],1),
  QZ("Baro mesure ?",["Température","Pression","Vent","Pluie"],1),
  QZ("Baromètres ?",["Eau/air","Mercure/métal","Vent/pluie","Gaz"],1),
  QZ("Pression sens ?",["Haut","Bas","Tous","Côté"],2),
  QZ("Altitude = ?",["Augmente","Diminue","Pareil","Disparaît"],1),
];
const q18=[
  QZ("Dilatation = ?",["Volume-","Volume+","Poids","Couleur"],1),
  QZ("Contraction = ?",["Volume+","Volume-","Chaud","Rien"],1),
  QZ("Thermo = ?",["Pression","Température","Vent","Humidité"],1),
  QZ("Thermo contient ?",["Eau","Alcool/mercure","Sable","Air"],1),
  QZ("Mercure monte = ?",["Froid","Chaud","Humide","Sec"],1),
  QZ("Corps dilatés ?",["Solides","Liquides","Gaz","Tous"],3),
];
const q19=[
  QZ("Digestion dans ?",["Cœur","Tube digestif","Poumons","Cerveau"],1),
  QZ("1er organe ?",["Œsophage","Bouche","Estomac","Intestin"],1),
  QZ("Œsophage = ?",["Bouche","Estomac","Intestin","Cœur"],1),
  QZ("Estomac ?",["Absorbe eau","Brasse","Mâche","Évacue"],1),
  QZ("Nutriments dans ?",["Estomac","Intestin grêle","Gros intestin","Bouche"],1),
  QZ("Parties ?",["3","4","5","6"],2),
];
const q21=[
  QZ("Litres sang ?",["2L","3L","5L","10L"],2),
  QZ("Plasma = ?",["Liquide clair","Gaz","Solide","Cellule"],0),
  QZ("Grande circ = ?",["Cœur→poum.","Cœur→org.","Poum.→cœur","Org.→poum."],1),
  QZ("Petite circ = ?",["Cœur→poum.","Cœur→org.","Poum.→org.","Org.→cœur"],0),
  QZ("Alcool = ?",["Cœur","Os","Cheveux","Peau"],0),
  QZ("Sport = ?",["Paresse","Circulation","Maladie","Sommeil"],1),
];

const after=c.indexOf('};\n\n// GÉNÉRATEURS');
const newQ=`\n  16: [\n${q16.join(',\n')}\n  ],\n  17: [\n${q17.join(',\n')}\n  ],\n  18: [\n${q18.join(',\n')}\n  ],\n  19: [\n${q19.join(',\n')}\n  ],\n  21: [\n${q21.join(',\n')}\n  ],`;
c=c.substring(0,after)+newQ+c.substring(after);

fs.writeFileSync(p,c,'utf8');

const{execSync}=require('child_process');
try{
  execSync('node --check "'+p+'"',{stdio:'pipe'});
  const ords=[...c.matchAll(/ordre:(\d+)/g)].map(m=>m[1]);
  console.log('✅ Phase 3 ajoutée ! Total leçons :',ords.join(', '));
}catch(e){
  console.error('❌ Erreur :',e.stderr.toString().substring(0,200));
}
