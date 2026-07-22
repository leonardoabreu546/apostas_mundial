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

  const carregarJogos = async () => {
    try {
      const resposta = await axios.get("http://localhost:3000/jogos");
      setJogos(resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar jogos:", erro);
      alert("Não foi possível carregar a lista de jogos.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let ativo = true;

    const buscarDadosIniciais = async () => {
      try {
        const resposta = await axios.get("http://localhost:3000/jogos");
        if (ativo) {
          setJogos(resposta.data);
        }
      } catch (erro) {
        console.error("Erro ao carregar jogos:", erro);
        if (ativo) {
          alert("Não foi possível carregar a lista de jogos.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    buscarDadosIniciais();

    return () => {
      ativo = false;
    };
  }, []);

  // Função para registar o voto do utilizador
  const handleVotar = async (idJogo: number, idEquipa: number) => {
  if (!idEquipa) {
    alert("Erro: O ID da equipa não foi encontrado. Atualize a página.");
    return;
  }

  try {
    await axios.post("http://localhost:3000/votos", {
      id_jogo: idJogo,
      id_equipa: idEquipa,
    });

    alert("Voto registado com sucesso!");
    carregarJogos();
  } catch (erro) {
    console.error("Erro ao votar:", erro);

    let mensagemErro = "Erro desconhecido";

    if (axios.isAxiosError(erro)) {
      mensagemErro = erro.response?.data?.error || erro.message;
    } else if (erro instanceof Error) {
      mensagemErro = erro.message;
    }

    alert(`Falha ao votar: ${mensagemErro}`);
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
                {/* 1. Layout Visual Anterior das Equipas */}
                <div className="d-flex justify-content-between align-items-center fw-bold">
                  <span>{nomeEq1}</span>
                  <span className="badge bg-primary px-3 py-2 mx-2">VS</span>
                  <span>{nomeEq2}</span>
                </div>
                
                {/* 2. Data do Jogo */}
                <div className="text-center mt-2">
                  <small className="text-muted d-block">
                    📅 {formatarData(jogo.data_hora)}
                  </small>
                </div>

                {/* 3. Botões Adicionais de Votação */}
                <div className="d-flex justify-content-between gap-2 mt-3">
                  <Button 
                    className="btn btn-outline-primary btn-sm flex-grow-1"
                    onClick={() => handleVotar(jogo.id_jogo, jogo.equipa1_id)}
                  >
                    Votar em {nomeEq1}
                  </Button>

                  <Button 
                    className="btn btn-outline-primary btn-sm flex-grow-1"
                    onClick={() => handleVotar(jogo.id_jogo, jogo.equipa2_id)}
                  >
                    Votar em {nomeEq2}
                  </Button>
                </div>

                {/* 4. Contagem dos Votos */}
                <div className="d-flex justify-content-between px-1 mt-2 text-muted small">
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