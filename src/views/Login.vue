<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Inicia sessió</h2>

      <div class="p-fluid">
        <div class="field two-columns">
          <div><label for="username">Usuari</label></div>
          <div><InputText id="username" v-model="username" /></div>
        </div>

        <div class="field two-columns">
          <div>
            <label for="password">{{ $t("login.password") }}</label>
          </div>
          <div>
            <Password
              id="password"
              v-model="password"
              toggleMask
              :feedback="false"
            />
          </div>
        </div>
        <div class="field two-columns">
          <div>
            <Button label="Entrar" @click="handleLogin" />
          </div>
          <div>
            <Button
              label="Registra't"
              class="p-button-secondary"
              @click="$router.push('/register')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const username = ref("");
const password = ref("");
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value);
    router.push("/home");
  } catch (error) {
    console.error("Error during login: ", error);
    username.value = "";
    password.value = "";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Usuari o contrasenya incorrectes",
      life: 3000,
    });
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--surface-ground);
}

.login-card {
  background-color: var(--surface-card);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
}

h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--text-color);
}

.field {
  margin-bottom: 1.5rem;
}
</style>
