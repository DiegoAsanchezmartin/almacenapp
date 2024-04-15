<template>
  <div class="admin-container">
    <h2>Productos en el Almacén</h2>

    <!-- Buscador por nombre de producto -->
    <div class="input-group">
      <input v-model="filtro.nombre" placeholder="Buscar por nombre de producto" class="form-input">
    </div>

    <!-- Filtros y opciones -->
    <div class="filter-bar">
      <div class="input-group">
        <input v-model="filtro.proveedor" placeholder="Filtrar por proveedor" class="form-input">
      </div>
      <div class="input-group">
        <input type="number" v-model.number="filtro.cantidadMinima" placeholder="Cantidad mínima" class="form-input">
      </div>
      <div class="input-group">
        <input type="number" v-model.number="filtro.precioMaximo" placeholder="Precio máximo" class="form-input">
      </div>
      <div class="button-group">
        <button @click="exportarPDF()" class="form-button">Exportar a PDF</button>
        <button @click="mostrarModalAgregar = true" class="form-button">Agregar Producto</button>
      </div>
    </div>

    <!-- Modal de agregar producto -->
    <div v-if="mostrarModalAgregar" class="modal">
      <div class="modal-content">
        <span class="close" @click="cerrarModalAgregar">&times;</span>
        <h2>Agregar Nuevo Producto</h2>
        
        <!-- Recuadro de Información General -->
        <div class="input-group">
          <h3>Información General</h3>
          <div class="input-box">
            <label for="nombre">Nombre:</label>
            <input v-model="nuevoProducto.nombre" type="text" id="nombre" class="form-input">
          </div>
          <div class="input-box">
            <label for="metodoPago">Método de pago:</label>
            <select v-model="nuevoProducto.metodoPago" id="metodoPago" class="form-input">
              <option value="Tarjeta">Tarjeta</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        <!-- Recuadro de Dinero y Stock con Disponibilidad -->
        <div class="input-group">
          <h3>Dinero y Stock con Disponibilidad</h3>
          <div class="input-box">
            <label for="precio">Precio:</label>
            <input v-model.number="nuevoProducto.precio" type="number" id="precio" class="form-input">
          </div>
          <div class="input-box">
            <label for="stock">Stock:</label>
            <input v-model.number="nuevoProducto.stock" type="number" id="stock" class="form-input">
          </div>
          <div class="input-box">
            <label for="estado">Estado:</label>
            <input v-model="nuevoProducto.estado" type="text" id="estado" class="form-input">
          </div>
        </div>

        <!-- Botón de agregar producto -->
        <button @click="agregarProducto" class="form-button add-product-button">Agregar Producto</button>
      </div>
    </div>
    <!-- Fin de la modal de agregar producto -->

    <!-- Tabla de productos -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Método de pago</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(producto, index) in productosPaginados" :key="index">
            <td>{{ producto.producto }}</td>
            <td>{{ producto.metodo_pago }}</td>
            <td>{{ producto.cantidad }}</td>
            <td>{{ producto.precio }}</td>
            <td>{{ producto.estado }}</td>
            <td>
              <button @click="editarProducto(index)" class="action-button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#007BFF" viewBox="0 0 16 16" width="16" height="16">
                  <path d="M10.646 0.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-9 9a.5.5 0 0 1-.316.138l-3.5 1a.5.5 0 0 1-.632-.632l1-3.5a.5.5 0 0 1 .138-.316l9-9z"/>
                  <path d="M11 3.5L3.5 11H3v-.5L10.5 3H11v.5z"/>
                </svg>
                <span class="icon-text"></span>
              </button>
              <button @click="eliminarProducto(index)" class="action-button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#007BFF" viewBox="0 0 16 16" width="16" height="16">
                  <path d="M4.5 1a.5.5 0 0 1 .5.5V2h7V1.5a.5.5 0 0 1 1 0V2h1a1 1 0 0 1 1 1v1h-11V3a1 1 0 0 1 1-1h1V1.5a.5.5 0 0 1 .5-.5zm5 1V2h-5v.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V2H2v.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2h-1v.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                  <path fill-rule="evenodd" d="M6.5 5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm2.5 2a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5zm-2.5 0a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5zM5 7.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0v-5z"/>
                </svg>
                <span class="icon-text"></span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Fin de la tabla de productos -->

    <!-- Paginación -->
    <div class="pagination">
      <button :disabled="paginaActual === 1" @click="paginaActual--">Anterior</button>
      <span>{{ paginaActual }} de {{ totalPaginas }}</span>
      <button :disabled="paginaActual === totalPaginas" @click="paginaActual++">Siguiente</button>
    </div>
    <!-- Fin de la paginación -->

    <!-- Modal de editar producto -->
    <div v-if="mostrarModalEditar" class="modal">
      <div class="modal-content">
        <span class="close" @click="cerrarModalEditar">&times;</span>
        <h2>Editar Producto</h2>
        
        <!-- Recuadro de Información General -->
        <div class="input-group">
          <h3>Información General</h3>
          <div class="input-box">
            <label for="nombre">Nombre:</label>
            <input v-model="productoSeleccionado.nombre" type="text" id="nombre" class="form-input">
          </div>
          <div class="input-box">
            <label for="metodoPago">Método de pago:</label>
            <select v-model="productoSeleccionado.metodoPago" id="metodoPago" class="form-input">
              <option value="Tarjeta">Tarjeta</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        <!-- Recuadro de Dinero y Stock con Disponibilidad -->
        <div class="input-group">
          <h3>Dinero y Stock con Disponibilidad</h3>
          <div class="input-box">
            <label for="precio">Precio:</label>
            <input v-model.number="productoSeleccionado.precio" type="number" id="precio" class="form-input">
          </div>
          <div class="input-box">
            <label for="stock">Stock:</label>
            <input v-model.number="productoSeleccionado.stock" type="number" id="stock" class="form-input">
          </div>
          <div class="input-box">
            <label for="estado">Estado:</label>
            <input v-model="productoSeleccionado.estado" type="text" id="estado" class="form-input">
          </div>
        </div>

        <!-- Botón de guardar cambios -->
        <button @click="guardarCambios" class="form-button">Guardar Cambios</button>
      </div>
    </div>
    <!-- Fin de la modal de editar producto -->

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getAlmacenData } from '@/service/AdminPro';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faEdit, faTrashAlt);


