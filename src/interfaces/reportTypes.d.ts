// types.d.ts o reportTypes.d.ts
export interface Orden {
  id: number;
  producto: string;
  estado: string;
  cantidad: number;
  fecha: string; 
  precio: number;
  proveedor: string;
  metodo_pago: string;
  diferencia?: number;
  }
  
  export type Ordenes = Orden[];
  