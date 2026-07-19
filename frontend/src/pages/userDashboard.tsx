import { Card } from "../components/card";

export function UserDashboard() {
  const nome = localStorage.getItem("nome_utilizador") || "Utilizador";

  return (
    <Card>
      <h3 className="card-title mb-4">Lista de Jogos para Votação</h3>
      <p className="text-muted">
        Bem-vindo, <strong>{nome}</strong>! Escolhe os teus palpites abaixo:
      </p>
      <hr />
      <p className="text-success font-monospace">Os jogos vão carregar aqui...</p>
    </Card>
  );
}