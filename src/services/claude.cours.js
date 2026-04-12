const { appelerClaude, parseJSON, promptBase, construireContenuAvecDocs } = require('./claude.config');

// ─────────────────────────────────────────────
// Générer le résumé de cours pour l'élève
// ─────────────────────────────────────────────
const genererResumeCours = async ({ chapitre, niveau, matiere, contenuBrut, promptSupplement, documentsRef = [], userId }) => {
  const system = promptBase(niveau, matiere, promptSupplement) + `

Génère un résumé de cours pédagogique complet en suivant EXACTEMENT ce modèle en 8 étapes.
Adapte le vocabulaire et les exemples au niveau ${niveau}.
${documentsRef.length > 0 ? `\n⚠️ Des documents de référence pédagogiques sont fournis ci-dessous. Utilise-les pour alimenter et enrichir le cours (exemples, règles, structure). Respecte l'esprit et les modèles qu'ils contiennent.` : ''}

Format JSON attendu :
{
  "titre": "titre du chapitre",
  "objectif": "ce que l'élève saura faire après cette leçon",
  "resume": "résumé clair et simple du cours en 3-5 phrases",
  "regle": "la règle principale encadrée, formulée clairement",
  "exemples": ["exemple 1 avec explication", "exemple 2", "exemple 3"],
  "pieges": ["piège ou exception 1", "piège 2"],
  "resumeMemo": ["point clé 1", "point clé 2", "point clé 3"],
  "questionComprehension": "Tu as compris ? Dis-moi oui ou non !"
}`;

  const texteMsg = contenuBrut
    ? `Voici le contenu brut du cours à restructurer : "${contenuBrut}"`
    : `Génère le cours complet sur ce chapitre : "${chapitre}" pour le niveau ${niveau} en ${matiere}.`;

  const { blocs } = construireContenuAvecDocs(texteMsg, documentsRef);

  const texte = await appelerClaude({
    system,
    messages:  [{ role: 'user', content: blocs }],
    maxTokens: 1500,
    typeAppel: 'resume_cours',
    userId,
  });

  return parseJSON(texte);
};

