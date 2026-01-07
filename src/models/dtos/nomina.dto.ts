export interface NominaDTO {
  id_lavador: number;
  id_empresa: number;

  // UI
  empleado: EmpleadoDTO | null;
  total_pagar: number;

  // Opcional (por si luego lo necesitas)
  estado?: 'PENDIENTE' | 'PAGADO' | 'ANULADO';
}

export interface EmpleadoDTO {
  nombre: string;
  email: string;
}
