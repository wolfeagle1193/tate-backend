#!/usr/bin/env node
// Ajoute les leçons 11,12,13,15 au seed-ist-cm1.js
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

// HTML
const L11=H(`<h1>🟤 Leçon 11 : Les Combustions Lentes</h1><div class="bloc-essentiel"><p>Une <strong>combustion lente</strong> ne dégage ni chaleur ni lumière. L'action de l'oxygène sur les métaux = <mark>oxydation</mark>.</p></div><h2>🟤 La Rouille</h2><p>La <strong>rouille</strong> du fer est une oxydation. Elle est <mark>poreuse</mark>. Métaux qui s'oxydent en surface : cuivre, plomb, zinc, aluminium. Inoxydables : or, argent, nickel, chrome.</p><h2>🛡️ Éviter la Rouille</h2><p>Recouvrir le fer de : graisse, peinture à huile, minium, métal inoxydable.</p><div class="bloc-attention"><strong>⚠️</strong> La rouille fragilise le fer en profondeur. Protéger le fer évite la casse.</div><h2>📝 Résumé</h2><ul><li>Combustion lente = oxydation (ni chaleur ni lumière)</li><li>Rouille = oxydation du fer, poreuse</li><li>Protection : graisse, peinture, minium</li></ul>`);
const L12=H(`<h1>💧 Leçon 12 : Les États de l'Eau</h1><div class="bloc-essentiel"><p>L'eau existe sous <strong>trois états</strong> : <mark>liquide</mark>, <mark>solide (glace)</mark>, <mark>gazeux (vapeur)</mark>.</p></div><h2>❄️ Solidification</h2><p>Eau refroidie à <strong>0°C</strong> → glace.</p><h2>☀️ Fusion</h2><p>Glace réchauffée → eau liquide.</p><h2>💨 Évaporation</h2><p>Eau chauffée → vapeur. Eau bout à <strong>100°C</strong>.</p><h2>💧 Condensation</h2><p>Vapeur refroidie → eau liquide (ex: buée).</p><div class="bloc-attention"><strong>📌</strong> Eau bout à 100°C, gèle à 0°C. La vapeur est invisible.</div><h2>📝 Résumé</h2><ul><li>Solidification : eau→glace (0°C)</li><li>Fusion : glace→eau</li><li>Évaporation : eau→vapeur (100°C)</li><li>Condensation : vapeur→eau</li></ul>`);
const L13=H(`<h1>🌊 Leçon 13 : Le Cycle de l'Eau</h1><div class="bloc-essentiel"><p>Le <strong>cycle de l'eau</strong> est le mouvement perpétuel de l'eau entre la Terre et l'atmosphère.</p></div><h2>📋 4 Étapes</h2><ol><li><mark>Évaporation</mark> : soleil chauffe l'eau des mers → vapeur</li><li><mark>Condensation</mark> : vapeur refroidie → nuages</li><li><mark>Précipitation</mark> : nuages → pluie</li><li><mark>Ruisselement</mark> : eau retourne à la mer</li></ol><div class="bloc-attention"><strong>🌍</strong> Le cycle de l'eau est essentiel à la vie. L'eau ne se perd jamais.</div><h2>📝 Résumé</h2><ul><li>Évaporation → Condensation → Précipitation → Retour à la mer</li></ul>`);
const L15=H(`<h1>💧 Leçon 15 : L'Eau est un Solvant</h1><div class="bloc-essentiel"><p>L'eau est un <mark>solvant</mark> : elle dissout certains corps (sucre, sel = <mark>solubles</mark>).</p></div><h2>🧪 Solution et Saturation</h2><p>Sucre/self + eau → <strong>solution</strong>. Quand l'eau ne peut plus dissoudre → <strong>solution saturée</strong>.</p><h2>🔬 Cristaux</h2><p>Par évaporation de l'eau sucrée → cristaux de sucre. Sel de table = évaporation dans les <strong>marais salants</strong>.</p><div class="bloc-attention"><strong>📌</strong> Solvant = liquide qui dissout. Soluble = corps qui se dissout.</div><h2>📝 Résumé</h2><ul><li>Eau = solvant (dissout sucre et sel)</li><li>Solution saturée = ne peut plus dissoudre</li><li>Sel des marais salants (évaporation)</li></ul>`);

const lessons=[];

