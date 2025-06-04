<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";
const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});
const breadcrumbItems = ref([]);
</script>
