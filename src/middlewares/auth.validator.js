const Joi = require('joi');

// Middleware générique de validation Joi
// Usage : valider(monSchema) comme middleware de route
const valider = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      error:   'Données invalides',
      details: messages,
    });
  }

  next();
};

// Schémas Joi réutilisables
const schemas = {
  login: Joi.object({
    email:    Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  creerUser: Joi.object({
    nom:         Joi.string().min(2).max(100).required(),
    email:       Joi.string().email().required(),
    password:    Joi.string().min(6).required(),
    role:        Joi.string().valid('prof', 'eleve', 'parent').required(),
    niveau:      Joi.string().valid('CM1','CM2','6eme','5eme','4eme','3eme').optional(),
    classeId:    Joi.string().optional(),
    parentEmail: Joi.string().email().optional(),
  }),

  creerChapitre: Joi.object({
    matiereId:        Joi.string().required(),
    titre:            Joi.string().min(2).max(200).required(),
    niveau:           Joi.string().valid('CM1','CM2','6eme','5eme','4eme','3eme').required(),
    objectif:         Joi.string().required(),
    ordre:            Joi.number().optional(),
    promptSupplement: Joi.string().optional().allow(''),
    prerequis:        Joi.string().optional().allow('', null),
  }),

  preparerLecon: Joi.object({
    chapitreId:    Joi.string().required(),
    contenuBrut:   Joi.string().optional().allow(''),
    formStructure: Joi.object().optional(),
  }),

  demarrerExercice: Joi.object({
    chapitreId: Joi.string().required(),
  }),

  corrigerReponse: Joi.object({
    sessionId:       Joi.string().required(),
    question:        Joi.string().required(),
    reponseEleve:    Joi.string().required().allow(''),
    reponseAttendue: Joi.string().required(),
    questionNum:     Joi.number().optional(),
  }),
};

module.exports = { valider, schemas };