import { useState, useEffect } from "react";
import axios from "axios";
import type { Jogo } from "../components/types";

// Componente Genérico Importado
import { Card } from "../components/card";
import { List } from "../components/list";

export function UserDashboard() {
  const nome = localStorage.getItem("nome_utilizador") || "Utilizador";
  
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    const carregarJogos = async () => {
      try {
        const resposta = await axios.get("http://localhost:3000/jogos");
        if (ativo) {
          setJogos(resposta.data);
        }
      } catch (erro) {
        console.error("Erro ao carregar jogos:", erro);
        alert("Não foi possível carregar la lista de jogos.");
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    carregarJogos();

    // Função de limpeza (cleanup) para evitar fugas de memória e renders desnecessários
    return () => {
      ativo = false;
    };
  }, []);

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
          {jogos.map((jogo) => (
            <li key={jogo.id_jogo} className="list-group-item p-3 mb-2 bg-light rounded shadow-sm">
              <div className="d-flex justify-content-between align-items-center fw-bold">
                <span>{jogo.equipa1_nome || `Equipa ${jogo.equipa1_id}`}</span>
                <span className="badge bg-primary px-3 py-2 mx-2">VS</span>
                <span>{jogo.equipa2_nome || `Equipa ${jogo.equipa2_id}`}</span>
              </div>
              
              <div className="text-center mt-2">
                <small className="text-muted d-block">
                  📅 {formatarData(jogo.data_hora)}
                </small>
                {jogo.equipa1_golos !== null && 
                 jogo.equipa2_golos !== null && (
                  <span className="badge bg-success mt-1">
                    Resultado: {jogo.equipa1_golos} - {jogo.equipa2_golos}
                  </span>
                )}
              </div>
            </li>
          ))}
        </List>
      )}
    </Card>
  );
}