lessons.push(`{ordre:11,titre:"Les Combustions Lentes",objectif:"Comprendre l'oxydation et la rouille",promptSupplement:"Exemples concrets. CM1.",contenuHTML:\`${L11}\`,exercices:[
  ${EX("Qu'est-ce qu'une combustion lente ?","Ne dégage ni chaleur ni lumière. Ex: oxydation.","Invisible, contrairement à la flamme.")},
  ${EX("Qu'est-ce que l'oxydation ?","Action de l'oxygène sur les métaux.","C'est une combustion lente.")},
  ${EX("Qu'est-ce que la rouille ?","Oxydation du fer, poreuse.","Attaque le fer en profondeur.")},
  ${EX("Cite 2 métaux inoxydables.","Or, argent, nickel, chrome.","Ne rouillent jamais.")},
  ${EX("Comment protéger le fer de la rouille ?","Graisse, peinture, minium, métal inoxydable.","Empêchent l'oxygène d'atteindre le fer.")},
  ${EX("Cuivre et zinc s'oxydent comment ?","En surface seulement.","Forme une couche protectrice.")},
  ${EX("Pourquoi la rouille est poreuse ?","L'oxygène traverse et attaque en profondeur.","Le fer rouille de l'intérieur.")},
  ${EX("Qu'est-ce que le minium ?","Peinture anti-rouille.","Protège le fer.")},
  ${EX("Différence combustion vive/lente ?","Vive = chaleur+lumière. Lente = rien de visible.","Ex: flamme vs rouille.")},
  ${EX("3 moyens anti-rouille ?","Graisser, peindre, recouvrir de métal.","Couper l'air du fer.")},
],qcm:[
  ${QC("Une combustion lente...",["dégage chaleur et lumière","ne dégage rien de visible","produit du CO2","nécessite une flamme"],1,"Invisible.")},
  ${QC("L'oxydation est une...",["combustion vive","combustion lente","fusion","évaporation"],1,"Lente.")},
  ${QC("La rouille est...",["l'oxydation du fer","un gaz","un liquide","une peinture"],0,"Oxydation.")},
  ${QC("Métal inoxydable ?",["Fer","Or","Cuivre","Zinc"],1,"Or.")},
  ${QC("Anti-rouille :",["Eau","Graisse","Sable","Charbon"],1,"Graisse.")},
  ${QC("La rouille est...",["étanche","poreuse","lisse","brillante"],1,"Poreuse.")},
  ${QC("Cuivre s'oxyde...",["en profondeur","en surface","pas du tout","vite"],1,"Surface.")},
  ${QC("L'argent est...",["rouillé","inoxydable","poreux","liquide"],1,"Inoxydable.")},
  ${QC("Minium = ?",["Gaz","Peinture","Métal","Acide"],1,"Peinture.")},
  ${QC("Combustion vive = ?",["visible","invisible","lente","froide"],0,"Visible.")},
]}`);

lessons.push(`{ordre:12,titre:"Les États de l'Eau",objectif:"Connaître les changements d'état de l'eau",promptSupplement:"Exemples concrets. CM1.",contenuHTML:\`${L12}\`,exercices:[
  ${EX("3 états de l'eau ?","Liquide, solide (glace), gazeux (vapeur).","3 états.")},
  ${EX("Solidification ?","Eau liquide → glace à 0°C.","Refroidissement.")},
  ${EX("Fusion ?","Glace → eau liquide.","Réchauffement.")},
  ${EX("Évaporation ?","Eau → vapeur.","Chauffage, 100°C.")},
  ${EX("Condensation ?","Vapeur → eau liquide.","Ex: buée.")},
  ${EX("Eau bout à ?","100°C.","Ébullition.")},
  ${EX("Eau gèle à ?","0°C.","Solidification.")},
  ${EX("Vapeur d'eau visible ?","Non, invisible.","Transparente.")},
  ${EX("Où va l'eau évaporée ?","Dans l'atmosphère.","Vapeur dans l'air.")},
  ${EX("Exemple condensation ?","Buée sur vitre froide.","Vapeur → gouttes.")},
],qcm:[
  ${QC("Solidification = ?",["liquide→solide","solide→liquide","liquide→gaz","gaz→liquide"],0,"Eau→glace.")},
  ${QC("Fusion = ?",["liquide→solide","solide→liquide","liquide→gaz","gaz→liquide"],1,"Glace→eau.")},
  ${QC("Évaporation = ?",["liquide→solide","solide→liquide","liquide→gaz","gaz→liquide"],2,"Eau→vapeur.")},
  ${QC("Condensation = ?",["liquide→solide","solide→liquide","liquide→gaz","gaz→liquide"],3,"Vapeur→eau.")},
  ${QC("Eau bout à ?",["0°C","50°C","100°C","200°C"],2,"100°C.")},
  ${QC("Eau gèle à ?",["0°C","-10°C","50°C","100°C"],0,"0°C.")},
  ${QC("Vapeur d'eau est...",["visible","invisible","solide","liquide"],1,"Invisible.")},
  ${QC("Buée = ?",["solidification","fusion","évaporation","condensation"],3,"Condensation.")},
  ${QC("Chauffer eau = ?",["gèle","s'évapore","fond","durcit"],1,"Évaporation.")},
  ${QC("Glace fond à...",["-10°C","0°C","50°C","100°C"],1,"0°C.")},
]}`);

