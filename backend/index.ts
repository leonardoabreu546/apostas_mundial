import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function iniciarBaseDados() {
    const db = await open({
        filename:'./mundial.db',
        driver: sqlite3.Database
    });

    // 🌟 Ativar o suporte a Foreign Keys no SQLite
    await db.exec('PRAGMA foreign_keys = ON;');

    await db.exec(`
        CREATE TABLE IF NOT EXISTS equipas (
        id_equipa INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            grupo TEXT NOT NULL,
            bandeira TEXT NOT NULL,
            likes INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS jogos (
            id_jogo INTEGER PRIMARY KEY AUTOINCREMENT,
            equipa1_id INTEGER NOT NULL,
            equipa2_id INTEGER NOT NULL,
            data_hora TEXT NOT NULL,
            FOREIGN KEY (equipa1_id) REFERENCES equipas(id_equipa),
            FOREIGN KEY (equipa2_id) REFERENCES equipas(id_equipa)
            );

        CREATE TABLE IF NOT EXISTS apostas(
            id_aposta INTEGER PRIMARY KEY AUTOINCREMENT,
            id_jogo INTEGER NOT NULL,
            equipa1_golos INTEGER NOT NULL,
            equipa2_golos INTEGER NOT NULL,
            FOREIGN KEY (id_jogo) REFERENCES jogos(id_jogo)
        );
    `);

    await db.run(`
        INSERT OR IGNORE INTO equipas (nome, grupo, bandeira) VALUES
    ('Portugal', 'H', 'portugal.png'), 
    ('Brasil', 'G', 'brasil.png'), 
    ('Brasil', 'G', 'brasil.png'),('França', 'D', 'franca.png');
    `);
    
    console.log("Base de dados pronta e tabela de equipas criada!");
}

iniciarBaseDados();