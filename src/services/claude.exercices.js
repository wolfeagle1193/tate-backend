const { appelerClaude, parseJSON, promptBase, construireContenuAvecDocs } = require('./claude.config');

// ─────────────────────────────────────────────
// Générer 10 questions pour une série
// ─────────────────────────────────────────────
const genererQuestions = async ({
  chapitre, niveau, matiere, serie,
  phrasesDejaUtilisees = [], promptSupplement, formatExercices,
  documentsRef = [],
  nombreQuestions = 10,   // Toujours 10 questions par série
  focusNotion = null,
  userId, sessionId,
}) => {
  const difficultes = {
    1: 'facile — application directe de la règle, phrases simples et courtes',
    2: 'intermédiaire — phrases complètes, contexte plus riche, cas moins évidents',
    3: 'avancé — cas complexes, exceptions, phrases longues, situations ambiguës',
  };
  const niv = Math.min(serie, 3);

  const focusText = focusNotion
    ? `⚠️ FOCUS SPÉCIAL : L'élève a des difficultés sur "${focusNotion}". Concentre les questions sur CETTE notion précisément.`
    : '';

  // Si un format précis d'exercices a été défini par l'admin/prof, il est OBLIGATOIRE
  const formatStrict = formatExercices
    ? `\n\n🔒 FORMAT OBLIGATOIRE DÉFINI PAR L'ÉQUIPE PÉDAGOGIQUE — à respecter STRICTEMENT :\n${formatExercices}\nTu NE PEUX PAS déroger à ce format.`
    : '';

  const docsHint = documentsRef.length > 0
    ? `\n\n📎 Des documents de référence sont fournis. Inspire-toi de leur style, contenu et structure pour générer les exercices. Respecte les modèles d'exercices qu'ils contiennent.`
    : '';

  const system = promptBase(niveau, matiere, promptSupplement) + formatStrict + docsHint + `

Génère exactement 10 questions de niveau ${difficultes[niv]} sur "${chapitre}".
${focusText}
Questions variées, pédagogiques. Teste la compréhension, pas la mémorisation.
${phrasesDejaUtilisees.length > 0
  ? `Phrases DÉJÀ UTILISÉES à ne pas répéter : ${phrasesDejaUtilisees.slice(-30).join(' | ')}`
  : ''}

Format JSON (tableau de 10 objets) :
[
  {
    "question": "la question posée",
    "consigne": "courte instruction (ex: Mets au pluriel, Complète...)",
    "reponseAttendue": "réponse correcte exacte",
    "indice": "petit indice pour débloquer"
  }
]`;

  const texteMsg = `Génère 10 questions de série ${serie} sur "${chapitre}" pour ${niveau}.`;
  const { blocs } = construireContenuAvecDocs(texteMsg, documentsRef);

  const texte = await appelerClaude({
    system,
    messages: [{ role: 'user', content: blocs }],
    maxTokens: 2000,
    typeAppel: 'generation_questions',
    userId,
    sessionId,
  });

  return parseJSON(texte);
};

// ─────────────────────────────────────────────
// Vérifier si l'élève a compris la leçon
// ─────────────────────────────────────────────
const verifierComprehension = async ({ reponseEleve, chapitre, niveau, matiere, userId, sessionId }) => {
  const system = promptBase(niveau, matiere) + `

L'élève vient de lire le résumé du chapitre "${chapitre}" et tu lui as demandé s'il avait compris.
Si OUI → encourage et indique qu'on peut commencer les exercices.
Si NON ou réponse floue → reformule différemment avec d'autres exemples et redemande.

Format JSON :
{
  "compris": true/false,
  "message": "réponse chaleureuse à l'élève",
  "peutCommencer": true/false
}`;

  const texte = await appelerClaude({
    system,
    messages: [{ role: 'user', content: reponseEleve }],
    maxTokens: 300,
    typeAppel: 'correction',
    userId,
    sessionId,
  });

  return parseJSON(texte);
};

// ─────────────────────────────────────────────
// 🧠 IA évalue APRÈS chaque série de 10 questions
// RÈGLE FIXE : minimum 3 séries obligatoires
// L'IA peut identifier les lacunes et adapter le focus
// Mais ne peut déclarer la maîtrise qu'à partir de la série 3
// ─────────────────────────────────────────────
const evaluerProgression = async ({
  reponses, chapitre, niveau, matiere, serie, userId, sessionId,
}) => {
  const total   = reponses.length;
  const correct = reponses.filter(r => r.correct).length;
  const score   = total > 0 ? Math.round((correct / total) * 100) : 0;

  // ── RÈGLE FIXE : jamais de maîtrise avant la série 3 ──
  const peutMaitriser = serie >= 3;

  const erreursTexte = reponses
    .filter(r => !r.correct)
    .map((e, i) => `${i+1}. Q: "${e.question}" | Élève: "${e.reponseEleve}" | Correct: "${e.reponseAttendue}"`)
    .join('\n');

  const system = promptBase(niveau, matiere) + `

Tu es l'IA pédagogique de Taté. L'élève vient de terminer la série ${serie} (10 questions) sur "${chapitre}".
Score : ${score}% (${correct}/10 correctes).

RÈGLE ABSOLUE : Il faut OBLIGATOIREMENT 3 séries de 10 questions minimum.
${peutMaitriser
  ? `C'est la série ${serie} (≥ 3). Tu PEUX maintenant déclarer la maîtrise si le score est suffisant.`
  : `C'est la série ${serie} (< 3). Tu NE PEUX PAS encore déclarer la maîtrise. Continue toujours.`
}

DÉCISION :
- Série < 3 : verdict = "continuer" TOUJOURS (peu importe le score)
- Série ≥ 3 et score ≥ 80% : verdict = "maitrise"
- Série ≥ 3 et score < 60% : verdict = "remediation"  
- Série ≥ 3 et score 60-79% : verdict = "continuer" (focus sur les notions faibles)

Format JSON :
{
  "verdict": "maitrise" | "continuer" | "remediation",
  "score": ${score},
  "message": "message encourageant et personnalisé à l'élève (chaleureux, style grand-mère bienveillante)",
  "notionFaible": "notion précise à travailler si continuer (ou null)",
  "etoiles": 1 | 2 | 3 (seulement si verdict=maitrise, selon le score moyen sur toutes les séries)
}`;

  const texte = await appelerClaude({
    system,
    messages: [{
      role: 'user',
      content: `Série ${serie} | ${total} questions | Score: ${score}% | ${correct} bonnes réponses\n${erreursTexte.length > 0 ? `\nErreurs :\n${erreursTexte}` : '\n✅ Aucune erreur !'}`,
    }],
    maxTokens: 500,
    typeAppel: 'evaluation_progression',
    userId,
    sessionId,
  });

  const result = parseJSON(texte);
  // Sécurité : forcer continuer si série < 3
  if (!peutMaitriser && result.verdict === 'maitrise') {
    result.verdict = 'continuer';
    result.message = result.message + " Continue avec la série suivante, tu t'améliores !";
  }
  return result;
};

module.exports = { genererQuestions, verifierComprehension, evaluerProgression };
