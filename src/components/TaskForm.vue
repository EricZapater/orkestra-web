<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <div class="form-grid">
      <!-- Descripció -->
      <div class="field">
        <label for="description">Descripció *</label>
        <InputText
          id="description"
          v-model="formData.description"
          :class="{ 'p-invalid': errors.description }"
          placeholder="Descripció de la tasca"
          required
        />
        <small v-if="errors.description" class="p-error">{{
          errors.description
        }}</small>
      </div>

      <!-- Status -->
      <div class="field">
        <label for="status">Estat *</label>
        <Select
          id="status"
          v-model="formData.status"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona un estat"
          :class="{ 'p-invalid': errors.status }"
        />
        <small v-if="errors.status" class="p-error">{{ errors.status }}</small>
      </div>

      <!-- Prioritat -->
      <div class="field">
        <label for="priority">Prioritat *</label>
        <Select
          id="priority"
          v-model="formData.priority"
          :options="priorityOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona una prioritat"
          :class="{ 'p-invalid': errors.priority }"
        />
        <small v-if="errors.priority" class="p-error">{{
          errors.priority
        }}</small>
      </div>

      <!-- Usuari -->
      <div class="field">
        <label for="user_id">Usuari assignat *</label>
        <Select
          id="user_id"
          v-model="formData.user_id"
          :options="userOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona un usuari"
          :class="{ 'p-invalid': errors.user_id }"
        />
        <small v-if="errors.user_id" class="p-error">{{
          errors.user_id
        }}</small>
      </div>

      <!-- Projecte -->
      <div class="field">
        <label for="project">Projecte *</label>
        <InputText
          id="project"
          :value="projectDescription"
          placeholder="Carregant projecte..."
          readonly
          :class="{ 'p-invalid': errors.project_id }"
        />
        <small v-if="errors.project_id" class="p-error">{{
          errors.project_id
        }}</small>
      </div>

      <!-- Data d'inici (només lectura) -->
      <div class="field">
        <label for="start_date">Data d'inici</label>
        <InputText
          id="start_date"
          :value="formattedStartDate"
          placeholder="No definida"
          readonly
          class="readonly-field"
        />
      </div>

      <!-- Data de finalització (només lectura) -->
      <div class="field">
        <label for="end_date">Data de finalització</label>
        <InputText
          id="end_date"
          :value="formattedEndDate"
          placeholder="No definida"
          readonly
          class="readonly-field"
        />
      </div>
    </div>

    <!-- Notes -->
    <div class="field full-width">
      <label for="notes">Notes</label>
      <Textarea
        id="notes"
        v-model="formData.notes"
        rows="4"
        placeholder="Notes addicionals sobre la tasca..."
        :class="{ 'p-invalid': errors.notes }"
      />
      <small v-if="errors.notes" class="p-error">{{ errors.notes }}</small>
    </div>

    <!-- Botons d'acció -->
    <div class="form-actions">
      <Button
        type="button"
        label="Cancel·lar"
        icon="pi pi-times"
        class="p-button-text"
        @click="$emit('cancel')"
      />
      <Button
        type="submit"
        :label="isEdit ? 'Actualitzar' : 'Crear'"
        :icon="isEdit ? 'pi pi-check' : 'pi pi-plus'"
        :loading="loading"
        :disabled="!isFormValid"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { Task, UserResponse } from "../types";
import { useProjectStore } from "../stores/projectStore";
import { useUserStore } from "../stores/userStore";

// Props
interface Props {
  task?: Task | null;
  loading?: boolean;
  editMode: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  task: null,
  loading: false,
  editMode: false,
});

// Emits
const emit = defineEmits<{
  save: [task: Task];
  cancel: [];
}>();

// Stores
const projectStore = useProjectStore();
const userStore = useUserStore();

// Form data
const formData = ref({
  id: "",
  description: "",
  notes: "",
  user_id: "",
  status: "ToDo" as Task["status"],
  priority: "C" as Task["priority"],
  project_id: "",
  start_date: null as string | null,
  end_date: null as string | null,
});

// Form validation
const errors = ref({
  description: "",
  status: "",
  priority: "",
  project_id: "",
  user_id: "",
  start_date: "",
  end_date: "",
  notes: "",
});

// Project data
const projectDescription = ref("");

// Options
const statusOptions = [
  { label: "Pendent", value: "Pending" },
  { label: "Per fer", value: "ToDo" },
  { label: "En progrés", value: "InProgress" },
  { label: "Finalitzat", value: "Done" },
];

const priorityOptions = [
  { label: "A - Molt Alta", value: "A" },
  { label: "B - Alta", value: "B" },
  { label: "C - Normal", value: "C" },
  { label: "D - Baixa", value: "D" },
];

// Computed
const isEdit = computed(() => !!props.task?.id);

const userOptions = computed(() => {
  return userStore.users.map((user: UserResponse) => ({
    label: user.name || user.email, // Assumint que l'usuari té name o email
    value: user.id,
  }));
});

