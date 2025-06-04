<template>
  <div class="register-container">
    <Card class="register-card">
      <template #title>Registra't</template>
      <template #content>
        <form @submit.prevent="handleCreate" class="p-fluid">
          <div class="p-field two-columns">
            <div><label for="name">Nom:</label></div>
            <div><InputText id="name" v-model="form.name" required /></div>
          </div>
          <div class="p-field two-columns">
            <div><label for="surname">Cognom:</label></div>
            <div>
              <InputText id="surname" v-model="form.surname" required />
            </div>
          </div>
          <div class="p-field two-columns">
            <div><label for="phone">Telèfon:</label></div>
            <div>
              <InputText id="phone" v-model="form.phone_number" required />
            </div>
          </div>
          <div class="p-field two-columns">
            <div><label for="email">Correu electrònic:</label></div>
            <div>
              <InputText
                id="email"
                v-model="form.email"
                required
                type="email"
              />
            </div>
          </div>
          <div class="p-field two-columns">
            <div><label for="username">Usuari:</label></div>
            <div>
              <InputText id="username" v-model="form.username" required />
            </div>
          </div>
          <div class="p-field four-columns">
            <div><label for="password">Contrassenya:</label></div>
            <div>
              <Password
                id="password"
                v-model="form.password"
                toggleMask
                :feedback="true"
                required
              />
            </div>
            <div><label for="password">Repeteix la contrassenya:</label></div>
            <div>
              <Password
                id="password2"
                v-model="password2"
                toggleMask
                :feedback="false"
                required
              />
            </div>
          </div>
          <Button label="Registra'm" type="submit" class="mt-3" />
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
import { type CreateUserRequest } from "../types";

const userStore = useUserStore();
const router = useRouter();
const toast = useToast();

const form = ref<CreateUserRequest>({
  name: "",
  surname: "",
  phone_number: "",
  email: "",
  username: "",
  password: "",
});
const password2 = ref("");

const validateForm = (): boolean => {
  if (
    !form.value.phone_number ||
    !form.value.email ||
    !form.value.username ||
    !form.value.password ||
    !password2.value
  ) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Falten camps obligatoris",
      life: 3000,
    });
    return false;
  }

  if (form.value.password !== password2.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Les contrasenyes no coincideixen",
      life: 3000,
    });
    return false;
  }
  return true;
};

const resetForm = () => {
  form.value = {
    name: "",
    surname: "",
    phone_number: "",
    email: "",
    username: "",
    password: "",
  };
  password2.value = "";
};

const handleCreate = async () => {
  if (!validateForm()) return;
  try {
    await userStore.createUser(form.value);
    toast.add({
      severity: "success",
      summary: "OK",
      detail: "Registre completat",
      life: 3000,
    });
    resetForm();
    router.push("/login");
  } catch (error) {
    console.error("Error during registration: ", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error durant el registre",
      life: 3000,
    });
  }

  // Reset del formulari
  form.value = {
    name: "",
    surname: "",
    phone_number: "",
    email: "",
    username: "",
    password: "",
  };
  password2.value = "";
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--surface-ground);
}

.register-card {
  width: 100%;
  max-width: 750px;
}
</style>
