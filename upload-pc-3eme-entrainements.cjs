// ============================================================
// upload-pc-3eme-entrainements.cjs
// Entraînements PC 3ème — BST Joseph Turpin de Kaolack 2019-2020
// Exercices avec corrections complètes
// À exécuter LOCALEMENT : node upload-pc-3eme-entrainements.cjs
// ============================================================
'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

// ── Connexion ────────────────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌ MONGODB_URI manquant dans .env'); process.exit(1); }

// ── Modèle (inline pour éviter les dépendances) ─────────────
const Schema = mongoose.Schema;
const EntSchema = new Schema({
  matiere: String, niveau: String, section: String, chapitre: String,
  ordre: Number, titre: String, source: String, nbExercices: Number,
  contenuHTML: String, correctionHTML: String, publie: Boolean,
}, { timestamps: true });
EntSchema.pre('save', function(next) {
  if (!this.titre) this.titre = `${this.chapitre} — Entraînements`;
  next();
});
const Entrainement = mongoose.models.Entrainement || mongoose.model('Entrainement', EntSchema);

// ── CSS commun (injecté dans chaque iframe) ───────────────────
const CSS = `<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:wght@600;700&display=swap');
  :root { --or:#F97316; --terre:#1C0A00; --violet:#7C3AED; --bleu:#2563EB; --vert:#16A34A; }
  body { font-family:'Inter',sans-serif; font-size:15px; line-height:1.7; color:#1C0A00; background:#fafafa; padding:16px 20px 40px; margin:0; }
  h1 { font-family:'Lora',serif; color:var(--or); font-size:1.2rem; margin-bottom:4px; }
  h2 { font-size:1rem; font-weight:700; color:var(--terre); margin:28px 0 6px; border-left:4px solid var(--or); padding-left:10px; }
  h3 { font-size:.95rem; font-weight:700; color:var(--violet); margin:22px 0 4px; }
  p { margin:.4em 0; }
  ul,ol { margin:.3em 0 .3em 1.4em; padding:0; }
  li { margin:.2em 0; }
  .source { font-size:.8rem; color:#888; font-style:italic; margin-bottom:20px; }
  .exo { background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:14px 18px; margin-bottom:16px; }
  .exo-num { display:inline-block; background:var(--or); color:#fff; font-weight:700; font-size:.8rem; border-radius:20px; padding:2px 10px; margin-bottom:8px; }
  .donnees { background:#f0f9ff; border:1px solid #bae6fd; border-radius:6px; padding:8px 12px; margin:8px 0; font-size:.88rem; }
  .formule { background:#fdf4ff; border:1px solid #e9d5ff; border-radius:6px; padding:6px 12px; font-family:monospace; font-size:.9rem; margin:4px 0; }
  table { width:100%; border-collapse:collapse; margin:8px 0; font-size:.88rem; }
  th { background:#f3f4f6; font-weight:600; padding:6px 10px; border:1px solid #d1d5db; }
  td { padding:5px 10px; border:1px solid #d1d5db; }
  .correct { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px 16px; margin:10px 0; }
  .correct h3 { color:var(--vert); }
  .rep { font-weight:700; color:var(--bleu); }
  .note { background:#fff7ed; border:1px solid #fed7aa; border-radius:6px; padding:8px 12px; font-size:.85rem; margin:6px 0; }
</style>`;

// ── Helper pour créer enoncé + correction ─────────────────────
function makeContenu(section, chapNom, source, exoList) {
  const sColor = section === 'Physique' ? '#2563EB' : '#16A34A';
  let html = `${CSS}
<h1>${section} — ${chapNom}</h1>
<p class="source">Source : ${source}</p>
`;
  for (const exo of exoList) {
    html += `<div class="exo"><span class="exo-num">EXERCICE ${exo.num}</span>${exo.enonce}</div>\n`;
  }
  return html;
}

function makeCorrection(section, chapNom, exoList) {
  let html = `${CSS}
<h1>Correction — ${chapNom}</h1>
`;
  for (const exo of exoList) {
    html += `<div class="correct"><h3>✅ Exercice ${exo.num}</h3>${exo.correction}</div>\n`;
  }
  return html;
}

// ═══════════════════════════════════════════════════════════════
// DONNÉES — 11 chapitres × exercices + corrections
// ═══════════════════════════════════════════════════════════════

