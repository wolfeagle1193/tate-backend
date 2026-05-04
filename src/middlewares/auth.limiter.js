const rateLimit = require('express-rate-limit');

// Limite globale — désactivée pour une application éducative
// (les élèves ne doivent jamais être bloqués par des limites de requêtes)
const limiterGlobal = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      100000, // pratiquement illimité
  standardHeaders: true,
  legacyHeaders:   false,
  skip: () => true, // désactivé complètement
});

// Limite appels Claude — protège les coûts API (seule limite conservée)
const limiterClaude = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             60,
  message:         { success: false, error: "Limite d'appels IA atteinte, réessaie dans 1 heure" },
  standardHeaders: true,
  legacyHeaders:   false,
  validate:        { xForwardedForHeader: false },
});

// Limite connexion — désactivée (application éducative, pas de brute force à craindre)
const limiterAuth = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             100000,
  standardHeaders: true,
  legacyHeaders:   false,
  skip: () => true, // désactivé complètement
});

module.exports = { limiterGlobal, limiterClaude, limiterAuth };