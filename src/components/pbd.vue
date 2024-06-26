<template>
  <div class="product-container">
    <h2>Lista de Productos</h2>
    <!-- Barra de Filtros -->
    <div class="filters">
      <input type="text" v-model="filters.nombre" placeholder="Filtrar por nombre" list="nombre-list">
      <datalist id="nombre-list">
        <option v-for="product in products" :value="product.nombre" :key="product._id"/>
      </datalist>
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


    <!-- Modal de Agregar Nuevo Producto -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAddModal">&times;</span>
        <h2>Agregar Nuevo Producto</h2>
        <form @submit.prevent="validateAndAddProduct" class="form-container">
          <label for="addNombre">Nombre</label>
          <input id="addNombre" type="text" v-model="newProductData.nombre">
          <p v-if="newProductErrors.nombre" class="error-message">{{ newProductErrors.nombre }}</p>
          <label for="addCategoria">Categoría</label>
          <input id="addCategoria" type="text" v-model="newProductData.categoria">
          <p v-if="newProductErrors.categoria" class="error-message">{{ newProductErrors.categoria }}</p>
          <label for="addStock">Stock</label>
          <input id="addStock" type="number" v-model="newProductData.stock">
          <p v-if="newProductErrors.stock" class="error-message">{{ newProductErrors.stock }}</p>
          <label for="addPrecio">Precio</label>
          <input id="addPrecio" type="number" v-model="newProductData.precio">
          <p v-if="newProductErrors.precio" class="error-message">{{ newProductErrors.precio }}</p>
          <label for="addStatus">Estado</label>
          <input id="addStatus" type="text" v-model="newProductData.status">
          <p v-if="newProductErrors.status" class="error-message">{{ newProductErrors.status }}</p>
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
const showAddModal = ref(false);
const newProductData = ref({ nombre: '', categoria: '', stock: null, precio: null, status: '' });
const notification = ref({ show: false, message: '', type: '' });

const newProductErrors = ref({ nombre: '', categoria: '', stock: '', precio: '', status: '' });

const validateAndAddProduct = async () => {
  // Reiniciamos los errores
  newProductErrors.value = { nombre: '', categoria: '', stock: '', precio: '', status: '' };
  
  // Validamos los campos
  let isValid = true;
  if (!newProductData.value.nombre.trim()) {
    newProductErrors.value.nombre = 'El nombre del producto es requerido';
    isValid = false;
  }
  if (!newProductData.value.categoria.trim()) {
    newProductErrors.value.categoria = 'La categoría del producto es requerida';
    isValid = false;
  }
  if (isNaN(newProductData.value.stock) || newProductData.value.stock === null || newProductData.value.stock < 0) {
    newProductErrors.value.stock = 'El stock debe ser un número positivo';
    isValid = false;
  }
  if (isNaN(newProductData.value.precio) || newProductData.value.precio === null || newProductData.value.precio < 0) {
    newProductErrors.value.precio = 'El precio debe ser un número positivo';
    isValid = false;
  }
  if (!newProductData.value.status.trim()) {
    newProductErrors.value.status = 'El estado del producto es requerido';
    isValid = false;
  }
  
  // Si no hay errores, agregamos el producto
  if (isValid) {
    addNewProduct();
  }
};

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

const filteredProducts = computed(() => {
  return products.value.filter(p => 
  (!filters.value.nombre || p.nombre.toLowerCase().includes(filters.value.nombre.toLowerCase())) &&
  (!filters.value.estado || p.status === filters.value.estado) &&
  (!filters.value.categoria || p.categoria === filters.value.categoria));
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
const exportToPDF = (filtered = false) => {
  try {
    const doc = new jsPDF();
    doc.text('Lista de Productos', 10, 10);
    let tableData = [];

    if (filtered) {
      tableData = filteredProducts.value.map(p => {
        return [
          p._id,
          p.nombre,
          p.categoria,
          p.stock,
          p.precio != null ? `$${p.precio.toFixed(2)}` : '', // Verificación de null
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
.error-message {
  color: red;
  margin-top: 5px;
  font-size: 12px;
}
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
  width: 100px; 
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
