<template>
  <div class="sidebar">
    <div class="logo-container">
      <img src="https://www.bing.com/th?id=OIP.rCN9YUdnA0Q51pq-wqkzKAHaJ2&pid=3.1&cb=&w=300&h=300&p=0" alt="Logo" class="logo">
    </div>
    <nav class="nav-menu">
      <ul>
        <li class="nav-item"><router-link to="/">Página Principal</router-link></li>
        <li class="nav-item"><router-link to="/productos">Productos</router-link></li>
        <li class="nav-item"><router-link to="/ordenes">Administración de Ordenes</router-link></li>
        <li class="nav-item"><router-link to="/reportes">Reportes</router-link></li>
        <!-- Boton para cerrar sesion -->
        <li class="nav-item"><button class="logout" @click="cerrarSesion">Cerrar sesión</button></li>

      </ul>
    </nav>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import Services from '@/service/Services';

const Service = Services;

//metodo para cerrar sesion
const cerrarSesion = async () => {
  try {
    const response = await Service.logout();
    console.log('Sesión cerrada', response);
    router.push({ name: 'login' });
  } catch (error) {
    console.error('Error al cerrar sesión', error);
  }
};
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: #3A5BFF;
  color: white;
  height: 100vh; /* Ajusta la altura según tus necesidades */
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding-top: 30px; /* Espacio para el logo y margen superior */
  z-index: 1000; /* Asegura que el sidebar esté por encima del contenido detrás de él */
}

.logo-container {
  margin-bottom: 100px; /* Espacio debajo del logo */
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  border-radius: 50%; /* Hace el logo circular */
  width: 50px; /* Ajusta el tamaño del logo */
  height: 50px; /* Asegúrate de que width y height sean iguales para mantenerlo circular */
  object-fit: cover; /* Asegura que la imagen cubra el espacio sin distorsionarse */
  border: 2px solid white; /* Opcional: añade un borde al logo */
}

.nav-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 24px; /* Espacio entre ítems */
}

.nav-item a {
  color: #ffffff;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 14px;
}
.nav-item .logout {
    background-color: transparent;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 500;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
}



.main-content {
  flex: 1;
  overflow-x: hidden; /* Evita el desbordamiento horizontal */
}
.app-container {
  display: flex;
}

.app-sidebar {
  width: 280px;
  /* Estilos adicionales para tu sidebar */
}
</style>
