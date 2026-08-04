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
        const utilizadores = await db.all("SELECT id_utilizador, nome, email, role FROM utilizadores");
        res.json(utilizadores);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar os utilizadores" });
    }
});

// 🌟 ROTA NOVA: Alterar o cargo (role) do utilizador
app.patch("/utilizadores/:id/role", async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || (role !== "admin" && role !== "user")) {
        return res.status(400).json({ error: "Cargo inválido. Use 'admin' ou 'user'." });
    }

    try {
        const db = await ligarBD();
        const resultado = await db.run(
            "UPDATE utilizadores SET role = ? WHERE id_utilizador = ?",
            [role, id]
        );

        if (resultado.changes === 0) {
            return res.status(404).json({ error: "Utilizador não encontrado." });
        }

        res.json({ message: "Cargo atualizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar cargo:", error);
        res.status(500).json({ error: "Erro interno no servidor ao atualizar o cargo." });
    }
});

// 🌟 ROTA NOVA: Eliminar utilizador
app.delete("/utilizadores/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const db = await ligarBD();
        const resultado = await db.run(
            "DELETE FROM utilizadores WHERE id_utilizador = ?",
            [id]
        );

        if (resultado.changes === 0) {
            return res.status(404).json({ error: "Utilizador não encontrado." });
        }

        res.json({ message: "Utilizador eliminado com sucesso!" });
    } catch (error) {
        console.error("Erro ao eliminar utilizador:", error);
        res.status(500).json({ error: "Erro interno no servidor ao eliminar o utilizador." });
    }
});

app.get("/equipas", async (req, res) => {
    try {
        const db = await ligarBD();
        const equipas = await db.all("SELECT * FROM equipas ORDER BY nome ASC");
        res.json(equipas);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar as equipas" });
    }
});

app.get("/jogos", async (req, res) => {
    const id_utilizador = req.query.id_utilizador;

    try {
        const db = await ligarBD();
        const jogos = await db.all(`
            SELECT
                jogos.id_jogo,
                jogos.equipa1_id,
                jogos.equipa2_id,
                jogos.data_hora,
                jogos.equipa1_golos,
                jogos.equipa2_golos,
                e1.nome AS equipa1_nome,
                e2.nome AS equipa2_nome,
                e1.bandeira AS equipa1_bandeira,
                e2.bandeira AS equipa2_bandeira,
                (SELECT COUNT(*) FROM apostas WHERE apostas.id_jogo = jogos.id_jogo AND apostas.equipa1_golos = 1) AS votos_equipa1,
                (SELECT COUNT(*) FROM apostas WHERE apostas.id_jogo = jogos.id_jogo AND apostas.equipa2_golos = 1) AS votos_equipa2,
                EXISTS(
                    SELECT 1 FROM apostas 
                    WHERE apostas.id_jogo = jogos.id_jogo AND apostas.id_utilizador = ?
                ) AS ja_votou
            FROM jogos
            INNER JOIN equipas AS e1 ON jogos.equipa1_id = e1.id_equipa
            INNER JOIN equipas AS e2 ON jogos.equipa2_id = e2.id_equipa
        `, [id_utilizador || 0]);

        const jogosFormatados = jogos.map(jogo => ({
            ...jogo,
            ja_votou: Boolean(jogo.ja_votou)
        }));

        res.json(jogosFormatados);
    } catch (error) {
        console.error("Erro ao procurar jogos:", error);
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

app.post("/votos", async (req, res) => {
    const { id_jogo, id_equipa, id_utilizador } = req.body;

    if (!id_jogo || !id_equipa) {
        return res.status(400).json({ error: "Dados incompletos para o voto" });
    }

    try {
        const db = await ligarBD();

        let userID = id_utilizador;
        if (!userID) {
            const primeiroUser = await db.get("SELECT id_utilizador FROM utilizadores LIMIT 1");
            userID = primeiroUser ? primeiroUser.id_utilizador : 1;
        }

        const apostaExistente = await db.get(
            "SELECT * FROM apostas WHERE id_jogo = ? AND id_utilizador = ?",
            [id_jogo, userID]
        );

        if (apostaExistente) {
            return res.status(400).json({ error: "Já registaste o teu voto para este jogo!" });
        }

        const jogo = await db.get("SELECT equipa1_id, equipa2_id FROM jogos WHERE id_jogo = ?", [id_jogo]);

        if (!jogo) {
            return res.status(404).json({ error: "Jogo não encontrado" });
        }

        const equipa1_voto = id_equipa === jogo.equipa1_id ? 1 : 0;
        const equipa2_voto = id_equipa === jogo.equipa2_id ? 1 : 0;

        await db.run(
            "INSERT INTO apostas (id_jogo, id_utilizador, equipa1_golos, equipa2_golos) VALUES (?, ?, ?, ?)",
            [id_jogo, userID, equipa1_voto, equipa2_voto]
        );

        res.status(201).json({ message: "Voto registado com sucesso!" });
    } catch (error) {
        console.error("Erro ao registar voto:", error);
        
        const mensagemErro = error instanceof Error ? error.message : "Erro desconhecido";
        res.status(500).json({ error: "Erro interno ao guardar o voto: " + mensagemErro });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});