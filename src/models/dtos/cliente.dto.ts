export interface ClienteDTO {
    cedula: string;
    nombre: string;
    telefono: string;
    direccion: string;
    email: string;
    id_empresa: string;
    estado?: boolean;
    id_cliente?: string;
}