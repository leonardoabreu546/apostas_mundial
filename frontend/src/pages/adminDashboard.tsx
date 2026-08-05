import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import type { Equipa } from "../components/types";
import { Card } from "../components/card";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Select } from "../components/select";
import { List, ListItem } from "../components/list";

interface AdminDashboardProps {
  carregouEquipas: boolean;
  equipas: Equipa[];
  carregarEquipas: () => void;
}

export function AdminDashboard({ carregouEquipas, equipas, carregarEquipas }: AdminDashboardProps) {

  const navigate = useNavigate(); 
  const nome = localStorage.getItem("nome_utilizador") || "Administrador";

  const [mostrarFormJogo, setMostrarFormJogo] = useState(false);
  const [equipa1Id, setEquipa1Id] = useState("");
  const [equipa2Id, setEquipa2Id] = useState("");
  const [dataHora, setDataHora] = useState("");

  const [utilizadores, setUtilizadores] = useState<{ id_utilizador: number; nome: string; email: string; role?: string }[]>([]);
  const [mostrarUtilizadores, setMostrarUtilizadores] = useState(false);

  const abrirCriarJogo = async () => {
    await carregarEquipas();
    setMostrarFormJogo(true);
    setMostrarUtilizadores(false);
  };

  const carregarUtilizadores = async () => {
    try {
      const resposta = await axios.get("http://localhost:3000/utilizadores");
      setUtilizadores(resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar utilizadores:", erro);
      alert("Não foi possível carregar a lista de utilizadores.");
    }
  };

  const handleGerirUtilizadores = async () => {
    await carregarUtilizadores();
    setMostrarUtilizadores(true);
    setMostrarFormJogo(false);
  };

  const handleAlterarCargo = async (idUtilizador: number, roleAtual?: string) => {
    const novoRole = roleAtual === "admin" ? "user" : "admin";

    try {
      await axios.patch(`http://localhost:3000/utilizadores/${idUtilizador}/role`, {
        role: novoRole
      });
      alert(`Cargo alterado para ${novoRole} com sucesso!`);
      carregarUtilizadores();
    } catch (erro) {
      console.error("Erro ao alterar cargo:", erro);
      alert("Falha ao alterar o cargo do utilizador.");
    }
  };

  const handleEliminarUtilizador = async (idUtilizador: number, nomeUtilizador: string) => {
    if (!confirm(`Tens a certeza que queres eliminar o utilizador "${nomeUtilizador}"?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/utilizadores/${idUtilizador}`);
      alert("Utilizador eliminado com sucesso!");
      carregarUtilizadores();
    } catch (erro) {
      console.error("Erro ao eliminar utilizador:", erro);
      alert("Falha ao eliminar o utilizador.");
    }
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
      
      setEquipa1Id("");
      setEquipa2Id("");
      setDataHora("");
      setMostrarFormJogo(false);
    } catch (erro) {
      console.error("Erro ao criar jogo:", erro);
      alert("Erro ao criar o jogo. Garante que o backend está ativo.");
    }
  };

  const optionsEquipas = equipas.map((eq) => ({
    value: eq.id_equipa,
    label: eq.nome,
  }));

  return (
    <Card className="card p-4 shadow-sm text-center border-danger">
      {/* Cabeçalho com botão de alternar para a rota /dashboard */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="card-title text-danger mb-0">Painel Admin</h3>
        <Button 
          className="btn btn-outline-primary btn-sm" 
          onClick={() => navigate("/dashboard")} 
        >
          🎮 Vista Utilizador
        </Button>
      </div>

      <p className="text-muted text-start">Bem-vindo, <strong>{nome}</strong>! (Modo Admin)</p>
      <hr />
      
      <div className="d-grid gap-2 mb-4">
        <Button className="btn btn-danger" onClick={abrirCriarJogo}>
          Criar Novo Jogo
        </Button>
        <Button 
          className="btn btn-info text-white" 
          onClick={() => {
            carregarEquipas();
            setMostrarUtilizadores(false);
          }}
        >
          Ver Equipas
        </Button>
        <Button className="btn btn-secondary" onClick={handleGerirUtilizadores}>
          Gerir Utilizadores
        </Button>
      </div>

      {/* Formulário de Criação de Jogo */}
      {mostrarFormJogo && (
        <Card className="card p-3 mb-4 bg-light text-start">
          <h5 className="mb-3">Agendar Novo Jogo</h5>
          <form onSubmit={handleCriarJogo}>
            <Select 
              label="Equipa de Casa (Equipa 1)"
              value={equipa1Id}
              onChange={setEquipa1Id}
              options={optionsEquipas}
              placeholder="Selecione uma equipa..."
              required
            />

            <Select 
              label="Equipa de Fora (Equipa 2)"
              value={equipa2Id}
              onChange={setEquipa2Id}
              options={optionsEquipas}
              placeholder="Selecione uma equipa..."
              required
            />

            <Input 
              label="Data e Hora"
              type="datetime-local"
              value={dataHora}
              onChange={setDataHora}
              required
            />

            <div className="d-flex gap-2">
              <Button type="submit" className="btn btn-success flex-grow-1">
                Gravar Jogo
              </Button>
              <Button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => setMostrarFormJogo(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de Utilizadores */}
      {mostrarUtilizadores && (
        <List title="Utilizadores Registados:">
          {utilizadores.map((u) => (
            <li key={u.id_utilizador} className="list-group-item d-flex justify-content-between align-items-center p-3 mb-2 bg-light rounded text-start">
              <div>
                <strong>{u.nome}</strong> <small className="text-muted">({u.email})</small>
                <div>
                  <span className={`badge ${u.role === "admin" ? "bg-danger" : "bg-secondary"} mt-1`}>
                    {u.role || "user"}
                  </span>
                </div>
              </div>
              
              <div className="d-flex gap-2">
                <Button 
                  className="btn btn-outline-warning btn-sm"
                  onClick={() => handleAlterarCargo(u.id_utilizador, u.role)}
                >
                  {u.role === "admin" ? "Tornar User" : "Tornar Admin"}
                </Button>

                <Button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleEliminarUtilizador(u.id_utilizador, u.nome)}
                >
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </List>
      )}

      {/* Lista de Equipas */}
      {carregouEquipas && !mostrarFormJogo && !mostrarUtilizadores && (
        <List title="Equipas Disponíveis na BD:">
          {equipas.map((equipa) => (
            <ListItem 
              key={equipa.id_equipa} 
              title={equipa.nome} 
              badgeText={`ID: ${equipa.id_equipa}`} 
            />
          ))}
        </List>
      )}
    </Card>
  );
}