
<template>
  
  <div class="login-box">
    
    <h1>INICIAR SESION</h1>
    

    
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="name">Nombre de usuario</label>
        <input type="text" class="form-control" id="name" v-model="username" placeholder="Nombre de usuario" required>
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" class="form-control" id="password" v-model="password" placeholder="Contraseña" required>
      </div>
      <div class="button-group">
        <button type="submit" class="btn btn-primary">Iniciar sesión</button>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import Services from '@/service/Services';
import { ref } from 'vue';
import router from '@/router'; 

const Service = Services;
const username = ref('');
const password = ref('');

const login = async () => {
  try {
    const response = await Service.login(username.value, password.value);
    console.log('Inicio de sesión exitoso', response);
    router.push({ name: 'home' });
  } catch (error) {
    console.error('Error al iniciar sesión', error);
  }
};

const cancel = () => {
  console.log('Inicio de sesión cancelado');
};

</script>

<style scoped>
/* Estilos específicos de LoginView si es necesario */
.login-box {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ced4da;
  border-radius: 20px;
  background-color: #fff;
}

h1{

  text-align: center;
  padding: 20px;
  color: hwb(0 0% 100%);
  font-family: "Lato", sans-serif;
  font-weight:400;
  font-size: 25px;

}
  

.form-group {
  margin-bottom: 20px;

}

.button-group {
  display: flex;
  justify-content: center; /* Centra horizontalmente los elementos dentro del contenedor */
  align-items: center;
  margin-top: 20px; /* Espacio opcional entre el formulario y el botón */
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



button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
  text-align: center;
}

.btn-danger {
  background-color: red;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger:hover {
  background-color: #f8d7da;
  color: #703030;
}
</style>
