<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" />
  <div class="card">
    <h2>Clients</h2>
    <Button
      label="Crear client"
      icon="pi pi-plus"
      class="p-button"
      @click="showCreateDialog = true"
    />
    <DataTable
      v-model:filters="filters"
      dataKey="id"
      filterDisplay="row"
      :globalFilterFields="['comercial_name', 'vat_number', 'phone_number']"
      :value="customers"
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
            icon="pi pi-eye"
            class="p-button-text p-button-sm"
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

    <Dialog
      v-model:visible="showCreateDialog"
      modal
      header="Crear grup"
      :style="{ width: '50rem' }"
    >
      <div class="field two-columns">
        <div><label for="comercial_name">Nom comercial</label></div>
        <div>
          <InputText
            id="comercial_name"
            v-model="newCustomer.comercial_name"
            autofocus
            class="w-full"
          />
        </div>
      </div>
      <div class="field four-columns gap-2">
        <div><label for="vat_number">CIF</label></div>
        <div>
          <InputText
            id="vat_number"
            v-model="newCustomer.vat_number"
            autofocus
            class="w-full"
          />
        </div>
        <div><label for="phone_number">Telèfon</label></div>
        <div>
          <InputText
            id="phone_number"
            v-model="newCustomer.phone_number"
            autofocus
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel·la"
          icon="pi pi-times"
          class="p-button-text"
          @click="showCreateDialog = false"
        />
        <Button label="Crea" icon="pi pi-check" @click="handleCreateCustomer" />
      </template>
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useGroupStore } from "../stores/groupStore";
import { useCustomerStore } from "../stores/customerStore";
import type { GroupResponse, Customer, CustomerRequest } from "../types";
import { formatDate } from "../utils/date";
import { FilterMatchMode } from "@primevue/core/api";
import { useRouter } from "vue-router";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";

const groupStore = useGroupStore();
const customerStore = useCustomerStore();
const toast = useToast();
const router = useRouter();

const groups = ref<GroupResponse[]>([]);
const customers = ref<Customer[]>([]);
const newCustomer = ref({} as CustomerRequest);
const showCreateDialog = ref(false);

const filters = ref({
  comercial_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  vat_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
  phone_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

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

onMounted(async () => {
  await loadCustomers();
});

async function loadCustomers() {
  await customerStore.fetchCustomers();
  customers.value = customerStore.customers;
}

async function handleCreateCustomer() {
  if (newCustomer.value.comercial_name === "") {
    toast.add({
      severity: "warn",
      summary: "Camp buit",
      detail: "El nom del client és obligatori",
      life: 3000,
    });
    return;
  }

  if (newCustomer.value.phone_number === "") {
    toast.add({
      severity: "warn",
      summary: "Camp buit",
      detail: "El telèfon del client és obligatori",
      life: 3000,
    });
    return;
  }

  if (newCustomer.value.vat_number === "") {
    toast.add({
      severity: "warn",
      summary: "Camp buit",
      detail: "El cif del client és obligatori",
      life: 3000,
    });
    return;
  }

  try {
    await customerStore.createCustomer(newCustomer.value);
    toast.add({
      severity: "success",
      summary: "Client creat",
      detail: `Client "${newCustomer.value.comercial_name}" creat correctament`,
      life: 3000,
    });
    await loadCustomers();
    newCustomer.value = {
      comercial_name: "",
      vat_number: "",
      phone_number: "",
    };
    showCreateDialog.value = false;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut crear el client",
      life: 3000,
    });
    console.error("Error creant el client", error);
  }
}

async function handleDelete(customer: Customer) {
  const confirm = window.confirm(
    `Segur que vols eliminar el client "${customer.comercial_name}"?`
  );
  if (!confirm) return;

  try {
    await customerStore.deleteCustomer(customer.id);
    toast.add({
      severity: "success",
      summary: "Client eliminat",
      detail: `Client "${customer.comercial_name}" eliminat correctament`,
      life: 3000,
    });
    await loadCustomers();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `No s'ha pogut eliminar el client`,
      life: 3000,
    });
    console.error("Error eliminant el client", error);
  }
}
</script>
