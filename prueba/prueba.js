const express = require('express');
const router = express.Router();

// Endpoint GET sencillo
router.get('/', (req, res) => {
  console.log('Solicitud GET recibida en /prueba');
  res.send('¡Hola desde el endpoint GET de prueba muchachos!');
});

module.exports = router;
