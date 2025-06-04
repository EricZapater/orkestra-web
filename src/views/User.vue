<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" class="mb-3" />
  <div class="card">
    <h2>{{ title }}</h2>
    <div class="header flex justify-between items-center">
      <div class="flex items-center gap-2"></div>
      <div>
        <form @submit.prevent="handleSubmit">
          <div class="p-field four-columns">
            <label for="name">Nom:</label>
            <InputText
              v-model="newUser.name"
              id="name"
              type="text"
              class="input"
              required
            />

            <label for="surname">Cognoms:</label>
            <InputText
              v-model="newUser.surname"
              id="surname"
              type="text"
              class="input"
              required
            />
          </div>

          <div class="p-field four-columns">
            <label for="email">Correu electrònic:</label>
            <InputText
              v-model="newUser.email"
              id="email"
              type="email"
              class="input"
              required
            />
            <label for="phone">Telèfon:</label>
            <InputText
              v-model="newUser.phone_number"
              id="phone"
              type="tel"
              class="input"
            />
          </div>
          <div class="p-field six-columns">
            <label for="username">Nom d'usuari:</label>
            <InputText
              v-model="newUser.username"
              id="username"
              type="username"
              class="input"
              required
            />
            <label for="password">Contrassenya:</label>
            <Password
              v-model="newUser.password"
              id="password"
              toggleMask
              :feedback="false"
              required
            />
            <label for="password">Repeteix la contrasenya:</label>
            <Password
              id="password2"
              v-model="password2"
              toggleMask
              :feedback="false"
              required
            />
          </div>

          <div class="mt-3 p-field three-columns">
            <div></div>
            <div></div>
            <div class="two-columns">
              <Button
                type="button"
                severity="danger"
                @click="router.push('/users')"
              >
                Cancel·la
              </Button>
              <Button type="submit" class="btn-primary">
                {{ editMode ? "Actualitza" : "Crea" }}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "../stores/userStore";

import { useRouter, useRoute } from "vue-router";
import { type UserResponse } from "../types";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";

const userStore = useUserStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const user = ref<UserResponse | void>();
const newUser = ref<UserResponse>({
  id: "",
  name: "",
  surname: "",
  phone_number: "",
  email: "",
  username: "",
  password: "",
  is_active: true,
  is_verified: false,
  created_at: "",
  password_changed_at: "",
});
const password2 = ref("");
const title = ref("");
const editMode = ref(false);

const userId = route.params.id as string;

const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});

const breadcrumbItems = ref([
  {
    label: "Usuaris",
    icon: "pi pi-users",
    route: "/users",
  },
  {
    label: "Editar usuari",
    icon: "pi pi-pencil",
  },
]);

onMounted(async () => {
  if (userId !== undefined) {
    editMode.value = true;
    try {
      await userStore.fetchUserById(userId);
      const fetchedUser = userStore.user;
      if (fetchedUser) {
        user.value = fetchedUser;
        newUser.value = { ...fetchedUser };
        title.value = `Editar Usuari: ${fetchedUser.name} ${fetchedUser.surname}`;
      }
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Error al carregar l'usuari",
        life: 3000,
      });
      router.push("/users");
    }
  } else {
    editMode.value = false;
    title.value = "Nou Usuari";
  }
});

const handleSubmit = async () => {
  if (newUser.value.password !== password2.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Les contrasenyes no coincideixen",
      life: 3000,
    });
    return false;
  }
  try {
    if (editMode.value) {
      await userStore.updateUser(userId, newUser.value);
      toast.add({
        severity: "success",
        summary: "Usuari actualitzat",
        detail: `${newUser.value.name} ${newUser.value.surname}`,
        life: 3000,
      });
    } else {
      await userStore.createUser(newUser.value);
      toast.add({
        severity: "success",
        summary: "Usuari creat",
        detail: `${newUser.value.name} ${newUser.value.surname}`,
        life: 3000,
      });
    }
    router.push("/users");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut desar l'usuari",
      life: 3000,
    });
  }
};
</script>
