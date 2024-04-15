// service/DataProductos.ts
import type { Product } from '@/interfaces/Productos'; // Ajusta la ruta según la ubicación de tu archivo
 // Ajusta la ruta según la ubicación de tu archivo

export const getDataFromJson = async (): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    // Realizamos una solicitud HTTP para obtener el JSON
    fetch('src/assets/Json/almacen.json')
      .then(response => {
        // Verificamos si la solicitud fue exitosa
        if (!response.ok) {
          throw new Error('Error al cargar los datos del JSON');
        }
        // Convertimos la respuesta a JSON
        return response.json();
      })
      .then(data => {
        // Resolvemos la promesa con los datos del JSON
        resolve(data);
      })
      .catch(error => {
        // Rechazamos la promesa con el error
        reject(error);
      });
  });
};
