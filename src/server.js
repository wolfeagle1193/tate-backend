require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const path      = require('path');
const connectDB = require('./db/connect');
const { limiterGlobal } = require('./middlewares');

const {
  authRouter, usersRouter, matieresRouter, chapitresRouter,
  leconsRouter, exercicesRouter, statsRouter, classesRouter,
  reservationsRouter, epreuvesRouter, qcmRouter, notificationsRouter,
} = require('./routes');
const resultatsRouter         = require('./routes/resultats.routes');
const sessionsVirtuellesRouter = require('./routes/sessions-virtuelles.routes');

// ── Auto-seed : crée admin + matières au premier démarrage ──
const autoSeed = async () => {
  try {
    const User    = require('./models/User');
    const Matiere = require('./models/Matiere');

    // Admin
    const adminExiste = await User.findOne({ role: 'admin' });
    if (!adminExiste) {
      await User.create({
        nom:          process.env.ADMIN_NOM    || 'Administrateur Taté',
        email:        process.env.ADMIN_EMAIL  || 'admin@tate.sn',
        passwordHash: process.env.ADMIN_PASSWORD || 'TateAdmin2024!',
        role:         'admin',
        actif:        true,
        statutCompte: 'actif',
      });
      console.log('✅ Compte admin créé automatiquement');
    }

    // Matières de base
    const NIVEAUX = ['CM1','CM2','6eme','5eme','4eme','3eme','Seconde','Premiere','Terminale'];
    const matieres = [
      { nom: 'Français',        code: 'FR', niveaux: NIVEAUX, icone: '📖', couleur: '#F4A847', ordre: 1 },
      { nom: 'Mathématiques',   code: 'MA', niveaux: NIVEAUX, icone: '📐', couleur: '#534AB7', ordre: 2 },
      { nom: 'Anglais',         code: 'AN', niveaux: NIVEAUX, icone: '🇬🇧', couleur: '#1D9E75', ordre: 3 },
      { nom: 'Histoire',        code: 'HI', niveaux: NIVEAUX, icone: '🏛️', couleur: '#D85A30', ordre: 4 },
      { nom: 'Géographie',      code: 'GE', niveaux: NIVEAUX, icone: '🌍', couleur: '#0EA5E9', ordre: 5 },
      { nom: 'Sciences',        code: 'SC', niveaux: NIVEAUX, icone: '🔬', couleur: '#7C3AED', ordre: 6 },
      { nom: 'Physique-Chimie', code: 'PC', niveaux: NIVEAUX, icone: '⚗️', couleur: '#0891B2', ordre: 7 },
      { nom: 'SVT',             code: 'SV', niveaux: NIVEAUX, icone: '🌿', couleur: '#16A34A', ordre: 8 },
      { nom: 'Philosophie',     code: 'PH', niveaux: ['Premiere','Terminale'], icone: '💭', couleur: '#9333EA', ordre: 9 },
    ];
    for (const m of matieres) {
      await Matiere.findOneAndUpdate({ code: m.code }, m, { upsert: true, new: true });
    }
    console.log('✅ Matières initialisées');
  } catch (e) {
    console.error('⚠️  Auto-seed erreur:', e.message);
  }
};

connectDB().then(autoSeed).catch(() => {});

const app = express();

app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? [
          process.env.FRONTEND_URL,
          'https://tate.sn',
          'https://www.tate.sn',
        ].filter(Boolean)
      : ['http://localhost:3000', 'http://localhost:5173'];

    // Accepter aussi les previews Vercel (*.vercel.app)
    const isVercelPreview = /https:\/\/tate(-[a-z0-9-]+)?\.vercel\.app$/.test(origin);

    if (allowedOrigins.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqué pour : ${origin}`));
    }
  },
  credentials: true,
}));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use('/api', limiterGlobal);

app.use('/api/auth',         authRouter);
app.use('/api/users',        usersRouter);
app.use('/api/matieres',     matieresRouter);
app.use('/api/chapitres',    chapitresRouter);
app.use('/api/classes',      classesRouter);
app.use('/api/lecons',       leconsRouter);
app.use('/api/exercices',    exercicesRouter);
app.use('/api/stats',        statsRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/epreuves',     epreuvesRouter);
app.use('/api/qcm',           qcmRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/resultats',            resultatsRouter);
app.use('/api/sessions-virtuelles', sessionsVirtuellesRouter);

// Servir les fichiers uploadés (CV, diplômes des profs)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Taté API en ligne 🎓', version: '3.0.0' });
});

app.use('/{*path}', (req, res) => {
  res.status(404).json({ success: false, error: 'Route introuvable' });
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.message);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur serveur',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Taté API v3 démarrée sur le port ${PORT}`);
  console.log(`📚 Environnement : ${process.env.NODE_ENV}`);
});
