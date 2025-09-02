<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <div class="form-grid">
      <!-- Operari -->
      <div class="field">
        <label for="operator">Operari *</label>
        <Select
          id="operator"
          v-model="formData.operator_id"
          :options="operatorOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona un operari"
          :class="{ 'p-invalid': errors.operator_id }"
        />
        <small v-if="errors.operator_id" class="p-error">{{
          errors.operator_id
        }}</small>
      </div>

      <!-- Cost -->
      <div class="field">
        <label for="cost">Cost *</label>
        <InputNumber
          id="cost"
          v-model="formData.cost"
          placeholder="Cost de l'operari"
          :class="{ 'p-invalid': errors.cost }"
          mode="currency"
          currency="EUR"
          locale="ca-ES"
        />
        <small v-if="errors.cost" class="p-error">{{ errors.cost }}</small>
      </div>

      <!-- Percentatge de dedicació -->
      <div class="field">
        <label for="dedication_percentage">Dedicació de l'operari *</label>
        <InputNumber
          id="dedication_percentage"
          v-model="formData.dedication_percentage"
          placeholder="Dedicació de l'operari"
          :class="{ 'p-invalid': errors.dedication_percentage }"
        />
        <small v-if="errors.cost" class="p-error">{{ errors.cost }}</small>
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
        <label for="start_date">Data d'inici *</label>
        <DatePicker
          id="startDate"
          v-model="startDate"
          dateFormat="dd/mm/yy"
          showIcon
          placeholder="Selecciona data d'inici"
          :class="{ 'p-invalid': errors.start_date }"
        />
        <small v-if="errors.start_date" class="p-error">{{
          errors.start_date
        }}</small>
      </div>

      <!-- Data de finalització (només lectura) -->
      <div class="field">
        <label for="end_date">Data de finalització *</label>
        <DatePicker
          id="endDate"
          v-model="endDate"
          dateFormat="dd/mm/yy"
          showIcon
          placeholder="Selecciona data de finalització"
          :class="{ 'p-invalid': errors.end_date }"
        />
        <small v-if="errors.end_date" class="p-error">{{
          errors.end_date
        }}</small>
      </div>
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
        :label="editMode ? 'Actualitzar' : 'Crear'"
        :icon="editMode ? 'pi pi-check' : 'pi pi-plus'"
        :loading="loading"
        :disabled="!isFormValid"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, reactive } from "vue";
import type {
  Operator,
  OperatorToProjectRequest,
  Task,
  UserResponse,
} from "../types";
import { useProjectStore } from "../stores/projectStore";
import { useUserStore } from "../stores/userStore";
import { useToast } from "primevue";

// Props
interface Props {
  operators: Operator[];
  project_id: string;
  loading?: boolean;
  editMode: boolean;
}

// Form data
interface FormData {
  operator_id: string;
  project_id: string;
  cost: number;
  dedication_percentage: number;
  start_date: string;
  end_date: string;
}

const formData = reactive({
  operator_id: "",
  project_id: "",
  cost: 0,
  dedication_percentage: 0,
  start_date: "",
  end_date: "",
});

const props = withDefaults(defineProps<Props>(), {
  operators: () => [],
  project_id: "",
  loading: false,
  editMode: false,
});

// Emits
const emit = defineEmits<{
  save: [operatorToProject: OperatorToProjectRequest];
  cancel: [];
}>();

// Stores
const projectStore = useProjectStore();
const toast = useToast();

const startDate = computed({
  get: () => {
    return formData.start_date ? new Date(formData.start_date) : null;
  },
  set: (value: Date | null) => {
    formData.start_date = value ? value.toISOString() : "";
    // Forçar revalidació quan canvia la data
    nextTick(() => {
      validateDateFields();
    });
  },
});

const endDate = computed({
  get: () => {
    return formData.end_date ? new Date(formData.end_date) : null;
  },
  set: (value: Date | null) => {
    formData.end_date = value ? value.toISOString() : "";
    // Forçar revalidació quan canvia la data
    nextTick(() => {
      validateDateFields();
    });
  },
});

const validateDateFields = () => {
  // Netejar errors de dates
  errors.start_date = "";
  errors.end_date = "";

  // Validar data d'inici
  if (!formData.start_date) {
    errors.start_date = "La data d'inici és obligatòria";
    return;
  }

  // Validar data de finalització
  if (!formData.end_date) {
    errors.end_date = "La data de finalització és obligatòria";
    return;
  }

  // Validar que la data de finalització sigui posterior a la d'inici
  const start = new Date(formData.start_date);
  const end = new Date(formData.end_date);

  if (end <= start) {
    errors.end_date =
      "La data de finalització ha de ser posterior a la d'inici";
  }
};

const operatorOptions = computed(() => {
  return props.operators
    .map((operator) => ({
      value: operator.id,
      label: `${operator.surname}, ${operator.name}`,
      cost: operator.cost, // guardem el cost per poder-lo utilitzar després
    }))
    .sort((a, b) => a.label.localeCompare(b.label)); // ordenat per surname (que és el primer al label)
});

// Watcher per actualitzar el cost quan es selecciona un operari
watch(
  () => formData.operator_id,
  (newOperatorId) => {
    if (newOperatorId) {
      const selectedOperator = props.operators.find(
        (op) => op.id === newOperatorId
      );
      if (selectedOperator) {
        formData.cost = selectedOperator.cost;
      }
    } else {
      formData.cost = 0;
    }
  }
);

// Form validation
const errors = reactive({
  operator_id: "",
  project_id: "",
  cost: "",
  dedication_percentage: "",
  start_date: "",
  end_date: "",
});

const isFormValid = computed(() => {
  // Comprovar camps obligatoris
  const hasOperator = formData.operator_id.trim() !== "";
  const hasProjectId = formData.project_id.trim() !== "";
  const hasCost = formData.cost !== null && formData.cost >= 0;
  const hasDedication =
    formData.dedication_percentage !== null &&
    formData.dedication_percentage > 0 &&
    formData.dedication_percentage <= 100;
  const hasStartDate = formData.start_date.trim() !== "";
  const hasEndDate = formData.end_date.trim() !== "";

  // Comprovar errors
  const hasErrors = Object.values(errors).some((error) => error !== "");

  const isValid =
    hasOperator &&
    hasProjectId &&
    hasCost &&
    hasDedication &&
    hasStartDate &&
    hasEndDate &&
    !hasErrors;

  console.log("Form valid:", isValid);
  return isValid;
});

// Methods
const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  let isValid = true;

  // Validate project_id
  if (!formData.project_id.trim()) {
    errors.project_id = "El projecte és obligatori";
    isValid = false;
  }

  validateDateFields();

  return isValid;
};

const projectDescription = ref("");

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

const handleSubmit = () => {
  if (!validateForm()) return;
  if (!startDate.value || !endDate.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Les dates d'inici i final són obligatòries.",
    });
    return;
  }
  formData.start_date = startDate.value.toISOString();
  formData.end_date = endDate.value.toISOString();

  const request: OperatorToProjectRequest = {
    ...formData,
    cost: formData.cost.toString(),
    dedication_percentage: formData.dedication_percentage.toString(),
  };

  emit("save", request);
};

onMounted(() => {
  // Assignar el project_id del prop al formData
  formData.project_id = props.project_id;

  // Carregar dades del projecte
  if (props.project_id) {
    loadProjectData(props.project_id);
  }
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