const formattedStartDate = computed(() => {
  if (!formData.value.start_date) return "";
  return new Date(formData.value.start_date).toLocaleDateString("ca-ES");
});

const formattedEndDate = computed(() => {
  if (!formData.value.end_date) return "";
  return new Date(formData.value.end_date).toLocaleDateString("ca-ES");
});

const isFormValid = computed(() => {
  return (
    formData.value.description.trim() !== "" &&
    formData.value.project_id.trim() !== "" &&
    formData.value.user_id.trim() !== "" &&
    !Object.values(errors.value).some((error) => error !== "")
  );
});

// Methods
const validateForm = () => {
  // Reset errors
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = "";
  });

  let isValid = true;

  // Validate description
  if (!formData.value.description.trim()) {
    errors.value.description = "La descripció és obligatòria";
    isValid = false;
  } else if (formData.value.description.length > 255) {
    errors.value.description =
      "La descripció no pot tenir més de 255 caràcters";
    isValid = false;
  }

  // Validate project_id
  if (!formData.value.project_id.trim()) {
    errors.value.project_id = "El projecte és obligatori";
    isValid = false;
  }

  // Validate user_id
  if (!formData.value.user_id.trim()) {
    errors.value.user_id = "L'usuari assignat és obligatori";
    isValid = false;
  }

  // Validate status
  if (!formData.value.status) {
    errors.value.status = "L'estat és obligatori";
    isValid = false;
  }

  // Validate priority
  if (!formData.value.priority) {
    errors.value.priority = "La prioritat és obligatòria";
    isValid = false;
  }

  // Validate notes length
  if (formData.value.notes && formData.value.notes.length > 1000) {
    errors.value.notes = "Les notes no poden tenir més de 1000 caràcters";
    isValid = false;
  }

  return isValid;
};

const loadProjectData = async (projectId: string) => {
  try {
    await projectStore.fetchProjectById(projectId);
    const project = projectStore.selectedProject;
    if (project) {
      projectDescription.value =
        project.description || "Projecte sense descripció";
    }
  } catch (error) {
    console.error("Error carregant el projecte:", error);
    projectDescription.value = "Error carregant el projecte";
  }
};

const resetForm = () => {
  formData.value = {
    id: "",
    description: "",
    notes: "",
    user_id: "",
    status: "ToDo",
    priority: "C",
    project_id: "",
    start_date: null,
    end_date: null,
  };
  projectDescription.value = "";

  // Reset errors
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = "";
  });
};

const loadTaskData = async () => {
  if (props.task) {
    formData.value = {
      id: props.task.id,
      description: props.task.description,
      notes: props.task.notes || "",
      user_id: props.task.user_id,
      status: props.task.status,
      priority: props.task.priority,
      project_id: props.task.project_id,
      start_date: props.task.start_date ?? null,
      end_date: props.task.end_date ?? null,
    };

    // Carrega la informació del projecte
    if (props.task.project_id) {
      await loadProjectData(props.task.project_id);
    }
  } else {
    resetForm();
  }
};

const handleSubmit = () => {
  if (!validateForm()) return;

  const taskData: Task = {
    ...formData.value,
  };

  emit("save", taskData);
};

// Watchers
watch(() => props.task, loadTaskData, { immediate: true });

// Lifecycle
onMounted(async () => {
  // Carrega els usuaris si no estan carregats
  if (userStore.users.length === 0) {
    await userStore.fetchUsers();
  }

  await loadTaskData();
});
</script>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field.full-width {
  grid-column: 1 / -1;
}

.field label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

/* Input styles */
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-calendar),
:deep(.p-inputtextarea) {
  width: 100%;
}

:deep(.p-invalid) {
  border-color: #ef4444;
}

.p-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Readonly field styles */
.readonly-field {
  background-color: #f3f4f6 !important;
  color: #6b7280;
  cursor: not-allowed;
}

:deep(.readonly-field) {
  background-color: #f3f4f6 !important;
  color: #6b7280;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .p-button {
    width: 100%;
  }
}

/* Priority colors in dropdown */
:deep(.p-dropdown-item[aria-label*="A -"]) {
  border-left: 4px solid #ef4444;
}

:deep(.p-dropdown-item[aria-label*="B -"]) {
  border-left: 4px solid #f59e0b;
}

:deep(.p-dropdown-item[aria-label*="C -"]) {
  border-left: 4px solid #3b82f6;
}

:deep(.p-dropdown-item[aria-label*="D -"]) {
  border-left: 4px solid #10b981;
}

/* Status colors */
:deep(.p-dropdown-item[aria-label*="Pendent"]) {
  color: #6b7280;
}

:deep(.p-dropdown-item[aria-label*="Per fer"]) {
  color: #7c3aed;
}

:deep(.p-dropdown-item[aria-label*="En progrés"]) {
  color: #dc2626;
}

:deep(.p-dropdown-item[aria-label*="Finalitzat"]) {
  color: #059669;
}
</style>
