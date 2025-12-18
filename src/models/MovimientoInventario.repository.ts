export interface MovimientoInventarioRepository {
    id_producto: number;
    id_inst: number;
    id_usuario: number;
    tipo_movimiento: 'ENTRADA' | 'SALIDA';
    motivo: string;
    cantidad: number;
    costo_unitario: number;
    costo_total?: number;
    referencia_tipo?: string | null;
    referencia_id?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}
