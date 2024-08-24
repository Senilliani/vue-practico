<template>
  <div id="app">
    <h1>App en Vue.js</h1>
    <nav>
      <router-link to="/products">Productos</router-link>
      <router-link to="/orders">Pedidos</router-link>
      <router-link to="create-order">Crear Pedido</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
nav a {
  margin: 0 10px;
}
</style>