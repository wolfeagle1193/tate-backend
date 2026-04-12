const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Vérifie le token JWT à chaque requête protégée
const authJWT = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token manquant' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash -refreshToken');

    if (!user || !user.actif) {
      return res.status(401).json({ success: false, error: 'Utilisateur introuvable ou inactif' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expiré', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, error: 'Token invalide' });
  }
};

module.exports = authJWT;