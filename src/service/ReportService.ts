export const getReportData = async () => {
  try {
    const reportUrl = 'http://187.157.236.135:5000'; // Corrección aquí
    const response = await fetch(`${reportUrl}/pedidos
    `); // Corrección aquí

    if (!response.ok) {
      throw new Error('Error al obtener productos');
      }
    const reportData = await response.json();
    console.log(reportData); // Agregado para verificar los datos
    return reportData;
  } catch (error) {
    console.error("Error al cargar el reporte de ventas: ", error);
    return null;
  }
};
