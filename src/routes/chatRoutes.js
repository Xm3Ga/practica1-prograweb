const express = require('express');
const path = require('path');
const router = express.Router();

// Ruta para servir la página del chat
// La autenticación se verifica en el frontend y en Socket.IO
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'chat.html'));
});

module.exports = router;
