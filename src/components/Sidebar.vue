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
        </template>
      </Menu>
    </div>
  </aside>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

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
]);
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
</style>
