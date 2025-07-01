<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" />
  <div class="card">
    <h2>Projectes</h2>
    <DataTable
      :value="projectStore.projects"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :showGridlines="true"
    >
      <Column field="id" header="ID" />
      <Column field="customer_id" header="Client">
        <template #body="slotProps">
          {{ customerIdToName.get(slotProps.data.customer_id) || "—" }}
        </template>
      </Column>
      <Column field="description" header="Descripció" />
      <Column field="start_date" header="Data d'inici">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.start_date) }}
        </template>
      </Column>
      <Column field="end_date" header="Data prevista final">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.end_date) }}
        </template>
      </Column>
      <Column header="Accions" style="width: 10rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-eye"
            class="p-button-text p-button-sm"
            @click="handleView(slotProps.data)"
            title="Veure"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-text p-button-sm"
            severity="danger"
            @click="handleDelete(slotProps.data)"
            title="Eliminar"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";
import { useProjectStore } from "../stores/projectStore";
import { useCustomerStore } from "../stores/customerStore";
import { formatDate } from "../utils/date";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue";
import { useRouter } from "vue-router";

const toast = useToast();
const confirm = useConfirm();
const router = useRouter();

const projectStore = useProjectStore();
const customerStore = useCustomerStore();
const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});
const breadcrumbItems = [{ label: "Projectes", icon: "pi pi-briefcase" }];

const customerIdToName = computed(() => {
  const map = new Map();
  for (const customer of customerStore.customers) {
    map.set(customer.id, customer.comercial_name);
  }
  return map;
});

onMounted(async () => {
  await projectStore.fetchProjects();
  await customerStore.fetchCustomers();
});

const handleView = (data: any) => {
  router.push(`/project/${data.id}`);
  // Navigate to project details page or open a dialog
};
const handleDelete = async (data: any) => {
  confirm.require({
    message: `Segur que vols eliminar el projecte "${data.description}"?`,
    header: "Confirmació",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Sí",
    rejectLabel: "No",
    accept: async () => {
      try {
        await projectStore.deleteProject(data.id);
        toast.add({
          severity: "success",
          summary: "Projecte eliminat",
          detail: `Projecte "${data.description}" eliminat correctament`,
          life: 3000,
        });
        await projectStore.fetchProjects();
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: `No s'ha pogut eliminar el projecte`,
          life: 3000,
        });
        console.error("Error deleting project: ", error);
      }
    },
  });
};
</script>
