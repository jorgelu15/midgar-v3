export interface ProductoRepository {
    id_producto: string;
    nombre: string;
    codigo: string;
    categoria_id: number;
    costo: number;
    precio_venta: number;
    cantidad: number;
    cantidad_minima: number;
    marca_id: number;
    unidad_medida_id: number;
    impuesto_id: number;
    proveedor_id: number;
    foto_url: string;
    id_inst: number;
    estado: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}