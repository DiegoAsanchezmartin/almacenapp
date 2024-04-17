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
      return data.map((entry: { fecha: any; nombre: any; estado: any; }) => ({
        fecha: entry.fecha,
        nombre: entry.nombre,
        estado: entry.estado
      }));
    } else if (endpoint === 'productos') {
      return data.map((entry: { id: any; nombre: any; precio: any; }) => ({
        id: entry.id,
        nombre: entry.nombre,
        precio: entry.precio
      }));
    }
  } catch (error) {
    console.error(`Error al cargar los datos del endpoint ${endpoint}: `, error);
    return [];
  }
};
