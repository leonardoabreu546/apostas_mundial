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

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.post("/utilizadores", async (req, res) => {
    const { nome, email } = req.body;
    try {
        const db = await ligarBD();
        const utilizadorExistente = await db.get(
            "SELECT * FROM utilizadores WHERE email = ?",
            [email]
        );

        if (utilizadorExistente) {
            return res.status(200).json({ 
                message: "Utilizador autenticado com sucesso", 
                utilizador: utilizadorExistente 
            });
        }

        await db.run(
            "INSERT INTO utilizadores (nome, email) VALUES (?, ?)",
            [nome, email]
        );
        
        res.status(201).json({ message: "Utilizador registado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao processar a identificação" });
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

app.post("/jogos", async (req, res) => {
    const { equipa1_id, equipa2_id, data_hora } = req.body;

    if (!equipa1_id || !equipa2_id || !data_hora) {
        return res.status(400).json({ error: "Faltam dados obrigatórios (equipa1, equipa2 ou data_hora)" });
    }

    try {
        const db = await ligarBD();
        await db.run(
            "INSERT INTO jogos (equipa1_id, equipa2_id, data_hora) VALUES (?, ?, ?)",
            [equipa1_id, equipa2_id, data_hora]
        );
        res.status(201).json({ message: "Jogo agendado com sucesso!" });
    } catch (error) {
        console.error("Erro ao criar jogo:", error);
        res.status(500).json({ error: "Erro ao criar o jogo na base de dados" });
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
        console.log("ERRO REAL NA APOSTA:", error);

        if (error.message?.includes("FOREIGN KEY constraint failed")) {
            res.status(400).json({ error: "O utilizador indicado não existe" });
            return;
        }
        
        res.status(500).json({ error: "Erro ao registar a aposta" });
    }
});

app.get("/equipas", async (req, res) => {
    try {
        const db = await ligarBD();
        const equipas = await db.all("SELECT * FROM equipas ORDER BY nome_equipa ASC");

        res.status(200).json(equipas);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar as equipas" });
    }
});

app.post("/votos", async (req, res) => {
    const { id_jogo, id_equipa } = req.body;

    if (!id_jogo || !id_equipa) {
        return res.status(400).json({ error: "Dados incompletos para o voto" });
    }

    try {
        const db = await ligarBD();
        
        // Procura o jogo para saber qual equipa é a 1 e qual é a 2
        const jogo = await db.get("SELECT equipa1_id, equipa2_id FROM jogos WHERE id_jogo = ?", [id_jogo]);

        if (!jogo) {
            return res.status(404).json({ error: "Jogo não encontrado" });
        }

        // Define 1 para a equipa votada e 0 para a outra na tabela de apostas
        const equipa1_voto = id_equipa === jogo.equipa1_id ? 1 : 0;
        const equipa2_voto = id_equipa === jogo.equipa2_id ? 1 : 0;

        // Usa id_utilizador genérico (ex: 1) por agora
        await db.run(
            "INSERT INTO apostas (id_jogo, id_utilizador, equipa1_golos, equipa2_golos) VALUES (?, ?, ?, ?)",
            [id_jogo, 1, equipa1_voto, equipa2_voto]
        );

        res.status(201).json({ message: "Voto registado com sucesso!" });
    } catch (error) {
        console.error("Erro ao registar voto:", error);
        res.status(500).json({ error: "Erro interno ao guardar o voto" });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});