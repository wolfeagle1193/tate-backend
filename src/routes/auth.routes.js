// ============================================================
// src/routes/auth.routes.js
// ============================================================
const express = require('express');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const path    = require('path');
const User    = require('../models/User');
const { authJWT, limiterAuth, upload } = require('../middlewares');

const router = express.Router();

const genTokens = (userId) => ({
  accessToken:  jwt.sign({ id: userId }, process.env.JWT_SECRET,         { expiresIn: process.env.JWT_EXPIRES_IN }),
  refreshToken: jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }),
});

const ok  = (res, data, status = 200) => res.status(status).json({ success: true,  data });
const err = (res, msg,  status = 400) => res.status(status).json({ success: false, error: msg });

// ─── POST /api/auth/login ─────────────────────────────────
// Accepte email OU numéro de téléphone
router.post('/login', limiterAuth, async (req, res) => {
  try {
    const { email, telephone, password } = req.body;
    const identifiant = email || telephone;
    if (!identifiant || !password) return err(res, 'Email (ou téléphone) et mot de passe requis');

    // Cherche par email OU par téléphone
    const isPhone = telephone && !email;
    const user = await User.findOne(
      isPhone
        ? { telephone: telephone.trim() }
        : { email: identifiant.toLowerCase().trim() }
    );
    if (!user) return err(res, 'Email ou mot de passe incorrect', 401);
    if (!user.actif) return err(res, 'Compte désactivé', 401);
    if (user.statutCompte === 'en_attente')
      return err(res, 'Votre compte est en attente de validation par l\'administrateur. Vous serez notifié par email.', 403);
    if (user.statutCompte === 'rejete')
      return err(res, 'Votre candidature n\'a pas été retenue. Contactez l\'administrateur.', 403);
    if (!(await user.verifierMotDePasse(password)))
      return err(res, 'Email ou mot de passe incorrect', 401);

    const tokens = genTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    user.lastActivity = new Date();
    await user.save();

    ok(res, {
      accessToken:  tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id:            user._id,
        nom:           user.nom,
        email:         user.email,
        role:          user.role,
        niveau:        user.niveau,
        abonnement:    user.abonnement,
        abonnementExpiry: user.abonnementExpiry,
        statutCompte:  user.statutCompte,
      },
    });
  } catch (e) { err(res, e.message, 500); }
});

// ─── POST /api/auth/register/eleve ────────────────────────
router.post('/register/eleve', limiterAuth, async (req, res) => {
  try {
    const { nom, email, password, niveau, parentEmail } = req.body;

    if (!nom || !email || !password || !niveau)
      return err(res, 'Nom, email, mot de passe et niveau sont requis');
    if (password.length < 6)
      return err(res, 'Le mot de passe doit contenir au moins 6 caractères');

    const existe = await User.findOne({ email: email.toLowerCase().trim() });
    if (existe) return err(res, 'Un compte existe déjà avec cet email', 409);

    const eleve = await User.create({
      nom:         nom.trim(),
      email:       email.toLowerCase().trim(),
      passwordHash: password,
      role:        'eleve',
      niveau,
      parentEmail: parentEmail ? parentEmail.toLowerCase().trim() : null,
      abonnement:  'gratuit',
      statutCompte: 'actif',
    });

    // Auto-link parent si email fourni et compte parent existant
    if (parentEmail) {
      const parent = await User.findOne({ email: parentEmail.toLowerCase().trim(), role: 'parent' });
      if (parent) {
        eleve.parentId = parent._id;
        await eleve.save();
        if (!parent.enfants.includes(eleve._id)) {
          parent.enfants.push(eleve._id);
          await parent.save();
        }
      }
    }

    const tokens = genTokens(eleve._id);
    eleve.refreshToken = tokens.refreshToken;
    await eleve.save();

    ok(res, {
      accessToken:  tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { id: eleve._id, nom: eleve.nom, email: eleve.email, role: eleve.role, niveau: eleve.niveau, abonnement: eleve.abonnement },
    }, 201);
  } catch (e) { err(res, e.message, 500); }
});

