// productsApi.ts

import axios from 'axios';

const BASE_URL = 'http://187.157.236.135:5000';

// Función para obtener todos los productos del almacén
export async function obtenerProductos() {
  try {
    const response = await axios.get(`${BASE_URL}/productos`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al obtener los productos: ${error.message}`);
  }
}

// // Función para crear un nuevo producto en el almacén
// export async function crearProducto(producto: any) {
//   try {
//     const response = await axios.post(`${BASE_URL}(/productosg`, producto);
//     return response.data;
//   } catch (error: any) {
//     throw new Error(`Error al crear el producto: ${error.message}`);
//   }
// }
// Función para crear un nuevo producto en el almacén
export async function crearProducto(producto: any) {
  try {
    const response = await axios.post(`${BASE_URL}/productosg`, producto);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al crear el producto: ${error.message}`);
  }
}

// Función para actualizar un producto existente en el almacén
export async function actualizarProducto(id: number, producto: any) {
  try {
    const response = await axios.put(`${BASE_URL}/productos/${id}`, producto);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al actualizar el producto: ${error.message}`);
  }
}

// Función para eliminar un producto del almacén por su ID
export async function eliminarProducto(id: number) {
  try {
    const response = await axios.delete(`${BASE_URL}/productos/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al eliminar el producto: ${error.message}`);
  }
}
