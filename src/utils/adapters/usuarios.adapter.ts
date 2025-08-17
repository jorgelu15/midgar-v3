import type { UsuarioRepository } from "../../models/Usuario.repository";

// usuarios.adapter.ts
export interface UsuarioRow {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  fechaRegistro: string;
}

export const mapUsuariosToRows = (usuarios: UsuarioRepository[]): UsuarioRow[] => {
  if (!usuarios) return [];

  return usuarios.map((u) => ({
    id: u.id_usuario.toString(),
    nombre: u.nombre,
    correo: u.email,
    rol: u.roles?.[0]?.nombre_rol || "Sin rol",
    fechaRegistro: new Date(u.createdAt).toLocaleDateString("es-CO"),
  }));
};
