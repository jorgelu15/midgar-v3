export interface ClienteDTO {
    cedula: string;
    nombre: string;
    telefono: string;
    direccion: string;
    email: string;
    estado: boolean;
    id_empresa: string;
    id_cliente?: string;
}