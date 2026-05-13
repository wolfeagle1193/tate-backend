// upload-pc-3eme-part1.cjs — Physique-Chimie 3ème : matière + chapitres + leçons L01-L06 + QCMs
'use strict';
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0';

// ── Modèles inline ─────────────────────────────────────────────────────────
const matiereSchema = new mongoose.Schema({ nom:String, code:String, niveaux:[String], icone:String, couleur:String, ordre:Number, actif:{type:Boolean,default:true}, estLangue:{type:Boolean,default:false} }, {timestamps:true});
const chapitreSchema = new mongoose.Schema({ matiereId:{type:mongoose.Schema.Types.ObjectId,ref:'Matiere'}, titre:String, niveau:String, objectif:String, ordre:{type:Number,default:0}, actif:{type:Boolean,default:true}, sectionFr:{type:String,default:null}, promptSupplement:{type:String,default:''}, formatExercices:{type:String,default:''}, prerequis:{type:mongoose.Schema.Types.ObjectId,default:null}, ficheMemo:{pointsACretenir:[String],questionsReponses:[{question:String,reponse:String}],genereAt:{type:Date,default:null},genereParIA:{type:Boolean,default:false}}, documentsRef:[] }, {timestamps:true});
const leconSchema = new mongoose.Schema({ chapitreId:{type:mongoose.Schema.Types.ObjectId,ref:'Chapitre'}, titre:String, contenuBrut:{type:String,default:''}, contenuHTML:{type:String,default:''}, contenuStructure:{type:[],default:[]}, contenuFormate:{type:mongoose.Schema.Types.Mixed,default:{}}, statut:{type:String,default:'publie'}, masque:{type:Boolean,default:false}, creePar:{type:mongoose.Schema.Types.ObjectId,ref:'User'}, valideePar:{type:mongoose.Schema.Types.ObjectId,default:null}, valideeAt:{type:Date,default:null} }, {timestamps:true});
const qcmSchema = new mongoose.Schema({ chapitreId:{type:mongoose.Schema.Types.ObjectId,ref:'Chapitre'}, leconId:{type:mongoose.Schema.Types.ObjectId,default:null}, titre:String, questions:[{enonce:String,options:[{lettre:String,texte:String}],reponseCorrecte:String,explication:{type:String,default:''}}], statut:{type:String,default:'publie'}, creePar:{type:mongoose.Schema.Types.ObjectId,ref:'User'}, valideePar:{type:mongoose.Schema.Types.ObjectId,default:null}, valideeAt:{type:Date,default:null} }, {timestamps:true});

const Matiere  = mongoose.models.Matiere  || mongoose.model('Matiere',  matiereSchema);
const Chapitre = mongoose.models.Chapitre || mongoose.model('Chapitre', chapitreSchema);
const Lecon    = mongoose.models.Lecon    || mongoose.model('Lecon',    leconSchema);
const Qcm      = mongoose.models.Qcm     || mongoose.model('Qcm',      qcmSchema);

// ── HTML helper ────────────────────────────────────────────────────────────
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
</style></head><body>
<h1>${titre}</h1>
${corps}
</body></html>`;
}

// ── QCM HTML helper ────────────────────────────────────────────────────────
// Génère une section QCM interactive (radio buttons) à injecter dans la leçon
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

// Injecte le QCM interactif dans le HTML de la leçon (avant </body>)
function injectQCM(fullHTML, qcm) {
  return fullHTML.replace('</body></html>', buildQCM(qcm) + '</body></html>');
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENU DES LEÇONS (L01 → L06)
// ═══════════════════════════════════════════════════════════════════════════

const L01_HTML = wrapHTML('Les lentilles minces', `
<div class="objectif">🎯 Objectif : Distinguer les types de lentilles, construire des images et appliquer les formules de conjugaison et de vergence.</div>

<h2>I. Définition et types de lentilles</h2>
<div class="definition">Une <strong>lentille</strong> est un milieu transparent délimité par deux surfaces dont au moins une est sphérique.</div>
<p>On distingue deux types de lentilles :</p>
<ul>
  <li><strong>Lentilles convergentes</strong> (convexes) : plus épaisses au centre qu'aux bords. Elles font converger les rayons lumineux. Symbole : ⊕ (double flèche vers l'intérieur)</li>
  <li><strong>Lentilles divergentes</strong> (concaves) : plus minces au centre qu'aux bords. Elles font diverger les rayons lumineux. Symbole : ⊖</li>
</ul>

<h2>II. Éléments caractéristiques d'une lentille</h2>
<ul>
  <li><strong>Centre optique O</strong> : tout rayon passant par O n'est pas dévié.</li>
  <li><strong>Axe optique</strong> : droite passant par O perpendiculairement à la lentille.</li>
  <li><strong>Foyer image F'</strong> : point où convergent les rayons parallèles à l'axe (lentille convergente).</li>
  <li><strong>Foyer objet F</strong> : symétrique de F' par rapport à O.</li>
  <li><strong>Distance focale f'</strong> : OF' (positive pour convergente, négative pour divergente).</li>
</ul>

<h2>III. Vergence</h2>
<div class="formule">V = 1 / f' (en dioptries δ, avec f' en mètres)</div>
<div class="exemple">
  <strong>Exemple :</strong> f' = 20 cm = 0,20 m → V = 1/0,20 = <strong>5 δ</strong> (lentille convergente)<br>
  f' = −50 cm = −0,50 m → V = 1/(−0,50) = <strong>−2 δ</strong> (lentille divergente)
</div>

<h2>IV. Construction géométrique des images</h2>
<p>On utilise <strong>3 rayons particuliers</strong> :</p>
<ol>
  <li>Rayon passant par O → non dévié</li>
  <li>Rayon parallèle à l'axe → passe par F' après la lentille (convergente)</li>
  <li>Rayon passant par F → ressort parallèle à l'axe</li>
</ol>
<div class="important">⚠️ Pour une lentille divergente, les prolongements des rayons réfractés se croisent du côté de l'objet (image virtuelle, droite, plus petite).</div>

<h2>V. Formule de conjugaison</h2>
<div class="formule">1/OA' − 1/OA = 1/f' = V</div>
<p>Avec la convention algébrique : les distances se comptent algébriquement à partir de O.</p>

<h2>VI. Grandissement (grossissement)</h2>
<div class="formule">g = OA' / OA = A'B' / AB</div>
<ul>
  <li>|g| &gt; 1 : image agrandie ; |g| &lt; 1 : image réduite</li>
  <li>g &gt; 0 : image droite ; g &lt; 0 : image renversée</li>
</ul>

<h2>VII. Application : la vision et les défauts oculaires</h2>
<table>
  <tr><th>Défaut</th><th>Cause</th><th>Correction</th></tr>
  <tr><td>Myopie</td><td>Œil trop long, image se forme avant la rétine</td><td>Lentille <strong>divergente</strong></td></tr>
  <tr><td>Hypermétropie</td><td>Œil trop court, image se forme après la rétine</td><td>Lentille <strong>convergente</strong></td></tr>
  <tr><td>Presbytie</td><td>Perte d'accommodation (personnes âgées)</td><td>Lentilles convergentes (lecture)</td></tr>
</table>

<div class="astuce">💡 Astuce mnémotechnique : <strong>Myopie = Moins (divergente)</strong>, <strong>Hypermétropie = Hopla (convergente)</strong>.</div>
`);

const L02_HTML = wrapHTML('Dispersion de la lumière blanche', `
<div class="objectif">🎯 Objectif : Comprendre la décomposition de la lumière blanche, distinguer lumières monochromatique et polychromatique, expliquer l'arc-en-ciel.</div>

