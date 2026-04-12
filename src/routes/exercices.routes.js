// ============================================================
// src/routes/exercices.routes.js
// Flux simplifié :
//   1. /demarrer  → retourne le résumé pré-stocké + toutes les questions (réponses masquées)
//   2. /soumettre → reçoit toutes les réponses de l'élève → retourne score + corrections
//
// Taté ne génère rien : le contenu vient de la BDD (admin/prof a tout préparé).
// Taté masque les réponses, collecte les réponses, affiche les corrections pré-stockées.
// ============================================================
const express  = require('express');
const Chapitre = require('../models/Chapitre');
const Lecon    = require('../models/Lecon');
const Session  = require('../models/Session');
const User     = require('../models/User');
const { authJWT, roleCheck } = require('../middlewares');

const router = express.Router();
router.use(authJWT);
const ok  = (res, d, s=200) => res.status(s).json({ success:true,  data:d });
const err = (res, m, s=400) => res.status(s).json({ success:false, error:m });

const LIMITE_GRATUIT = 10; // sessions par jour (gratuit)

// ── Normalise une réponse pour comparaison souple ───────────
const normaliser = (str = '') =>
  str.toLowerCase().trim()
     .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // supprimer accents
     .replace(/['']/g, "'")
     .replace(/\s+/g, ' ');

// ── Vérifie si la réponse de l'élève est correcte ───────────
// Comparaison souple : on accepte si la réponse contient les mots-clés essentiels
const estCorrecte = (reponseEleve, reponseAttendue) => {
  const e = normaliser(reponseEleve);
  const a = normaliser(reponseAttendue);
  if (!e || !a) return false;
  if (e === a) return true;

  // Vérifier si la réponse attendue est contenue dans celle de l'élève
  if (e.includes(a)) return true;

  // Vérifier si au moins 70% des mots de la réponse attendue sont présents
  const motsAttendus = a.split(' ').filter(m => m.length > 2);
  if (motsAttendus.length === 0) return e.includes(a);
  const motsPresents = motsAttendus.filter(m => e.includes(m));
  return motsPresents.length / motsAttendus.length >= 0.7;
};

// ═══════════════════════════════════════════════════════════════
// POST /api/exercices/demarrer
// Retourne : résumé pré-stocké + toutes les questions (réponses masquées)
// ═══════════════════════════════════════════════════════════════
router.post('/demarrer', roleCheck('eleve'), async (req, res) => {
  try {
    const { chapitreId } = req.body;
    const chapitre = await Chapitre.findById(chapitreId).populate('matiereId');
    if (!chapitre) return err(res, 'Chapitre introuvable', 404);

    // ── Limite quotidienne pour les non-premium ──────────────
    const eleve = await User.findById(req.user._id);
    const estPremium = eleve.abonnement === 'premium'
      && eleve.abonnementExpiry
      && eleve.abonnementExpiry > new Date();

    if (!estPremium) {
      const aujourdhui  = new Date();
      const derniereDate = eleve.exercicesStats?.date;
      const memJour = derniereDate
        && derniereDate.toDateString() === aujourdhui.toDateString();

      if (memJour && (eleve.exercicesStats?.count || 0) >= LIMITE_GRATUIT) {
        return res.status(429).json({
          success: false,
          error:   'LIMITE_JOUR',
          message: `Tu as utilisé tes ${LIMITE_GRATUIT} sessions gratuites d'aujourd'hui. Reviens demain ou abonne-toi ! 🌟`,
          limiteAtteinte: true,
        });
      }

      if (memJour) {
        await User.findByIdAndUpdate(req.user._id, { $inc: { 'exercicesStats.count': 1 } });
      } else {
        await User.findByIdAndUpdate(req.user._id, {
          'exercicesStats.date':  aujourdhui,
          'exercicesStats.count': 1,
        });
      }
    }

    // ── Chercher le cours publié ─────────────────────────────
    const lecon = await Lecon.findOne({ chapitreId, statut: 'publie' }).sort({ updatedAt: -1 });

    // Accepter le cours si : résumé textuel OU HTML OU blocs structurés
    const hasContent = lecon && (
      lecon.contenuFormate?.resume ||
      lecon.contenuHTML ||
      (lecon.contenuStructure && lecon.contenuStructure.length > 0)
    );
    if (!hasContent) {
      return res.status(503).json({
        success: false,
        error:   'COURS_NON_DISPONIBLE',
        message: 'Ce cours n\'est pas encore disponible. L\'enseignant le prépare. Reviens bientôt ! 📚',
        coursNonDisponible: true,
      });
    }

    const cf = lecon.contenuFormate || {};

    // ── Résumé (affiché à l'élève avant les exercices) ───────
    const resume = {
      titre:            chapitre.titre,
      objectif:         cf.objectif       || '',
      resume:           cf.resume         || '',
      regle:            cf.regle          || '',
      exemples:         cf.exemples       || [],
      pieges:           cf.pieges         || [],
      resumeMemo:       cf.resumeMemo     || [],
      // Contenu structuré par blocs visuels (cours créé manuellement)
      contenuStructure: lecon.contenuStructure?.length > 0 ? lecon.contenuStructure : null,
      // Cours HTML complet uploadé par le prof/admin
      contenuHTML: lecon.contenuHTML || null,
      // Signal pour le client : ce cours n'a pas encore d'exercices classiques (utiliser QCM)
      exercicesDisponibles: (cf.correctionsTypes || []).length > 0,
    };

    // ── Questions — réponses et explications masquées ────────
    const banque = cf.correctionsTypes || [];
    if (banque.length === 0) {
      // Cours HTML sans exercices classiques : afficher le cours, renvoyer vers QCM
      const session = await Session.create({
        eleveId:    req.user._id,
        chapitreId,
        leconId:    lecon._id,
        serie:      1,
        tentative:  1,
      });
      return ok(res, { session: { id: session._id }, resume, questions: [] });
    }

    // Mélanger et exposer UNIQUEMENT la question (pas la réponse, pas l'explication)
    const questions = [...banque]
      .sort(() => Math.random() - 0.5)
      .map((q, i) => ({ index: i, question: q.question }));

    const session = await Session.create({
      eleveId:    req.user._id,
      chapitreId,
      leconId:    lecon._id,
      serie:      1,
      tentative:  1,
    });

    ok(res, { session: { id: session._id }, resume, questions });
  } catch (e) { err(res, e.message, 500); }
});

