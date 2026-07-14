import React from "react";

interface LoginFormProps {
  nome: string;
  setNome: (valor: string) => void;
  email: string;
  setEmail: (valor: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({ nome, setNome, email, setEmail, onSubmit }: LoginFormProps) {
  return (
    <div className="card p-4 shadow-sm">
      <h3 className="card-title mb-4">Identificação para Votar</h3>
      
      <form onSubmit={onSubmit}>
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