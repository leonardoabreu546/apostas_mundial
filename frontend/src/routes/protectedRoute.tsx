import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  apenasAdmin?: boolean;
}

export function ProtectedRoute({ children, apenasAdmin = false }: ProtectedRouteProps) {
  const idUtilizador = localStorage.getItem("id_utilizador");
  const role = localStorage.getItem("role_utilizador");

  // Se não estiver logado, redireciona para a página de registo/login
  if (!idUtilizador) {
    alert("Precisas de ter sessão iniciada para aceder a esta página.");
    return <Navigate to="/" replace />;
  }

  if (apenasAdmin && role !== "admin") {
    alert("Acesso negado: Apenas administradores podem aceder a esta página.");
    return <Navigate to="/dashboard" replace />;
  }

  // Se passar nas verificações, mostra a página pretendida
  return children;
}