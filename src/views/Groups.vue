<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" />
  <div class="card">
    <h2>Grups</h2>
    <Button
      label="Crear grup"
      icon="pi pi-plus"
      class="p-button"
      @click="showCreateDialog = true"
    />
    <DataTable
      v-model:filters="filters"
      dataKey="id"
      filterDisplay="row"
      :globalFilterFields="['name']"
      :value="groups"
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
      <Column field="created_at" header="Data creació">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
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

    <Dialog
      v-model:visible="showCreateDialog"
      modal
      header="Crear grup"
      :style="{ width: '30rem' }"
    >
      <div class="field two-columns">
        <div><label for="group-name">Nom del grup</label></div>
        <div>
          <InputText
            id="group-name"
            v-model="newGroupName"
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
        <Button label="Crea" icon="pi pi-check" @click="handleCreateGroup" />
      </template>
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useGroupStore } from "../stores/groupStore";
import { type GroupResponse } from "../types";
import { formatDate } from "../utils/date";
import { FilterMatchMode } from "@primevue/core/api";
import { useRouter } from "vue-router";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";

const groupStore = useGroupStore();
const toast = useToast();
const router = useRouter();

const groups = ref<GroupResponse[]>([]);
const newGroupName = ref("");
const showCreateDialog = ref(false);

const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});

const breadcrumbItems = ref([
  {
    label: "Grups",
    icon: "pi pi-users",
  },
]);

onMounted(async () => {
  await loadGroups();
});

async function loadGroups() {
  await groupStore.fetchGroups();
  groups.value = groupStore.groups;
}

async function handleCreateGroup() {
  if (!newGroupName.value.trim()) {
    toast.add({
      severity: "warn",
      summary: "Camp buit",
      detail: "El nom del grup és obligatori",
      life: 3000,
    });
    return;
  }

  try {
    await groupStore.createGroup({ name: newGroupName.value });
    toast.add({
      severity: "success",
      summary: "Grup creat",
      detail: `Grup "${newGroupName.value}" creat correctament`,
      life: 3000,
    });
    await loadGroups();
    newGroupName.value = "";
    showCreateDialog.value = false;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut crear el grup",
      life: 3000,
    });
    console.error("Error creant el grup", error);
  }
}

function handleView(group: GroupResponse) {
  router.push(`/group/${group.id}`);
}

async function handleDelete(group: GroupResponse) {
  const confirm = window.confirm(
    `Segur que vols eliminar el grup "${group.name}"?`
  );
  if (!confirm) return;

  try {
    await groupStore.deleteGroup(group.id);
    toast.add({
      severity: "success",
      summary: "Grup eliminat",
      detail: `Grup "${group.name}" eliminat correctament`,
      life: 3000,
    });
    await loadGroups();
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