// ─── POST /api/auth/register/parent ───────────────────────
router.post('/register/parent', limiterAuth, async (req, res) => {
  try {
    const { nom, email, password, enfantsEmails } = req.body;

    if (!nom || !email || !password)
      return err(res, 'Nom, email et mot de passe sont requis');
    if (password.length < 6)
      return err(res, 'Le mot de passe doit contenir au moins 6 caractères');

    const existe = await User.findOne({ email: email.toLowerCase().trim() });
    if (existe) return err(res, 'Un compte existe déjà avec cet email', 409);

    const parent = await User.create({
      nom:          nom.trim(),
      email:        email.toLowerCase().trim(),
      passwordHash: password,
      role:         'parent',
      statutCompte: 'actif',
    });

    // Auto-link enfants si emails fournis
    const emailsEnfants = Array.isArray(enfantsEmails)
      ? enfantsEmails
      : (enfantsEmails ? [enfantsEmails] : []);

    for (const emailEnfant of emailsEnfants) {
      const eleve = await User.findOne({ email: emailEnfant.toLowerCase().trim(), role: 'eleve' });
      if (eleve) {
        if (!parent.enfants.includes(eleve._id)) parent.enfants.push(eleve._id);
        eleve.parentId = parent._id;
        await eleve.save();
      }
    }
    await parent.save();

    // Aussi chercher élèves ayant mentionné l'email de ce parent
    const elevesLies = await User.find({ parentEmail: email.toLowerCase().trim(), role: 'eleve' });
    for (const eleve of elevesLies) {
      if (!parent.enfants.map(String).includes(String(eleve._id))) {
        parent.enfants.push(eleve._id);
        eleve.parentId = parent._id;
        await eleve.save();
      }
    }
    await parent.save();

    const tokens = genTokens(parent._id);
    parent.refreshToken = tokens.refreshToken;
    await parent.save();

    ok(res, {
      accessToken:  tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { id: parent._id, nom: parent.nom, email: parent.email, role: parent.role },
    }, 201);
  } catch (e) { err(res, e.message, 500); }
});

// ─── POST /api/auth/register/prof ─────────────────────────
// Avec upload de CV + diplômes (max 5 fichiers)
router.post('/register/prof',
  limiterAuth,
  upload.array('documents', 5),
  async (req, res) => {
    try {
      const { nom, email, password, matieresCodes, niveauxEnseignes, bioPro } = req.body;

      if (!nom || !email || !password)
        return err(res, 'Nom, email et mot de passe sont requis');
      if (password.length < 6)
        return err(res, 'Le mot de passe doit contenir au moins 6 caractères');

      const existe = await User.findOne({ email: email.toLowerCase().trim() });
      if (existe) return err(res, 'Un compte existe déjà avec cet email', 409);

      // Traiter les fichiers uploadés
      const docs = (req.files || []).map(f => ({
        nom:        f.originalname,
        chemin:     f.filename, // stocké dans /uploads/docs/
        typeDoc:    path.extname(f.originalname).toLowerCase().replace('.', ''),
        uploadedAt: new Date(),
      }));

      const matieres = Array.isArray(matieresCodes) ? matieresCodes : (matieresCodes ? [matieresCodes] : []);
      const niveaux  = Array.isArray(niveauxEnseignes) ? niveauxEnseignes : (niveauxEnseignes ? [niveauxEnseignes] : []);

      await User.create({
        nom:              nom.trim(),
        email:            email.toLowerCase().trim(),
        passwordHash:     password,
        role:             'prof',
        // Compte en attente jusqu'à validation admin
        statutCompte:     'en_attente',
        actif:            false, // ne peut pas se connecter avant validation
        matieresCodes:    matieres,
        niveauxEnseignes: niveaux,
        bioPro:           bioPro || '',
        documents:        docs,
      });

      ok(res, {
        message: 'Candidature reçue. L\'administrateur examinera votre dossier et vous contactera sous 48h.',
      }, 201);
    } catch (e) { err(res, e.message, 500); }
  }
);

// ─── POST /api/auth/refresh ───────────────────────────────
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return err(res, 'Refresh token manquant', 401);
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) return err(res, 'Token invalide', 401);
    const tokens = genTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    ok(res, tokens);
  } catch (e) { err(res, 'Token invalide ou expiré', 401); }
});

// ─── POST /api/auth/logout ────────────────────────────────
router.post('/logout', authJWT, async (req, res) => {
  req.user.refreshToken = null;
  await req.user.save();
  ok(res, { message: 'Déconnecté avec succès' });
});

module.exports = router;
