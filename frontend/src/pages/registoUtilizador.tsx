import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Hook de navegação correto

// Componentes Genéricos e Reutilizáveis Importados
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

function RegistoUtilizador() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState(''); 
  const navigate = useNavigate(); // Inicialização do hook de navegação

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const resposta = await axios.post('http://localhost:3000/utilizadores', {
        nome: nome,
        email: email
      });

      console.log('Sucesso:', resposta.data);
      
      let nomeFinal = nome;
      let userRole = 'user';

      if (resposta.data.utilizador) {
        nomeFinal = resposta.data.utilizador.nome;
        userRole = resposta.data.utilizador.role;
      }

      alert('Identificação registada! Podes avançar.');
      
      // Guardamos o nome no localStorage para acesso independente por outras páginas/rotas
      localStorage.setItem("nome_utilizador", nomeFinal);

      // Redirecionamento correto e nativo de rotas
      if (userRole === 'admin') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
      
    } catch (erro) {
      console.error('Erro ao ligar ao backend:', erro);
      alert('Erro ao ligar ao servidor. Garante que o teu backend está ligado na porta 3000!');
    }
  };

  return (
    <Card title="Identificação para Votar">
      <form onSubmit={handleSubmit}>
        <Input 
          label="Nome do Utilizador"
          value={nome}
          onChange={setNome}
          placeholder="Ex: João Silva"
          required
        />
        <Input 
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Ex: joao@email.com"
          required
        />
        <Button type="submit" className="btn btn-primary w-100">
          Entrar e Votar
        </Button>
      </form>
    </Card>
  );
}

export default RegistoUtilizador;