interface UserDashboardProps {
  nome: string;
}

export function UserDashboard({ nome }: UserDashboardProps) {
  return (
    <div className="card p-4 shadow-sm text-center">
      <h3 className="card-title mb-4">Lista de Jogos para Votação</h3>
      <p className="text-muted">Bem-vindo, <strong>{nome}</strong>! Escolhe os teus palpites abaixo:</p>
      <hr />
      <p className="text-success font-monospace">Os jogos vão carregar aqui...</p>
    </div>
  );
}