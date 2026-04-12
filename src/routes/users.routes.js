const express = require('express');
const Joi     = require('joi');
const User    = require('../models/User');
const { authJWT, roleCheck, valider } = require('../middlewares') ;

const router = express.Router();
router.use(authJWT);

const ok  = (res, data, status = 200) => res.status(status).json({ success: true, data });
const err = (res, msg, status = 400)  => res.status(status).json({ success: false, error: msg });

const schemaUser = Joi.object({
  nom:         Joi.string().min(2).max(100).required(),
  email:       Joi.string().email().required(),
  password:    Joi.string().min(6).required(),
  role:        Joi.string().valid('prof','eleve','parent').required(),
  niveau:      Joi.string().valid('CM1','CM2','6eme','5eme','4eme','3eme').optional(),
  classeId:    Joi.string().optional(),
  parentEmail: Joi.string().email().optional(),
});

// POST /api/users
router.post('/', roleCheck('admin'), valider(schemaUser), async (req, res) => {
  try {
    const { nom, email, password, role, niveau, classeId, parentEmail } = req.body;
    const existe = await User.findOne({ email });
    if (existe) return err(res, 'Email déjà utilisé');
    const user = await User.create({ nom, email, passwordHash: password, role, niveau, classeId });
    if (role === 'eleve' && parentEmail) {
      const parent = await User.findOne({ email: parentEmail, role: 'parent' });
      if (parent) {
        user.parentId = parent._id;
        parent.enfants.push(user._id);
        await Promise.all([user.save(), parent.save()]);
      }
    }
    ok(res, { id: user._id, nom: user.nom, email: user.email, role: user.role }, 201);
  } catch (e) { err(res, e.message, 500); }
});

// GET /api/users
router.get('/', roleCheck('admin','prof'), async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash -refreshToken').sort({ createdAt: -1 });
    ok(res, users);
  } catch (e) { err(res, e.message, 500); }
});

// PUT /api/users/:id
router.put('/:id', roleCheck('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .select('-passwordHash -refreshToken');
    ok(res, user);
  } catch (e) { err(res, e.message, 500); }
});

// PATCH /api/users/:id — mise à jour partielle (validation prof, abonnement, etc.)
router.patch('/:id', roleCheck('admin'), async (req, res) => {
  try {
    const champs = ['statutCompte','actif','noteAdmin','abonnement','abonnementExpiry',
                    'matieresCodes','niveauxEnseignes','nom','niveau'];
    const update = {};
    for (const c of champs) {
      if (req.body[c] !== undefined) update[c] = req.body[c];
    }
    const user = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true })
      .select('-passwordHash -refreshToken');
    if (!user) return err(res, 'Utilisateur introuvable', 404);
    ok(res, user);
  } catch (e) { err(res, e.message, 500); }
});

// ── POST /api/users/souscrire ────────────────────────────────
// L'élève initie son abonnement (2 000 FCFA/mois)
// Génère une référence de paiement + instructions Wave / Orange Money
router.post('/souscrire', async (req, res) => {
  try {
    if (req.user.role !== 'eleve') return err(res, 'Réservé aux élèves');
    const { methode } = req.body; // 'wave' | 'orange_money'
    if (!['wave','orange_money'].includes(methode)) return err(res, 'Méthode invalide (wave ou orange_money)');

    // Déjà premium actif ?
    const user = await User.findById(req.user._id);
    if (user.abonnement === 'premium' && user.abonnementExpiry > new Date()) {
      return err(res, 'Tu as déjà un abonnement premium actif');
    }

    // Générer une référence unique
    const code = Math.random().toString(36).slice(2,6).toUpperCase();
    const reference = `TATE-SUB-${Date.now()}-${code}`;
    const montant   = 2000;

    user.abonnementPending = { reference, methode, montant, initieAt: new Date() };
    await user.save();

    // Instructions de paiement selon la méthode
    const instructions = methode === 'wave'
      ? {
          titre:  'Paiement Wave',
          numero: '+221 77 000 00 00', // → remplacer par le vrai numéro Wave de la plateforme
          etapes: [
            'Ouvre ton application Wave',
            `Envoie ${montant} FCFA au numéro +221 77 000 00 00`,
            `Mets en référence : ${reference}`,
            'Clique sur "J\'ai payé" ci-dessous',
          ],
        }
      : {
          titre:  'Paiement Orange Money',
          numero: '+221 78 000 00 00', // → remplacer par le vrai numéro OM de la plateforme
          etapes: [
            'Compose le #144# sur ton téléphone',
            `Transfère ${montant} FCFA au +221 78 000 00 00`,
            `Mets en description : ${reference}`,
            'Clique sur "J\'ai payé" ci-dessous',
          ],
        };

    ok(res, { reference, montant, methode, instructions });
  } catch (e) { err(res, e.message, 500); }
});

