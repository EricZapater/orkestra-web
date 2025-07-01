<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" class="mb-3" />
  <div class="card">
    <h2>{{ title }}</h2>
    <div class="four-columns">
      <p>Import Venta: {{ projectStore.selectedProject?.amount }}</p>
      <p>Cost Previst: {{ projectStore.selectedProject?.estimated_cost }}</p>
      <p>Cost Actual: {{ projectStore.selectedProject?.amount }}</p>
      <p>
        Marge:
        <Tag
          :value="marginInfo.label"
          :severity="marginInfo.severity"
          class="ml-2"
        />
      </p>
    </div>
    <form @submit.prevent="onSubmit" v-if="projectStore.selectedProject">
      <div class="two-columns">
        <div style="margin-right: 1rem">
          <label for="start_date" style="margin-right: 1rem">Inici</label>
          <DatePicker
            v-model="startDate"
            dateFormat="dd/mm/yy"
            showIcon
            style="width: 70%"
          />
        </div>
        <div style="margin-right: 1rem">
          <label for="end_date" style="margin-right: 1rem">Final</label>
          <DatePicker
            v-model="endDate"
            dateFormat="dd/mm/yy"
            showIcon
            style="width: 70%"
          />
        </div>
      </div>
      <div class="field mb-3" style="margin-top: 1rem">
        <label for="description">Descripció</label>
        <Textarea
          id="description"
          v-model="selectedProject.description"
          rows="4"
          style="width: 100%"
          maxlength="250"
          autoResize
        />
      </div>
      <div class="two-columns" style="margin-top: 1rem">
        <div class="field col-12 md:col-4">
          <label for="color" style="margin-right: 1rem">Color</label>
          <ColorPicker v-model="selectedProject.color" format="hex" />
        </div>

        <div class="field mb-4">
          <label for="customer_id" style="margin-right: 1rem">Client</label>
          <Select
            v-model="selectedProject.customer_id"
            :options="customerStore.customers"
            optionLabel="comercial_name"
            optionValue="id"
            placeholder="Escull un client"
            class="w-full"
            style="width: 70%"
          />
        </div>
      </div>
      <div class="mt-3 p-field three-columns" style="margin-top: 1rem">
        <div></div>
        <div></div>
        <div class="two-columns">
          <div></div>
          <Button type="submit" class="btn-primary">
            {{ "Actualitza" }}
          </Button>
        </div>
      </div>
    </form>

    <Tabs value="0">
      <TabList>
        <Tab value="0">Tasques</Tab>
        <Tab value="1">Partides econòmiques</Tab>
        <Tab value="2">Operaris</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div>
            <Button
              icon="pi pi-plus"
              label="Afegir tasques"
              class="p-button"
              @click="createTask"
            />
          </div>
          <DataTable
            v-if="taskStore.tasks"
            :value="taskStore.tasks"
            dataKey="id"
            tableStyle="min-width: 50rem"
            :showGridlines="true"
            :paginator="true"
            :rows="10"
          >
            <Column field="description" header="Descripció" />
            <Column field="notes" header="Notes" />
            <Column field="user_id" header="Usuari" />

            <Column header="Accions" style="width: 10rem">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-text p-button-sm"
                  severity="success"
                  @click="loadEditModal(slotProps.data)"
                  title="Eliminar"
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
        </TabPanel>
        <TabPanel value="1">
          <p>Contingut de Partides econòmiques</p>
        </TabPanel>
        <TabPanel value="2">
          <p>Contingut d'Operaris</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
    <Dialog
      v-model:visible="showEditDialog"
      :modal="true"
      header="Edit Task"
      :style="{ width: '500px' }"
    >
      <TaskForm
        v-if="selectedTask"
        :task="selectedTask"
        :editMode="editMode"
        @save="saveTask"
        @cancel="showEditDialog = false"
      />
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import AppBreadCrumb from "../components/AppBreadCrumb.vue";
import { ref, computed, onMounted } from "vue";
import { useProjectStore } from "../stores/projectStore";
import { useCustomerStore } from "../stores/customerStore";
import { useToast } from "primevue/usetoast";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useTaskStore } from "../stores/taskStore";
import { useUserStore } from "../stores/userStore";
import { useConfirm } from "primevue/useconfirm";
import type { Task, TaskRequest } from "../types";
import TaskForm from "../components/TaskForm.vue";
import { useMarginColor } from "../utils/useMarginColor";

