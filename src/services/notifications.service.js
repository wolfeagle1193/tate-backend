// ============================================================
// src/services/notifications.service.js
// Helper pour créer des notifications en masse
// ============================================================
const Notification = require('../models/Notification');
const User         = require('../models/User');

/**
 * Crée des notifications pour un résultat de QCM :
 * - L'élève lui-même
 * - Tous les admins
 * - Le parent de l'élève (si parentId renseigné)
 */
const notifierResultatQCM = async ({ eleveId, eleveNom, chapitreId, chapitreNom, qcmId, score, qcmCreePar }) => {
  try {
    const maitrise = score >= 80;
    const emoji    = score >= 80 ? '⭐' : score >= 60 ? '📊' : '⚠️';

    const notifs = [];

    // ── Notification pour l'élève ──────────────────────────
    notifs.push({
      destinataireId: eleveId,
      type:    maitrise ? 'qcm_maitrise' : 'qcm_resultat',
      titre:   maitrise ? `${emoji} Bravo ! Tu as maîtrisé ce chapitre` : `${emoji} Résultat QCM`,
      message: maitrise
        ? `Tu as obtenu ${score}% au QCM "${chapitreNom}". Excellent travail !`
        : `Tu as obtenu ${score}% au QCM "${chapitreNom}". ${score < 60 ? 'Réessaie pour progresser !' : 'Continue tes efforts !'}`,
      eleveId,
      eleveNom,
      qcmId,
      chapitreId,
      chapitreNom,
      score,
    });

    // ── Notifications pour tous les admins ────────────────
    const admins = await User.find({ role: 'admin', actif: true }).select('_id');
    const adminIds = new Set(admins.map(a => String(a._id)));
    for (const admin of admins) {
      notifs.push({
        destinataireId: admin._id,
        type:    maitrise ? 'qcm_maitrise' : score < 60 ? 'qcm_difficulte' : 'qcm_resultat',
        titre:   `📋 QCM : ${eleveNom}`,
        message: `${eleveNom} a obtenu ${score}% au QCM "${chapitreNom}"${maitrise ? ' — Maîtrisé ⭐' : score < 60 ? ' — Difficulté ⚠️' : ''}.`,
        eleveId,
        eleveNom,
        qcmId,
        chapitreId,
        chapitreNom,
        score,
      });
    }

    // ── Notification pour le prof créateur du QCM ─────────
    if (qcmCreePar && !adminIds.has(String(qcmCreePar))) {
      const createur = await User.findById(qcmCreePar).select('_id role actif');
      if (createur && createur.role === 'prof' && createur.actif !== false) {
        notifs.push({
          destinataireId: createur._id,
          type:    maitrise ? 'qcm_maitrise' : score < 60 ? 'qcm_difficulte' : 'qcm_resultat',
          titre:   `📋 QCM : ${eleveNom}`,
          message: `${eleveNom} a obtenu ${score}% au QCM "${chapitreNom}"${maitrise ? ' — Maîtrisé ⭐' : score < 60 ? ' — Difficulté ⚠️' : ''}.`,
          eleveId,
          eleveNom,
          qcmId,
          chapitreId,
          chapitreNom,
          score,
        });
      }
    }

    // ── Notification pour le parent de l'élève ────────────
    const eleve = await User.findById(eleveId).select('parentId');
    if (eleve?.parentId) {
      notifs.push({
        destinataireId: eleve.parentId,
        type:    maitrise ? 'qcm_maitrise' : 'qcm_resultat',
        titre:   `📋 Résultat de ${eleveNom}`,
        message: `${eleveNom} a obtenu ${score}% au QCM "${chapitreNom}"${maitrise ? ' — Maîtrisé ⭐' : ''}.`,
        eleveId,
        eleveNom,
        qcmId,
        chapitreId,
        chapitreNom,
        score,
      });
    }

    // Insérer toutes les notifications en une seule opération
    if (notifs.length > 0) {
      await Notification.insertMany(notifs);
    }
  } catch (e) {
    // Les notifications ne doivent jamais faire échouer la requête principale
    console.error('⚠️ Erreur notifications QCM:', e.message);
  }
};

module.exports = { notifierResultatQCM };
