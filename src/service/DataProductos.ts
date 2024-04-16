import axios from 'axios';

const BASE_URL = 'http://187.157.236.135:5000';

// Función para crear un nuevo producto
export async function crearProducto(producto: any) {
  try {
    const response = await axios.post(`${BASE_URL}/productosg`, producto);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al crear el producto: ${error.message}`);
  }
}

// Función para obtener todos los productos
export async function obtenerProductos() {
  try {
    const response = await axios.get(`${BASE_URL}/productos`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al obtener los productos: ${error.message}`);
  }
}

// Función para obtener un producto por su ID
export async function obtenerProductoPorId(id: string) {
  try {
    const response = await axios.get(`${BASE_URL}/productos/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al obtener el producto: ${error.message}`);
  }
}

// Función para actualizar un producto por su ID
export async function actualizarProducto(id: string, producto: any) {
  try {
    const response = await axios.put(`${BASE_URL}/productos/${id}`, producto);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al actualizar el producto: ${error.message}`);
  }
}

// Función para eliminar un producto por su ID
export async function eliminarProducto(id: string) {
  try {
    const response = await axios.delete(`${BASE_URL}/productos/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al eliminar el producto: ${error.message}`);
  }
}
