const { genererResumeCours, preparerCoursProfesseur } = require('./claude.cours');
const { genererQuestions, verifierComprehension, evaluerProgression } = require('./claude.exercices');
const { corrigerReponse, analyserLacunes }            = require('./claude.correction');

module.exports = {
  genererResumeCours,
  preparerCoursProfesseur,
  genererQuestions,
  verifierComprehension,
  evaluerProgression,
  corrigerReponse,
  analyserLacunes,
};
