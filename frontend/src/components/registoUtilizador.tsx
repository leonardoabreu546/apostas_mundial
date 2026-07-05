import {useState} from "react";

function RegistoUtilizador(){
    const [nome, setNome] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Nome:', nome);
    };

    return (
    <div className="card p-4 shadow-sm">
      <h3 className="card-title mb-4">Criar Novo Utilizador</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome do Utilizador</label>
          <input 
            type="text" 
            className="form-control" 
            value={nome}
            onChange={(e) => setNome(e.target.value)} // Atualiza o estado sempre que o utilizador digita
            placeholder="Ex: João Silva"
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary w-100">
          Registar Utilizador
        </button>
      </form>
    </div>
  );
}

export default RegistoUtilizador;