// ─────────────────────────────────────────────
// Préparer le cours pour le professeur
// ─────────────────────────────────────────────
const preparerCoursProfesseur = async ({ contenuBrut, formStructure, chapitre, niveau, matiere, promptSupplement, documentsRef = [], userId }) => {
  const system = `
Tu es un expert en ingénierie pédagogique pour le niveau ${niveau} en ${matiere}.
Tu restructures les cours des professeurs selon un modèle pédagogique précis en 8 étapes.
Tu génères aussi les corrections-types détaillées pour chaque exercice.
Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.
${promptSupplement ? `Instructions spécifiques : ${promptSupplement}` : ''}
${documentsRef.length > 0 ? `\n⚠️ Des documents de référence pédagogiques sont fournis. Utilise-les pour structurer le cours et les exercices selon le style et les modèles qu'ils contiennent.` : ''}
`.trim();

  const contenuTexte = contenuBrut
    ? `Restructure ce cours : "${contenuBrut}"`
    : `Restructure ce cours structuré : ${JSON.stringify(formStructure)}`;

  const texteMsg = `Chapitre : "${chapitre}" | Niveau : ${niveau} | Matière : ${matiere}\n${contenuTexte}

Génère le cours complet selon le modèle pédagogique + une banque de 20 exercices variés avec leurs réponses complètes.

IMPORTANT : Les exercices doivent couvrir toutes les notions du chapitre avec des niveaux de difficulté variés (facile, moyen, difficile). Ils seront soumis aux élèves un par un avec les réponses masquées.

Format JSON :
{
  "coursFormate": {
    "titre": "...",
    "objectif": "...",
    "resume": "résumé clair du cours en 3-5 phrases",
    "regle": "la règle principale clairement formulée",
    "exemples": ["exemple 1 avec explication", "exemple 2", "exemple 3"],
    "pieges": ["piège ou exception 1", "piège 2"],
    "resumeMemo": ["point clé 1", "point clé 2", "point clé 3"],
    "questionComprehension": "Question ouverte pour vérifier que l'élève a compris"
  },
  "correctionsTypes": [
    {
      "question": "Question précise testant une notion du chapitre",
      "reponse": "Réponse attendue complète et correcte",
      "explication": "Explication pédagogique détaillée de pourquoi c'est la bonne réponse"
    }
  ],
  "notesProf": "conseils pédagogiques pour le professeur"
}

Génère exactement 20 exercices dans correctionsTypes, avec des questions variées (application directe, complétion, identification, correction d'erreur, production).`;

  const { blocs } = construireContenuAvecDocs(texteMsg, documentsRef);

  const texte = await appelerClaude({
    system,
    messages: [{ role: 'user', content: blocs }],
    maxTokens: 4000,
    typeAppel: 'preparation_prof',
    userId,
  });

  return parseJSON(texte);
};

// ─────────────────────────────────────────────
// Générer la fiche mémo (points à retenir + Q&R)
// Stockée dans la BDD, utilisée comme flashcards
// ─────────────────────────────────────────────
const genererFicheMemo = async ({ chapitre, niveau, matiere, contenuBrut, promptSupplement, documentsRef = [], userId }) => {
  const system = promptBase(niveau, matiere, promptSupplement) + `

Tu es un enseignant expert. Ta mission est de créer une fiche mémo synthétique et des flashcards Q&R pour aider l'élève à mémoriser l'essentiel du chapitre "${chapitre}" (niveau ${niveau}, ${matiere}).

Les points à retenir doivent être courts, percutants, mémorisables.
Les questions-réponses doivent couvrir les notions essentielles et aider à l'auto-évaluation.
Adapte le vocabulaire au niveau ${niveau} et utilise des exemples du contexte africain/sénégalais quand c'est pertinent.

${documentsRef.length > 0 ? '⚠️ Des documents de référence sont fournis. Base ta fiche sur leur contenu.' : ''}

Réponds UNIQUEMENT en JSON valide, sans markdown.

Format JSON attendu :
{
  "pointsACretenir": [
    "Point 1 : formulation courte et mémorisable",
    "Point 2 : ...",
    "...jusqu'à 8 points maximum"
  ],
  "questionsReponses": [
    {
      "question": "Question directe testant la compréhension",
      "reponse": "Réponse complète et claire avec exemple si nécessaire"
    },
    "...entre 5 et 10 paires"
  ]
}`;

  const texteMsg = contenuBrut
    ? `Voici le contenu du cours : "${contenuBrut}"\n\nGénère la fiche mémo et les Q&R pour ce chapitre.`
    : `Génère la fiche mémo et les Q&R pour le chapitre : "${chapitre}" (${niveau} - ${matiere})`;

  const { blocs } = construireContenuAvecDocs(texteMsg, documentsRef);

  const texte = await appelerClaude({
    system,
    messages:  [{ role: 'user', content: blocs }],
    maxTokens: 1500,
    typeAppel: 'fiche_memo',
    userId,
  });

  return parseJSON(texte);
};

// ─────────────────────────────────────────────
// Modifier un HTML selon des consignes IA
// ─────────────────────────────────────────────
const modifierHTML = async ({ contenuHTML, instructions, chapitre, niveau, matiere, userId }) => {
  const system = `Tu es un expert en ingénierie pédagogique et en HTML pour le niveau ${niveau} en ${matiere}.
Tu reçois un cours au format HTML et des instructions précises pour le modifier ou l'améliorer.
Retourne UNIQUEMENT le code HTML résultant, sans aucune explication, sans markdown, sans backticks.
Le résultat doit être un document HTML valide et complet (balise <!DOCTYPE html> incluse si elle était présente).
Conserve la structure globale du cours. Applique fidèlement les instructions.`;

  const message = `Chapitre : "${chapitre}" | Niveau : ${niveau} | Matière : ${matiere}

Instructions de modification :
"${instructions}"

Code HTML du cours à modifier :
${contenuHTML}

Retourne uniquement le HTML modifié.`;

  const texte = await appelerClaude({
    system,
    messages:  [{ role: 'user', content: [{ type: 'text', text: message }] }],
    maxTokens: 8000,
    typeAppel: 'modifier_html',
    userId,
  });

  return texte.trim();
};

// ─────────────────────────────────────────────
// Générer des exercices depuis le contenu HTML
// ─────────────────────────────────────────────
const genererExercicesHTML = async ({ contenuHTML, instructions, chapitre, niveau, matiere, userId }) => {
  const system = `Tu es un expert en pédagogie pour le niveau ${niveau} en ${matiere}.
Tu génères des exercices pertinents et variés à partir du contenu d'un cours.
Tu réponds UNIQUEMENT en JSON valide (tableau), sans markdown, sans backticks.

Format attendu :
[
  {
    "question":    "Énoncé précis de l'exercice",
    "reponse":     "Réponse correcte et complète attendue",
    "explication": "Explication pédagogique détaillée de la réponse"
  }
]`;

  // Limiter le HTML à 10 000 caractères pour ne pas dépasser les tokens
  const htmlResume = contenuHTML.length > 10000
    ? contenuHTML.substring(0, 10000) + '\n[... suite du cours tronquée pour raisons techniques ...]'
    : contenuHTML;

  const message = `Chapitre : "${chapitre}" | Niveau : ${niveau} | Matière : ${matiere}

${instructions ? `Instructions spécifiques : "${instructions}"\n\n` : ''}Contenu HTML du cours :
${htmlResume}

Génère les exercices au format JSON (tableau).`;

  const texte = await appelerClaude({
    system,
    messages:  [{ role: 'user', content: [{ type: 'text', text: message }] }],
    maxTokens: 3000,
    typeAppel: 'exercices_html',
    userId,
  });

  return parseJSON(texte);
};

// ─────────────────────────────────────────────
// Générer un QCM complet par IA (20-25 questions)
// ─────────────────────────────────────────────
const genererQCM = async ({ contenuHTML, contenuTexte, instructions, chapitre, niveau, matiere, nbQuestions = 20, userId }) => {
  const system = `Tu es un expert en création de QCM pédagogiques pour le niveau ${niveau} en ${matiere}.
Tu génères des questions à choix multiple exactes, rigoureuses et bien répartis en difficultés.
Chaque question doit avoir 4 options (A, B, C, D) avec une seule bonne réponse.
Tu réponds UNIQUEMENT en JSON valide (tableau), sans markdown, sans backticks.

Format attendu :
[
  {
    "enonce": "Question précise ?",
    "options": [
      {"lettre":"A","texte":"Option A"},
      {"lettre":"B","texte":"Option B"},
      {"lettre":"C","texte":"Option C"},
      {"lettre":"D","texte":"Option D"}
    ],
    "reponseCorrecte": "A",
    "explication": "Pourquoi c'est la bonne réponse avec détails pédagogiques"
  }
]

${instructions ? `\nInstructions spécifiques: ${instructions}` : ''}

Génère exactement ${nbQuestions} questions variées couvrant tous les aspects du chapitre.`;

  const contenu = contenuHTML || contenuTexte || `le chapitre "${chapitre}"`;
  const message = `Chapitre : "${chapitre}" | Niveau : ${niveau} | Matière : ${matiere}

Voici le contenu du cours :
${contenu}

Génère ${nbQuestions} questions de QCM au format JSON (tableau).`;

  const texte = await appelerClaude({
    system,
    messages: [{ role: 'user', content: [{ type: 'text', text: message }] }],
    maxTokens: 6000,
    typeAppel: 'generer_qcm',
    userId,
  });

  return parseJSON(texte);
};

// ─────────────────────────────────────────────
// Transformer des exercices classiques en QCM
// ─────────────────────────────────────────────
const transformerExercicesEnQCM = async ({ texteExercices, chapitre, niveau, matiere, nbQuestions = 20, userId }) => {
  const system = `Tu es un expert en transformation d'exercices pédagogiques en QCM.
Tu reçois du texte contenant des exercices classiques (remplissage, vrai/faux, etc.) et tu les transformes en questions QCM rigoureuses avec 4 options (A, B, C, D).
Tu conserves la rigueur et la difficulté des exercices originaux.
Tu réponds UNIQUEMENT en JSON valide (tableau), sans markdown, sans backticks.

Format attendu :
[
  {
    "enonce": "Question transformée en QCM ?",
    "options": [
      {"lettre":"A","texte":"Option A"},
      {"lettre":"B","texte":"Option B"},
      {"lettre":"C","texte":"Option C"},
      {"lettre":"D","texte":"Option D"}
    ],
    "reponseCorrecte": "A",
    "explication": "Explication tirée de l'exercice original ou déduite"
  }
]

Génère environ ${nbQuestions} questions QCM.`;

  const message = `Chapitre : "${chapitre}" | Niveau : ${niveau} | Matière : ${matiere}

Voici les exercices à transformer :
${texteExercices}

Transforme-les en QCM au format JSON (tableau).`;

  const texte = await appelerClaude({
    system,
    messages: [{ role: 'user', content: [{ type: 'text', text: message }] }],
    maxTokens: 4000,
    typeAppel: 'transformer_exercices_qcm',
    userId,
  });

  return parseJSON(texte);
};

// ─────────────────────────────────────────────
// Extraire des QCM depuis un fichier HTML collé
// L'admin colle du HTML contenant des exercices QCM déjà rédigés.
// Claude détecte et extrait les questions/réponses au format standard.
// ─────────────────────────────────────────────
const extraireQCMdepuisHTML = async ({ htmlExercices, chapitre, niveau, matiere, userId }) => {
  const system = `Tu es un expert en pédagogie. Tu reçois du code HTML contenant des exercices QCM rédigés par un professeur.
Ta mission : détecter et extraire TOUTES les questions QCM présentes dans ce HTML, avec leurs options et la bonne réponse.
Tu dois UNIQUEMENT retourner un JSON valide (tableau), sans markdown, sans backticks, sans texte autour.

Si le HTML contient des questions à choix multiples (QCM, vrai/faux, choix d'options), extrais-les.
Si le HTML contient des exercices classiques sans format QCM, transforme-les en QCM avec 4 options (A,B,C,D).

Format attendu :
[
  {
    "enonce": "Question précise ?",
    "options": [
      {"lettre":"A","texte":"Option A"},
      {"lettre":"B","texte":"Option B"},
      {"lettre":"C","texte":"Option C"},
      {"lettre":"D","texte":"Option D"}
    ],
    "reponseCorrecte": "A",
    "explication": "Explication pédagogique de la bonne réponse"
  }
]`;

  const htmlResume = htmlExercices.length > 15000
    ? htmlExercices.substring(0, 15000) + '\n[... suite tronquée ...]'
    : htmlExercices;

  const message = `Chapitre : "${chapitre}" | Niveau : ${niveau} | Matière : ${matiere}

Voici le code HTML contenant les exercices QCM à extraire :
${htmlResume}

Extrais et retourne toutes les questions QCM au format JSON (tableau).`;

  const texte = await appelerClaude({
    system,
    messages: [{ role: 'user', content: [{ type: 'text', text: message }] }],
    maxTokens: 6000,
    typeAppel: 'extraire_qcm_html',
    userId,
  });

  return parseJSON(texte);
};

module.exports = { genererResumeCours, preparerCoursProfesseur, genererFicheMemo, modifierHTML, genererExercicesHTML, genererQCM, transformerExercicesEnQCM, extraireQCMdepuisHTML };