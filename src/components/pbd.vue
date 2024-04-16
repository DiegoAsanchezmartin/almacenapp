<template>
  <div class="product-container">
    <h2>Lista de Productos</h2>

    <!-- Filtros -->
    <div class="filters">
      <input type="text" v-model="filters.nombre" placeholder="Filtrar por nombre" list="nombre-list">
      <datalist id="nombre-list">
        <option v-for="product in products" :value="product.producto" :key="product._id" />
      </datalist>

      <select v-model="filters.categoria">
        <option disabled value="">Seleccione una categoría</option>
        <option v-for="categoria in uniqueCategorias" :key="categoria">{{ categoria }}</option>
      </select>

      <select v-model="filters.status">
        <option disabled value="">Seleccione un estado</option>
        <option v-for="status in uniqueStatus" :key="status">{{ status }}</option>
      </select>

      <button @click="applyFilters" class="button-blue">Aplicar Filtros</button>
      <button @click="exportToPDF" class="button-blue">Exportar a PDF</button>
    </div>

    <!-- Botón para agregar productos -->
    <button @click="openAddModal" class="button-green">Agregar Nuevo Producto</button>

    <!-- Tabla de productos -->
    <table v-if="filteredProducts.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Stock</th>
          <th>Precio</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product._id">
          <td>{{ product._id }}</td>
          <td>{{ product.producto }}</td>
          <td>{{ product.categoria }}</td>
          <td>{{ product.stock }}</td>
          <td>{{ product.precio }}</td>
          <td>{{ product.status }}</td>
          <td>
            <button @click="openEditModal(product)" class="button-blue">Editar</button>
            <button @click="deleteProduct(product._id)" class="button-blue">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      <p>No hay productos disponibles. Haz clic en 'Agregar Nuevo Producto' para añadir uno.</p>
    </div>

    <!-- Modal de Edición -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Editar Producto</h2>
        <input type="text" v-model="editProductData.producto" placeholder="Nombre">
        <input type="text" v-model="editProductData.categoria" placeholder="Categoría">
        <input type="number" v-model="editProductData.stock" placeholder="Stock">
        <input type="number" v-model="editProductData.precio" placeholder="Precio">
        <input type="text" v-model="editProductData.status" placeholder="Estado">
        <button @click="saveProductChanges" class="button-blue">Guardar Cambios</button>
      </div>
    </div>

    <!-- Modal de Agregar Nuevo Producto -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAddModal">&times;</span>
        <h2>Agregar Nuevo Producto</h2>
        <input type="text" v-model="newProductData.producto" placeholder="Nombre">
        <input type="text" v-model="newProductData.categoria" placeholder="Categoría">
        <input type="number" v-model="newProductData.stock" placeholder="Stock">
        <input type="number" v-model="newProductData.precio" placeholder="Precio">
        <input type="text" v-model="newProductData.status" placeholder="Estado">
        <button @click="addNewProduct" class="button-green">Agregar Producto</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { obtenerProductos, eliminarProducto, actualizarProducto, crearProducto } from '@/service/DataProductos';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const products = ref([]);
const filters = ref({ producto: '', categoria: '', status: '' });
const showEditModal = ref(false);
const editProductData = ref({});
const showAddModal = ref(false);
const newProductData = ref({ producto: '', categoria: '', stock: 0, precio: 0, status: '' });

const fetchProducts = async () => {
  try {
    products.value = await obtenerProductos();
    console.log("Productos cargados exitosamente");
  } catch (error) {
    console.error("Error al cargar productos:", error.message);
    alert("Error al cargar productos");
  }
};

const applyFilters = () => {
  let filtered = products.value;
  if (filters.value.producto) {
    filtered = filtered.filter(product => product.producto.toLowerCase().includes(filters.value.producto.toLowerCase()));
  }
  if (filters.value.categoria) {
    filtered = filtered.filter(product => product.categoria === filters.value.categoria);
  }
  if (filters.value.status) {
    filtered = filtered.filter(product => product.status === filters.value.status);
  }
  return filtered;
};

const filteredProducts = computed(() => {
  return applyFilters();
});

const uniqueCategorias = computed(() => {
  return [...new Set(products.value.map(product => product.categoria))];
});

const uniqueStatus = computed(() => {
  return [...new Set(products.value.map(product => product.status))];
});

const openEditModal = (product) => {
  editProductData.value = {...product};
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const openAddModal = () => {
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const addNewProduct = async () => {
  try {
    const addedProduct = await crearProducto(newProductData.value);
    products.value.push(addedProduct);
    closeAddModal();
    alert("Producto agregado exitosamente");
  } catch (error) {
    console.error('Error al agregar producto:', error.message);
    alert("Error al agregar producto");
  }
};

const saveProductChanges = async () => {
  try {
    const updatedProduct = await actualizarProducto(editProductData.value._id, editProductData.value);
    const index = products.value.findIndex(p => p._id === editProductData.value._id);
    if (index !== -1) {
      products.value[index] = updatedProduct;
    }
    showEditModal.value = false;
    console.log('Producto actualizado exitosamente');
    alert('Producto actualizado exitosamente');
  } catch (error) {
    console.error('Error al guardar cambios:', error.message);
    alert("Error al guardar cambios");
  }
};

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text('Productos', 10, 10);
  doc.autoTable({
    head: [['ID', 'Nombre', 'Categoría', 'Stock', 'Precio', 'Estado']],
    body: filteredProducts.value.map(p => [p._id, p.producto, p.categoria, p.stock, p.precio, p.status]),
    startY: 20,
  });
  doc.save('productos.pdf');
};

onMounted(fetchProducts);
</script>

<style>
/* Estilos CSS */
</style>
