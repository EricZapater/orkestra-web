<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <div class="form-grid">
      <div class="field">
        <label for="name">Nom *</label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': errors.name }"
          placeholder="Nom"
          required
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>
      <div class="field">
        <label for="surname">Cognom *</label>
        <InputText
          id="surname"
          v-model="formData.surname"
          :class="{ 'p-invalid': errors.surname }"
          placeholder="Cognom"
          required
        />
        <small v-if="errors.surname" class="p-error">{{
          errors.surname
        }}</small>
      </div>

      <div class="field">
        <label for="cost">Cost Jornada *</label>
        <InputNumber
          id="cost"
          v-model="formData.cost"
          :class="{ 'p-invalid': errors.cost }"
          placeholder="Cost Jornada"
          required
        />
        <small v-if="errors.cost" class="p-error">{{ errors.cost }}</small>
      </div>
      <div class="field">
        <label for="color">Color</label>
        <ColorPicker
          v-model="formData.color"
          format="hex"
          :style="{
            border: formData.color ? '0px solid #ccc' : '1px dashed #ef4444',
            padding: '0.3rem',
          }"
        />
      </div>
    </div>
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
import type { Operator, OperatorRequest } from "../types";
import { ref, computed, watch } from "vue";

interface Props {
  operator?: Operator | null;
  loading?: boolean;
  editMode: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  operator: null,
  loading: false,
  editMode: false,
});

const emit = defineEmits<{
  save: [operator: Operator];
  cancel: [];
}>();

const formData = ref({
  id: "",
  name: "",
  surname: "",
  cost: 0,
  color: "",
});

const errors = ref({
  name: "",
  surname: "",
  cost: "",
});

const isFormValid = computed(() => {
  return (
    formData.value.name.trim() !== "" &&
    formData.value.surname.trim() !== "" &&
    formData.value.cost.toString().trim() !== "" &&
    !Object.values(errors.value).some((error) => error !== "")
  );
});

const validateForm = () => {
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = "";
  });
  let isValid = true;

  if (!formData.value.name.trim()) {
    errors.value.name = "El nom es obligatori";
    isValid = false;
  }
  if (!formData.value.surname.trim()) {
    errors.value.surname = "El cognom es obligatori";
    isValid = false;
  }
  if (!formData.value.cost.toString().trim()) {
    errors.value.cost = "El cost per jornada es obligatori";
    isValid = false;
  }
  return isValid;
};

const resetForm = () => {
  formData.value = {
    id: "",
    name: "",
    surname: "",
    cost: 0,
    color: "",
  };
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = "";
  });
};

watch(
  () => props.operator,
  (newOperator) => {
    if (newOperator && props.editMode) {
      // Si estem editant i tenim un operari, carreguem les dades
      formData.value = {
        id: newOperator.id,
        name: newOperator.name,
        surname: newOperator.surname,
        cost: newOperator.cost,
        color: newOperator.color,
      };
    } else {
      // Si no estem editant o no tenim operari, resetegem el formulari
      resetForm();
    }
    // Netejar errors quan canviï l'operari
    Object.keys(errors.value).forEach((key) => {
      errors.value[key as keyof typeof errors.value] = "";
    });
  },
  { immediate: true } // Executar immediatament quan es monta el component
);

const handleSubmit = () => {
  if (!validateForm()) return;
  const operator: Operator = {
    ...formData.value,
  };
  emit("save", operator);
};
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
