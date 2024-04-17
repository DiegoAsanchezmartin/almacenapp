export const getData = async (endpoint: string | undefined) => {
  try {
    let url = '';
    if (endpoint === 'pedidos') {
      url = 'http://187.157.236.135:5000/pedidos';
    } else if (endpoint === 'productos') {
      url = 'http://187.157.236.135:5000/productos';
    } else {
      throw new Error('Endpoint desconocido');
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`No se pudieron cargar los datos del endpoint ${endpoint}`);
    }
    
    const data = await response.json();
    if (!data || data.length === 0) {
      throw new Error(`Los datos del endpoint ${endpoint} están vacíos`);
    }

    // Mapear los datos según el tipo de endpoint
    if (endpoint === 'pedidos') {
      return data.map((entry: { fecha: any; producto: any; estado: any; cantidad:any; precio:any; proveedor:any; }) => ({
        fecha: entry.fecha,
        producto: entry.producto,
        estado: entry.estado,
        cantidad: entry.cantidad,
        proveedor: entry.proveedor,
        precio: entry.precio,

      }));
    } else if (endpoint === 'productos') {
      return data.map((entry: { id: any; producto: any; categoria:any; stock:any; precio:any; status:any; }) => ({
        id: entry.id,
        nombre: entry.producto,
        precio: entry.precio,
        categoria: entry.categoria,
        stock: entry.stock,
        status: entry.status,
      }));
    }
  } catch (error) {
    console.error(`Error al cargar los datos del endpoint ${endpoint}: `, error);
    return [];
  }
};
