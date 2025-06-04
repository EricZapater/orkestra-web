<template>
  <div id="app">
    <Toast />
    <Topbar v-if="showLayout" />
    <div class="layout-container" v-if="showLayout">
      <Sidebar />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
    <RouterView v-else />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import Topbar from "./components/Topbar.vue";
import Sidebar from "./components/Sidebar.vue";

const route = useRoute();

// No mostrar layout complet en rutes com login
const noLayoutRoutes = ["/login", "/register"];
const showLayout = computed(() => !noLayoutRoutes.includes(route.path));
</script>

<style scoped>
.layout-container {
  display: flex;
  height: calc(100% - 4rem); /* si la topbar fa 4rem d'alçada */
}
.main-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}
</style>