<h2>I. La lumière blanche est polychromatique</h2>
<div class="definition">La <strong>lumière blanche</strong> est un mélange de lumières de toutes les couleurs : elle est dite <strong>polychromatique</strong>.</div>
<p>Lorsqu'elle traverse un prisme en verre, elle se décompose en un éventail de couleurs appelé <strong>spectre lumineux</strong>.</p>

<h2>II. Le spectre de la lumière blanche</h2>
<p>L'ordre des couleurs du spectre (de la moins déviée à la plus déviée) :</p>
<div class="formule">ROUGE → ORANGE → JAUNE → VERT → BLEU → INDIGO → VIOLET</div>
<div class="important">Le rouge est le moins dévié, le violet est le plus dévié par le prisme.</div>

<h2>III. Lumière monochromatique</h2>
<div class="definition">Une <strong>lumière monochromatique</strong> est une lumière d'une seule couleur (une seule longueur d'onde). Elle ne peut pas être décomposée davantage.</div>
<div class="exemple">
  <strong>Exemples :</strong> la lumière orange d'une lampe à vapeur de sodium, la lumière rouge d'un laser.
</div>

<h2>IV. Dispersion par un prisme</h2>
<ul>
  <li>Le prisme dévie les rayons lumineux (réfraction).</li>
  <li>Chaque couleur est déviée différemment selon sa longueur d'onde.</li>
  <li>La décomposition est appelée <strong>dispersion chromatique</strong>.</li>
</ul>

<h2>V. Recomposition de la lumière blanche</h2>
<p>On peut recomposer la lumière blanche par :</p>
<ul>
  <li><strong>Le disque de Newton</strong> : disque divisé en secteurs aux 7 couleurs du spectre, mis en rotation rapide → apparaît blanc.</li>
  <li><strong>Un second prisme renversé</strong> placé après le premier.</li>
</ul>

<h2>VI. L'arc-en-ciel</h2>
<div class="definition">L'arc-en-ciel est un phénomène naturel de dispersion de la lumière blanche du soleil par les <strong>gouttes d'eau</strong> de l'atmosphère, qui jouent le rôle de prismes.</div>
<ul>
  <li>Il apparaît quand le soleil brille et qu'il pleut en même temps.</li>
  <li>Les couleurs vont du rouge (extérieur) au violet (intérieur).</li>
  <li>L'observateur doit avoir le soleil dans le dos.</li>
</ul>

<h2>VII. Couleurs des objets</h2>
<table>
  <tr><th>Objet</th><th>Lumière reçue</th><th>Couleur perçue</th></tr>
  <tr><td>Objet blanc</td><td>Réfléchit toutes les couleurs</td><td>Blanc</td></tr>
  <tr><td>Objet noir</td><td>Absorbe toutes les couleurs</td><td>Noir</td></tr>
  <tr><td>Objet rouge</td><td>Réfléchit uniquement le rouge</td><td>Rouge</td></tr>
  <tr><td>Objet rouge en lumière verte</td><td>Absorbe le vert, ne réfléchit rien</td><td>Noir</td></tr>
</table>

<div class="astuce">💡 Un objet opaque prend la couleur qu'il réfléchit et absorbe les autres couleurs du spectre.</div>
`);

const L03_HTML = wrapHTML('Les forces', `
<div class="objectif">🎯 Objectif : Identifier et représenter des forces, calculer le poids, appliquer les conditions d'équilibre.</div>

<h2>I. Définition d'une force</h2>
<div class="definition">Une <strong>force</strong> est une action mécanique exercée par un corps sur un autre. Elle peut modifier le mouvement ou la forme d'un corps.</div>
<p>Une force est caractérisée par <strong>4 éléments</strong> :</p>
<ol>
  <li><strong>Point d'application</strong> : où s'exerce la force</li>
  <li><strong>Direction</strong> : droite selon laquelle agit la force</li>
  <li><strong>Sens</strong> : vers où agit la force (→)</li>
  <li><strong>Intensité (valeur)</strong> : mesurée en Newtons (N)</li>
</ol>

<h2>II. Le poids</h2>
<div class="definition">Le <strong>poids P</strong> est la force d'attraction exercée par la Terre sur un corps. Il est toujours dirigé vers le bas (verticalement).</div>
<div class="formule">P = m × g (en Newtons)</div>
<p>Avec : m = masse (en kg), g = intensité de la pesanteur = <strong>10 N/kg</strong> sur Terre</p>
<div class="exemple">
  <strong>Exemple :</strong> m = 5 kg → P = 5 × 10 = <strong>50 N</strong>
</div>
<div class="attention">⚠️ Ne pas confondre : <strong>masse</strong> (en kg, propriété intrinsèque) et <strong>poids</strong> (en N, force gravitationnelle).</div>

<h2>III. Autres forces courantes</h2>
<table>
  <tr><th>Force</th><th>Symbole</th><th>Nature</th></tr>
  <tr><td>Réaction du support</td><td>R̄</td><td>Perpendiculaire à la surface de contact</td></tr>
  <tr><td>Tension du fil</td><td>T̄</td><td>Along the fil, vers le point d'attache</td></tr>
  <tr><td>Force de frottement</td><td>f̄</td><td>Oppose au mouvement</td></tr>
  <tr><td>Poussée d'Archimède</td><td>F̄A</td><td>Verticale, vers le haut</td></tr>
</table>

<h2>IV. Représentation d'une force (vecteur)</h2>
<p>Une force est représentée par un <strong>vecteur</strong> (flèche) :</p>
<ul>
  <li>La flèche part du point d'application.</li>
  <li>La longueur est proportionnelle à l'intensité (à l'échelle).</li>
  <li>Le sens de la flèche indique le sens de la force.</li>
</ul>

<h2>V. Équilibre d'un solide</h2>
<div class="definition">Un solide est en <strong>équilibre</strong> quand la résultante de toutes les forces qui s'exercent sur lui est nulle.</div>
<p><strong>Conditions d'équilibre sous deux forces :</strong></p>
<ul>
  <li>Même droite d'action (colinéaires)</li>
  <li>Même intensité</li>
  <li>Sens opposés</li>
</ul>
<div class="formule">F̄₁ + F̄₂ = 0̄  ⟺  F̄₁ = −F̄₂</div>
<div class="exemple">
  <strong>Exemple :</strong> Un livre posé sur une table : son poids P̄ vers le bas est compensé par la réaction R̄ de la table vers le haut. P = R, même direction, sens opposés.
</div>

<h2>VI. Loi des actions réciproques (3ème loi de Newton)</h2>
<div class="important">Si A exerce une force F̄ sur B, alors B exerce sur A une force égale, de même direction et de sens opposé : <strong>principe des actions réciproques</strong>.</div>
`);

const L04_HTML = wrapHTML('Travail et puissance mécanique', `
<div class="objectif">🎯 Objectif : Calculer le travail d'une force, distinguer travail moteur/résistant/nul, calculer la puissance mécanique.</div>

<h2>I. Le travail mécanique</h2>
<div class="definition">Le <strong>travail W</strong> d'une force F̄ est l'énergie échangée lors d'un déplacement d. Il se mesure en <strong>joules (J)</strong>.</div>
<div class="formule">W = F × d × cos(α)</div>
<p>Avec : F en Newtons, d en mètres, α = angle entre la force et le déplacement</p>

