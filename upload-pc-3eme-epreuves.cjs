// upload-pc-3eme-epreuves.cjs — 6 épreuves BFEM PC 3ème (2017 G1&G2, 2018 G1&G2, 2019 G1&G2)
'use strict';
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0';

const epreuveSchema = new mongoose.Schema({
  type:{ type:String, enum:['BFEM','BAC'], required:true },
  matiere:{ type:String, required:true },
  niveau:{ type:String, enum:['3eme','Terminale'], required:true },
  annee:{ type:Number, required:true },
  session:{ type:String, default:'Normale' },
  titre:{ type:String, default:'' },
  duree:{ type:String, default:'' },
  coefficient:{ type:Number, default:1 },
  contenuHTML:{ type:String, default:'' },
  correctionHTML:{ type:String, default:'' },
  enonce:{ type:String, default:'' },
  questions:[{
    numero:{ type:Number },
    intitule:{ type:String },
    points:{ type:Number, default:0 },
    correction:{ type:String, default:'' },
    sousQuestions:[{ lettre:String, intitule:String, points:{type:Number,default:0}, correction:{type:String,default:''} }]
  }],
  publie:{ type:Boolean, default:true },
  creePar:{ type:mongoose.Schema.Types.ObjectId, ref:'User' },
},{ timestamps:true });

epreuveSchema.pre('save', function(next){
  if(!this.titre){ this.titre = `${this.type} ${this.annee} — ${this.matiere}`; if(this.session!=='Normale') this.titre += ` (${this.session})`; }
  next();
});

const Epreuve = mongoose.models.Epreuve || mongoose.model('Epreuve', epreuveSchema);

// ── Helpers HTML ──────────────────────────────────────────────────────────
const CSS = `
<style>
  body{font-family:'Segoe UI',Arial,sans-serif;max-width:820px;margin:0 auto;padding:16px 20px;color:#1a1a2e;background:#fff;font-size:14px;line-height:1.7}
  h1{color:#1e3a5f;font-size:1.3rem;border-bottom:3px solid #1e3a5f;padding-bottom:6px;margin-bottom:16px}
  h2{color:#1e3a5f;font-size:1.05rem;margin-top:20px;border-left:4px solid #F97316;padding-left:10px}
  h3{color:#C2410C;font-size:0.95rem;margin-top:14px}
  .header-bfem{background:#1e3a5f;color:#fff;border-radius:10px;padding:14px 18px;margin-bottom:20px}
  .header-bfem h1{color:#fff;border-bottom:1px solid rgba(255,255,255,0.3);font-size:1.2rem}
  .meta{display:flex;gap:20px;font-size:12px;opacity:0.9;flex-wrap:wrap}
  .partie{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px;margin:14px 0}
  .partie h2{margin-top:0}
  .question{margin:10px 0;padding:8px 12px;background:#fff;border-radius:6px;border-left:3px solid #F97316}
  .barème{font-size:11px;color:#6B7280;float:right;font-weight:bold}
  .correction-box{background:#F0FDF4;border:2px solid #22C55E;border-radius:8px;padding:14px;margin:14px 0}
  .correction-box h2{color:#14532D;border-left:4px solid #22C55E}
  .correction-item{margin:8px 0;padding:8px;background:#fff;border-radius:6px;border-left:3px solid #22C55E;font-size:13px}
  .formule-correction{background:#EFF6FF;border:1px solid #93C5FD;border-radius:6px;padding:8px;margin:4px 0;font-weight:bold}
  table{width:100%;border-collapse:collapse;margin:10px 0;font-size:13px}
  th{background:#1e3a5f;color:#fff;padding:6px 8px;text-align:center}
  td{padding:5px 8px;border:1px solid #D1D5DB;text-align:center}
  .note{font-style:italic;color:#6B7280;font-size:12px}
  ul,ol{margin:6px 0;padding-left:20px}
  li{margin:3px 0}
  sub,sup{font-size:0.8em}
</style>`;

