// types.d.ts o reportTypes.d.ts
export interface Orden {
    producto: string;
    fecha: string;
    cantidad: number;
    precio: number;
    proveedor: string;
    metodo_pago: string;
    estado: string;
  }
  
  export type Ordenes = Orden[];
  