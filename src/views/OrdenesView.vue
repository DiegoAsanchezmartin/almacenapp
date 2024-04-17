<template>
  <div class="product-container">
    <h2>Lista de Pedidos</h2>
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
    <button @click="openAddModal" class="button-green"><i class="fas fa-plus"></i> Agregar Nuevo Pedido</button>

    <!-- Tabla de productos -->
    <table v-if="products.length > 0">
      <thead>
        <tr>
          <th @click="sortById">ID &#x25B2;&#x25BC;</th>
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
          <td :class="statusClass(product.estado)">{{ product.estado }}</td>
          <td>{{ product.fecha }}</td>
          <td>
            <button @click="openEditModal(product)" class="icon-button"><i class="fas fa-edit"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      <p>No hay productos disponibles. Haz clic en 'Agregar Nuevo Pedido' para añadir uno.</p>
    </div>

    <!-- Modal de Edición -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Editar Producto</h2>
        <form @submit.prevent="saveProductChanges" class="form-container">
          <div class="form-group">
            <label for="editNombre">Nombre</label>
            <input id="editNombre" type="text" v-model="editProductData.producto">
            <!-- Validación de nombre -->
            <span v-if="editProductData.producto === ''" class="error-message">El nombre es requerido.</span>
            <span v-else-if="editProductData.producto.length < 5" class="error-message">El nombre debe tener al menos 5 caracteres.</span>
          </div>
          <div class="form-group">
            <label for="editCantidad">Cantidad</label>
            <input id="editCantidad" type="number" v-model="editProductData.cantidad">
            <!-- Validación de cantidad -->
            <!-- Aquí puedes agregar la validación que consideres necesaria -->
          </div>
          <div class="form-group">
            <label for="editPrecio">Precio</label>
            <input id="editPrecio" type="number" v-model="editProductData.precio">
            <!-- Validación de precio -->
            <!-- Aquí puedes agregar la validación que consideres necesaria -->
          </div>
          <div class="form-group">
            <label for="editProveedor">Proveedor</label>
            <input id="editProveedor" type="text" v-model="editProductData.proveedor">
            <!-- Validación de proveedor -->
            <!-- Aquí puedes agregar la validación que consideres necesaria -->
          </div>
          <div class="form-group">
            <label for="editMetodo">Método de Pago</label>
            <select id="editMetodo" v-model="editProductData.metodo_pago">
              <option disabled value="">Seleccione un método de pago</option>
              <option v-for="metodo in metodosPago" :key="metodo">{{ metodo }}</option>
            </select>
            <!-- Validación de método de pago -->
            <span v-if="editProductData.metodo_pago === ''" class="error-message">Seleccione un método de pago.</span>
          </div>
          <div class="form-group">
            <label for="editEstado">Estado</label>
            <select id="editEstado" v-model="editProductData.estado">
              <option disabled value="">Seleccione un estado</option>
              <option v-for="estado in uniqueEstados" :key="estado">{{ estado }}</option>
            </select>
            <!-- Validación de estado -->
            <span v-if="editProductData.estado === ''" class="error-message">Seleccione un estado.</span>
          </div>
          <div class="form-group">
            <label for="editFecha">Fecha</label>
            <input id="editFecha" type="date" v-model="editProductData.fecha">
            <!-- Validación de fecha -->
          </div>
          <button type="submit" class="button-blue">Guardar Cambios</button>
        </form>
      </div>
    </div>

    <!-- Modal de Agregar Nuevo Producto -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAddModal">&times;</span>
        <h2>Agregar Nuevo Pedido</h2>
        <form @submit.prevent="addNewProduct" class="form-container">
          <div class="form-group" :class="{ 'has-error': newProductData.producto === '' }">
            <label for="addNombre">Nombre</label>
            <input id="addNombre" type="text" v-model="newProductData.producto" required minlength="5">
            <!-- Validación de nombre -->
            <span v-if="newProductData.producto === ''" class="error-message">El nombre es requerido.</span>
          </div>
          <div class="form-group" :class="{ 'has-error': newProductData.cantidad <= 0 }">
            <label for="addCantidad">Cantidad</label>
            <input id="addCantidad" type="number" v-model="newProductData.cantidad" required>
            <!-- Validación de cantidad -->
            <span v-if="newProductData.cantidad <= 0" class="error-message">La cantidad debe ser mayor que cero.</span>
          </div>
          <div class="form-group" :class="{ 'has-error': newProductData.precio <= 0 }">
            <label for="addPrecio">Precio</label>
            <input id="addPrecio" type="number" v-model="newProductData.precio" required>
            <!-- Validación de precio -->
            <span v-if="newProductData.precio <= 0" class="error-message">El precio debe ser mayor que cero.</span>
          </div>
          <div class="form-group">
            <label for="addProveedor">Proveedor</label>
            <input id="addProveedor" type="text" v-model="newProductData.proveedor">
            <!-- No se requiere validación de proveedor -->
          </div>
          <div class="form-group" :class="{ 'has-error': newProductData.metodo_pago === '' }">
            <label for="addMetodo">Método de Pago</label>
            <select id="addMetodo" v-model="newProductData.metodo_pago" required>
              <option value="" disabled selected>Seleccione un método de pago</option>
              <!-- Opciones precargadas de método de pago -->
              <option v-for="metodo in metodosPago" :key="metodo">{{ metodo }}</option>
            </select>
            <!-- Validación de método de pago -->
            <span v-if="newProductData.metodo_pago === ''" class="error-message">Seleccione un método de pago.</span>
          </div>
          <div class="form-group" :class="{ 'has-error': newProductData.estado === '' }">
            <label for="addEstado">Estado</label>
            <select id="addEstado" v-model="newProductData.estado" required>
              <option value="" disabled selected>Seleccione un estado</option>
              <!-- Opciones precargadas de estados -->
              <option v-for="estado in uniqueEstados" :key="estado">{{ estado }}</option>
            </select>
            <!-- Validación de estado -->
            <span v-if="newProductData.estado === ''" class="error-message">Seleccione un estado.</span>
          </div>
          <div class="form-group" :class="{ 'has-error': newProductData.fecha === '' }">
            <label for="addFecha">Fecha</label>
            <input id="addFecha" type="date" v-model="newProductData.fecha" required>
            <!-- Validación de fecha -->
            <span v-if="newProductData.fecha === ''" class="error-message">Seleccione una fecha.</span>
          </div>
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
import { obtenerProductos, eliminarProducto, actualizarProducto, crearProducto } from '@/service/AdminPro';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const products = ref([]);
const filters = ref({ nombre: '', estado: '', fecha: '' });
const showEditModal = ref(false);
const editProductData = ref({});
const showAddModal = ref(false);
const newProductData = ref({ producto: '', cantidad: 0, precio: 0, proveedor: '', metodo_pago: '', estado: '', fecha: '' });
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

const metodosPago = ref(['Efectivo','Transferencia bancaria']);

const filteredProducts = computed(() => {
  return products.value.filter(p => (!filters.value.nombre || p.producto.toLowerCase().includes(filters.value.nombre.toLowerCase())) &&
                                     (!filters.value.estado || p.estado === filters.value.estado) &&
                                     (!filters.value.fecha || new Date(p.fecha).toISOString().slice(0, 10) === filters.value.fecha));
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
  margin: auto;
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

.form-container {
  max-width: 400px;
  margin: auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error-message {
  color: #ff0000;
}

.has-error input[type="text"],
.has-error input[type="number"],
.has-error select {
  border-color: #ff0000;
}
</style>
