<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" />
  <div class="card">
    <h2>Clients</h2>
    <Button
      label="Crear client"
      icon="pi pi-plus"
      class="p-button"
      @click="openCreateDialog"
    />

    <DataTable
      v-model:filters="filters"
      dataKey="id"
      filterDisplay="row"
      :globalFilterFields="['comercial_name', 'vat_number', 'phone_number']"
      :value="customerStore.customers"
      tableStyle="min-width: 50rem"
      :showGridlines="true"
      :paginator="true"
      :rows="10"
    >
      <Column field="comercial_name" header="Nom Comercial">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="Cerca per nom"
          />
        </template>
      </Column>

      <Column field="vat_number" header="CIF">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="Cerca per CIF"
          />
        </template>
      </Column>

      <Column field="phone_number" header="Num. Telèfon">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="Cerca per telèfon"
          />
        </template>
      </Column>

      <Column header="Accions" style="width: 10rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-text p-button-sm"
            title="Editar"
            @click="openEditDialog(slotProps.data)"
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

    <CustomerForm
      v-model:visible="showDialog"
      :editMode="editMode"
      :customer="selectedCustomer"
      :users="userStore.users"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useCustomerStore } from "../stores/customerStore";
import { useUserStore } from "../stores/userStore";
import type { Customer } from "../types";
import { FilterMatchMode } from "@primevue/core/api";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";
import CustomerForm from "../components/CustomerForm.vue";

const customerStore = useCustomerStore();
const userStore = useUserStore();
const toast = useToast();

// Variables reactives
const showDialog = ref(false);
const editMode = ref(false);
const selectedCustomer = ref<Customer | null>(null);

// Filtres de la taula
const filters = ref({
  comercial_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  vat_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
  phone_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Breadcrumb
const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});

const breadcrumbItems = ref([
  {
    label: "Clients",
    icon: "pi pi-money-bill",
  },
]);

// Lifecycle
onMounted(async () => {
  await Promise.all([customerStore.fetchCustomers(), userStore.fetchUsers()]);
});

// Mètodes del diàleg
const openCreateDialog = () => {
  editMode.value = false;
  selectedCustomer.value = null;
  showDialog.value = true;
};

const openEditDialog = (customer: Customer) => {
  editMode.value = true;
  selectedCustomer.value = customer;
  showDialog.value = true;
};

const handleFormSuccess = async () => {
  // Recarregar la llista de clients després de crear/editar
  await customerStore.fetchCustomers();
};

// Eliminació de client
const handleDelete = async (customer: Customer) => {
  const confirmed = window.confirm(
    `Segur que vols eliminar el client "${customer.comercial_name}"?`
  );

  if (!confirmed) return;

  try {
    await customerStore.deleteCustomer(customer.id);
    toast.add({
      severity: "success",
      summary: "Client eliminat",
      detail: `Client "${customer.comercial_name}" eliminat correctament`,
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut eliminar el client",
      life: 3000,
    });
    console.error("Error eliminant el client:", error);
  }
};
</script>

<style scoped>
.card {
  padding: 1.5rem;
}

.card h2 {
  margin-bottom: 1rem;
}

.p-button {
  margin-bottom: 1rem;
}
</style>
