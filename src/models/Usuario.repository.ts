import type { ClienteRepository } from "./Cliente.repository";
import type { PermisoRepository } from "./Permiso.repository";
import type { RolRepository } from "./Rol.repository";

export interface UsuarioRepository {
    id_usuario: number;
    nombre: string;
    email: string;
    roles: RolRepository[];
    permisos: PermisoRepository[];
    estado: string;
    cliente: ClienteRepository;
    ultimo_acceso: Date;
    createdAt: Date;
    updatedAt: Date;
}
