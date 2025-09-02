<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" />
  <div class="card">
    <h2>Tasques</h2>
    <DataTable
      dataKey="id"
      :value="enrichedTasks"
      tableStyle="min-width: 50rem"
      :showGridlines="true"
      :paginator="true"
      :rows="10"
      v-model:filters="filters"
      filterDisplay="row"
      :globalFilterFields="['project', 'description', 'user']"
      sortMode="multiple"
    >
      <Column field="projectDescription" header="Projecte" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="Cerca per projecte"
          />
        </template>
      </Column>
      <Column field="description" header="Descripció">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="Cerca per descipció"
          />
        </template>
      </Column>
      <Column field="notes" header="Notes" />
      <Column field="userName" header="Asignat a:" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="Cerca per usuari"
          />
        </template>
      </Column>
      <Column field="status" header="Estat" sortable />
      <Column field="priority" header="Prioritat" sortable>
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.priority"
            :severity="getPrioritySeverity(slotProps.data.priority)"
            class="priority-tag"
          />
        </template>
      </Column>
      <Column field="start_date" header="Data inici" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.start_date) }}
        </template>
      </Column>
      <Column field="end_date" header="Data Fi" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.end_date) }}
        </template>
      </Column>
      <Column header="Accions" style="width: 10rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-text p-button-sm"
            severity="success"
            @click="loadEditModal(slotProps.data)"
            title="Editar"
          />
        </template>
      </Column>
    </DataTable>
    <Dialog
      v-model:visible="showDialog"
      :modal="true"
      header="Edit Task"
      :style="{ width: '500px' }"
    >
      <TaskForm
        v-if="selectedTask"
        :task="selectedTask"
        :editMode="editMode"
        @save="saveTask"
        @cancel="showDialog = false"
      />
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useTaskStore } from "../stores/taskStore";
import { useUserStore } from "../stores/userStore";
import { useProjectStore } from "../stores/projectStore";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";
import { formatDate } from "../utils/date";
import { FilterMatchMode } from "@primevue/core/api";
import type { Task } from "../types";
import { extractErrorMessage } from "../utils/errormessage";
import { useToast } from "primevue";
import TaskForm from "../components/TaskForm.vue";

const taskStore = useTaskStore();
const userStore = useUserStore();
const projectStore = useProjectStore();
const toast = useToast();

const showDialog = ref(false);
const selectedTask = ref<Task | null>(null);
const editMode = ref(false);

const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});

const breadcrumbItems = ref([
  { label: "Projectes", route: "/projects", icon: "pi pi-briefcase" },
  {
    label: "Tasques",
    icon: "pi pi-align-justify",
  },
]);

const filters = ref({
  projectDescription: { value: null, matchMode: FilterMatchMode.CONTAINS },
  userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

interface ExtendedTask extends Task {
  user?: {
    id: string;
    name: string;
  };
  project?: {
    id: string;
    description: string;
  };
  userName: string;
  projectDescription: string;
}

const enrichedTasks = ref<ExtendedTask[]>([]);

const getPrioritySeverity = (priority: string) => {
  switch (priority) {
    case "A":
      return "danger";
    case "B":
      return "warning";
    case "C":
      return "info";
    case "D":
      return "success";
    default:
      return "secondary";
  }
};

onMounted(async () => {
  loadData();
});

function loadData() {
  Promise.all([
    taskStore.fetchTasks(),
    userStore.fetchUsers(),
    projectStore.fetchProjects(),
  ]).then(() => {
    const extendedTasks: ExtendedTask[] = taskStore.tasks.map((task) => {
      const user = userStore.users.find((u) => u.id === task.user_id);
      const project = projectStore.projects.find(
        (p) => p.id === task.project_id
      );

      return {
        ...task,
        user,
        project,
        userName: user?.username || "",
        projectDescription: project?.description || "",
      };
    });

    enrichedTasks.value = extendedTasks;
  });
}

const loadEditModal = async (task: Task) => {
  console.log(task);
  selectedTask.value = { ...task };
  showDialog.value = true;
  editMode.value = true;
};

const saveTask = async (updatedTask: Task) => {
  try {
    if (editMode.value === true) {
      await taskStore.updateTask(updatedTask.id, updatedTask);
      showDialog.value = false;
      selectedTask.value = null;

      toast.add({
        severity: "success",
        summary: "Èxit",
        detail: "Tasca actualitzada correctament",
        life: 3000,
      });
    } else {
      await taskStore.createTask(updatedTask);
      showDialog.value = false;
      selectedTask.value = null;
      toast.add({
        severity: "success",
        summary: "Èxit",
        detail: "Tasca actualitzada correctament",
        life: 3000,
      });
    }

    loadData();
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
