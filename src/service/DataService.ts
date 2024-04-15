
export const getData = async () => {
    try {
      // Asegúrate de que la ruta es accesible en tu configuración de webpack/Vue CLI.
      const response = await fetch('src/assets/Json/data.json');
      if (!response.ok) {
        throw new Error('No se pudieron cargar los datos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al cargar los datos: ", error);
      return null;
    }
  };
  