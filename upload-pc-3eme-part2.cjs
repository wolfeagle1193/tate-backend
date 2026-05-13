// upload-pc-3eme-part2.cjs — PC 3ème : leçons L07-L11 (Transformation énergie + Chimie) + QCMs
'use strict';
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0';

const matiereSchema  = new mongoose.Schema({ nom:String, code:String, niveaux:[String], icone:String, couleur:String, ordre:Number, actif:{type:Boolean,default:true}, estLangue:{type:Boolean,default:false} },{timestamps:true});
const chapitreSchema = new mongoose.Schema({ matiereId:{type:mongoose.Schema.Types.ObjectId}, titre:String, niveau:String, objectif:String, ordre:{type:Number,default:0}, actif:{type:Boolean,default:true}, sectionFr:{type:String,default:null}, promptSupplement:{type:String,default:''}, formatExercices:{type:String,default:''}, prerequis:{type:mongoose.Schema.Types.ObjectId,default:null}, ficheMemo:{pointsACretenir:[String],questionsReponses:[{question:String,reponse:String}],genereAt:{type:Date,default:null},genereParIA:{type:Boolean,default:false}}, documentsRef:[] },{timestamps:true});
const leconSchema    = new mongoose.Schema({ chapitreId:{type:mongoose.Schema.Types.ObjectId}, titre:String, contenuBrut:{type:String,default:''}, contenuHTML:{type:String,default:''}, contenuStructure:{type:[],default:[]}, contenuFormate:{type:mongoose.Schema.Types.Mixed,default:{}}, statut:{type:String,default:'publie'}, masque:{type:Boolean,default:false}, creePar:{type:mongoose.Schema.Types.ObjectId}, valideePar:{type:mongoose.Schema.Types.ObjectId,default:null}, valideeAt:{type:Date,default:null} },{timestamps:true});
const qcmSchema      = new mongoose.Schema({ chapitreId:{type:mongoose.Schema.Types.ObjectId}, leconId:{type:mongoose.Schema.Types.ObjectId,default:null}, titre:String, questions:[{enonce:String,options:[{lettre:String,texte:String}],reponseCorrecte:String,explication:{type:String,default:''}}], statut:{type:String,default:'publie'}, creePar:{type:mongoose.Schema.Types.ObjectId}, valideePar:{type:mongoose.Schema.Types.ObjectId,default:null}, valideeAt:{type:Date,default:null} },{timestamps:true});

const Matiere  = mongoose.models.Matiere  || mongoose.model('Matiere',  matiereSchema);
const Chapitre = mongoose.models.Chapitre || mongoose.model('Chapitre', chapitreSchema);
const Lecon    = mongoose.models.Lecon    || mongoose.model('Lecon',    leconSchema);
const Qcm      = mongoose.models.Qcm     || mongoose.model('Qcm',      qcmSchema);

