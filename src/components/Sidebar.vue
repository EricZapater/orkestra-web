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
            <a v-ripple :href="href" v-bind="props.action" @click="navigate">
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
          <a
            v-else
            v-ripple
            :href="item.url"
            :target="item.target"
            v-bind="props.action"
          >
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
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
    separator: true,
  },
  {
    label: "Gestió de projectes",
    icon: "pi pi-cog",
    items: [
      {
        label: "Calendari",
        icon: "pi pi-calendar",
        route: "/projects/calendar",
      },
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
    label: "Gestió de Reunions",
    icon: "pi pi-cog",
    items: [
      {
        label: "Reunions",
        icon: "pi pi-calendar",
        route: "/meetings",
      },
      {
        label: "Cercador",
        icon: "pi pi-search",
        route: "/search",
      },
    ],
  },
  {
    separator: true,
  },
  {
    label: "Gestió d'usuaris",
    icon: "pi pi-cog",
    items: [
      {
        label: "Usuaris",
        icon: "pi pi-users",
        route: "/users",
      },
      {
        label: "Grups",
        icon: "pi pi-users",
        route: "/groups",
      },
    ],
  },
]);
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: var(--surface-card);
  border-right: 1px solid var(--surface-border);
  padding: 0rem;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin-bottom: 1rem;
}
</style>