lessons.push(`{ordre:13,titre:"Le Cycle de l'Eau",objectif:"Comprendre le cycle de l'eau",promptSupplement:"Exemples au Sénégal. CM1.",contenuHTML:\`${L13}\`,exercices:[
  ${EX("Cycle de l'eau ?","Mouvement perpétuel eau Terre/atmosphère.","L'eau se recycle.")},
  ${EX("4 étapes ?","Évaporation, condensation, précipitation, ruissellement.","Étapes clés.")},
  ${EX("Que fait l'eau des mers au soleil ?","Elle s'évapore.","Vapeur.")},
  ${EX("Où va la vapeur ?","Atmosphère → nuages.","Condensation.")},
  ${EX("Formation des nuages ?","Condensation de la vapeur.","Gouttelettes.")},
  ${EX("Les nuages donnent ?","La pluie.","Précipitation.")},
  ${EX("Où va l'eau de pluie ?","Infiltration ou ruissellement vers la mer.","Retour.")},
  ${EX("Pourquoi important ?","Renouvelle l'eau douce.","Essentiel.")},
  ${EX("Eau infiltrée ressort ?","Par les sources.","Souterraine.")},
  ${EX("Cycle a une fin ?","Non, perpétuel.","Recommence sans cesse.")},
],qcm:[
  ${QC("Cycle commence par ?",["Pluie","Évaporation","Condensation","Vent"],1,"Évaporation.")},
  ${QC("Nuages par ?",["Évaporation","Condensation","Solidification","Fusion"],1,"Condensation.")},
  ${QC("Eau nuages = ?",["Neige","Pluie","Grêle","Tout"],1,"Pluie.")},
  ${QC("Eau retourne ?",["Nuages","Mer","Soleil","Nulle part"],1,"Mer.")},
  ${QC("Eau infiltrée = ?",["Nuages","Sources","Puits","Mers"],1,"Sources.")},
  ${QC("Cycle est...",["Fini","Perpétuel","Inutile","Lent"],1,"Perpétuel.")},
  ${QC("Sans soleil ?",["S'accélère","S'arrête","Continue","Ralentit"],1,"Arrêt.")},
  ${QC("Évaporation = ?",["Eau→glace","Eau→vapeur","Pluie","Nuages"],1,"Vapeur.")},
  ${QC("Condensation = ?",["Glace","Eau liquide","Pluie","Vent"],1,"Eau.")},
  ${QC("Combien étapes ?",["2","3","4","5"],2,"4.")},
]}`);

lessons.push(`{ordre:15,titre:"L'Eau est un Solvant",objectif:"Comprendre le pouvoir dissolvant de l'eau",promptSupplement:"Sucre, sel. CM1.",contenuHTML:\`${L15}\`,exercices:[
  ${EX("Solvant ?","Liquide qui dissout.","Ex: eau.")},
  ${EX("Corps soluble ?","Se dissout dans un liquide.","Ex: sucre.")},
  ${EX("Sucre + eau = ?","Solution sucrée.","Invisible mais présent.")},
  ${EX("Solution saturée ?","Eau ne peut plus dissoudre.","Limite atteinte.")},
  ${EX("Cristaux de sucre ?","Par évaporation de l'eau sucrée.","L'eau s'en va.")},
  ${EX("Sel de table ?","Des marais salants par évaporation.","Eau de mer.")},
  ${EX("L'eau dissout-elle tout ?","Non, seulement certains corps.","Pas le sable.")},
  ${EX("Pourquoi eau = bon solvant ?","Dissout beaucoup de corps.","Sucre, sel, café.")},
  ${EX("Où est le sucre dissous ?","Dans l'eau, invisible.","En solution.")},
  ${EX("Différence solvant/soluble ?","Solvant = liquide qui dissout. Soluble = ce qui est dissous.","Eau (solvant) dissout sucre (soluble).")},
],qcm:[
  ${QC("L'eau est un...",["solide","solvant","gaz","métal"],1,"Liquide qui dissout.")},
  ${QC("Soluble dans eau ?",["Sable","Sucre","Huile","Pierre"],1,"Sucre.")},
  ${QC("Saturée = ?",["Peut encore","Ne peut plus","Très chaude","Très froide"],1,"Limite.")},
  ${QC("Cristaux par ?",["Chauffage direct","Évaporation","Congélation","Friture"],1,"Évaporation.")},
  ${QC("Sel vient ?",["Montagnes","Marais salants","Rivières","Volcans"],1,"Marais.")},
  ${QC("Soluble = ?",["Ne se dissout pas","Peut se dissoudre","Solide","Gaz"],1,"Se dissout.")},
  ${QC("Solvant = ?",["Ce qui est dissous","Liquide qui dissout","Gaz","Solide"],1,"Dissout.")},
  ${QC("Sucre+eau = ?",["Solution sucrée","Salée","Huileuse","Pâte"],0,"Sucrée.")},
  ${QC("Sucre et sel = ?",["Solvants","Solubles","Insolubles","Gaz"],1,"Solubles.")},
  ${QC("Eau dissout...",["Tout","Certains corps","Rien","Les gaz"],1,"Certains.")},
]}`);

