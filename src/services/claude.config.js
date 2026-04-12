const Anthropic = require('@anthropic-ai/sdk');
const path      = require('path');
const fs        = require('fs');
const LogIA     = require('../models/LogIA');

const MODEL  = 'claude-sonnet-4-20250514';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─────────────────────────────────────────────
// Appel générique Claude avec logging auto
// ─────────────────────────────────────────────
const appelerClaude = async ({ system, messages, maxTokens = 1000, typeAppel, userId, sessionId }) => {
  const debut = Date.now();
  try {
    const response = await client.messages.create({ model: MODEL, max_tokens: maxTokens, system, messages });
    // Log asynchrone — ne bloque pas la réponse
    LogIA.create({
      userId, sessionId, typeAppel,
      promptTokens:     response.usage.input_tokens,
      completionTokens: response.usage.output_tokens,
      latencyMs:        Date.now() - debut,
      model:            MODEL,
      succes:           true,
    }).catch(() => {});
    return response.content[0].text;
  } catch (e) {
    LogIA.create({ userId, sessionId, typeAppel, succes: false, erreur: e.message, model: MODEL }).catch(() => {});
    throw new Error(`Erreur Claude API : ${e.message}`);
  }
};

// ─────────────────────────────────────────────
// Parser JSON de façon sécurisée
// ─────────────────────────────────────────────
const parseJSON = (texte) => {
  try {
    return JSON.parse(texte.replace(/```json|```/g, '').trim());
  } catch {
    throw new Error('Réponse Claude non parseable en JSON');
  }
};

// ─────────────────────────────────────────────
// Prompt système de base — commun à toutes les fonctions
// ─────────────────────────────────────────────
const promptBase = (niveau, matiere, promptSupplement = '') => `
Tu es Taté, un tuteur pédagogique bienveillant et encourageant pour des élèves de niveau ${niveau} en ${matiere}.
Tu t'inspires de la douceur et de la bienveillance d'une grand-mère qui encourage l'excellence.
Tu t'adresses directement à l'élève avec chaleur, en utilisant "tu".
Tu ne décourages jamais — chaque erreur est une occasion d'apprendre.
Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après.
${promptSupplement ? `Instructions spécifiques : ${promptSupplement}` : ''}
`.trim();

// ─────────────────────────────────────────────
// Construire les blocs de contenu avec les documents de référence
// Renvoie un tableau de content blocks pour l'API Anthropic
// ─────────────────────────────────────────────
const UPLOAD_BASE = path.join(__dirname, '../../uploads');

const construireContenuAvecDocs = (texteUtilisateur, documentsRef = []) => {
  const blocs = [];
  let nbDocsAjoutes = 0;

  for (const doc of documentsRef) {
    const fullPath = path.join(UPLOAD_BASE, doc.chemin);
    if (!fs.existsSync(fullPath)) continue;

    try {
      if (doc.type === 'pdf') {
        // Claude API lit les PDFs nativement via base64
        const data = fs.readFileSync(fullPath);
        blocs.push({
          type: 'document',
          source: {
            type:       'base64',
            media_type: 'application/pdf',
            data:       data.toString('base64'),
          },
          title: doc.nom,
          context: `Document de référence pédagogique fourni par l'équipe enseignante`,
        });
        nbDocsAjoutes++;
      } else if (doc.type === 'txt') {
        // Texte brut → inclus directement dans le message
        const texte = fs.readFileSync(fullPath, 'utf-8').slice(0, 20000); // max 20k caractères
        blocs.push({
          type: 'text',
          text: `📎 Document de référence "${doc.nom}" :\n\`\`\`\n${texte}\n\`\`\``,
        });
        nbDocsAjoutes++;
      } else if (['jpg', 'jpeg', 'png'].includes(doc.type)) {
        // Image → Claude peut lire les images directement
        const data = fs.readFileSync(fullPath);
        const mediaType = doc.type === 'png' ? 'image/png' : 'image/jpeg';
        blocs.push({
          type: 'image',
          source: {
            type:       'base64',
            media_type: mediaType,
            data:       data.toString('base64'),
          },
        });
        nbDocsAjoutes++;
      } else if (['docx', 'doc'].includes(doc.type)) {
        // DOCX : on essaie d'extraire le texte avec mammoth si disponible
        // sinon on indique juste le nom du fichier pour que l'IA sache qu'il existe
        try {
          const mammoth = require('mammoth');
          const result  = mammoth.extractRawTextSync({ path: fullPath });
          const texte   = result.value?.slice(0, 20000) || '';
          if (texte.trim()) {
            blocs.push({
              type: 'text',
              text: `📎 Document Word "${doc.nom}" :\n\`\`\`\n${texte}\n\`\`\``,
            });
            nbDocsAjoutes++;
          }
        } catch {
          // mammoth non installé — on mentionne juste le fichier
          blocs.push({
            type: 'text',
            text: `📎 Document Word fourni par l'équipe : "${doc.nom}" (contenu non extractible automatiquement — s'inspirer du nom et du contexte du chapitre).`,
          });
          nbDocsAjoutes++;
        }
      }
    } catch (e) {
      console.warn(`⚠️ Impossible de lire le document "${doc.nom}" :`, e.message);
    }
  }

  // Bloc texte principal de l'utilisateur (toujours en dernier)
  blocs.push({ type: 'text', text: texteUtilisateur });

  return { blocs, nbDocsAjoutes };
};

module.exports = { appelerClaude, parseJSON, promptBase, construireContenuAvecDocs, MODEL };