function wrapHTML(titre, corps) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titre}</title>
<style>
  body{font-family:'Segoe UI',Arial,sans-serif;max-width:820px;margin:0 auto;padding:16px 20px;color:#1a1a2e;background:#fff;font-size:15px;line-height:1.7}
  h1{color:#EA580C;font-size:1.45rem;border-bottom:3px solid #F97316;padding-bottom:8px;margin-bottom:18px}
  h2{color:#C2410C;font-size:1.1rem;margin-top:24px;margin-bottom:8px;border-left:4px solid #F97316;padding-left:10px}
  h3{color:#9A3412;font-size:1rem;margin-top:18px}
  .objectif{background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;padding:12px 16px;margin-bottom:18px;font-style:italic;color:#7C2D12}
  .definition{background:#EFF6FF;border-left:4px solid #3B82F6;padding:10px 14px;margin:12px 0;border-radius:0 8px 8px 0}
  .formule{background:#F0FDF4;border:2px solid #22C55E;border-radius:10px;padding:12px 16px;margin:12px 0;text-align:center;font-size:1.05rem;font-weight:bold;color:#14532D}
  .important{background:#FEF3C7;border-left:4px solid #F59E0B;padding:10px 14px;margin:12px 0;border-radius:0 8px 8px 0}
  .attention{background:#FEE2E2;border-left:4px solid #EF4444;padding:10px 14px;margin:12px 0;border-radius:0 8px 8px 0}
  .astuce{background:#F0FDF4;border-left:4px solid #10B981;padding:10px 14px;margin:12px 0;border-radius:0 8px 8px 0}
  table{width:100%;border-collapse:collapse;margin:14px 0;font-size:14px}
  th{background:#F97316;color:#fff;padding:8px 10px;text-align:left}
  td{padding:7px 10px;border-bottom:1px solid #E5E7EB}
  tr:nth-child(even){background:#FFF7ED}
  .exemple{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:12px;margin:10px 0}
  ul,ol{margin:8px 0;padding-left:22px} li{margin:4px 0}
  sup,sub{font-size:0.8em}
  .chimie-badge{display:inline-block;background:#7C3AED;color:#fff;padding:2px 10px;border-radius:20px;font-size:0.8rem;margin-bottom:8px}
</style></head><body>
<h1>${titre}</h1>
${corps}
</body></html>`;
}

// ── QCM HTML helpers ───────────────────────────────────────────────────────
function buildQCM(qcm) {
  const questionsHTML = qcm.questions.map((q, i) => {
    const num = i + 1;
    const optionsHTML = q.options.map(o =>
      `    <label><input type="radio" name="q${num}" value="${o.lettre}" data-correct="${o.lettre === q.reponseCorrecte}"> ${o.lettre}. ${o.texte}</label>`
    ).join('\n');
    return `  <div class="question">
    <p><strong>${num}. ${q.enonce}</strong></p>
${optionsHTML}
  </div>`;
  }).join('\n');
  return `<hr style="margin:32px 0;border:none;border-top:2px dashed #FDE68A;">
<h2>${qcm.titre}</h2>
<p style="color:#7C2D12;font-size:0.9rem;font-style:italic;margin-bottom:18px;">Coche la bonne réponse. Une seule réponse correcte par question.</p>
${questionsHTML}
`;
}
function injectQCM(fullHTML, qcm) {
  return fullHTML.replace('</body></html>', buildQCM(qcm) + '</body></html>');
}

// ─── L07 : Transformation d'énergie électrique ───────────────────────────
const L07_HTML = wrapHTML('Transformation d\'énergie électrique', `
<div class="objectif">🎯 Objectif : Calculer l'énergie et la puissance électrique, comprendre l'effet Joule et calculer un rendement.</div>

<h2>I. Énergie électrique</h2>
<div class="definition">L'<strong>énergie électrique E</strong> est l'énergie fournie ou consommée par un appareil électrique pendant une durée t.</div>
<div class="formule">E = U × I × t = P × t</div>
<p>Avec : U en volts (V), I en ampères (A), t en secondes (s) → E en joules (J)</p>
<div class="exemple">
  <strong>Exemple :</strong> Un fer à repasser (U = 220 V, I = 5 A) utilisé pendant t = 30 min = 1 800 s :<br>
  E = 220 × 5 × 1 800 = <strong>1 980 000 J = 1,98 MJ</strong>
</div>

<h2>II. Puissance électrique</h2>
<div class="definition">La <strong>puissance électrique P</strong> est l'énergie consommée par unité de temps. Elle se mesure en <strong>watts (W)</strong>.</div>
<div class="formule">P = U × I</div>
<p>Relations utiles :</p>
<ul>
  <li>P = U × I = R × I² = U²/R</li>
  <li>1 kW = 1 000 W &nbsp;|&nbsp; 1 MW = 1 000 000 W</li>
</ul>
<div class="exemple">
  <strong>Exemple :</strong> Une lampe : U = 220 V, R = 484 Ω<br>
  I = U/R = 220/484 ≈ 0,455 A &nbsp;|&nbsp; P = U × I = 220 × 0,455 ≈ <strong>100 W</strong>
</div>

<h2>III. Effet Joule</h2>
<div class="definition">L'<strong>effet Joule</strong> est la production de chaleur par un conducteur parcouru par un courant électrique. C'est une transformation d'énergie électrique en énergie thermique.</div>
<div class="formule">Q = R × I² × t</div>
<p>Avec : Q en joules (J), R en ohms (Ω), I en ampères (A), t en secondes (s)</p>
<div class="exemple">
  <strong>Exemple :</strong> Une résistance R = 10 Ω traversée par I = 2 A pendant t = 60 s :<br>
  Q = 10 × 2² × 60 = 10 × 4 × 60 = <strong>2 400 J</strong>
</div>
<div class="important">⚠️ L'effet Joule est utile dans les chauffages électriques, fers à repasser, grille-pain… mais indésirable dans les moteurs et câbles (pertes en chaleur).</div>

<h2>IV. Transformations d'énergie</h2>
<table>
  <tr><th>Appareil</th><th>Énergie reçue</th><th>Énergie utile</th><th>Énergie perdue (Joule)</th></tr>
  <tr><td>Moteur électrique</td><td>Électrique</td><td>Mécanique</td><td>Thermique</td></tr>
  <tr><td>Lampe à incandescence</td><td>Électrique</td><td>Lumineuse</td><td>Thermique</td></tr>
  <tr><td>Radiateur électrique</td><td>Électrique</td><td>Thermique</td><td>Nulle (utile = perdue)</td></tr>
  <tr><td>Pile</td><td>Chimique</td><td>Électrique</td><td>Thermique</td></tr>
</table>

<h2>V. Rendement</h2>
<div class="definition">Le <strong>rendement η</strong> (êta) d'un appareil est le rapport entre l'énergie utile produite et l'énergie totale reçue.</div>
<div class="formule">η = E_utile / E_totale = P_utile / P_totale (× 100 pour avoir %)</div>
<div class="exemple">
  <strong>Exemple :</strong> Un moteur reçoit P = 500 W et fournit une puissance mécanique P_utile = 400 W.<br>
  η = 400/500 = 0,8 = <strong>80 %</strong><br>
  Pertes Joule : P_pertes = 500 − 400 = 100 W
</div>
<div class="astuce">💡 Le rendement est toujours inférieur à 1 (< 100 %) car il y a toujours des pertes par effet Joule.</div>

<h2>VI. Facture d'électricité — le kWh</h2>
<div class="definition">Le <strong>kilowatt-heure (kWh)</strong> est l'unité commerciale de l'énergie électrique.<br>
1 kWh = 1 000 W × 3 600 s = <strong>3 600 000 J</strong> = 3,6 MJ</div>
<div class="formule">E (kWh) = P (kW) × t (h)</div>
<div class="exemple">
  Un climatiseur de 2 kW fonctionne 5 h/jour pendant 30 jours :<br>
  E = 2 × 5 × 30 = <strong>300 kWh</strong>
</div>
`);

// ─── L08 : Solutions aqueuses ─────────────────────────────────────────────
const L08_HTML = wrapHTML('Solutions aqueuses', `
<span class="chimie-badge">🧪 CHIMIE</span>
<div class="objectif">🎯 Objectif : Définir une solution aqueuse, calculer la concentration massique et molaire, appliquer les lois de dilution.</div>

<h2>I. Solution aqueuse — vocabulaire</h2>
<div class="definition">
  <strong>Solution</strong> = <strong>solvant</strong> (eau) + <strong>soluté</strong> (substance dissoute)<br>
  Une <strong>solution aqueuse</strong> est une solution dont le solvant est l'eau.
</div>
<ul>
  <li><strong>Soluté</strong> : substance dissoute (sel, sucre, acide…)</li>
  <li><strong>Solvant</strong> : liquide qui dissout (ici : l'eau)</li>
  <li><strong>Solution saturée</strong> : ne peut plus dissoudre de soluté supplémentaire</li>
  <li><strong>Solubilité</strong> : masse maximale de soluté qu'on peut dissoudre dans 1 L de solvant à une température donnée</li>
</ul>

<h2>II. Concentration massique</h2>
<div class="definition">La <strong>concentration massique C_m</strong> exprime la masse de soluté dissous dans 1 litre de solution.</div>
<div class="formule">C_m = m / V &nbsp;&nbsp; (g/L)</div>
<p>Avec : m = masse de soluté (g), V = volume de solution (L)</p>
<div class="exemple">
  <strong>Exemple :</strong> On dissout m = 15 g de sel dans V = 500 mL = 0,5 L d'eau.<br>
  C_m = 15 / 0,5 = <strong>30 g/L</strong>
</div>

<h2>III. Concentration molaire</h2>
<div class="definition">La <strong>concentration molaire C</strong> (ou C_n) exprime le nombre de moles de soluté par litre de solution.</div>
<div class="formule">C = n / V &nbsp;&nbsp; (mol/L)</div>
<div class="formule">n = m / M &nbsp;&nbsp; (moles)</div>
<p>Avec : n = quantité de matière (mol), M = masse molaire du soluté (g/mol), V = volume (L)</p>
<div class="exemple">
  <strong>Exemple :</strong> On dissout 4 g de NaOH (M = 40 g/mol) dans 500 mL = 0,5 L.<br>
  n = 4/40 = 0,1 mol → C = 0,1/0,5 = <strong>0,2 mol/L</strong>
</div>

<h2>IV. Relation entre C_m et C</h2>
<div class="formule">C_m = C × M</div>
<div class="exemple">
  C = 0,2 mol/L, M(NaOH) = 40 g/mol → C_m = 0,2 × 40 = <strong>8 g/L</strong>
</div>

<h2>V. Dilution</h2>
<div class="definition">Diluer une solution consiste à ajouter du solvant pour réduire sa concentration. La quantité de soluté reste <strong>constante</strong>.</div>
<div class="formule">C₁ × V₁ = C₂ × V₂</div>
<p>Avec : C₁ = concentration initiale, V₁ = volume initial, C₂ = concentration finale, V₂ = volume final</p>
<div class="exemple">
  <strong>Exemple :</strong> On dilue V₁ = 100 mL d'une solution de C₁ = 2 mol/L jusqu'à V₂ = 500 mL.<br>
  C₂ = C₁ × V₁ / V₂ = 2 × 0,1 / 0,5 = <strong>0,4 mol/L</strong>
</div>
<div class="astuce">💡 On note souvent le facteur de dilution : f = V₂/V₁. Ici f = 500/100 = 5 (solution 5 fois moins concentrée).</div>

<h2>VI. Masses molaires à connaître</h2>
<table>
  <tr><th>Élément</th><th>Symbole</th><th>Masse molaire (g/mol)</th></tr>
  <tr><td>Hydrogène</td><td>H</td><td>1</td></tr>
  <tr><td>Carbone</td><td>C</td><td>12</td></tr>
  <tr><td>Azote</td><td>N</td><td>14</td></tr>
  <tr><td>Oxygène</td><td>O</td><td>16</td></tr>
  <tr><td>Sodium</td><td>Na</td><td>23</td></tr>
  <tr><td>Chlore</td><td>Cl</td><td>35,5</td></tr>
  <tr><td>NaCl</td><td>—</td><td>58,5</td></tr>
  <tr><td>NaOH</td><td>—</td><td>40</td></tr>
  <tr><td>HCl</td><td>—</td><td>36,5</td></tr>
</table>
`);

// ─── L09 : Acides et bases ────────────────────────────────────────────────
const L09_HTML = wrapHTML('Acides et bases', `
<span class="chimie-badge">🧪 CHIMIE</span>
<div class="objectif">🎯 Objectif : Identifier acides et bases, comprendre la neutralisation et réaliser un dosage acido-basique.</div>

<h2>I. Les acides</h2>
<div class="definition">Un <strong>acide</strong> est une substance qui libère des ions H⁺ (protons) en solution aqueuse.</div>
<ul>
  <li>Font virer le BBT (bleu de bromothymol) au <strong>jaune</strong></li>
  <li>Font virer le papier pH au rouge (pH &lt; 7)</li>
  <li>Font effervescence avec certains métaux (dégagement de H₂)</li>
  <li>Exemples : HCl (acide chlorhydrique), H₂SO₄ (acide sulfurique), CH₃COOH (acide acétique = vinaigre)</li>
</ul>

<h2>II. Les bases</h2>
<div class="definition">Une <strong>base</strong> est une substance qui libère des ions OH⁻ (hydroxyde) en solution aqueuse.</div>
<ul>
  <li>Font virer le BBT au <strong>bleu</strong></li>
  <li>Font virer le papier pH au bleu (pH &gt; 7)</li>
  <li>Ont un toucher savonneux</li>
  <li>Exemples : NaOH (soude), Ca(OH)₂ (chaux), NH₃ (ammoniac)</li>
</ul>

<h2>III. Solutions neutres</h2>
<div class="definition">Une solution est <strong>neutre</strong> si elle ne contient ni excès de H⁺ ni de OH⁻. Le BBT reste <strong>vert</strong>. pH = 7 (à 25°C). L'eau pure est neutre.</div>

<h2>IV. Indicateurs colorés</h2>
<table>
  <tr><th>Indicateur</th><th>En milieu acide</th><th>En milieu neutre</th><th>En milieu basique</th></tr>
  <tr><td>BBT</td><td>Jaune</td><td>Vert</td><td>Bleu</td></tr>
  <tr><td>Phénolphtaléine</td><td>Incolore</td><td>Incolore</td><td>Rose/rouge</td></tr>
  <tr><td>Hélianthine</td><td>Rouge</td><td>Orange</td><td>Jaune</td></tr>
</table>

<h2>V. Réaction de neutralisation</h2>
<div class="definition">La <strong>neutralisation</strong> est la réaction entre un acide et une base qui produit du sel et de l'eau.</div>
<div class="formule">Acide + Base → Sel + Eau</div>
<div class="exemple">
  <strong>HCl + NaOH → NaCl + H₂O</strong><br>
  (acide chlorhydrique + soude → chlorure de sodium + eau)<br><br>
  <strong>H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O</strong><br>
  (acide sulfurique + soude → sulfate de sodium + eau)
</div>
<div class="important">À l'équivalence (point de neutralisation), le BBT est <strong>vert</strong> : les quantités d'acide et de base se sont exactement neutralisées.</div>

<h2>VI. Dosage acido-basique (titrage)</h2>
<p>On verse progressivement une <strong>solution de base de concentration connue</strong> dans une solution acide (ou inversement) jusqu'à l'équivalence.</p>
<p><strong>Relation à l'équivalence :</strong></p>
<div class="formule">C_acide × V_acide = C_base × V_base &nbsp;&nbsp; (pour acide + base monoacides/monobases)</div>
<div class="exemple">
  <strong>Exemple :</strong> On titre V_a = 20 mL d'HCl avec une solution NaOH de C_b = 0,1 mol/L.<br>
  À l'équivalence, V_b = 25 mL de NaOH versé.<br>
  C_a = C_b × V_b / V_a = 0,1 × 25 / 20 = <strong>0,125 mol/L</strong>
</div>

<h2>VII. Le pH</h2>
<table>
  <tr><th>Valeur de pH</th><th>Nature de la solution</th></tr>
  <tr><td>pH &lt; 7</td><td>Acide</td></tr>
  <tr><td>pH = 7</td><td>Neutre</td></tr>
  <tr><td>pH &gt; 7</td><td>Basique</td></tr>
</table>
`);

// ─── L10 : Propriétés chimiques des métaux ────────────────────────────────
const L10_HTML = wrapHTML('Propriétés chimiques des métaux usuels', `
<span class="chimie-badge">🧪 CHIMIE</span>
<div class="objectif">🎯 Objectif : Connaître les réactions des métaux courants avec l'air (O₂) et les acides, écrire et équilibrer les équations.</div>

<h2>I. Les métaux usuels</h2>
<p>Les métaux les plus courants en 3ème : <strong>Fer (Fe), Aluminium (Al), Cuivre (Cu), Zinc (Zn), Plomb (Pb)</strong></p>
<div class="important">Tous les métaux ne réagissent pas de la même manière avec l'oxygène et les acides.</div>

<h2>II. Réaction des métaux avec l'oxygène (O₂)</h2>
<div class="definition">Les métaux réagissent avec l'oxygène de l'air pour former des <strong>oxydes métalliques</strong>. C'est la <strong>corrosion</strong>.</div>

<table>
  <tr><th>Métal</th><th>Équation</th><th>Oxyde formé</th></tr>
  <tr><td>Fer (Fe)</td><td>4Fe + 3O₂ → 2Fe₂O₃</td><td>Rouille (oxyde de fer)</td></tr>
  <tr><td>Aluminium (Al)</td><td>4Al + 3O₂ → 2Al₂O₃</td><td>Alumine (couche protectrice)</td></tr>
  <tr><td>Zinc (Zn)</td><td>2Zn + O₂ → 2ZnO</td><td>Oxyde de zinc</td></tr>
  <tr><td>Cuivre (Cu)</td><td>2Cu + O₂ → 2CuO</td><td>Oxyde de cuivre (noir)</td></tr>
  <tr><td>Plomb (Pb)</td><td>2Pb + O₂ → 2PbO</td><td>Litharge</td></tr>
</table>
<div class="astuce">💡 L'aluminium se corrode mais sa couche d'alumine protège le métal intérieur (passivation).</div>

<h2>III. Réaction des métaux avec les acides</h2>
<div class="definition">Certains métaux réagissent avec les acides dilués (HCl, H₂SO₄) en dégageant du <strong>dihydrogène H₂</strong> et formant un sel.</div>

<table>
  <tr><th>Métal + Acide</th><th>Équation</th><th>Sel produit</th></tr>
  <tr><td>Fe + HCl</td><td>Fe + 2HCl → FeCl₂ + H₂↑</td><td>Chlorure de fer II</td></tr>
  <tr><td>Al + HCl</td><td>2Al + 6HCl → 2AlCl₃ + 3H₂↑</td><td>Chlorure d'aluminium</td></tr>
  <tr><td>Zn + HCl</td><td>Zn + 2HCl → ZnCl₂ + H₂↑</td><td>Chlorure de zinc</td></tr>
  <tr><td>Zn + H₂SO₄</td><td>Zn + H₂SO₄ → ZnSO₄ + H₂↑</td><td>Sulfate de zinc</td></tr>
  <tr><td>Fe + H₂SO₄</td><td>Fe + H₂SO₄ → FeSO₄ + H₂↑</td><td>Sulfate de fer II</td></tr>
</table>

<div class="attention">⚠️ Le <strong>cuivre (Cu)</strong> et le <strong>plomb (Pb)</strong> ne réagissent <strong>pas</strong> avec les acides dilués HCl ou H₂SO₄ dilué. Ils ne dégagent pas de H₂.</div>

<h2>IV. Identification du dihydrogène H₂</h2>
<div class="definition">Le dihydrogène H₂ s'identifie en approchant une allumette enflammée du gaz recueilli : on entend une légère <strong>détonation</strong> (« pop »).</div>

<h2>V. Activité chimique des métaux (ordre décroissant)</h2>
<div class="formule">Al &gt; Zn &gt; Fe &gt; Pb &gt; Cu (activité décroissante)</div>
<p>Un métal plus actif peut déplacer un métal moins actif de sa solution saline.</p>
<div class="exemple">
  <strong>Exemple :</strong> Si on plonge un clou en fer dans une solution de CuSO₄ :<br>
  Fe + CuSO₄ → FeSO₄ + Cu (le cuivre se dépose sur le fer)
</div>
`);

// ─── L11 : Les hydrocarbures ──────────────────────────────────────────────
const L11_HTML = wrapHTML('Les hydrocarbures', `
<span class="chimie-badge">🧪 CHIMIE</span>
<div class="objectif">🎯 Objectif : Classer les hydrocarbures (alcanes, alcènes, alcynes), écrire leurs formules et les équations de combustion.</div>

<h2>I. Définition</h2>
<div class="definition">Les <strong>hydrocarbures</strong> sont des composés chimiques formés uniquement de <strong>carbone (C)</strong> et d'<strong>hydrogène (H)</strong>. Ils constituent les pétroles, gaz naturels et plastiques.</div>

<h2>II. Les alcanes (hydrocarbures saturés)</h2>
<div class="definition">Les <strong>alcanes</strong> ne contiennent que des liaisons simples C−C. Ils sont dits <strong>saturés</strong>.</div>
<div class="formule">Formule générale : C<sub>n</sub>H<sub>2n+2</sub></div>
<table>
  <tr><th>n</th><th>Nom</th><th>Formule brute</th><th>Formule développée</th></tr>
  <tr><td>1</td><td>Méthane</td><td>CH₄</td><td>CH₄</td></tr>
  <tr><td>2</td><td>Éthane</td><td>C₂H₆</td><td>CH₃−CH₃</td></tr>
  <tr><td>3</td><td>Propane</td><td>C₃H₈</td><td>CH₃−CH₂−CH₃</td></tr>
  <tr><td>4</td><td>Butane</td><td>C₄H₁₀</td><td>CH₃−CH₂−CH₂−CH₃</td></tr>
  <tr><td>5</td><td>Pentane</td><td>C₅H₁₂</td><td>—</td></tr>
</table>

<h2>III. Les alcènes (hydrocarbures insaturés — 1 double liaison)</h2>
<div class="definition">Les <strong>alcènes</strong> contiennent une double liaison C=C. Ils sont <strong>insaturés</strong>.</div>
<div class="formule">Formule générale : C<sub>n</sub>H<sub>2n</sub> (n ≥ 2)</div>
<table>
  <tr><th>n</th><th>Nom</th><th>Formule brute</th></tr>
  <tr><td>2</td><td>Éthène (éthylène)</td><td>C₂H₄</td></tr>
  <tr><td>3</td><td>Propène (propylène)</td><td>C₃H₆</td></tr>
  <tr><td>4</td><td>Butène</td><td>C₄H₈</td></tr>
</table>

<h2>IV. Les alcynes (hydrocarbures insaturés — 1 triple liaison)</h2>
<div class="definition">Les <strong>alcynes</strong> contiennent une triple liaison C≡C.</div>
<div class="formule">Formule générale : C<sub>n</sub>H<sub>2n−2</sub> (n ≥ 2)</div>
<table>
  <tr><th>n</th><th>Nom</th><th>Formule brute</th></tr>
  <tr><td>2</td><td>Éthyne (acétylène)</td><td>C₂H₂</td></tr>
  <tr><td>3</td><td>Propyne</td><td>C₃H₄</td></tr>
</table>

<h2>V. Combustion des hydrocarbures</h2>
<h3>A. Combustion complète (excès d'O₂)</h3>
<div class="formule">C<sub>n</sub>H<sub>2n+2</sub> + (3n+1)/2 O₂ → n CO₂ + (n+1) H₂O</div>
<div class="exemple">
  <strong>Méthane :</strong> CH₄ + 2O₂ → CO₂ + 2H₂O<br>
  <strong>Propane :</strong> C₃H₈ + 5O₂ → 3CO₂ + 4H₂O<br>
  <strong>Butane :</strong> 2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O
</div>

<h3>B. Combustion incomplète (manque d'O₂)</h3>
<div class="formule">Hydrocarbure + O₂ (insuffisant) → CO + H₂O (+ suie C)</div>
<div class="exemple">
  <strong>Méthane (incomplète) :</strong> 2CH₄ + 3O₂ → 2CO + 4H₂O<br>
  Le CO (monoxyde de carbone) est un gaz <strong>toxique et inodore</strong> — danger !
</div>

<div class="attention">⚠️ La combustion incomplète produit du <strong>monoxyde de carbone (CO)</strong>, gaz inodore et très toxique qui peut être mortel (intoxication au CO dans les logements mal ventilés).</div>

<h2>VI. Test chimique des insaturés</h2>
<div class="definition">L'eau de brome (brun-orangé) permet de distinguer alcanes et alcènes/alcynes :<br>
- <strong>Alcène/alcyne</strong> : décolore l'eau de brome (addition sur la double ou triple liaison)<br>
- <strong>Alcane</strong> : ne réagit pas à froid avec l'eau de brome (reste brun-orangé)
</div>
`);

// ═══════════════════════════════════════════════════════════════════════════
// QCM L07–L11
// ═══════════════════════════════════════════════════════════════════════════

const QCM_L07 = {
  titre: 'QCM – Transformation d\'énergie électrique',
  questions: [
    { enonce:'La formule de l\'énergie électrique consommée par un appareil est :', options:[{lettre:'A',texte:'E = U / (I × t)'},{lettre:'B',texte:'E = U × I × t'},{lettre:'C',texte:'E = R × I'},{lettre:'D',texte:'E = U² / R'}], reponseCorrecte:'B', explication:'E = U × I × t = P × t. L\'énergie est le produit de la puissance par la durée.' },
    { enonce:'La puissance d\'un appareil sous U = 220 V avec I = 2 A est :', options:[{lettre:'A',texte:'110 W'},{lettre:'B',texte:'440 W'},{lettre:'C',texte:'222 W'},{lettre:'D',texte:'218 W'}], reponseCorrecte:'B', explication:'P = U × I = 220 × 2 = 440 W.' },
    { enonce:'Un appareil de P = 1 500 W fonctionne t = 2 h. L\'énergie consommée en kWh est :', options:[{lettre:'A',texte:'750 kWh'},{lettre:'B',texte:'0,75 kWh'},{lettre:'C',texte:'3 kWh'},{lettre:'D',texte:'3 000 kWh'}], reponseCorrecte:'C', explication:'E = P × t = 1,5 kW × 2 h = 3 kWh.' },
    { enonce:'L\'effet Joule désigne :', options:[{lettre:'A',texte:'La transformation d\'énergie mécanique en électrique'},{lettre:'B',texte:'La transformation d\'énergie électrique en chaleur'},{lettre:'C',texte:'La transformation d\'énergie chimique en mécanique'},{lettre:'D',texte:'La transformation de lumière en électricité'}], reponseCorrecte:'B', explication:'L\'effet Joule est la production de chaleur par le passage du courant dans une résistance.' },
    { enonce:'La quantité de chaleur produite par effet Joule : Q = R × I² × t. Pour R = 5 Ω, I = 3 A, t = 60 s, Q vaut :', options:[{lettre:'A',texte:'900 J'},{lettre:'B',texte:'45 J'},{lettre:'C',texte:'2 700 J'},{lettre:'D',texte:'270 J'}], reponseCorrecte:'C', explication:'Q = R × I² × t = 5 × 9 × 60 = 2 700 J.' },
    { enonce:'Un moteur reçoit P_reçue = 800 W et fournit P_utile = 640 W. Son rendement est :', options:[{lettre:'A',texte:'640 %'},{lettre:'B',texte:'125 %'},{lettre:'C',texte:'80 %'},{lettre:'D',texte:'0,8 %'}], reponseCorrecte:'C', explication:'η = P_utile / P_reçue = 640 / 800 = 0,8 = 80 %.' },
    { enonce:'1 kWh est égal à :', options:[{lettre:'A',texte:'1 000 J'},{lettre:'B',texte:'3 600 J'},{lettre:'C',texte:'3 600 000 J'},{lettre:'D',texte:'1 000 000 J'}], reponseCorrecte:'C', explication:'1 kWh = 1 000 W × 3 600 s = 3 600 000 J = 3,6 MJ.' },
    { enonce:'La puissance électrique peut aussi s\'écrire :', options:[{lettre:'A',texte:'P = R / I²'},{lettre:'B',texte:'P = U²/R'},{lettre:'C',texte:'P = U / I'},{lettre:'D',texte:'P = I / U'}], reponseCorrecte:'B', explication:'P = U × I = (R×I) × I = R×I² = U × (U/R) = U²/R. Les trois formes sont correctes.' },
    { enonce:'Quel appareil transforme principalement l\'énergie électrique en énergie lumineuse ?', options:[{lettre:'A',texte:'Fer à repasser'},{lettre:'B',texte:'Moteur électrique'},{lettre:'C',texte:'Ampoule'},{lettre:'D',texte:'Pile'}], reponseCorrecte:'C', explication:'L\'ampoule transforme l\'énergie électrique en lumière (avec pertes en chaleur).' },
    { enonce:'Le rendement d\'un appareil est toujours :', options:[{lettre:'A',texte:'Supérieur à 1'},{lettre:'B',texte:'Égal à 1'},{lettre:'C',texte:'Inférieur à 1 (< 100%)'},{lettre:'D',texte:'Nul'}], reponseCorrecte:'C', explication:'Le rendement est toujours < 1 car il y a toujours des pertes (principalement par effet Joule).' },
    { enonce:'Un climatiseur de 2 500 W fonctionne 8 h par jour pendant 30 jours. L\'énergie consommée est :', options:[{lettre:'A',texte:'600 kWh'},{lettre:'B',texte:'60 kWh'},{lettre:'C',texte:'6 kWh'},{lettre:'D',texte:'0,6 kWh'}], reponseCorrecte:'A', explication:'E = P × t = 2,5 kW × (8 × 30) h = 2,5 × 240 = 600 kWh.' },
  ]
};

const QCM_L08 = {
  titre: 'QCM – Solutions aqueuses',
  questions: [
    { enonce:'Une solution aqueuse est une solution dont le solvant est :', options:[{lettre:'A',texte:'L\'alcool'},{lettre:'B',texte:'L\'huile'},{lettre:'C',texte:'L\'eau'},{lettre:'D',texte:'Le sel'}], reponseCorrecte:'C', explication:'Dans une solution aqueuse, le solvant est l\'eau.' },
    { enonce:'La concentration massique C_m se calcule avec la formule :', options:[{lettre:'A',texte:'C_m = V / m'},{lettre:'B',texte:'C_m = m × V'},{lettre:'C',texte:'C_m = m / V'},{lettre:'D',texte:'C_m = n / V'}], reponseCorrecte:'C', explication:'C_m = m/V en g/L. La concentration molaire est C = n/V en mol/L.' },
    { enonce:'On dissout 20 g de NaCl dans 500 mL d\'eau. La concentration massique est :', options:[{lettre:'A',texte:'10 g/L'},{lettre:'B',texte:'40 g/L'},{lettre:'C',texte:'0,04 g/L'},{lettre:'D',texte:'10 000 g/L'}], reponseCorrecte:'B', explication:'C_m = 20 g / 0,5 L = 40 g/L.' },
    { enonce:'La masse molaire de NaOH (Na=23, O=16, H=1) est :', options:[{lettre:'A',texte:'24 g/mol'},{lettre:'B',texte:'39 g/mol'},{lettre:'C',texte:'40 g/mol'},{lettre:'D',texte:'58 g/mol'}], reponseCorrecte:'C', explication:'M(NaOH) = 23 + 16 + 1 = 40 g/mol.' },
    { enonce:'On dissout 8 g de NaOH (M=40 g/mol) dans 2 L. La concentration molaire est :', options:[{lettre:'A',texte:'4 mol/L'},{lettre:'B',texte:'0,1 mol/L'},{lettre:'C',texte:'16 mol/L'},{lettre:'D',texte:'0,01 mol/L'}], reponseCorrecte:'B', explication:'n = m/M = 8/40 = 0,2 mol ; C = n/V = 0,2/2 = 0,1 mol/L.' },
    { enonce:'Lors d\'une dilution, la quantité de soluté :', options:[{lettre:'A',texte:'Augmente'},{lettre:'B',texte:'Diminue'},{lettre:'C',texte:'Reste constante'},{lettre:'D',texte:'Devient nulle'}], reponseCorrecte:'C', explication:'La dilution ajoute du solvant. La quantité de soluté (n = C×V) reste constante : C₁V₁ = C₂V₂.' },
    { enonce:'On prend V₁ = 50 mL d\'une solution de C₁ = 1 mol/L et on complète à V₂ = 250 mL. La concentration finale C₂ est :', options:[{lettre:'A',texte:'5 mol/L'},{lettre:'B',texte:'0,2 mol/L'},{lettre:'C',texte:'0,5 mol/L'},{lettre:'D',texte:'0,02 mol/L'}], reponseCorrecte:'B', explication:'C₂ = C₁ × V₁/V₂ = 1 × 50/250 = 0,2 mol/L.' },
    { enonce:'Le facteur de dilution f = V₂/V₁ = 10 signifie que la solution finale est :', options:[{lettre:'A',texte:'10 fois plus concentrée'},{lettre:'B',texte:'10 fois moins concentrée'},{lettre:'C',texte:'De même concentration'},{lettre:'D',texte:'10 fois plus dense'}], reponseCorrecte:'B', explication:'Si f = 10, le volume a été multiplié par 10 → la concentration a été divisée par 10.' },
    { enonce:'La masse molaire de HCl (H=1, Cl=35,5) est :', options:[{lettre:'A',texte:'34,5 g/mol'},{lettre:'B',texte:'36,5 g/mol'},{lettre:'C',texte:'37 g/mol'},{lettre:'D',texte:'35,5 g/mol'}], reponseCorrecte:'B', explication:'M(HCl) = 1 + 35,5 = 36,5 g/mol.' },
    { enonce:'La relation entre concentration massique et molaire est :', options:[{lettre:'A',texte:'C_m = C / M'},{lettre:'B',texte:'C_m = C + M'},{lettre:'C',texte:'C_m = C × M'},{lettre:'D',texte:'C = C_m × M'}], reponseCorrecte:'C', explication:'C_m = C × M (concentration molaire × masse molaire). Réciproquement C = C_m / M.' },
    { enonce:'Une solution saturée est une solution qui :', options:[{lettre:'A',texte:'Ne contient plus de solvant'},{lettre:'B',texte:'Ne peut plus dissoudre davantage de soluté'},{lettre:'C',texte:'A une concentration nulle'},{lettre:'D',texte:'Est toujours acide'}], reponseCorrecte:'B', explication:'Une solution saturée a atteint la limite de solubilité du soluté à cette température.' },
  ]
};

const QCM_L09 = {
  titre: 'QCM – Acides et bases',
  questions: [
    { enonce:'Le BBT vire au jaune en présence d\'une solution :', options:[{lettre:'A',texte:'Basique'},{lettre:'B',texte:'Neutre'},{lettre:'C',texte:'Acide'},{lettre:'D',texte:'Saturée'}], reponseCorrecte:'C', explication:'Le BBT est jaune en milieu acide, vert en milieu neutre et bleu en milieu basique.' },
    { enonce:'La soude NaOH est :', options:[{lettre:'A',texte:'Un acide fort'},{lettre:'B',texte:'Une base forte'},{lettre:'C',texte:'Un sel neutre'},{lettre:'D',texte:'Un acide faible'}], reponseCorrecte:'B', explication:'NaOH (hydroxyde de sodium) est une base forte qui libère des ions OH⁻.' },
    { enonce:'La réaction de neutralisation entre HCl et NaOH donne :', options:[{lettre:'A',texte:'HCl₂ + Na'},{lettre:'B',texte:'NaCl + H₂O'},{lettre:'C',texte:'NaH + ClO'},{lettre:'D',texte:'Na + Cl + H₂O'}], reponseCorrecte:'B', explication:'HCl + NaOH → NaCl + H₂O. Toujours : acide + base → sel + eau.' },
    { enonce:'La phénolphtaléine devient rose en milieu :', options:[{lettre:'A',texte:'Acide'},{lettre:'B',texte:'Neutre'},{lettre:'C',texte:'Basique'},{lettre:'D',texte:'Saturé'}], reponseCorrecte:'C', explication:'La phénolphtaléine est incolore en milieu acide ou neutre, rose/rouge en milieu basique.' },
    { enonce:'Un pH = 3 correspond à une solution :', options:[{lettre:'A',texte:'Neutre'},{lettre:'B',texte:'Basique'},{lettre:'C',texte:'Acide'},{lettre:'D',texte:'Saturée'}], reponseCorrecte:'C', explication:'pH < 7 → acide ; pH = 7 → neutre ; pH > 7 → basique.' },
    { enonce:'À l\'équivalence lors d\'un dosage acido-basique, le BBT est :', options:[{lettre:'A',texte:'Jaune'},{lettre:'B',texte:'Bleu'},{lettre:'C',texte:'Rouge'},{lettre:'D',texte:'Vert'}], reponseCorrecte:'D', explication:'À l\'équivalence, la solution est neutre → le BBT est vert.' },
    { enonce:'On titre 20 mL d\'HCl par NaOH (C_b = 0,2 mol/L). Il faut 25 mL de NaOH. La concentration de HCl est :', options:[{lettre:'A',texte:'0,25 mol/L'},{lettre:'B',texte:'0,16 mol/L'},{lettre:'C',texte:'0,25 mol/L'},{lettre:'D',texte:'4 mol/L'}], reponseCorrecte:'A', explication:'C_a = C_b × V_b / V_a = 0,2 × 25/20 = 0,25 mol/L.' },
    { enonce:'Le vinaigre est une solution d\'acide acétique dans l\'eau. Il est :', options:[{lettre:'A',texte:'Basique (pH > 7)'},{lettre:'B',texte:'Neutre (pH = 7)'},{lettre:'C',texte:'Acide (pH < 7)'},{lettre:'D',texte:'Sans pH défini'}], reponseCorrecte:'C', explication:'L\'acide acétique est un acide → pH < 7.' },
    { enonce:'La réaction entre H₂SO₄ et 2NaOH donne :', options:[{lettre:'A',texte:'Na₂SO₄ + H₂O'},{lettre:'B',texte:'NaHSO₄ + H₂O'},{lettre:'C',texte:'Na₂SO₄ + 2H₂O'},{lettre:'D',texte:'NaSO₄ + 2H₂O'}], reponseCorrecte:'C', explication:'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O. L\'acide sulfurique est diprotique (2 H⁺).' },
    { enonce:'L\'eau pure a un pH de :', options:[{lettre:'A',texte:'0'},{lettre:'B',texte:'14'},{lettre:'C',texte:'7'},{lettre:'D',texte:'3'}], reponseCorrecte:'C', explication:'L\'eau pure est neutre : pH = 7 à 25°C.' },
    { enonce:'Lors de la neutralisation, l\'énergie thermique :', options:[{lettre:'A',texte:'Est absorbée par la solution'},{lettre:'B',texte:'Est dégagée (réaction exothermique)'},{lettre:'C',texte:'Reste constante'},{lettre:'D',texte:'Fait baisser le pH'}], reponseCorrecte:'B', explication:'La neutralisation est une réaction exothermique : elle dégage de la chaleur.' },
  ]
};

const QCM_L10 = {
  titre: 'QCM – Propriétés chimiques des métaux',
  questions: [
    { enonce:'Lorsque le fer réagit avec O₂, il forme :', options:[{lettre:'A',texte:'FeCl₂'},{lettre:'B',texte:'Fe₂O₃ (rouille)'},{lettre:'C',texte:'FeH₂'},{lettre:'D',texte:'FeSO₄'}], reponseCorrecte:'B', explication:'4Fe + 3O₂ → 2Fe₂O₃. La rouille est l\'oxyde de fer (III).' },
    { enonce:'Le métal qui NE réagit PAS avec l\'acide chlorhydrique dilué est :', options:[{lettre:'A',texte:'Zinc (Zn)'},{lettre:'B',texte:'Aluminium (Al)'},{lettre:'C',texte:'Cuivre (Cu)'},{lettre:'D',texte:'Fer (Fe)'}], reponseCorrecte:'C', explication:'Le cuivre est peu actif et ne réagit pas avec HCl dilué. Il ne dégage pas de H₂.' },
    { enonce:'Lorsque le zinc réagit avec HCl, il se dégage :', options:[{lettre:'A',texte:'Du dioxyde de carbone CO₂'},{lettre:'B',texte:'Du dihydrogène H₂'},{lettre:'C',texte:'Du chlore Cl₂'},{lettre:'D',texte:'De l\'oxygène O₂'}], reponseCorrecte:'B', explication:'Zn + 2HCl → ZnCl₂ + H₂↑. Le dégagement de H₂ caractérise la réaction métal + acide.' },
    { enonce:'Le sel produit lors de la réaction Zn + H₂SO₄ est :', options:[{lettre:'A',texte:'ZnCl₂'},{lettre:'B',texte:'ZnO'},{lettre:'C',texte:'ZnSO₄'},{lettre:'D',texte:'Zn(OH)₂'}], reponseCorrecte:'C', explication:'Zn + H₂SO₄ → ZnSO₄ + H₂. L\'acide sulfurique donne des sulfates.' },
    { enonce:'Comment identifier le dihydrogène H₂ dégagé lors d\'une réaction ?', options:[{lettre:'A',texte:'Il fait virer le BBT au bleu'},{lettre:'B',texte:'Il fait une détonation au contact d\'une flamme'},{lettre:'C',texte:'Il fait noircir le papier de tournesol'},{lettre:'D',texte:'Il est brun-orangé'}], reponseCorrecte:'B', explication:'H₂ est un gaz combustible qui produit une légère détonation (pop) au contact d\'une flamme.' },
    { enonce:'L\'équation 4Al + 3O₂ → 2Al₂O₃ représente :', options:[{lettre:'A',texte:'La réaction de l\'aluminium avec un acide'},{lettre:'B',texte:'La combustion de l\'aluminium dans O₂'},{lettre:'C',texte:'La dissolution de l\'aluminium dans l\'eau'},{lettre:'D',texte:'La neutralisation de l\'aluminium'}], reponseCorrecte:'B', explication:'Cette équation montre la réaction de l\'aluminium avec l\'oxygène pour former l\'alumine Al₂O₃.' },
    { enonce:'Dans la série d\'activité Al > Zn > Fe > Pb > Cu, quel métal est le plus actif ?', options:[{lettre:'A',texte:'Cuivre'},{lettre:'B',texte:'Fer'},{lettre:'C',texte:'Plomb'},{lettre:'D',texte:'Aluminium'}], reponseCorrecte:'D', explication:'L\'aluminium est le plus actif de cette série : il réagit le plus facilement avec O₂ et les acides.' },
    { enonce:'Si on plonge un clou en fer dans une solution de CuSO₄, on observe :', options:[{lettre:'A',texte:'Rien'},{lettre:'B',texte:'Un dégagement de H₂'},{lettre:'C',texte:'Un dépôt de cuivre sur le fer'},{lettre:'D',texte:'Une neutralisation'}], reponseCorrecte:'C', explication:'Fe + CuSO₄ → FeSO₄ + Cu. Le fer, plus actif, déplace le cuivre de sa solution.' },
    { enonce:'La couche d\'oxyde qui se forme sur l\'aluminium :', options:[{lettre:'A',texte:'Fragilise le métal'},{lettre:'B',texte:'Protège le métal contre une corrosion ultérieure'},{lettre:'C',texte:'Le fait rouiller comme le fer'},{lettre:'D',texte:'Le fait réagir plus vite avec les acides'}], reponseCorrecte:'B', explication:'L\'alumine Al₂O₃ forme une couche imperméable qui protège l\'aluminium (passivation).' },
    { enonce:'L\'équation Fe + 2HCl → FeCl₂ + H₂ est-elle correctement équilibrée ?', options:[{lettre:'A',texte:'Non, il manque un Fe'},{lettre:'B',texte:'Non, il faut 3HCl'},{lettre:'C',texte:'Oui, elle est correcte'},{lettre:'D',texte:'Non, le produit est FeCl₃'}], reponseCorrecte:'C', explication:'L\'équation est correctement équilibrée : 1 Fe + 2 HCl → 1 FeCl₂ + 1 H₂ (vérification des atomes).' },
  ]
};

const QCM_L11 = {
  titre: 'QCM – Les hydrocarbures',
  questions: [
    { enonce:'Les hydrocarbures sont des composés formés uniquement de :', options:[{lettre:'A',texte:'Carbone et oxygène'},{lettre:'B',texte:'Hydrogène et oxygène'},{lettre:'C',texte:'Carbone et hydrogène'},{lettre:'D',texte:'Carbone, hydrogène et azote'}], reponseCorrecte:'C', explication:'Par définition, les hydrocarbures ne contiennent que du carbone (C) et de l\'hydrogène (H).' },
    { enonce:'La formule générale des alcanes est :', options:[{lettre:'A',texte:'CₙH₂ₙ'},{lettre:'B',texte:'CₙH₂ₙ₋₂'},{lettre:'C',texte:'CₙH₂ₙ₊₂'},{lettre:'D',texte:'CₙH₂ₙ₊₄'}], reponseCorrecte:'C', explication:'Les alcanes (hydrocarbures saturés) ont la formule générale CₙH₂ₙ₊₂.' },
    { enonce:'L\'éthylène (éthène) C₂H₄ est :', options:[{lettre:'A',texte:'Un alcane'},{lettre:'B',texte:'Un alcène'},{lettre:'C',texte:'Un alcyne'},{lettre:'D',texte:'Un oxyde'}], reponseCorrecte:'B', explication:'C₂H₄ = CₙH₂ₙ avec n=2 → c\'est un alcène. Il possède une double liaison C=C.' },
    { enonce:'L\'acétylène (éthyne) C₂H₂ appartient à la famille des :', options:[{lettre:'A',texte:'Alcanes'},{lettre:'B',texte:'Alcènes'},{lettre:'C',texte:'Alcynes'},{lettre:'D',texte:'Alcools'}], reponseCorrecte:'C', explication:'C₂H₂ = CₙH₂ₙ₋₂ avec n=2 → alcyne. Il possède une triple liaison C≡C.' },
    { enonce:'La formule du propane est :', options:[{lettre:'A',texte:'C₂H₆'},{lettre:'B',texte:'C₃H₆'},{lettre:'C',texte:'C₃H₈'},{lettre:'D',texte:'C₄H₁₀'}], reponseCorrecte:'C', explication:'Propane : C₃H₂×3+2 = C₃H₈. Vérif. : 3 carbones, 2×3+2 = 8 hydrogènes.' },
    { enonce:'La combustion complète du méthane CH₄ donne :', options:[{lettre:'A',texte:'CO + H₂O'},{lettre:'B',texte:'CO₂ + H₂'},{lettre:'C',texte:'CO₂ + H₂O'},{lettre:'D',texte:'C + H₂O'}], reponseCorrecte:'C', explication:'CH₄ + 2O₂ → CO₂ + 2H₂O (combustion complète : produits CO₂ et H₂O uniquement).' },
    { enonce:'La combustion incomplète d\'un hydrocarbure produit du :', options:[{lettre:'A',texte:'CO₂ uniquement'},{lettre:'B',texte:'CO (monoxyde de carbone)'},{lettre:'C',texte:'H₂'},{lettre:'D',texte:'O₂'}], reponseCorrecte:'B', explication:'Combustion incomplète (manque d\'O₂) : produit CO (toxique) au lieu de CO₂.' },
    { enonce:'L\'eau de brome permet de distinguer les alcanes des alcènes car :', options:[{lettre:'A',texte:'Les alcènes la font virer au bleu'},{lettre:'B',texte:'Les alcènes décolorent l\'eau de brome ; les alcanes ne la décolorent pas'},{lettre:'C',texte:'Les alcanes décolorent l\'eau de brome'},{lettre:'D',texte:'Les deux décolorent l\'eau de brome'}], reponseCorrecte:'B', explication:'Les alcènes s\'additionnent sur le brome et décolorent l\'eau de brome. Les alcanes sont inertes à froid.' },
    { enonce:'L\'équation équilibrée de la combustion du butane C₄H₁₀ est :', options:[{lettre:'A',texte:'C₄H₁₀ + 6O₂ → 4CO₂ + 5H₂O'},{lettre:'B',texte:'2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O'},{lettre:'C',texte:'C₄H₁₀ + O₂ → CO₂ + H₂O'},{lettre:'D',texte:'C₄H₁₀ + 5O₂ → 4CO₂ + 5H₂O'}], reponseCorrecte:'B', explication:'2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O (vérification : C: 8=8 ✓, H: 20=20 ✓, O: 26=26 ✓).' },
    { enonce:'Le méthane CH₄ est un alcane avec n = 1. Combien a-t-il d\'atomes d\'hydrogène selon la formule CₙH₂ₙ₊₂ ?', options:[{lettre:'A',texte:'2'},{lettre:'B',texte:'3'},{lettre:'C',texte:'4'},{lettre:'D',texte:'6'}], reponseCorrecte:'C', explication:'n=1 : 2×1+2 = 4 atomes H. Formule CH₄, correcte.' },
    { enonce:'Le butane C₄H₁₀ est utilisé dans les briquets et bouteilles de gaz. Il appartient à :', options:[{lettre:'A',texte:'La famille des alcènes'},{lettre:'B',texte:'La famille des alcynes'},{lettre:'C',texte:'La famille des alcanes'},{lettre:'D',texte:'La famille des alcools'}], reponseCorrecte:'C', explication:'C₄H₁₀ : 2×4+2 = 10 → formule CₙH₂ₙ₊₂ → alcane. Liaisons simples uniquement.' },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
const CHAPITRES_PART2 = [
  { titre:'Transformation d\'énergie électrique', objectif:'Calculer l\'énergie et la puissance électrique, comprendre l\'effet Joule et calculer le rendement d\'un appareil électrique.', ordre:7, html:injectQCM(L07_HTML, QCM_L07), qcm:QCM_L07 },
  { titre:'Solutions aqueuses', objectif:'Définir une solution aqueuse, calculer la concentration massique et molaire, appliquer les lois de dilution.', ordre:8, html:injectQCM(L08_HTML, QCM_L08), qcm:QCM_L08 },
  { titre:'Acides et bases', objectif:'Identifier acides et bases par leurs propriétés, comprendre la neutralisation et réaliser un dosage acido-basique.', ordre:9, html:injectQCM(L09_HTML, QCM_L09), qcm:QCM_L09 },
  { titre:'Propriétés chimiques des métaux usuels', objectif:'Connaître les réactions des métaux courants (Fe, Al, Cu, Zn, Pb) avec l\'oxygène et les acides, écrire et équilibrer les équations.', ordre:10, html:injectQCM(L10_HTML, QCM_L10), qcm:QCM_L10 },
  { titre:'Les hydrocarbures', objectif:'Classer les hydrocarbures (alcanes, alcènes, alcynes), écrire leurs formules générales et les équations de combustion complète et incomplète.', ordre:11, html:injectQCM(L11_HTML, QCM_L11), qcm:QCM_L11 },
];

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connecté à MongoDB (base : tate)');

  const db = mongoose.connection.db;
  const admin = await db.collection('users').findOne({ role: 'admin' });
  if (!admin) throw new Error('Admin introuvable');
  const adminId = admin._id;

  const matiere = await Matiere.findOne({ code: 'PC' });
  if (!matiere) throw new Error('Matière PC introuvable — lancer part1 d\'abord !');
  console.log(`✅ Matière PC trouvée : ${matiere._id}`);

  for (const ch of CHAPITRES_PART2) {
    let chapitre = await Chapitre.findOne({ matiereId: matiere._id, niveau: '3eme', titre: ch.titre });
    if (!chapitre) {
      chapitre = await Chapitre.create({
        matiereId: matiere._id, titre: ch.titre, niveau: '3eme',
        objectif: ch.objectif, ordre: ch.ordre, actif: true, sectionFr: null,
        promptSupplement: 'Niveau 3ème Sénégal. Utilise des exemples africains/sénégalais. Vocabulaire scientifique précis.',
        formatExercices: 'Questions de réflexion, calculs numériques, QCM. Toujours indiquer les unités.',
      });
      console.log(`✅ Chapitre créé : ${ch.titre}`);
    } else {
      console.log(`ℹ️  Chapitre "${ch.titre}" existe — mise à jour`);
    }

    await Lecon.deleteMany({ chapitreId: chapitre._id });
    await Lecon.create({ chapitreId: chapitre._id, titre: ch.titre, contenuHTML: ch.html, statut: 'publie', creePar: adminId });
    console.log(`   📖 Leçon créée : ${ch.titre}`);

    await Qcm.deleteMany({ chapitreId: chapitre._id });
    await Qcm.create({ chapitreId: chapitre._id, leconId: null, titre: ch.qcm.titre, questions: ch.qcm.questions, statut: 'publie', creePar: adminId });
    console.log(`   ✅ QCM créé : ${ch.qcm.titre} (${ch.qcm.questions.length} questions)`);
  }

  await mongoose.disconnect();
  console.log('\n🎉 Part 2 terminée (L07-L11) !');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
