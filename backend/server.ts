import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3000;

async function ligarBD() {
    return open({
        filename: "./mundial.db",
        driver: sqlite3.Database,
    });
}

app.use(express.json());

app.get ("/equipas", async (req, res) => {
    try {
        const db = await ligarBD();
        const equipas = await db.all("SELECT * FROM equipas");
        res.json(equipas);
    } catch (error) {
        res.status(500).json({ error: "Erro ao ligar à base de dados" });
    }
});

app.get("/jogos", async (req, res) => {
    try {
        const db = await ligarBD();
        const jogos = await db.all(`
            SELECT
                jogos.id_jogo,
                jogos.data_hora,
                jogos.equipa1_golos,
                jogos.equipa2_golos,
                e1.nome AS equipa1_nome,
                e2.nome AS equipa2_nome,
                e1.bandeira AS equipa1_bandeira,
                e2.bandeira AS equipa2_bandeira
            FROM jogos
            INNER JOIN equipas AS e1 ON jogos.equipa1_id = e1.id_equipa
            INNER JOIN equipas AS e2 ON jogos.equipa2_id = e2.id_equipa
        `);
        res.json(jogos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao procurar os jogos" });
    }
});

app.post("/apostas", async (req, res) => {
    const { id_utilizador, id_jogo, equipa1_golos, equipa2_golos } = req.body;

    try {
        const db = await ligarBD();

        await db.run(
            "INSERT INTO apostas (id_utilizador, id_jogo, equipa1_golos, equipa2_golos) VALUES (?, ?, ?, ?)",
            [id_utilizador, id_jogo, equipa1_golos, equipa2_golos]
        );

        res.status(201).json({ message: "Aposta registada com sucesso" });
    } catch (error: any) {
        console.log("ERRO REAL NA APOSTA:", error); // 👈 Adiciona isto aqui!

        if (error.message?.includes("FOREIGN KEY constraint failed")) {
            res.status(400).json({ error: "O utilizador indicado não existe" });
            return;
        }
        
        res.status(500).json({ error: "Erro ao registar a aposta" });
    }
});

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.post("/utilizadores", async (req, res) => {
    const { nome, email } = req.body;
    try {
        const db = await ligarBD();
        await db.run(
            "INSERT INTO utilizadores (nome, email) VALUES (?, ?)",
            [nome, email]
        );
        res.status(201).json({ message: "Utilizador registado com sucesso" });
    } catch (error: any) {
        if (error.message?.includes("UNIQUE constraint failed")) {
            res.status(400).json({ error: "O E-mail ou o NIF introduzido já está registado" });
            return;
        }
        res.status(500).json({ error: "Erro ao registar o utilizador" });
    }
});

app.get("/utilizadores", async (req, res) => {
    try {
        const db = await ligarBD();
        const utilizadores = await db.all("SELECT id_utilizador, nome, email FROM utilizadores");
        res.json(utilizadores);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar os utilizadores" });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});