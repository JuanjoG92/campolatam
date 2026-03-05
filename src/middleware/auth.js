const jwt = require('jsonwebtoken');
function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' });
  try {
    const d = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    req.userId = d.id; req.userRole = d.role; req.userEmail = d.email;
    next();
  } catch { return res.status(401).json({ error: 'Token inválido' }); }
}
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) return res.status(403).json({ error: 'Sin permiso' });
    next();
  };
}
module.exports = authMiddleware;
module.exports.requireRole = requireRole;