const almacenData = getAlmacenData();
const productos = ref(almacenData);
const filtro = ref({ proveedor: '', cantidadMinima: 0, precioMaximo: Infinity, nombre: '' });
const productosPorPagina = 10;
const paginaActual = ref(1);

const productosFiltrados = computed(() => {
  return productos.value.filter(p => {
    return p.proveedor.includes(filtro.value.proveedor) &&
           p.cantidad >= filtro.value.cantidadMinima &&
           p.precio <= filtro.value.precioMaximo &&
           p.producto.toLowerCase().includes(filtro.value.nombre.toLowerCase());
  });
});

const totalPaginas = computed(() => Math.ceil(productosFiltrados.value.length / productosPorPagina));

const productosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * productosPorPagina;
  const fin = paginaActual.value * productosPorPagina;
  return productosFiltrados.value.slice(inicio, fin);
});

// Variables para controlar la visibilidad de las modales
const mostrarModalAgregar = ref(false);
const mostrarModalEditar = ref(false);

// Objeto para almacenar los datos del nuevo producto y del producto a editar
const nuevoProducto = ref({
  nombre: '',
  metodoPago: '',
  stock: 0,
  precio: 0,
  estado: ''
});
const productoSeleccionado = ref({
  nombre: '',
  metodoPago: '',
  stock: 0,
  precio: 0,
  estado: ''
});

// Función para exportar los productos filtrados a PDF
function exportarPDF() {
  const doc = new jsPDF();
  const header = ['Nombre', 'Proveedor', 'Stock', 'Precio', 'Estado'];
  const rows = productosFiltrados.value.map(producto => [producto.producto, producto.proveedor, producto.cantidad, producto.precio, producto.estado]);
  doc.autoTable({
    head: [header],
    body: rows
  });
  doc.save('productos.pdf');
}

// Función para agregar un nuevo producto
function agregarProducto() {
  productos.value.push({
    producto: nuevoProducto.value.nombre,
    metodo_pago: nuevoProducto.value.metodoPago,
    cantidad: nuevoProducto.value.stock,
    precio: nuevoProducto.value.precio,
    estado: nuevoProducto.value.estado,
    fecha: '',
    proveedor: ''
  });
  nuevoProducto.value = {
    nombre: '',
    metodoPago: '',
    stock: 0,
    precio: 0,
    estado: ''
  };
  mostrarModalAgregar.value = false;
}

// Función para abrir la modal de editar producto
function editarProducto(index: number) {
  const producto = productosPaginados.value[index];
  productoSeleccionado.value = { ...producto, nombre: producto.producto, metodoPago: producto.metodo_pago, stock: producto.cantidad };
  mostrarModalEditar.value = true;
}

// Función para guardar los cambios al editar un producto
function guardarCambios() {
  const index = productos.value.findIndex(p => p.producto === productoSeleccionado.value.nombre);
  if (index !== -1) {
    productos.value[index] = { 
      ...productoSeleccionado.value,
      producto: productoSeleccionado.value.nombre,
      fecha: '',
      cantidad: productoSeleccionado.value.stock,
      proveedor: '',
      metodo_pago: productoSeleccionado.value.metodoPago
    };
  }
  mostrarModalEditar.value = false;
}

// Función para eliminar un producto
function eliminarProducto(index: number) {
  productos.value.splice(index, 1);
}

// Función para cerrar la modal de agregar producto
function cerrarModalAgregar() {
  nuevoProducto.value = {
    nombre: '',
    metodoPago: '',
    stock: 0,
    precio: 0,
    estado: ''
  };
  mostrarModalAgregar.value = false;
}

// Función para cerrar la modal de editar producto
function cerrarModalEditar() {
  mostrarModalEditar.value = false;
}
</script>

<style scoped>
.admin-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
}

.filter-bar {
  margin-bottom: 10px;
}

.table-container {
  overflow-x: auto;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
}

.input-box {
  margin-bottom: 10px;
}

.input-box label {
  display: block;
  margin-bottom: 5px;
}

.table-container {
  overflow-x: auto;
}

.table-container table {
  width: 100%;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #007BFF;
  color: white;
}

.input-group {
  margin-bottom: 10px;
}

.form-input {
  margin: 5px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-button {
  margin: 5px;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background-color: #007BFF;
  color: white;
  cursor: pointer;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 10% auto;
  padding: 30px;
  border: 1px solid #888;
  width: 60%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.add-product-button {
  background-color: #28a745;
  border: 1px solid #28a745;
  color: #FFFFFF;
  transition: background-color 0.3s, border-color 0.3s, color 0.3s;
}

.add-product-button:hover {
  background-color: #218838;
  border-color: #218838;
}

.pagination {
  margin-top: 20px;
}

.pagination button {
  margin-right: 10px;
  padding: 8px;
  border: 1px solid #007BFF;
  background-color: #007BFF;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  border-color: #ccc;
  color: #666;
}
</style>
