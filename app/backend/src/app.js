import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from '../db/db.js';
import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000; // Definir um valor padrão caso PORT não esteja no .env

// middlewares
app.use(express.json());
app.use(cors());

// routes
const routesPath = path.resolve('./routes');
readdirSync(routesPath).forEach(async (file) => {
    const route = await import(pathToFileURL(path.join(routesPath, file)));
    app.use('/api/v1', route.default);
});

const server = () => {
    db(); // Chama a função de conexão com o banco
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta: ${PORT} ✅`);
    });
};

server();
