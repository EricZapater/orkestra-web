<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" />
  <div class="card">
    <h2>Usuaris</h2>
    <Button
      label="Crear usuaris"
      class="p-button"
      icon="pi pi-plus"
      @click="handleCreate"
    />
    <DataTable
      v-model:filters="filters"
      dataKey="id"
      filterDisplay="row"
      :globalFilterFields="['name']"
      :value="users"
      tableStyle="min-width: 50rem"
      :showGridlines="true"
      :paginator="true"
      :rows="10"
    >
      <Column field="name" header="Nom">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="Search by name"
          />
        </template>
      </Column>
      <Column field="surname" header="Cognom">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="Search by surname"
          />
        </template>
      </Column>
      <Column field="email" header="Correu electrònic" />
      <Column field="phone_number" header="Telèfon" />

      <Column field="password_changed_at" header="Data canvi password">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.password_changed_at) }}
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
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "../stores/userStore";
import { type UserResponse } from "../types";
import { formatDate } from "../utils/date";
import { FilterMatchMode } from "@primevue/core/api";
import { useRouter } from "vue-router";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";

const userStore = useUserStore();
const toast = useToast();
const router = useRouter();

const users = ref<UserResponse[]>([]);
const newUser = ref<UserResponse>();
const showCreateDialog = ref(false);

const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});

const breadcrumbItems = ref([
  {
    label: "Usuaris",
    icon: "pi pi-users",
  },
]);

const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  surname: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(async () => {
  await loadUsers();
});

async function loadUsers() {
  await userStore.fetchUsers();
  users.value = userStore.users;
}

async function handleCreate() {
  router.push("/user");
}
function handleView(user: UserResponse) {
  router.push(`/user/${user.id}`);
}

async function handleDelete(user: UserResponse) {
  const confirm = window.confirm(
    `Segur que vols eliminar l'usuari "${(user.surname, user.name)}"?`
  );
  if (!confirm) return;

  try {
    await userStore.deleteUser(user.id);
    toast.add({
      severity: "success",
      summary: "Usuari eliminat",
      detail: `Usuari "${(user.surname, user.name)}" eliminat correctament`,
      life: 3000,
    });
    await loadUsers();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `No s'ha pogut eliminar el grup`,
      life: 3000,
    });
    console.error("Error eliminant el grup", error);
  }
}
</script>
