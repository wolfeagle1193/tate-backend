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

connectDB();

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
