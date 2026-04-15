const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./src/models');
const { authenticateToken } = require('./src/middleware/authMiddleware');
const errorHandler = require('./src/middleware/errorHandler');

app.use(cors());
app.use(express.json());

// Importar rutas
//rutas de autenticación (sin protección)
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

// Middleware: Requerir autenticación para todas las rutas de negocio
app.use(authenticateToken);

//rutas de clientes
const clientRoutes = require('./src/routes/clientRoutes');
app.use('/api/clients', clientRoutes);

//rutas de motos
const motorcycleRoutes = require('./src/routes/motorcycleRoutes');
app.use('/api/motorcycles', motorcycleRoutes);

//rutas de ordenes
const orderRoutes = require('./src/routes/orderRoutes');
app.use('/api/work-orders', orderRoutes);

//ruta de items
const itemRoutes = require('./src/routes/itemRoutes');
app.use('/api/work-orders/:id/items', itemRoutes);

//manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Sincronizar modelos y levantar servidor
db.sequelize.authenticate().then(() => {
  console.log('Base de datos conectada');
  app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
});