<template>
  <div
    class="task-card"
    :data-task-id="project.id"
    :class="[`priority-${project.priority.toLowerCase()}`]"
  >
    <div class="task-header">
      <div class="priority-indicator">
        <Tag
          :value="project.priority"
          :severity="getPrioritySeverity(project.priority)"
          class="priority-tag"
        />
      </div>
      <div class="task-actions">
        <Button
          icon="pi pi-eye"
          class="p-button-text p-button-sm"
          @click="handleClickView(project)"
          v-tooltip.top="'Editar projecte'"
        />
        <!--<Button
          icon="pi pi-trash"
          class="p-button-text p-button-sm p-button-danger"
          @click="$emit('delete', project)"
          v-tooltip.top="'Eliminar tasca'"
        />-->
      </div>
    </div>

    <div class="task-content">
      <h4 class="task-description">
        {{ truncateText(project.description, 100) }}
      </h4>

      <p v-if="project.start_date" class="task-notes">
        {{
          project.start_date ? `Inici: ${formatDate(project.start_date)}` : ""
        }}
      </p>
      <p v-if="project.end_date" class="task-notes">
        {{
          project.end_date ? `Fi Previst: ${formatDate(project.end_date)}` : ""
        }}
      </p>
    </div>

    <div class="task-footer">
      <div class="task-dates">
        <div v-if="project.start_date" class="date-item"></div>
      </div>
    </div>

    <!--<div class="task-project" v-if="task.project_id">
        <Chip :label="getProjectName(task.project_id)" class="project-chip" />
      </div>
    </div>-->
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Task, Project } from "../types";
import type { UserResponse } from "../types";

// Components
import Button from "primevue/button";
import Tag from "primevue/tag";
import Chip from "primevue/chip";
import { useRouter } from "vue-router";

const router = useRouter();
// Props
/*interface Props {
  task: Task;  
}

const props = defineProps<Props>();*/
const props = defineProps<{
  project: Project;
  users: UserResponse[];
}>();

// Emits
/*
const emit = defineEmits<{
  edit: [task: Task];
  delete: [task: Task];
}>();
*/
// Methods
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

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const getProjectName = (projectId: string) => {
  // Aquí podries tenir una store de projectes o una llista
  // Per ara retorno l'ID abreviat
  return `Proj-${projectId.substring(0, 6)}`;
};

const getUserName = (userId: string) => {
  const user = props.users.find((u) => u.id === userId);
  return user?.name || user?.email || "Usuari desconegut";
};

const handleClickView = (project: Project) => {
  router.push(`/project/${project.id}`);
};

// Computed
const isOverdue = computed(() => {
  if (!props.project.end_date) return false;
  const endDate = new Date(props.project.end_date);
  const today = new Date();
  return endDate < today && props.project.status !== "Done";
});
</script>

<style scoped>
.task-card {
  background: white;
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #ddd;
  cursor: grab;
  transition: all 0.2s ease;
  position: relative;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.task-card:active {
  cursor: grabbing;
}

/* Priority Colors */
.task-card.priority-a {
  border-left-color: #e74c3c;
}

.task-card.priority-b {
  border-left-color: #f39c12;
}

.task-card.priority-c {
  border-left-color: #3498db;
}

.task-card.priority-d {
  border-left-color: #27ae60;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.1rem;
}

.priority-indicator {
  flex-shrink: 0;
}

.priority-tag {
  font-size: 0.75rem;
  font-weight: bold;
}

.task-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-card:hover .task-actions {
  opacity: 1;
}

.task-content {
  margin-bottom: 0.5rem;
}

.task-description {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1;
}

.task-notes {
  margin: 0;
  font-size: 0.875rem;
  color: #7f8c8d;
  line-height: 1.3;
}

.task-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-dates {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6c757d;
}

.date-item i {
  font-size: 0.7rem;
}

.task-project {
  display: flex;
  justify-content: flex-end;
}

.project-chip {
  font-size: 0.7rem;
  background-color: #f8f9fa;
  color: #495057;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .task-card {
    padding: 0.75rem;
  }

  .task-actions {
    opacity: 1; /* Always show on mobile */
  }

  .task-description {
    font-size: 0.875rem;
  }
}
</style>
