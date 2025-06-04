<template>
  <header
    class="topbar flex align-items-center justify-content-between px-4 py-2"
  >
    <!-- Esquerra: Logo -->
    <div class="flex align-items-center gap-2">
      <img src="/logo.svg" alt="Logo" class="logo" />
    </div>

    <!-- Centre: Títol -->
    <div class="flex-1 text-center hidden sm:block">
      <span class="app-title">Acorda APP</span>
    </div>

    <!-- Dreta: Info d'usuari -->
    <div class="flex align-items-center gap-2">
      <span>{{ " " + surname + ", " + name + " " }}</span>
      <Button
        icon="pi pi-sign-out"
        @click="handleLogout"
        rounded
        text
        severity="secondary"
        aria-label="Logout"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";

const name = ref("");
const surname = ref("");
const username = ref("");
const authStore = useAuthStore();
const router = useRouter();
const user = JSON.parse(localStorage.getItem("acorda.user")?.toString() || "");
onMounted(() => {
  if (user) {
    name.value = user.name;
    surname.value = user.surname;
    username.value = user.username;
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<style scoped>
.topbar {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
  font-family: var(--font-family);
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

.logo {
  height: 32px;
}

.app-title {
  font-size: 1.25rem;
  font-weight: 600;
  white-space: nowrap;
}
</style>
