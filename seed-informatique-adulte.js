const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://tate_school:UCY0NJMuUIoGpSDU@cluster0.ywgxfxk.mongodb.net/tate?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const admin = await db.collection("users").findOne({ role: "admin" });
  const adminId = admin?._id?.toString() || "69dfac0adb8037a014ca9178";

  // ── Créer la matière Informatique Adultes ──────────────────
  let matiere = await db.collection("matieres").findOne({ code: "IN-AD" });
  if (!matiere) {
    await db.collection("matieres").insertOne({
      code: "IN-AD", nom: "Informatique Adultes", icone: "💻", couleur: "#2563EB",
      niveaux: ["Adulte"], actif: true, estLangue: true, ordre: 13,
      createdAt: new Date(), updatedAt: new Date()
    });
    matiere = await db.collection("matieres").findOne({ code: "IN-AD" });
    console.log("✅ Matière IN-AD créée");
  } else {
    console.log("ℹ️ Matière IN-AD existe déjà");
  }

  const matId = matiere._id.toString();
  const matiereId = new mongoose.Types.ObjectId(matId);

  // Trouver le prochain ordre disponible
  const lastChap = await db.collection("chapitres").find({ matiereId: matiereId, niveau: "Adulte" }).sort({ ordre: -1 }).limit(1).toArray();
  let ordreStart = lastChap.length > 0 ? (lastChap[0].ordre || 0) + 1 : 1;

  // Nettoyer les anciens chapitres IN
  const oldToClean = await db.collection("chapitres").find({
    matiereId: matiereId, niveau: "Adulte",
    titre: { $regex: /^IN\d*\s*—\s*Excel/i }
  }).toArray();
  for (const c of oldToClean) {
    await db.collection("lecons").deleteMany({ chapitreId: c._id });
    await db.collection("chapitres").deleteOne({ _id: c._id });
  }
  console.log(`🧹 ${oldToClean.length} anciens chapitres IN nettoyés`);

  async function addChapitre(titre, objectif, contenuHTML, ordre) {
    const chap = await db.collection("chapitres").insertOne({
      matiereId: matiereId, titre, niveau: "Adulte", objectif, ordre, actif: true,
      createdAt: new Date(), updatedAt: new Date()
    });

    await db.collection("lecons").insertOne({
      chapitreId: chap.insertedId, titre, matiere: matId, classe: "Adulte", statut: "publie",
      masque: false, creePar: adminId, contenuHTML, contenuBrut: "",
      dureeExercices: 30,
      contenuFormate: { correctionsTypes: [], exercices: [] },
      createdAt: new Date(), updatedAt: new Date()
    });

    console.log(`  📖 ${titre}`);
    return chap.insertedId;
  }

  // ═══════════════════════════════════════════════════════
  //  IN1 — EXCEL DÉBUTANT
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "IN1 — Excel Débutant : Les bases",
    "Maîtriser les fondamentaux d'Excel : navigation, saisie, formules simples et mise en forme",
    `<div class="lecon-anglais">
<h1>📊 IN1 — Excel Débutant : Les bases</h1>

<div class="intro-box">
<p>Que vous soyez totalement débutant ou que vous ayez déjà ouvert Excel une ou deux fois, cette leçon vous donne les bases solides pour utiliser Excel au quotidien.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Naviguer dans un classeur Excel (feuilles, cellules, lignes, colonnes)</li>
<li>Saisir et modifier des données</li>
<li>Utiliser les formules de base (SOMME, MOYENNE, MIN, MAX)</li>
<li>Mettre en forme un tableau professionnel</li>
</ul>

<h2>📖 Partie 1 — Découverte d'Excel</h2>

<div class="bloc-essentiel">
<h3>🔹 Le classeur et les feuilles</h3>
<p>Un fichier Excel = un <strong>classeur</strong>. Un classeur peut contenir plusieurs <strong>feuilles</strong> (onglets en bas).</p>
<ul>
<li><strong>Ligne</strong> = horizontale (numérotée 1, 2, 3...)</li>
<li><strong>Colonne</strong> = verticale (lettrée A, B, C...)</li>
<li><strong>Cellule</strong> = intersection d'une ligne et d'une colonne (ex: A1, B5, C12)</li>
</ul>
<p>➡️ <em>Astuce :</em> Cliquez sur l'onglet "+" en bas à gauche pour ajouter une feuille.</p>
</div>

<div class="bloc-essentiel">
<h3>🔹 Saisie et navigation</h3>
<ul>
<li>Cliquez sur une cellule → tapez → Entrée pour valider</li>
<li><strong>Tab</strong> = passer à la cellule suivante (droite)</li>
<li><strong>Flèches</strong> = se déplacer</li>
<li><strong>Ctrl + Z</strong> = annuler</li>
<li><strong>Ctrl + C / Ctrl + V</strong> = copier / coller</li>
</ul>
</div>

<h2>📖 Partie 2 — Les formules de base</h2>

<div class="bloc-essentiel">
<h3>🔹 La formule SOMME</h3>
<p>Additionne une série de nombres.</p>
<p><code>=SOMME(A1:A10)</code> → additionne toutes les valeurs de A1 à A10</p>
<p><code>=SOMME(A1;A5;A10)</code> → additionne les cellules A1, A5 et A10</p>
</div>

<div class="bloc-essentiel">
<h3>🔹 MOYENNE, MIN, MAX</h3>
<p><code>=MOYENNE(B1:B20)</code> → calcule la moyenne des valeurs</p>
<p><code>=MIN(C1:C10)</code> → trouve la valeur la plus petite</p>
<p><code>=MAX(C1:C10)</code> → trouve la valeur la plus grande</p>
</div>

<div class="bloc-essentiel">
<h3>🔹 NBVAL et NB.SI</h3>
<p><code>=NBVAL(A1:A20)</code> → compte le nombre de cellules non vides</p>
<p><code>=NB.SI(A1:A20;">10")</code> → compte les cellules dont la valeur est supérieure à 10</p>
</div>

<h2>📖 Partie 3 — Mise en forme</h2>

<div class="bloc-essentiel">
<h3>🔹 Rendre un tableau lisible</h3>
<ul>
<li><strong>Gras</strong> (Ctrl+G) pour les titres</li>
<li><strong>Couleur de fond</strong> → sélectionnez les cellules → icône pot de peinture</li>
<li><strong>Bordures</strong> → pour encadrer les tableaux</li>
<li><strong>Format nombre</strong> → monnaie (FCFA), pourcentage, date</li>
</ul>
<p>➡️ <em>Raccourci :</em> Ctrl+Shift+$ → format monnaie, Ctrl+Shift+% → pourcentage</p>
</div>

<div class="bloc-essentiel">
<h3>🔹 Exemple de tableau professionnel</h3>
<pre>
| Produit     | Quantité | Prix unitaire | Total    |
|-------------|----------|---------------|----------|
| Cahier      | 50       | 500 FCFA      | =B2*C2   |
| Stylo       | 100      | 200 FCFA      | =B3*C3   |
| Sac         | 10       | 5000 FCFA     | =B4*C4   |
|             |          | TOTAL         | =SOMME(D2:D4) |
</pre>
</div>

</div>`,
    ordreStart++
  );

  // ═══════════════════════════════════════════════════════
  //  IN2 — EXCEL INTERMÉDIAIRE
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "IN2 — Excel Intermédiaire : Références, Recherche et Conditions",
    "Aller plus loin avec les références absolues, RECHERCHEV, SI et les tableaux croisés dynamiques",
    `<div class="lecon-anglais">
<h1>📊 IN2 — Excel Intermédiaire</h1>

<div class="intro-box">
<p>Vous maîtrisez les bases ? Passons au niveau supérieur. Ces compétences sont très recherchées en entreprise.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Comprendre les références absolues et relatives ($)</li>
<li>Utiliser RECHERCHEV et RECHERCHEH</li>
<li>Maîtriser les fonctions conditionnelles SI, SOMME.SI, NB.SI.ENS</li>
<li>Créer un tableau croisé dynamique</li>
</ul>

<h2>📖 Partie 1 — Références absolues et relatives</h2>

<div class="bloc-essentiel">
<h3>🔹 Référence relative (par défaut)</h3>
<p>Quand vous copiez une formule, Excel ajuste automatiquement les références.</p>
<p><code>=A1+B1</code> → si vous copiez vers le bas, ça devient <code>=A2+B2</code>, <code>=A3+B3</code>...</p>
</div>

<div class="bloc-essentiel">
<h3>🔹 Référence absolue ($)</h3>
<p>Le signe <strong>$</strong> bloque une référence pour qu'elle ne change pas quand vous copiez.</p>
<p><code>=A1*$B$1</code> → le <strong>$B$1</strong> reste fixe quand vous copiez la formule</p>
<p><strong>Utile pour :</strong> un taux de TVA, un coefficient, un prix de référence</p>
<ul>
<li><code>$A$1</code> → colonne ET ligne bloquée</li>
<li><code>$A1</code> → colonne bloquée uniquement</li>
<li><code>A$1</code> → ligne bloquée uniquement</li>
</ul>
<p>➡️ <em>Raccourci :</em> F4 pour ajouter/enlever les $</p>
</div>

<h2>📖 Partie 2 — RECHERCHEV</h2>

<div class="bloc-essentiel">
<h3>🔹 Chercher une valeur dans un tableau</h3>
<p><code>=RECHERCHEV(valeur_cherchée; tableau; colonne_retour; [trié])</code></p>
<p><strong>Exemple :</strong> Trouver le prix d'un produit à partir de son code</p>
<p><code>=RECHERCHEV("P001"; A:C; 3; FAUX)</code></p>
<ul>
<li><strong>valeur_cherchée</strong> → ce qu'on cherche (ex: "P001")</li>
<li><strong>tableau</strong> → la plage où chercher (ex: A:C)</li>
<li><strong>colonne_retour</strong> → numéro de la colonne à retourner</li>
<li><strong>FAUX</strong> → recherche exacte (toujours mettre FAUX)</li>
</ul>
</div>

<div class="bloc-essentiel">
<h3>🔹 RECHERCHEH (pour les tableaux horizontaux)</h3>
<p>Pareil que RECHERCHEV mais pour chercher dans une ligne au lieu d'une colonne.</p>
<p><code>=RECHERCHEH(valeur; tableau; ligne_retour; FAUX)</code></p>
</div>

<h2>📖 Partie 3 — Les fonctions conditionnelles</h2>

<div class="bloc-essentiel">
<h3>🔹 SI</h3>
<p><code>=SI(condition; valeur_si_vrai; valeur_si_faux)</code></p>
<p><strong>Exemple :</strong> <code>=SI(A1>=10;"Réussi";"Échoué")</code></p>
</div>

<div class="bloc-essentiel">
<h3>🔹 SOMME.SI et NB.SI.ENS</h3>
<p><code>=SOMME.SI(plage; critère; [plage_somme])</code></p>
<p><strong>Exemple :</strong> <code>=SOMME.SI(A1:A10;"=Dakar";B1:B10)</code> → total des ventes de Dakar</p>
<p><code>=NB.SI.ENS(plage1; critère1; plage2; critère2)</code> → compte avec plusieurs conditions</p>
</div>

<h2>📖 Partie 4 — Tableau croisé dynamique</h2>

<div class="bloc-essentiel">
<h3>🔹 Résumer des données en un clic</h3>
<ol>
<li>Sélectionnez tout votre tableau (Ctrl+T pour en faire un tableau)</li>
<li>Allez dans Insertion > Tableau croisé dynamique</li>
<li>Glissez les champs :</li>
<ul>
<li><strong>Lignes :</strong> le critère (ex: Ville, Produit)</li>
<li><strong>Valeurs :</strong> les chiffres à additionner</li>
<li><strong>Filtres :</strong> pour filtrer les données</li>
</ul>
</ol>
</div>

</div>`,
    ordreStart++
  );

  // ═══════════════════════════════════════════════════════
  //  IN3 — EXCEL + IA (AUTOMATISATION)
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "IN3 — Excel + IA : Automatisation avec l'Intelligence Artificielle",
    "Découvrir comment l'IA peut automatiser les tâches Excel répétitives et booster votre productivité",
    `<div class="lecon-anglais">
<h1>🤖 IN3 — Excel + IA : Automatisation</h1>

<div class="intro-box">
<p>L'Intelligence Artificielle change la façon dont on travaille avec Excel. Fini les formules compliquées et les macros fastidieuses. L'IA fait le travail à votre place.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Comprendre ce qu'est l'IA et comment elle peut aider avec Excel</li>
<li>Utiliser un assistant IA pour analyser des fichiers Excel</li>
<li>Automatiser la création de rapports et de calculs</li>
<li>Gagner du temps sur les tâches répétitives</li>
</ul>

<h2>📖 Partie 1 — Qu'est-ce que l'IA peut faire pour vous ?</h2>

<div class="bloc-essentiel">
<h3>🔹 L'IA comprend vos fichiers Excel en langage naturel</h3>
<p>Au lieu d'écrire des formules, vous posez des questions en français :</p>
<ul>
<li>❌ Avant : écrire <code>=SOMME.SI(plage;critère;plage_somme)</code></li>
<li>✅ Après : demander <em>"Quel est le total des ventes de janvier ?"</em></li>
</ul>
<p>L'IA analyse vos données et vous répond immédiatement.</p>
</div>

<div class="bloc-essentiel">
<h3>🔹 Exemples de questions que vous pourrez poser</h3>
<ul>
<li><strong>"Quel est le chiffre d'affaires total de l'année ?"</strong></li>
<li><strong>"Donne-moi les 5 meilleurs clients"</strong></li>
<li><strong>"Combien de produits sont en rupture de stock ?"</strong></li>
<li><strong>"Calcule la marge moyenne par produit"</strong></li>
<li><strong>"Compare les ventes du 1er semestre et du 2ème semestre"</strong></li>
<li><strong>"Quel employé a le plus de ventes ?"</strong></li>
</ul>
</div>

<h2>📖 Partie 2 — L'assistant IA en pratique</h2>

<div class="bloc-essentiel">
<h3>🔹 Comment ça marche ?</h3>
<ol>
<li><strong>Uploader</strong> votre fichier Excel dans l'assistant</li>
<li><strong>Poser</strong> votre question en français (ex: "Quel est le total des dépenses ?")</li>
<li><strong>L'IA analyse</strong> les données et vous répond</li>
<li><strong>Résultat</strong> : la réponse + éventuellement un tableau ou un graphique</li>
</ol>
</div>

<div class="bloc-essentiel">
<h3>🔹 Fonctionnalités clés de l'assistant</h3>
<ul>
<li><strong>Analyse rapide</strong> : l'IA lit votre fichier en quelques secondes</li>
<li><strong>Langage naturel</strong> : posez vos questions en français courant</li>
<li><strong>Calculs automatiques</strong> : plus besoin de connaître les formules</li>
<li><strong>Export</strong> : obtenez les résultats directement exploitables</li>
</ul>
</div>

<h2>📖 Partie 3 — Cas concrets d'automatisation</h2>

<div class="bloc-essentiel">
<h3>🔹 Cas 1 : Gestion des stocks</h3>
<p>Vous avez un fichier avec 5000 lignes de produits. Au lieu de filtrer manuellement :</p>
<p>👉 <em>"Quels sont les produits dont le stock est inférieur à 10 ?"</em></p>
<p>L'IA vous donne la liste en une seconde.</p>
</div>

<div class="bloc-essentiel">
<h3>🔹 Cas 2 : Suivi des impayés</h3>
<p>👉 <em>"Combien de clients n'ont pas payé depuis plus de 30 jours ?"</em></p>
<p>👉 <em>"Quel est le montant total des impayés ?"</em></p>
<p>L'IA identifie et calcule.</p>
</div>

<div class="bloc-essentiel">
<h3>🔹 Cas 3 : Rapports automatiques</h3>
<p>👉 <em>"Fais un résumé des ventes par mois et par région"</em></p>
<p>👉 <em>"Quelle est la tendance des ventes sur les 6 derniers mois ?"</em></p>
</div>

<div class="bloc-essentiel">
<h3>🔹 Cas 4 : Envoi d'emails personnalisés</h3>
<p>👉 <em>"Envoie un email à chaque client dont la facture est impayée depuis plus de 7 jours"</em></p>
<p>L'IA génère et envoie les emails un par un.</p>
</div>

<h2>📖 Partie 4 — Pourquoi utiliser l'IA avec Excel ?</h2>

<div class="bloc-essentiel">
<h3>🔹 Les avantages</h3>
<ul>
<li><strong>Gain de temps :</strong> une tâche de 30 minutes devient 30 secondes</li>
<li><strong>Pas besoin d'être expert :</strong> l'IA fait les formules à votre place</li>
<li><strong>Zéro erreur :</strong> plus de faute de calcul ou de formule mal écrite</li>
<li><strong>Accessible :</strong> depuis votre téléphone, votre PC, n'importe où</li>
</ul>
</div>

<div class="bloc-essentiel">
<h3>🔹 Exemple concret</h3>
<p><strong>Sans IA :</strong> ouvrir Excel, écrire la formule SOMME.SI.ENS, vérifier, recommencer si erreur → <strong>15 minutes</strong></p>
<p><strong>Avec IA :</strong> taper "total des ventes de Dakar en janvier" → <strong>5 secondes</strong></p>
</div>

</div>`,
    ordreStart++
  );

  // ═══════════════════════════════════════════════════════
  //  IN4 — EXERCICES PRATIQUES
  // ═══════════════════════════════════════════════════════

  await addChapitre(
    "IN4 — Exercices Pratiques Excel",
    "Mettre en pratique tout ce que vous avez appris avec des exercices concrets",
    `<div class="lecon-anglais">
<h1>📝 IN4 — Exercices Pratiques Excel</h1>

<div class="intro-box">
<p>La théorie sans pratique ne sert à rien. Ces exercices sont conçus pour que vous maîtrisiez Excel en situation réelle. Faites-les dans l'ordre.</p>
</div>

<h2>🎯 Objectifs</h2>
<ul>
<li>Appliquer les formules de base sur un cas réel</li>
<li>Créer des tableaux de suivi professionnels</li>
<li>Utiliser RECHERCHEV et les conditions</li>
<li>Générer un rapport avec l'IA</li>
</ul>

<h2>📝 Exercice 1 — Mon premier budget mensuel</h2>

<div class="bloc-essentiel">
<h3>Consigne</h3>
<p>Créez un tableau de suivi de budget mensuel :</p>

<p><strong>Colonnes :</strong></p>
<ul>
<li>A : Date (ex: 01/06/2026, 05/06/2026...)</li>
<li>B : Catégorie (Nourriture, Transport, Logement, Loisirs, Santé)</li>
<li>C : Description</li>
<li>D : Montant</li>
</ul>

<p><strong>À faire :</strong></p>
<ol>
<li>Saisissez au moins 10 dépenses</li>
<li>Calculez le total des dépenses (SOMME)</li>
<li>Calculez la dépense moyenne (MOYENNE)</li>
<li>Trouvez la plus grande dépense (MAX)</li>
<li>Ajoutez un format monnaie (FCFA)</li>
<li>Mettez les titres en gras et ajoutez des bordures</li>
</ol>
</div>

<details>
<summary><strong>💡 Solution</strong></summary>
<div class="bloc-essentiel">
<p>=SOMME(D2:D11)</p>
<p>=MOYENNE(D2:D11)</p>
<p>=MAX(D2:D11)</p>
<p>Pour le format monnaie : sélectionnez D2:D11 → Ctrl+Shift+$</p>
</div>
</details>

<h2>📝 Exercice 2 — Gestion de stock</h2>

<div class="bloc-essentiel">
<h3>Consigne</h3>
<p>Vous gérez le stock d'une petite boutique :</p>

<p><strong>Tableau :</strong></p>
<ul>
<li>A : Code produit (P001, P002...)</li>
<li>B : Nom du produit</li>
<li>C : Prix unitaire</li>
<li>D : Quantité en stock</li>
<li>E : Valeur du stock (=C x D)</li>
<li>F : Statut (à saisir avec SI)</li>
</ul>

<p><strong>À faire :</strong></p>
<ol>
<li>Saisissez 10 produits</li>
<li>Calculez la valeur totale du stock (=SOMME(E:E))</li>
<li>Créez une colonne Statut : SI(quantité<10 ; "À réapprovisionner" ; "OK")</li>
<li>Trouvez le produit le plus cher (MAX / RECHERCHEV)</li>
<li>Comptez combien de produits sont à réapprovisionner (NB.SI)</li>
</ol>
</div>

<details>
<summary><strong>💡 Solution</strong></summary>
<div class="bloc-essentiel">
<p><strong>Statut :</strong> =SI(D2<10;"À réapprovisionner";"OK")</p>
<p><strong>Valeur stock :</strong> =C2*D2 (à copier vers le bas)</p>
<p><strong>Total stock :</strong> =SOMME(E2:E11)</p>
<p><strong>Produits à réappro :</strong> =NB.SI(F2:F11;"À réapprovisionner")</p>
</div>
</details>

<h2>📝 Exercice 3 — Suivi des ventes par équipe</h2>

<div class="bloc-essentiel">
<h3>Consigne</h3>
<p>Vous avez 3 vendeurs dans votre équipe. Suivez leurs performances :</p>

<p><strong>Tableau 1 — Ventes :</strong> Date, Vendeur, Montant</p>
<p><strong>Tableau 2 — Objectifs :</strong> Vendeur, Objectif mensuel</p>

<p><strong>À faire :</strong></p>
<ol>
<li>Saisissez les ventes de 15 jours</li>
<li>Calculez le total des ventes par vendeur (SOMME.SI)</li>
<li>Utilisez RECHERCHEV pour récupérer l'objectif de chaque vendeur</li>
<li>Calculez l'écart : Total - Objectif</li>
<li>Créez un tableau croisé dynamique : lignes = vendeur, valeurs = somme des montants</li>
</ol>
</div>

<details>
<summary><strong>💡 Solution</strong></summary>
<div class="bloc-essentiel">
<p><strong>Total par vendeur :</strong> =SOMME.SI($B:$B;E2;$C:$C)</p>
<p><strong>Objectif :</strong> =RECHERCHEV(E2;$G$2:$H$4;2;FAUX)</p>
<p><strong>Écart :</strong> =F2-G2</p>
<p>Pour le TCD : sélectionnez tout → Insertion → Tableau croisé dynamique</p>
</div>
</details>

<h2>📝 Exercice 4 — Analyse avec l'IA</h2>

<div class="bloc-essentiel">
<h3>Consigne</h3>
<p>Vous avez un fichier Excel avec 50 lignes de ventes sur l'année (colonne A = Mois, B = Produit, C = Montant, D = Région).</p>

<p><strong>Posez ces questions à l'assistant IA :</strong></p>
<ol>
<li>"Quel est le montant total des ventes ?"</li>
<li>"Quel produit se vend le mieux ?"</li>
<li>"Quelle région a généré le plus de chiffre d'affaires ?"</li>
<li>"Quel est le mois le plus rentable ?"</li>
<li>"Y a-t-il des mois où les ventes sont faibles ?"</li>
</ol>

<p><em>Objectif : voir la puissance de l'IA pour analyser des données sans écrire une seule formule.</em></p>
</div>

<h2>📝 Exercice 5 — Projet final : Créer un tableau de bord</h2>

<div class="bloc-essentiel">
<h3>Consigne</h3>
<p><strong>Objectif :</strong> Créer un tableau de bord professionnel qui suit les performances de votre entreprise.</p>

<p><strong>Éléments :</strong></p>
<ol>
<li>Un <strong>tableau de suivi</strong> avec les données brutes (date, client, produit, montant, région, statut paiement)</li>
<li>Des <strong>indicateurs clés</strong> : total ventes, nombre de clients, produit le plus vendu</li>
<li>Un <strong>tableau croisé dynamique</strong> par région</li>
<li>Un <strong>graphique</strong> d'évolution des ventes dans le temps</li>
<li>Une <strong>mise en forme</strong> professionnelle (couleurs, bordures, alignement)</li>
</ol>

<p><strong>Bonus :</strong> Utilisez l'assistant IA pour générer un résumé de votre tableau de bord.</p>
</div>

<h2>✅ Validation</h2>

<div class="bloc-essentiel">
<p>Vous maîtrisez Excel si vous savez faire tout ça sans aide :</p>
<ul>
<li>☐ Créer un tableau avec des formules de base</li>
<li>☐ Utiliser RECHERCHEV pour chercher des données</li>
<li>☐ Créer un SI conditionnel</li>
<li>☐ Faire un tableau croisé dynamique</li>
<li>☐ Poser une question à l'IA sur un fichier Excel</li>
<li>☐ Créer un tableau de bord complet</li>
</ul>
<p>Si vous cochez tout → <strong>vous êtes prêt(e) pour le monde professionnel !</strong> 🎉</p>
</div>

</div>`,
    ordreStart++
  );

  console.log(`✅ ${ordreStart - 1} chapitres Excel créés avec succès`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
