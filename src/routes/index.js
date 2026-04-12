const authRouter         = require('./auth.routes');
const usersRouter        = require('./users.routes');
const matieresRouter     = require('./matieres.routes');
const chapitresRouter    = require('./chapitres.routes');
const leconsRouter       = require('./lecons.routes');
const exercicesRouter    = require('./exercices.routes');
const statsRouter        = require('./stats.routes');
const classesRouter      = require('./classes.routes');
const reservationsRouter = require('./reservations.routes');
const epreuvesRouter     = require('./epreuves.routes');
const qcmRouter           = require('./qcm.routes');
const notificationsRouter = require('./notifications.routes');

module.exports = {
  authRouter,
  usersRouter,
  matieresRouter,
  chapitresRouter,
  leconsRouter,
  exercicesRouter,
  statsRouter,
  classesRouter,
  reservationsRouter,
  epreuvesRouter,
  qcmRouter,
  notificationsRouter,
};
