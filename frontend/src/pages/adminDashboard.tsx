import { useState } from "react";
import axios from "axios";
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

  const nome = localStorage.getItem("nome_utilizador") || "Administrador";

  const [mostrarFormJogo, setMostrarFormJogo] = useState(false);
  const [equipa1Id, setEquipa1Id] = useState("");
  const [equipa2Id, setEquipa2Id] = useState("");
  const [dataHora, setDataHora] = useState("");

  // Estados para gerir utilizadores
  const [utilizadores, setUtilizadores] = useState<{ id_utilizador: number; nome: string; email: string; role?: string }[]>([]);
  const [mostrarUtilizadores, setMostrarUtilizadores] = useState(false);

  const abrirCriarJogo = async () => {
    // Garante que as equipas estão carregadas antes de abrir o formulário
    await carregarEquipas();
    setMostrarFormJogo(true);
    setMostrarUtilizadores(false);
  };

  const handleGerirUtilizadores = async () => {
    try {
      const resposta = await axios.get("http://localhost:3000/utilizadores");
      setUtilizadores(resposta.data);
      setMostrarUtilizadores(true);
      setMostrarFormJogo(false);
    } catch (erro) {
      console.error("Erro ao carregar utilizadores:", erro);
      alert("Não foi possível carregar a lista de utilizadores.");
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

  const optionsEquipas = equipas.map((eq) => ({
    value: eq.id_equipa,
    label: eq.nome,
  }));

  return (
    <Card className="card p-4 shadow-sm text-center border-danger">
      <h3 className="card-title mb-4 text-danger">Painel do Administrador</h3>
      <p className="text-muted">Bem-vindo, <strong>{nome}</strong>! (Modo Admin)</p>
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

      {/* Formulário de Criação de Jogo utilizando Inputs/Selects genéricos */}
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
            <ListItem 
              key={u.id_utilizador} 
              title={`${u.nome} (${u.email})`} 
              badgeText={u.role || "user"} 
            />
          ))}
        </List>
      )}

      {/* Lista de Equipas genérica */}
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