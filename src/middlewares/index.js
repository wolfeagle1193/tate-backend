const authJWT                              = require('./auth.jwt');
const roleCheck                            = require('./auth.roles');
const { limiterGlobal, limiterClaude, limiterAuth } = require('./auth.limiter');
const { valider, schemas }                 = require('./auth.validator');
const upload                               = require('./upload');

module.exports = {
  authJWT,
  roleCheck,
  limiterGlobal,
  limiterClaude,
  limiterAuth,
  valider,
  schemas,
  upload,
};