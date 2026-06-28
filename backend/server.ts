import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
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

app.get("/jogos", async (req,res) => {
    try {
        const db = await ligarBD();
        const jogos = await db.all("SELECT * FROM jogos");
        res.json(jogos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao ligar à base de dados" });
    }
});

app.post("/apostas", async (req, res) => {
    const { id_jogo, equipa1_golos, equipa2_golos } = req.body;
    try {
        const db = await ligarBD();
        await db.run(
            "INSERT INTO apostas (id_jogo, equipa1_golos, equipa2_golos) VALUES (?, ?, ?)",
            [id_jogo, equipa1_golos, equipa2_golos]
        );
        res.status(201).json({ message: "Aposta registada com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao registar a aposta" });
    }
});

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});