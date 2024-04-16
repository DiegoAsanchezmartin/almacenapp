<template>
  <div>
    <Sidebar />
    <div class="dashboard-container">
      <div class="graficas">
        <div class="grafica-ventas">
          <h2>Ventas vs Compras</h2>
          <canvas id="ventasChart"></canvas>
        </div>
        <div class="grafica-estado">
          <h2>Estado de Órdenes</h2>
          <canvas id="estadoChart"></canvas>
        </div>
        <div class="grafica-proveedores">
          <h2>Productos Comprados por Proveedor</h2>
          <canvas id="proveedoresChart"></canvas>
        </div>
      </div>
      <div class="tabla-productos">
        <h2>Tabla de Ventas y Compras</h2>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Ventas</th>
              <th>Compras</th>
              <th>Diferencia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in datos.productos" :key="producto.producto">
              <td>{{ producto.producto }}</td>
              <td>{{ producto.estado }}</td> <!-- Mostrar el estado en lugar de 'vendidos' -->
              <td>{{ producto.cantidad }}</td> <!-- Mostrar la cantidad en lugar de 'comprados' -->
              <td>{{ producto.diferencia }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { Chart, type ChartData, type ChartOptions, registerables } from 'chart.js';
import { getProductos, getReportData } from '@/service/ReportService';
import type { Orden } from '@/interfaces/reportTypes';

Chart.register(...registerables);

const datos = ref({
  productos: [] as Orden[],
  estados: {} as Record<string, number>,
  proveedores: {} as Record<string, number>,
});

onMounted(async () => {
  try {
    const reportData = await getReportData();
    const productosData = await getProductos();
    if (reportData && productosData) {
      datos.value.productos = processData(reportData, productosData);
      datos.value.estados = processEstados(reportData);
      datos.value.proveedores = processProveedores(reportData);
      nextTick(() => {
        createChart();
      });
    }
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  }
});

function processData(reportData: any[], productosData: any[]) {
  const productMap = new Map<string, { comprados: number, vendidos: number }>();

  for (const item of reportData) {
    const { producto, cantidad, estado } = item;
    if (!productMap.has(producto)) {
      productMap.set(producto, { comprados: 0, vendidos: 0 });
    }
    const product = productMap.get(producto)!;
    if (estado === 'En proceso') {
      product.comprados += cantidad;
    } else if (estado === 'Vendido') {
      product.vendidos += cantidad;
    }
  }

  const productos: Orden[] = [];
  for (const [producto, { comprados, vendidos }] of productMap.entries()) {
    const diferencia = comprados - vendidos;
    productos.push({ id: 0, producto, estado: '', cantidad: 0, fecha: '', precio: 0, proveedor: '', metodo_pago: '', diferencia });
  }

  return productos;
}

function processEstados(reportData: any[]) {
  const estados: Record<string, number> = {};

  for (const item of reportData) {
    const { estado } = item;
    if (!estados[estado]) {
      estados[estado] = 0;
    }
    estados[estado]++;
  }

  return estados;
}

function processProveedores(reportData: any[]) {
  const proveedores: Record<string, number> = {};

  for (const item of reportData) {
    const { proveedor, cantidad } = item;
    if (!proveedores[proveedor]) {
      proveedores[proveedor] = 0;
    }
    proveedores[proveedor] += cantidad;
  }

  return proveedores;
}

function createChart() {
  const ventasCtx = (document.getElementById('ventasChart') as HTMLCanvasElement)?.getContext('2d');
  const estadoCtx = (document.getElementById('estadoChart') as HTMLCanvasElement)?.getContext('2d');
  const proveedoresCtx = (document.getElementById('proveedoresChart') as HTMLCanvasElement)?.getContext('2d');

  if (ventasCtx && estadoCtx && proveedoresCtx) {
    new Chart(ventasCtx, {
      type: 'bar',
      data: {
        labels: datos.value.productos.map(producto => producto.producto),
        datasets: [
          {
            label: 'Ventas',
            data: datos.value.productos.map(producto => producto.estado), // Aquí vendrían los 'vendidos'
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Compras',
            data: datos.value.productos.map(producto => producto.cantidad), // Aquí vendrían los 'comprados'
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      } as ChartData<'bar'>,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      } as ChartOptions<'bar'>,
    });

    new Chart(estadoCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(datos.value.estados),
        datasets: [{
          label: 'Estado de Órdenes',
          data: Object.values(datos.value.estados),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderWidth: 1,
        }],
      } as ChartData<'doughnut'>,
      options: {} as ChartOptions<'doughnut'>,
    });

    new Chart(proveedoresCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(datos.value.proveedores),
        datasets: [{
          label: 'Productos Comprados',
          data: Object.values(datos.value.proveedores),
          backgroundColor: 'rgba(255, 159, 64, 0.2)', // Color de fondo
          borderColor: 'rgba(255, 159, 64, 1)', // Color de borde
          borderWidth: 1,
        }],
      } as ChartData<'bar'>,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      } as ChartOptions<'bar'>,
    });
  }
}
</script>

<style>
.dashboard-container {
  display: flex;
  flex-direction: column; /* Cambia a disposición vertical */
  gap: 20px;
  margin-left: 280px;
  width: calc(100% - 280px); /* Ajusta el ancho según sea necesario */
  min-width: 1000px; /* Establece un ancho mínimo para mantener */
  min-height: 100vh;
  transition: margin-left 0.5s;
}

.graficas {
  display: flex;
  gap: 20px;
}

.grafica-ventas,
.grafica-estado,
.grafica-proveedores {
  flex: 1;
}

.tabla-productos {
  flex: 1;
  overflow-x: auto; /* Añade desplazamiento horizontal */
}

.tabla-productos table {
  width: 100%;
  border-collapse: collapse;
}

.tabla-productos th,
.tabla-productos td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.tabla-productos th {
  background-color: #f2f2f2;
}
.sidebar {
  transition: none; /* Eliminar la transición del ancho */
}
</style>