const ENTRAINEMENTS = [

// ────────────────────────────────────────────────────────────
// 1. LENTILLES MINCES
// ────────────────────────────────────────────────────────────
{
  section: 'Physique', chapitre: 'Les lentilles minces', ordre: 1, nbExercices: 6,
  exos: [
    {
      num: 1,
      enonce: `<p>Complète les phrases suivantes :</p>
<ol>
<li>Une lentille ____________ est plus épaisse au centre qu'aux bords. Elle est ____________ (convergente / divergente).</li>
<li>La vergence C d'une lentille se mesure en ____________. Elle est liée à la distance focale f' par la relation ____________.</li>
<li>Pour une lentille convergente, le foyer objet F est situé ____________ la lentille par rapport à la lumière incidente.</li>
<li>Le grandissement algébrique γ = ____________ / ____________. Si γ < 0, l'image est ____________.</li>
</ol>`,
      correction: `<ol>
<li>Une lentille <span class="rep">biconvexe</span> est plus épaisse au centre qu'aux bords. Elle est <span class="rep">convergente</span>.</li>
<li>La vergence se mesure en <span class="rep">dioptries (δ)</span>. Relation : <span class="rep">C = 1/f'</span> (f' en mètres).</li>
<li>Le foyer objet F est situé <span class="rep">avant (en amont de)</span> la lentille.</li>
<li>γ = <span class="rep">OA'/OA</span> = <span class="rep">A'B'/AB</span>. Si γ < 0, l'image est <span class="rep">renversée</span>.</li>
</ol>`
    },
    {
      num: 2,
      enonce: `<p>Réponds par Vrai (V) ou Faux (F) :</p>
<ol>
<li>Une lentille biconcave est convergente.</li>
<li>La distance focale d'une lentille de vergence C = 4 δ est f' = 25 cm.</li>
<li>Pour une lentille convergente, si l'objet est au foyer objet F, l'image est rejetée à l'infini.</li>
<li>Le grandissement γ = +2 signifie que l'image est deux fois plus grande et droite.</li>
<li>Pour une lentille divergente, la vergence est positive.</li>
</ol>`,
      correction: `<ol>
<li><span class="rep">Faux</span> — une lentille biconcave est <em>divergente</em>.</li>
<li><span class="rep">Vrai</span> — C = 4 δ → f' = 1/4 = 0,25 m = 25 cm.</li>
<li><span class="rep">Vrai</span> — formule de conjugaison : si OA = OF = −f', alors 1/OA' → ∞.</li>
<li><span class="rep">Vrai</span> — γ > 0 : image droite ; |γ| = 2 : image 2× plus grande.</li>
<li><span class="rep">Faux</span> — pour une lentille divergente, la vergence est <em>négative</em>.</li>
</ol>`
    },
    {
      num: 3,
      enonce: `<p>Une lentille convergente a une distance focale f' = 20 cm.</p>
<ol>
<li>Calcule la vergence C de cette lentille.</li>
<li>Un objet AB est placé à 30 cm devant la lentille (OA = −30 cm). Calcule la position OA' de l'image.</li>
<li>Calcule le grandissement γ.</li>
<li>L'image est-elle réelle ou virtuelle ? Droite ou renversée ? Plus grande ou plus petite ?</li>
</ol>`,
      correction: `<ol>
<li>C = 1/f' = 1/0,20 = <span class="rep">5 dioptries (δ)</span></li>
<li>Formule de conjugaison : 1/OA' − 1/OA = 1/f'<br>
1/OA' = 1/f' + 1/OA = 1/0,20 + 1/(−0,30) = 5 − 3,33 = 1,67<br>
<span class="rep">OA' = +60 cm</span></li>
<li>γ = OA'/OA = 60/(−30) = <span class="rep">−2</span></li>
<li>OA' > 0 → image <span class="rep">réelle</span> ; γ < 0 → image <span class="rep">renversée</span> ; |γ| = 2 → image <span class="rep">2× plus grande</span>.</li>
</ol>`
    },
    {
      num: 4,
      enonce: `<p>On donne : OA = −15 cm, OA' = +60 cm.</p>
<ol>
<li>Calcule la vergence C de la lentille utilisée.</li>
<li>Calcule le grandissement γ et déduis la taille de l'image si l'objet mesure AB = 2 cm.</li>
</ol>`,
      correction: `<ol>
<li>1/f' = 1/OA' − 1/OA = 1/60 − 1/(−15) = 1/60 + 1/15 = 1/60 + 4/60 = 5/60<br>
f' = 60/5 = 12 cm ; <span class="rep">C = 1/0,12 ≈ 8,3 δ</span></li>
<li>γ = OA'/OA = 60/(−15) = <span class="rep">−4</span><br>
A'B' = γ × AB = −4 × 2 = <span class="rep">−8 cm</span> (image renversée, 4× plus grande)</li>
</ol>`
    },
    {
      num: 5,
      enonce: `<p>Une lentille divergente a une vergence C = −5 δ. Un objet est placé à 20 cm devant la lentille.</p>
<ol>
<li>Calcule f' et f.</li>
<li>Calcule OA' (OA = −20 cm).</li>
<li>Caractérise l'image (réelle/virtuelle, droite/renversée, taille relative).</li>
</ol>`,
      correction: `<ol>
<li>f' = 1/C = 1/(−5) = <span class="rep">−0,20 m = −20 cm</span> ; f = −f' = +20 cm</li>
<li>1/OA' = 1/f' + 1/OA = 1/(−20) + 1/(−20) = −2/20<br>
<span class="rep">OA' = −10 cm</span></li>
<li>OA' < 0 → image <span class="rep">virtuelle</span> ; γ = −10/(−20) = +0,5 → image <span class="rep">droite</span>, <span class="rep">2× plus petite</span>.</li>
</ol>`
    },
    {
      num: 6,
      enonce: `<p>Un rétroprojecteur utilise une lentille convergente de vergence C = 2,5 δ. L'objet (transparent) est placé à OA = −60 cm de la lentille.</p>
<ol>
<li>Calcule f'.</li>
<li>Calcule la position OA' de l'image sur l'écran.</li>
<li>Calcule le grandissement. Que peut-on dire de l'image projetée ?</li>
</ol>`,
      correction: `<ol>
<li>f' = 1/C = 1/2,5 = <span class="rep">0,40 m = 40 cm</span></li>
<li>1/OA' = 1/f' + 1/OA = 1/40 + 1/(−60) = 3/120 − 2/120 = 1/120<br>
<span class="rep">OA' = +120 cm</span> (image sur l'écran, côté opposé à l'objet)</li>
<li>γ = 120/(−60) = <span class="rep">−2</span><br>
Image réelle, renversée, 2× plus grande. Le transparent est placé à l'envers pour que l'image apparaisse droite sur l'écran.</li>
</ol>`
    },
  ]
},

// ────────────────────────────────────────────────────────────
// 2. DISPERSION DE LA LUMIÈRE
// ────────────────────────────────────────────────────────────
{
  section: 'Physique', chapitre: 'Dispersion de la lumière blanche', ordre: 2, nbExercices: 5,
  exos: [
    {
      num: 1,
      enonce: `<p>Complète les phrases suivantes :</p>
<ol>
<li>La lumière blanche est une lumière ____________ (monochromatique / polychromatique).</li>
<li>Lorsqu'un prisme décompose la lumière blanche, on obtient un spectre allant du ____________ au ____________ en passant par les couleurs de l'arc-en-ciel.</li>
<li>L'arc-en-ciel est formé par ____________ de la lumière blanche par les ____________ d'eau en suspension.</li>
<li>Le disque de Newton tourne rapidement : la couleur perçue est ____________.</li>
</ol>`,
      correction: `<ol>
<li>La lumière blanche est <span class="rep">polychromatique</span>.</li>
<li>Spectre allant du <span class="rep">violet</span> au <span class="rep">rouge</span> (ordre : violet, indigo, bleu, vert, jaune, orangé, rouge).</li>
<li>L'arc-en-ciel est formé par <span class="rep">la dispersion (réfraction et réflexion)</span> de la lumière blanche par les <span class="rep">gouttelettes</span> d'eau.</li>
<li>Le disque de Newton en rotation rapide : couleur perçue = <span class="rep">blanc (ou blanc grisâtre)</span>.</li>
</ol>`
    },
    {
      num: 2,
      enonce: `<p>Réponds par Vrai ou Faux :</p>
<ol>
<li>La lumière rouge est déviée plus que la lumière violette par un prisme.</li>
<li>Un filtre rouge laisse passer uniquement la lumière rouge.</li>
<li>Un objet vert éclairé par une lumière rouge paraît noir.</li>
<li>La synthèse additive des trois couleurs primaires (rouge, vert, bleu) donne le blanc.</li>
<li>Un prisme sépare les couleurs parce qu'elles ont toutes la même vitesse dans le verre.</li>
</ol>`,
      correction: `<ol>
<li><span class="rep">Faux</span> — c'est la lumière <em>violette</em> qui est déviée davantage.</li>
<li><span class="rep">Vrai</span> — un filtre coloré absorbe toutes les couleurs sauf la sienne.</li>
<li><span class="rep">Vrai</span> — l'objet vert ne réfléchit que la lumière verte ; sans lumière verte, il apparaît noir.</li>
<li><span class="rep">Vrai</span> — synthèse additive : Rouge + Vert + Bleu = Blanc.</li>
<li><span class="rep">Faux</span> — les couleurs ont des vitesses <em>différentes</em> dans le verre (indice différent), c'est pour cela qu'elles sont déviées différemment.</li>
</ol>`
    },
    {
      num: 3,
      enonce: `<p>Un arc-en-ciel est observé après une pluie.</p>
<ol>
<li>Quel phénomène physique est à l'origine de l'arc-en-ciel ?</li>
<li>Quel type de lumière est décomposé ? D'où vient-elle ?</li>
<li>Dans quel ordre les couleurs apparaissent-elles de l'extérieur vers l'intérieur de l'arc ?</li>
<li>Pourquoi ne voit-on l'arc-en-ciel qu'avec le soleil dans le dos ?</li>
</ol>`,
      correction: `<ol>
<li>La <span class="rep">dispersion (réfraction + réflexion interne)</span> de la lumière blanche par les gouttelettes d'eau.</li>
<li>La lumière <span class="rep">blanche (polychromatique)</span> provenant du <span class="rep">Soleil</span>.</li>
<li>De l'extérieur vers l'intérieur : <span class="rep">rouge → orangé → jaune → vert → bleu → indigo → violet</span>.</li>
<li>Car la lumière doit entrer dans les gouttes puis être renvoyée vers l'observateur, ce qui n'est possible qu'avec le Soleil dans son dos.</li>
</ol>`
    },
    {
      num: 4,
      enonce: `<p>Un objet est éclairé par une lumière blanche. Donne la couleur perçue dans chaque cas :</p>
<ol>
<li>Un objet blanc éclairé par lumière rouge.</li>
<li>Un objet rouge éclairé par lumière verte.</li>
<li>Un objet bleu éclairé par lumière bleue.</li>
<li>Un objet jaune éclairé par lumière bleue.</li>
</ol>`,
      correction: `<ol>
<li>Objet blanc réfléchit tout → couleur de la lumière incidente : <span class="rep">rouge</span>.</li>
<li>Objet rouge ne réfléchit que le rouge ; il n'y a pas de rouge dans la lumière verte → <span class="rep">noir</span>.</li>
<li>Objet bleu réfléchit le bleu ; éclairé par bleu → <span class="rep">bleu</span>.</li>
<li>Jaune = rouge + vert ; éclairé par bleu, ni rouge ni vert ne sont présents → <span class="rep">noir</span>.</li>
</ol>`
    },
    {
      num: 5,
      enonce: `<p>Un disque de Newton est divisé en sept secteurs colorés (ROYGBIV) et mis en rotation rapide.</p>
<ol>
<li>Que perçoit l'œil ? Pourquoi ?</li>
<li>Si on supprime le secteur rouge, quelle est la couleur perçue en rotation ?</li>
<li>Quelle propriété de la vision humaine ce disque illustre-t-il ?</li>
</ol>`,
      correction: `<ol>
<li>L'œil perçoit <span class="rep">du blanc (ou gris blanchâtre)</span> car la rotation rapide empêche la distinction des couleurs et les mélange (synthèse additive).</li>
<li>Sans le rouge, les 6 autres couleurs se mélangent → teinte <span class="rep">bleu-vert (cyan)</span>.</li>
<li>La <span class="rep">persistance rétinienne</span> — l'œil « retient » une image environ 1/16ème de seconde, ce qui fusionne les couleurs.</li>
</ol>`
    },
  ]
},

// ────────────────────────────────────────────────────────────
// 3. LES FORCES
// ────────────────────────────────────────────────────────────
{
  section: 'Physique', chapitre: 'Les forces', ordre: 3, nbExercices: 6,
  exos: [
    {
      num: 1,
      enonce: `<p>Complète les phrases suivantes :</p>
<ol>
<li>Une force est caractérisée par quatre éléments : son ____________, sa ____________, son ____________ et son ____________.</li>
<li>Le poids d'un corps est la force exercée par ____________ sur ce corps. Son unité est le ____________.</li>
<li>La relation entre le poids P et la masse m est : P = ____________ avec g = ____________ N/kg sur Terre.</li>
<li>Deux forces sont équilibrées si elles ont même ____________, même ____________, des ____________ contraires et même ____________.</li>
</ol>`,
      correction: `<ol>
<li>Point d'application, <span class="rep">direction</span>, <span class="rep">sens</span>, <span class="rep">intensité (valeur)</span>.</li>
<li>Force exercée par <span class="rep">la Terre (gravitation)</span>. Unité : <span class="rep">Newton (N)</span>.</li>
<li>P = <span class="rep">m × g</span> avec g = <span class="rep">10</span> N/kg.</li>
<li>Même <span class="rep">droite d'action (ligne)</span>, même <span class="rep">intensité</span>, des <span class="rep">sens</span> contraires, même <span class="rep">point d'application</span>.</li>
</ol>`
    },
    {
      num: 2,
      enonce: `<p>Calcule le poids des corps suivants (g = 10 N/kg) :</p>
<ol>
<li>Un élève de masse m = 50 kg.</li>
<li>Un livre de masse m = 400 g.</li>
<li>Un camion de masse m = 3,5 tonnes.</li>
<li>Une bille dont le poids est P = 0,5 N. Quelle est sa masse ?</li>
</ol>`,
      correction: `<ol>
<li>P = 50 × 10 = <span class="rep">500 N</span></li>
<li>m = 400 g = 0,4 kg → P = 0,4 × 10 = <span class="rep">4 N</span></li>
<li>m = 3500 kg → P = 3500 × 10 = <span class="rep">35 000 N = 35 kN</span></li>
<li>m = P/g = 0,5/10 = <span class="rep">0,05 kg = 50 g</span></li>
</ol>`
    },
    {
      num: 3,
      enonce: `<p>Un livre de masse 500 g est posé sur une table horizontale.</p>
<ol>
<li>Nomme et calcule le poids du livre.</li>
<li>Quelle force la table exerce-t-elle sur le livre ? Comment s'appelle-t-elle ?</li>
<li>Le livre est-il en équilibre ? Justifie.</li>
<li>Représente (fléchage) les forces sur un schéma simple.</li>
</ol>`,
      correction: `<ol>
<li>P = m × g = 0,5 × 10 = <span class="rep">5 N</span> — force vers le bas, appliquée au centre du livre.</li>
<li>La table exerce une force de <span class="rep">5 N vers le haut</span> : c'est la <span class="rep">réaction normale (force de contact)</span>.</li>
<li>Oui : les deux forces sont égales, opposées, sur la même droite → le livre est <span class="rep">en équilibre</span>.</li>
<li>Schéma : livre avec flèche ↓ (P = 5 N) et flèche ↑ (R = 5 N) de même longueur.</li>
</ol>`
    },
    {
      num: 4,
      enonce: `<p>On donne les corps A, B, C, D de charges électriques différentes. On observe :</p>
<p>A repousse B ; B attire C ; C attire D.</p>
<ol>
<li>Quels corps portent des charges de même nature ?</li>
<li>Si D porte une charge positive, détermine les signes des charges des autres corps.</li>
<li>Rappelle les lois de Coulomb concernant les interactions entre charges.</li>
</ol>
<p class="note">Note : bien que cette question figure dans la section Forces, elle concerne aussi l'électrostatique.</p>`,
      correction: `<ol>
<li>A et B se repoussent → <span class="rep">même signe</span>. B et C s'attirent → <span class="rep">signes opposés</span>. C et D s'attirent → <span class="rep">signes opposés</span>.</li>
<li>D(+) → C(−) → B(+) → A(+).<br>
<span class="rep">A : positif, B : positif, C : négatif, D : positif.</span></li>
<li>Loi de Coulomb : <em>deux charges de même signe se repoussent ; deux charges de signes contraires s'attirent</em>. La force est proportionnelle au produit des charges et inversement proportionnelle au carré de la distance.</li>
</ol>`
    },
    {
      num: 5,
      enonce: `<p>Un objet de masse m = 2 kg est suspendu à un dynamomètre.</p>
<ol>
<li>Quelle est la lecture du dynamomètre ?</li>
<li>On plonge l'objet dans l'eau. La lecture est alors 12 N. Quelle est la poussée d'Archimède exercée sur l'objet ?</li>
<li>L'objet coule-t-il ou flotte-t-il ? Justifie.</li>
</ol>`,
      correction: `<ol>
<li>P = 2 × 10 = <span class="rep">20 N</span> → le dynamomètre indique 20 N.</li>
<li>Poussée d'Archimède : Fa = P − F_dynamomètre = 20 − 12 = <span class="rep">8 N</span></li>
<li>Fa = 8 N < P = 20 N → l'objet <span class="rep">coule</span> (la poussée ne compense pas le poids).</li>
</ol>`
    },
    {
      num: 6,
      enonce: `<p>Un bloc de bois de masse m = 300 g est accroché à un fil et immergé dans l'eau. La tension du fil est T = 0 N.</p>
<ol>
<li>Calcule le poids P du bloc.</li>
<li>Quelles forces agissent sur le bloc ? Que peut-on dire de leur somme ?</li>
<li>Calcule la poussée d'Archimède Fa.</li>
<li>En déduire le volume V du bloc. (ρ_eau = 1000 kg/m³, g = 10 N/kg)</li>
</ol>`,
      correction: `<ol>
<li>P = 0,3 × 10 = <span class="rep">3 N</span></li>
<li>Forces : poids P (↓), poussée Fa (↑), tension T = 0.<br>Équilibre : P + Fa + T = 0 → Fa = P.</li>
<li><span class="rep">Fa = 3 N</span></li>
<li>Fa = ρ_eau × V × g → V = Fa/(ρ_eau × g) = 3/(1000 × 10) = <span class="rep">3 × 10⁻⁴ m³ = 300 cm³</span></li>
</ol>`
    },
  ]
},

// ────────────────────────────────────────────────────────────
// 4. TRAVAIL ET PUISSANCE MÉCANIQUE
// ────────────────────────────────────────────────────────────
{
  section: 'Physique', chapitre: 'Travail et puissance mécanique', ordre: 4, nbExercices: 6,
  exos: [
    {
      num: 1,
      enonce: `<p>Complète les phrases suivantes :</p>
<ol>
<li>Le travail W d'une force F sur un déplacement d vaut W = ____________.</li>
<li>Le travail est <em>moteur</em> quand F et d sont dans le même ____________ (W ____________ 0).</li>
<li>Le travail est <em>résistant</em> quand F et d sont ____________ (W ____________ 0).</li>
<li>Le travail du poids d'un objet dépend uniquement de ____________ et de ____________.</li>
<li>La puissance P d'un moteur est P = ____________. Son unité est le ____________.</li>
</ol>`,
      correction: `<ol>
<li>W = <span class="rep">F × d × cos(α)</span> (α = angle entre F et le déplacement)</li>
<li>… dans le même <span class="rep">sens</span> (W <span class="rep">></span> 0).</li>
<li>… <span class="rep">opposés</span> (W <span class="rep"><</span> 0).</li>
<li>Dépend uniquement de la <span class="rep">masse (poids)</span> et de la <span class="rep">variation de hauteur Δh</span>.</li>
<li>P = <span class="rep">W/t</span>. Unité : <span class="rep">Watt (W)</span>.</li>
</ol>`
    },
    {
      num: 2,
      enonce: `<p>Un déménageur pousse une caisse de 40 kg sur un plan horizontal sur une distance d = 5 m. La force de frottement s'oppose au mouvement avec f = 50 N. La force exercée par le déménageur est F = 80 N dans le sens du déplacement.</p>
<ol>
<li>Calcule le travail de la force F.</li>
<li>Calcule le travail de la force de frottement f.</li>
<li>Calcule le travail du poids P.</li>
<li>Calcule le travail résultant (travail total).</li>
</ol>`,
      correction: `<ol>
<li>W_F = F × d = 80 × 5 = <span class="rep">400 J</span> (travail moteur)</li>
<li>W_f = −f × d = −50 × 5 = <span class="rep">−250 J</span> (travail résistant)</li>
<li>Déplacement horizontal → Δh = 0 → <span class="rep">W_P = 0 J</span></li>
<li>W_total = 400 + (−250) + 0 = <span class="rep">150 J</span></li>
</ol>`
    },
    {
      num: 3,
      enonce: `<p>Un ascenseur soulève une charge de 500 kg à une hauteur h = 20 m en 40 secondes. (g = 10 N/kg)</p>
<ol>
<li>Calcule le poids de la charge.</li>
<li>Calcule le travail effectué par le moteur de l'ascenseur.</li>
<li>Calcule la puissance du moteur.</li>
</ol>`,
      correction: `<ol>
<li>P = m × g = 500 × 10 = <span class="rep">5 000 N</span></li>
<li>W = P × h = 5000 × 20 = <span class="rep">100 000 J = 100 kJ</span></li>
<li>Puissance = W/t = 100 000/40 = <span class="rep">2 500 W = 2,5 kW</span></li>
</ol>`
    },
    {
      num: 4,
      enonce: `<p>Un vélo et son cycliste ont une masse totale de 80 kg. Le cycliste roule sur une route horizontale à la vitesse constante v = 36 km/h contre une force de résistance de 20 N.</p>
<ol>
<li>Convertis la vitesse en m/s.</li>
<li>Quelle est la force de propulsion exercée par le cycliste (mouvement uniforme) ?</li>
<li>Calcule la puissance développée par le cycliste.</li>
<li>En 10 minutes, quel travail a-t-il fourni ?</li>
</ol>`,
      correction: `<ol>
<li>v = 36 km/h = 36/3,6 = <span class="rep">10 m/s</span></li>
<li>Mouvement uniforme → F_propulsion = F_résistance = <span class="rep">20 N</span></li>
<li>P = F × v = 20 × 10 = <span class="rep">200 W</span></li>
<li>t = 10 min = 600 s → W = P × t = 200 × 600 = <span class="rep">120 000 J = 120 kJ</span></li>
</ol>`
    },
    {
      num: 5,
      enonce: `<p>Une personne soulève à l'aide d'une corde passant sur une poulie un seau rempli de sable d'une hauteur h = 10 m avec une force F = 200 N. La capacité du seau est 10 litres, sa masse à vide m₀ = 1 kg. La densité du sable est 1,5. (g = 10 N/kg)</p>
<ol>
<li>Quelle masse de sable contient le seau ?</li>
<li>Calcule le poids du seau plein de sable.</li>
<li>Calcule le travail moteur fourni par la personne.</li>
<li>Calcule le travail résistant du poids du seau rempli.</li>
<li>À mi-parcours (5 m), la personne s'arrête. Le seau tombe alors sur un chariot à 2 m du sol. Calcule le travail du poids lors de la chute.</li>
</ol>`,
      correction: `<ol>
<li>V = 10 L = 10 dm³ = 10 × 10⁻³ m³ ; ρ_sable = 1,5 × 1000 = 1500 kg/m³<br>
m_sable = ρ × V = 1500 × 0,01 = 15 kg</li>
<li>m_total = 15 + 1 = 16 kg → P = 16 × 10 = <span class="rep">160 N</span></li>
<li>W_F = F × h = 200 × 10 = <span class="rep">2 000 J</span></li>
<li>W_poids_montée = −P × h = −160 × 10 = <span class="rep">−1 600 J</span></li>
<li>Hauteur de chute = 5 − 2 = 3 m (de 5 m à 2 m du sol)<br>
W_poids_chute = P × Δh = 160 × 3 = <span class="rep">480 J</span> (moteur, car le poids et le déplacement sont dans le même sens)</li>
</ol>`
    },
    {
      num: 6,
      enonce: `<p>Un moteur de puissance P = 1,5 kW entraîne une pompe qui élève de l'eau de 10 m. Le rendement de l'ensemble est η = 80 %. (g = 10 N/kg, ρ_eau = 1000 kg/m³)</p>
<ol>
<li>Calcule la puissance utile de la pompe.</li>
<li>En 1 heure, quel travail utile est fourni ?</li>
<li>Quelle masse d'eau est élevée en 1 heure ?</li>
</ol>`,
      correction: `<ol>
<li>η = P_utile/P_abs → P_utile = η × P = 0,80 × 1500 = <span class="rep">1 200 W</span></li>
<li>t = 3600 s → W_utile = P_utile × t = 1200 × 3600 = <span class="rep">4 320 000 J = 4,32 MJ</span></li>
<li>W_utile = m × g × h → m = W_utile/(g × h) = 4 320 000/(10 × 10) = <span class="rep">43 200 kg</span></li>
</ol>`
    },
  ]
},

// ────────────────────────────────────────────────────────────
// 5. ÉLECTRISATION ET COURANT ÉLECTRIQUE
// ────────────────────────────────────────────────────────────
{
  section: 'Physique', chapitre: 'Électrisation et courant électrique', ordre: 5, nbExercices: 6,
  exos: [
    {
      num: 1,
      enonce: `<p>Complète les phrases suivantes :</p>
<ol>
<li>Lorsqu'on frotte une baguette en verre avec de la laine, elle s'est ____________ par frottement et porte des charges ____________.</li>
<li>On a deux types de charges électriques : les charges ____________ (portées par le verre) et les charges ____________ (portées par l'ébonite frottée).</li>
<li>Le courant électrique est un mouvement d'____________ dans un conducteur métallique et un mouvement d'____________ dans un électrolyte.</li>
<li>La quantité d'électricité q a pour unité le ____________ et sa formule est q = ____________.</li>
</ol>`,
      correction: `<ol>
<li>… s'est <span class="rep">électrisée</span> par frottement et porte des charges <span class="rep">positives</span>.</li>
<li>… charges <span class="rep">positives</span> (verre) et charges <span class="rep">négatives</span> (ébonite).</li>
<li>… mouvement d'<span class="rep">électrons (libres)</span> dans un conducteur métallique et mouvement d'<span class="rep">ions</span> dans un électrolyte.</li>
<li>Unité : <span class="rep">Coulomb (C)</span>. Formule : <span class="rep">q = I × t</span>.</li>
</ol>`
    },
    {
      num: 2,
      enonce: `<p>Réponds par Vrai ou Faux :</p>
<ol>
<li>Deux charges de même nature se repoussent.</li>
<li>Le courant électrique est un mouvement d'électrons dans un électrolyte.</li>
<li>Un atome chargé positivement a perdu des électrons.</li>
<li>Un corps chargé positivement présente un déficit d'électrons.</li>
</ol>`,
      correction: `<ol>
<li><span class="rep">Vrai</span> — deux charges de même signe se repoussent.</li>
<li><span class="rep">Faux</span> — dans un électrolyte, ce sont les <em>ions</em> qui se déplacent.</li>
<li><span class="rep">Vrai</span> — perdre des électrons (charges −) laisse un excédent de charges + → ion positif.</li>
<li><span class="rep">Vrai</span> — manque d'électrons = charge positive globale.</li>
</ol>`
    },
    {
      num: 3,
      enonce: `<p>A. Dans un circuit électrique, l'intensité du courant vaut I = 20 mA.</p>
<ol>
<li>Calcule la quantité d'électricité q transportée pendant 24 h (en coulombs puis en ampère-heures).</li>
<li>Calcule le nombre d'électrons traversant ce circuit pendant ce temps.<br><span class="note">On donne : e = 1,6 × 10⁻¹⁹ C</span></li>
</ol>
<p>B. Un fil de cuivre est traversé par 4,5 × 10²² électrons parcouru par un courant d'intensité 4 A. Calcule en minutes et en secondes le temps de passage du courant.</p>`,
      correction: `<p><strong>A.</strong></p>
<ol>
<li>I = 20 mA = 0,02 A ; t = 24 h = 86 400 s<br>
q = I × t = 0,02 × 86 400 = <span class="rep">1 728 C</span><br>
En A·h : q = 0,02 × 24 = <span class="rep">0,48 A·h</span></li>
<li>N = q/e = 1728 / (1,6 × 10⁻¹⁹) = <span class="rep">1,08 × 10²² électrons</span></li>
</ol>
<p><strong>B.</strong></p>
q = N × e = 4,5 × 10²² × 1,6 × 10⁻¹⁹ = 7 200 C<br>
t = q/I = 7200/4 = <span class="rep">1 800 s = 30 minutes</span>`
    },
    {
      num: 4,
      enonce: `<p>Une calculatrice est parcourue par un courant d'intensité I = 6,5 × 10⁻⁶ A. Elle est alimentée par des piles qui débitent une charge q = 75 C.</p>
<ol>
<li>Calcule en jours la durée de fonctionnement de la calculatrice.</li>
</ol>`,
      correction: `<p>t = q/I = 75 / (6,5 × 10⁻⁶) = 11,54 × 10⁶ s</p>
<p>t = 11,54 × 10⁶ / 86 400 ≈ <span class="rep">133,6 jours</span></p>`
    },
    {
      num: 5,
      enonce: `<p>Dans le circuit ci-dessous (série), toutes les lampes sont identiques. L'ampèremètre indique I = 0,68 A.</p>
<ol>
<li>Quel est le type de montage ?</li>
<li>Quelle est l'intensité du courant qui traverse le générateur ?</li>
<li>Quelle est l'intensité traversant chaque lampe L₁, L₂, L₃ ?</li>
<li>Détermine le nombre d'électrons traversant le générateur pendant un quart d'heure.</li>
</ol>
<p class="note">On donne : e = 1,6 × 10⁻¹⁹ C</p>`,
      correction: `<ol>
<li>Montage <span class="rep">mixte</span> : L en série avec (L₂ // L₃).</li>
<li>I_générateur = <span class="rep">0,68 A</span></li>
<li>L₁ est en série : I₁ = 0,68 A. Lampes identiques en dérivation : I₂ = I₃ = 0,68/2 = <span class="rep">0,34 A</span></li>
<li>t = 15 min = 900 s ; q = I × t = 0,68 × 900 = 612 C<br>
N = q/e = 612 / (1,6 × 10⁻¹⁹) = <span class="rep">3,825 × 10²¹ électrons</span></li>
</ol>`
    },
    {
      num: 6,
      enonce: `<p>Le débit d'électrons est le nombre d'électrons passant par seconde dans un conducteur. Une pile a un débit de 6 × 10¹⁸ électrons/seconde. Cette pile (I = 0,96 A) alimente un circuit avec trois lampes dont L₂ et L₃ en dérivation, et l'intensité dans L₂ est le triple de celle dans L₁.</p>
<ol>
<li>Calcule l'intensité du courant traversant cette pile.</li>
<li>Le circuit fonctionne 2 min. Calcule la quantité d'électricité traversant la lampe L₂.</li>
<li>Déduis le nombre d'électrons qui traversent L₂.</li>
</ol>`,
      correction: `<ol>
<li>N/s = 6 × 10¹⁸ ; I = N_par_sec × e = 6 × 10¹⁸ × 1,6 × 10⁻¹⁹ = <span class="rep">0,96 A</span> ✓</li>
<li>I₂ = 3 × I₁. En dérivation : I = I₁ + I₂ = I₁ + 3I₁ = 4I₁ → I₁ = 0,24 A ; I₂ = 0,72 A<br>
t = 2 min = 120 s → q₂ = I₂ × t = 0,72 × 120 = <span class="rep">86,4 C</span></li>
<li>N = q₂/e = 86,4 / (1,6 × 10⁻¹⁹) = <span class="rep">5,4 × 10²⁰ électrons</span></li>
</ol>`
    },
  ]
},

// ────────────────────────────────────────────────────────────
// 6. RÉSISTANCE ÉLECTRIQUE
// ────────────────────────────────────────────────────────────
{
  section: 'Physique', chapitre: 'Résistance électrique', ordre: 6, nbExercices: 6,
  exos: [
    {
      num: 1,
      enonce: `<p>Complète les phrases suivantes :</p>
<ol>
<li>La ____________ est la grandeur qui caractérise la propriété d'un dipôle à laisser passer plus ou moins facilement le courant électrique. Elle se mesure en ____________, symbole ____________.</li>
<li>Pour un conducteur ohmique : la tension U à ses bornes est ____________ à l'intensité I qui le traverse (loi d'Ohm : U = ____________).</li>
<li>Pour un montage en série : R_éq = ____________. En dérivation : 1/R_éq = ____________.</li>
</ol>`,
      correction: `<ol>
<li>La <span class="rep">résistance</span> se mesure en <span class="rep">Ohm</span>, symbole <span class="rep">Ω</span>.</li>
<li>U est <span class="rep">proportionnelle</span> à I. Loi d'Ohm : U = <span class="rep">R × I</span>.</li>
<li>Série : R_éq = <span class="rep">R₁ + R₂ + R₃ + …</span><br>
Dérivation : 1/R_éq = <span class="rep">1/R₁ + 1/R₂ + …</span></li>
</ol>`
    },
    {
      num: 2,
      enonce: `<p>On donne R₁ = 15 Ω ; R₂ = 20 Ω ; R₃ = 25 Ω. Les lampes L₁ et L₂ sont en dérivation, L₃ est en série avec l'ensemble. La tension du générateur est U = 5 V.</p>
<ol>
<li>Calcule la résistance équivalente à L₁ et L₂ en dérivation.</li>
<li>Calcule la résistance équivalente du circuit total.</li>
<li>Calcule l'intensité I₃ traversant L₃.</li>
<li>Calcule les intensités I₁ et I₂.</li>
<li>Calcule la tension aux bornes de chacune des lampes.</li>
</ol>`,
      correction: `<ol>
<li>1/R_{12} = 1/15 + 1/20 = 4/60 + 3/60 = 7/60 → R_{12} = 60/7 ≈ <span class="rep">8,57 Ω</span></li>
<li>R_éq = R_{12} + R₃ = 8,57 + 25 = <span class="rep">33,57 Ω</span></li>
<li>I₃ = U/R_éq = 5/33,57 ≈ <span class="rep">0,149 A</span></li>
<li>U_{12} = U − U_{L3} = 5 − (0,149 × 25) = 5 − 3,73 = 1,27 V<br>
I₁ = 1,27/15 ≈ <span class="rep">0,085 A</span> ; I₂ = 1,27/20 ≈ <span class="rep">0,063 A</span></li>
<li>U_{L3} = 0,149 × 25 ≈ <span class="rep">3,73 V</span> ; U_{L1} = U_{L2} ≈ <span class="rep">1,27 V</span></li>
</ol>`
    },
    {
      num: 3,
      enonce: `<p>On mesure I pour différentes tensions U aux bornes d'un conducteur ohmique :</p>
<table><tr><th>U (V)</th><td>0</td><td>0,5</td><td>1</td><td>1,5</td><td>2</td><td>2,5</td><td>3</td></tr>
<tr><th>I (mA)</th><td>0</td><td>15</td><td>25</td><td>35</td><td>45</td><td>55</td><td>65</td></tr></table>
<ol>
<li>Le résistor est-il conducteur ohmique ? Justifie.</li>
<li>Détermine graphiquement la résistance R.</li>
<li>Quelle est l'intensité du courant pour U = 3 V ? Pour I = 30 mA, quelle est U ?</li>
</ol>`,
      correction: `<ol>
<li><span class="rep">Oui</span> — U et I sont proportionnels (tableau linéaire) → conducteur ohmique.</li>
<li>R = U/I. Prendre un point : U = 3 V, I = 65 mA = 0,065 A<br>
R = 3/0,065 ≈ <span class="rep">46 Ω</span><br>
Vérification : 2/0,045 ≈ 44,4 Ω (légère approximation graphique, environ 45-46 Ω).</li>
<li>Pour U = 3 V → I ≈ <span class="rep">65 mA</span> (lecture directe).<br>
Pour I = 30 mA → U = R × I = 46 × 0,030 ≈ <span class="rep">1,38 V ≈ 1,4 V</span></li>
</ol>`
    },
    {
      num: 4,
      enonce: `<p>Un circuit électrique est constitué d'un générateur relié à deux résistors R₁ = 30 Ω et R₂ inconnue. La résistance équivalente est R_éq = 12 Ω.</p>
<ol>
<li>Les résistors sont-ils montés en série ou en dérivation ? Justifie.</li>
<li>Trouve la valeur de R₂.</li>
<li>Le générateur débite I = 500 mA. Calcule la tension aux bornes du générateur.</li>
<li>Calcule la quantité d'électricité traversant R₂ pendant un quart d'heure.</li>
</ol>`,
      correction: `<ol>
<li><span class="rep">En dérivation</span> — car R_éq = 12 Ω < R₁ = 30 Ω (la résistance équivalente en dérivation est toujours inférieure à la plus petite résistance).</li>
<li>1/R_éq = 1/R₁ + 1/R₂ → 1/12 = 1/30 + 1/R₂ → 1/R₂ = 1/12 − 1/30 = 5/60 − 2/60 = 3/60 = 1/20<br>
<span class="rep">R₂ = 20 Ω</span></li>
<li>U = R_éq × I = 12 × 0,5 = <span class="rep">6 V</span></li>
<li>I₂ = U/R₂ = 6/20 = 0,3 A ; t = 15 min = 900 s<br>
q₂ = I₂ × t = 0,3 × 900 = <span class="rep">270 C</span></li>
</ol>`
    },
    {
      num: 5,
      enonce: `<p>On considère le circuit avec R₁ = 25 Ω, R₂ = 15 Ω, R₃ = 10 Ω. R₂ et R₃ sont en dérivation, et l'ensemble est en série avec R₁. La tension U_AB = 8 V.</p>
<ol>
<li>Détermine la résistance équivalente de la portion AB.</li>
<li>Calcule l'intensité du courant I puis I₂.</li>
<li>Déduis I₁.</li>
<li>Évalue la tension aux bornes de chaque résistor.</li>
</ol>`,
      correction: `<ol>
<li>1/R_{23} = 1/15 + 1/10 = 2/30 + 3/30 = 5/30 → R_{23} = 6 Ω<br>
R_AB = R₁ + R_{23} = 25 + 6 = <span class="rep">31 Ω</span></li>
<li>I = U_AB/R_AB = 8/31 ≈ <span class="rep">0,258 A</span><br>
U_{23} = I × R_{23} = 0,258 × 6 = 1,55 V → I₂ = U_{23}/R₂ = 1,55/15 ≈ <span class="rep">0,103 A</span></li>
<li>I₁ = I = <span class="rep">0,258 A</span> (série)</li>
<li>U_{R1} = I × R₁ = 0,258 × 25 ≈ <span class="rep">6,45 V</span> ; U_{R2} = U_{R3} ≈ <span class="rep">1,55 V</span></li>
</ol>`
    },
    {
      num: 6,
      enonce: `<p>Un circuit électrique fermé comprend un générateur (U_PN = 40 V), R₁ = 3 Ω, R₂ inconnu, R₃ = 2 Ω, R₄ = 5 Ω. I₁ = 3 A. À la fermeture de l'interrupteur, le voltmètre indique 25 V.</p>
<ol>
<li>Quelle est la valeur indiquée par l'ampèremètre en série principale ?</li>
<li>Quelle est la valeur de I₂ ?</li>
<li>Calcule la tension aux bornes de R₁ et R₃. Déduis R₂.</li>
</ol>`,
      correction: `<ol>
<li>Le voltmètre indique U aux bornes d'une partie du circuit = 25 V. La branche R₄ est en série : U_R4 = U_PN − 25 = 40 − 25 = 15 V → I = 15/5 = <span class="rep">3 A</span></li>
<li>R₁ et R₃ sont en série dans une branche ; I₁ = 3 A. Branche parallèle I₂ = I − I₁ = 3 − 3 = 0 A ?<br>
<span class="note">Données insuffisantes pour déterminer R₂ précisément sans le schéma complet. Méthode : U_R1 = I₁ × R₁ = 3 × 3 = 9 V ; U_R3 = 3 × 2 = 6 V ; U_{R1+R3} = 15 V ; U_R2 = 25 − 15 = 10 V → R₂ = U_R2/I₂.</span></li>
<li>U_{R1} = 9 V ; U_{R3} = 6 V. Si I₂ est connu : R₂ = U_R2/I₂.</li>
</ol>`
    },
  ]
},

// ────────────────────────────────────────────────────────────
// 7. TRANSFORMATION D'ÉNERGIE
// ────────────────────────────────────────────────────────────
{
  section: 'Physique', chapitre: "Transformation d'énergie", ordre: 7, nbExercices: 6,
  exos: [
    {
      num: 1,
      enonce: `<p>Complète les phrases suivantes :</p>
<ol>
<li>L'énergie cinétique d'un système dépend de sa ____________ et de sa ____________. Son expression est E_c = ____________. Son unité dans le S.I est le ____________.</li>
<li>L'énergie ____________ est la somme de l'énergie cinétique et de l'énergie ____________.</li>
<li>Dans un fer à repasser électrique, l'énergie ____________ se transforme en énergie ____________.</li>
<li>La puissance électrique s'exprime en ____________.</li>
<li>Le rapport de l'énergie utile par l'énergie absorbée représente le ____________ d'un moteur.</li>
</ol>`,
      correction: `<ol>
<li>… masse et vitesse. E_c = <span class="rep">½ × m × v²</span>. Unité : <span class="rep">Joule (J)</span>.</li>
<li>Énergie <span class="rep">mécanique (Em)</span> = E_c + énergie <span class="rep">potentielle (Ep)</span>.</li>
<li>Énergie <span class="rep">électrique</span> → énergie <span class="rep">thermique (calorifique)</span>.</li>
<li>La puissance électrique s'exprime en <span class="rep">Watt (W)</span>.</li>
<li>… représente le <span class="rep">rendement (η)</span>.</li>
</ol>`
    },
    {
      num: 2,
      enonce: `<p>Un objet de masse 400 g est maintenu immobile à 5 m au-dessus du sol. (g = 10 N/kg)</p>
<ol>
<li>Quelle est la nature de l'énergie possédée par cet objet ?</li>
<li>Calcule sa valeur en joules.</li>
<li>Lors de sa chute, que devient cette énergie ? Donne l'expression de cette nouvelle forme.</li>
<li>Que devient cette énergie si l'objet est au sol ?</li>
</ol>`,
      correction: `<ol>
<li>L'objet possède de l'<span class="rep">énergie potentielle de pesanteur (Ep)</span>.</li>
<li>Ep = m × g × h = 0,4 × 10 × 5 = <span class="rep">20 J</span></li>
<li>En chutant, l'Ep se transforme en <span class="rep">énergie cinétique : E_c = ½mv²</span>. (Ep → Ec, Em conservée)</li>
<li>Au sol (h = 0) : E_p = 0 ; toute l'énergie est cinétique. À l'impact, elle se transforme en <span class="rep">énergie thermique et sonore</span>.</li>
</ol>`
    },
    {
      num: 3,
      enonce: `<p>Une ampoule électrique fonctionne sous une tension continue de 9 V. Elle est traversée par un courant d'intensité 1,7 A.</p>
<ol>
<li>Calcule la puissance de cette lampe.</li>
<li>Elle est allumée pendant 2 heures.<br>
  2.1. Calcule l'énergie consommée en joules et en wattheures.<br>
  2.2. Calcule la résistance du filament de la lampe.</li>
</ol>`,
      correction: `<ol>
<li>P = U × I = 9 × 1,7 = <span class="rep">15,3 W</span></li>
<li>t = 2 h = 7 200 s<br>
2.1. E = P × t = 15,3 × 7200 = <span class="rep">110 160 J ≈ 110,2 kJ</span> = 15,3 × 2 = <span class="rep">30,6 Wh</span><br>
2.2. Loi d'Ohm : R = U/I = 9/1,7 ≈ <span class="rep">5,3 Ω</span></li>
</ol>`
    },
    {
      num: 4,
      enonce: `<p>Un moteur à courant continu fonctionne sous 120 V et sa résistance interne est R = 200 Ω.</p>
<ol>
<li>Calcule l'intensité du courant qui le traverse.</li>
<li>Calcule la puissance dissipée par effet Joule.</li>
<li>Calcule l'énergie consommée en 2 h de fonctionnement.</li>
</ol>`,
      correction: `<ol>
<li>I = U/R = 120/200 = <span class="rep">0,6 A</span></li>
<li>P_Joule = R × I² = 200 × 0,36 = <span class="rep">72 W</span><br>
(Ou P = U × I = 120 × 0,6 = 72 W)</li>
<li>E = P × t = 72 × 2 × 3600 = <span class="rep">518 400 J ≈ 518,4 kJ</span></li>
</ol>`
    },
    {
      num: 5,
      enonce: `<p>Un atelier de couture emploie 10 ouvriers. Chaque machine à coudre a une puissance nominale de 150 W. Chaque poste est éclairé par une ampoule de 100 W. L'abonnement est de 15 A sous une tension de 220 V.</p>
<ol>
<li>Peut-on installer des postes de travail supplémentaires ?</li>
<li>Si oui, combien ?</li>
</ol>`,
      correction: `<p>Puissance maximale disponible : P_max = U × I_max = 220 × 15 = <span class="rep">3 300 W</span></p>
<p>Puissance par poste : P_poste = 150 + 100 = 250 W</p>
<p>Nombre de postes possibles : n = 3300 / 250 = 13,2 → <span class="rep">13 postes maximum</span></p>
<p>Postes actuels = 10 → On peut ajouter <span class="rep">3 postes supplémentaires</span>.</p>`
    },
    {
      num: 6,
      enonce: `<p>Une usine hydraulique reçoit l'eau d'un lac à 600 m d'altitude. L'usine est à 100 m d'altitude. Le débit de la chute est 1800 m³/min. (g = 10 N/kg, ρ_eau = 1000 kg/m³)</p>
<ol>
<li>Détermine le volume d'eau qui tombe chaque seconde.</li>
<li>Calcule la masse m₁ de ce volume.</li>
<li>Calcule la valeur de l'énergie potentielle que possède cette masse à 600 m et à 100 m.</li>
<li>Calcule l'énergie cinétique à l'arrivée (vitesse de départ ≈ 0).</li>
</ol>`,
      correction: `<ol>
<li>V₁ = 1800/60 = <span class="rep">30 m³/s</span></li>
<li>m₁ = ρ × V₁ = 1000 × 30 = <span class="rep">30 000 kg</span></li>
<li>Ep(600) = m₁ × g × 600 = 30000 × 10 × 600 = <span class="rep">180 × 10⁶ J = 180 MJ</span><br>
Ep(100) = 30000 × 10 × 100 = <span class="rep">30 MJ</span></li>
<li>ΔEp = 180 − 30 = 150 MJ → Ec à l'arrivée = <span class="rep">150 MJ</span> (conservation de l'énergie)</li>
</ol>`
    },
  ]
},

// ────────────────────────────────────────────────────────────
// 8. NOTION DE SOLUTION (Solutions aqueuses)
// ────────────────────────────────────────────────────────────
{
  section: 'Chimie', chapitre: 'Solutions aqueuses', ordre: 8, nbExercices: 6,
  exos: [
    {
      num: 1,
      enonce: `<p>Complète les phrases suivantes :</p>
<ol>
<li>La concentration massique d'une solution est la ____________ de soluté par litre de solution.</li>
<li>Le nombre de moles de soluté par litre de solution est appelé ____________.</li>
<li>Une solution décimolaire contient ____________ mol de soluté par litre de solution.</li>
<li>Le solvant est le corps qui ____________, le soluté est le corps qui ____________.</li>
<li>Une solution aqueuse est une solution dont le solvant est ____________.</li>
<li>Lors d'une dilution, la concentration ____________ mais le nombre de moles de soluté ____________.</li>
</ol>`,
      correction: `<ol>
<li>… la <span class="rep">masse (en g)</span> de soluté par litre de solution.</li>
<li>… <span class="rep">concentration molaire (ou molarité) C</span>.</li>
<li>… <span class="rep">0,1 mol/L</span>.</li>
<li>Solvant = <span class="rep">dissout</span> ; soluté = <span class="rep">est dissout</span>.</li>
<li>… solvant est <span class="rep">l'eau</span>.</li>
<li>La concentration <span class="rep">diminue</span> mais le nombre de moles de soluté <span class="rep">reste constant</span>.</li>
</ol>`
    },
    {
      num: 2,
      enonce: `<p>Calcule la concentration molaire des solutions suivantes :</p>
<ol>
<li>Solution A : 0,2 mol de chlorure de zinc (ZnCl₂) dans 250 cm³ de solution.</li>
<li>Solution B : 122,5 g d'acide sulfurique (H₂SO₄) dans 500 mL d'eau pure.<br><span class="note">M(H₂SO₄) = 98 g/mol</span></li>
<li>Solution C : 44,8 L de gaz chlorhydrique (HCl) dans 1 litre d'eau distillée dans les CNTP.<br><span class="note">V_M = 22,4 L/mol ; M(HCl) = 36,5 g/mol</span></li>
</ol>`,
      correction: `<ol>
<li>V = 250 cm³ = 0,25 L → C_A = n/V = 0,2/0,25 = <span class="rep">0,8 mol/L</span></li>
<li>n = m/M = 122,5/98 = 1,25 mol ; V = 0,5 L → C_B = 1,25/0,5 = <span class="rep">2,5 mol/L</span></li>
<li>n = V_gaz/V_M = 44,8/22,4 = 2 mol ; V_sol = 1 L → C_C = <span class="rep">2 mol/L</span><br>
Cm_C = C × M = 2 × 36,5 = <span class="rep">73 g/L</span></li>
</ol>`
    },
    {
      num: 3,
      enonce: `<p>On introduit 6 g d'hydroxyde de sodium solide (NaOH) dans 200 mL d'eau pure.</p>
<ol>
<li>Cite le solvant et le soluté.</li>
<li>Calcule la concentration massique Cm de la solution obtenue.</li>
<li>Détermine la masse molaire de NaOH.</li>
<li>Calcule le nombre de moles de NaOH contenu dans la solution.</li>
<li>Calcule la concentration molaire C de la solution.<br><span class="note">M(Na) = 23 g/mol ; M(O) = 16 g/mol ; M(H) = 1 g/mol</span></li>
</ol>`,
      correction: `<ol>
<li>Solvant : <span class="rep">eau (H₂O)</span> ; Soluté : <span class="rep">NaOH</span></li>
<li>Cm = m/V = 6/0,2 = <span class="rep">30 g/L</span></li>
<li>M(NaOH) = 23 + 16 + 1 = <span class="rep">40 g/mol</span></li>
<li>n = m/M = 6/40 = <span class="rep">0,15 mol</span></li>
<li>C = n/V = 0,15/0,2 = <span class="rep">0,75 mol/L</span></li>
</ol>`
    },
    {
      num: 4,
      enonce: `<p>Pour préparer une solution de NaCl, on dissout 5,85 g de NaCl dans 200 mL d'eau.</p>
<ol>
<li>Détermine la concentration massique Cm de la solution.</li>
<li>Déduis la molarité de la solution. (M(NaCl) = 58,5 g/mol)</li>
<li>On effectue un prélèvement de 60 mL de cette solution que l'on dilue avec 40 mL d'eau pure pour obtenir une solution A. Détermine le volume et la concentration molaire de A.</li>
</ol>`,
      correction: `<ol>
<li>Cm = 5,85/0,2 = <span class="rep">29,25 g/L</span></li>
<li>C = Cm/M = 29,25/58,5 = <span class="rep">0,5 mol/L</span></li>
<li>V_A = 60 + 40 = <span class="rep">100 mL = 0,1 L</span><br>
Dilution : C₁V₁ = C_A × V_A → C_A = (0,5 × 0,06)/0,1 = <span class="rep">0,3 mol/L</span></li>
</ol>`
    },
    {
      num: 5,
      enonce: `<p>On désire préparer 1 litre de solution mère de nitrate de fer III [Fe(NO₃)₃] de concentration molaire C = 0,1 mol/L.</p>
<ol>
<li>Vérifie que la masse molaire du nitrate de fer III vaut 242 g/mol.<br><span class="note">M(Fe) = 56 ; M(N) = 14 ; M(O) = 16</span></li>
<li>Quelle masse de ce produit doit-on peser ?</li>
<li>On désire préparer 250 mL d'une solution fille de concentration C₂ = 0,02 mol/L. Quel volume de la solution mère doit-on prélever ?</li>
</ol>`,
      correction: `<ol>
<li>M[Fe(NO₃)₃] = 56 + 3 × (14 + 3 × 16) = 56 + 3 × 62 = 56 + 186 = <span class="rep">242 g/mol ✓</span></li>
<li>m = C × V × M = 0,1 × 1 × 242 = <span class="rep">24,2 g</span></li>
<li>C₁V₁ = C₂V₂ → V₁ = (0,02 × 0,25)/0,1 = 0,005/0,1 = <span class="rep">0,05 L = 50 mL</span></li>
</ol>`
    },
    {
      num: 6,
      enonce: `<p>Une solution S de sulfate de sodium (Na₂SO₄) est obtenue en dissolvant m = 14,2 g dans 1 dm³ d'eau pure. On répartit S dans deux récipients X (600 mL) et Y (400 mL).</p>
<ol>
<li>Calcule la concentration molaire C de S. (M(Na₂SO₄) = 142 g/mol)</li>
<li>Dans X, on ajoute 100 mL d'eau pure → solution A₁. Dans Y, on prélève 50 mL qu'on complète à 100 mL → solution A₂.</li>
<li>Calcule la molarité C_{A1} de A₁ et C_{A2} de A₂.</li>
</ol>`,
      correction: `<ol>
<li>n = 14,2/142 = 0,1 mol ; V = 1 L → C = <span class="rep">0,1 mol/L</span></li>
<li>Solution A₁ (dilution de X) : n_X = 0,1 × 0,6 = 0,06 mol ; V_{A1} = 700 mL<br>
C_{A1} = 0,06/0,7 ≈ <span class="rep">0,086 mol/L</span><br>
Solution A₂ (prélèvement + dilution de Y) : 50 mL de Y contient n = 0,1 × 0,05 = 0,005 mol ; complété à 100 mL<br>
C_{A2} = 0,005/0,1 = <span class="rep">0,05 mol/L</span></li>
</ol>`
    },
  ]
},

// ────────────────────────────────────────────────────────────
// 9. ACIDES ET BASES
// ────────────────────────────────────────────────────────────
{
  section: 'Chimie', chapitre: 'Acides et bases', ordre: 9, nbExercices: 6,
  exos: [
    {
      num: 1,
      enonce: `<p>Complète les phrases suivantes :</p>
<ol>
<li>Le BBT change de couleur selon la nature de la solution : en milieu acide il est ____________, en milieu basique il est ____________, en milieu neutre il est ____________.</li>
<li>Les solutions qui conduisent le courant électrique sont des ____________.</li>
<li>Dans une réaction acido-basique, l'élévation de la température notée par le thermomètre montre que la réaction est ____________.</li>
<li>La réaction entre un acide et une base donne du ____________ et de l'eau.</li>
</ol>`,
      correction: `<ol>
<li>BBT en milieu acide : <span class="rep">jaune</span> ; basique : <span class="rep">bleu</span> ; neutre : <span class="rep">vert</span>.</li>
<li>… des <span class="rep">électrolytes</span>.</li>
<li>… réaction <span class="rep">exothermique</span>.</li>
<li>… donne du <span class="rep">sel</span> et de l'eau.</li>
</ol>`
    },
    {
      num: 2,
      enonce: `<p>Un bécher contient 30 mL d'une solution d'hydroxyde de sodium (Na⁺ + OH⁻) de concentration Cb. On neutralise cette solution par une solution d'acide chlorhydrique (H⁺ + Cl⁻) de molarité Ca = 1,5 mol/L. Il a fallu verser 20 mL d'acide pour l'opération.</p>
<ol>
<li>Donne le schéma du montage permettant de faire l'expérience.</li>
<li>Quelle est la coloration du BBT au début et au point équivalent ?</li>
<li>Calcule la concentration massique de l'acide. (M(HCl) = 36,5 g/mol)</li>
<li>Calcule la concentration molaire de la base.</li>
<li>On ajoute 10 mL d'acide dans le mélange obtenu au point équivalent. Quelle est la nature de la nouvelle solution ?</li>
</ol>`,
      correction: `<ol>
<li>Montage de neutralisation : bécher avec la base + BBT + burette d'acide au-dessus.</li>
<li>Au début (base) : BBT <span class="rep">bleu</span>. Au point équivalent : BBT <span class="rep">vert</span>.</li>
<li>Cm_acide = Ca × M(HCl) = 1,5 × 36,5 = <span class="rep">54,75 g/L</span></li>
<li>Point équivalent : Ca × Va = Cb × Vb → Cb = (1,5 × 0,02)/0,03 = <span class="rep">1 mol/L</span></li>
<li>L'acide est en excès → la solution devient <span class="rep">acide</span> (BBT vire au jaune).</li>
</ol>`
    },
    {
      num: 3,
      enonce: `<p>On effectue un mélange d'une solution S d'acide chlorhydrique de molarité C_S = 0,5 mol/L et de volume V_S = 100 mL avec une solution S₁ d'hydroxyde de sodium de volume V_{S1} = 80 mL et de concentration C_{S1} = 0,8 mol/L.</p>
<ol>
<li>Quelle est la nature des solutions S et S₁ ?</li>
<li>Le mélange obtenu est-il acide, basique ou neutre ? Justifie.</li>
<li>Calcule la concentration molaire volumique C' du mélange.</li>
<li>Quel volume d'acide ou de base faut-il ajouter pour neutraliser complètement le mélange ?</li>
</ol>`,
      correction: `<ol>
<li>S est <span class="rep">acide</span> (contient H⁺) ; S₁ est <span class="rep">basique</span> (contient OH⁻).</li>
<li>n(H⁺) = 0,5 × 0,1 = 0,05 mol ; n(OH⁻) = 0,8 × 0,08 = 0,064 mol<br>
n(OH⁻) > n(H⁺) → excès de base → mélange <span class="rep">basique</span>.</li>
<li>V_mélange = 100 + 80 = 180 mL = 0,18 L<br>
n_OH⁻_excès = 0,064 − 0,05 = 0,014 mol<br>
C' = 0,014/0,18 ≈ <span class="rep">0,078 mol/L</span></li>
<li>Pour neutraliser : ajouter de l'acide. n(H⁺) nécessaire = 0,014 mol.<br>
Si on utilise l'acide S (Ca = 0,5 mol/L) : V_acide = 0,014/0,5 = <span class="rep">28 mL</span></li>
</ol>`
    },
    {
      num: 4,
      enonce: `<p>On dispose de 400 mL d'une solution S₁ d'hydroxyde de potassium (K⁺ + OH⁻) de concentration massique 22,4 g/L. On prélève 100 mL de cette solution pour la diluer en y ajoutant 300 mL d'eau pure → solution S₂.</p>
<ol>
<li>Calcule la concentration molaire C₁ de S₁. (M(KOH) = 56 g/mol)</li>
<li>Calcule le nombre de moles n₁ de soluté dans S₁.</li>
<li>Calcule la molarité et la concentration massique de S₂.</li>
<li>Quel volume d'acide chlorhydrique de concentration 0,2 mol/L faut-il ajouter à S₂ pour la neutraliser ?</li>
</ol>`,
      correction: `<ol>
<li>C₁ = Cm/M = 22,4/56 = <span class="rep">0,4 mol/L</span></li>
<li>n₁ = C₁ × V_{S1} = 0,4 × 0,4 = <span class="rep">0,16 mol</span></li>
<li>S₂ : prélèvement 100 mL de S₁ → n_prélevé = 0,4 × 0,1 = 0,04 mol ; V_{S2} = 400 mL<br>
C₂ = 0,04/0,4 = <span class="rep">0,1 mol/L</span> ; Cm₂ = 0,1 × 56 = <span class="rep">5,6 g/L</span></li>
<li>n(OH⁻) dans S₂ = 0,1 × 0,4 = 0,04 mol<br>
V_acide = n/Ca = 0,04/0,2 = <span class="rep">0,2 L = 200 mL</span></li>
</ol>`
    },
    {
      num: 5,
      enonce: `<p>Pour neutraliser une solution de soude (NaOH), Ali prépare une solution d'acide chlorhydrique en dissolvant V = 2,4 L de gaz HCl dans 500 mL d'eau pure. Il met 125 mL de cette solution acide dans un bécher avec quelques gouttes de BBT et la solution de soude 0,5 mol/L dans la burette. (M(NaOH) = 40 g/mol ; M(HCl) = 36,5 g/mol ; V_M = 24 L/mol)</p>
<ol>
<li>Calcule la concentration molaire de la solution acide.</li>
<li>Calcule la concentration massique de deux manières différentes.</li>
<li>Détermine le volume de soude versé pour la neutralisation.</li>
<li>Calcule la masse de sel de cuisine formé.</li>
</ol>`,
      correction: `<ol>
<li>n(HCl) = V_gaz/V_M = 2,4/24 = 0,1 mol ; V_sol = 0,5 L<br>
Ca = 0,1/0,5 = <span class="rep">0,2 mol/L</span></li>
<li>Méthode 1 : Cm = Ca × M = 0,2 × 36,5 = <span class="rep">7,3 g/L</span><br>
Méthode 2 : m = n × M = 0,1 × 36,5 = 3,65 g dans 0,5 L → Cm = 3,65/0,5 = 7,3 g/L ✓</li>
<li>Neutralisation : Ca × Va = Cb × Vb → Vb = (0,2 × 0,125)/0,5 = <span class="rep">0,05 L = 50 mL</span></li>
<li>n(NaCl) = Ca × Va = 0,2 × 0,125 = 0,025 mol<br>
m(NaCl) = 0,025 × 58,5 = <span class="rep">1,46 g</span></li>
</ol>`
    },
    {
      num: 6,
      enonce: `<p>On dispose de trois solutions X, Y, Z. X est 300 mL de soude (Na⁺ + OH⁻) à 0,6 mol/L. Y est obtenu en diluant X au 1/3. Z est le mélange de X et Y.</p>
<ol>
<li>Quelle est la coloration du BBT dans chacune des solutions ?</li>
<li>Quel est le volume de la solution Y ?</li>
<li>Quel volume d'eau ajouter à X pour obtenir Y ?</li>
<li>Quel est le nombre de moles de soluté dans Z ?</li>
<li>Quelle est la molarité de Z ?</li>
<li>Quel volume d'une solution A d'acide (Ca = 1 mol/L) faut-il pour neutraliser Z ?</li>
</ol>`,
      correction: `<ol>
<li>X, Y, Z sont toutes basiques (OH⁻) → BBT <span class="rep">bleu</span> dans les trois.</li>
<li>Diluer au 1/3 signifie C_Y = C_X/3 et V_Y = 3 × V_X = 3 × 300 = <span class="rep">900 mL</span></li>
<li>V_eau = V_Y − V_X = 900 − 300 = <span class="rep">600 mL</span></li>
<li>n_Z = n_X + n_Y = (0,6 × 0,3) + (0,2 × 0,9) = 0,18 + 0,18 = <span class="rep">0,36 mol</span></li>
<li>V_Z = 300 + 900 = 1200 mL = 1,2 L → C_Z = 0,36/1,2 = <span class="rep">0,3 mol/L</span></li>
<li>V_A = n_Z/Ca = 0,36/1 = <span class="rep">0,36 L = 360 mL</span></li>
</ol>`
    },
  ]
},

// ────────────────────────────────────────────────────────────
// 10. PROPRIÉTÉS CHIMIQUES DES MÉTAUX USUELS
// ────────────────────────────────────────────────────────────
{
  section: 'Chimie', chapitre: 'Propriétés chimiques des métaux usuels', ordre: 10, nbExercices: 6,
  exos: [
    {
      num: 1,
      enonce: `<p>Complète et équilibre les équations bilan des réactions suivantes :</p>
<ol>
<li>Fe + O₂ → Fe₂O₃</li>
<li>Cu + O₂ → oxyde cuivreux (Cu₂O)</li>
<li>Al + O₂ → Al₂O₃ (alumine)</li>
<li>Fe + acide sulfurique dilué → ... + H₂</li>
<li>Al + HCl → chlorure d'aluminium + H₂</li>
<li>Pb + (H⁺ + Cl⁻) → PbCl₂ + H₂</li>
</ol>`,
      correction: `<ol>
<li><span class="rep">4Fe + 3O₂ → 2Fe₂O₃</span></li>
<li><span class="rep">4Cu + O₂ → 2Cu₂O</span> (oxyde cuivreux)</li>
<li><span class="rep">4Al + 3O₂ → 2Al₂O₃</span></li>
<li><span class="rep">Fe + H₂SO₄ → FeSO₄ + H₂↑</span></li>
<li><span class="rep">2Al + 6HCl → 2AlCl₃ + 3H₂↑</span></li>
<li><span class="rep">Pb + 2HCl → PbCl₂ + H₂↑</span></li>
</ol>`
    },
    {
      num: 2,
      enonce: `<p>En brûlant du cuivre dans l'air, on obtient deux oxydes de cuivre.</p>
<ol>
<li>Lesquels ? Écris les équations bilan de leurs formations.</li>
<li>Calcule le volume de dioxygène nécessaire pour obtenir 7,2 g d'oxyde cuivreux (Cu₂O).<br><span class="note">M(Cu) = 64 g/mol ; M(O) = 16 g/mol ; V_m = 22,4 L/mol</span></li>
<li>Quelle est la masse de cuivre ainsi oxydé ?</li>
</ol>`,
      correction: `<ol>
<li>Oxyde cuivreux : <span class="rep">4Cu + O₂ → 2Cu₂O</span><br>
Oxyde cuivrique : <span class="rep">2Cu + O₂ → 2CuO</span></li>
<li>M(Cu₂O) = 2 × 64 + 16 = 144 g/mol<br>
n(Cu₂O) = 7,2/144 = 0,05 mol<br>
Équation : 4Cu + O₂ → 2Cu₂O → n(O₂) = n(Cu₂O)/2 = 0,025 mol<br>
V(O₂) = 0,025 × 22,4 = <span class="rep">0,56 L</span></li>
<li>n(Cu) = 2 × n(Cu₂O) = 0,1 mol → m(Cu) = 0,1 × 64 = <span class="rep">6,4 g</span></li>
</ol>`
    },
    {
      num: 3,
      enonce: `<p>On fait agir une solution diluée d'acide chlorhydrique (H⁺ + Cl⁻) sur 16,25 g de zinc.</p>
<ol>
<li>Écris l'équation bilan de cette réaction.</li>
<li>Nomme les produits formés.</li>
<li>Précise le nom du gaz formé et détermine son volume dans les CNTP.</li>
<li>Calcule la masse du composé ionique (sel) formé.</li>
<li>Calcule le volume d'acide utilisé si C = 0,8 mol/L.<br><span class="note">M(Zn) = 65 g/mol ; M(Cl) = 35,5 g/mol ; V_m = 22,4 L/mol</span></li>
</ol>`,
      correction: `<ol>
<li><span class="rep">Zn + 2HCl → ZnCl₂ + H₂↑</span></li>
<li>Produits : chlorure de zinc (ZnCl₂) et dihydrogène (H₂).</li>
<li>Gaz : <span class="rep">dihydrogène H₂</span><br>
n(Zn) = 16,25/65 = 0,25 mol → n(H₂) = 0,25 mol<br>
V(H₂) = 0,25 × 22,4 = <span class="rep">5,6 L</span></li>
<li>n(ZnCl₂) = n(Zn) = 0,25 mol ; M(ZnCl₂) = 65 + 2 × 35,5 = 136 g/mol<br>
m(ZnCl₂) = 0,25 × 136 = <span class="rep">34 g</span></li>
<li>n(HCl) = 2 × n(Zn) = 0,5 mol → V_acide = 0,5/0,8 = <span class="rep">0,625 L = 625 mL</span></li>
</ol>`
    },
    {
      num: 4,
      enonce: `<p>L'oxyde ferrique Fe₂O₃ constitue la rouille. Un morceau de fer de masse 14 g est complètement transformé en Fe₂O₃.</p>
<ol>
<li>Quel est le constituant de l'air responsable de cette réaction ?</li>
<li>Écris l'équation bilan de la formation de l'oxyde ferrique.</li>
<li>Calcule la masse de Fe₂O₃ formée.</li>
<li>Calcule le volume d'air nécessaire (l'air contient 20 % de O₂).<br><span class="note">M(Fe) = 56 g/mol ; M(O) = 16 g/mol ; V_m = 22,4 L/mol</span></li>
</ol>`,
      correction: `<ol>
<li>Le <span class="rep">dioxygène O₂</span> (et la vapeur d'eau pour la rouille).</li>
<li><span class="rep">4Fe + 3O₂ → 2Fe₂O₃</span></li>
<li>n(Fe) = 14/56 = 0,25 mol ; d'après l'équation : n(Fe₂O₃) = n(Fe)/2 = 0,125 mol<br>
M(Fe₂O₃) = 2 × 56 + 3 × 16 = 160 g/mol<br>
m(Fe₂O₃) = 0,125 × 160 = <span class="rep">20 g</span></li>
<li>n(O₂) = 3/4 × n(Fe) = 0,1875 mol ; V(O₂) = 0,1875 × 22,4 = 4,2 L<br>
V_air = V(O₂)/0,20 = 4,2/0,2 = <span class="rep">21 L</span></li>
</ol>`
    },
    {
      num: 5,
      enonce: `<p>On verse de l'acide sulfurique (2H⁺ + SO₄²⁻) dilué et froid dans un tube à essai contenant 33,6 g de fer ; il se dégage 2,24 L de gaz. (M(Fe) = 56 g/mol ; V_M = 22,4 L/mol)</p>
<ol>
<li>Nomme les produits formés. Comment identifier le gaz ?</li>
<li>Écris l'équation-bilan globale de la réaction.</li>
<li>L'acide sulfurique étant en défaut : calcule la masse du métal qui a réagi.</li>
<li>Déduis la masse de fer restant.</li>
</ol>`,
      correction: `<ol>
<li>Produits : sulfate de fer (FeSO₄) et dihydrogène H₂. Test du gaz : <span class="rep">étincelle → petite explosion (H₂ brûle dans l'air)</span>.</li>
<li><span class="rep">Fe + H₂SO₄ → FeSO₄ + H₂↑</span></li>
<li>n(H₂) = 2,24/22,4 = 0,1 mol → n(Fe_réagi) = 0,1 mol<br>
m(Fe_réagi) = 0,1 × 56 = <span class="rep">5,6 g</span></li>
<li>m_restant = 33,6 − 5,6 = <span class="rep">28 g de fer</span></li>
</ol>`
    },
    {
      num: 6,
      enonce: `<p>Un volume V = 500 mL de solution d'acide chlorhydrique de molarité C = 1,2 mol/L est versé sur 14 g de fer.</p>
<ol>
<li>Énumère les réactifs et les produits.</li>
<li>Écris l'équation bilan.</li>
<li>Détermine le nombre de moles de chaque réactif.</li>
<li>Déduis le réactif en excès.</li>
<li>Calcule le volume de H₂ produit et la masse de sel formé.<br><span class="note">M(Fe) = 56 g/mol ; M(Cl) = 35,5 g/mol ; V_m = 24 L/mol</span></li>
</ol>`,
      correction: `<ol>
<li>Réactifs : <span class="rep">Fe et HCl</span>. Produits : <span class="rep">FeCl₂ et H₂</span>.</li>
<li><span class="rep">Fe + 2HCl → FeCl₂ + H₂↑</span></li>
<li>n(Fe) = 14/56 = 0,25 mol ; n(HCl) = 1,2 × 0,5 = 0,6 mol</li>
<li>Pour réagir complètement avec 0,25 mol Fe, il faut 0,5 mol HCl. On en a 0,6 mol → <span class="rep">HCl est en excès</span> (0,1 mol restant).</li>
<li>n(H₂) = n(Fe) = 0,25 mol → V(H₂) = 0,25 × 24 = <span class="rep">6 L</span><br>
n(FeCl₂) = 0,25 mol ; M(FeCl₂) = 56 + 2 × 35,5 = 127 g/mol<br>
m(FeCl₂) = 0,25 × 127 = <span class="rep">31,75 g</span></li>
</ol>`
    },
  ]
},

// ────────────────────────────────────────────────────────────
// 11. LES HYDROCARBURES
// ────────────────────────────────────────────────────────────
{
  section: 'Chimie', chapitre: 'Les hydrocarbures', ordre: 11, nbExercices: 6,
  exos: [
    {
      num: 1,
      enonce: `<p>Complète les phrases suivantes :</p>
<ol>
<li>Un hydrocarbure est une ____________ formée uniquement de ____________ et de ____________.</li>
<li>La formule générale des alcanes est ____________ avec n ≥ 1 ; celle des alcènes est ____________ (n ≥ 2) ; celle des alcynes est ____________ (n ≥ 2).</li>
<li>L'éthyne (acétylène) appartient à la famille des ____________ et a pour formule ____________.</li>
<li>L'éthylène appartient à la famille des ____________ et a pour formule ____________.</li>
<li>Le ____________ et l'____________ sont obtenus lors de la combustion complète des hydrocarbures.</li>
</ol>`,
      correction: `<ol>
<li>… une <span class="rep">molécule (composé organique)</span> formée uniquement de <span class="rep">carbone (C)</span> et d'<span class="rep">hydrogène (H)</span>.</li>
<li>Alcanes : <span class="rep">CₙH₂ₙ₊₂</span> ; Alcènes : <span class="rep">CₙH₂ₙ</span> ; Alcynes : <span class="rep">CₙH₂ₙ₋₂</span>.</li>
<li>… famille des <span class="rep">alcynes</span>, formule <span class="rep">C₂H₂</span>.</li>
<li>… famille des <span class="rep">alcènes</span>, formule <span class="rep">C₂H₄</span>.</li>
<li>Le <span class="rep">dioxyde de carbone (CO₂)</span> et l'<span class="rep">eau (H₂O)</span>.</li>
</ol>`
    },
    {
      num: 2,
      enonce: `<p>Équilibre les équations de combustion complète suivantes :</p>
<ol>
<li>Propane + O₂ → CO₂ + H₂O</li>
<li>Éthylène + O₂ → CO₂ + H₂O</li>
<li>Acétylène + O₂ → CO₂ + H₂O</li>
<li>C₄H₁₀ + O₂ → CO₂ + H₂O</li>
</ol>`,
      correction: `<ol>
<li>Propane C₃H₈ : <span class="rep">C₃H₈ + 5O₂ → 3CO₂ + 4H₂O</span></li>
<li>Éthylène C₂H₄ : <span class="rep">C₂H₄ + 3O₂ → 2CO₂ + 2H₂O</span></li>
<li>Acétylène C₂H₂ : <span class="rep">2C₂H₂ + 5O₂ → 4CO₂ + 2H₂O</span></li>
<li>Butane C₄H₁₀ : <span class="rep">2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O</span></li>
</ol>`
    },
    {
      num: 3,
      enonce: `<p>Un alcyne a une masse molaire de 54 g/mol et pour formule CₓHᵧ.</p>
<ol>
<li>Détermine la formule brute puis nomme-le.<br><span class="note">M(C) = 12 g/mol ; M(H) = 1 g/mol</span></li>
</ol>
<p>Le méthane (CH₄) est le plus simple des alcanes. (M(CH₄) = 16 g/mol)</p>
<ol start="2">
<li>Rappelle la formule générale des alcanes.</li>
<li>Écris l'équation bilan de la combustion complète du méthane dans le dioxygène.</li>
<li>Quelle masse de méthane faut-il brûler pour obtenir 0,1 mol d'eau ?</li>
</ol>`,
      correction: `<ol>
<li>Alcyne : CₙH₂ₙ₋₂. M = 12n + (2n−2) = 14n − 2 = 54 → n = 4.<br>
Formule : <span class="rep">C₄H₆</span>. Nom : <span class="rep">butyne (but-1-yne)</span>.</li>
<li>Formule générale des alcanes : <span class="rep">CₙH₂ₙ₊₂</span></li>
<li><span class="rep">CH₄ + 2O₂ → CO₂ + 2H₂O</span></li>
<li>D'après l'équation : 1 mol CH₄ → 2 mol H₂O → n(CH₄) = 0,1/2 = 0,05 mol<br>
m(CH₄) = 0,05 × 16 = <span class="rep">0,8 g</span></li>
</ol>`
    },
    {
      num: 4,
      enonce: `<p>On réalise la combustion complète de 3 moles de propane (C₃H₈) dans l'air. (M(C) = 12 g/mol ; M(H) = 1 g/mol ; V_m = 22,4 L/mol)</p>
<ol>
<li>Précise les éléments chimiques qui forment la molécule de propane.</li>
<li>Donne le nom de la famille de ce composé organique.</li>
<li>Écris et équilibre l'équation bilan de la combustion complète du propane.</li>
<li>Calcule le volume de gaz recueilli (CO₂) dans les CNTP.</li>
<li>De quel gaz s'agit-il ? Comment peut-on le mettre en évidence ?</li>
</ol>`,
      correction: `<ol>
<li>Carbone (<span class="rep">C</span>) et Hydrogène (<span class="rep">H</span>).</li>
<li>Famille des <span class="rep">alcanes</span> (formule CₙH₂ₙ₊₂ avec n = 3).</li>
<li><span class="rep">C₃H₈ + 5O₂ → 3CO₂ + 4H₂O</span></li>
<li>3 mol C₃H₈ → 3 × 3 = 9 mol CO₂<br>
V(CO₂) = 9 × 22,4 = <span class="rep">201,6 L</span></li>
<li>Le gaz est le <span class="rep">dioxyde de carbone (CO₂)</span>. Mise en évidence : faire barboter dans l'<span class="rep">eau de chaux</span> → précipité blanc (trouble).</li>
</ol>`
    },
    {
      num: 5,
      enonce: `<p>Le réservoir d'une voiture contient 30 litres d'essence assimilable à de l'octane C₈H₁₈ (alcane, 8 atomes de carbone). La densité de l'octane par rapport à l'eau est d = 0,7. (V_m = 22,4 L/mol ; M(C) = 12 ; M(H) = 1)</p>
<ol>
<li>Écris l'équation bilan de la combustion complète de l'octane.</li>
<li>Calcule la masse m des 30 litres d'essence.</li>
<li>Calcule le volume de dioxygène nécessaire à cette combustion et déduis le volume d'air (air = 20 % O₂).</li>
<li>Détermine le volume d'eau obtenu.</li>
</ol>`,
      correction: `<ol>
<li><span class="rep">2C₈H₁₈ + 25O₂ → 16CO₂ + 18H₂O</span></li>
<li>m = d × ρ_eau × V = 0,7 × 1000 × 30 × 10⁻³ = 0,7 × 1000 × 0,03 = <span class="rep">21 kg</span></li>
<li>M(C₈H₁₈) = 8×12 + 18 = 114 g/mol ; n(C₈H₁₈) = 21000/114 ≈ 184,2 mol<br>
D'après équation : n(O₂) = 25/2 × n(C₈H₁₈) = 12,5 × 184,2 ≈ 2302 mol<br>
V(O₂) = 2302 × 22,4 ≈ <span class="rep">51 565 L ≈ 51,6 m³</span><br>
V_air = V(O₂)/0,2 ≈ <span class="rep">257 800 L ≈ 257,8 m³</span></li>
<li>n(H₂O) = 18/2 × 184,2 = 9 × 184,2 ≈ 1658 mol<br>
V(H₂O) = 1658 × 22,4 ≈ <span class="rep">37 139 L ≈ 37,1 m³</span> (vapeur d'eau)</li>
</ol>`
    },
    {
      num: 6,
      enonce: `<p>L'acétylène (C₂H₂) est utilisé dans le chalumeau oxyacétylénique. La combustion complète de l'acétylène produit du CO₂ et de l'eau.</p>
<ol>
<li>À quelle famille d'hydrocarbures appartient l'acétylène ?</li>
<li>Donne la formule générale des hydrocarbures de cette famille.</li>
<li>Écris l'équation bilan de la réaction complète de l'acétylène dans le dioxygène.</li>
<li>On procède à la combustion complète de 44,8 L de gaz acétylène dans les CNTP.<br>
  4.1. Calcule le volume de dioxygène nécessaire et le volume de gaz formé.<br>
  4.2. Calcule la quantité de chaleur dégagée si la combustion d'1 L d'acétylène produit 58 kJ.</li>
</ol>`,
      correction: `<ol>
<li>L'acétylène appartient à la famille des <span class="rep">alcynes</span>.</li>
<li>Formule générale : <span class="rep">CₙH₂ₙ₋₂</span> (avec n ≥ 2).</li>
<li><span class="rep">2C₂H₂ + 5O₂ → 4CO₂ + 2H₂O</span></li>
<li>n(C₂H₂) = 44,8/22,4 = 2 mol<br>
4.1. n(O₂) = 5/2 × 2 = 5 mol → V(O₂) = 5 × 22,4 = <span class="rep">112 L</span><br>
n(CO₂) = 2 × 2 = 4 mol → V(CO₂) = 4 × 22,4 = <span class="rep">89,6 L</span><br>
Total gaz formé = V(CO₂) + V(H₂O_vapeur) = 89,6 + 2 × 22,4 = <span class="rep">134,4 L</span><br>
4.2. Q = 44,8 × 58 = <span class="rep">2 598,4 kJ ≈ 2 600 kJ</span></li>
</ol>`
    },
  ]
},

]; // fin ENTRAINEMENTS

