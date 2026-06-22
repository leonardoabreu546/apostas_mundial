import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function iniciarBaseDados() {
    const db = await open({
        filename:'./mundial.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS equipas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            grupo TEXT NOT NULL,
            bandeira TEXT NOT NULL,
            likes INTEGER DEFAULT 0
        );
    `);

    console.log("Base de dados pronta e tabela de equipas criada!");
}

iniciarBaseDados();