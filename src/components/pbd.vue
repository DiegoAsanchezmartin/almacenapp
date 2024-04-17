<template>
  <div class="product-container">
    <h2>Lista de Productos</h2>
    <!-- Barra de Filtros -->
    <div class="filters">
      <input type="text" v-model="filters.nombre" placeholder="Filtrar por nombre" list="nombre-list">
      <datalist id="nombre-list">
        <option v-for="product in products" :value="product.producto" :key="product._id"/>
      </datalist>
      <select v-model="filters.estado">
        <option disabled value="">Seleccione un estado</option>
        <option v-for="estado in uniqueEstados" :key="estado">{{ estado }}</option>
      </select>
      <input type="date" v-model="filters.fecha" list="fecha-list">
      <datalist id="fecha-list">
        <option v-for="product in products" :value="product.fecha" :key="product._id"/>
      </datalist>
      <button @click="exportToPDF" class="button-blue">Exportar a PDF</button>
      <button @click="clearFilters" class="button-blue">Limpiar Filtros</button>
    </div>

    
    <!-- Botón para agregar productos -->
    <button @click="openAddModal" class="button-green"><i class="fas fa-plus"></i> Agregar Nuevo Producto</button>

    <!-- Tabla de productos -->
    <table v-if="products.length > 0">
      <thead>
        <tr>
          <th @click="sortById">ID &#x25B2;&#x25BC;</th>
          <th>Nombre</th>
          <th>Categoria</th>
          <th>Stock</th>
          <th>Precio</th>
          <th>Status</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product._id">
          <td>{{ product._id }}</td>
          <td>{{ product.nombre }}</td>
          <td>{{ product.categoria }}</td>
          <td>{{ product.stock }}</td>
          <td>{{ product.precio }}</td>
          <td :class="statusClass(product.status)">{{ product.status }}</td>
          <td>
            <button @click="openEditModal(product)" class="icon-button"><i class="fas fa-edit"></i></button>
            <button @click="deleteProduct(product._id)" class="icon-button"><i class="fas fa-trash-alt"></i></button>
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
        <form @submit.prevent="saveProductChanges" class="form-container">
          <label for="editNombre">Nombre</label>
          <input id="editNombre" type="text" v-model="editProductData.nombre">
          <label for="editCantidad">Categoria</label>
          <input id="editCantidad" type="text" v-model="editProductData.categoria">
          <label for="editPrecio">Stock</label>
          <input id="editPrecio" type="number" v-model="editProductData.stock">
          <label for="editProveedor">Precio</label>
          <input id="editProveedor" type="number" v-model="editProductData.precio">
          <label for="editEstado">Estado</label>
          <input id="editEstado" type="text" v-model="editProductData.status">
          <button type="submit" class="button-blue">Guardar Cambios</button>
        </form>
      </div>
    </div>

    <!-- Modal de Agregar Nuevo Producto -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAddModal">&times;</span>
        <h2>Agregar Nuevo Producto</h2>
        <form @submit.prevent="addNewProduct" class="form-container">
          <label for="addNombre">Nombre</label>
          <input id="addNombre" type="text" v-model="newProductData.nombre">
          <label for="addCantidad">Categoria</label>
          <input id="addCantidad" type="text" v-model="newProductData.cantidad">
          <label for="addProveedor">Stock</label>
          <input id="addProveedor" type="number" v-model="newProductData.stock">
          <label for="addPrecio">Precio</label>
          <input id="addPrecio" type="number" v-model="newProductData.precio">
          <label for="addEstado">Status</label>
          <input id="addEstado" type="text" v-model="newProductData.status">
          <button type="submit" class="button-green">Agregar Producto</button>
        </form>
      </div>
    </div>
        <!-- Notificaciones -->
        <div v-if="notification.show" :class="['notification', notification.type]">
      <i :class="notificationIcon"></i> {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { obtenerProductos, eliminarProducto, actualizarProducto, crearProducto } from '@/service/DataProductos';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const products = ref([]);
const filters = ref({ nombre: '', status: '', categoria: '' });
const showEditModal = ref(false);
const editProductData = ref({});
const showAddModal = ref(false);
const newProductData = ref({ nombre: '', categoria: '', stock:0, precio: 0, status: '', });
const notification = ref({ show: false, message: '', type: '' });

const notificationIcon = computed(() => {
  return notification.value.type === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle';
});

function notify(type, message) {
  notification.value = { show: true, type, message };
  setTimeout(() => notification.value.show = false, 3000);
}

const fetchProducts = async () => {
  try {
    products.value = await obtenerProductos();
  } catch (error) {
    console.error("Error al cargar productos:", error.message);
  }
};

const clearFilters = () => {
  filters.value = { nombre: '', estado: '', fecha: '' };
};

const uniqueEstados = computed(() => [...new Set(products.value.map(p => p.estado))]);

const filteredProducts = computed(() => {
  return products.value.filter(p => (!filters.value.producto || p.producto.toLowerCase().includes(filters.value.nombre.toLowerCase())) &&
                                     (!filters.value.status || p.estado === filters.value.status) &&
                                     (!filters.value.categoria || new Date(p.categoria).toISOString().slice(0, 10) === filters.value.categoria));
});

const statusClass = (status) => {
  switch (status) {
    case 'Cancelado': return 'status-red';
    case 'En proceso': return 'status-blue';
    case 'Entregado': return 'status-green';
    case 'Pendiente': return 'status-yellow';
    case 'En tránsito': return 'status-purple';
    default: return '';
  }
};

const openEditModal = (product) => {
  editProductData.value = { ...product };
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
    notify('success', 'Producto agregado exitosamente');
  } catch (error) {
    console.error('Error al agregar producto:', error.message);
    notify('error', 'Error al agregar producto');
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
    notify('success', 'Producto actualizado exitosamente');
  } catch (error) {
    console.error('Error al guardar cambios:', error.message);
    notify('error', 'Error al guardar cambios');
  }
};

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text('Productos', 10, 10);
  doc.autoTable({
    head: [['ID', 'Nombre', 'Cantidad', 'Precio', 'Proveedor', 'Método de pago', 'Estado', 'Fecha']],
    body: filteredProducts.value.map(p => [p._id, p.producto, p.cantidad.toString(), `$${p.precio.toFixed(2)}`, p.proveedor, p.metodo_pago, p.estado, new Date(p.fecha).toLocaleDateString()]),
    startY: 20,
  });
  doc.save('productos.pdf');
};

onMounted(fetchProducts);
</script>

<style>
.icon-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: inherit; 
  transition: color 0.3s; 
}

.icon-button:hover {
  color: #007bff; 
}

.product-container {
  width: 80%;
  margin-right: 100px;
  padding: 20px;
}

.filters, .actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters input[type="text"], .filters select, .filters input[type="date"] {
  margin-right: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;
}

.button-blue {
  background-color: #007bff;
  color: white;
}

.button-green {
  background-color: #28a745;
  color: white;
}

.button-blue:hover, .button-green:hover {
  opacity: 0.8;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  cursor: pointer;
}

th:hover {
  background-color: #e2e2e2;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  padding: 20px;
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
  border-radius: 8px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}

.status-red { color: #ff0000; } /* Cancelado */
.status-blue { color: #007bff; } /* En proceso */
.status-green { color: #28a745; } /* Entregado */
.status-yellow { color: #ffff00; } /* Pendiente */
.status-purple { color: #800080; } /* En tránsito */

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #f4f4f4;
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  animation: slide-in 0.5s ease-out;
}

.notification.success {
  border-color: green;
  color: green;
}

.notification.error {
  border-color: red;
  color: red;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
