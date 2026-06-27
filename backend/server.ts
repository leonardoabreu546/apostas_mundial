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

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});