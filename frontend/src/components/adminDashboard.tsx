import type { Equipa } from "./types";

interface AdminDashboardProps {
  nome: string;
  carregouEquipas: boolean;
  equipas: Equipa[];
  carregarEquipas: () => void;
}

export function AdminDashboard({ nome, carregouEquipas, equipas, carregarEquipas }: AdminDashboardProps) {
  return (
    <div className="card p-4 shadow-sm text-center border-danger">
      <h3 className="card-title mb-4 text-danger">Painel do Administrador</h3>
      <p className="text-muted">Bem-vindo, <strong>{nome}</strong>! (Modo Admin)</p>
      <hr />
      
      <div className="d-grid gap-2 mb-4">
        <button className="btn btn-danger">
          Criar Novo Jogo
        </button>
        <button className="btn btn-info text-white" onClick={carregarEquipas}>
          Ver Equipas
        </button>
        <button className="btn btn-secondary">Gerir Utilizadores</button>
      </div>

      {/* Lista de Equipas */}
      {carregouEquipas && (
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