<template>
    <div>
      <h1>Iniciar sesión</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="name">Nombre de usuario</label>
          <input type="text" class="form-control" id="name" v-model="name" placeholder="Nombre de usuario" required>
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" class="form-control" id="password" v-model="password" placeholder="Contraseña" required>
        </div>
        <div class="button-group">
          <button type="submit" class="btn btn-primary">Iniciar sesión</button>
          <button type="button" class="btn btn-danger" @click="cancel">Cancelar</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import Services from '@/service/Services';
  import { ref } from 'vue';
  
  const Service = Services;
  const name = ref('');
  const password = ref('');
  
  const login = async () => {
    if (name.value && password.value) {
      const token = await Service.login(name.value, password.value);
      if (token) {
        // Guardar el token en localStorage
        localStorage.setItem('token', token);
        console.log('Inicio de sesión exitoso. Token:', token);
      } else {
        console.error('Credenciales incorrectas');
      }
    } else {
      console.error('Por favor, complete todos los campos');
    }
  };
  
  const cancel = () => {
    console.log('Inicio de sesión cancelado');
  };
  </script>
  
  <style scoped>
  /* Estilos específicos de LoginView si es necesario */
  .form-group {
    margin-bottom: 20px;
  }
  
  .label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-control {
    width: 100%;
    padding: 8px;
    border: 1px solid #ced4da;
    border-radius: 3px;
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: #fff;
  }
  
  .btn-danger {
    background-color: transparent;
    color: #dc3545;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  
  .btn-danger:hover {
    background-color: #f8d7da;
  }
  </style>
  