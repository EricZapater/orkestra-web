<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" class="mb-3" />
  <div class="card">
    <div class="kanban-board">
      <!-- Header del tauler amb toggle de filtre -->

      <div class="project-kanban-columns">
        <!-- Backlog Column -->
        <div class="kanban-column">
          <div class="column-header backlog-header">
            <i class="pi pi-clock"></i>
            <h3>Backlog</h3>
            <Badge :value="backlogProjects.length" class="ml-2" />
          </div>
          <div
            class="task-list"
            data-status="Backlog"
            v-sortable="{
            group: 'kanban',
            animation: 200,
            ghostClass: 'ghost-task',
            chosenClass: 'chosen-task',
            onEnd: (evt: SortableEvent) => handleDrop(evt, 'Backlog')
          }"
          >
            <ProjectCard
              v-for="project in backlogProjects"
              :key="project.id"
              :project="project"
              :users="userStore.users"
              :data-task-id="project.id"
            />
          </div>
        </div>

        <div class="kanban-column">
          <div class="column-header ready-header">
            <i class="pi pi-clock"></i>
            <h3>Ready To Start</h3>
            <Badge :value="readyToStartProjects.length" class="ml-2" />
          </div>
          <div
            class="task-list"
            data-status="ReadyToStart"
            v-sortable="{
            group: 'kanban',
            animation: 200,
            ghostClass: 'ghost-task',
            chosenClass: 'chosen-task',
            onEnd: (evt: SortableEvent) => handleDrop(evt, 'ReadyToStart')
          }"
          >
            <ProjectCard
              v-for="project in readyToStartProjects"
              :key="project.id"
              :project="project"
              :users="userStore.users"
              :data-task-id="project.id"
            />
          </div>
        </div>

        <!-- In Progress Column -->
        <div class="kanban-column">
          <div class="column-header inprogress-header">
            <i class="pi pi-spin pi-cog"></i>
            <h3>In Progress</h3>
            <Badge :value="inProgressProjects.length" class="ml-2" />
          </div>
          <div
            class="task-list"
            data-status="InProgress"
            v-sortable="{
            group: 'kanban',
            animation: 200,
            ghostClass: 'ghost-task',
            chosenClass: 'chosen-task',
            onEnd: (evt: SortableEvent) => handleDrop(evt, 'InProgress')
          }"
          >
            <ProjectCard
              v-for="project in inProgressProjects"
              :key="project.id"
              :project="project"
              :users="userStore.users"
              :data-task-id="project.id"
            />
          </div>
        </div>

        <!-- Done Column -->
        <div class="kanban-column">
          <div class="column-header done-header">
            <i class="pi pi-check-circle"></i>
            <h3>Done</h3>
            <Badge :value="doneProjects.length" class="ml-2" />
          </div>
          <div
            class="task-list"
            data-status="Done"
            v-sortable="{
            group: 'kanban',
            animation: 200,
            ghostClass: 'ghost-task',
            chosenClass: 'chosen-task',
            onEnd: (evt: SortableEvent) => handleDrop(evt, 'Done')
          }"
          >
            <ProjectCard
              v-for="project in doneProjects"
              :key="project.id"
              :project="project"
              :users="userStore.users"
              :data-task-id="project.id"
            />
          </div>
        </div>
      </div>

      <!-- Edit Task Dialog -->
      <!--<Dialog
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
      </Dialog>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTaskStore } from "../stores/taskStore";
import { useProjectStore } from "../stores/projectStore";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { Project, Task } from "../types";
import type { SortableEvent } from "sortablejs";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";

import { useUserStore } from "../stores/userStore";
import ProjectCard from "../components/ProjectCard.vue";

// Composables
const taskStore = useTaskStore();
const projectStore = useProjectStore();
const confirm = useConfirm();
const toast = useToast();
const userStore = useUserStore();

// Reactive state
const showEditDialog = ref(false);
const selectedTask = ref<Task | null>(null);
const selectedProject = ref<Project | null>(null);
const editMode = ref(false);