// ── POST /api/users/confirmer-paiement ──────────────────────
// L'élève signale qu'il a payé → passe en "attente validation admin"
router.post('/confirmer-paiement', async (req, res) => {
  try {
    if (req.user.role !== 'eleve') return err(res, 'Réservé aux élèves');
    const user = await User.findById(req.user._id);
    if (!user.abonnementPending?.reference) {
      return err(res, 'Aucun paiement initié. Lance d\'abord la souscription.');
    }
    // On laisse le pending en place — l'admin validera
    ok(res, {
      message: 'Merci ! Ton paiement est en cours de vérification. Tu recevras l\'accès premium dans les 24h.',
      reference: user.abonnementPending.reference,
    });
  } catch (e) { err(res, e.message, 500); }
});

// ── POST /api/users/:id/valider-abonnement ──────────────────
// Admin confirme le paiement et active le premium (30 jours)
router.post('/:id/valider-abonnement', roleCheck('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return err(res, 'Utilisateur introuvable', 404);

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30); // +30 jours

    user.abonnement       = 'premium';
    user.abonnementExpiry = expiry;
    user.abonnementPending = { reference: null, methode: null, montant: 2000, initieAt: null };
    await user.save();

    ok(res, {
      message: `Abonnement premium activé pour ${user.nom} jusqu'au ${expiry.toLocaleDateString('fr-FR')}`,
      abonnement: 'premium',
      abonnementExpiry: expiry,
    });
  } catch (e) { err(res, e.message, 500); }
});

// GET /api/users/abonnements-en-attente — liste des paiements en attente (admin)
router.get('/abonnements-en-attente', roleCheck('admin'), async (req, res) => {
  try {
    const users = await User.find({
      'abonnementPending.reference': { $ne: null },
    }).select('nom email niveau abonnement abonnementPending createdAt');
    ok(res, users);
  } catch (e) { err(res, e.message, 500); }
});

// GET /api/users/profs/matiere/:code — profs disponibles pour une matière (tous les rôles connectés)
router.get('/profs/matiere/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const profs = await User.find({
      role:          'prof',
      actif:         true,
      statutCompte:  'actif',
      matieresCodes: code,
    })
    .select('nom bioPro matieresCodes niveauxEnseignes')
    .sort({ nom: 1 })
    .limit(10);
    ok(res, profs);
  } catch (e) { err(res, e.message, 500); }
});

// GET /api/users/:id/progression
router.get('/:id/progression', async (req, res) => {
  try {
    const eleve = await User.findById(req.params.id)
      .populate('chapitresValides.chapitreId', 'titre niveau matiereId')
      .select('nom niveau chapitresValides badges streak lastActivity');
    if (!eleve) return err(res, 'Élève introuvable', 404);
    ok(res, eleve);
  } catch (e) { err(res, e.message, 500); }
});

// ── POST /api/users/:eleveId/lier-parent ─────────────────────────
// Admin lie un parent existant à un élève, ou crée + lie un nouveau parent
router.post('/:eleveId/lier-parent', roleCheck('admin'), async (req, res) => {
  try {
    const eleve = await User.findById(req.params.eleveId);
    if (!eleve || eleve.role !== 'eleve') return err(res, 'Élève introuvable', 404);

    const { parentId, nomParent, emailParent, telephoneParent } = req.body;
    let parent;

    if (parentId) {
      // Lier à un parent existant
      parent = await User.findById(parentId);
      if (!parent || parent.role !== 'parent') return err(res, 'Parent introuvable', 404);
    } else if (emailParent) {
      // Chercher ou créer le parent
      parent = await User.findOne({ email: emailParent.toLowerCase().trim(), role: 'parent' });
      if (!parent) {
        if (!nomParent) return err(res, 'Nom du parent requis pour créer un compte parent');
        const motDePasse = `Tate${Math.random().toString(36).slice(2,8)}!`; // mot de passe temporaire
        parent = await User.create({
          nom:          nomParent,
          email:        emailParent.toLowerCase().trim(),
          telephone:    telephoneParent || undefined,
          passwordHash: motDePasse,
          role:         'parent',
        });
      }
    } else {
      return err(res, 'Fournis parentId ou emailParent');
    }

    // Retirer l'ancien parent si différent
    if (eleve.parentId && eleve.parentId.toString() !== parent._id.toString()) {
      await User.findByIdAndUpdate(eleve.parentId, { $pull: { enfants: eleve._id } });
    }

    // Lier
    eleve.parentId    = parent._id;
    eleve.parentEmail = parent.email;
    if (!parent.enfants.includes(eleve._id)) {
      parent.enfants.push(eleve._id);
    }
    await Promise.all([eleve.save(), parent.save()]);

    ok(res, {
      message: `Parent "${parent.nom}" lié à l'élève "${eleve.nom}"`,
      parent:  { _id: parent._id, nom: parent.nom, email: parent.email },
      eleve:   { _id: eleve._id,  nom: eleve.nom,  email: eleve.email },
    });
  } catch (e) { err(res, e.message, 500); }
});

module.exports = router;