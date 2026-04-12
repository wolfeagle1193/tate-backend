// ============================================================
// src/routes/qcm.routes.js
// ============================================================
const express = require('express');
const Qcm = require('../models/Qcm');
const TentativeQcm = require('../models/TentativeQcm');
const Chapitre = require('../models/Chapitre');
const User = require('../models/User');
const { authJWT, roleCheck } = require('../middlewares');
const { genererQCM, transformerExercicesEnQCM, extraireQCMdepuisHTML } = require('../services/claude.cours');
const { notifierResultatQCM } = require('../services/notifications.service');

const router = express.Router();
router.use(authJWT);

const ok = (res, d, s = 200) => res.status(s).json({ success: true, data: d });
const err = (res, m, s = 400) => res.status(s).json({ success: false, error: m });

// ── POST /api/qcm/generer ──────────────────────────────────
// Générer un QCM par IA
router.post('/generer', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const { chapitreId, leconId, instructions, nbQuestions = 20, contenuHTML, contenuTexte } = req.body;

    // Vérifier que le chapitre existe et charger ses infos
    const chapitre = await Chapitre.findById(chapitreId)
      .populate('matiereId', 'nom');
    if (!chapitre) return err(res, 'Chapitre introuvable', 404);

    // Appeler Claude pour générer les questions
    const questions = await genererQCM({
      contenuHTML,
      contenuTexte,
      instructions,
      chapitre: chapitre.titre,
      niveau: chapitre.niveau || 'Libre',
      matiere: chapitre.matiereId?.nom || 'Générale',
      nbQuestions,
      userId: req.user._id,
    });

    // Créer le QCM en DB
    const qcm = await Qcm.create({
      chapitreId,
      leconId: leconId || null,
      titre: `QCM - ${chapitre.titre}`,
      questions,
      statut: 'en_preparation',
      creePar: req.user._id,
    });

    ok(res, qcm, 201);
  } catch (e) {
    console.error('Erreur genererQCM:', e.message);
    err(res, e.message, 500);
  }
});

// ── POST /api/qcm/transformer-exercices ────────────────────
// Transformer des exercices en QCM
router.post('/transformer-exercices', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const { chapitreId, texteExercices, nbQuestions = 20 } = req.body;

    const chapitre = await Chapitre.findById(chapitreId)
      .populate('matiereId', 'nom');
    if (!chapitre) return err(res, 'Chapitre introuvable', 404);

    const questions = await transformerExercicesEnQCM({
      texteExercices,
      chapitre: chapitre.titre,
      niveau: chapitre.niveau || 'Libre',
      matiere: chapitre.matiereId?.nom || 'Générale',
      nbQuestions,
      userId: req.user._id,
    });

    const qcm = await Qcm.create({
      chapitreId,
      titre: `QCM - ${chapitre.titre}`,
      questions,
      statut: 'en_preparation',
      creePar: req.user._id,
    });

    ok(res, qcm, 201);
  } catch (e) {
    console.error('Erreur transformerExercices:', e.message);
    err(res, e.message, 500);
  }
});

// ── POST /api/qcm/depuis-html ──────────────────────────────
// L'admin colle du HTML contenant des QCM déjà rédigés → Claude extrait les questions
router.post('/depuis-html', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const { chapitreId, htmlExercices } = req.body;

    if (!chapitreId) return err(res, 'chapitreId obligatoire');
    if (!htmlExercices || htmlExercices.trim().length < 20)
      return err(res, 'Colle le HTML contenant les exercices QCM');

    const chapitre = await Chapitre.findById(chapitreId).populate('matiereId', 'nom');
    if (!chapitre) return err(res, 'Chapitre introuvable', 404);

    const questions = await extraireQCMdepuisHTML({
      htmlExercices,
      chapitre: chapitre.titre,
      niveau:   chapitre.niveau   || 'Libre',
      matiere:  chapitre.matiereId?.nom || 'Générale',
      userId:   req.user._id,
    });

    if (!Array.isArray(questions) || questions.length === 0)
      return err(res, 'Aucune question QCM détectée dans le HTML fourni');

    const qcm = await Qcm.create({
      chapitreId,
      titre:   `QCM (HTML) - ${chapitre.titre}`,
      questions,
      statut:  'en_preparation',
      creePar: req.user._id,
    });

    ok(res, qcm, 201);
  } catch (e) {
    console.error('Erreur depuis-html:', e.message);
    err(res, e.message, 500);
  }
});

