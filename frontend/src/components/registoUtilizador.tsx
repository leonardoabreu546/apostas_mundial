import { useState } from "react";
import axios from "axios";
import { LoginForm } from "./loginForm";
import { AdminDashboard } from "./adminDashboard";
import { UserDashboard } from "./userDashboard";
import type { Equipa } from "./types";

function RegistoUtilizador() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState(''); 
  const [utilizadorLogado, setUtilizadorLogado] = useState(false);
  const [role, setRole] = useState('user');

  const [equipas, setEquipas] = useState<Equipa[]>([]);
  const [carregouEquipas, setCarregouEquipas] = useState(false);

  const carregarEquipas = async () => {
    try {
      const resposta = await axios.get("http://localhost:3000/equipas");
      setEquipas(resposta.data);
      setCarregouEquipas(true);
    } catch (erro) {
      console.error("Erro ao carregar equipas:", erro);
      alert("Não foi possível carregar as equipas.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const resposta = await axios.post('http://localhost:3000/utilizadores', {
        nome: nome,
        email: email
      });

      console.log('Sucesso:', resposta.data);
      
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

  if (utilizadorLogado && role === 'admin') {
    return (
      <AdminDashboard 
        nome={nome} 
        carregouEquipas={carregouEquipas} 
        equipas={equipas}                 
        carregarEquipas={carregarEquipas} 
      />
    );
  }

  if (utilizadorLogado) {
    return <UserDashboard nome={nome} />;
  }

  return (
    <LoginForm 
      nome={nome} 
      setNome={setNome} 
      email={email} 
      setEmail={setEmail} 
      onSubmit={handleSubmit} 
    />
  );
}

export default RegistoUtilizador;