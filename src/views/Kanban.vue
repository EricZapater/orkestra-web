<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" class="mb-3" />
  <div class="card">
    <div class="kanban-board">
      <!-- Header del tauler amb toggle de filtre -->
      <div class="board-header">
        <div class="filter-controls">
          <div class="field-checkbox">
            <Checkbox
              v-model="showOnlyMyTasks"
              inputId="myTasksFilter"
              binary
              @change="onFilterChange"
            />
            <label for="myTasksFilter" class="ml-2">
              <i
                class="pi pi-user mr-1"
                style="margin-left: 0.5rem; margin-right: 0.5rem"
              ></i>
              Només les meves tasques
            </label>
          </div>
        </div>
      </div>

      <div class="kanban-columns">
        <!-- ToDo Column -->
        <div class="kanban-column">
          <div class="column-header todo-header">
            <i class="pi pi-clock"></i>
            <h3>To Do</h3>
            <Badge :value="filteredTodoTasks.length" class="ml-2" />
          </div>
          <div
            class="task-list"
            v-sortable="{
            group: 'kanban',
            animation: 200,
            ghostClass: 'ghost-task',
            chosenClass: 'chosen-task',
            onEnd: (evt: SortableEvent) => handleDrop(evt, 'ToDo')
          }"
          >
            <TaskCard
              v-for="task in filteredTodoTasks"
              :key="task.id"
              :task="task"
              :users="userStore.users"
              @edit="editTask"
              @delete="deleteTask"
            />
          </div>
        </div>

        <!-- In Progress Column -->
        <div class="kanban-column">
          <div class="column-header inprogress-header">
            <i class="pi pi-spin pi-cog"></i>
            <h3>In Progress</h3>
            <Badge :value="filteredInProgressTasks.length" class="ml-2" />
          </div>
          <div
            class="task-list"
            v-sortable="{
            group: 'kanban',
            animation: 200,
            ghostClass: 'ghost-task',
            chosenClass: 'chosen-task',
            onEnd: (evt: SortableEvent) => handleDrop(evt, 'InProgress')
          }"
          >
            <TaskCard
              v-for="task in filteredInProgressTasks"
              :key="task.id"
              :task="task"
              :users="userStore.users"
              @edit="editTask"
              @delete="deleteTask"
            />
          </div>
        </div>

        <!-- Done Column -->
        <div class="kanban-column">
          <div class="column-header done-header">
            <i class="pi pi-check-circle"></i>
            <h3>Done</h3>
            <Badge :value="filteredDoneTasks.length" class="ml-2" />
          </div>
          <div
            class="task-list"
            v-sortable="{
            group: 'kanban',
            animation: 200,
            ghostClass: 'ghost-task',
            chosenClass: 'chosen-task',
            onEnd: (evt: SortableEvent) => handleDrop(evt, 'Done')
          }"
          >
            <TaskCard
              v-for="task in filteredDoneTasks"
              :key="task.id"
              :task="task"
              :users="userStore.users"
              @edit="editTask"
              @delete="deleteTask"
            />
          </div>
        </div>
      </div>

      <!-- Edit Task Dialog -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTaskStore } from "../stores/taskStore";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { Task } from "../types";
import type { SortableEvent } from "sortablejs";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";

import TaskCard from "../components/TaskCard.vue";
import TaskForm from "../components/TaskForm.vue";
import { useUserStore } from "../stores/userStore";

// Composables
const taskStore = useTaskStore();
const confirm = useConfirm();
const toast = useToast();
const userStore = useUserStore();

// Reactive state
const showEditDialog = ref(false);
const selectedTask = ref<Task | null>(null);
const editMode = ref(false);
const showOnlyMyTasks = ref(false);

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
const todoTasks = computed(() =>
  taskStore.tasks.filter((task) => task.status === "ToDo")
);

const inProgressTasks = computed(() =>
  taskStore.tasks.filter((task) => task.status === "InProgress")
);

const doneTasks = computed(() =>
  taskStore.tasks.filter((task) => task.status === "Done")
);

// Computed properties amb filtres d'usuari
const filteredTodoTasks = computed(() => {
  if (!showOnlyMyTasks.value || !currentUser.value) {
    return todoTasks.value;
  }
  return todoTasks.value.filter(
    (task) => task.user_id === currentUser.value.id
  );
});

const filteredInProgressTasks = computed(() => {
  if (!showOnlyMyTasks.value || !currentUser.value) {
    return inProgressTasks.value;
  }
  return inProgressTasks.value.filter(
    (task) => task.user_id === currentUser.value.id
  );
});

const filteredDoneTasks = computed(() => {
  if (!showOnlyMyTasks.value || !currentUser.value) {
    return doneTasks.value;
  }
  return doneTasks.value.filter(
    (task) => task.user_id === currentUser.value.id
  );
});

const home = { label: "Inici", icon: "pi pi-home", route: "/" };
const breadcrumbItems = ref([
  { label: "Projectes", route: "/projects", icon: "pi pi-briefcase" },
  {
    label: "Kanban Tasques",
    icon: "pi pi-pencil",
  },
]);

// Methods
const refreshTasks = async () => {
  try {
    await taskStore.fetchTasks();
    toast.add({
      severity: "success",
      summary: "Èxit",
      detail: "Tasques actualitzades correctament",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error carregant les tasques",
      life: 3000,
    });
  }
};

const onFilterChange = () => {
  // Aquí pots afegir lògica addicional quan canviï el filtre
  // Per exemple, guardar la preferència al localStorage
  try {
    localStorage.setItem(
      "kanban.showOnlyMyTasks",
      showOnlyMyTasks.value.toString()
    );
  } catch (error) {
    console.error("Error guardant preferència de filtre:", error);
  }
};

const handleDrop = async (evt: SortableEvent, newStatus: Task["status"]) => {
  const taskElement = evt.item;
  const taskId = taskElement.dataset.taskId;

  if (!taskId) return;

  const task = taskStore.tasks.find((t) => t.id === taskId);
  if (!task || task.status === newStatus) return;

  try {
    // Actualitzar l'status de la tasca
    await taskStore.updateTask(taskId, {
      ...task,
      status: newStatus,
    });

    toast.add({
      severity: "success",
      summary: "Tasca moguda",
      detail: `Tasca moguda a ${newStatus}`,
      life: 3000,
    });

    // Refrescar les tasques
    await refreshTasks();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut moure la tasca",
      life: 3000,
    });

    // Revertir el canvi visual
    await refreshTasks();
  }
};

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

    await refreshTasks();
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

        await refreshTasks();
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

// Lifecycle
onMounted(async () => {
  await userStore.fetchUsers();

  // Carregar la preferència de filtre del localStorage
  try {
    const savedFilter = localStorage.getItem("kanban.showOnlyMyTasks");
    if (savedFilter !== null) {
      showOnlyMyTasks.value = savedFilter === "true";
    }
  } catch (error) {
    console.error("Error carregant preferència de filtre:", error);
  }

  refreshTasks();
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

.kanban-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

.todo-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.inprogress-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.done-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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
