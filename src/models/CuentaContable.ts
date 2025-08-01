export interface CuentaContable {
  id: string;
  codigo: string;
  nombre: string;
  tipo_cuenta: string;
  naturaleza: string;
  nivel: number;
  orden: number;
  descripcion: string;
  id_padre: string | null;
  id_inst: string;
  hijos?: CuentaContable[];
}