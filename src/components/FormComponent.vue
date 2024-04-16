<template>
    <form>
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" class="form-control" id="nombre" placeholder="Nombre">
      </div>
      <div class="form-group">
        <label for="apellido">Apellido</label>
        <input type="text" class="form-control" id="apellido" placeholder="Apellido">
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" class="form-control" id="email" placeholder="Email">
      </div>
      <div class="form-group">
        <label for="telefono">Teléfono</label>
        <input type="text" class="form-control" id="telefono" placeholder="Teléfono">
      </div>
      <div class="form-group">
        <label for="direccion">Dirección</label>
        <input type="text" class="form-control" id="direccion" placeholder="Dirección">
      </div>
      <div class="form-group">
        <label for="ciudad">Ciudad</label>
        <input type="text" class="form-control" id="ciudad" placeholder="Ciudad">
      </div>
      <div class="form-group">
        <label for="estado">Estado</label>
        <input type="text" class="form-control" id="estado" placeholder="Estado">
      </div>
      <div class="form-group">
        <label for="codigoPostal">Código Postal</label>
        <input type="text" class="form-control" id="codigoPostal" placeholder="Código Postal">
      </div>
      <div class="form-group">
        <label for="pais">País</label>
        <input type="text" class="form-control" id="pais" placeholder="País">
      </div>
      <div class="button-group">
        <button type="submit" class="btn btn-primary">Submit</button>
        <button type="button" class="btn btn-cancel" @click="cancelSubmit">
          <i class="fas fa-times"></i> Cancelar
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const cancelSubmit = () => {
    // Implementa la lógica para cancelar el envío del formulario
  };
  </script>
  
  <style scoped>
  form {
    max-width: 600px; /* Ancho máximo del formulario */
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f8f9fa;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #0980f7; /* Color de texto oscuro */
    font-size: 50px;

  }
  
  .form-control {
    width: 100%;
    padding: 8px;
    border: 1px solid #ced4da; /* Color del borde */
    border-radius: 3px;
  }
  
  .button-group {
    grid-column: span 2;
    display: flex;
    justify-content: flex-end;
  }
  
  button {
    padding: 10px 20px;
    margin-left: 10px; /* Espacio entre botones */
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-primary {
    background-color: #007bff; /* Color de fondo azul */
    border: none;
    color: #fff; /* Color de texto blanco */
  }
  
  .btn-primary:hover {
    background-color: #0056b3; /* Color de fondo azul oscuro al pasar el ratón */
  }
  
  .btn-cancel {
    background-color: transparent;
    border: none;
    color: #6c757d; /* Color de texto gris */
  }
  
  .btn-cancel:hover {
    color: #343a40; /* Cambia el color de texto a oscuro al pasar el ratón */
  }
  
  .fa-times {
    margin-right: 5px; /* Espacio entre el icono y el texto */
    color: transparent; /* Hace el icono transparente */
  }
  </style>
  