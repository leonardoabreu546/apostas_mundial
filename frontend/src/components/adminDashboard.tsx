import { useState } from "react";
import axios from "axios";
import type { Equipa } from "./types";

interface AdminDashboardProps {
  nome: string;
  carregouEquipas: boolean;
  equipas: Equipa[];
  carregarEquipas: () => void;
}

export function AdminDashboard({ nome, carregouEquipas, equipas, carregarEquipas }: AdminDashboardProps) {
  // Estados para controlar o formulário de criação de jogos
  const [mostrarFormJogo, setMostrarFormJogo] = useState(false);
  const [equipa1Id, setEquipa1Id] = useState("");
  const [equipa2Id, setEquipa2Id] = useState("");
  const [dataHora, setDataHora] = useState("");

  const abrirCriarJogo = async () => {
    // Garante que as equipas estão carregadas antes de abrir o formulário
    await carregarEquipas();
    setMostrarFormJogo(true);
  };

  const handleCriarJogo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (equipa1Id === equipa2Id) {
      alert("Uma equipa não pode jogar contra ela própria!");
      return;
    }

    try {
      await axios.post("http://localhost:3000/jogos", {
        equipa1_id: Number(equipa1Id),
        equipa2_id: Number(equipa2Id),
        data_hora: dataHora,
      });

      alert("Jogo criado com sucesso!");
      
      // Limpar campos e fechar o formulário
      setEquipa1Id("");
      setEquipa2Id("");
      setDataHora("");
      setMostrarFormJogo(false);
    } catch (erro) {
      console.error("Erro ao criar jogo:", erro);
      alert("Erro ao criar o jogo. Garante que o backend está ativo.");
    }
  };

  return (
    <div className="card p-4 shadow-sm text-center border-danger">
      <h3 className="card-title mb-4 text-danger">Painel do Administrador</h3>
      <p className="text-muted">Bem-vindo, <strong>{nome}</strong>! (Modo Admin)</p>
      <hr />
      
      <div className="d-grid gap-2 mb-4">
        {/* Ativada a função para abrir o formulário */}
        <button className="btn btn-danger" onClick={abrirCriarJogo}>
          Criar Novo Jogo
        </button>
        <button className="btn btn-info text-white" onClick={carregarEquipas}>
          Ver Equipas
        </button>
        <button className="btn btn-secondary">Gerir Utilizadores</button>
      </div>

      {/* Formulário de Criação de Jogo */}
      {mostrarFormJogo && (
        <div className="card p-3 mb-4 bg-light text-start">
          <h5 className="mb-3">Agendar Novo Jogo</h5>
          <form onSubmit={handleCriarJogo}>
            <div className="mb-3">
              <label className="form-label">Equipa de Casa (Equipa 1)</label>
              <select 
                className="form-select" 
                value={equipa1Id} 
                onChange={(e) => setEquipa1Id(e.target.value)}
                required
              >
                <option value="">Selecione uma equipa...</option>
                {equipas.map((eq) => (
                  <option key={eq.id_equipa} value={eq.id_equipa}>{eq.nome}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Equipa de Fora (Equipa 2)</label>
              <select 
                className="form-select" 
                value={equipa2Id} 
                onChange={(e) => setEquipa2Id(e.target.value)}
                required
              >
                <option value="">Selecione uma equipa...</option>
                {equipas.map((eq) => (
                  <option key={eq.id_equipa} value={eq.id_equipa}>{eq.nome}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Data e Hora</label>
              <input 
                type="datetime-local" 
                className="form-control" 
                value={dataHora}
                onChange={(e) => setDataHora(e.target.value)}
                required
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success flex-grow-1">Gravar Jogo</button>
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => setMostrarFormJogo(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Equipas (só aparece se o formulário estiver fechado) */}
      {carregouEquipas && !mostrarFormJogo && (
        <div className="text-start">
          <h5 className="mb-3">Equipas Disponíveis na BD:</h5>
          <ul className="list-group">
            {equipas.map((equipa) => (
              <li key={equipa.id_equipa} className="list-group-item d-flex justify-content-between align-items-center">
                <strong>{equipa.nome}</strong>
                <span className="badge bg-secondary rounded-pill">ID: {equipa.id_equipa}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}