// ── Build final objects ───────────────────────────────────────
const SOURCE = 'BST Joseph Turpin de Kaolack — 2019-2020';

function buildEntry(ent) {
  const contenuHTML    = makeContenu(ent.section, ent.chapitre, SOURCE, ent.exos);
  const correctionHTML = makeCorrection(ent.section, ent.chapitre, ent.exos);
  return {
    matiere:  'Physique-Chimie',
    niveau:   '3eme',
    section:  ent.section,
    chapitre: ent.chapitre,
    ordre:    ent.ordre,
    titre:    `${ent.chapitre} — Entraînements`,
    source:   SOURCE,
    nbExercices: ent.nbExercices,
    contenuHTML,
    correctionHTML,
    publie: true,
  };
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  console.log('🔗 Connexion à MongoDB Atlas…');
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('✅ Connecté.\n');

  for (const ent of ENTRAINEMENTS) {
    const exist = await Entrainement.findOne({
      matiere: 'Physique-Chimie', niveau: '3eme', chapitre: ent.chapitre
    });
    if (exist) {
      await Entrainement.deleteOne({ _id: exist._id });
      console.log(`♻️  Remplacement : ${ent.chapitre}`);
    }
    const data = buildEntry(ent);
    await Entrainement.create(data);
    console.log(`✅  Créé : [${ent.section}] ${ent.chapitre} (${ent.nbExercices} exercices)`);
  }

  const total = await Entrainement.countDocuments({ matiere: 'Physique-Chimie', niveau: '3eme' });
  console.log(`\n🎉 Terminé ! ${total} entraînements PC 3ème en base.`);
  await mongoose.disconnect();
}

main().catch(e => {
  console.error('❌ Erreur :', e.message);
  process.exit(1);
});
