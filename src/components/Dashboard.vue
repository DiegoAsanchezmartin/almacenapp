<template>
    <div>
      <Sidebar />
      <div class="dashboard-container">
        <div class="dashboard-header">
          <h1>Dashboard</h1>
        </div>
        <div class="grafica-ventas">
          <h2>Ventas Últimos 7 Días</h2>
          <canvas id="ventasChart"></canvas>
        </div>
        <div class="grafica-ordenes">
          <h2>Órdenes Recientes</h2>
          <canvas id="ordenesChart"></canvas>
        </div>
        <!-- Agrega aquí más gráficas si es necesario -->
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, nextTick } from 'vue';
  import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
  import Sidebar from '@/components/Sidebar.vue';
  import { getData } from '@/service/DataService';
  
  Chart.register(...registerables);
  
  interface Venta {
    fecha: string;
    ventas: number;
  }
  
  interface Orden {
    fecha: string;
    cantidad: number;
  }
  
  const datos = ref({
    ventasUltimos7Dias: [] as Venta[],
    ordenesRecientes: [] as Orden[],
  });
  
  onMounted(async () => {
    const data = await getData(); // Asegúrate de que esta función devuelve los datos en el formato correcto
    if (data) {
      datos.value = data;
      nextTick(() => {
        createChart();
      });
    }
  });
  
  function createChart() {
    const ventasCtx = (document.getElementById('ventasChart') as HTMLCanvasElement)?.getContext('2d');
    const ordenesCtx = (document.getElementById('ordenesChart') as HTMLCanvasElement)?.getContext('2d');
  
    if (ventasCtx) {
      new Chart(ventasCtx, {
        type: 'line',
        data: {
          labels: datos.value.ventasUltimos7Dias.map(venta => venta.fecha),
          datasets: [{
            label: 'Ventas',
            data: datos.value.ventasUltimos7Dias.map(venta => venta.ventas),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }],
        } as ChartData<'line'>,
        options: {} as ChartOptions<'line'>
      });
    }
  
    if (ordenesCtx) {
      new Chart(ordenesCtx, {
        type: 'bar',
        data: {
          labels: datos.value.ordenesRecientes.map(orden => orden.fecha),
          datasets: [{
            label: 'Órdenes',
            data: datos.value.ordenesRecientes.map(orden => orden.cantidad),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }],
        } as ChartData<'bar'>,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        } as ChartOptions<'bar'>
      });
    }
  }
  </script>
  
  <style>
  .dashboard-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-left: 280px;
    width: calc(100% - 280px);
    min-height: 100vh;
    transition: margin-left 0.5s;
  }
  
  /* Añade más estilos según sea necesario */
  </style>
  