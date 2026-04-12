const rateLimit = require('express-rate-limit');

// Limite globale — toutes les routes API
const limiterGlobal = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      200,
  message:  { success: false, error: 'Trop de requêtes, réessaie dans 15 minutes' },
  standardHeaders: true,
  legacyHeaders:   false,
});

// Limite appels Claude — protège les coûts API
const limiterClaude = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             60,
  message:         { success: false, error: "Limite d'appels IA atteinte, réessaie dans 1 heure" },
  standardHeaders: true,
  legacyHeaders:   false,
  validate:        { xForwardedForHeader: false },
});

// Limite connexion — anti brute force
const limiterAuth = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             10,
  message:         { success: false, error: 'Trop de tentatives de connexion' },
  standardHeaders: true,
  legacyHeaders:   false,
});

module.exports = { limiterGlobal, limiterClaude, limiterAuth };