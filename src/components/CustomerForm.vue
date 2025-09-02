<template>
  <Dialog
    :visible="visible"
    modal
    :header="editMode ? 'Editar client' : 'Crear client'"
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

      <!-- Només mostrar la gestió d'usuaris en mode edició -->
      <div v-if="editMode" class="form-grid">
        <div class="field full-width">
          <label for="availableUsers">Afegir usuaris:</label>
          <MultiSelect
            id="availableUsers"
            v-model="selectedUsersToAdd"
            :options="availableUsers"
            optionValue="id"
            optionLabel="username"
            placeholder="Selecciona usuaris per afegir"
          />
        </div>

        <div class="field full-width">
          <label>Usuaris vinculats:</label>
          <div class="chips-container">
            <Chip
              v-for="user in customerUsers"
              :key="user.id"
              :label="user.username"
              class="user-chip"
              removable
              @remove="removeUser(user)"
            />
            <div v-if="customerUsers.length === 0" class="no-users-message">
              No hi ha usuaris vinculats
            </div>
          </div>
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
        <Button
          type="submit"
          :label="editMode ? 'Actualitza' : 'Crea'"
          icon="pi pi-check"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useCustomerStore } from "../stores/customerStore";
import type { Customer, CustomerRequest, UserResponse } from "../types";

const customerStore = useCustomerStore();
const toast = useToast();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "success"): void;
}>();

const props = defineProps<{
  visible: boolean;
  editMode: boolean;
  customer: Customer | null;
  users: UserResponse[];
}>();

const form = reactive<CustomerRequest>({
  comercial_name: "",
  vat_number: "",
  phone_number: "",
});

const errors = ref<Record<string, string>>({});
const selectedUsersToAdd = ref<string[]>([]);
const customerUsers = ref<UserResponse[]>([]);

// Usuaris disponibles per afegir (exclou els que ja estan vinculats)
const availableUsers = computed(() => {
  return props.users.filter(
    (user) => !customerUsers.value.some((cu) => cu.id === user.id)
  );
});

// Quan es canvia el customer, carregar les seves dades
watch(
  () => props.customer,
  async (newCustomer) => {
    if (newCustomer) {
      // Carregar dades del formulari
      form.comercial_name = newCustomer.comercial_name;
      form.vat_number = newCustomer.vat_number;
      form.phone_number = newCustomer.phone_number;

      // Carregar usuaris del client
      await loadCustomerUsers();
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// Quan es seleccionen usuaris per afegir, afegir-los
watch(selectedUsersToAdd, async (newSelection, oldSelection) => {
  if (!props.customer || !newSelection) return;

  const usersToAdd = newSelection.filter(
    (userId) => !oldSelection?.includes(userId)
  );

  for (const userId of usersToAdd) {
    try {
      await customerStore.addUserToCustomer({
        customer_id: props.customer.id,
        user_id: userId,
      });
      toast.add({
        severity: "success",
        summary: "Usuari afegit",
        detail: "Usuari afegit correctament",
        life: 2000,
      });
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "No s'ha pogut afegir l'usuari",
        life: 3000,
      });
    }
  }

  // Recarregar usuaris i resetar selecció
  await loadCustomerUsers();
  selectedUsersToAdd.value = [];
});

const loadCustomerUsers = async () => {
  if (!props.customer) return;

  try {
    await customerStore.GetUsersByCustomerID(props.customer.id);
    customerUsers.value = customerStore.customerUsers;
  } catch (error) {
    console.error("Error carregant usuaris del client:", error);
  }
};

const removeUser = async (user: UserResponse) => {
  if (!props.customer) return;

  try {
    await customerStore.RemoveUserFromCustomer({
      customer_id: props.customer.id,
      user_id: user.id,
    });

    toast.add({
      severity: "success",
      summary: "Usuari eliminat",
      detail: `${user.username} eliminat del client`,
      life: 2000,
    });

    await loadCustomerUsers();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut eliminar l'usuari",
      life: 3000,
    });
  }
};

const validate = () => {
  let valid = true;
  errors.value = {};

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
  errors.value = {};
  selectedUsersToAdd.value = [];
  customerUsers.value = [];
};

const handleSubmit = async () => {
  if (!validate()) return;

  try {
    if (props.editMode && props.customer) {
      await customerStore.updateCustomer(props.customer.id, { ...form });
      toast.add({
        severity: "success",
        summary: "Client actualitzat",
        detail: `Client "${form.comercial_name}" actualitzat correctament`,
        life: 3000,
      });
    } else {
      await customerStore.createCustomer({ ...form });
      toast.add({
        severity: "success",
        summary: "Client creat",
        detail: `Client "${form.comercial_name}" creat correctament`,
        life: 3000,
      });
    }

    emit("success");
    emit("update:visible", false);
    resetForm();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: props.editMode
        ? "No s'ha pogut actualitzar el client"
        : "No s'ha pogut crear el client",
      life: 3000,
    });
  }
};

const handleCancel = () => {
  resetForm();
  emit("update:visible", false);
};
</script>

<style scoped>
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

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  min-height: 2rem;
  align-items: flex-start;
}
/*
.user-chip {
  background-color: #3b82f6;
  color: white;
}

.user-chip:hover {
  background-color: #2563eb;
}*/

.no-users-message {
  color: #6b7280;
  font-style: italic;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  height: 2rem;
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
