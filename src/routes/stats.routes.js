
// ============================================================
// src/routes/stats.routes.js
// ============================================================
const expressS  = require('express');
const User2     = require('../models/User');
const Session2  = require('../models/Session');
const Chapitre2 = require('../models/Chapitre');
const Matiere2  = require('../models/Matiere');
const { authJWT: ajwtS, roleCheck: rcS } = require('../middlewares');

const routerS = expressS.Router();
routerS.use(ajwtS);

const okS  = (res, d, s=200) => res.status(s).json({ success:true,  data:d });
const errS = (res, m, s=400) => res.status(s).json({ success:false, error:m });

// ─── /api/stats/admin ─────────────────────────────────────────
routerS.get('/admin', rcS('admin'), async (req, res) => {
  try {
    const now     = new Date();
    const il7j    = new Date(now - 7  * 24*3600*1000);
    const il30j   = new Date(now - 30 * 24*3600*1000);

    /* ── comptages de base ── */
    const [totalEleves, totalProfs, totalSessions, sessionsReussies, sessionsAujourd] =
      await Promise.all([
        User2.countDocuments({ role:'eleve', actif:true }),
        User2.countDocuments({ role:'prof',  actif:true }),
        Session2.countDocuments(),
        Session2.countDocuments({ maitrise:true }),
        Session2.countDocuments({ startedAt:{ $gte: new Date(new Date().setHours(0,0,0,0)) } }),
      ]);

    /* ── élèves par niveau ── */
    const elevesParNiveau = await User2.aggregate([
      { $match: { role:'eleve', actif:true } },
      { $group: { _id:'$niveau', count:{ $sum:1 } } },
      { $sort:  { _id:1 } },
    ]);

    /* ── sessions des 7 derniers jours (par jour) ── */
    const sessionsParJour = await Session2.aggregate([
      { $match: { startedAt:{ $gte: il7j } } },
      { $group: {
          _id: { $dateToString: { format:'%Y-%m-%d', date:'$startedAt' } },
          total:     { $sum:1 },
          reussies:  { $sum:{ $cond:['$maitrise', 1, 0] } },
      }},
      { $sort: { _id:1 } },
    ]);

    /* ── top 5 chapitres (plus travaillés) ── */
    const topChapitres = await Session2.aggregate([
      { $group: {
          _id:    '$chapitreId',
          total:  { $sum:1 },
          maitrises: { $sum:{ $cond:['$maitrise', 1, 0] } },
      }},
      { $sort:  { total:-1 } },
      { $limit: 5 },
      { $lookup: { from:'chapitres', localField:'_id', foreignField:'_id', as:'chapitre' } },
      { $unwind: { path:'$chapitre', preserveNullAndEmptyArrays:true } },
      { $project: {
          titre:     { $ifNull:['$chapitre.titre', 'Chapitre supprimé'] },
          niveau:    '$chapitre.niveau',
          total:     1,
          maitrises: 1,
          tauxPct:   { $cond:[ { $gt:['$total',0] },
            { $round:[ { $multiply:[ { $divide:['$maitrises','$total'] }, 100 ] }, 0 ] },
            0
          ]},
      }},
    ]);

    /* ── top 5 élèves (plus de séries terminées) ── */
    const topEleves = await Session2.aggregate([
      { $match: { statut:'terminee' } },
      { $group: {
          _id:      '$eleveId',
          sessions: { $sum:1 },
          maitrises:{ $sum:{ $cond:['$maitrise', 1, 0] } },
      }},
      { $sort: { maitrises:-1, sessions:-1 } },
      { $limit: 5 },
      { $lookup: { from:'users', localField:'_id', foreignField:'_id', as:'eleve' } },
      { $unwind: { path:'$eleve', preserveNullAndEmptyArrays:true } },
      { $project: {
          nom:      { $ifNull:['$eleve.nom', 'Élève inconnu'] },
          niveau:   '$eleve.niveau',
          sessions: 1,
          maitrises:1,
      }},
    ]);

    /* ── activité langues (30j) ── */
    const activiteLangues = await Session2.aggregate([
      { $match: { startedAt:{ $gte: il30j } } },
      { $lookup: { from:'chapitres', localField:'chapitreId', foreignField:'_id', as:'chap' } },
      { $unwind: { path:'$chap', preserveNullAndEmptyArrays:true } },
      { $lookup: { from:'matieres', localField:'chap.matiereId', foreignField:'_id', as:'mat' } },
      { $unwind: { path:'$mat', preserveNullAndEmptyArrays:true } },
      { $match:  { 'mat.estLangue': true } },
      { $group: {
          _id:   '$mat.nom',
          code:  { $first:'$mat.code' },
          total: { $sum:1 },
      }},
      { $sort: { total:-1 } },
    ]);

    /* ── sessions récentes (10 dernières) ── */
    const sessionsRecentes = await Session2.find({ statut:'terminee' })
      .sort({ completedAt:-1 })
      .limit(10)
      .populate('eleveId',    'nom niveau')
      .populate('chapitreId', 'titre niveau')
      .lean();

    /* ── nouveaux élèves ce mois ── */
    const nouveauxEleves = await User2.countDocuments({
      role:'eleve', actif:true, createdAt:{ $gte: il30j },
    });

    okS(res, {
      /* résumé */
      totalEleves,
      totalProfs,
      totalSessions,
      sessionsReussies,
      sessionsAujourd,
      nouveauxEleves,
      tauxReussite: totalSessions > 0
        ? Math.round((sessionsReussies / totalSessions) * 100)
        : 0,
      /* détails */
      elevesParNiveau,
      sessionsParJour,
      topChapitres,
      topEleves,
      activiteLangues,
      sessionsRecentes: sessionsRecentes.map(s => ({
        eleveNom:     s.eleveId?.nom    || 'Inconnu',
        eleveNiveau:  s.eleveId?.niveau || '—',
        chapitreNom:  s.chapitreId?.titre || 'Chapitre supprimé',
        maitrise:     s.maitrise,
        scorePct:     s.scorePct,
        completedAt:  s.completedAt,
      })),
    });
  } catch (e) {
    console.error('[stats/admin]', e);
    errS(res, e.message, 500);
  }
});

