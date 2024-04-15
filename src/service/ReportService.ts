export const getReportData = async () => {
    try {
      const reportUrl = 'src/assets/Json/ordenes.json';
      const response = await fetch(reportUrl);
      if (!response.ok) {
        throw new Error('No se pudo cargar el reporte de ventas');
      }
      const reportData = await response.json();
      console.log(reportData); // Agregado para verificar los datos
      return reportData;
    } catch (error) {
      console.error("Error al cargar el reporte de ventas: ", error);
      return null;
    }
};
