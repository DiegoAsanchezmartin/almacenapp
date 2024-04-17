<template>
  <div class="product-container">
    <h2>Lista de Productos</h2>
    <!-- Barra de Filtros -->
    <div class="filters">
      <input type="text" v-model="filters.nombre" placeholder="Filtrar por nombre" list="nombre-list">
      <datalist id="nombre-list">
        <option v-for="product in products" :value="product.nombre" :key="product._id"/>
      </datalist>
      <select v-model="filters.categoria">
        <option disabled value="">Seleccione una categoría</option>
        <option v-for="categoria in uniqueCategorias" :key="categoria">{{ categoria }}</option>
      </select>
      <select v-model="filters.estado">
        <option disabled value="">Seleccione un estado</option>
        <option v-for="estado in uniqueEstados" :key="estado">{{ estado }}</option>
      </select> 
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
          <label for="editCategoria">Categoria</label>
          <input id="editCategoria" type="text" v-model="editProductData.categoria">
          <label for="editStock">Stock</label>
          <input id="editStock" type="number" v-model="editProductData.stock">
          <label for="editPrecio">Precio</label>
          <input id="editPrecio" type="number" v-model="editProductData.precio">
          <label for="editStatus">Estado</label>
          <input id="editStatus" type="text" v-model="editProductData.status">
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
          <label for="addCategoria">Categoria</label>
          <input id="addCategoria" type="text" v-model="newProductData.categoria">
          <label for="addStock">Stock</label>
          <input id="addStock" type="number" v-model="newProductData.stock">
          <label for="addPrecio">Precio</label>
          <input id="addPrecio" type="number" v-model="newProductData.precio">
          <label for="addStatus">Status</label>
          <input id="addStatus" type="text" v-model="newProductData.status">
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
const filters = ref({ nombre: '', estado: '', categoria: '' });
const showEditModal = ref(false);
const editProductData = ref({});
const showAddModal = ref(false);
const newProductData = ref({ nombre: '', categoria: '', stock: 0, precio: 0, status: '' });
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
  filters.value = { nombre: '', estado: '', categoria: '' };
};

const uniqueEstados = computed(() => [...new Set(products.value.map(p => p.status))]);
const uniqueCategorias = computed(() => [...new Set(products.value.map(p => p.categoria))]);

const filteredProducts = computed(() => {
  let filtered = products.value;
  if (filters.value.nombre) {
    filtered = filtered.filter(p => p.nombre.toLowerCase().includes(filters.value.nombre.toLowerCase()));
  }
  if (filters.value.estado) {
    filtered = filtered.filter(p => p.status === filters.value.estado);
  }
  if (filters.value.categoria) {
    filtered = filtered.filter(p => p.categoria === filters.value.categoria);
  }
  return filtered;
});

const statusClass = (status) => {
  switch (status) {
    case 'disponible': return 'status-green';
    case 'poco stock': return 'status-yellow';
    case 'agotado': return 'status-red';
    case 'solicitado': return 'status-blue';
    case 'retirado': return 'status-purple';
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

const deleteProduct = async (id) => {
  try {
    await eliminarProducto(id);
    products.value = products.value.filter((product) => product._id !== id);
    notify('success', 'Producto eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    notify('error', 'Error al eliminar producto');
  }
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
    console.log(updatedProduct);
    notify('success', 'Producto actualizado exitosamente');
  } catch (error) {
    console.error('Error al guardar cambios:', error.message);
    notify('error', 'Error al guardar cambios');
  }
};

const exportToPDF = () => {
  try {
    const doc = new jsPDF();
    doc.text('Lista de Productos', 10, 10);
    let tableData = [];

    if (filteredProducts.value.length > 0) {
      tableData = filteredProducts.value.map(p => {
        return [
          p._id,
          p.nombre,
          p.categoria,
          p.stock,
          p.precio != null ? `$${p.precio.toFixed(2)}` : '', 
          p.status
        ];
      });
    } else {
      tableData = products.value.map(p => {
        return [
          p._id,
          p.nombre,
          p.categoria,
          p.stock,
          p.precio != null ? `$${p.precio.toFixed(2)}` : '', // Verificación de null
          p.status
        ];
      });
    }

    doc.autoTable({
      head: [['ID', 'Nombre', 'Categoría', 'Stock', 'Precio', 'Estado']],
      body: tableData,
      startY: 20,
    });
    doc.save('productos.pdf');
  } catch (error) {
    console.error('Error al exportar a PDF:', error.message);
    notify('error', 'Error al exportar a PDF');
  }
};

onMounted(fetchProducts);
</script>


<style>
/* Estilos para el modal de edición y el modal de agregar nuevo producto */
.modal {
  display: none; /* Ocultamos el modal por defecto */
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
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Agregamos sombra */
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

/* Estilos para el formulario dentro del modal */
.form-container {
  display: grid;
  gap: 15px;
}

.form-container label {
  font-weight: bold;
}

.form-container input[type="text"],
.form-container input[type="number"] {
  width: calc(100% - 20px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-container button[type="submit"] {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.form-container button[type="submit"]:hover {
  background-color: #0056b3;
}
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
  margin-left: -320px;
  width: 90%;
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

.status-red { color: #ff0000; } /* Disponible */
.status-blue { color: #007bff; } /* Poco stock */
.status-green { color: #28a745; } /* Agotado */
.status-yellow { color: #ffff00; } /* Solicitado */
.status-purple { color: #800080; } /* Retirado */


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
