const express = require('express');
const app = express();
const offerRoutes = require('./routes/offers');

// Middleware para servir arquivos estáticos
app.use(express.static('views'));

// Configurar rota
app.use('/offers', offerRoutes);

// Inicializar servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
