<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" />
  <div class="card">
    <h2>Menús</h2>
    <Button
      label="Crear menú"
      icon="pi pi-plus"
      class="p-button"
      @click="handleAdd"
    />
    <DataTable
      dataKey="id"
      :value="menus"
      tableStyle="min-width: 50rem"
      :showGridlines="true"
      :paginator="true"
      :rows="10"
    >
      <Column field="label" header="Label" />

      <!-- Icona -->
      <Column header="Icona">
        <template #body="slotProps">
          <i :class="slotProps.data.icon" />
        </template>
      </Column>

      <!-- Ruta -->
      <Column field="route" header="Ruta" />

      <!-- Parent -->
      <Column header="Pare">
        <template #body="slotProps">
          {{ getParentLabel(slotProps.data.parent_id) }}
        </template>
      </Column>

      <!-- Ordenació -->
      <Column field="sort_order" header="Ordre" />

      <!-- És separador -->
      <Column header="Separador">
        <template #body="slotProps">
          <Checkbox :modelValue="slotProps.data.is_separator" binary disabled />
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
      v-model:visible="showDialog"
      modal
      header="Crear menú"
      :style="{ width: '30rem' }"
    >
      <MenuForm
        :menu="selectedMenu"
        :menus="menuStore.menus"
        :editMode="editMode"
        @save="saveMenu"
        @cancel="showDialog = false"
      />
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import AppBreadCrumb from "../components/AppBreadCrumb.vue";
import { ref, onMounted } from "vue";
import { useToast } from "primevue";
import { useMenuStore } from "../stores/menuStore";
import type { MenuRequest, Menu } from "../types";
import MenuForm from "../components/MenuForm.vue";
import { extractErrorMessage } from "../utils/errormessage";

const menuStore = useMenuStore();
const toast = useToast();

const menus = ref<Menu[]>([]);
const showDialog = ref(false);
const editMode = ref(false);

const selectedMenu = ref<Menu | null>(null);

const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});

const breadcrumbItems = ref([
  {
    label: "Menus",
    icon: "pi pi-align-justify",
  },
]);

onMounted(async () => {
  await loadData();
});

async function loadData() {
  await menuStore.fetchAll();
  menus.value = menuStore.menus;
}

function getParentLabel(parent_id: string) {
  if (!parent_id) return "";
  const parent = menus.value.find((menu) => menu.id === parent_id);
  return parent ? parent.label : "—";
}

const handleAdd = () => {
  selectedMenu.value = {
    id: "",
    label: "",
    icon: "",
    route: "",
    sort_order: 0,
    is_separator: false,
    parent_id: "",
  };
  editMode.value = false;
  showDialog.value = true;
};

const handleView = (menu: Menu) => {
  selectedMenu.value = menu;
  editMode.value = true;
  showDialog.value = true;
};

const handleDelete = async (menu: Menu) => {
  const confirm = window.confirm(
    `Segur que vols eliminar el menú "${menu.label}"?`
  );
  if (!confirm) return;

  try {
    await menuStore.delete(menu.id);
    toast.add({
      severity: "success",
      summary: "Menu eliminat",
      detail: `Menu "${menu.label}" eliminat correctament`,
      life: 3000,
    });
    await loadData();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: extractErrorMessage(error),
      life: 3000,
    });
  }
};
const saveMenu = async (menu: Menu | MenuRequest) => {
  try {
    let message = "";
    if (menu.parent_id === "" || menu.parent_id === undefined) {
      menu.parent_id = null;
    }
    if (editMode.value && "id" in menu) {
      await menuStore.update(menu.id, menu);
      message = "Menú actualitzat correctament";
    } else {
      await menuStore.create(menu);
      message = "Menú creat correctament";
    }
    loadData();
    showDialog.value = false;
    toast.add({
      severity: "success",
      summary: "Èxit",
      detail: message,
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: extractErrorMessage(error),
      life: 3000,
    });
  }
};
</script>
