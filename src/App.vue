<template>
  <div class="app">
    <Sidebar />

    <router-view />
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
</script>

<style Lang="sass">
:root {
  --primary: rgb(255, 72, 72);
  --gray: rgb(116, 116, 116);
  --dark: rgb(44, 44, 44);
  --dark-alt: rgb(49, 49, 49);
  --light: rgb(255, 240, 240);
  --sidebar-width: 300px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Fira sans', sans-serif;
}

body {
  background: var(--light);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  display: flex;
}

.app main {
  flex: 1 1 0;
  padding: 2rem;
  margin-left: 4rem;

  @media (max-width: 1024px) {
    padding-left: 6rem;
  }
}
</style>
