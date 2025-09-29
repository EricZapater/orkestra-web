<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" />
  <div class="card">
    <h2>Projectes</h2>
    <Button
      label="Crear projecte"
      icon="pi pi-plus"
      class="p-button"
      @click="showCreateDialog = true"
    />
    <DataTable
      :value="projectStore.projects"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :showGridlines="true"
    >
      <Column field="customer_id" header="Client" sortable>
        <template #body="slotProps">
          {{ customerIdToName.get(slotProps.data.customer_id) || "—" }}
        </template>
      </Column>
      <Column field="description" header="Descripció" />
      <Column field="start_date" header="Data d'inici" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.start_date) }}
        </template>
      </Column>
      <Column field="end_date" header="Data prevista final" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.end_date) }}
        </template>
      </Column>
      <Column field="status" header="Estat" />
      <Column field="priority" header="Prioritat" sortable>
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.priority"
            :severity="getPrioritySeverity(slotProps.data.priority)"
            class="priority-tag"
          />
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
    <ProjectFormDialog
      v-model:visible="showCreateDialog"
      :editMode="editMode"
      :project="newProject"
      :customers="customerStore.customers"
      @submit="handleAddProject"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";
import { useProjectStore } from "../stores/projectStore";
import { useCustomerStore } from "../stores/customerStore";
import {
  formatURLDate,
  formatDate,
  setStartOfDay,
  setEndOfDay,
} from "../utils/date";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue";
import { useRouter } from "vue-router";
import type { ProjectRequest, Project } from "../types";
import Decimal from "decimal.js";
import { extractErrorMessage } from "../utils/errormessage";
import ProjectFormDialog from "../components/ProjectFormDialog.vue";
import { getPrioritySeverity } from "../utils/helpers";

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
const zero = new Decimal(0);

const showCreateDialog = ref(false);
const editMode = ref(false);
const newProject = ref<ProjectRequest>({
  description: "",
  start_date: null,
  end_date: null,
  color: "",
  customer_id: "",
  amount: "0",
  estimated_cost: "0",
  status: "Backlog",
  priority: "C",
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

const handleAddProject = async () => {
  try {
    if (!editMode.value) {
      newProject.value.start_date = setStartOfDay(newProject.value.start_date);
      newProject.value.end_date = setEndOfDay(newProject.value.end_date);
      const res = await projectStore.createProject(newProject.value);
      toast.add({
        severity: "success",
        summary: "Projecte creat",
        detail: `${newProject.value.description} - ${res.data.id}`,
        life: 3000,
      });
    } else {
      newProject.value.start_date = setStartOfDay(newProject.value.start_date);
      newProject.value.end_date = setEndOfDay(newProject.value.end_date);
      const Project = ref<Project>({
        id: projectStore.selectedProject?.id ?? "",
        description: newProject.value.description,
        start_date: newProject.value.start_date?.toISOString() ?? "",
        end_date: newProject.value.end_date?.toISOString() ?? "",
        color: newProject.value.color,
        customer_id: projectStore.selectedProject?.customer_id ?? "",
        amount: zero,
        estimated_cost: zero,
        status: projectStore.selectedProject?.status ?? "Backlog",
        priority: projectStore.selectedProject?.priority ?? "C",
      });

      const res = await projectStore.updateProject(Project.value);
      toast.add({
        severity: "success",
        summary: "Projecte actualitzat",
        detail: `${newProject.value.description} - ${res.data.id}`,
        life: 3000,
      });
    }
    projectStore.fetchProjects();
    showCreateDialog.value = false;
    newProject.value = {
      description: "",
      start_date: null,
      end_date: null,
      color: "",
      customer_id: "",
      amount: "0",
      estimated_cost: "0",
      status: "Backlog",
      priority: "C",
    };
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
