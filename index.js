const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Função para ler o arquivo JSON e retornar as ofertas
function getOffers(callback) {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            callback(null, jsonData.offers);
        } catch (error) {
            callback(error, null);
        }
    });
}

// Rota para listar todas as ofertas
app.get('/offers', (req, res) => {
    getOffers((err, offers) => {
        if (err) {
            res.status(500).send('Erro ao ler as ofertas');
        } else {
            res.json(offers);
        }
    });
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
