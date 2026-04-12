const { appelerClaude, parseJSON, promptBase } = require('./claude.config');

// ─────────────────────────────────────────────
// Corriger la réponse d'un élève
// ─────────────────────────────────────────────
const corrigerReponse = async ({ question, reponseEleve, reponseAttendue, chapitre, niveau, matiere, userId, sessionId }) => {
  const system = promptBase(niveau, matiere) + `

Tu corriges la réponse d'un élève de ${niveau} sur le chapitre "${chapitre}".
Si la réponse est correcte : félicite chaleureusement, varie les messages.
Si la réponse est incorrecte : explique l'erreur avec douceur, donne la règle, encourage.
Ne dis jamais juste "faux" — explique toujours POURQUOI et comment corriger.

Format JSON attendu :
{
  "correct": true/false,
  "emoji": "✅ ou 💪",
  "message": "message court et chaleureux (1 phrase)",
  "explication": "explication pédagogique de la règle (2-3 phrases max)",
  "encouragement": "phrase d'encouragement motivante",
  "reponseCorrigee": "la réponse correcte si l'élève s'est trompé"
}`;

  const texte = await appelerClaude({
    system,
    messages: [{
      role: 'user',
      content: `Question : "${question}" | Réponse attendue : "${reponseAttendue}" | Réponse de l'élève : "${reponseEleve}"`,
    }],
    maxTokens: 600,
    typeAppel: 'correction',
    userId,
    sessionId,
  });

  return parseJSON(texte);
};

// ─────────────────────────────────────────────
// Analyser les lacunes après une série échouée
// ─────────────────────────────────────────────
const analyserLacunes = async ({ erreurs, chapitre, niveau, matiere, userId, sessionId }) => {
  const system = promptBase(niveau, matiere) + `

Analyse les erreurs d'un élève de ${niveau} sur le chapitre "${chapitre}".
Identifie précisément quelle notion ou règle est mal comprise.
Génère une explication ciblée et 5 questions de rattrapage sur CETTE notion précise uniquement.
Sois encourageant — l'élève n'a pas échoué, il consolide un point précis.

Format JSON attendu :
{
  "notionProbleme": "la notion précise mal comprise en 1 phrase",
  "explicationCiblee": "explication claire et simple (3-4 phrases)",
  "exemplesSupplementaires": ["exemple 1", "exemple 2"],
  "messageMotivation": "message bienveillant pour reprendre ensemble",
  "questionsRattrapage": [
    { "question": "...", "consigne": "...", "reponseAttendue": "...", "indice": "..." }
  ]
}`;

  const erreursTexte = erreurs
    .map((e, i) => `${i+1}. Question: "${e.question}" | Élève: "${e.reponseEleve}" | Correct: "${e.reponseAttendue}"`)
    .join('\n');

  const texte = await appelerClaude({
    system,
    messages:  [{ role: 'user', content: `Voici les erreurs de l'élève :\n${erreursTexte}` }],
    maxTokens: 1500,
    typeAppel: 'analyse_lacunes',
    userId,
    sessionId,
  });

  return parseJSON(texte);
};

module.exports = { corrigerReponse, analyserLacunes };