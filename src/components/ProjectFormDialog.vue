<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="editMode ? 'Editar projecte' : 'Afegir projecte'"
    :style="{ width: '60rem' }"
  >
    <form @submit.prevent="onSubmit" class="project-form">
      <div class="form-grid">
        <!-- Descripció -->
        <div class="field full-width">
          <label for="description">Descripció</label>
          <Textarea
            id="description"
            v-model="project.description"
            rows="4"
            maxlength="250"
            autoResize
            placeholder="Descripció del projecte..."
            :class="{ 'p-invalid': !project.description?.trim() }"
          />
        </div>

        <!-- Inici -->
        <div class="field">
          <label for="start_date">Data d'inici</label>
          <DatePicker
            v-model="project.start_date"
            dateFormat="dd/mm/yy"
            showIcon
            class="w-full"
          />
        </div>

        <!-- Final -->
        <div class="field">
          <label for="end_date">Data de finalització</label>
          <DatePicker
            v-model="project.end_date"
            dateFormat="dd/mm/yy"
            showIcon
            class="w-full"
          />
        </div>

        <!-- Color -->
        <div class="field">
          <label for="color">Color</label>
          <ColorPicker
            v-model="project.color"
            format="hex"
            :style="{
              border: project.color ? '0px solid #ccc' : '1px dashed #ef4444',
              padding: '0.3rem',
            }"
          />
        </div>

        <!-- Client -->
        <div class="field full-width">
          <label for="customer_id">Client</label>
          <Select
            v-model="project.customer_id"
            :options="customers"
            optionLabel="comercial_name"
            optionValue="id"
            placeholder="Selecciona un client"
            class="w-full"
          />
        </div>
      </div>

      <!-- Accions -->
      <div class="form-actions">
        <Button
          type="button"
          label="Cancel·lar"
          icon="pi pi-times"
          class="p-button-text"
          @click="onCancel"
        />
        <Button
          type="submit"
          :label="editMode ? 'Actualitza' : 'Afegir'"
          icon="pi pi-check"
          class="btn-primary"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { setStartOfDay, setEndOfDay } from "../utils/date";
import type { ProjectRequest } from "../types";

const props = defineProps<{
  visible: boolean;
  editMode: boolean;
  project: ProjectRequest;
  customers: Array<{ id: string; comercial_name: string }>;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "submit", project: ProjectRequest): void;
}>();

const { visible, editMode, project } = toRefs(props);

const onCancel = () => {
  emit("update:visible", false);
};

const onSubmit = () => {
  project.value.start_date = setStartOfDay(project.value.start_date);
  project.value.end_date = setEndOfDay(project.value.end_date);
  emit("submit", project.value);
};
</script>

<style scoped>
.project-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

/* Error visuals */
:deep(.p-invalid) {
  border-color: #ef4444;
}

.p-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
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
</style>
