import { Router  } from "express";
const router = Router()
// Endpoint GET sencillo
router.get('/prueba', (req, res) => {
  console.log('Solicitud GET recibida en /prueba');
  res.send('¡Hola desde el endpoint GET de prueba muchachos!');
});

// Endpoint GET sencillo
router.get('/prueba-dos', (req, res) => {
    console.log('Solicitud GET recibida en /prueba-dos');
    res.send('¡Hola desde el endpoint GET de prueba numero dos muchachos!');
  });

export default router