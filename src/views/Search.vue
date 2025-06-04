<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" class="mb-3" />
  <div class="card">
    <h2>Cercador</h2>
    <div class="search">
      <InputGroup>
        <InputText v-model="text" placeholder="Search" />
        <InputGroupAddon>
          <Button
            icon="pi pi-search"
            severity="secondary"
            variant="text"
            @click="handleSearch"
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
    <div>
      <DataTable
        v-if="results"
        dataKey="id"
        :value="results"
        tableStyle="min-width: 50rem"
        :showGridlines="true"
        :paginator="true"
        :rows="10"
      >
        <Column field="id" header="id" />
        <Column field="tipus" header="Origen" />
        <Column field="text" header="Text" />
        <Column field="link" header="Link">
          <template #body="slotProps">
            <RouterLink :to="`/${slotProps.data.link}`">
              {{ "Enllaç" }}
            </RouterLink>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue";
import { useRouter } from "vue-router";
import { useGroupStore } from "../stores/groupStore";
import { useSearchStore } from "../stores/searchStore";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";
import Groups from "./Groups.vue";
import type { SearchResponse, SearchRequest } from "../types";

const toast = useToast();
const router = useRouter();
const groupStore = useGroupStore();
const searchStore = useSearchStore();

const text = ref("");

const results = ref<SearchResponse[]>([]);

const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});

const breadcrumbItems = ref([
  {
    label: "Cercador",
    icon: "pi pi-search",
  },
]);

const user = JSON.parse(localStorage.getItem("acorda.user")?.toString() || "");

const handleSearch = async () => {
  if (!text.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "El text de cerca no pot estar buit",
      life: 3000,
    });
    return false;
  }

  await groupStore.fetchGroupsByUserId(user.id);
  if (groupStore.groups.length === 0) {
    await groupStore.fetchGroups();
  }

  const request: SearchRequest = {
    group_ids: Array.from(groupStore.groups.values()).map((g) => g.id),
    text: text.value,
  };
  await searchStore.findByText(request);
  results.value = searchStore.results;
  if (searchStore.results.length === 0) {
    toast.add({
      severity: "warn",
      summary: "Alerta",
      detail: "No s'han trobat resultats",
      life: 3000,
    });
  }
};
</script>
