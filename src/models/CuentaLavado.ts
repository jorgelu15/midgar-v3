interface Producto {
    nombre: string;
    precio: number;
    descuento: number;
    cantidad: number;
}

export interface CuentaLavado {
    nombreCliente: string;
    placa: string;
    lavador: string;
    sala: string;
    productos: Producto[];
}