<template>
  <aside class="sidebar">
    <div class="card flex justify-center">
      <Menu :model="items">
        <template #item="{ item, props }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a
              v-ripple
              :href="href"
              v-bind="props.action"
              @click="navigate"
              class="flex items-center py-2 px-3 rounded-md hover:bg-surface-200"
            >
              <span :class="item.icon" style="gap: 0.5em" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
          <a
            v-else-if="item.llm"
            v-ripple
            class="flex items-center py-2 px-3 rounded-md hover:bg-surface-200 cursor-pointer"
            @click="openLLMModal"
          >
            <span :class="item.icon" style="gap: 0.5em" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </template>
      </Menu>
    </div>
    <!-- Modal LLM -->
    <Dialog
      v-model:visible="showLLMModal"
      header="Consulta LLM"
      modal
      class="llm-dialog"
    >
      <div class="task-form">
        <div class="field full-width">
          <label for="llm_query">Consulta *</label>
          <Textarea
            id="llm_query"
            v-model="queryText"
            rows="4"
            placeholder="Escriu la teva consulta"
            :autoResize="true"
          />
        </div>
        <div class="form-actions">
          <Button
            label="Enviar"
            class="p-button-primary"
            @click="sendQuery"
            :loading="loading"
            :disabled="!queryText.trim()"
          />
          <Button
            label="Tancar"
            class="p-button-text"
            @click="showLLMModal = false"
          />
        </div>
        <div v-if="responseText" class="field full-width">
          <label>Resposta</label>
          <div class="p-2 border rounded bg-surface-100">
            <p>{{ responseText }}</p>
          </div>
        </div>
      </div>
    </Dialog>
  </aside>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { llmService } from "../services/llmService";
import type { LLMRequest } from "../types";
import { Textarea } from "primevue";

const router = useRouter();

const items = ref([
  {
    label: "Inici",
    icon: "pi pi-home",
    route: "/home",
  },
  {
    label: "Projectes",
    icon: "pi pi-briefcase",
    items: [
      {
        label: "Llistat Projectes",
        icon: "pi pi-briefcase",
        route: "/projects",
      },
      {
        label: "Calendari",
        icon: "pi pi-calendar",
        route: "/projects/calendar",
      },
      {
        label: "Kanban Projectes",
        icon: "pi pi-calendar",
        route: "/projects/kanban",
      },
      {
        label: "Llistat Tasques",
        icon: "pi pi-list",
        route: "/projects/tasks",
      },
      {
        label: "Kanban Tasques",
        icon: "pi pi-table",
        route: "/kanban",
      },
      {
        label: "Operaris",
        icon: "pi pi-user",
        route: "/operators",
      },
      {
        label: "Calendari Operaris",
        icon: "pi pi-calendar",
        route: "/operators/calendar",
      },
    ],
  },
  {
    separator: true,
  },
  {
    label: "Clients",
    icon: "pi pi-calendar",
    items: [
      {
        label: "Clients",
        icon: "pi pi-money-bill",
        route: "/customers",
      },
    ],
  },
  {
    separator: true,
  },
  {
    label: "Gestió",
    icon: "pi pi-users",
    items: [
      {
        label: "Usuaris",
        icon: "pi pi-users",
        route: "/users",
      },
      {
        label: "Perfils",
        icon: "pi pi-users",
        route: "/profiles",
      },
      {
        label: "Menus",
        icon: "pi pi-align-justify",
        route: "/menus",
      },
    ],
  },
  { separator: true },
  {
    label: "Botie IA",
    icon: "pi pi-android",
    llm: true,
  },
]);

const showLLMModal = ref(false);
const queryText = ref("");
const responseText = ref("");
const loading = ref(false);

const openLLMModal = () => {
  showLLMModal.value = true;
  queryText.value = "";
  responseText.value = "";
};

const sendQuery = async () => {
  if (!queryText.value.trim()) return;

  const userStr = localStorage.getItem("orkestra.user");
  let userId = "";

  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      userId = userObj.id;
    } catch (e) {
      console.error("Error parsejant l'usuari del localStorage", e);
    }
  }

  loading.value = true;
  const llmRequest: LLMRequest = {
    question: queryText.value,
    user_id: userId,
  };
  try {
    const res = await llmService.query(llmRequest);
    responseText.value = res.data.answer || "Sense resposta";
  } catch (err: any) {
    responseText.value = "Error: " + (err.message || "Problema desconegut");
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.sidebar {
  width: 250px;
  background-color: var(--surface-card);
  border-right: 1px solid var(--surface-border);
  padding: 1rem;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin-bottom: 0.5rem;
}
/* Estils globals: no cal :deep */
.p-menuitem {
  margin-bottom: 0rem !important;
}

.p-menu .p-menuitem-link {
  padding-top: 0.25rem !important;
  padding-bottom: 0.25rem !important;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s;
}

.p-menu .p-menuitem-link:hover {
  background-color: var(--surface-hover);
}

.llm-dialog {
  width: 70%;
}
.task-form .field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.task-form .form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
