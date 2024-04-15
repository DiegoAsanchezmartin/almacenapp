<template>
  <div class="principal" >
    <!-- Sección de búsqueda -->
    <div class="search-section">
      <input type="text" v-model="searchQuery" placeholder="Buscar productos..." class="search-input">
      <button @click="exportToPDF" class="export-button">Exportar a PDF</button>
    </div>

    <!-- Sección de filtros -->
    <div class="filter-section">
      <div>
        <button @click="filterByAllOrders" class="filter-button">Todas las órdenes</button>
        <button @click="filterByInProgress" class="filter-button">En proceso</button>
        <button @click="filterByDelivered" class="filter-button">Entregados</button>
        <button @click="filterByCancelled" class="filter-button">Canceladas</button>
      </div>
      <div>
        <button @click="filterByDate" class="filter-button">Fecha</button>
        <button @click="filterByCategory" class="filter-button">Filtrar</button>
      </div>
    </div>

    <!-- Tabla de productos -->
    <table class="product-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Categoría</th>
          <th>Producto</th>
          <th>Stock</th>
          <th>Precio</th>
          <th>Estatus</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in paginatedData" :key="index">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ product.categoria }}</td>
          <td>{{ product.producto }}</td>
          <td>{{ product.stock }}</td>
          <td>{{ product.precio }}</td>
          <td>{{ product.status }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Controles de paginación -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
      <div class="page-buttons">
        <button v-for="pageNumber in totalPages" :key="pageNumber" @click="changePage(pageNumber)" :class="{ 'active': pageNumber === currentPage }">
          {{ pageNumber }}
        </button>
      </div>
      <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import { getDataFromJson } from '@/service/DataProductos'; // Ajusta la ruta según la ubicación de tu archivo
import { type Product } from '@/interfaces/Productos'; // Ajusta la ruta según la ubicación de tu archivo
import jsPDF from 'jspdf';
import 'jspdf-autotable';


// Datos del JSON
const jsonData = ref<Product[]>([]);
const searchQuery = ref<string>('');
const itemsPerPage = 8;
const currentPage = ref(1);

// Cargar datos del JSON al montar el componente
onMounted(async () => {
  jsonData.value = await getDataFromJson();
});


// Método para realizar la búsqueda
const searchProducts = () => {
  return jsonData.value.filter((product) => {
    return (
      product.producto.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.status.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
};

// Declara la propiedad 'autoTable' en el tipo 'jsPDF'
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Función para exportar a PDF
const exportToPDF = () => {
  const doc = new jsPDF();
  
  doc.text('Reporte de productos', 10, 10);
  // Suponiendo que tienes una variable `filteredData` con los datos filtrados
  doc.autoTable({ html: '.product-table' });
  
  doc.save('reporte_productos.pdf');
};


const filterByAllOrders = () => {
  // Lógica para filtrar todas las órdenes
};

const filterByInProgress = () => {
  // Lógica para filtrar órdenes en proceso
};

const filterByDelivered = () => {
  // Lógica para filtrar órdenes entregadas
};

const filterByCancelled = () => {
  // Lógica para filtrar órdenes canceladas
};

const filterByDate = () => {
  // Lógica para filtrar por fecha
};

const filterByCategory = () => {
  // Lógica para filtrar por categoría
};

// Datos filtrados según la búsqueda
const filteredData = computed(() => {
  return jsonData.value.filter((product) => {
    return (
      product.producto.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.status.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

// Paginación de datos
const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredData.value.slice(startIndex, endIndex);
});

// Total de páginas
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage);
});

// Funciones para cambiar de página
const changePage = (pageNumber: number) => {
  currentPage.value = pageNumber;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<style scoped>
/* Estilos para la sección de búsqueda */

.principal{
  margin-left: -380px;
  padding: 30px;
  margin-right: 100px;
}
.search-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.export-button {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.export-button:hover {
  background-color: #0056b3;
}

/* Estilos para la sección de filtros */
.filter-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filter-button {
  padding: 8px 16px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
}

.filter-button:not(:last-child) {
  margin-right: 10px;
}

.filter-button:hover {
  background-color: #138496;
}

/* Estilos para la tabla de productos */
.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th, .product-table td {
  padding: 8px;
  border-bottom: 1px solid #ccc;
}

.product-table th {
  text-align: left;
  background-color: #f8f9fa;
}

.product-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  padding: 8px 16px;
  margin: 0 4px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:hover {
  background-color: #0056b3;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-buttons {
  display: flex;
  align-items: center;
}

.page-buttons button.active {
  background-color: #17a2b8;
}
</style>
