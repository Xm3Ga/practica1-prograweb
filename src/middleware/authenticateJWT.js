const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = decoded;
    next();
  });
};

// Middleware para verificar si es administrador
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No tienes permisos de administrador' });
  }
  next();
};

module.exports = { authenticateJWT, isAdmin };
