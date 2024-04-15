<template>
  <div class="app-container">
    <Sidebar class="app-sidebar" />
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
      </div>
      <div class="data-cards">
        <div class="card ventas">
          <h2>Sumatoria - Ventas</h2>
          <div v-for="(venta, index) in datos.ventasUltimos7Dias" :key="index" class="data-item venta-item">
            <p>{{ venta.fecha }}: {{ venta.ventas }}</p>
          </div>
        </div>
        <div class="card primeras-entradas">
          <h2>Primeras Entradas</h2>
          <div v-for="(entrada, index) in datos.primerasEntradas" :key="index" class="data-item entrada-item">
            <p>{{ entrada.fecha }}: {{ entrada.cantidad }}</p>
          </div>
        </div>
        <div class="card primeras-salidas">
          <h2>Primeras Salidas</h2>
          <div v-for="(salida, index) in datos.primerasSalidas" :key="index" class="data-item salida-item">
            <p><strong>Fecha:</strong> {{ salida.fecha }} - <strong>Cantidad:</strong> {{ salida.cantidad }}</p>
          </div>
        </div>
      </div>
      <div class="graficas-container">
        <div class="grafica-ventas">
          <h2>Ventas Últimos 7 Días</h2>
          <canvas id="ventasChart"></canvas>
        </div>
        <div class="grafica-entradas">
          <h2>Primeras Entradas</h2>
          <canvas id="entradasChart"></canvas>
        </div>
        <div class="grafica-salidas">
          <h2>Primeras Salidas</h2>
          <canvas id="salidasChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import Sidebar from '@/components/Sidebar.vue';
import { getData } from '@/service/DataService.ts';

Chart.register(...registerables);

const datos = ref({
  ventasUltimos7Dias: [],
  primerasEntradas: [],
  primerasSalidas: []
});

const createVentasChart = (data) => {
  const ctx = document.getElementById('ventasChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(venta => venta.fecha),
      datasets: [{
        label: 'Ventas Últimos 7 Días',
        data: data.map(venta => venta.ventas),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
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
};

const createEntradasChart = (data) => {
  const ctx = document.getElementById('entradasChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.map(entrada => entrada.fecha),
      datasets: [{
        label: 'Primeras Entradas',
        data: data.map(entrada => entrada.cantidad),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
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
};

const createSalidasChart = (data) => {
  const ctx = document.getElementById('salidasChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(salida => salida.fecha),
      datasets: [{
        label: 'Primeras Salidas',
        data: data.map(salida => salida.cantidad),
        backgroundColor: 'rgb(255, 99, 132)'
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
};

onMounted(async () => {
  const data = await getData();
  if (data) {
    datos.value.ventasUltimos7Dias = data.ventasUltimos7Dias;
    datos.value.primerasEntradas = data.primerasEntradas;
    datos.value.primerasSalidas = data.primerasSalidas;
    nextTick(() => {
      createVentasChart(datos.value.ventasUltimos7Dias);
      createEntradasChart(datos.value.primerasEntradas);
      createSalidasChart(datos.value.primerasSalidas);
    });
  }
});
</script>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
}

.app-sidebar {
  width: 280px;
  /* Estilos adicionales para tu sidebar */
}

.dashboard-container {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin-left: -400px;
}

.dashboard-header h1 {
  color: #3A5BFF;
}

.data-cards {
  display: flex;
  justify-content: space-between;
}

.card {
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-right: 20px;
}

.card:last-child {
  margin-right: 0;
}

.card h2 {
  color: #45464e;
  margin-bottom: 20px;
}

.data-item {
  padding: 10px 0;
}

.data-item p {
  margin: 0;
  padding: 5px 0;
  line-height: 1.5;
}

.graficas-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}

.grafica-ventas,
.grafica-entradas,
.grafica-salidas {
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}

.grafica-ventas:last-child,
.grafica-entradas:last-child,
.grafica-salidas:last-child {
  margin-right: 0;
}
</style>
