const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0";
const adminId = "69dfac0adb8037a014ca9178";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const mat = await db.collection("matieres").insertOne({
    code: "AN-AD", nom: "Anglais Adultes", icone: "\uD83C\uDDEC\uD83C\uDDE7", couleur: "#0C8599",
    niveaux: ["Adulte"], actif: true, estLangue: true, ordre: 12,
    createdAt: new Date(), updatedAt: new Date()
  });
  const matId = mat.insertedId.toString();
  console.log("Matiere AN-AD creee:", matId);

  async function addChap(titre, objectif, contenu, questions) {
    const chap = await db.collection("chapitres").insertOne({
      matiereId: new mongoose.Types.ObjectId(matId), titre, niveau: "Adulte", objectif, ordre: 1, actif: true,
      createdAt: new Date(), updatedAt: new Date()
    });
    const correctionsTypes = questions.map(q => ({ question: q.q, reponse: q.r, type: "q", explication: "" }));
    await db.collection("lecons").insertOne({
      chapitreId: chap.insertedId, titre, matiere: matId, classe: "Adulte", statut: "publie",
      masque: false, creePar: adminId, contenuHTML: contenu, contenuBrut: "", dureeExercices: 15,
      contenuFormate: { correctionsTypes, exercices: [] },
      createdAt: new Date(), updatedAt: new Date()
    });
    console.log("  OK: " + titre);
  }

  await addChap("Seance 1 : Presentation & Salutations",
    "Se presenter et saluer en contexte professionnel",
    "<h1>\uD83D\uDC4B S1 : Pr\u00e9sentation & Salutations</h1><p>Savoir se pr\u00e9senter et utiliser les salutations appropri\u00e9es est essentiel.</p><div class=bloc-essentiel><h2>A RETENIR</h2><p>Good morning (matin), Good afternoon (apr\u00e8s-midi), Hello/Hi (salut).</p><p>Verbe TO BE : I am, You are, He/She/It is, We are, They are.</p><p>Nice to meet you = Enchant\u00e9. My name is... = Je m'appelle...</p></div>",
    [{q:"Comment dit-on Bonjour le matin ?",r:"Good morning"},{q:"Que signifie Nice to meet you ?",r:"Enchant\u00e9"},{q:"Quel verbe pour Je suis ?",r:"I am"}]);

  await addChap("Seance 2 : Questions quotidiennes",
    "Poser des questions et parler de sa routine",
    "<h1>\u2753 S2 : Questions quotidiennes</h1><p>WH-words : What (quoi), Where (o\u00f9), When (quand), Why (pourquoi), How (comment).</p><div class=bloc-essentiel><h2>A RETENIR</h2><p>Present Simple : I work, she works. Questions avec DO/DOES.</p><p>Routine : wake up, eat breakfast, go to work, have lunch, come back, watch TV, go to bed.</p></div>",
    [{q:"Citez 3 WH-words",r:"What, Where, When"},{q:"Do ou Does pour elle ?",r:"Does"},{q:"Go to work signifie ?",r:"Aller au travail"}]);

  await addChap("Seance 3 : Present Continuous",
    "D\u00e9crire des actions en cours",
    "<h1>\uD83C\uDFA5 S3 : Present Continuous</h1><p>Action en cours : TO BE + verbe-ing.</p><div class=bloc-essentiel><h2>A RETENIR</h2><p>I am working / She is reading / They are playing.</p><p>Can = capacit\u00e9 (I can speak). May = permission (May I come in?).</p></div>",
    [{q:"Formation du Present Continuous ?",r:"TO BE + verbe-ing"},{q:"Que signifie Can ?",r:"Capacit\u00e9"},{q:"May I... = ?",r:"Puis-je...?"}]);

  await addChap("Seance 4 : Simple Past",
    "Raconter des \u00e9v\u00e9nements pass\u00e9s",
    "<h1>\u23F0 S4 : Parler du pass\u00e9 (Simple Past)</h1><p>Verbes r\u00e9guliers : +ed (worked). Irr\u00e9guliers : go-went, have-had, do-did.</p><div class=bloc-essentiel><h2>A RETENIR</h2><p>Questions : DID + sujet + verbe. Must = obligation. Have to = n\u00e9cessit\u00e9.</p></div>",
    [{q:"Past des verbes r\u00e9guliers ?",r:"+ed"},{q:"Go au pass\u00e9 ?",r:"Went"},{q:"Question au pass\u00e9 avec ?",r:"DID"}]);

  await addChap("Seance 5 : Futur et projets",
    "Exprimer le futur et les intentions",
    "<h1>\uD83D\uDD2E S5 : Futur et projets</h1><p>Will = d\u00e9cision spontan\u00e9e. Going to = projet pr\u00e9vu.</p><div class=bloc-essentiel><h2>A RETENIR</h2><p>Present Perfect : have/has + participe pass\u00e9. May = possibilit\u00e9. Might = incertitude.</p></div>",
    [{q:"Will vs Going to ?",r:"Will = spontan\u00e9, Going to = pr\u00e9vu"},{q:"Present Perfect forme ?",r:"Have/Has + participe pass\u00e9"},{q:"Might exprime ?",r:"Incertitude"}]);

  await addChap("Seance 6 : Voyage & Travail",
    "Situations pratiques - voyage et r\u00e9unions",
    "<h1>\u2708\uFE0F S6 : Voyage & Travail</h1><p>Vocabulaire voyage : passport, ticket, boarding pass, luggage, gate, flight.</p><div class=bloc-essentiel><h2>A RETENIR</h2><p>R\u00e9union : meeting, agenda, deadline, presentation, discuss, propose.</p></div>",
    [{q:"Boarding pass = ?",r:"Carte d'embarquement"},{q:"Deadline = ?",r:"Date limite"},{q:"Gate = ?",r:"Porte d'embarquement"}]);

  await addChap("Seance 7 : Nuances et pr\u00e9cisions",
    "Present Perfect vs Past, comparatifs",
    "<h1>\u2696\uFE0F S7 : Nuances</h1><p>Present Perfect = exp\u00e9rience. Simple Past = moment pr\u00e9cis.</p><div class=bloc-essentiel><h2>A RETENIR</h2><p>Comparatif : adj+er+than (bigger than), more+adj (more important). Superlatif : the+adj+est (the biggest), the most+adj.</p></div>",
    [{q:"Present Perfect vs Past ?",r:"Perfect = exp\u00e9rience, Past = moment pr\u00e9cis"},{q:"Comparatif de big ?",r:"Bigger"},{q:"Superlatif de important ?",r:"The most important"}]);

  await addChap("Seance 8 : D\u00e9bats et argumentation",
    "Exprimer son opinion, \u00eatre d'accord ou pas",
    "<h1>\uD83D\uDDE3\uFE0F S8 : D\u00e9bats</h1><p>I think, In my opinion, I believe, I agree, I disagree.</p><div class=bloc-essentiel><h2>A RETENIR</h2><p>You are right (tu as raison), That's true (c'est vrai), I don't think so (je ne pense pas).</p></div>",
    [{q:"In my opinion = ?",r:"\u00c0 mon avis"},{q:"I disagree = ?",r:"Je ne suis pas d'accord"},{q:"3 fa\u00e7ons d'exprimer son opinion ?",r:"I think, In my opinion, I believe"}]);

  await addChap("Seance 9 : Bilan final",
    "R\u00e9vision g\u00e9n\u00e9rale et mise en situation",
    "<h1>\uD83C\uDFC6 S9 : Bilan final</h1><p>R\u00e9vision de tous les temps : Present Simple, Present Continuous, Simple Past, Present Perfect, Future.</p><div class=bloc-essentiel><h2>RECAP</h2><p><strong>Pr\u00e9sentation finale :</strong> Parle de toi, ton parcours, ton travail, tes projets - 5 minutes en continu !</p></div>",
    [{q:"Citez 3 temps en anglais",r:"Present Simple, Past, Future"},{q:"Will exprime ?",r:"D\u00e9cision spontan\u00e9e"},{q:"Present Perfect = ?",r:"Have/Has + participe pass\u00e9"}]);

  console.log("\n=== 9 SEANCES CREES avec succes ===");
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
