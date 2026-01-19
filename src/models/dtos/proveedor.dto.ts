export interface ProveedorDTO {
    nombre_proveedor: string;
    telefono: string;
    nit: string;
    direccion: string;
    correo: string;
    estado?: boolean;
    id_empresa?: string;
}