<h2>II. Trois types de travail</h2>
<table>
  <tr><th>Type</th><th>Condition</th><th>Valeur</th><th>Exemple</th></tr>
  <tr><td><strong>Moteur</strong></td><td>Force dans le sens du déplacement (α = 0°)</td><td>W &gt; 0</td><td>Pousser une caisse</td></tr>
  <tr><td><strong>Résistant</strong></td><td>Force opposée au déplacement (α = 180°)</td><td>W &lt; 0</td><td>Frottement, freinage</td></tr>
  <tr><td><strong>Nul</strong></td><td>Force ⊥ déplacement (α = 90°) ou F = 0</td><td>W = 0</td><td>Poids lors d'un déplacement horizontal</td></tr>
</table>

<div class="exemple">
  <strong>Exemple 1 :</strong> On pousse une caisse avec F = 200 N sur d = 5 m (α = 0°).<br>
  W = 200 × 5 × cos(0°) = 200 × 5 × 1 = <strong>1 000 J</strong> (travail moteur)
</div>
<div class="exemple">
  <strong>Exemple 2 :</strong> Le poids d'un objet de 3 kg lors d'un déplacement horizontal de 4 m.<br>
  P = 3 × 10 = 30 N ; α = 90° → W = 30 × 4 × cos(90°) = 30 × 4 × 0 = <strong>0 J</strong> (travail nul)
</div>

<h2>III. Puissance mécanique</h2>
<div class="definition">La <strong>puissance P</strong> mesure la rapidité à fournir un travail. Elle se mesure en <strong>watts (W)</strong>.</div>
<div class="formule">P = W / t</div>
<p>Avec : W en joules, t en secondes → P en watts (W)</p>
<p>Relations utiles : 1 kW = 1 000 W &nbsp;|&nbsp; 1 ch (cheval-vapeur) ≈ 736 W</p>
<div class="exemple">
  <strong>Exemple :</strong> Un moteur fournit W = 60 000 J en t = 2 min = 120 s.<br>
  P = 60 000 / 120 = <strong>500 W = 0,5 kW</strong>
</div>

