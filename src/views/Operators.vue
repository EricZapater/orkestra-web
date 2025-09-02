<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" />
  <div class="card">
    <h2>Operaris</h2>
    <Button
      label="Crear operari"
      icon="pi pi-plus"
      class="p-button"
      @click="openCreateDialog"
    />

    <DataTable
      dataKey="id"
      :value="operatorStore.operators"
      tableStyle="min-width: 50rem"
      :showGridlines="true"
      :paginator="true"
      :rows="10"
    >
      <Column field="name" header="Nom" />
      <Column field="surname" header="Cognom" />
      <Column field="cost" header="Cost Jornada" />

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
    <Dialog
      v-model:visible="showDialog"
      :modal="true"
      header="Operaris"
      :style="{ width: '500px' }"
    >
      <OperatorForm
        :editMode="editMode"
        :operator="selectedOperator"
        :loading="operatorStore.loading"
        @save="handleFormSuccess"
      />
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useToast } from "primevue/usetoast";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";
import { useOperatorStore } from "../stores/operatorStore";
import type { Operator, OperatorRequest } from "../types";
import OperatorForm from "../components/OperatorForm.vue";

const toast = useToast();
const operatorStore = useOperatorStore();

const showDialog = ref(false);
const editMode = ref(false);
const selectedOperator = ref<Operator | null>(null);

// Breadcrumb
const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});

const breadcrumbItems = ref([
  {
    label: "Operaris",
    icon: "pi pi-user",
  },
]);

onMounted(async () => {
  await operatorStore.fetchAll();
});

const openCreateDialog = () => {
  selectedOperator.value = null;
  editMode.value = false;
  showDialog.value = true;
};
const openEditDialog = (operator: Operator) => {
  selectedOperator.value = { ...operator };
  editMode.value = true;
  showDialog.value = true;
};
const handleDelete = async (operator: Operator) => {
  if (confirm(`Estàs segur que vols eliminar l'operari ${operator.name}?`)) {
    try {
      await operatorStore.delete(operator.id);
      toast.add({
        severity: "success",
        summary: "Operari eliminat",
        detail: `L'operari ${operator.name} s'ha eliminat correctament.`,
        life: 3000,
      });
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: `No s'ha pogut eliminar l'operari ${operator.name}.`,
        life: 3000,
      });
    }
  }
};

const handleFormSuccess = async (operator: Operator) => {
  const request: OperatorRequest = {
    name: operator.name,
    surname: operator.surname,
    cost: operator.cost.toString(),
    color: operator.color,
  };
  if (editMode.value === true) {
    await operatorStore.update(operator.id, request);
    toast.add({
      severity: "success",
      summary: "Operari actualitzat",
      detail: `L'operari s'ha actualitzat correctament.`,
      life: 3000,
    });
  } else {
    await operatorStore.create(request);
    toast.add({
      severity: "success",
      summary: "Operari creat",
      detail: `L'operari s'ha creat correctament.`,
      life: 3000,
    });
  }
  showDialog.value = false;
  await operatorStore.fetchAll();
};
</script>
