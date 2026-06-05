const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0";
const adminId = "69dfac0adb8037a014ca9178";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  // Creer matieres
  const ve = await db.collection("matieres").insertOne({
    code: "VE", nom: "Vivre ensemble", icone: "🤝", couleur: "#E8590C",
    niveaux: ["CM1"], actif: true, estLangue: false, ordre: 10,
    createdAt: new Date(), updatedAt: new Date()
  });
  const veId = ve.insertedId.toString();
  const vm = await db.collection("matieres").insertOne({
    code: "VM", nom: "Vivre dans son milieu", icone: "🌍", couleur: "#0CA5E8",
    niveaux: ["CM1"], actif: true, estLangue: false, ordre: 11,
    createdAt: new Date(), updatedAt: new Date()
  });
  const vmId = vm.insertedId.toString();
  console.log("Matieres creees OK");

  async function addLecon(matiereId, titreChapitre, titreLecon, contenu) {
    const chap = await db.collection("chapitres").insertOne({
      matiereId, titre: titreChapitre, niveau: "CM1", objectif: titreChapitre,
      ordre: 1, actif: true, createdAt: new Date(), updatedAt: new Date()
    });
    await db.collection("lecons").insertOne({
      chapitreId: chap.insertedId, titre: titreLecon, matiere: matiereId,
      classe: "CM1", statut: "publie", masque: false, creePar: adminId,
      contenuHTML: contenu, contenuBrut: "", dureeExercices: 10,
      createdAt: new Date(), updatedAt: new Date()
    });
    console.log("  " + titreLecon);
  }

  console.log("\n--- VIVRE ENSEMBLE ---");
  
  await addLecon(veId, "La divergence d opinion", "La divergence d opinion",
    "<h1>\u{1F5E3}\uFE0F Le\u00e7on 1 : La divergence d opinion</h1>" +
    "<div class=intro><p>L opinion est l expression d un point de vue, d un avis.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>Libert\u00e9 d opinion = possibilit\u00e9 d exprimer son avis sans contrainte.</p>" +
    "<p>Divergence d opinion = d\u00e9saccord, diff\u00e9rence de point de vue.</p>" +
    "<p>Pour r\u00e9gler : \u00e9coute, retenue, ouverture d esprit, respect, bonne foi.</p></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. L opinion c est...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. L expression d un avis</label>" +
    "<label><input type=radio name=q1 value=B> B. Un ordre</label>" +
    "<label><input type=radio name=q1 value=C> C. Une bagarre</label></div>" +
    "<div class=question><p><strong>2. Pour r\u00e9gler un conflit...</strong></p>" +
    "<label><input type=radio name=q2 value=A data-correct=true> A. Ecouter et respecter</label>" +
    "<label><input type=radio name=q2 value=B> B. Crier</label>" +
    "<label><input type=radio name=q2 value=C> C. Ignorer</label></div>");

  await addLecon(veId, "La diff\u00e9rence d appartenance", "La diff\u00e9rence d appartenance",
    "<h1>\u{1F30D} Le\u00e7on 2 : La diff\u00e9rence d appartenance</h1>" +
    "<div class=intro><p>Le S\u00e9n\u00e9gal a une diversit\u00e9 ethnique et religieuse.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<table><tr><th>Probl\u00e8mes</th><th>Solutions</th></tr>" +
    "<tr><td>Rivalit\u00e9</td><td>Dialogue</td></tr>" +
    "<tr><td>Intol\u00e9rance</td><td>Egalit\u00e9</td></tr>" +
    "<tr><td>Repli identitaire</td><td>Ouverture d esprit</td></tr>" +
    "<tr><td>Moquerie</td><td>Respect</td></tr>" +
    "<tr><td>M\u00e9pris</td><td>Humilit\u00e9</td></tr></table></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. Le S\u00e9n\u00e9gal a une diversit\u00e9...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. Ethnique et religieuse</label>" +
    "<label><input type=radio name=q1 value=B> B. Uniquement religieuse</label>" +
    "<label><input type=radio name=q1 value=C> C. Aucune diversit\u00e9</label></div>");

  await addLecon(veId, "Le drapeau national", "Le drapeau national",
    "<h1>\u{1F1F8}\u{1F1F3} Le\u00e7on 3 : Le drapeau national</h1>" +
    "<div class=intro><p>Symbole de l ind\u00e9pendance nationale.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>3 bandes verticales : Vert, Jaune, Rouge + \u00e9toile verte.</p>" +
    "<table><tr><th>Couleur</th><th>Symbole</th></tr>" +
    "<tr><td>Vert</td><td>Esp\u00e9rance</td></tr>" +
    "<tr><td>Jaune</td><td>Richesse</td></tr>" +
    "<tr><td>Rouge</td><td>Sacrifice des anc\u00eatres</td></tr></table>" +
    "<p>En cas de deuil : drapeau en berne.</p></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. Le vert symbolise...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. L esp\u00e9rance</label>" +
    "<label><input type=radio name=q1 value=B> B. Le sang</label>" +
    "<label><input type=radio name=q1 value=C> C. La richesse</label></div>" +
    "<div class=question><p><strong>2. En cas de deuil, le drapeau est...</strong></p>" +
    "<label><input type=radio name=q2 value=A data-correct=true> A. Mis en berne</label>" +
    "<label><input type=radio name=q2 value=B> B. Enlev\u00e9</label>" +
    "<label><input type=radio name=q2 value=C> C. Br\u00fbl\u00e9</label></div>");

  await addLecon(veId, "L hymne national", "L hymne national",
    "<h1>\u{1F3B5} Le\u00e7on 4 : L hymne national</h1>" +
    "<div class=intro><p>Indicatif musical qui identifie notre pays.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>Auteur : L\u00e9opold S\u00e9dar Senghor. Musique : Herbert Pepper. Arrangement : Julien Jouga.</p>" +
    "<p>On le chante : mont\u00e9e/descente du drapeau, visite Chef d Etat, comp\u00e9titions.</p></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. L hymne est \u00e9crit par...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. L\u00e9opold S\u00e9dar Senghor</label>" +
    "<label><input type=radio name=q1 value=B> B. Herbert Pepper</label>" +
    "<label><input type=radio name=q1 value=C> C. Julien Jouga</label></div>");

  await addLecon(veId, "Le sceau et la devise", "Le sceau et la devise",
    "<h1>\u{1F981} Le\u00e7on 5 : Le sceau et la devise</h1>" +
    "<div class=intro><p>Symboles de la R\u00e9publique.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>Le sceau a 2 faces : lion + \u00e9toile / baobab + devise.</p>" +
    "<p>Devise : Un Peuple Un But Une Foi.</p>" +
    "<p>Lion = courage et force. Baobab = puissance et sagesse.</p></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. La devise du S\u00e9n\u00e9gal est...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. Un Peuple Un But Une Foi</label>" +
    "<label><input type=radio name=q1 value=B> B. Libert\u00e9 Egalit\u00e9 Fraternit\u00e9</label>" +
    "<label><input type=radio name=q1 value=C> C. Travail Famille Patrie</label></div>" +
    "<div class=question><p><strong>2. Le lion symbolise...</strong></p>" +
    "<label><input type=radio name=q2 value=A data-correct=true> A. Le courage et la force</label>" +
    "<label><input type=radio name=q2 value=B> B. La sagesse</label>" +
    "<label><input type=radio name=q2 value=C> C. La richesse</label></div>");

  await addLecon(veId, "ASC", "Une organisation locale : ASC",
    "<h1>\u26BD Le\u00e7on 6 : Association Sportive et Culturelle (ASC)</h1>" +
    "<div class=intro><p>Groupement d hommes et de femmes d un m\u00eame quartier.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>Activit\u00e9s pendant les vacances : Nav\u00e9tane, th\u00e9\u00e2tre, danse, set-setal.</p></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. ASC signifie...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. Association Sportive et Culturelle</label>" +
    "<label><input type=radio name=q1 value=B> B. Association Sportive Commune</label>" +
    "<label><input type=radio name=q1 value=C> C. Amicale des Sportifs</label></div>");

  await addLecon(veId, "GIE", "Une organisation locale : GIE",
    "<h1>\u{1F4B0} Le\u00e7on 7 : Groupement d Int\u00e9r\u00eat Economique (GIE)</h1>" +
    "<div class=intro><p>Organisation qui regroupe hommes et femmes.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>Objectif : d\u00e9velopper l activit\u00e9 \u00e9conomique (agriculture, \u00e9levage, p\u00eache, commerce).</p></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. GIE signifie...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. Groupement d Int\u00e9r\u00eat Economique</label>" +
    "<label><input type=radio name=q1 value=B> B. Grande Industrie Economique</label>" +
    "<label><input type=radio name=q1 value=C> C. Groupement d Initiatives</label></div>");

  await addLecon(veId, "GPF", "Une organisation locale : GPF",
    "<h1>\u{1F469}\u200D\u{1F33E} Le\u00e7on 8 : Groupement de Promotion F\u00e9minine (GPF)</h1>" +
    "<div class=intro><p>Organisation qui int\u00e8gre les femmes dans l \u00e9conomie.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>Activit\u00e9s : agriculture, teinture, \u00e9levage, commerce.</p></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. GPF signifie...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. Groupement de Promotion F\u00e9minine</label>" +
    "<label><input type=radio name=q1 value=B> B. Grande Production F\u00e9minine</label>" +
    "<label><input type=radio name=q1 value=C> C. Groupement des Femmes</label></div>");

  console.log("\n--- VIVRE DANS SON MILIEU ---");

  await addLecon(vmId, "Cohabitation et insalubrit\u00e9", "Cohabitation et insalubrit\u00e9",
    "<h1>\u{1F3D8}\uFE0F Le\u00e7on 1 : Cohabitation et insalubrit\u00e9</h1>" +
    "<div class=intro><p>Vivre avec plusieurs personnes dans un m\u00eame endroit.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>Insalubrit\u00e9 = environnement pollu\u00e9. Promiscuit\u00e9 = espace r\u00e9duit.</p>" +
    "<table><tr><th>Cohabitation</th><th>Insalubrit\u00e9</th></tr>" +
    "<tr><td>Voisinage</td><td>D\u00e9chets solides</td></tr>" +
    "<tr><td>Promiscuit\u00e9</td><td>D\u00e9chets liquides</td></tr></table></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. L insalubrit\u00e9 est due \u00e0...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. La pollution</label>" +
    "<label><input type=radio name=q1 value=B> B. La propret\u00e9</label>" +
    "<label><input type=radio name=q1 value=C> C. Le silence</label></div>");

  await addLecon(vmId, "La promiscuit\u00e9", "La promiscuit\u00e9",
    "<h1>\u{1F3E0} Le\u00e7on 2 : La promiscuit\u00e9</h1>" +
    "<div class=intro><p>Voisinage d\u00e9sagr\u00e9able dans un espace restreint.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>Causes : pauvret\u00e9, exode rural, bidonvilles.</p></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. La promiscuit\u00e9 est due \u00e0...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. La pauvret\u00e9</label>" +
    "<label><input type=radio name=q1 value=B> B. La richesse</label>" +
    "<label><input type=radio name=q1 value=C> C. L \u00e9ducation</label></div>");

  await addLecon(vmId, "Les g\u00eetes larvaires", "Les g\u00eetes larvaires",
    "<h1>\u{1F99F} Le\u00e7on 3 : Les g\u00eetes larvaires</h1>" +
    "<div class=intro><p>Endroit o\u00f9 se d\u00e9veloppent les larves.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>Donnent : paludisme, chol\u00e9ra, dysenterie.</p>" +
    "<p>Gestion : d\u00e9sinfection, \u00e9limination, exposition soleil, lutte biologique.</p></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. Les larves deviennent...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. Moustiques et mouches</label>" +
    "<label><input type=radio name=q1 value=B> B. Poissons</label>" +
    "<label><input type=radio name=q1 value=C> C. Oiseaux</label></div>");

  await addLecon(vmId, "Maladies end\u00e9miques", "Maladies end\u00e9miques",
    "<h1>\u{1FA7A} Le\u00e7on 4 : Maladies end\u00e9miques</h1>" +
    "<div class=intro><p>Maladie permanente dans une localit\u00e9.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<table><tr><th>Maladie</th><th>Pr\u00e9vention</th></tr>" +
    "<tr><td>Chol\u00e9ra</td><td>Evacuer eaux us\u00e9es</td></tr>" +
    "<tr><td>Paludisme</td><td>G\u00eetes larvaires + lavage mains</td></tr></table></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. Maladie end\u00e9mique =...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. Permanente dans une localit\u00e9</label>" +
    "<label><input type=radio name=q1 value=B> B. Rare</label>" +
    "<label><input type=radio name=q1 value=C> C. Gu\u00e9rie</label></div>");

  await addLecon(vmId, "Le chol\u00e9ra", "Le chol\u00e9ra",
    "<h1>\u{1F4A7} Le\u00e7on 5 : Le chol\u00e9ra</h1>" +
    "<div class=intro><p>Maladie bact\u00e9rienne tr\u00e8s contagieuse.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>Provoque diarrh\u00e9e et vomissements. Bact\u00e9rie : vibrion chol\u00e9rique.</p>" +
    "<p>Transmission : mains et eaux sales. Maladie des mains sales.</p>" +
    "<p>Pr\u00e9vention : lavage des mains, d\u00e9sinfection.</p></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. Le chol\u00e9ra est une maladie...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. Bact\u00e9rienne</label>" +
    "<label><input type=radio name=q1 value=B> B. Virale</label>" +
    "<label><input type=radio name=q1 value=C> C. G\u00e9n\u00e9tique</label></div>" +
    "<div class=question><p><strong>2. Le meilleur traitement est...</strong></p>" +
    "<label><input type=radio name=q2 value=A data-correct=true> A. La pr\u00e9vention</label>" +
    "<label><input type=radio name=q2 value=B> B. Les antibiotiques</label>" +
    "<label><input type=radio name=q2 value=C> C. L hospitalisation</label></div>");

  await addLecon(vmId, "Le paludisme", "Le paludisme",
    "<h1>\u{1F99F} Le\u00e7on 6 : Le paludisme</h1>" +
    "<div class=intro><p>Caus\u00e9 par le plasmodium, attaque les globules rouges.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>Transmis par piq\u00fbre d anoph\u00e8le femelle.</p>" +
    "<p>Pr\u00e9vention : TPI, moustiquaire, supprimer eaux stagnantes.</p></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. Le paludisme est transmis par...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. L anoph\u00e8le femelle</label>" +
    "<label><input type=radio name=q1 value=B> B. Le moustique m\u00e2le</label>" +
    "<label><input type=radio name=q1 value=C> C. La mouche</label></div>");

  await addLecon(vmId, "L asthme", "Une infection respiratoire : L asthme",
    "<h1>\u{1F9AC} Le\u00e7on 7 : L asthme</h1>" +
    "<div class=intro><p>Infection des bronches, \u00e9paississement des parois.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>Difficult\u00e9s respiratoires, toux, respiration sifflante.</p>" +
    "<p>Autres infections : rhume, angine, bronchite, pneumonie, tuberculose.</p></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. L asthme affecte...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. Les bronches</label>" +
    "<label><input type=radio name=q1 value=B> B. Le c\u0153ur</label>" +
    "<label><input type=radio name=q1 value=C> C. Les reins</label></div>");

  await addLecon(vmId, "La tuberculose", "La tuberculose",
    "<h1> Le\u00e7on 8 : La tuberculose</h1>" +
    "<div class=intro><p>Caus\u00e9e par le bacille de Koch.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p>Attaque poumons, os, intestins, reins, cerveau.</p>" +
    "<p>Pr\u00e9vention : vaccin BCG, bonne alimentation, pas d alcool ni tabac.</p></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. La tuberculose est caus\u00e9e par...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. Le bacille de Koch</label>" +
    "<label><input type=radio name=q1 value=B> B. Un virus</label>" +
    "<label><input type=radio name=q1 value=C> C. Le paludisme</label></div>" +
    "<div class=question><p><strong>2. Le vaccin antituberculeux est...</strong></p>" +
    "<label><input type=radio name=q2 value=A data-correct=true> A. Le BCG</label>" +
    "<label><input type=radio name=q2 value=B> B. Le TPI</label>" +
    "<label><input type=radio name=q2 value=C> C. Le DTP</label></div>");

  await addLecon(vmId, "La bronchite", "La bronchite",
    "<h1> Le\u00e7on 9 : La bronchite</h1>" +
    "<div class=intro><p>La <strong>bronchite</strong> est une inflammation des <strong>bronches</strong>.</p></div>" +
    "<div class=bloc-essentiel><h2>\u{1F4CC} A RETENIR</h2>" +
    "<p><strong>Causes :</strong> infection virale ou bact\u00e9rienne, fum\u00e9e de tabac, pollution.</p>" +
    "<table><tr><th>Type</th><th>Caract\u00e9ristiques</th></tr>" +
    "<tr><td>Bronchite aigu\u00eb</td><td>Apparition brutale, dure quelques jours, toux + fi\u00e8vre</td></tr>" +
    "<tr><td>Bronchite chronique</td><td>Dure longtemps, toux r\u00e9p\u00e9titive, li\u00e9e au tabac ou \u00e0 la pollution</td></tr></table></div>" +
    "<h2>\u270F\uFE0F QCM</h2>" +
    "<div class=question><p><strong>1. La bronchite est une inflammation...</strong></p>" +
    "<label><input type=radio name=q1 value=A data-correct=true> A. Des bronches</label>" +
    "<label><input type=radio name=q1 value=B> B. Du c\u0153ur</label>" +
    "<label><input type=radio name=q1 value=C> C. De l estomac</label></div>" +
    "<div class=question><p><strong>2. La bronchite aigu\u00eb dure...</strong></p>" +
    "<label><input type=radio name=q2 value=A data-correct=true> A. Quelques jours</label>" +
    "<label><input type=radio name=q2 value=B> B. Plusieurs mois</label>" +
    "<label><input type=radio name=q2 value=C> C. Toute la vie</label></div>");

  console.log("\n=== TOUT EST TERMINE : 8 VE + 9 VM ===");
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