// ── GET /api/qcm ────────────────────────────────────────────
// Lister les QCM (avec filtres optionnels)
router.get('/', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const { statut, chapitreId } = req.query;
    const filtre = {};
    if (statut) filtre.statut = statut;
    if (chapitreId) filtre.chapitreId = chapitreId;

    const qcms = await Qcm.find(filtre)
      .populate('chapitreId', 'titre matiereId')
      .populate('chapitreId.matiereId', 'nom icone')
      .sort({ createdAt: -1 });

    ok(res, qcms);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// ── GET /api/qcm/chapitre/:chapitreId/actif ────────────────
// Charger le dernier QCM publié pour un chapitre (pour élèves)
router.get('/chapitre/:chapitreId/actif', async (req, res) => {
  try {
    const qcm = await Qcm.findOne({
      chapitreId: req.params.chapitreId,
      statut: 'publie',
    }).sort({ valideeAt: -1 });

    if (!qcm) return err(res, 'Aucun QCM publié pour ce chapitre', 404);

    ok(res, qcm);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// ── PUT /api/qcm/:id/valider ───────────────────────────────
// Valider et publier un QCM
router.put('/:id/valider', roleCheck('admin', 'prof'), async (req, res) => {
  try {
    const qcm = await Qcm.findByIdAndUpdate(
      req.params.id,
      {
        statut: 'publie',
        valideePar: req.user._id,
        valideeAt: new Date(),
      },
      { new: true }
    );

    if (!qcm) return err(res, 'QCM introuvable', 404);

    ok(res, qcm);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// ── DELETE /api/qcm/:id ────────────────────────────────────
// Supprimer un QCM
router.delete('/:id', roleCheck('admin'), async (req, res) => {
  try {
    const qcm = await Qcm.findByIdAndDelete(req.params.id);
    if (!qcm) return err(res, 'QCM introuvable', 404);

    ok(res, { message: 'QCM supprimé' });
  } catch (e) {
    err(res, e.message, 500);
  }
});

// ── POST /api/qcm/:id/soumettre ────────────────────────────
// Soumettre les réponses et recevoir les corrections + score
router.post('/:id/soumettre', async (req, res) => {
  try {
    const { reponses } = req.body;
    const qcmId = req.params.id;

    const qcm = await Qcm.findById(qcmId);
    if (!qcm) return err(res, 'QCM introuvable', 404);

    // Calculer le score
    let nbCorrectes = 0;
    const corrections = qcm.questions.map((question, index) => {
      const reponseEleve = reponses.find(r => r.questionIndex === index)?.reponse;
      const estCorrecte = reponseEleve === question.reponseCorrecte;
      if (estCorrecte) nbCorrectes++;

      return {
        questionIndex: index,
        enonce: question.enonce,
        options: question.options,
        reponseCorrecte: question.reponseCorrecte,
        reponseEleve,
        estCorrecte,
        explication: question.explication,
      };
    });

    const nbTotal = qcm.questions.length;
    const score = Math.round((nbCorrectes / nbTotal) * 100);

    // Enregistrer la tentative et créer les notifications
    if (req.user) {
      await TentativeQcm.create({
        qcmId,
        eleveId: req.user._id,
        chapitreId: qcm.chapitreId,
        reponses,
        score,
        nbCorrectes,
        nbTotal,
      });

      // Récupérer le nom de l'élève et du chapitre pour les notifications
      const eleve   = await User.findById(req.user._id).select('nom prenom');
      const chapitre = await Chapitre.findById(qcm.chapitreId).select('titre');
      const eleveNom = eleve ? `${eleve.prenom || ''} ${eleve.nom || ''}`.trim() : 'Un élève';

      // Notifier élève + admin + prof + parent (en arrière-plan, sans bloquer la réponse)
      notifierResultatQCM({
        eleveId:     req.user._id,
        eleveNom,
        chapitreId:  qcm.chapitreId,
        chapitreNom: chapitre?.titre || 'Chapitre',
        qcmId,
        score,
        qcmCreePar:  qcm.creePar,   // pour notifier le prof créateur du QCM
      });
    }

    ok(res, {
      score,
      nbCorrectes,
      nbTotal,
      corrections,
    });
  } catch (e) {
    console.error('Erreur soumettre:', e.message);
    err(res, e.message, 500);
  }
});

// ── POST /api/qcm/:id/regenerer ────────────────────────────
// Régénérer un QCM avec variations
router.post('/:id/regenerer', async (req, res) => {
  try {
    const { chapitreId } = req.body;
    const qcmId = req.params.id;

    const qcmOriginal = await Qcm.findById(qcmId);
    if (!qcmOriginal) return err(res, 'QCM original introuvable', 404);

    const chapitre = await Chapitre.findById(chapitreId || qcmOriginal.chapitreId)
      .populate('matiereId', 'nom');
    if (!chapitre) return err(res, 'Chapitre introuvable', 404);

    // Générer un nouveau QCM avec variations
    const questions = await genererQCM({
      contenuTexte: `Voici un QCM précédent sur ce chapitre : ${JSON.stringify(qcmOriginal.questions.slice(0, 3))}. Varie les questions par rapport à cette version précédente.`,
      instructions: 'Varie les questions par rapport à la version précédente. Génère de nouvelles questions avec des énoncés et options différentes mais couvrant les mêmes concepts.',
      chapitre: chapitre.titre,
      niveau: chapitre.niveau || 'Libre',
      matiere: chapitre.matiereId?.nom || 'Générale',
      nbQuestions: qcmOriginal.questions.length,
      userId: req.user?._id,
    });

    // Créer et publier directement le nouveau QCM
    const qcmNouveau = await Qcm.create({
      chapitreId: chapitre._id,
      titre: `QCM - ${chapitre.titre} (Variation)`,
      questions,
      statut: 'publie',
      creePar: req.user?._id || null,
      valideePar: req.user?._id || null,
      valideeAt: new Date(),
    });

    ok(res, qcmNouveau, 201);
  } catch (e) {
    console.error('Erreur regenerer:', e.message);
    err(res, e.message, 500);
  }
});

module.exports = router;
