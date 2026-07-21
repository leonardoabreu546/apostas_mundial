export interface Equipa {
  id_equipa: number;
  nome: string;
}

export interface Jogo {
  id_jogo: number;
  equipa1_id: number;
  equipa2_id: number;
  equipa1_nome?: string;
  equipa2_nome?: string;
  data_hora: string;
  votos_equipa1?: number;
  votos_equipa2?: number;
}


