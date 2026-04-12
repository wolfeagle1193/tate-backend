// Vérifie que l'utilisateur connecté a le bon rôle
// Usage : roleCheck('admin') ou roleCheck('prof', 'admin')
const roleCheck = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Non authentifié' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error:   `Accès refusé. Rôle requis : ${roles.join(' ou ')}`,
    });
  }

  next();
};

module.exports = roleCheck;