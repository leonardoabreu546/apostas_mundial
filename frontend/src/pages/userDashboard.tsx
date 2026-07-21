import { useState, useEffect } from "react";
import axios from "axios";
import type { Jogo } from "../components/types";
import { Card } from "../components/card";
import { List } from "../components/list";
import { Button } from "../components/button";

export function UserDashboard() {
  const nome = localStorage.getItem("nome_utilizador") || "Utilizador";
  
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarJogos = async (ativo = true) => {
    try {
      const resposta = await axios.get("http://localhost:3000/jogos");
      if (ativo) {
        setJogos(resposta.data);
      }
    } catch (erro) {
      console.error("Erro ao carregar jogos:", erro);
      alert("Não foi possível carregar a lista de jogos.");
    } finally {
      if (ativo) {
        setCarregando(false);
      }
    }
  };

  useEffect(() => {
    let ativo = true;
    carregarJogos(ativo);

    return () => {
      ativo = false;
    };
  }, []);

  // Função para registar o voto do utilizador
  const handleVotar = async (idJogo: number, idEquipa: number) => {
    try {
      await axios.post("http://localhost:3000/votos", {
        id_jogo: idJogo,
        id_equipa: idEquipa,
      });

      alert("Voto registado com sucesso!");
      carregarJogos();
    } catch (erro) {
      console.error("Erro ao votar:", erro);
      alert("Não foi possível registar o voto.");
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleString("pt-PT", { dateStyle: "short", timeStyle: "short" });
  };

  return (
    <Card>
      <h3 className="card-title mb-4">Lista de Jogos para Votação</h3>
      <p className="text-muted">
        Bem-vindo, <strong>{nome}</strong>! Escolhe os teus palpites abaixo:
      </p>
      <hr />

      {carregando ? (
        <p className="text-secondary">A carregar jogos...</p>
      ) : jogos.length === 0 ? (
        <p className="text-danger">Nenhum jogo agendado de momento.</p>
      ) : (
        <List title="Jogos Disponíveis:">
          {jogos.map((jogo) => {
            const nomeEq1 = jogo.equipa1_nome || `Equipa ${jogo.equipa1_id}`;
            const nomeEq2 = jogo.equipa2_nome || `Equipa ${jogo.equipa2_id}`;
            const votosEq1 = jogo.votos_equipa1 || 0;
            const votosEq2 = jogo.votos_equipa2 || 0;

            return (
              <li key={jogo.id_jogo} className="list-group-item p-3 mb-3 bg-light rounded shadow-sm">
                <div className="text-center mb-2">
                  <small className="text-muted">📅 {formatarData(jogo.data_hora)}</small>
                </div>

                {/* Botões para Votar */}
                <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                  <Button 
                    className="btn btn-outline-primary flex-grow-1"
                    onClick={() => handleVotar(jogo.id_jogo, jogo.equipa1_id)}
                  >
                    Votar {nomeEq1}
                  </Button>

                  <span className="badge bg-secondary px-2 py-1">VS</span>

                  <Button 
                    className="btn btn-outline-primary flex-grow-1"
                    onClick={() => handleVotar(jogo.id_jogo, jogo.equipa2_id)}
                  >
                    Votar {nomeEq2}
                  </Button>
                </div>

                {/* Exibição da Contagem de Votos */}
                <div className="d-flex justify-content-between px-2 text-muted small">
                  <span>Votos: <strong>{votosEq1}</strong></span>
                  <span>Votos: <strong>{votosEq2}</strong></span>
                </div>
              </li>
            );
          })}
        </List>
      )}
    </Card>
  );
}