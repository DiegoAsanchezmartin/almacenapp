// Productos.ts
export interface Producto {
    id : string;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    stock: number;
    status: 'Disponible' | 'No disponible';
}
  