<h2>IV. Énergie cinétique et potentielle</h2>
<div class="formule">Énergie cinétique : Ec = ½ × m × v²</div>
<div class="formule">Énergie potentielle de pesanteur : Ep = m × g × h</div>
<p>Avec : m (kg), v (m/s), g = 10 N/kg, h (m, hauteur par rapport à un niveau de référence)</p>
<div class="important">🔑 Énergie mécanique totale : Em = Ec + Ep (se conserve en l'absence de frottements)</div>

<h2>V. Unités à connaître</h2>
<table>
  <tr><th>Grandeur</th><th>Symbole</th><th>Unité</th></tr>
  <tr><td>Travail</td><td>W</td><td>Joule (J) = N·m</td></tr>
  <tr><td>Puissance</td><td>P</td><td>Watt (W) = J/s</td></tr>
  <tr><td>Énergie</td><td>E</td><td>Joule (J)</td></tr>
  <tr><td>Force</td><td>F</td><td>Newton (N)</td></tr>
  <tr><td>Déplacement</td><td>d</td><td>Mètre (m)</td></tr>
</table>
`);

const L05_HTML = wrapHTML('Électrisation par frottement et courant électrique', `
<div class="objectif">🎯 Objectif : Expliquer l'électrisation par frottement, comprendre la nature du courant électrique et calculer l'intensité.</div>

<h2>I. Électrisation par frottement</h2>
<div class="definition">L'<strong>électrisation</strong> est le phénomène par lequel un corps acquiert des charges électriques, généralement par frottement.</div>
<p>Lorsqu'on frotte deux corps isolants (ex : règle plastique sur tissu) :</p>
<ul>
  <li>Un corps perd des électrons → devient chargé <strong>positivement (+)</strong></li>
  <li>L'autre gagne des électrons → devient chargé <strong>négativement (−)</strong></li>
</ul>
<div class="important">⚡ <strong>Loi des charges :</strong> Charges de même signe → <strong>répulsion</strong> | Charges de signes opposés → <strong>attraction</strong></div>

<h2>II. Les charges électriques</h2>
<ul>
  <li><strong>Charge élémentaire</strong> : e = 1,6 × 10⁻¹⁹ C (charge d'un électron)</li>
  <li>Les conducteurs laissent passer les charges ; les isolants ne les laissent pas passer.</li>
  <li>L'électroscope à feuilles détecte les corps chargés.</li>
</ul>

<h2>III. Le courant électrique</h2>
<div class="definition">Le <strong>courant électrique</strong> est un mouvement ordonné de charges électriques (électrons dans les métaux) à travers un conducteur.</div>

<h3>Sens du courant</h3>
<table>
  <tr><th>Type de sens</th><th>Direction</th></tr>
  <tr><td>Sens <strong>conventionnel</strong></td><td>Du pôle + vers le pôle − (à l'extérieur du générateur)</td></tr>
  <tr><td>Sens <strong>réel</strong> (électrons)</td><td>Du pôle − vers le pôle + (sens opposé)</td></tr>
</table>

<h2>IV. Intensité du courant</h2>
<div class="definition">L'<strong>intensité I</strong> mesure la quantité de charges qui traverse une section d'un conducteur par unité de temps.</div>
<div class="formule">I = Q / t</div>
<p>Avec : I en ampères (A), Q en coulombs (C), t en secondes (s)</p>
<div class="exemple">
  <strong>Exemple :</strong> Une charge Q = 120 C passe en t = 2 min = 120 s.<br>
  I = 120 / 120 = <strong>1 A</strong>
</div>
<p>L'intensité se mesure avec un <strong>ampèremètre</strong>, branché <strong>en série</strong> dans le circuit.</p>

<h2>V. Tension électrique</h2>
<div class="definition">La <strong>tension électrique U</strong> est la différence de potentiel entre deux points d'un circuit. Elle se mesure en volts (V) avec un <strong>voltmètre branché en dérivation</strong>.</div>

<h2>VI. Types de courant</h2>
<table>
  <tr><th>Type</th><th>Caractéristique</th><th>Exemple</th></tr>
  <tr><td>Courant <strong>continu</strong> (CC)</td><td>Sens et intensité constants</td><td>Pile, batterie</td></tr>
  <tr><td>Courant <strong>alternatif</strong> (CA)</td><td>Sens et intensité varient périodiquement</td><td>EDF (230 V, 50 Hz)</td></tr>
</table>
`);

const L06_HTML = wrapHTML('Résistance électrique', `
<div class="objectif">🎯 Objectif : Appliquer la loi d'Ohm, calculer des résistances en série et en dérivation, utiliser la notion de résistivité.</div>

<h2>I. La résistance électrique</h2>
<div class="definition">La <strong>résistance électrique R</strong> d'un conducteur mesure sa capacité à s'opposer au passage du courant. Elle se mesure en <strong>ohms (Ω)</strong>.</div>

<h2>II. Loi d'Ohm</h2>
<div class="formule">U = R × I</div>
<p>Avec : U en volts (V), R en ohms (Ω), I en ampères (A)</p>
<div class="exemple">
  <strong>Exemple :</strong> R = 100 Ω, I = 0,5 A → U = 100 × 0,5 = <strong>50 V</strong><br>
  Si U = 12 V, R = 4 Ω → I = U/R = 12/4 = <strong>3 A</strong>
</div>
<p>La résistance se mesure avec un <strong>ohmmètre</strong> (hors tension).</p>

<h2>III. Association de résistances</h2>
<h3>A. En série</h3>
<div class="formule">R<sub>eq</sub> = R<sub>1</sub> + R<sub>2</sub> + R<sub>3</sub> + …</div>
<ul>
  <li>Même courant I dans chaque résistance</li>
  <li>Tensions s'additionnent : U = U₁ + U₂ + …</li>
</ul>
<div class="exemple">R₁ = 20 Ω, R₂ = 30 Ω en série → R<sub>eq</sub> = 50 Ω</div>

<h3>B. En dérivation (parallèle)</h3>
<div class="formule">1/R<sub>eq</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + 1/R<sub>3</sub> + …</div>
<ul>
  <li>Même tension U aux bornes de chaque résistance</li>
  <li>Courants s'additionnent : I = I₁ + I₂ + …</li>
</ul>
<div class="exemple">R₁ = 20 Ω, R₂ = 30 Ω en dérivation :<br>
1/R<sub>eq</sub> = 1/20 + 1/30 = 3/60 + 2/60 = 5/60 → R<sub>eq</sub> = 60/5 = <strong>12 Ω</strong></div>

<h2>IV. Résistivité</h2>
<div class="definition">La <strong>résistivité ρ</strong> (rhô) est une propriété du matériau qui mesure sa résistance à conduire le courant.</div>
<div class="formule">R = ρ × L / S</div>
<p>Avec : ρ en Ω·m, L = longueur du conducteur (m), S = section transversale (m²)</p>
<div class="important">Plus ρ est petit, meilleur est le conducteur. Cuivre : ρ ≈ 1,7×10⁻⁸ Ω·m (excellent conducteur)</div>

<h2>V. Tableau récapitulatif</h2>
<table>
  <tr><th>Montage</th><th>Résistance équivalente</th><th>Courant</th><th>Tension</th></tr>
  <tr><td>Série</td><td>R₁ + R₂ + …</td><td>I identique partout</td><td>U = U₁ + U₂ + …</td></tr>
  <tr><td>Dérivation</td><td>1/R = 1/R₁ + 1/R₂ + …</td><td>I = I₁ + I₂ + …</td><td>U identique partout</td></tr>
</table>
`);

// ═══════════════════════════════════════════════════════════════════════════
// QCM L01 à L06
// ═══════════════════════════════════════════════════════════════════════════

const QCM_L01 = {
  titre: 'QCM – Les lentilles minces',
  questions: [
    { enonce:'Quelle est la caractéristique d\'une lentille convergente ?', options:[{lettre:'A',texte:'Elle est plus mince au centre qu\'aux bords'},{lettre:'B',texte:'Elle est plus épaisse au centre qu\'aux bords'},{lettre:'C',texte:'Elle a la même épaisseur partout'},{lettre:'D',texte:'Elle n\'a pas de centre optique'}], reponseCorrecte:'B', explication:'Une lentille convergente est plus épaisse en son centre (convexe).' },
    { enonce:'La vergence V d\'une lentille de distance focale f\' = 25 cm est :', options:[{lettre:'A',texte:'0,25 δ'},{lettre:'B',texte:'25 δ'},{lettre:'C',texte:'4 δ'},{lettre:'D',texte:'400 δ'}], reponseCorrecte:'C', explication:'V = 1/f\' = 1/0,25 m = 4 δ.' },
    { enonce:'Le foyer image F\' d\'une lentille convergente est :', options:[{lettre:'A',texte:'Le point d\'où semblent provenir les rayons'},{lettre:'B',texte:'Le point où convergent les rayons parallèles à l\'axe'},{lettre:'C',texte:'Le centre de la lentille'},{lettre:'D',texte:'Le point symétrique de F par rapport à l\'axe'}], reponseCorrecte:'B', explication:'F\' est par définition le foyer image : les rayons parallèles à l\'axe convergent en F\'.' },
    { enonce:'Un rayon passant par le centre optique O d\'une lentille :', options:[{lettre:'A',texte:'Est dévié vers F\''},{lettre:'B',texte:'Est dévié vers F'},{lettre:'C',texte:'N\'est pas dévié'},{lettre:'D',texte:'Est réfléchi'}], reponseCorrecte:'C', explication:'Par définition, tout rayon passant par O n\'est pas dévié.' },
    { enonce:'Un objet est placé à OA = −30 cm d\'une lentille convergente de f\' = 20 cm. Quelle est la position de l\'image ?', options:[{lettre:'A',texte:'OA\' = 12 cm'},{lettre:'B',texte:'OA\' = 60 cm'},{lettre:'C',texte:'OA\' = −60 cm'},{lettre:'D',texte:'OA\' = 15 cm'}], reponseCorrecte:'B', explication:'1/OA\' = 1/f\' + 1/OA = 1/20 + 1/(−30) = 3/60 − 2/60 = 1/60 → OA\' = 60 cm.' },
    { enonce:'Le grandissement g = OA\'/OA = 60/(−30) = −2 signifie que l\'image est :', options:[{lettre:'A',texte:'Droite et agrandie'},{lettre:'B',texte:'Renversée et réduite'},{lettre:'C',texte:'Renversée et agrandie'},{lettre:'D',texte:'Droite et réduite'}], reponseCorrecte:'C', explication:'g négatif → image renversée ; |g| = 2 > 1 → image agrandie.' },
    { enonce:'Quelle lentille corrige la myopie ?', options:[{lettre:'A',texte:'Lentille convergente'},{lettre:'B',texte:'Lentille plan-convexe'},{lettre:'C',texte:'Lentille divergente'},{lettre:'D',texte:'Aucune lentille'}], reponseCorrecte:'C', explication:'Le myope voit bien de près mais mal de loin : la lentille divergente éloigne le foyer.' },
    { enonce:'Quelle lentille corrige l\'hypermétropie ?', options:[{lettre:'A',texte:'Lentille divergente'},{lettre:'B',texte:'Lentille convergente'},{lettre:'C',texte:'Prisme'},{lettre:'D',texte:'Miroir concave'}], reponseCorrecte:'B', explication:'L\'hypermétrope voit mal de près : la lentille convergente rapproche le foyer sur la rétine.' },
    { enonce:'Une lentille a une vergence V = −5 δ. Sa distance focale f\' vaut :', options:[{lettre:'A',texte:'+20 cm'},{lettre:'B',texte:'−20 cm'},{lettre:'C',texte:'+5 cm'},{lettre:'D',texte:'−5 cm'}], reponseCorrecte:'B', explication:'f\' = 1/V = 1/(−5) = −0,20 m = −20 cm. La vergence négative indique une lentille divergente.' },
    { enonce:'Deux lentilles accolées de vergences V₁ = 3 δ et V₂ = 2 δ ont une vergence équivalente de :', options:[{lettre:'A',texte:'1 δ'},{lettre:'B',texte:'6 δ'},{lettre:'C',texte:'5 δ'},{lettre:'D',texte:'2,5 δ'}], reponseCorrecte:'C', explication:'Pour des lentilles accolées : V = V₁ + V₂ = 3 + 2 = 5 δ.' },
    { enonce:'L\'image d\'un objet réel formée par une lentille divergente est toujours :', options:[{lettre:'A',texte:'Réelle, renversée, agrandie'},{lettre:'B',texte:'Réelle, droite, réduite'},{lettre:'C',texte:'Virtuelle, droite, réduite'},{lettre:'D',texte:'Virtuelle, renversée, agrandie'}], reponseCorrecte:'C', explication:'Une lentille divergente donne toujours une image virtuelle, droite et plus petite que l\'objet.' },
    { enonce:'Quel instrument permet de mesurer la distance focale d\'une lentille convergente ?', options:[{lettre:'A',texte:'Un voltmètre'},{lettre:'B',texte:'Un banc d\'optique avec un écran'},{lettre:'C',texte:'Un microscope'},{lettre:'D',texte:'Un prisme'}], reponseCorrecte:'B', explication:'On utilise un banc d\'optique : on cherche la position de l\'écran où l\'image est nette lorsque l\'objet est à l\'infini.' },
  ]
};

const QCM_L02 = {
  titre: 'QCM – Dispersion de la lumière blanche',
  questions: [
    { enonce:'La lumière blanche est dite :', options:[{lettre:'A',texte:'Monochromatique'},{lettre:'B',texte:'Polychromatique'},{lettre:'C',texte:'Infrarouge'},{lettre:'D',texte:'Ultraviolette'}], reponseCorrecte:'B', explication:'La lumière blanche est un mélange de toutes les couleurs du spectre visible : elle est polychromatique.' },
    { enonce:'Dans le spectre visible, quelle couleur est la plus déviée par un prisme ?', options:[{lettre:'A',texte:'Rouge'},{lettre:'B',texte:'Vert'},{lettre:'C',texte:'Orange'},{lettre:'D',texte:'Violet'}], reponseCorrecte:'D', explication:'Le violet a la longueur d\'onde la plus courte et est le plus dévié par un prisme.' },
    { enonce:'Quelle couleur est la moins déviée par un prisme ?', options:[{lettre:'A',texte:'Bleu'},{lettre:'B',texte:'Jaune'},{lettre:'C',texte:'Rouge'},{lettre:'D',texte:'Vert'}], reponseCorrecte:'C', explication:'Le rouge a la longueur d\'onde la plus longue et est le moins dévié.' },
    { enonce:'Le disque de Newton permet de démontrer que :', options:[{lettre:'A',texte:'Le blanc est absorbé par les couleurs'},{lettre:'B',texte:'La lumière blanche peut être recomposée à partir des couleurs du spectre'},{lettre:'C',texte:'Le rouge et le bleu donnent du vert'},{lettre:'D',texte:'Le prisme détruit la lumière'}], reponseCorrecte:'B', explication:'Le disque de Newton tourne et les 7 couleurs se fondent en blanc : c\'est la recomposition.' },
    { enonce:'L\'arc-en-ciel est dû à :', options:[{lettre:'A',texte:'La réflexion de la lumière sur les nuages'},{lettre:'B',texte:'La dispersion de la lumière solaire par les gouttes d\'eau'},{lettre:'C',texte:'La diffusion de la lumière dans l\'air sec'},{lettre:'D',texte:'La réfraction de la lumière par la lune'}], reponseCorrecte:'B', explication:'Les gouttes d\'eau jouent le rôle de prismes et dispersent la lumière blanche du soleil.' },
    { enonce:'Une lumière monochromatique rouge traversant un prisme :', options:[{lettre:'A',texte:'Se décompose en plusieurs couleurs'},{lettre:'B',texte:'Devient blanche'},{lettre:'C',texte:'Est déviée sans se décomposer'},{lettre:'D',texte:'N\'est pas déviée'}], reponseCorrecte:'C', explication:'Une lumière monochromatique est déviée par le prisme mais ne se décompose pas car elle est d\'une seule couleur.' },
    { enonce:'Quel est l\'ordre correct des couleurs du spectre solaire, du rouge au violet ?', options:[{lettre:'A',texte:'Rouge, Jaune, Orange, Vert, Bleu, Indigo, Violet'},{lettre:'B',texte:'Rouge, Orange, Jaune, Vert, Bleu, Indigo, Violet'},{lettre:'C',texte:'Violet, Indigo, Bleu, Vert, Jaune, Orange, Rouge'},{lettre:'D',texte:'Rouge, Vert, Bleu, Jaune, Orange, Indigo, Violet'}], reponseCorrecte:'B', explication:'L\'ordre correct est ROJAIV : Rouge, Orange, Jaune, Vert, Bleu (Azuré), Indigo, Violet.' },
    { enonce:'Un objet éclairé par une lumière verte paraît noir si sa couleur propre est :', options:[{lettre:'A',texte:'Verte'},{lettre:'B',texte:'Blanche'},{lettre:'C',texte:'Rouge'},{lettre:'D',texte:'Jaune'}], reponseCorrecte:'C', explication:'Un objet rouge n\'absorbe que le rouge. Éclairé en vert, il absorbe tout et n\'en réfléchit rien → noir.' },
    { enonce:'Un objet blanc éclairé par une lumière rouge apparaît :', options:[{lettre:'A',texte:'Blanc'},{lettre:'B',texte:'Noir'},{lettre:'C',texte:'Rouge'},{lettre:'D',texte:'Vert'}], reponseCorrecte:'C', explication:'Un objet blanc réfléchit toutes les couleurs. Il réfléchit donc le rouge et apparaît rouge.' },
    { enonce:'La dispersion de la lumière par un prisme est due à :', options:[{lettre:'A',texte:'La réflexion totale'},{lettre:'B',texte:'La diffraction'},{lettre:'C',texte:'Le fait que chaque couleur a un indice de réfraction différent'},{lettre:'D',texte:'L\'absorption sélective'}], reponseCorrecte:'C', explication:'Chaque couleur a un indice de réfraction légèrement différent dans le verre, ce qui les dévie différemment.' },
    { enonce:'La lumière émise par un laser rouge est :', options:[{lettre:'A',texte:'Polychromatique'},{lettre:'B',texte:'Blanche'},{lettre:'C',texte:'Monochromatique'},{lettre:'D',texte:'Infrarouge'}], reponseCorrecte:'C', explication:'Un laser émet une lumière d\'une seule longueur d\'onde : elle est monochromatique.' },
  ]
};

const QCM_L03 = {
  titre: 'QCM – Les forces',
  questions: [
    { enonce:'Combien de caractéristiques définissent une force ?', options:[{lettre:'A',texte:'2'},{lettre:'B',texte:'3'},{lettre:'C',texte:'4'},{lettre:'D',texte:'5'}], reponseCorrecte:'C', explication:'Une force est caractérisée par : point d\'application, direction, sens et intensité (4 caractéristiques).' },
    { enonce:'L\'unité de mesure de la force est :', options:[{lettre:'A',texte:'Kilogramme (kg)'},{lettre:'B',texte:'Joule (J)'},{lettre:'C',texte:'Newton (N)'},{lettre:'D',texte:'Pascal (Pa)'}], reponseCorrecte:'C', explication:'La force se mesure en Newtons (N), en hommage à Isaac Newton.' },
    { enonce:'La masse d\'un corps est de 4 kg. Son poids sur Terre (g = 10 N/kg) est :', options:[{lettre:'A',texte:'4 N'},{lettre:'B',texte:'40 N'},{lettre:'C',texte:'400 N'},{lettre:'D',texte:'0,4 N'}], reponseCorrecte:'B', explication:'P = m × g = 4 × 10 = 40 N.' },
    { enonce:'Le poids d\'un corps est toujours dirigé :', options:[{lettre:'A',texte:'Vers le haut'},{lettre:'B',texte:'Horizontalement'},{lettre:'C',texte:'Vers le bas (verticalement)'},{lettre:'D',texte:'Dans le sens du mouvement'}], reponseCorrecte:'C', explication:'Le poids est l\'attraction gravitationnelle de la Terre : il est toujours vertical, dirigé vers le bas.' },
    { enonce:'Un livre pose sur une table est en équilibre. La réaction de la table est :', options:[{lettre:'A',texte:'Nulle'},{lettre:'B',texte:'Égale au poids et dirigée vers le haut'},{lettre:'C',texte:'Supérieure au poids'},{lettre:'D',texte:'Horizontale'}], reponseCorrecte:'B', explication:'Par la loi d\'équilibre, la réaction R = P, même direction, sens opposé (vers le haut).' },
    { enonce:'Deux forces sont en équilibre si elles sont :', options:[{lettre:'A',texte:'Perpendiculaires l\'une à l\'autre'},{lettre:'B',texte:'De même sens et même intensité'},{lettre:'C',texte:'Colinéaires, de même intensité et de sens opposés'},{lettre:'D',texte:'De même sens et d\'intensités différentes'}], reponseCorrecte:'C', explication:'Conditions d\'équilibre sous deux forces : même droite d\'action, même intensité, sens opposés.' },
    { enonce:'Un corps de masse 0,5 kg est sur la Lune où g = 1,6 N/kg. Son poids sur la Lune vaut :', options:[{lettre:'A',texte:'0,5 N'},{lettre:'B',texte:'8 N'},{lettre:'C',texte:'0,8 N'},{lettre:'D',texte:'5 N'}], reponseCorrecte:'C', explication:'P = m × g = 0,5 × 1,6 = 0,8 N. Sa masse reste 0,5 kg mais son poids change.' },
    { enonce:'La tension dans un fil qui soutient un objet de 2 kg est :', options:[{lettre:'A',texte:'2 N'},{lettre:'B',texte:'0,2 N'},{lettre:'C',texte:'20 N'},{lettre:'D',texte:'200 N'}], reponseCorrecte:'C', explication:'T = P = m × g = 2 × 10 = 20 N (équilibre : tension = poids).' },
    { enonce:'La force de frottement s\'oppose :', options:[{lettre:'A',texte:'Au poids du corps'},{lettre:'B',texte:'À la réaction du support'},{lettre:'C',texte:'Au mouvement du corps'},{lettre:'D',texte:'À la tension du fil'}], reponseCorrecte:'C', explication:'La force de frottement est toujours opposée au sens du mouvement ou de la tendance au mouvement.' },
    { enonce:'Selon la 3ème loi de Newton, si A exerce une force de 50 N sur B, alors B exerce sur A une force de :', options:[{lettre:'A',texte:'25 N dans le même sens'},{lettre:'B',texte:'50 N dans le sens opposé'},{lettre:'C',texte:'100 N dans le même sens'},{lettre:'D',texte:'0 N'}], reponseCorrecte:'B', explication:'Principe des actions réciproques : les forces sont égales en intensité et opposées en sens.' },
    { enonce:'Un objet est posé sur un plan incliné sans frottement. La réaction du plan est :', options:[{lettre:'A',texte:'Verticale vers le haut'},{lettre:'B',texte:'Perpendiculaire au plan incliné'},{lettre:'C',texte:'Parallèle au plan incliné'},{lettre:'D',texte:'Dans le sens du mouvement'}], reponseCorrecte:'B', explication:'Sans frottement, la réaction du support est toujours perpendiculaire (normale) à la surface de contact.' },
  ]
};

const QCM_L04 = {
  titre: 'QCM – Travail et puissance mécanique',
  questions: [
    { enonce:'Le travail d\'une force F = 150 N sur un déplacement d = 4 m dans le sens de la force est :', options:[{lettre:'A',texte:'37,5 J'},{lettre:'B',texte:'600 J'},{lettre:'C',texte:'154 J'},{lettre:'D',texte:'146 J'}], reponseCorrecte:'B', explication:'W = F × d × cos(0°) = 150 × 4 × 1 = 600 J.' },
    { enonce:'Le travail du poids est nul lorsque le déplacement est :', options:[{lettre:'A',texte:'Vertical vers le bas'},{lettre:'B',texte:'Vertical vers le haut'},{lettre:'C',texte:'Horizontal'},{lettre:'D',texte:'Incliné à 45°'}], reponseCorrecte:'C', explication:'Le poids est vertical ; pour un déplacement horizontal α = 90°, donc cos(90°) = 0 → W = 0.' },
    { enonce:'Un travail est dit "résistant" quand :', options:[{lettre:'A',texte:'Il est nul'},{lettre:'B',texte:'La force est dans le sens du déplacement'},{lettre:'C',texte:'La force est opposée au déplacement'},{lettre:'D',texte:'La force est perpendiculaire au déplacement'}], reponseCorrecte:'C', explication:'Un travail résistant est négatif : la force s\'oppose au déplacement (freinage, frottement…).' },
    { enonce:'L\'unité du travail est :', options:[{lettre:'A',texte:'Watt (W)'},{lettre:'B',texte:'Newton (N)'},{lettre:'C',texte:'Joule (J)'},{lettre:'D',texte:'Pascal (Pa)'}], reponseCorrecte:'C', explication:'Le travail se mesure en Joules (J). 1 J = 1 N × 1 m.' },
    { enonce:'La puissance d\'un moteur qui fournit W = 9 000 J en t = 3 min = 180 s est :', options:[{lettre:'A',texte:'27 000 W'},{lettre:'B',texte:'50 W'},{lettre:'C',texte:'3 000 W'},{lettre:'D',texte:'300 W'}], reponseCorrecte:'B', explication:'P = W/t = 9 000/180 = 50 W.' },
    { enonce:'Un moteur de puissance P = 2 kW travaille pendant t = 5 min = 300 s. Le travail fourni est :', options:[{lettre:'A',texte:'400 J'},{lettre:'B',texte:'10 J'},{lettre:'C',texte:'600 000 J'},{lettre:'D',texte:'600 J'}], reponseCorrecte:'C', explication:'W = P × t = 2 000 × 300 = 600 000 J.' },
    { enonce:'L\'énergie cinétique d\'un objet de masse m = 2 kg se déplaçant à v = 10 m/s est :', options:[{lettre:'A',texte:'20 J'},{lettre:'B',texte:'100 J'},{lettre:'C',texte:'10 J'},{lettre:'D',texte:'200 J'}], reponseCorrecte:'B', explication:'Ec = ½ × m × v² = ½ × 2 × 100 = 100 J.' },
    { enonce:'L\'énergie potentielle d\'un objet de 3 kg à h = 5 m (g = 10 N/kg) est :', options:[{lettre:'A',texte:'15 J'},{lettre:'B',texte:'150 J'},{lettre:'C',texte:'1,5 J'},{lettre:'D',texte:'300 J'}], reponseCorrecte:'B', explication:'Ep = m × g × h = 3 × 10 × 5 = 150 J.' },
    { enonce:'Une grue soulève une charge de 500 kg à h = 8 m en 20 s. Sa puissance est :', options:[{lettre:'A',texte:'200 W'},{lettre:'B',texte:'2 000 W'},{lettre:'C',texte:'40 000 W'},{lettre:'D',texte:'2 000 000 W'}], reponseCorrecte:'B', explication:'W = P_poids × h = (500×10) × 8 = 40 000 J. Puissance = 40 000/20 = 2 000 W.' },
    { enonce:'Le travail de la force de frottement est toujours :', options:[{lettre:'A',texte:'Positif'},{lettre:'B',texte:'Nul'},{lettre:'C',texte:'Négatif'},{lettre:'D',texte:'Variable selon le sens'}], reponseCorrecte:'C', explication:'Le frottement s\'oppose au mouvement : son travail est toujours résistant (négatif).' },
    { enonce:'1 kilowatt-heure (kWh) est égal à :', options:[{lettre:'A',texte:'1 000 J'},{lettre:'B',texte:'3 600 J'},{lettre:'C',texte:'3 600 000 J'},{lettre:'D',texte:'60 J'}], reponseCorrecte:'C', explication:'1 kWh = 1 000 W × 3 600 s = 3 600 000 J = 3,6 MJ.' },
  ]
};

const QCM_L05 = {
  titre: 'QCM – Électrisation et courant électrique',
  questions: [
    { enonce:'Lors d\'une électrisation par frottement, les charges apparaissent car :', options:[{lettre:'A',texte:'Des protons se déplacent'},{lettre:'B',texte:'Des électrons sont transférés d\'un corps à l\'autre'},{lettre:'C',texte:'Des neutrons se multiplient'},{lettre:'D',texte:'De la matière est créée'}], reponseCorrecte:'B', explication:'Ce sont les électrons (charges négatives) qui se déplacent lors du frottement.' },
    { enonce:'Deux corps chargés positivement vont :', options:[{lettre:'A',texte:'S\'attirer'},{lettre:'B',texte:'Se repousser'},{lettre:'C',texte:'Être neutres l\'un envers l\'autre'},{lettre:'D',texte:'Échanger des neutrons'}], reponseCorrecte:'B', explication:'Des charges de même signe se repoussent. Des charges de signes opposés s\'attirent.' },
    { enonce:'L\'intensité du courant électrique se mesure en :', options:[{lettre:'A',texte:'Volts (V)'},{lettre:'B',texte:'Ohms (Ω)'},{lettre:'C',texte:'Ampères (A)'},{lettre:'D',texte:'Watts (W)'}], reponseCorrecte:'C', explication:'L\'intensité I se mesure en Ampères (A) avec un ampèremètre.' },
    { enonce:'La relation entre charge Q, intensité I et temps t est :', options:[{lettre:'A',texte:'Q = I / t'},{lettre:'B',texte:'I = Q × t'},{lettre:'C',texte:'Q = I × t'},{lettre:'D',texte:'t = Q × I'}], reponseCorrecte:'C', explication:'Par définition de l\'intensité : I = Q/t, donc Q = I × t.' },
    { enonce:'Une charge Q = 60 C traverse un conducteur en t = 5 min = 300 s. L\'intensité est :', options:[{lettre:'A',texte:'12 000 A'},{lettre:'B',texte:'0,2 A'},{lettre:'C',texte:'300 A'},{lettre:'D',texte:'5 A'}], reponseCorrecte:'B', explication:'I = Q/t = 60/300 = 0,2 A.' },
    { enonce:'Le sens conventionnel du courant électrique va :', options:[{lettre:'A',texte:'Du pôle − vers le pôle +'},{lettre:'B',texte:'Du pôle + vers le pôle − (à l\'extérieur du générateur)'},{lettre:'C',texte:'De la borne − vers la borne − '},{lettre:'D',texte:'Dans les deux sens en même temps'}], reponseCorrecte:'B', explication:'Par convention, le courant va du + vers le − à l\'extérieur du générateur (sens opposé aux électrons).' },
    { enonce:'L\'ampèremètre se branche :', options:[{lettre:'A',texte:'En dérivation aux bornes du composant'},{lettre:'B',texte:'En série dans le circuit'},{lettre:'C',texte:'Entre les bornes de la pile'},{lettre:'D',texte:'En parallèle avec la pile'}], reponseCorrecte:'B', explication:'L\'ampèremètre se branche en série : le courant le traverse pour être mesuré.' },
    { enonce:'La tension électrique se mesure avec un :', options:[{lettre:'A',texte:'Ampèremètre en série'},{lettre:'B',texte:'Ohmmètre en série'},{lettre:'C',texte:'Voltmètre en dérivation'},{lettre:'D',texte:'Wattmètre en série'}], reponseCorrecte:'C', explication:'Le voltmètre se branche en dérivation (en parallèle) aux bornes du composant dont on veut mesurer la tension.' },
    { enonce:'Le courant continu (CC) est caractérisé par :', options:[{lettre:'A',texte:'Une intensité et un sens qui varient périodiquement'},{lettre:'B',texte:'Une intensité et un sens constants'},{lettre:'C',texte:'Une intensité nulle'},{lettre:'D',texte:'Un sens qui change toutes les secondes'}], reponseCorrecte:'B', explication:'Le courant continu a un sens et une intensité constants. C\'est le cas des piles et batteries.' },
    { enonce:'I = 0,5 A pendant t = 10 min. La charge Q qui a circulé est :', options:[{lettre:'A',texte:'5 C'},{lettre:'B',texte:'300 C'},{lettre:'C',texte:'0,05 C'},{lettre:'D',texte:'20 C'}], reponseCorrecte:'B', explication:'Q = I × t = 0,5 × (10 × 60) = 0,5 × 600 = 300 C.' },
    { enonce:'Un conducteur laisse passer le courant car :', options:[{lettre:'A',texte:'Il a peu d\'électrons libres'},{lettre:'B',texte:'Il a beaucoup d\'électrons libres'},{lettre:'C',texte:'Il a trop de protons'},{lettre:'D',texte:'Il est un isolant'}], reponseCorrecte:'B', explication:'Les conducteurs (métaux) ont beaucoup d\'électrons libres qui peuvent se déplacer facilement.' },
  ]
};

const QCM_L06 = {
  titre: 'QCM – Résistance électrique',
  questions: [
    { enonce:'Selon la loi d\'Ohm, la relation entre U, R et I est :', options:[{lettre:'A',texte:'U = R / I'},{lettre:'B',texte:'U = I / R'},{lettre:'C',texte:'U = R × I'},{lettre:'D',texte:'R = U × I'}], reponseCorrecte:'C', explication:'La loi d\'Ohm : U = R × I (tension = résistance × intensité).' },
    { enonce:'Une résistance R = 50 Ω est traversée par I = 0,4 A. La tension à ses bornes est :', options:[{lettre:'A',texte:'0,008 V'},{lettre:'B',texte:'125 V'},{lettre:'C',texte:'20 V'},{lettre:'D',texte:'50,4 V'}], reponseCorrecte:'C', explication:'U = R × I = 50 × 0,4 = 20 V.' },
    { enonce:'Une résistance soumise à U = 9 V laisse passer I = 0,3 A. Sa résistance R vaut :', options:[{lettre:'A',texte:'2,7 Ω'},{lettre:'B',texte:'30 Ω'},{lettre:'C',texte:'9,3 Ω'},{lettre:'D',texte:'0,033 Ω'}], reponseCorrecte:'B', explication:'R = U/I = 9/0,3 = 30 Ω.' },
    { enonce:'Trois résistances R₁ = 10 Ω, R₂ = 15 Ω, R₃ = 25 Ω sont montées en série. R_eq vaut :', options:[{lettre:'A',texte:'50 Ω'},{lettre:'B',texte:'5 Ω'},{lettre:'C',texte:'150 Ω'},{lettre:'D',texte:'50/3 Ω'}], reponseCorrecte:'A', explication:'En série : R_eq = R₁ + R₂ + R₃ = 10 + 15 + 25 = 50 Ω.' },
    { enonce:'Deux résistances R₁ = 6 Ω et R₂ = 12 Ω sont en dérivation. R_eq vaut :', options:[{lettre:'A',texte:'18 Ω'},{lettre:'B',texte:'4 Ω'},{lettre:'C',texte:'9 Ω'},{lettre:'D',texte:'2 Ω'}], reponseCorrecte:'B', explication:'1/R_eq = 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4 → R_eq = 4 Ω.' },
    { enonce:'Dans un montage en série, l\'intensité :', options:[{lettre:'A',texte:'Est différente dans chaque branche'},{lettre:'B',texte:'Est la même partout dans le circuit'},{lettre:'C',texte:'S\'additionne aux nœuds'},{lettre:'D',texte:'Dépend de la résistance de chaque élément'}], reponseCorrecte:'B', explication:'En série, l\'intensité est identique en tous points du circuit (il n\'y a qu\'une seule branche).' },
    { enonce:'Dans un montage en dérivation, la tension :', options:[{lettre:'A',texte:'Est différente pour chaque résistance'},{lettre:'B',texte:'S\'additionne dans chaque branche'},{lettre:'C',texte:'Est la même aux bornes de chaque résistance'},{lettre:'D',texte:'Est nulle pour la plus grande résistance'}], reponseCorrecte:'C', explication:'En dérivation, toutes les branches ont la même tension : U₁ = U₂ = U (tension du générateur).' },
    { enonce:'La résistivité ρ d\'un matériau est exprimée en :', options:[{lettre:'A',texte:'Ohms (Ω)'},{lettre:'B',texte:'Ohms-mètre (Ω·m)'},{lettre:'C',texte:'Ampères (A)'},{lettre:'D',texte:'Volts/mètre (V/m)'}], reponseCorrecte:'B', explication:'La résistivité se mesure en Ω·m (ohms-mètre).' },
    { enonce:'Un fil de cuivre a ρ = 1,7×10⁻⁸ Ω·m, L = 10 m, S = 1 mm² = 10⁻⁶ m². Sa résistance est :', options:[{lettre:'A',texte:'0,17 Ω'},{lettre:'B',texte:'1,7 Ω'},{lettre:'C',texte:'0,017 Ω'},{lettre:'D',texte:'17 Ω'}], reponseCorrecte:'A', explication:'R = ρ × L/S = (1,7×10⁻⁸ × 10)/(10⁻⁶) = 1,7×10⁻⁷/10⁻⁶ = 0,17 Ω.' },
    { enonce:'Quelle est l\'unité de la résistance électrique ?', options:[{lettre:'A',texte:'Ampère (A)'},{lettre:'B',texte:'Volt (V)'},{lettre:'C',texte:'Watt (W)'},{lettre:'D',texte:'Ohm (Ω)'}], reponseCorrecte:'D', explication:'La résistance se mesure en ohms (Ω), en hommage au physicien Georg Ohm.' },
    { enonce:'Pour mesurer la résistance d\'un composant hors tension, on utilise :', options:[{lettre:'A',texte:'Un ampèremètre'},{lettre:'B',texte:'Un voltmètre'},{lettre:'C',texte:'Un ohmmètre'},{lettre:'D',texte:'Un wattmètre'}], reponseCorrecte:'C', explication:'L\'ohmmètre mesure directement la résistance d\'un composant, toujours hors tension.' },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// DONNÉES CHAPITRES
// ═══════════════════════════════════════════════════════════════════════════

const CHAPITRES_PART1 = [
  { code:'PC-3e-L01', titre:'Les lentilles minces', objectif:'Distinguer lentilles convergentes et divergentes, construire géométriquement une image et appliquer la formule de conjugaison et la vergence.', ordre:1, html: injectQCM(L01_HTML, QCM_L01), qcm: QCM_L01 },
  { code:'PC-3e-L02', titre:'Dispersion de la lumière blanche', objectif:'Expliquer la dispersion de la lumière blanche par un prisme, distinguer lumières monochromatique et polychromatique, comprendre l\'arc-en-ciel.', ordre:2, html: injectQCM(L02_HTML, QCM_L02), qcm: QCM_L02 },
  { code:'PC-3e-L03', titre:'Les forces', objectif:'Identifier les caractéristiques d\'une force, calculer le poids, représenter des forces et appliquer les conditions d\'équilibre.', ordre:3, html: injectQCM(L03_HTML, QCM_L03), qcm: QCM_L03 },
  { code:'PC-3e-L04', titre:'Travail et puissance mécanique', objectif:'Calculer le travail d\'une force et la puissance mécanique, distinguer travail moteur, résistant et nul.', ordre:4, html: injectQCM(L04_HTML, QCM_L04), qcm: QCM_L04 },
  { code:'PC-3e-L05', titre:'Électrisation et courant électrique', objectif:'Expliquer l\'électrisation par frottement, comprendre la nature et le sens du courant électrique, calculer l\'intensité.', ordre:5, html: injectQCM(L05_HTML, QCM_L05), qcm: QCM_L05 },
  { code:'PC-3e-L06', titre:'Résistance électrique', objectif:'Appliquer la loi d\'Ohm, calculer la résistance équivalente en série et en dérivation, utiliser la notion de résistivité.', ordre:6, html: injectQCM(L06_HTML, QCM_L06), qcm: QCM_L06 },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connecté à MongoDB (base : tate)');

  const db = mongoose.connection.db;
  const admin = await db.collection('users').findOne({ role: 'admin' });
  if (!admin) throw new Error('Admin introuvable');
  const adminId = admin._id;
  console.log(`✅ Admin : ${admin.email}`);

  // ── Créer ou retrouver la matière PC ──
  let matiere = await Matiere.findOne({ code: 'PC' });
  if (!matiere) {
    matiere = await Matiere.create({ nom: 'Physique-Chimie', code: 'PC', niveaux: ['3eme'], icone: '⚗️', couleur: '#7C3AED', ordre: 4, actif: true, estLangue: false });
    console.log('✅ Matière PC créée');
  } else {
    if (!matiere.niveaux.includes('3eme')) { matiere.niveaux.push('3eme'); await matiere.save(); }
    console.log('ℹ️  Matière PC existante');
  }

  // ── Créer chapitres + leçons + QCMs ──
  for (const ch of CHAPITRES_PART1) {
    // Supprimer ancien chapitre si existe (pour forcer la mise à jour)
    const old = await Chapitre.findOne({ matiereId: matiere._id, niveau: '3eme', titre: ch.titre });
    let chapitre;
    if (old) {
      console.log(`ℹ️  Chapitre "${ch.titre}" existe déjà — mise à jour`);
      chapitre = old;
    } else {
      chapitre = await Chapitre.create({
        matiereId: matiere._id, titre: ch.titre, niveau: '3eme',
        objectif: ch.objectif, ordre: ch.ordre, actif: true, sectionFr: null,
        promptSupplement: 'Niveau 3ème Sénégal. Utilise des exemples africains/sénégalais. Vocabulaire scientifique précis.',
        formatExercices: 'Questions de réflexion, calculs numériques, QCM. Toujours indiquer les unités.',
      });
      console.log(`✅ Chapitre créé : ${ch.titre}`);
    }

    // Leçon
    await Lecon.deleteMany({ chapitreId: chapitre._id });
    await Lecon.create({
      chapitreId: chapitre._id, titre: ch.titre,
      contenuHTML: ch.html, statut: 'publie', creePar: adminId,
    });
    console.log(`   📖 Leçon créée : ${ch.titre}`);

    // QCM
    await Qcm.deleteMany({ chapitreId: chapitre._id });
    await Qcm.create({
      chapitreId: chapitre._id, leconId: null,
      titre: ch.qcm.titre, questions: ch.qcm.questions,
      statut: 'publie', creePar: adminId,
    });
    console.log(`   ✅ QCM créé : ${ch.qcm.titre} (${ch.qcm.questions.length} questions)`);
  }

  await mongoose.disconnect();
  console.log('\n🎉 Part 1 terminée (L01-L06) !');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
