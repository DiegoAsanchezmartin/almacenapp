<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    
    <!-- Sección de gráficas -->
    <div class="charts-section">
      <div class="chart">
        <h2>Fechas</h2>
        <canvas id="polarAreaChart"></canvas>
      </div>
      <div class="chart">
        <h2>Ventas</h2>
        <canvas id="stackedChart"></canvas>
      </div>
      <div class="chart">
        <h2>Stock</h2>
        <canvas id="doughnutChart"></canvas>
      </div>
    </div>

    <!-- Sección de datos de pedidos -->
    <div class="data-section">
      <h2>Pedidos</h2>
      <div class="data-cards">
        <div class="card-container">
          <div class="card" v-for="(pedido, index) in pedidos" :key="'pedido-' + index">
            <p><strong>Producto:</strong> {{ pedido.nombre }}</p>
            <p><strong>Cantidad:</strong> {{ pedido.cantidad }}</p>
            <p><strong>Precio:</strong> {{ pedido.precio }}</p>
            <p><strong>Proveedor:</strong> {{ pedido.proveedor }}</p>
            <p><strong>Método de pago:</strong> {{ pedido.metodo_pago }}</p>
            <p><strong>Estado:</strong> {{ pedido.estado }}</p>
            <p><strong>Fecha:</strong> {{ pedido.fecha }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sección de datos de productos -->
    <div class="data-section">
      <h2>Productos</h2>
      <div class="data-cards">
        <div class="card-container">
          <div class="card" v-for="(producto, index) in productos" :key="'producto-' + index">
            <p><strong>Nombre:</strong> {{ producto.nombre }}</p>
            <p><strong>Precio:</strong> {{ producto.precio }}</p>
            <p><strong>Categoría:</strong> {{ producto.categoria }}</p>
            <p><strong>Stock:</strong> {{ producto.stock }}</p>
            <p><strong>status:</strong> {{ producto.status }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getData } from '@/service/DataService';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Registra todas las funcionalidades necesarias de Chart.js

const pedidos = ref([]);
const productos = ref([]);
let polarAreaChart: Chart | null = null;
let stackedChart: Chart | null = null;
let doughnutChart: Chart | null = null;

const renderPolarAreaChart = () => {
  const ctx = document.getElementById('polarAreaChart') as HTMLCanvasElement | null;
  if (ctx) {
    polarAreaChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: pedidos.value.map((pedido: any) => pedido.fecha),
        datasets: [{
          label: 'Cantidad de pedidos',
          data: pedidos.value.map((pedido: any) => pedido.cantidad),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
};

const renderStackedChart = () => {
  const ctx = document.getElementById('stackedChart') as HTMLCanvasElement | null;
  if (ctx) {
    stackedChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Ventas',
          data: [10, 30, 39, 20, 25, 34, -10],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }, {
          label: 'Entradas',
          data: [18, 33, 22, 19, 11, 39, 30],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
};

const renderDoughnutChart = () => {
  const ctx = document.getElementById('doughnutChart') as HTMLCanvasElement | null;
  if (ctx) {
    doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Coca-cola', 'Blusa', 'Adidas', 'telefonos', 'Cafetera', 'Cereal de arroz'],
        datasets: [{
          label: 'My First Dataset',
          data: [300, 50, 100, 40, 120, 200],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 205, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          hoverOffset: 4
        }]
      }
    });
  }
};

onMounted(async () => {
  pedidos.value = await getData('pedidos');
  productos.value = await getData('productos');
  
  renderPolarAreaChart();
  renderStackedChart();
  renderDoughnutChart();
});
</script>


<style>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10%;
}

.data-section {
  margin-bottom: 20px;
}

.data-section h2 {
  margin-bottom: 10px;
}

.data-cards {
  overflow-x: auto;
  white-space: nowrap;
}

.card-container {
  display: inline-block;
}

.card {
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  display: inline-block;
  vertical-align: top;
}

.card h2 {
  color: #45464e;
  margin-bottom: 20px;
}

.data-item p {
  margin: 0;
  padding: 5px 0;
  line-height: 1.5;
}

ul {
  list-style-type: none;
  padding: 0;
}

.charts-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.chart {
  width: 30%;
  margin-bottom: 20px;
}

canvas {
  width: 100%;
}
</style>
