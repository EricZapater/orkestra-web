<template>
  <Dialog
    :visible="visible"
    modal
    header="Crear client"
    :style="{ width: '40rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <form @submit.prevent="handleSubmit" class="customer-form">
      <div class="field full-width">
        <label for="comercial_name">Nom comercial *</label>
        <InputText
          id="comercial_name"
          v-model="form.comercial_name"
          :class="{ 'p-invalid': errors.comercial_name }"
          placeholder="Nom comercial del client"
        />
        <small v-if="errors.comercial_name" class="p-error">{{
          errors.comercial_name
        }}</small>
      </div>

      <div class="form-grid">
        <div class="field">
          <label for="vat_number">CIF *</label>
          <InputText
            id="vat_number"
            v-model="form.vat_number"
            :class="{ 'p-invalid': errors.vat_number }"
            placeholder="CIF del client"
          />
          <small v-if="errors.vat_number" class="p-error">{{
            errors.vat_number
          }}</small>
        </div>

        <div class="field">
          <label for="phone_number">Telèfon *</label>
          <InputText
            id="phone_number"
            v-model="form.phone_number"
            :class="{ 'p-invalid': errors.phone_number }"
            placeholder="Telèfon de contacte"
          />
          <small v-if="errors.phone_number" class="p-error">{{
            errors.phone_number
          }}</small>
        </div>
      </div>

      <div class="form-actions">
        <Button
          type="button"
          label="Cancel·la"
          icon="pi pi-times"
          class="p-button-text"
          @click="handleCancel"
        />
        <Button type="submit" label="Crea" icon="pi pi-check" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"; // Removed toRefs
import type { CustomerRequest } from "../types";

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "submit", data: CustomerRequest): void;
}>();

const props = defineProps<{
  visible: boolean;
}>();

// Removed: const { visible } = toRefs(props);

const form = reactive<CustomerRequest>({
  comercial_name: "",
  vat_number: "",
  phone_number: "",
});

const errors = ref<Record<string, string>>({
  comercial_name: "",
  vat_number: "",
  phone_number: "",
});

const validate = () => {
  let valid = true;
  errors.value = {
    comercial_name: "",
    vat_number: "",
    phone_number: "",
  };

  if (!form.comercial_name.trim()) {
    errors.value.comercial_name = "El nom comercial és obligatori";
    valid = false;
  }

  if (!form.vat_number.trim()) {
    errors.value.vat_number = "El CIF és obligatori";
    valid = false;
  }

  if (!form.phone_number.trim()) {
    errors.value.phone_number = "El telèfon és obligatori";
    valid = false;
  }

  return valid;
};
const resetForm = () => {
  form.comercial_name = "";
  form.vat_number = "";
  form.phone_number = "";
  errors.value = {
    comercial_name: "",
    vat_number: "",
    phone_number: "",
  };
};

const handleSubmit = () => {
  if (!validate()) return;
  emit("submit", { ...form });
  resetForm();
};
const handleCancel = () => {
  resetForm();
  emit("update:visible", false);
};
</script>

<style scoped>
/* Your styles remain the same */
.customer-form {
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

:deep(.p-invalid) {
  border-color: #ef4444;
}

.p-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

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