function bfemHeader(annee, groupe, duree, coeff) {
  return `<div class="header-bfem">
    <h1>📋 BFEM ${annee} — Physique-Chimie — ${groupe}</h1>
    <div class="meta">
      <span>📅 Année : ${annee}</span>
      <span>⏱️ Durée : ${duree}</span>
      <span>⚖️ Coefficient : ${coeff}</span>
      <span>🇸🇳 République du Sénégal</span>
    </div>
  </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// BFEM 2019 — 1er Groupe
// ═══════════════════════════════════════════════════════════════════════════
const BFEM2019_G1_ENONCE = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>BFEM 2019 G1 PC</title>${CSS}</head><body>
${bfemHeader(2019,'1er Groupe','2h','2')}

<div class="partie">
<h2>PARTIE I — CHIMIE (8 points)</h2>

<h3>Exercice 1 : Acides et bases (4 points)</h3>
<p>On dispose d'une solution S d'acide chlorhydrique de concentration molaire C<sub>a</sub> inconnue et d'une solution de soude NaOH de concentration C<sub>b</sub> = 0,1 mol/L.</p>
<p>On verse progressivement la solution de soude dans V<sub>a</sub> = 20 mL de la solution acide. À l'équivalence, on a versé V<sub>b</sub> = 25 mL de soude. L'indicateur coloré utilisé est le BBT.</p>

<div class="question"><span class="barème">1 pt</span><strong>1.1.</strong> Quelle est la couleur du BBT dans la solution acide avant le dosage ?</div>
<div class="question"><span class="barème">1 pt</span><strong>1.2.</strong> Quelle est la couleur du BBT à l'équivalence ?</div>
<div class="question"><span class="barème">1 pt</span><strong>1.3.</strong> Écrire l'équation de la réaction de neutralisation.</div>
<div class="question"><span class="barème">1 pt</span><strong>1.4.</strong> Calculer C<sub>a</sub>, la concentration molaire de la solution acide.</div>

<h3>Exercice 2 : Hydrocarbures (4 points)</h3>
<p>On considère trois hydrocarbures : le méthane (CH₄), l'éthylène ou éthène (C₂H₄) et l'acétylène ou éthyne (C₂H₂).</p>

<div class="question"><span class="barème">1 pt</span><strong>2.1.</strong> À quelle famille appartient chacun de ces hydrocarbures ? Justifier.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.2.</strong> Écrire l'équation de combustion complète du méthane.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.3.</strong> Écrire l'équation de combustion complète de l'éthylène.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.4.</strong> Comment distingue-t-on l'éthylène du méthane à l'aide de l'eau de brome ? Que se passe-t-il ?</div>
</div>

<div class="partie">
<h2>PARTIE II — PHYSIQUE (12 points)</h2>

<h3>Exercice 3 : Résistance électrique (4 points)</h3>
<p>Un circuit comporte trois résistances : R₁ = 20 Ω et R₂ = 30 Ω montées en dérivation, et cet ensemble est en série avec R₃ = 10 Ω. La tension aux bornes du générateur est U = 20 V.</p>

<div class="question"><span class="barème">1 pt</span><strong>3.1.</strong> Calculer la résistance équivalente R₁₂ de R₁ et R₂ en dérivation.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.2.</strong> Calculer la résistance totale R<sub>eq</sub> du circuit.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.3.</strong> Calculer l'intensité totale I du courant dans le circuit.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.4.</strong> Calculer la tension U₃ aux bornes de R₃.</div>

<h3>Exercice 4 : Lentilles — Œil (4 points)</h3>
<p>Un œil myope ne voit nettement que les objets situés à moins de 80 cm.</p>

<div class="question"><span class="barème">1 pt</span><strong>4.1.</strong> Expliquer le défaut de la myopie.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.2.</strong> Quel type de lentille corrige la myopie ?</div>
<div class="question"><span class="barème">1 pt</span><strong>4.3.</strong> Un œil hypermétrope. Expliquer ce défaut et la correction.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.4.</strong> Une lentille convergente a f' = 50 cm. Calculer sa vergence.</div>

<h3>Exercice 5 : Travail, puissance, énergie (4 points)</h3>
<p>Une pompe électrique de puissance P = 2 kW soulève de l'eau à h = 5 m. Elle fonctionne pendant t = 10 min = 600 s. (g = 10 N/kg)</p>

<div class="question"><span class="barème">1 pt</span><strong>5.1.</strong> Calculer l'énergie électrique consommée par la pompe.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.2.</strong> Calculer le travail utile (énergie potentielle de l'eau soulevée) si la masse d'eau est m = 100 kg.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.3.</strong> Calculer le rendement de la pompe.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.4.</strong> Que devient l'énergie perdue ?</div>
</div>
</body></html>`;

const BFEM2019_G1_CORRECTION = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Correction BFEM 2019 G1 PC</title>${CSS}</head><body>
<div class="header-bfem"><h1>✅ CORRECTION — BFEM 2019 Physique-Chimie — 1er Groupe</h1></div>

<div class="correction-box">
<h2>PARTIE I — CHIMIE</h2>

<h3>Exercice 1 : Acides et bases</h3>
<div class="correction-item"><strong>1.1.</strong> Dans la solution acide (HCl), le BBT vire au <strong>jaune</strong>. (les acides font jaunir le BBT)</div>
<div class="correction-item"><strong>1.2.</strong> À l'équivalence (neutralisation complète), la solution est neutre → le BBT est <strong>vert</strong>.</div>
<div class="correction-item"><strong>1.3.</strong> Équation de neutralisation :
  <div class="formule-correction">HCl + NaOH → NaCl + H₂O</div>
</div>
<div class="correction-item"><strong>1.4.</strong> Calcul de C<sub>a</sub> : À l'équivalence, n(HCl) = n(NaOH)
  <div class="formule-correction">C<sub>a</sub> × V<sub>a</sub> = C<sub>b</sub> × V<sub>b</sub><br>
  C<sub>a</sub> = C<sub>b</sub> × V<sub>b</sub> / V<sub>a</sub> = 0,1 × 25 / 20 = <strong>0,125 mol/L</strong></div>
</div>

<h3>Exercice 2 : Hydrocarbures</h3>
<div class="correction-item"><strong>2.1.</strong> Identification des familles :
  <ul>
    <li>CH₄ : CₙH₂ₙ₊₂ avec n=1 → <strong>alcane</strong> (méthane)</li>
    <li>C₂H₄ : CₙH₂ₙ avec n=2 → <strong>alcène</strong> (éthylène/éthène)</li>
    <li>C₂H₂ : CₙH₂ₙ₋₂ avec n=2 → <strong>alcyne</strong> (acétylène/éthyne)</li>
  </ul>
</div>
<div class="correction-item"><strong>2.2.</strong> Combustion complète du méthane :
  <div class="formule-correction">CH₄ + 2O₂ → CO₂ + 2H₂O</div>
</div>
<div class="correction-item"><strong>2.3.</strong> Combustion complète de l'éthylène :
  <div class="formule-correction">C₂H₄ + 3O₂ → 2CO₂ + 2H₂O</div>
</div>
<div class="correction-item"><strong>2.4.</strong> Test à l'eau de brome : L'<strong>éthylène décolore l'eau de brome</strong> (brun → incolore) car la double liaison C=C réagit par addition avec Br₂. Le méthane (alcane) ne décolore pas l'eau de brome à froid : elle reste brun-orangée.</div>
</div>

<div class="correction-box">
<h2>PARTIE II — PHYSIQUE</h2>

<h3>Exercice 3 : Résistance électrique</h3>
<div class="correction-item"><strong>3.1.</strong> R₁₂ en dérivation :
  <div class="formule-correction">1/R₁₂ = 1/R₁ + 1/R₂ = 1/20 + 1/30 = 3/60 + 2/60 = 5/60<br>R₁₂ = 60/5 = <strong>12 Ω</strong></div>
</div>
<div class="correction-item"><strong>3.2.</strong> Résistance totale (R₁₂ en série avec R₃) :
  <div class="formule-correction">R<sub>eq</sub> = R₁₂ + R₃ = 12 + 10 = <strong>22 Ω</strong></div>
</div>
<div class="correction-item"><strong>3.3.</strong> Intensité totale :
  <div class="formule-correction">I = U / R<sub>eq</sub> = 20 / 22 ≈ <strong>0,91 A</strong></div>
</div>
<div class="correction-item"><strong>3.4.</strong> Tension aux bornes de R₃ :
  <div class="formule-correction">U₃ = R₃ × I = 10 × 0,91 ≈ <strong>9,1 V</strong></div>
</div>

<h3>Exercice 4 : Lentilles — Œil</h3>
<div class="correction-item"><strong>4.1.</strong> Myopie : L'œil myope est <strong>trop long</strong> (ou son cristallin trop convergent). L'image se forme <strong>avant la rétine</strong>. La vision de loin est floue ; la vision de près est nette.</div>
<div class="correction-item"><strong>4.2.</strong> La myopie est corrigée par une lentille <strong>divergente</strong> (vergence négative), qui éloigne l'image vers la rétine.</div>
<div class="correction-item"><strong>4.3.</strong> Hypermétropie : L'œil est <strong>trop court</strong> ; l'image se forme <strong>derrière la rétine</strong>. Vision de près floue. Correction : lentille <strong>convergente</strong>.</div>
<div class="correction-item"><strong>4.4.</strong> Vergence :
  <div class="formule-correction">V = 1/f' = 1/0,50 m = <strong>+2 δ</strong></div>
</div>

<h3>Exercice 5 : Travail, puissance, énergie</h3>
<div class="correction-item"><strong>5.1.</strong> Énergie électrique consommée :
  <div class="formule-correction">E = P × t = 2 000 × 600 = <strong>1 200 000 J = 1 200 kJ</strong></div>
</div>
<div class="correction-item"><strong>5.2.</strong> Travail utile (énergie potentielle) :
  <div class="formule-correction">E<sub>p</sub> = m × g × h = 100 × 10 × 5 = <strong>5 000 J = 5 kJ</strong></div>
</div>
<div class="correction-item"><strong>5.3.</strong> Rendement :
  <div class="formule-correction">η = E<sub>utile</sub> / E<sub>totale</sub> = 5 000 / 1 200 000 ≈ <strong>0,42 % ≈ 0,4 %</strong></div>
  <p class="note">Note : ce faible rendement est réaliste pour une petite pompe hydraulique.</p>
</div>
<div class="correction-item"><strong>5.4.</strong> L'énergie perdue (E<sub>totale</sub> − E<sub>utile</sub>) est dissipée sous forme de <strong>chaleur par effet Joule</strong> dans le moteur, les câbles et les frottements mécaniques.</div>
</div>
</body></html>`;

// ═══════════════════════════════════════════════════════════════════════════
// BFEM 2019 — 2e Groupe
// ═══════════════════════════════════════════════════════════════════════════
const BFEM2019_G2_ENONCE = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>BFEM 2019 G2 PC</title>${CSS}</head><body>
${bfemHeader(2019,'2e Groupe','2h','2')}

<div class="partie">
<h2>PARTIE I — CHIMIE (8 points)</h2>

<h3>Exercice 1 : Solutions aqueuses — Dilution (4 points)</h3>
<p>On dispose d'une solution mère S₀ de soude NaOH de concentration molaire C₀ = 5 mol/L.</p>
<div class="question"><span class="barème">1 pt</span><strong>1.1.</strong> Calculer la masse molaire M de NaOH (Na=23, O=16, H=1).</div>
<div class="question"><span class="barème">1 pt</span><strong>1.2.</strong> Calculer la concentration massique C<sub>m0</sub> de la solution mère.</div>
<div class="question"><span class="barème">1 pt</span><strong>1.3.</strong> On prélève V₁ = 20 mL de S₀ et on dilue jusqu'à V₂ = 200 mL. Calculer la concentration molaire C de la solution diluée.</div>
<div class="question"><span class="barème">1 pt</span><strong>1.4.</strong> Quel est le facteur de dilution ?</div>

<h3>Exercice 2 : Dosage acido-basique (4 points)</h3>
<p>On dose V<sub>b</sub> = 10 mL d'une solution de NaOH de concentration C<sub>b</sub> inconnue par une solution d'HCl de concentration C<sub>a</sub> = 0,2 mol/L. À l'équivalence, V<sub>a</sub> = 15 mL d'HCl ont été versés.</p>
<div class="question"><span class="barème">1 pt</span><strong>2.1.</strong> Écrire l'équation de la réaction de dosage.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.2.</strong> Calculer C<sub>b</sub>.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.3.</strong> Quel indicateur coloré peut-on utiliser ? Quelle est sa couleur avant et à l'équivalence ?</div>
<div class="question"><span class="barème">1 pt</span><strong>2.4.</strong> Calculer la masse m de NaOH contenue dans V<sub>b</sub> = 10 mL de la solution.</div>
</div>

<div class="partie">
<h2>PARTIE II — PHYSIQUE (12 points)</h2>

<h3>Exercice 3 : Travail, puissance, énergie (4 points)</h3>
<p>Un ouvrier soulève une charge de masse m = 80 kg à la hauteur h = 3 m en t = 12 s. (g = 10 N/kg)</p>
<div class="question"><span class="barème">1 pt</span><strong>3.1.</strong> Calculer le poids P de la charge.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.2.</strong> Calculer le travail W effectué par l'ouvrier.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.3.</strong> Calculer la puissance P<sub>m</sub> développée par l'ouvrier.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.4.</strong> Si le travail de la force de frottement est W<sub>f</sub> = −400 J, quel est le travail total fourni par l'ouvrier ?</div>

<h3>Exercice 4 : Résistance — Loi d'Ohm (4 points)</h3>
<p>On étudie la caractéristique U = f(I) d'un résistor. On obtient les valeurs suivantes :</p>
<table>
  <tr><th>U (V)</th><td>0</td><td>4</td><td>8</td><td>12</td><td>16</td></tr>
  <tr><th>I (A)</th><td>0</td><td>0,2</td><td>0,4</td><td>0,6</td><td>0,8</td></tr>
</table>
<div class="question"><span class="barème">1 pt</span><strong>4.1.</strong> Tracer la courbe U = f(I) (sur papier millimétré).</div>
<div class="question"><span class="barème">1 pt</span><strong>4.2.</strong> La courbe est-elle une droite ? Conclure sur la loi vérifiée.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.3.</strong> En déduire la résistance R du résistor.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.4.</strong> Calculer la puissance dissipée pour U = 12 V.</div>

<h3>Exercice 5 : Lentilles convergentes (4 points)</h3>
<p>Une lentille convergente a une vergence V = 5 δ. Un objet AB est placé à OA = −40 cm.</p>
<div class="question"><span class="barème">1 pt</span><strong>5.1.</strong> Calculer la distance focale f' de la lentille.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.2.</strong> Calculer la position OA' de l'image.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.3.</strong> Calculer le grandissement g.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.4.</strong> L'image est-elle réelle ou virtuelle ? Droite ou renversée ? Agrandie ou réduite ?</div>
</div>
</body></html>`;

const BFEM2019_G2_CORRECTION = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Correction BFEM 2019 G2 PC</title>${CSS}</head><body>
<div class="header-bfem"><h1>✅ CORRECTION — BFEM 2019 Physique-Chimie — 2e Groupe</h1></div>

<div class="correction-box">
<h2>PARTIE I — CHIMIE</h2>
<h3>Exercice 1 : Solutions aqueuses</h3>
<div class="correction-item"><strong>1.1.</strong> M(NaOH) = M(Na) + M(O) + M(H) = 23 + 16 + 1 = <strong>40 g/mol</strong></div>
<div class="correction-item"><strong>1.2.</strong> Concentration massique de S₀ :
  <div class="formule-correction">C<sub>m0</sub> = C₀ × M = 5 × 40 = <strong>200 g/L</strong></div>
</div>
<div class="correction-item"><strong>1.3.</strong> Dilution (C₁V₁ = C₂V₂) :
  <div class="formule-correction">C = C₀ × V₁/V₂ = 5 × 20/200 = <strong>0,5 mol/L</strong></div>
</div>
<div class="correction-item"><strong>1.4.</strong> Facteur de dilution :
  <div class="formule-correction">f = V₂/V₁ = 200/20 = <strong>10</strong> (solution 10 fois moins concentrée)</div>
</div>

<h3>Exercice 2 : Dosage acido-basique</h3>
<div class="correction-item"><strong>2.1.</strong> Équation de dosage : <div class="formule-correction">HCl + NaOH → NaCl + H₂O</div></div>
<div class="correction-item"><strong>2.2.</strong> À l'équivalence n(HCl) = n(NaOH) :
  <div class="formule-correction">C<sub>b</sub> = C<sub>a</sub> × V<sub>a</sub> / V<sub>b</sub> = 0,2 × 15/10 = <strong>0,3 mol/L</strong></div>
</div>
<div class="correction-item"><strong>2.3.</strong> Indicateur : <strong>BBT</strong>. Couleur avant (base) : <strong>bleu</strong>. À l'équivalence (neutre) : <strong>vert</strong>.</div>
<div class="correction-item"><strong>2.4.</strong> Masse de NaOH dans V<sub>b</sub> = 10 mL = 0,01 L :
  <div class="formule-correction">n = C<sub>b</sub> × V<sub>b</sub> = 0,3 × 0,01 = 0,003 mol<br>m = n × M = 0,003 × 40 = <strong>0,12 g</strong></div>
</div>
</div>

<div class="correction-box">
<h2>PARTIE II — PHYSIQUE</h2>
<h3>Exercice 3 : Travail, puissance, énergie</h3>
<div class="correction-item"><strong>3.1.</strong> <div class="formule-correction">P = m × g = 80 × 10 = <strong>800 N</strong></div></div>
<div class="correction-item"><strong>3.2.</strong> <div class="formule-correction">W = P × h = 800 × 3 = <strong>2 400 J</strong></div></div>
<div class="correction-item"><strong>3.3.</strong> <div class="formule-correction">P<sub>m</sub> = W/t = 2 400/12 = <strong>200 W</strong></div></div>
<div class="correction-item"><strong>3.4.</strong> Travail total = travail utile + travail contre frottements :
  <div class="formule-correction">W<sub>total</sub> = W + |W<sub>f</sub>| = 2 400 + 400 = <strong>2 800 J</strong></div>
</div>

<h3>Exercice 4 : Résistance — Loi d'Ohm</h3>
<div class="correction-item"><strong>4.1.</strong> Courbe : Porter U (axe Y) en fonction de I (axe X). Points : (0;0), (0,2;4), (0,4;8), (0,6;12), (0,8;16). Tracer une droite passant par tous les points.</div>
<div class="correction-item"><strong>4.2.</strong> La courbe est <strong>une droite passant par l'origine</strong> → le résistor vérifie la <strong>loi d'Ohm</strong> : U = R × I.</div>
<div class="correction-item"><strong>4.3.</strong> Résistance R (pente de la droite) :
  <div class="formule-correction">R = U/I = 12/0,6 = <strong>20 Ω</strong></div>
</div>
<div class="correction-item"><strong>4.4.</strong> Puissance pour U = 12 V, I = 0,6 A :
  <div class="formule-correction">P = U × I = 12 × 0,6 = <strong>7,2 W</strong></div>
</div>

<h3>Exercice 5 : Lentilles</h3>
<div class="correction-item"><strong>5.1.</strong> <div class="formule-correction">f' = 1/V = 1/5 = <strong>0,20 m = 20 cm</strong></div></div>
<div class="correction-item"><strong>5.2.</strong> OA = −40 cm = −0,40 m
  <div class="formule-correction">1/OA' = 1/f' + 1/OA = 1/0,20 + 1/(−0,40) = 5 − 2,5 = 2,5<br>OA' = 1/2,5 = <strong>0,40 m = 40 cm</strong></div>
</div>
<div class="correction-item"><strong>5.3.</strong> <div class="formule-correction">g = OA'/OA = 40/(−40) = <strong>−1</strong></div></div>
<div class="correction-item"><strong>5.4.</strong> OA' > 0 → image <strong>réelle</strong>. g < 0 → image <strong>renversée</strong>. |g| = 1 → image de <strong>même taille</strong> que l'objet.</div>
</div>
</body></html>`;

// ═══════════════════════════════════════════════════════════════════════════
// BFEM 2018 — 1er Groupe
// ═══════════════════════════════════════════════════════════════════════════
const BFEM2018_G1_ENONCE = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>BFEM 2018 G1 PC</title>${CSS}</head><body>
${bfemHeader(2018,'1er Groupe','2h','2')}

<div class="partie">
<h2>PARTIE I — CHIMIE (8 points)</h2>
<h3>Exercice 1 : Hydrocarbures (4 points)</h3>
<p>Compléter le tableau suivant pour les hydrocarbures :</p>
<table>
  <tr><th>Nom</th><th>Formule brute</th><th>Famille</th><th>Formule générale</th></tr>
  <tr><td>Méthane</td><td>CH₄</td><td>...</td><td>...</td></tr>
  <tr><td>...</td><td>C₂H₄</td><td>Alcène</td><td>...</td></tr>
  <tr><td>Propane</td><td>...</td><td>...</td><td>CₙH₂ₙ₊₂</td></tr>
  <tr><td>Acétylène</td><td>...</td><td>Alcyne</td><td>...</td></tr>
</table>
<div class="question"><span class="barème">2 pts</span><strong>1.1.</strong> Compléter le tableau (0,5 pt par case vide correcte).</div>
<div class="question"><span class="barème">1 pt</span><strong>1.2.</strong> Écrire l'équation de combustion complète du propane C₃H₈.</div>
<div class="question"><span class="barème">1 pt</span><strong>1.3.</strong> Écrire l'équation de combustion incomplète du méthane (produit CO).</div>

<h3>Exercice 2 : Dilution d'une solution (4 points)</h3>
<p>Une solution commerciale de Dakin contient du permanganate de potassium KMnO₄ à C₀ = 0,02 mol/L dans un volume V₀ = 1 L.</p>
<div class="question"><span class="barème">1 pt</span><strong>2.1.</strong> Calculer la quantité de matière n₀ de KMnO₄ dans la solution commerciale.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.2.</strong> On prépare une solution diluée en prélevant V₁ = 200 mL et en complétant à V₂ = 1 L. Calculer la concentration C de la solution diluée.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.3.</strong> M(KMnO₄) = 158 g/mol. Calculer la concentration massique C<sub>m</sub> de la solution diluée.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.4.</strong> Quel est le facteur de dilution ?</div>
</div>

<div class="partie">
<h2>PARTIE II — PHYSIQUE (12 points)</h2>
<h3>Exercice 3 : Forces (4 points)</h3>
<p>Compléter le tableau des unités du système international (SI) pour les grandeurs physiques suivantes :</p>
<table>
  <tr><th>Grandeur</th><th>Symbole</th><th>Unité SI</th><th>Symbole unité</th></tr>
  <tr><td>Force</td><td>F</td><td>...</td><td>...</td></tr>
  <tr><td>Masse</td><td>m</td><td>...</td><td>...</td></tr>
  <tr><td>Poids</td><td>P</td><td>...</td><td>...</td></tr>
  <tr><td>Travail</td><td>W</td><td>...</td><td>...</td></tr>
</table>
<div class="question"><span class="barème">2 pts</span><strong>3.1.</strong> Compléter le tableau.</div>
<p>Un corps de masse m = 6 kg est posé sur un plan incliné à 30°. (g = 10 N/kg)</p>
<div class="question"><span class="barème">1 pt</span><strong>3.2.</strong> Calculer le poids P du corps.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.3.</strong> La composante du poids parallèle au plan est F = P × sin(30°) = P × 0,5. Calculer F.</div>

<h3>Exercice 4 : Énergie potentielle et travail (4 points)</h3>
<p>Une grue soulève une charge de m = 500 kg de h = 10 m en t = 25 s. (g = 10 N/kg)</p>
<div class="question"><span class="barème">1 pt</span><strong>4.1.</strong> Calculer l'énergie potentielle de pesanteur Ep acquise par la charge.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.2.</strong> Calculer la puissance utile P<sub>u</sub> de la grue.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.3.</strong> La grue consomme une puissance électrique P<sub>e</sub> = 25 kW. Calculer son rendement.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.4.</strong> Qu'est-ce qui explique que le rendement est inférieur à 1 ?</div>

<h3>Exercice 5 : Résistance — Loi d'Ohm (4 points)</h3>
<p>Deux résistances R₁ = 40 Ω et R₂ = 60 Ω sont montées en série sous une tension U = 20 V.</p>
<div class="question"><span class="barème">1 pt</span><strong>5.1.</strong> Calculer la résistance équivalente R<sub>eq</sub>.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.2.</strong> Calculer l'intensité I du courant.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.3.</strong> Calculer les tensions U₁ et U₂ aux bornes de chaque résistance.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.4.</strong> Vérifier que U₁ + U₂ = U.</div>
</div>
</body></html>`;

const BFEM2018_G1_CORRECTION = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Correction BFEM 2018 G1 PC</title>${CSS}</head><body>
<div class="header-bfem"><h1>✅ CORRECTION — BFEM 2018 Physique-Chimie — 1er Groupe</h1></div>

<div class="correction-box">
<h2>PARTIE I — CHIMIE</h2>
<h3>Exercice 1 : Hydrocarbures</h3>
<div class="correction-item"><strong>1.1.</strong> Tableau complété :
  <table>
    <tr><th>Nom</th><th>Formule brute</th><th>Famille</th><th>Formule générale</th></tr>
    <tr><td>Méthane</td><td>CH₄</td><td><strong>Alcane</strong></td><td><strong>CₙH₂ₙ₊₂</strong></td></tr>
    <tr><td><strong>Éthylène (éthène)</strong></td><td>C₂H₄</td><td>Alcène</td><td><strong>CₙH₂ₙ</strong></td></tr>
    <tr><td>Propane</td><td><strong>C₃H₈</strong></td><td><strong>Alcane</strong></td><td>CₙH₂ₙ₊₂</td></tr>
    <tr><td>Acétylène</td><td><strong>C₂H₂</strong></td><td>Alcyne</td><td><strong>CₙH₂ₙ₋₂</strong></td></tr>
  </table>
</div>
<div class="correction-item"><strong>1.2.</strong> Combustion complète du propane :
  <div class="formule-correction">C₃H₈ + 5O₂ → 3CO₂ + 4H₂O</div>
  Vérification : C: 3=3 ✓ | H: 8=8 ✓ | O: 10=10 ✓
</div>
<div class="correction-item"><strong>1.3.</strong> Combustion incomplète du méthane :
  <div class="formule-correction">2CH₄ + 3O₂ → 2CO + 4H₂O</div>
  Produit CO (monoxyde de carbone), gaz toxique.
</div>

<h3>Exercice 2 : Dilution</h3>
<div class="correction-item"><strong>2.1.</strong> <div class="formule-correction">n₀ = C₀ × V₀ = 0,02 × 1 = <strong>0,02 mol</strong></div></div>
<div class="correction-item"><strong>2.2.</strong> <div class="formule-correction">C = C₀ × V₁/V₂ = 0,02 × 200/1000 = <strong>0,004 mol/L</strong></div></div>
<div class="correction-item"><strong>2.3.</strong> <div class="formule-correction">C<sub>m</sub> = C × M = 0,004 × 158 = <strong>0,632 g/L</strong></div></div>
<div class="correction-item"><strong>2.4.</strong> <div class="formule-correction">Facteur de dilution f = V₂/V₁ = 1000/200 = <strong>5</strong></div></div>
</div>

<div class="correction-box">
<h2>PARTIE II — PHYSIQUE</h2>
<h3>Exercice 3 : Forces et unités SI</h3>
<div class="correction-item"><strong>3.1.</strong> Tableau des unités :
  <table>
    <tr><th>Grandeur</th><th>Symbole</th><th>Unité SI</th><th>Symbole</th></tr>
    <tr><td>Force</td><td>F</td><td><strong>Newton</strong></td><td><strong>N</strong></td></tr>
    <tr><td>Masse</td><td>m</td><td><strong>Kilogramme</strong></td><td><strong>kg</strong></td></tr>
    <tr><td>Poids</td><td>P</td><td><strong>Newton</strong></td><td><strong>N</strong></td></tr>
    <tr><td>Travail</td><td>W</td><td><strong>Joule</strong></td><td><strong>J</strong></td></tr>
  </table>
</div>
<div class="correction-item"><strong>3.2.</strong> <div class="formule-correction">P = m × g = 6 × 10 = <strong>60 N</strong></div></div>
<div class="correction-item"><strong>3.3.</strong> <div class="formule-correction">F = P × sin(30°) = 60 × 0,5 = <strong>30 N</strong></div></div>

<h3>Exercice 4 : Énergie potentielle et travail</h3>
<div class="correction-item"><strong>4.1.</strong> <div class="formule-correction">E<sub>p</sub> = m × g × h = 500 × 10 × 10 = <strong>50 000 J = 50 kJ</strong></div></div>
<div class="correction-item"><strong>4.2.</strong> <div class="formule-correction">P<sub>u</sub> = E<sub>p</sub>/t = 50 000/25 = <strong>2 000 W = 2 kW</strong></div></div>
<div class="correction-item"><strong>4.3.</strong> <div class="formule-correction">η = P<sub>u</sub>/P<sub>e</sub> = 2 000/25 000 = <strong>0,08 = 8 %</strong></div></div>
<div class="correction-item"><strong>4.4.</strong> Le rendement est inférieur à 1 car une partie de l'énergie est dissipée en <strong>chaleur par effet Joule</strong> dans le moteur et les câbles, et par les <strong>frottements mécaniques</strong> dans la grue.</div>

<h3>Exercice 5 : Résistance — Loi d'Ohm</h3>
<div class="correction-item"><strong>5.1.</strong> <div class="formule-correction">R<sub>eq</sub> = R₁ + R₂ = 40 + 60 = <strong>100 Ω</strong></div></div>
<div class="correction-item"><strong>5.2.</strong> <div class="formule-correction">I = U/R<sub>eq</sub> = 20/100 = <strong>0,2 A</strong></div></div>
<div class="correction-item"><strong>5.3.</strong>
  <div class="formule-correction">U₁ = R₁ × I = 40 × 0,2 = <strong>8 V</strong><br>U₂ = R₂ × I = 60 × 0,2 = <strong>12 V</strong></div>
</div>
<div class="correction-item"><strong>5.4.</strong> Vérification : <div class="formule-correction">U₁ + U₂ = 8 + 12 = 20 V = U ✓</div></div>
</div>
</body></html>`;

// ═══════════════════════════════════════════════════════════════════════════
// BFEM 2018 — 2e Groupe
// ═══════════════════════════════════════════════════════════════════════════
const BFEM2018_G2_ENONCE = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>BFEM 2018 G2 PC</title>${CSS}</head><body>
${bfemHeader(2018,'2e Groupe','2h','2')}

<div class="partie">
<h2>PARTIE I — CHIMIE (8 points)</h2>
<h3>Exercice 1 : Résistance et loi d'Ohm (4 points)</h3>
<p>Un conducteur ohmique est soumis à diverses tensions. On mesure les intensités correspondantes :</p>
<table>
  <tr><th>U (V)</th><td>0</td><td>6</td><td>12</td><td>18</td><td>24</td></tr>
  <tr><th>I (mA)</th><td>0</td><td>30</td><td>60</td><td>90</td><td>120</td></tr>
</table>
<div class="question"><span class="barème">1 pt</span><strong>1.1.</strong> Tracer la courbe I = f(U).</div>
<div class="question"><span class="barème">1 pt</span><strong>1.2.</strong> Calculer la résistance R de ce conducteur à partir du tableau.</div>
<div class="question"><span class="barème">1 pt</span><strong>1.3.</strong> Deux conducteurs identiques R sont montés en dérivation sous U = 12 V. Calculer l'intensité totale.</div>
<div class="question"><span class="barème">1 pt</span><strong>1.4.</strong> Comparer avec l'intensité si les deux conducteurs étaient en série sous la même tension U = 12 V.</div>

<h3>Exercice 2 : Énergie potentielle (4 points)</h3>
<p>Un élève de masse m = 60 kg monte un escalier de h = 4 m en t = 20 s. (g = 10 N/kg)</p>
<div class="question"><span class="barème">1 pt</span><strong>2.1.</strong> Calculer l'énergie potentielle E<sub>p</sub> gagnée par l'élève.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.2.</strong> Calculer la puissance développée P.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.3.</strong> Citer deux appareils qui transforment l'énergie électrique en énergie mécanique.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.4.</strong> L'élève redescend sans effort par un toboggan. Quelle transformation d'énergie a lieu ?</div>
</div>

<div class="partie">
<h2>PARTIE II — CHIMIE (12 points)</h2>
<h3>Exercice 3 : Dosage acido-basique (4 points)</h3>
<p>On titre V<sub>a</sub> = 25 mL d'une solution d'acide sulfurique H₂SO₄ de concentration C<sub>a</sub> inconnue par une solution de NaOH de concentration C<sub>b</sub> = 0,1 mol/L. À l'équivalence, V<sub>b</sub> = 20 mL.</p>
<p>Équation : H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O</p>
<div class="question"><span class="barème">1 pt</span><strong>3.1.</strong> Pourquoi utilise-t-on 2 mol de NaOH pour 1 mol de H₂SO₄ ?</div>
<div class="question"><span class="barème">1 pt</span><strong>3.2.</strong> Calculer le nombre de moles de NaOH versées à l'équivalence.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.3.</strong> En déduire le nombre de moles de H₂SO₄ et calculer C<sub>a</sub>.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.4.</strong> Calculer la concentration massique de H₂SO₄. [M(H₂SO₄) = 98 g/mol]</div>

<h3>Exercice 4 : Combustion du butane (4 points)</h3>
<p>Le butane C₄H₁₀ est utilisé comme combustible.</p>
<div class="question"><span class="barème">1 pt</span><strong>4.1.</strong> Écrire l'équation de combustion complète du butane.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.2.</strong> Quelle masse m de CO₂ est produite par la combustion de m₀ = 58 g de butane ? [M(C₄H₁₀)=58 g/mol, M(CO₂)=44 g/mol]</div>
<div class="question"><span class="barème">1 pt</span><strong>4.3.</strong> Citer un danger de la combustion incomplète du butane.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.4.</strong> Le butane appartient à quelle famille ? Donner sa formule générale.</div>

<h3>Exercice 5 : Métaux (4 points)</h3>
<p>On dispose de fer (Fe), aluminium (Al), cuivre (Cu) et zinc (Zn).</p>
<div class="question"><span class="barème">1 pt</span><strong>5.1.</strong> Classer ces métaux par activité chimique décroissante.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.2.</strong> Écrire l'équation de la réaction du zinc avec l'acide chlorhydrique HCl.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.3.</strong> Le cuivre réagit-il avec HCl ? Justifier.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.4.</strong> Écrire l'équation de la réaction du fer avec l'oxygène.</div>
</div>
</body></html>`;

const BFEM2018_G2_CORRECTION = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Correction BFEM 2018 G2 PC</title>${CSS}</head><body>
<div class="header-bfem"><h1>✅ CORRECTION — BFEM 2018 Physique-Chimie — 2e Groupe</h1></div>

<div class="correction-box">
<h2>PARTIE I</h2>
<h3>Exercice 1 : Résistance et loi d'Ohm</h3>
<div class="correction-item"><strong>1.1.</strong> Courbe : Porter I (axe Y en mA) en fonction de U (axe X en V). Droite passant par l'origine via (6;30), (12;60), (18;90), (24;120).</div>
<div class="correction-item"><strong>1.2.</strong> <div class="formule-correction">R = U/I = 12/(60×10⁻³) = 12/0,06 = <strong>200 Ω</strong></div></div>
<div class="correction-item"><strong>1.3.</strong> En dérivation : R<sub>eq</sub> = R/2 = 100 Ω. <div class="formule-correction">I<sub>total</sub> = U/R<sub>eq</sub> = 12/100 = <strong>0,12 A = 120 mA</strong></div></div>
<div class="correction-item"><strong>1.4.</strong> En série : R<sub>eq</sub> = 2R = 400 Ω. <div class="formule-correction">I = U/R<sub>eq</sub> = 12/400 = <strong>0,03 A = 30 mA</strong></div>
En dérivation : I = 120 mA (4 fois plus qu'en série). La dérivation laisse passer plus de courant.
</div>

<h3>Exercice 2 : Énergie potentielle</h3>
<div class="correction-item"><strong>2.1.</strong> <div class="formule-correction">E<sub>p</sub> = m × g × h = 60 × 10 × 4 = <strong>2 400 J</strong></div></div>
<div class="correction-item"><strong>2.2.</strong> <div class="formule-correction">P = E<sub>p</sub>/t = 2 400/20 = <strong>120 W</strong></div></div>
<div class="correction-item"><strong>2.3.</strong> Appareils qui transforment énergie électrique → mécanique : <strong>moteur électrique</strong>, <strong>ventilateur</strong>, <strong>pompe électrique</strong>, <strong>ascenseur</strong>…</div>
<div class="correction-item"><strong>2.4.</strong> En redescendant, l'énergie potentielle de pesanteur E<sub>p</sub> se transforme en <strong>énergie cinétique</strong> (et en chaleur par frottements sur le toboggan).</div>
</div>

<div class="correction-box">
<h2>PARTIE II — CHIMIE</h2>
<h3>Exercice 3 : Dosage acido-basique</h3>
<div class="correction-item"><strong>3.1.</strong> H₂SO₄ est un acide <strong>diprotique</strong> : il libère 2 ions H⁺ par molécule. Il faut donc 2 mol de NaOH (qui capture 1 H⁺ chacune) pour neutraliser 1 mol de H₂SO₄.</div>
<div class="correction-item"><strong>3.2.</strong> <div class="formule-correction">n(NaOH) = C<sub>b</sub> × V<sub>b</sub> = 0,1 × 0,020 = <strong>0,002 mol</strong></div></div>
<div class="correction-item"><strong>3.3.</strong>
  <div class="formule-correction">n(H₂SO₄) = n(NaOH)/2 = 0,002/2 = 0,001 mol<br>
  C<sub>a</sub> = n/V<sub>a</sub> = 0,001/0,025 = <strong>0,04 mol/L</strong></div>
</div>
<div class="correction-item"><strong>3.4.</strong> <div class="formule-correction">C<sub>m</sub> = C<sub>a</sub> × M = 0,04 × 98 = <strong>3,92 g/L</strong></div></div>

<h3>Exercice 4 : Combustion du butane</h3>
<div class="correction-item"><strong>4.1.</strong> <div class="formule-correction">2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O</div></div>
<div class="correction-item"><strong>4.2.</strong> D'après l'équation : 2 mol C₄H₁₀ (2×58=116 g) → 8 mol CO₂ (8×44=352 g)<br>
  Pour m₀ = 58 g = 1 mol de C₄H₁₀ : <div class="formule-correction">m(CO₂) = 4 × 44 = <strong>176 g</strong></div>
</div>
<div class="correction-item"><strong>4.3.</strong> La combustion incomplète produit du <strong>monoxyde de carbone (CO)</strong>, gaz inodore et très toxique, qui peut provoquer une intoxication mortelle dans un espace mal ventilé.</div>
<div class="correction-item"><strong>4.4.</strong> Le butane C₄H₁₀ appartient à la famille des <strong>alcanes</strong>. Formule générale : <strong>CₙH₂ₙ₊₂</strong> (n=4 : 2×4+2=10 ✓).</div>

<h3>Exercice 5 : Métaux</h3>
<div class="correction-item"><strong>5.1.</strong> Ordre décroissant d'activité : <div class="formule-correction">Al &gt; Zn &gt; Fe &gt; Cu</div></div>
<div class="correction-item"><strong>5.2.</strong> Zinc + acide chlorhydrique : <div class="formule-correction">Zn + 2HCl → ZnCl₂ + H₂↑</div></div>
<div class="correction-item"><strong>5.3.</strong> <strong>Non</strong>, le cuivre ne réagit pas avec HCl dilué. Le cuivre est peu actif chimiquement : il se situe en bas de la série d'activité et ne déplace pas H⁺ des acides dilués.</div>
<div class="correction-item"><strong>5.4.</strong> Réaction du fer avec l'oxygène : <div class="formule-correction">4Fe + 3O₂ → 2Fe₂O₃</div>(formation de la rouille)</div>
</div>
</body></html>`;

// ═══════════════════════════════════════════════════════════════════════════
// BFEM 2017 — 1er Groupe
// ═══════════════════════════════════════════════════════════════════════════
const BFEM2017_G1_ENONCE = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>BFEM 2017 G1 PC</title>${CSS}</head><body>
${bfemHeader(2017,'1er Groupe','2h','2')}

<div class="partie">
<h2>PARTIE I — CHIMIE (8 points)</h2>
<h3>Exercice 1 : Solution — Dosage (4 points)</h3>
<p>Un flacon de Destop (déboucheur) contient une solution de soude NaOH de masse m = 28,6 g dissoute dans V = 143 mL de solution. [M(NaOH) = 40 g/mol]</p>
<div class="question"><span class="barème">1 pt</span><strong>1.1.</strong> Calculer la quantité de matière n de NaOH dans le flacon.</div>
<div class="question"><span class="barème">1 pt</span><strong>1.2.</strong> Calculer la concentration molaire C<sub>b</sub> de la solution.</div>
<div class="question"><span class="barème">1 pt</span><strong>1.3.</strong> Calculer la concentration massique C<sub>m</sub>.</div>
<div class="question"><span class="barème">1 pt</span><strong>1.4.</strong> On dose 10 mL de cette solution par HCl de C<sub>a</sub> = 0,1 mol/L. Calculer le volume V<sub>a</sub> d'HCl nécessaire pour atteindre l'équivalence.</div>

<h3>Exercice 2 : Hydrocarbures — GPL (4 points)</h3>
<p>Le gaz de pétrole liquéfié (GPL) est un mélange de propane C₃H₈ et de butane C₄H₁₀.</p>
<div class="question"><span class="barème">1 pt</span><strong>2.1.</strong> Donner la formule générale de la famille des alcanes et vérifier que propane et butane y appartiennent.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.2.</strong> Écrire l'équation de combustion complète du propane.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.3.</strong> Écrire l'équation de combustion complète du butane.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.4.</strong> Quel gaz dangereux peut se former lors d'une combustion incomplète ? Pourquoi est-il dangereux ?</div>
</div>

<div class="partie">
<h2>PARTIE II — PHYSIQUE (12 points)</h2>
<h3>Exercice 3 : Lentilles (4 points)</h3>
<p>Une lentille convergente a une distance focale f' = 10 cm. Un objet AB est placé à OA = −30 cm.</p>
<div class="question"><span class="barème">1 pt</span><strong>3.1.</strong> Calculer la vergence V de la lentille.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.2.</strong> Calculer la position OA' de l'image A'B' par la formule de conjugaison.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.3.</strong> Calculer le grandissement g.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.4.</strong> Caractériser l'image : réelle ou virtuelle ? droite ou renversée ? agrandie, réduite ou de même taille ?</div>

<h3>Exercice 4 : Ampèremètre et résistance (4 points)</h3>
<p>Un ampèremètre de calibre 5 A indique une déviation de 3/5 du fond d'échelle (100 divisions) sous une tension U = 6 V.</p>
<div class="question"><span class="barème">1 pt</span><strong>4.1.</strong> Quelle est l'intensité lue sur l'ampèremètre ?</div>
<div class="question"><span class="barème">1 pt</span><strong>4.2.</strong> Calculer la résistance R du circuit.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.3.</strong> Si on ajoute une résistance R' = 1 Ω en série, calculer la nouvelle intensité I'.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.4.</strong> L'ampèremètre se branche-t-il en série ou en dérivation ? Pourquoi ?</div>

<h3>Exercice 5 : Forces et travail (4 points)</h3>
<p>Un porteur à Dakar porte une charge de m = 40 kg sur une distance horizontale d = 50 m. (g = 10 N/kg)</p>
<div class="question"><span class="barème">1 pt</span><strong>5.1.</strong> Calculer le poids P de la charge.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.2.</strong> Calculer le travail du poids lors du trajet horizontal.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.3.</strong> La force de portage est F = 400 N (verticale vers le haut). Calculer son travail sur le trajet horizontal.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.4.</strong> Quelle force fournit réellement un travail moteur lors de ce déplacement horizontal ? Expliquer.</div>
</div>
</body></html>`;

const BFEM2017_G1_CORRECTION = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Correction BFEM 2017 G1 PC</title>${CSS}</head><body>
<div class="header-bfem"><h1>✅ CORRECTION — BFEM 2017 Physique-Chimie — 1er Groupe</h1></div>

<div class="correction-box">
<h2>PARTIE I — CHIMIE</h2>
<h3>Exercice 1 : Solution Destop — Dosage</h3>
<div class="correction-item"><strong>1.1.</strong> <div class="formule-correction">n = m/M = 28,6/40 = <strong>0,715 mol</strong></div></div>
<div class="correction-item"><strong>1.2.</strong> <div class="formule-correction">C<sub>b</sub> = n/V = 0,715/0,143 = <strong>5 mol/L</strong></div></div>
<div class="correction-item"><strong>1.3.</strong> <div class="formule-correction">C<sub>m</sub> = C<sub>b</sub> × M = 5 × 40 = <strong>200 g/L</strong></div></div>
<div class="correction-item"><strong>1.4.</strong> À l'équivalence : C<sub>a</sub> × V<sub>a</sub> = C<sub>b</sub> × V<sub>b</sub>
  <div class="formule-correction">V<sub>a</sub> = C<sub>b</sub> × V<sub>b</sub>/C<sub>a</sub> = 5 × 10/0,1 = <strong>500 mL</strong></div>
  <p class="note">Ce volume très grand confirme que la solution de Destop est très concentrée en NaOH.</p>
</div>

<h3>Exercice 2 : GPL</h3>
<div class="correction-item"><strong>2.1.</strong> Formule générale des alcanes : CₙH₂ₙ₊₂
  <br>Propane C₃H₈ : 2×3+2 = 8 ✓ | Butane C₄H₁₀ : 2×4+2 = 10 ✓ → ce sont bien des alcanes.
</div>
<div class="correction-item"><strong>2.2.</strong> Combustion complète du propane : <div class="formule-correction">C₃H₈ + 5O₂ → 3CO₂ + 4H₂O</div></div>
<div class="correction-item"><strong>2.3.</strong> Combustion complète du butane : <div class="formule-correction">2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O</div></div>
<div class="correction-item"><strong>2.4.</strong> Lors d'une combustion incomplète, il se forme du <strong>monoxyde de carbone (CO)</strong>. Ce gaz est <strong>inodore et incolore</strong>, donc indétectable sans détecteur. Il est <strong>extrêmement toxique</strong> car il se fixe à l'hémoglobine du sang à la place de l'oxygène, provoquant une asphyxie pouvant être mortelle.</div>
</div>

<div class="correction-box">
<h2>PARTIE II — PHYSIQUE</h2>
<h3>Exercice 3 : Lentilles</h3>
<div class="correction-item"><strong>3.1.</strong> <div class="formule-correction">V = 1/f' = 1/0,10 = <strong>+10 δ</strong></div></div>
<div class="correction-item"><strong>3.2.</strong> OA = −30 cm = −0,30 m
  <div class="formule-correction">1/OA' = 1/f' + 1/OA = 1/0,10 + 1/(−0,30) = 10 − 3,33 = 6,67<br>
  OA' = 1/6,67 ≈ <strong>0,15 m = 15 cm</strong></div>
</div>
<div class="correction-item"><strong>3.3.</strong> <div class="formule-correction">g = OA'/OA = 15/(−30) = <strong>−0,5</strong></div></div>
<div class="correction-item"><strong>3.4.</strong> OA' > 0 → image <strong>réelle</strong>. g < 0 → image <strong>renversée</strong>. |g| = 0,5 < 1 → image <strong>réduite</strong> (2 fois plus petite).</div>

<h3>Exercice 4 : Ampèremètre et résistance</h3>
<div class="correction-item"><strong>4.1.</strong> Déviation = 3/5 du fond d'échelle. Calibre = 5 A.
  <div class="formule-correction">I = (3/5) × 5 = <strong>3 A</strong></div>
</div>
<div class="correction-item"><strong>4.2.</strong> <div class="formule-correction">R = U/I = 6/3 = <strong>2 Ω</strong></div></div>
<div class="correction-item"><strong>4.3.</strong> Résistance totale = R + R' = 2 + 1 = 3 Ω
  <div class="formule-correction">I' = U/(R+R') = 6/3 = <strong>2 A</strong></div>
</div>
<div class="correction-item"><strong>4.4.</strong> L'ampèremètre se branche <strong>en série</strong>. Pour mesurer l'intensité, le courant doit traverser l'ampèremètre. Sa résistance interne est quasi nulle pour ne pas modifier le circuit.</div>

<h3>Exercice 5 : Forces et travail</h3>
<div class="correction-item"><strong>5.1.</strong> <div class="formule-correction">P = m × g = 40 × 10 = <strong>400 N</strong></div></div>
<div class="correction-item"><strong>5.2.</strong> Le poids est vertical (vers le bas), le déplacement est horizontal → α = 90°.
  <div class="formule-correction">W(poids) = P × d × cos(90°) = 400 × 50 × 0 = <strong>0 J</strong> (travail nul)</div>
</div>
<div class="correction-item"><strong>5.3.</strong> La force de portage F = 400 N est verticale (vers le haut), le déplacement est horizontal → α = 90°.
  <div class="formule-correction">W(F) = F × d × cos(90°) = 400 × 50 × 0 = <strong>0 J</strong> (travail nul)</div>
</div>
<div class="correction-item"><strong>5.4.</strong> Sur un trajet strictement horizontal, ni le poids ni la force de portage ne fournissent de travail (ils sont perpendiculaires au déplacement). C'est la <strong>force musculaire horizontale</strong> (propulsion) qui réalise un travail moteur pour avancer, contre la force de frottement au sol.</div>
</div>
</body></html>`;

// ═══════════════════════════════════════════════════════════════════════════
// BFEM 2017 — 2e Groupe
// ═══════════════════════════════════════════════════════════════════════════
const BFEM2017_G2_ENONCE = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>BFEM 2017 G2 PC</title>${CSS}</head><body>
${bfemHeader(2017,'2e Groupe','2h','2')}

<div class="partie">
<h2>PARTIE I — CHIMIE (8 points)</h2>
<h3>Exercice 1 : Hydrocarbures — Formules (4 points)</h3>
<p>Donner la formule brute des hydrocarbures suivants :</p>
<div class="question"><span class="barème">0,5 pt</span><strong>1.1.</strong> L'alcane à 5 carbones (pentane).</div>
<div class="question"><span class="barème">0,5 pt</span><strong>1.2.</strong> L'alcène à 3 carbones (propène).</div>
<div class="question"><span class="barème">0,5 pt</span><strong>1.3.</strong> L'alcyne à 3 carbones (propyne).</div>
<div class="question"><span class="barème">0,5 pt</span><strong>1.4.</strong> L'alcane à 6 carbones (hexane).</div>
<div class="question"><span class="barème">1 pt</span><strong>1.5.</strong> Écrire l'équation de combustion complète de l'éthène C₂H₄.</div>
<div class="question"><span class="barème">1 pt</span><strong>1.6.</strong> L'éthène décolore-t-il l'eau de brome ? Pourquoi ?</div>

<h3>Exercice 2 : Métaux et réactions chimiques (4 points)</h3>
<div class="question"><span class="barème">1 pt</span><strong>2.1.</strong> Écrire l'équation de la réaction de l'aluminium avec l'oxygène.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.2.</strong> Écrire l'équation de la réaction du zinc avec l'oxygène.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.3.</strong> Écrire l'équation de la réaction de l'aluminium avec l'acide chlorhydrique.</div>
<div class="question"><span class="barème">1 pt</span><strong>2.4.</strong> Le cuivre réagit-il avec l'acide chlorhydrique ? Justifier avec la série d'activité.</div>
</div>

<div class="partie">
<h2>PARTIE II — PHYSIQUE (12 points)</h2>
<h3>Exercice 3 : Forces, travail, puissance et électrisation (4 points)</h3>
<p>Un camion de masse m = 5 000 kg monte une pente de h = 20 m sur une distance d = 100 m en t = 50 s. (g = 10 N/kg)</p>
<div class="question"><span class="barème">1 pt</span><strong>3.1.</strong> Calculer le poids P du camion.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.2.</strong> Calculer le travail W du poids lors de la montée (le poids s'oppose à la montée).</div>
<div class="question"><span class="barème">1 pt</span><strong>3.3.</strong> Calculer la puissance P<sub>m</sub> minimale nécessaire du moteur.</div>
<div class="question"><span class="barème">1 pt</span><strong>3.4.</strong> Expliquer le phénomène d'électrisation par frottement observé lorsqu'on frotte une règle plastique sur un tissu de laine.</div>

<h3>Exercice 4 : Résistances — Montages (4 points)</h3>
<p>On dispose de R₁ = 30 Ω, R₂ = 60 Ω, R₃ = 20 Ω. On les monte : R₁ et R₂ en dérivation, puis en série avec R₃. Tension du générateur U = 30 V.</p>
<div class="question"><span class="barème">1 pt</span><strong>4.1.</strong> Calculer la résistance équivalente R₁₂ de R₁ et R₂ en dérivation.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.2.</strong> Calculer la résistance totale R<sub>eq</sub> du circuit.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.3.</strong> Calculer l'intensité I dans le circuit principal.</div>
<div class="question"><span class="barème">1 pt</span><strong>4.4.</strong> Calculer l'intensité I₁ dans R₁ et I₂ dans R₂ (sachant que U₁₂ = U − U₃).</div>

<h3>Exercice 5 : Énergie électrique (4 points)</h3>
<p>Un chauffe-eau électrique de puissance P = 1 500 W fonctionne t = 3 h par jour pendant 30 jours. Prix du kWh : 100 FCFA.</p>
<div class="question"><span class="barème">1 pt</span><strong>5.1.</strong> Calculer l'énergie consommée en kWh sur 30 jours.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.2.</strong> Calculer le coût de cette consommation en FCFA.</div>
<div class="question"><span class="barème">1 pt</span><strong>5.3.</strong> Quelle transformation d'énergie réalise le chauffe-eau ?</div>
<div class="question"><span class="barème">1 pt</span><strong>5.4.</strong> Calculer l'énergie consommée en joules sur 30 jours.</div>
</div>
</body></html>`;

const BFEM2017_G2_CORRECTION = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Correction BFEM 2017 G2 PC</title>${CSS}</head><body>
<div class="header-bfem"><h1>✅ CORRECTION — BFEM 2017 Physique-Chimie — 2e Groupe</h1></div>

<div class="correction-box">
<h2>PARTIE I — CHIMIE</h2>
<h3>Exercice 1 : Hydrocarbures</h3>
<div class="correction-item"><strong>1.1.</strong> Pentane (alcane, n=5) : <div class="formule-correction">C₅H₁₂</div> (2×5+2=12 ✓)</div>
<div class="correction-item"><strong>1.2.</strong> Propène (alcène, n=3) : <div class="formule-correction">C₃H₆</div> (2×3=6 ✓)</div>
<div class="correction-item"><strong>1.3.</strong> Propyne (alcyne, n=3) : <div class="formule-correction">C₃H₄</div> (2×3−2=4 ✓)</div>
<div class="correction-item"><strong>1.4.</strong> Hexane (alcane, n=6) : <div class="formule-correction">C₆H₁₄</div> (2×6+2=14 ✓)</div>
<div class="correction-item"><strong>1.5.</strong> Combustion complète de l'éthène : <div class="formule-correction">C₂H₄ + 3O₂ → 2CO₂ + 2H₂O</div></div>
<div class="correction-item"><strong>1.6.</strong> <strong>Oui</strong>, l'éthène décolore l'eau de brome. L'éthène est un alcène avec une double liaison C=C qui réagit par <strong>addition</strong> avec le dibrome Br₂ : la couleur brun-orangée de l'eau de brome disparaît. Les alcanes (liaisons simples) ne réagissent pas ainsi.</div>

<h3>Exercice 2 : Métaux</h3>
<div class="correction-item"><strong>2.1.</strong> Aluminium + oxygène : <div class="formule-correction">4Al + 3O₂ → 2Al₂O₃</div></div>
<div class="correction-item"><strong>2.2.</strong> Zinc + oxygène : <div class="formule-correction">2Zn + O₂ → 2ZnO</div></div>
<div class="correction-item"><strong>2.3.</strong> Aluminium + acide chlorhydrique : <div class="formule-correction">2Al + 6HCl → 2AlCl₃ + 3H₂↑</div></div>
<div class="correction-item"><strong>2.4.</strong> <strong>Non</strong>, le cuivre ne réagit pas avec HCl. Dans la série d'activité : Al > Zn > Fe > Pb > <strong>Cu</strong>. Le cuivre est peu actif et ne peut pas déplacer H⁺ des acides dilués comme HCl. Il ne se dissout pas et ne dégage pas de H₂.</div>
</div>

<div class="correction-box">
<h2>PARTIE II — PHYSIQUE</h2>
<h3>Exercice 3 : Forces, travail, puissance et électrisation</h3>
<div class="correction-item"><strong>3.1.</strong> <div class="formule-correction">P = m × g = 5 000 × 10 = <strong>50 000 N = 50 kN</strong></div></div>
<div class="correction-item"><strong>3.2.</strong> Le poids s'oppose à la montée (travail résistant). Composante verticale = P × h/d = 50 000 × 20/100... En fait W = P × h (travail contre la pesanteur sur dénivelée h) :
  <div class="formule-correction">W = P × h = 50 000 × 20 = <strong>1 000 000 J = 1 MJ</strong> (résistant : W < 0 pour le poids)</div>
  Le moteur doit fournir au moins |W| = 1 MJ.
</div>
<div class="correction-item"><strong>3.3.</strong> <div class="formule-correction">P<sub>m</sub> = W/t = 1 000 000/50 = <strong>20 000 W = 20 kW</strong></div></div>
<div class="correction-item"><strong>3.4.</strong> En frottant la règle plastique sur la laine, des <strong>électrons</strong> sont arrachés de la laine et se déposent sur la règle. La règle acquiert des charges négatives (excès d'électrons) et la laine des charges positives (déficit d'électrons). Les deux corps sont alors <strong>électrisés</strong> et s'attirent mutuellement (charges de signes opposés).</div>

<h3>Exercice 4 : Résistances</h3>
<div class="correction-item"><strong>4.1.</strong> R₁₂ en dérivation :
  <div class="formule-correction">1/R₁₂ = 1/30 + 1/60 = 2/60 + 1/60 = 3/60 = 1/20<br>R₁₂ = <strong>20 Ω</strong></div>
</div>
<div class="correction-item"><strong>4.2.</strong> R<sub>eq</sub> = R₁₂ + R₃ = 20 + 20 = <strong>40 Ω</strong></div>
<div class="correction-item"><strong>4.3.</strong> <div class="formule-correction">I = U/R<sub>eq</sub> = 30/40 = <strong>0,75 A</strong></div></div>
<div class="correction-item"><strong>4.4.</strong>
  U₃ = R₃ × I = 20 × 0,75 = 15 V<br>
  U₁₂ = U − U₃ = 30 − 15 = 15 V (tension aux bornes du groupe en dérivation)
  <div class="formule-correction">I₁ = U₁₂/R₁ = 15/30 = <strong>0,5 A</strong><br>
  I₂ = U₁₂/R₂ = 15/60 = <strong>0,25 A</strong></div>
  Vérif. : I₁ + I₂ = 0,5 + 0,25 = 0,75 A = I ✓
</div>

<h3>Exercice 5 : Énergie électrique</h3>
<div class="correction-item"><strong>5.1.</strong> <div class="formule-correction">E = P × t = 1,5 kW × (3 × 30) h = 1,5 × 90 = <strong>135 kWh</strong></div></div>
<div class="correction-item"><strong>5.2.</strong> <div class="formule-correction">Coût = 135 × 100 = <strong>13 500 FCFA</strong></div></div>
<div class="correction-item"><strong>5.3.</strong> Le chauffe-eau transforme l'<strong>énergie électrique</strong> en <strong>énergie thermique</strong> (chaleur) par effet Joule.</div>
<div class="correction-item"><strong>5.4.</strong> <div class="formule-correction">E (J) = E (kWh) × 3 600 000 = 135 × 3 600 000 = <strong>486 000 000 J = 486 MJ</strong></div></div>
</div>
</body></html>`;

// ═══════════════════════════════════════════════════════════════════════════
// DONNÉES ÉPREUVES
// ═══════════════════════════════════════════════════════════════════════════
const EPREUVES = [
  { annee:2019, session:'1er Groupe', titre:'BFEM 2019 — Physique-Chimie — 1er Groupe', contenuHTML:BFEM2019_G1_ENONCE, correctionHTML:BFEM2019_G1_CORRECTION },
  { annee:2019, session:'2e Groupe',  titre:'BFEM 2019 — Physique-Chimie — 2e Groupe',  contenuHTML:BFEM2019_G2_ENONCE, correctionHTML:BFEM2019_G2_CORRECTION },
  { annee:2018, session:'1er Groupe', titre:'BFEM 2018 — Physique-Chimie — 1er Groupe', contenuHTML:BFEM2018_G1_ENONCE, correctionHTML:BFEM2018_G1_CORRECTION },
  { annee:2018, session:'2e Groupe',  titre:'BFEM 2018 — Physique-Chimie — 2e Groupe',  contenuHTML:BFEM2018_G2_ENONCE, correctionHTML:BFEM2018_G2_CORRECTION },
  { annee:2017, session:'1er Groupe', titre:'BFEM 2017 — Physique-Chimie — 1er Groupe', contenuHTML:BFEM2017_G1_ENONCE, correctionHTML:BFEM2017_G1_CORRECTION },
  { annee:2017, session:'2e Groupe',  titre:'BFEM 2017 — Physique-Chimie — 2e Groupe',  contenuHTML:BFEM2017_G2_ENONCE, correctionHTML:BFEM2017_G2_CORRECTION },
];

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connecté à MongoDB (base : tate)');

  const db = mongoose.connection.db;
  const admin = await db.collection('users').findOne({ role: 'admin' });
  if (!admin) throw new Error('Admin introuvable');
  const adminId = admin._id;

  for (const ep of EPREUVES) {
    // Supprimer si existant pour forcer la mise à jour
    await Epreuve.deleteOne({ type:'BFEM', matiere:'Physique-Chimie', niveau:'3eme', annee:ep.annee, session:ep.session });

    const epreuve = await Epreuve.create({
      type: 'BFEM',
      matiere: 'Physique-Chimie',
      niveau: '3eme',
      annee: ep.annee,
      session: ep.session,
      titre: ep.titre,
      duree: '2h',
      coefficient: 2,
      contenuHTML: ep.contenuHTML,
      correctionHTML: ep.correctionHTML,
      publie: true,
      creePar: adminId,
    });

    console.log(`✅ Épreuve créée : ${ep.titre} (id: ${epreuve._id})`);
  }

  await mongoose.disconnect();
  console.log('\n🎉 Épreuves BFEM PC 3ème créées (2017, 2018, 2019) !');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
