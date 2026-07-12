import { useState } from "react";
import axios from "axios";

function RegistoUtilizador() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState(''); 
  
  const [utilizadorLogado, setUtilizadorLogado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const resposta = await axios.post('http://localhost:3000/utilizadores', {
        nome: nome,
        email: email
      });

      console.log('Sucesso:', resposta.data);
      alert('Identificação registada! Podes avançar para a votação.');
      
      // Ativa o estado para mudar o que aparece no ecrã
      setUtilizadorLogado(true);
      
    } catch (erro) {
      console.error('Erro ao ligar ao backend:', erro);
      alert('Erro ao ligar ao servidor. Garante que o teu backend está ligado na porta 3000!');
    }
  };

  // Se o utilizador já estiver logado, mostra o ecrã dos jogos
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