// ─── /api/stats/eleve/:id ─────────────────────────────────────
routerS.get('/eleve/:id', async (req, res) => {
  try {
    const eleveId = req.params.id;

    const [sessions, chapitresValides] = await Promise.all([
      Session2.find({ eleveId, statut:'terminee' })
        .populate('chapitreId','titre niveau')
        .sort({ completedAt:-1 })
        .limit(20)
        .lean(),
      Session2.countDocuments({ eleveId, maitrise:true }),
    ]);

    const total = sessions.length;
    const reussies = sessions.filter(s => s.maitrise).length;

    okS(res, {
      sessions,
      chapitresValides,
      totalSessions:   total,
      tauxReussite:    total > 0 ? Math.round((reussies/total)*100) : 0,
    });
  } catch (e) { errS(res, e.message, 500); }
});

// ─── /api/stats/tous-eleves ───────────────────────────────────
// Retourne tous les élèves avec leurs stats globales + détail par chapitre
// Accessible : admin (tous les élèves) + prof (ses propres élèves via param ?classeId=)
routerS.get('/tous-eleves', rcS('admin','prof'), async (req, res) => {
  try {
    // Récupérer tous les élèves actifs
    const eleves = await User2.find({ role:'eleve', actif:true })
      .select('nom email niveau classe streak lastActivity createdAt')
      .lean();

    if (eleves.length === 0) return okS(res, []);

    const eleveIds = eleves.map(e => e._id);

    // Agréger les sessions par élève
    const statsParEleve = await Session2.aggregate([
      { $match: { eleveId: { $in: eleveIds }, statut:'terminee' } },
      { $group: {
          _id:         '$eleveId',
          totalSessions: { $sum: 1 },
          maitrises:     { $sum: { $cond: ['$maitrise', 1, 0] } },
          scoreMoyen:    { $avg: '$scorePct' },
          dernierAt:     { $max: '$completedAt' },
          premierAt:     { $min: '$startedAt' },
      }},
    ]);

    // Détail des sessions par élève (pour le modal)
    const sessionsDetaillees = await Session2.aggregate([
      { $match: { eleveId: { $in: eleveIds }, statut:'terminee' } },
      { $sort: { completedAt: -1 } },
      { $group: {
          _id: '$eleveId',
          sessions: { $push: {
            chapitreId:  '$chapitreId',
            scorePct:    '$scorePct',
            maitrise:    '$maitrise',
            tentative:   '$tentative',
            completedAt: '$completedAt',
          }},
      }},
    ]);

    // Résoudre les IDs de chapitres
    const chapIds = [...new Set(
      sessionsDetaillees.flatMap(s => s.sessions.map(sess => sess.chapitreId?.toString()))
        .filter(Boolean)
    )];
    const chapMap = {};
    if (chapIds.length > 0) {
      const chaps = await Chapitre2.find({ _id: { $in: chapIds } })
        .select('titre niveau').lean();
      chaps.forEach(c => { chapMap[c._id.toString()] = c; });
    }

    // Construire index rapide
    const statsIdx    = {};
    statsParEleve.forEach(s => { statsIdx[s._id.toString()] = s; });
    const sessionsIdx = {};
    sessionsDetaillees.forEach(s => { sessionsIdx[s._id.toString()] = s.sessions; });

    // Assembler la réponse
    const result = eleves.map(eleve => {
      const id    = eleve._id.toString();
      const stats = statsIdx[id] || {};
      const sessions = (sessionsIdx[id] || []).slice(0, 30).map(s => ({
        ...s,
        chapitreTitre:  chapMap[s.chapitreId?.toString()]?.titre  || 'Chapitre inconnu',
        chapitreNiveau: chapMap[s.chapitreId?.toString()]?.niveau || '—',
      }));

      // Chapitres en difficulté = testés mais jamais maîtrisés
      const chapStats = {};
      sessions.forEach(s => {
        const cid = s.chapitreId?.toString();
        if (!cid) return;
        if (!chapStats[cid]) {
          chapStats[cid] = { titre: s.chapitreTitre, niveau: s.chapitreNiveau, scores: [], maitrise: false };
        }
        chapStats[cid].scores.push(s.scorePct);
        if (s.maitrise) chapStats[cid].maitrise = true;
      });

      const chapitresEnDifficulte = Object.values(chapStats)
        .filter(c => !c.maitrise && c.scores.length > 0)
        .map(c => ({ ...c, moyennePct: Math.round(c.scores.reduce((a,b)=>a+b,0)/c.scores.length) }))
        .sort((a,b) => a.moyennePct - b.moyennePct)
        .slice(0, 5);

      const chapitresMaitrises = Object.values(chapStats)
        .filter(c => c.maitrise)
        .map(c => ({ titre: c.titre, niveau: c.niveau }));

      return {
        _id:          eleve._id,
        nom:          eleve.nom,
        email:        eleve.email,
        niveau:       eleve.niveau,
        streak:       eleve.streak || 0,
        lastActivity:       eleve.lastActivity || eleve.createdAt,
        derniereConnexion:  eleve.lastActivity || eleve.createdAt,
        totalSessions:      stats.totalSessions || 0,
        maitrises:          stats.maitrises     || 0,
        scoreMoyen:         stats.scoreMoyen ? Math.round(stats.scoreMoyen) : null,
        // dernierAt = sessions uniquement (ne pas mélanger avec lastActivity)
        dernierAt:          stats.dernierAt ? new Date(stats.dernierAt) : null,
        sessions,
        chapitresEnDifficulte,
        chapitresMaitrises,
      };
    });

    // Tri : élèves les plus actifs en premier
    result.sort((a, b) => b.totalSessions - a.totalSessions);

    okS(res, result);
  } catch (e) {
    console.error('[stats/tous-eleves]', e);
    errS(res, e.message, 500);
  }
});

// ─── /api/stats/parent ────────────────────────────────────────
routerS.get('/parent', rcS('parent'), async (req, res) => {
  try {
    const parent = await User2.findById(req.user._id)
      .populate('enfants','nom niveau chapitresValides badges streak lastActivity');
    okS(res, parent?.enfants || []);
  } catch (e) { errS(res, e.message, 500); }
});

module.exports = routerS;