// ═══════════════════════════════════════════════════════════════
// POST /api/exercices/soumettre
// Reçoit toutes les réponses de l'élève → retourne score + corrections complètes
// ═══════════════════════════════════════════════════════════════
router.post('/soumettre', roleCheck('eleve'), async (req, res) => {
  try {
    const { sessionId, reponses } = req.body;
    // reponses = [{ index, question, reponseEleve }]

    if (!sessionId || !Array.isArray(reponses) || reponses.length === 0) {
      return err(res, 'sessionId et reponses[] sont requis');
    }

    const session = await Session.findById(sessionId)
      .populate({ path: 'chapitreId', populate: 'matiereId' });
    if (!session) return err(res, 'Session introuvable', 404);

    // ── Récupérer la banque de questions pré-stockées ────────
    const lecon = await Lecon.findById(session.leconId)
      || await Lecon.findOne({ chapitreId: session.chapitreId._id, statut: 'publie' })
               .sort({ updatedAt: -1 });

    const banque = lecon?.contenuFormate?.correctionsTypes || [];
    if (banque.length === 0) return err(res, 'Exercices introuvables', 404);

    // ── Mélanger la banque de la même façon (seed basé sur session._id) ─
    // On utilise un index pour retrouver la bonne question
    // L'élève envoie { question: "texte exact" } → on le retrouve dans la banque
    const corrections = reponses.map(r => {
      // Trouver la question correspondante dans la banque
      const stored = banque.find(q => normaliser(q.question) === normaliser(r.question))
        || banque[r.index]
        || null;

      if (!stored) {
        return {
          question:        r.question,
          reponseEleve:    r.reponseEleve,
          reponseAttendue: '—',
          explication:     '',
          correct:         false,
        };
      }

      const correct = estCorrecte(r.reponseEleve, stored.reponse);
      return {
        question:        stored.question,
        reponseEleve:    r.reponseEleve,
        reponseAttendue: stored.reponse,
        explication:     stored.explication || '',
        correct,
      };
    });

    // ── Calcul du score ──────────────────────────────────────
    const nbCorrect = corrections.filter(c => c.correct).length;
    const total     = corrections.length;
    const scorePct  = total > 0 ? Math.round((nbCorrect / total) * 100) : 0;
    const etoiles   = scorePct === 100 ? 3 : scorePct >= 80 ? 2 : scorePct >= 50 ? 1 : 0;
    const maitrise  = scorePct >= 70;

    // ── Message de félicitations ─────────────────────────────
    let message;
    if (scorePct === 100) message = 'Parfait ! 🏆 Tu maîtrises ce chapitre !';
    else if (scorePct >= 80) message = 'Excellent travail ! 🌟 Continue comme ça !';
    else if (scorePct >= 50) message = 'Bien essayé ! 💪 Relis les corrections pour progresser.';
    else message = 'Courage ! 📚 Relis le cours et réessaie.';

    // ── Sauvegarder la session ───────────────────────────────
    session.reponses    = corrections.map(c => ({
      question:        c.question,
      reponseEleve:    c.reponseEleve,
      reponseAttendue: c.reponseAttendue,
      correct:         c.correct,
      explication:     c.explication,
    }));
    session.scorePct    = scorePct;
    session.maitrise    = maitrise;
    session.statut      = 'terminee';
    session.completedAt = new Date();
    await session.save();

    // ── Valider le chapitre si score ≥ 70% ───────────────────
    if (maitrise) {
      const badge = scorePct === 100 ? '⭐ Parfait !' : etoiles === 2 ? '🎯 Excellent !' : '💪 Bien joué !';
      await User.findByIdAndUpdate(req.user._id, {
        $push:     { chapitresValides: {
          chapitreId: session.chapitreId._id,
          scoreFinal: scorePct,
          valideAt:   new Date(),
          etoiles,
        }},
        $addToSet: { badges: badge },
      });
    }

    ok(res, { scorePct, nbCorrect, total, etoiles, maitrise, message, corrections });
  } catch (e) { err(res, e.message, 500); }
});

module.exports = router;
