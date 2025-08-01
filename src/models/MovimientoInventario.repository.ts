export interface MovimientoInventarioRepository {
    id_producto?: string,
    movimiento: string,
    motivo: number,
    cantidad: number,
    saldo: number,
    costo: number,
    id_usuario: string
    id_inst?: string;
    updatedAt?: Date;
    createdAt?: Date;
}