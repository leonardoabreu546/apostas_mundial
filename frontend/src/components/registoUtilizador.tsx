import { useState } from "react";
import axios from "axios";

function RegistoUtilizador() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState(''); 
  
  const [utilizadorLogado, setUtilizadorLogado] = useState(false);

  // Guardamos o role para saber se é admin ou user
  const [role, setRole] = useState('user');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const resposta = await axios.post('http://localhost:3000/utilizadores', {
        nome: nome,
        email: email
      });

      console.log('Sucesso:', resposta.data);
      
      // Extraímos os dados que o backend devolveu
      if (resposta.data.utilizador) {
        setNome(resposta.data.utilizador.nome);
        setRole(resposta.data.utilizador.role);
      }

      alert('Identificação registada! Podes avançar.');
      
      setUtilizadorLogado(true);
      
    } catch (erro) {
      console.error('Erro ao ligar ao backend:', erro);
      alert('Erro ao ligar ao servidor. Garante que o teu backend está ligado na porta 3000!');
    }
  };

  // Se for Admin, mostra o painel de controlo
  if (utilizadorLogado && role === 'admin') {
    return (
      <div className="card p-4 shadow-sm text-center border-danger">
        <h3 className="card-title mb-4 text-danger">Painel do Administrador</h3>
        <p className="text-muted">Bem-vindo, <strong>{nome}</strong>! (Modo Admin)</p>
        <hr />
        <div className="d-grid gap-2">
          <button className="btn btn-danger">Criar Novo Jogo</button>
          <button className="btn btn-secondary">Gerir Utilizadores</button>
        </div>
      </div>
    );
  }

  if (utilizadorLogado) {
    return (
      <div className="card p-4 shadow-sm text-center">
        <h3 className="card-title mb-4">Lista de Jogos para Votação</h3>
        <p className="text-muted">Bem-vindo, <strong>{nome}</strong>! Escolhe os teus palpites abaixo:</p>
        <hr />
        <p className="text-success font-monospace">Os jogos vão carregar aqui...</p>
      </div>
    );
  }

  return (
    <div className="card p-4 shadow-sm">
      <h3 className="card-title mb-4">Identificação para Votar</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome do Utilizador</label>
          <input 
            type="text" 
            className="form-control" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: João Silva"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: joao@email.com"
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary w-100">
          Entrar e Votar
        </button>
      </form>
    </div>
  );
}

export default RegistoUtilizador;