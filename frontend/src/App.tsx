import { useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistoUtilizador from "./pages/registoUtilizador";
import { AdminDashboard } from "./pages/adminDashboard";
import { UserDashboard } from "./pages/userDashboard";
import type { Equipa } from "./components/types";

function App() {
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

  return (
    <BrowserRouter>
      <div className="container mt-5" style={{ maxWidth: "500px" }}>
        <h1 className="text-center mb-4 text-primary fw-bold">Mundial 2026</h1>
        
        <Routes>
          {/* Rota inicial: ecrã de identificação/registo */}
          <Route path="/" element={<RegistoUtilizador />} />

          {/* Rota do Administrador */}
          <Route 
            path="/admin" 
            element={
              <AdminDashboard 
                carregouEquipas={carregouEquipas} 
                equipas={equipas} 
                carregarEquipas={carregarEquipas} 
              />
            } 
          />

          {/* Rota do Utilizador Comum */}
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;