// Insert lessons into file
const qi=c.indexOf('const QUIZ_DATA = {');
const bfr=c.substring(0,qi);
const aft=c.substring(qi);
const lc=bfr.lastIndexOf('];');
const part1=c.substring(0,lc);
const part2=c.substring(lc+2);
c=part1+',\n'+lessons.join(',\n')+'\n];\n'+aft;

// Add quizzes
const qs=c.indexOf('const QUIZ_DATA = {');
const qe=c.indexOf('};',qs);
const before=c.substring(0,qe+1);
const after=c.substring(qe+1);

const q11=[
  QZ("Combustion lente ?",["Chaleur/lumière","Rien","Flamme","Bruit"],1),
  QZ("Oxydation = ?",["Vive","Lente","Fusion","Glace"],1),
  QZ("Rouille = ?",["Gaz","Oxydation fer","Liquide","Peinture"],1),
  QZ("Métal inoxydable ?",["Fer","Or","Cuivre","Zinc"],1),
  QZ("Anti-rouille ?",["Eau","Graisse","Sable","Charbon"],1),
  QZ("Rouille = ?",["Étanche","Poreuse","Lisse","Brillante"],1),
];
const q12=[
  QZ("Solidification ?",["Eau→glace","Glace→eau","Eau→vapeur","Vapeur→eau"],0),
  QZ("Fusion ?",["Eau→glace","Glace→eau","Eau→vapeur","Vapeur→eau"],1),
  QZ("Évaporation ?",["Eau→glace","Glace→eau","Eau→vapeur","Vapeur→eau"],2),
  QZ("Condensation ?",["Eau→glace","Glace→eau","Eau→vapeur","Vapeur→eau"],3),
  QZ("Eau bout à ?",["0°","50°","100°","200°"],2),
  QZ("Eau gèle à ?",["0°","-10°","50°","100°"],0),
];
const q13=[
  QZ("Cycle commence ?",["Pluie","Évaporation","Condensation","Vent"],1),
  QZ("Nuages = ?",["Évaporation","Condensation","Solidification","Fusion"],1),
  QZ("Eau nuages = ?",["Neige","Pluie","Grêle","Tout"],1),
  QZ("Eau retourne ?",["Nuages","Mer","Soleil","Nulle part"],1),
  QZ("Eau infiltrée = ?",["Nuages","Sources","Puits","Mers"],1),
  QZ("Cycle = ?",["Fini","Perpétuel","Inutile","Lent"],1),
];
const q15=[
  QZ("Eau = ?",["Solide","Solvant","Gaz","Métal"],1),
  QZ("Soluble eau ?",["Sable","Sucre","Huile","Pierre"],1),
  QZ("Saturée = ?",["Peut","Ne peut plus","Chaude","Froide"],1),
  QZ("Cristaux par ?",["Chauffage","Évaporation","Congélation","Fusion"],1),
  QZ("Sel vient ?",["Montagnes","Marais","Rivières","Usines"],1),
  QZ("Soluble = ?",["Pas","Se dissout","Gaz","Solide"],1),
];

const newQuizzes=`  11: [\n${q11.join(',\n')}\n  ],\n  12: [\n${q12.join(',\n')}\n  ],\n  13: [\n${q13.join(',\n')}\n  ],\n  15: [\n${q15.join(',\n')}\n  ],\n`;

c=before+'\n'+newQuizzes+after;

fs.writeFileSync(p,c,'utf8');

const{execSync}=require('child_process');
try{
  execSync('node --check "'+p+'"',{stdio:'pipe'});
  const ords=[...c.matchAll(/ordre:(\d+)/g)].map(m=>m[1]);
  console.log('✅ Phase 2 ajoutée ! Leçons :',ords.join(', '));
}catch(e){
  console.error('❌',e.stderr.toString().substring(0,200));
}
