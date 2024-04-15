<template>
  <div class="product-container">
    <h2>Lista de Productos</h2>

    <!-- Filtros -->
    <div class="filters">
      <input type="text" v-model="filters.nombre" placeholder="Filtrar por nombre" list="nombre-list">
      <datalist id="nombre-list">
        <option v-for="product in products" :value="product.producto" :key="product._id" />
      </datalist>

      <select v-model="filters.estado">
        <option disabled value="">Seleccione un estado</option>
        <option v-for="estado in uniqueEstados" :key="estado">{{ estado }}</option>
      </select>

      <input type="date" v-model="filters.fecha" list="fecha-list">
      <datalist id="fecha-list">
        <option v-for="product in products" :value="product.fecha" :key="product.fecha" />
      </datalist>

      <button @click="applyFilters" class="button-blue">Aplicar Filtros</button>
      <button @click="exportToPDF" class="button-blue">Exportar a PDF</button>
    </div>

    <!-- Botón para agregar productos -->
    <button @click="openAddModal" class="button-green">Agregar Nuevo Producto</button>

    <!-- Tabla de productos -->
    <table v-if="products.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Proveedor</th>
          <th>Método de pago</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product._id">
          <td>{{ product._id }}</td>
          <td>{{ product.producto }}</td>
          <td>{{ product.cantidad }}</td>
          <td>{{ product.precio }}</td>
          <td>{{ product.proveedor }}</td>
          <td>{{ product.metodo_pago }}</td>
          <td>{{ product.estado }}</td>
          <td>{{ product.fecha }}</td>
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
        <input type="number" v-model="editProductData.cantidad" placeholder="Cantidad">
        <input type="number" v-model="editProductData.precio" placeholder="Precio">
        <input type="text" v-model="editProductData.proveedor" placeholder="Proveedor">
        <input type="text" v-model="editProductData.metodo_pago" placeholder="Método de pago">
        <input type="text" v-model="editProductData.estado" placeholder="Estado">
        <input type="date" v-model="editProductData.fecha" placeholder="Fecha">
        <button @click="saveProductChanges" class="button-blue">Guardar Cambios</button>
      </div>
    </div>

    <!-- Modal de Agregar Nuevo Producto -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAddModal">&times;</span>
        <h2>Agregar Nuevo Producto</h2>
        <input type="text" v-model="newProductData.producto" placeholder="Nombre">
        <input type="number" v-model="newProductData.cantidad" placeholder="Cantidad">
        <input type="number" v-model="newProductData.precio" placeholder="Precio">
        <input type="text" v-model="newProductData.proveedor" placeholder="Proveedor">
        <input type="text" v-model="newProductData.metodo_pago" placeholder="Método de pago">
        <input type="text" v-model="newProductData.estado" placeholder="Estado">
        <input type="date" v-model="newProductData.fecha" placeholder="Fecha">
        <button @click="addNewProduct" class="button-green">Agregar Producto</button>
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref, computed, onMounted } from 'vue';
import { obtenerProductos, eliminarProducto, actualizarProducto, crearProducto } from '@/service/AdminPro';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const products = ref([]);
const filters = ref({ nombre: '', estado: '', fecha: '' });
const showEditModal = ref(false);
const editProductData = ref({});
const showAddModal = ref(false);
const newProductData = ref({ producto: '', cantidad: 0, precio: 0, proveedor: '', metodo_pago: '', estado: '', fecha: '' });

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
  fetchProducts();
};

const uniqueEstados = computed(() => {
  return [...new Set(products.value.map(product => product.estado))];
});

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    return (!filters.value.nombre || product.producto.toLowerCase().includes(filters.value.nombre.toLowerCase())) &&
           (!filters.value.estado || product.estado === filters.value.estado) &&
           (!filters.value.fecha || new Date(product.fecha).toLocaleDateString() === new Date(filters.value.fecha).toLocaleDateString());
  });
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
    head: [['ID', 'Nombre', 'Cantidad', 'Precio', 'Proveedor', 'Método de pago', 'Estado', 'Fecha']],
    body: filteredProducts.value.map(p => [p._id, p.producto, p.cantidad, p.precio, p.proveedor, p.metodo_pago, p.estado, p.fecha]),
    startY: 20,
  });
  doc.save('productos.pdf');
};

onMounted(fetchProducts);
</script>



<style>
.product-container {
  width: 80%;
  margin: auto;
  padding: 20px;
}

.filters, .actions {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.filters input[type="text"], .filters select, .filters input[type="date"] {
  margin-right: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

.button-blue {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
}

.button-green {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
}

.button-blue:hover, .button-green:hover {
  opacity: 0.8;
}

.modal {
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover, .close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>