// Obtenir l'usuari actual del localStorage
const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("orkestra.user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error obtenint usuari del localStorage:", error);
    return null;
  }
};

const currentUser = computed(() => getCurrentUser());

// Computed properties per filtrar tasques per status
const backlogProjects = computed(() =>
  projectStore.projects.filter((project) => project.status === "Backlog")
);

const readyToStartProjects = computed(() =>
  projectStore.projects.filter((project) => project.status === "ReadyToStart")
);

const inProgressProjects = computed(() =>
  projectStore.projects.filter((project) => project.status === "InProgress")
);

const doneProjects = computed(() =>
  projectStore.projects.filter((project) => {
    if (project.status !== "Done") return false;

    const endDate = new Date(project.end_date);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return endDate >= oneMonthAgo;
  })
);

const home = { label: "Inici", icon: "pi pi-home", route: "/" };
const breadcrumbItems = ref([
  { label: "Projectes", route: "/projects", icon: "pi pi-briefcase" },
  {
    label: "Kanban Projectes",
    icon: "pi pi-pencil",
  },
]);

// Methods
const refreshProjects = async (onMounted: boolean) => {
  try {
    await projectStore.fetchProjects();
    if (!onMounted) {
      toast.add({
        severity: "success",
        summary: "Èxit",
        detail: "Projectes actualitzats correctament",
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error carregant els projectes",
      life: 3000,
    });
  }
};

const handleDrop = async (evt: SortableEvent, newStatus: Project["status"]) => {
  const projectElement = evt.item;
  const projectID = projectElement.dataset.taskId;

  const rowStatus = (evt.to as HTMLElement).dataset.status as Project["status"];

  if (!projectID) return;

  const project = projectStore.projects.find((p) => p.id === projectID);

  if (!project || project.status === rowStatus) return;

  try {
    // Actualitzar l'status de la tasca
    project.status = rowStatus;
    await projectStore.updateProject(project);

    toast.add({
      severity: "success",
      summary: "Projecte mogut",
      detail: `Projecte mogut a ${rowStatus}`,
      life: 3000,
    });

    // Refrescar les tasques
    await refreshProjects(false);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut moure el projecte",
      life: 3000,
    });

    // Revertir el canvi visual
    await refreshProjects(false);
  }
};
/*
const editTask = (task: Task) => {
  selectedTask.value = { ...task };
  showEditDialog.value = true;
};

const saveTask = async (updatedTask: Task) => {
  try {
    await taskStore.updateTask(updatedTask.id, updatedTask);
    showEditDialog.value = false;
    selectedTask.value = null;

    toast.add({
      severity: "success",
      summary: "Èxit",
      detail: "Tasca actualitzada correctament",
      life: 3000,
    });

    await refreshTasks(false);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error actualitzant la tasca",
      life: 3000,
    });
  }
};

const deleteTask = (task: Task) => {
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

        await refreshTasks(false);
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
*/
// Lifecycle
onMounted(async () => {
  await userStore.fetchUsers();

  // Carregar la preferència de filtre del localStorage
  refreshProjects(true);
});
</script>

<style scoped>
.kanban-board {
  padding: 1rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.board-header h2 {
  margin: 0;
  color: #333;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.field-checkbox {
  display: flex;
  align-items: center;
}

.field-checkbox label {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  user-select: none;
}

.project-kanban-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  height: calc(100vh - 200px);
}

.kanban-column {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.column-header {
  padding: 1rem;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.column-header h3 {
  margin: 0;
  flex: 1;
}

.backlog-header {
  background-color: #b0bec5; /* gris suau */
}

.ready-header {
  background-color: #ffd54f; /* groc */
}

.inprogress-header {
  background-color: #42a5f5; /* blau */
}

.done-header {
  background-color: #66bb6a; /* verd */
}

.task-list {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  min-height: 200px;
}

/* Drag & Drop Styles */
.ghost-task {
  opacity: 0.5;
  transform: rotate(5deg);
}

.chosen-task {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .kanban-columns {
    grid-template-columns: 1fr;
    height: auto;
  }

  .board-header {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