const toast = useToast();
const projectStore = useProjectStore();
const customerStore = useCustomerStore();
const taskStore = useTaskStore();
const userStore = useUserStore();
const confirm = useConfirm();

const route = useRoute();
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const router = useRouter();

const home = { label: "Inici", icon: "pi pi-home", route: "/" };
const breadcrumbItems = ref([
  { label: "Projectes", route: "/projects", icon: "pi pi-briefcase" },
  {
    label: "Editar projecte",
    icon: "pi pi-pencil",
  },
]);

const projectId = ref("");
const title = ref("");
const showEditDialog = ref(false);
const selectedTask = ref<Task | null>(null);
const editMode = ref(false);

projectId.value = route.params.id as string;

const selectedProject = computed(() => projectStore.selectedProject!);

const marginInfo = computed(() =>
  useMarginColor(
    selectedProject.value?.amount ?? 0,
    selectedProject.value?.estimated_cost ?? 0
  )
);

const handleDelete = async (task: Task) => {
  confirm.require({
    message: `Estàs segur que vols eliminar la tasca "${task.description}"?`,
    header: "Confirmar eliminació",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    acceptLabel: "Eliminar",
    rejectLabel: "Cancel·lar",
    accept: async () => {
      try {
        await taskStore.deleteTask(task.id);

        toast.add({
          severity: "success",
          summary: "Tasca eliminada",
          detail: "La tasca s'ha eliminat correctament",
          life: 3000,
        });

        await taskStore.fetchTasksByProjectId(projectId.value);
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "No s'ha pogut eliminar la tasca",
          life: 3000,
        });
      }
    },
  });
};

const loadEditModal = async (task: Task) => {
  selectedTask.value = { ...task };
  showEditDialog.value = true;
  editMode.value = true;
};

const createTask = async () => {
  const newTask = ref<Task>({
    id: "",
    description: "",
    notes: "",
    user_id: "",
    status: "ToDo",
    priority: "C",
    project_id: projectId.value,
    start_date: null,
    end_date: null,
  });
  selectedTask.value = { ...newTask.value };
  showEditDialog.value = true;
  editMode.value = false;
};

const saveTask = async (updatedTask: Task) => {
  try {
    if (editMode.value === true) {
      await taskStore.updateTask(updatedTask.id, updatedTask);
      showEditDialog.value = false;
      selectedTask.value = null;

      toast.add({
        severity: "success",
        summary: "Èxit",
        detail: "Tasca actualitzada correctament",
        life: 3000,
      });
    } else {
      await taskStore.createTask(updatedTask);
      showEditDialog.value = false;
      selectedTask.value = null;
      toast.add({
        severity: "success",
        summary: "Èxit",
        detail: "Tasca actualitzada correctament",
        life: 3000,
      });
    }

    await taskStore.fetchTasksByProjectId(projectId.value);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error actualitzant la tasca",
      life: 3000,
    });
  }
};

const onSubmit = async () => {
  try {
    if (!startDate.value || !endDate.value) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Les dates d'inici i final són obligatòries.",
      });
      return;
    }

    selectedProject.value.start_date = startDate.value.toISOString();
    selectedProject.value.end_date = endDate.value.toISOString();

    await projectStore.updateProject(selectedProject.value);
    toast.add({
      severity: "success",
      summary: "Èxit",
      detail: "Projecte actualitzat correctament.",
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut actualitzar el projecte.",
    });
  }
};

onMounted(async () => {
  try {
    await projectStore.fetchProjectById(projectId.value);
    title.value = `Editar projecte: ${selectedProject.value.description}`;
    startDate.value = selectedProject.value.start_date
      ? new Date(selectedProject.value.start_date)
      : null;
    endDate.value = selectedProject.value.end_date
      ? new Date(selectedProject.value.end_date)
      : null;
    await userStore.fetchUsers();
    await customerStore.fetchCustomers();
    await taskStore.fetchTasksByProjectId(projectId.value);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut carregar el projecte.",
    });
  }
});
</script>
