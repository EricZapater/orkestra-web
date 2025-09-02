<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <div class="form-grid">
      <div class="field">
        <label for="short_description">Descripció *</label>
        <InputText
          id="short_description"
          v-model="formData.short_description"
          :class="{ 'p-invalid': errors.short_description }"
          placeholder="Descripció del cost"
          required
        />
        <small v-if="errors.short_description" class="p-error">{{
          errors.short_description
        }}</small>
      </div>

      <div class="field">
        <label for="short_description">Import *</label>
        <InputNumber
          id="amount"
          v-model="formData.amount"
          :class="{ 'p-invalid': errors.amount }"
          placeholder="Import del cost"
          required
        />
        <small v-if="errors.amount" class="p-error">{{ errors.amount }}</small>
      </div>

      <div class="field full-width">
        <label for="notes">Notes</label>
        <Textarea
          id="notes"
          v-model="formData.notes"
          rows="4"
          placeholder="Notes addicionals sobre el cost..."
          :class="{ 'p-invalid': errors.notes }"
        />
        <small v-if="errors.notes" class="p-error">{{ errors.notes }}</small>
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
        :label="isEdit ? 'Actualitzar' : 'Crear'"
        :icon="isEdit ? 'pi pi-check' : 'pi pi-plus'"
        :loading="loading"
        :disabled="!isFormValid"
      />
    </div>
  </form>
</template>
<script setup lang="ts">
import type { CostItem, CostItemRequest } from "../types";
import { ref, computed } from "vue";

interface Props {
  costItem?: CostItem | null;
  project_id: string;
  loading?: boolean;
  editMode: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  costItem: null,
  project_id: "",
  loading: false,
  editMode: false,
});

const emit = defineEmits<{
  save: [costItem: CostItemRequest];
  cancel: [];
}>();

const formData = ref({
  id: "",
  short_description: "",
  amount: 0,
  notes: "",
  date: "",
});

const errors = ref({
  short_description: "",
  notes: "",
  amount: "",
});

const isEdit = computed(() => !!props.costItem?.id);

const isFormValid = computed(() => {
  return (
    formData.value.short_description.trim() !== "" &&
    formData.value.notes.trim() !== "" &&
    formData.value.amount.toString().trim() !== "" &&
    !Object.values(errors.value).some((error) => error !== "")
  );
});

const validateForm = () => {
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = "";
  });
  let isValid = true;

  if (!formData.value.short_description.trim()) {
    errors.value.short_description = "La descripció és obligatòria";
    isValid = false;
  } else if (formData.value.short_description.length > 255) {
    errors.value.short_description =
      "La descripció no pot tenir més de 255 caràcters";
    isValid = false;
  }

  if (!formData.value.notes.trim()) {
    errors.value.notes = "La nota de la linea de cost és obligatòria";
    isValid = false;
  }
  return isValid;
};

const resetForm = () => {
  formData.value = {
    id: "",
    short_description: "",
    notes: "",
    amount: 0,
    date: "",
  };
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = "";
  });
};

const handleSubmit = () => {
  if (!validateForm()) return;
  const costItemData: CostItemRequest = {
    project_id: props.project_id,
    short_description: formData.value.short_description,
    amount: formData.value.amount.toString(),
    notes: formData.value.notes,
    date: new Date().toISOString(),
  };
  emit("save", costItemData);
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
