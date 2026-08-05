import { useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistoUtilizador from "./pages/registoUtilizador";
import { AdminDashboard } from "./pages/adminDashboard";
import { UserDashboard } from "./pages/userDashboard";
import { ProtectedRoute } from "./routes/protectedRoute";
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
          {/* Rota inicial pública */}
          <Route path="/" element={<RegistoUtilizador />} />

          {/* Rota do Administrador: Protegida e exclusiva para Admins */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute apenasAdmin={true}>
                <AdminDashboard 
                  carregouEquipas={carregouEquipas} 
                  equipas={equipas} 
                  carregarEquipas={carregarEquipas} 
                />
              </ProtectedRoute>
            } 
          />

          {/* Rota do Utilizador Comum: Protegida para utilizadores autenticados */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;