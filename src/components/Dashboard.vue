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
            <tr v-for="producto in datos.productos" :key="producto.nombre">
              <td>{{ producto.nombre }}</td>
              <td>{{ producto.vendidos }}</td>
              <td>{{ producto.comprados }}</td>
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
import { getReportData } from '@/service/ReportService';
import type { Orden } from '@/interfaces/reportTypes';

Chart.register(...registerables);

interface Producto {
  nombre: string;
  vendidos: number;
  comprados: number;
  diferencia: number;
}

const datos = ref({
  productos: [] as Producto[],
  estados: {} as Record<string, number>,
  proveedores: {},
});

onMounted(async () => {
  try {
    const reportData = await getReportData();
    if (reportData) {
      datos.value.productos = processData(reportData);
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

function processData(reportData: any[]) {
  const productos: Producto[] = [];
  const productMap = new Map<string, { vendidos: number, comprados: number }>();
  
  for (const item of reportData) {
    const { producto, cantidad, estado } = item;
    if (!productMap.has(producto)) {
      productMap.set(producto, { vendidos: 0, comprados: 0 });
    }
    const product = productMap.get(producto)!;
    if (estado === 'Vendido') {
      product.vendidos += cantidad;
    } else if (estado === 'Entregado') {
      product.comprados += cantidad;
    }
  }
  
  for (const [producto, { vendidos, comprados }] of productMap.entries()) {
    const diferencia = vendidos - comprados;
    productos.push({ nombre: producto, vendidos, comprados, diferencia });
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

  reportData.forEach(item => {
    const { proveedor, cantidad } = item;
    if (!proveedores[proveedor]) {
      proveedores[proveedor] = 0;
    }
    proveedores[proveedor] += cantidad;
  });

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
        labels: datos.value.productos.map(producto => producto.nombre),
        datasets: [
          {
            label: 'Ventas',
            data: datos.value.productos.map(producto => producto.vendidos),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Compras',
            data: datos.value.productos.map(producto => producto.comprados),
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
  gap: 20px;
  margin-left: 280px;
  width: calc(100% - 280px);
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
</style>
