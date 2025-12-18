import type { EmpresaRepository } from "./Empresa.repository";
import type { PermisoRepository } from "./Permiso.repository";
import type { RolRepository } from "./Rol.repository";

export interface UsuarioRepository {
    id_usuario: number;
    nombre: string;
    email: string;
    roles: RolRepository[];
    permisos: PermisoRepository[];
    estado: string;
    empresa: EmpresaRepository;
    ultimo_acceso: Date;
    createdAt: Date;
    updatedAt: Date;
}
