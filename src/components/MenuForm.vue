<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <div class="form-grid">
      <div class="field">
        <label for="label">Etiqueta *</label>
        <InputText
          id="label"
          v-model="formData.label"
          :class="{ 'p-invalid': errors.label }"
          placeholder="Etiqueta"
          required
        />
        <small v-if="errors.label" class="p-error">{{ errors.label }}</small>
      </div>

      <div class="field">
        <label for="icon">Icona *</label>
        <InputText
          id="icon"
          v-model="formData.icon"
          :class="{ 'p-invalid': errors.icon }"
          placeholder="Icona"
          required
        />
        <small v-if="errors.icon" class="p-error">{{ errors.icon }}</small>
      </div>

      <div class="field">
        <label for="label">Ruta *</label>
        <InputText
          id="route"
          v-model="formData.route"
          :class="{ 'p-invalid': errors.route }"
          placeholder="Ruta"
          required
        />
        <small v-if="errors.route" class="p-error">{{ errors.route }}</small>
      </div>

      <div class="field">
        <label for="label">Ordre *</label>
        <InputNumber
          id="sort_order"
          v-model="formData.sort_order"
          :class="{ 'p-invalid': errors.sort_order }"
          placeholder="Ordre"
          required
        />
        <small v-if="errors.sort_order" class="p-error">{{
          errors.sort_order
        }}</small>
      </div>
      <div class="field">
        <label for="label">Es separador</label>
        <Checkbox id="is_separator" v-model="formData.is_separator" binary />
      </div>

      <div class="field">
        <label for="parent_id">Pare:</label>
        <Select
          :options="localMenus"
          optionLabel="label"
          optionValue="id"
          v-model="formData.parent_id"
          binary
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
        :label="isEdit ? 'Actualitzar' : 'Crear'"
        :icon="isEdit ? 'pi pi-check' : 'pi pi-plus'"
        :loading="loading"
        :disabled="!isFormValid"
      />
    </div>
  </form>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { Menu, MenuRequest } from "../types";

interface Props {
  menu: Menu | null;
  menus: Menu[];
  loading?: boolean;
  editMode: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  menu: null,
  menus: (): Menu[] => [],
  loading: false,
  editMode: false,
});

const emit = defineEmits<{
  save: [menu: Menu | MenuRequest];
  cancel: [];
}>();

const localMenus = ref<Menu[]>([]);

const formData = ref({
  id: "",
  label: "",
  icon: "",
  route: "",
  parent_id: "",
  sort_order: 0,
  is_separator: false,
});

const errors = ref<{
  label: string;
  icon: string;
  route: string;
  sort_order: string;
}>({
  label: "",
  icon: "",
  route: "",
  sort_order: "",
});

watch(
  () => props.menu,
  (newMenu) => {
    if (newMenu) {
      formData.value = {
        id: newMenu.id || "",
        label: newMenu.label || "",
        icon: newMenu.icon || "",
        route: newMenu.route || "",
        parent_id: newMenu.parent_id || "",
        sort_order: newMenu.sort_order || 0,
        is_separator: newMenu.is_separator || false,
      };
    }
  },
  { immediate: true }
);

onMounted(async () => {
  localMenus.value = [...props.menus];

  if (props.editMode && props.menu) {
    localMenus.value = localMenus.value.filter(
      (menu) => menu.id !== props.menu?.id
    );
  }
});
const isEdit = props.editMode;

const isFormValid = computed(() => {
  return (
    formData.value.label.trim() !== "" &&
    formData.value.icon.trim() !== "" &&
    formData.value.route.trim() !== "" &&
    formData.value.sort_order.toString().trim() !== "" &&
    !Object.values(errors.value).some((error) => error !== "")
  );
});

const validateForm = () => {
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = "";
  });
  let isValid = true;
  if (!formData.value.label.trim()) {
    errors.value.label = "L'etiqueta es obligatòria";
    isValid = false;
  }
  if (!formData.value.icon.trim()) {
    errors.value.icon = "L'icona es obligatòria";
    isValid = false;
  }
  if (!formData.value.route.trim()) {
    errors.value.route = "La ruta es obligatòria";
    isValid = false;
  }
  if (formData.value.sort_order === null || isNaN(formData.value.sort_order)) {
    errors.value.sort_order = "L'ordre és obligatori";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (!validateForm()) return;
  let menuData: Menu | MenuRequest;
  if (isEdit) {
    menuData = {
      id: props.menu?.id ?? "",
      label: formData.value.label,
      icon: formData.value.icon,
      route: formData.value.route,
      parent_id: formData.value.parent_id,
      sort_order: formData.value.sort_order,
      is_separator: formData.value.is_separator,
    };
  } else {
    menuData = {
      label: formData.value.label,
      icon: formData.value.icon,
      route: formData.value.route,
      parent_id: formData.value.parent_id,
      sort_order: formData.value.sort_order,
      is_separator: formData.value.is_separator,
    };
  }
  emit("save", menuData);
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
