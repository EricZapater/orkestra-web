<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" />
  <div class="card">
    <h2>Editar Grup</h2>
    <div class="header flex justify-between items-center">
      <div class="flex items-center gap-2"></div>
      <div>
        <form @submit.prevent="handleSubmit">
          <div class="p-field">
            <div></div>
            <div class="two-columns">
              <label for="name">Nom:</label>
              <InputText
                v-model="newGroupName"
                id="name"
                type="text"
                class="input"
                required
              />
            </div>
          </div>
          <div class="mt-3 p-field three-columns">
            <div></div>
            <div></div>
            <div class="two-columns">
              <Button
                type="button"
                severity="danger"
                @click="router.push('/groups')"
              >
                Cancel·la
              </Button>
              <Button type="submit" class="btn-primary" label="Actualitza">
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div>
      <Button
        icon="pi pi-plus"
        label="Afegir usuaris"
        class="p-button"
        @click="loadModal = true"
      />
    </div>
    <div>
      <DataTable
        v-if="groupUsers"
        :value="groupUsers"
        :paginator="true"
        :rows="10"
        :showGridlines="true"
        dataKey="id"
      >
        <Column field="name" header="Nom" />
        <Column field="surname" header="Cognom" />
        <Column header="Accions" style="width: 10rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm"
              severity="danger"
              @click="handleDeleteUser(slotProps.data.id)"
              title="Eliminar"
            />
          </template>
        </Column>
      </DataTable>
      <Dialog
        v-model:visible="loadModal"
        modal
        header="Afegir usuaris al grup"
        :style="{ width: '30rem' }"
      >
        <div class="field">
          <Listbox
            v-model="selectedUsers"
            :options="users"
            optionLabel="name"
            optionValue="id"
            multiple
            filter
          />
        </div>
        <div class="mt-3 p-field">
          <div class="flex justify-end">
            <Button type="button" severity="danger" @click="closeModal">
              Cancel·la
            </Button>
            <Button
              type="submit"
              class="btn-primary"
              @click="handleAddUsersToGroup"
            >
              Afegir
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGroupStore } from "../stores/groupStore";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { type GroupResponse, type UserResponse } from "../types";
import { useRoute } from "vue-router";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";

const groupStore = useGroupStore();
const userStore = useUserStore();
const router = useRouter();
const toast = useToast();
const route = useRoute();
const group = ref<GroupResponse | void>();
const loadModal = ref(false);
const groupId = route.params.id as string;
const newGroupName = ref("");
const groupUsers = ref<UserResponse[] | void>([]);
const users = ref<UserResponse[]>([]);
const selectedUsers = ref([]);

const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});

const breadcrumbItems = ref([
  {
    label: "Grups",
    icon: "pi pi-users",
    route: "/groups",
  },
  {
    label: "Editar grup",
    icon: "pi pi-pencil",
  },
]);

onMounted(async () => {
  await loadGroup();
  await loadGroupUsers();
  await loadUsers();
});
async function loadGroup() {
  try {
    await groupStore.fetchGroupById(groupId);
    const fetchedGroup = groupStore.selectedGroup;
    if (fetchedGroup) {
      group.value = fetchedGroup;
      newGroupName.value = fetchedGroup.name;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "No s'ha pogut carregar el grup",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Error loading group:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut carregar el grup",
      life: 3000,
    });
  }
}
async function loadGroupUsers() {
  try {
    await userStore.fetchUsersByGroupId(groupId);
    groupUsers.value = userStore.groupUsers;
  } catch (error) {
    console.error("Error loading group users:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut carregar els usuaris del grup",
      life: 3000,
    });
  }
}
async function loadUsers() {
  try {
    await userStore.fetchUsers();
    const fetchedUsers = userStore.users;
    if (fetchedUsers) {
      users.value = fetchedUsers;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "No s'ha pogut carregar els usuaris",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Error loading users:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut carregar els usuaris",
      life: 3000,
    });
  }
}
const handleAddUsersToGroup = async () => {
  if (selectedUsers.value.length === 0) {
    toast.add({
      severity: "warn",
      summary: "Error",
      detail: "No s'han seleccionat usuaris",
      life: 3000,
    });
    return;
  }
  try {
    await groupStore.addUsersToGroup(groupId, selectedUsers.value);
    toast.add({
      severity: "success",
      summary: "Usuaris afegits",
      detail: `Usuaris afegits al grup ${newGroupName.value}`,
      life: 3000,
    });
    loadModal.value = false;
    await loadGroupUsers();
  } catch (error) {
    console.error("Error adding users to group:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'han pogut afegir els usuaris al grup",
      life: 3000,
    });
  }
};

const handleDeleteUser = async (userId: string) => {
  const confirm = window.confirm("Segur que vols eliminar aquest usuari?");
  if (!confirm) return;
  try {
    await groupStore.removeUserFromGroup(groupId, userId);
    toast.add({
      severity: "success",
      summary: "Usuari eliminat",
      detail: `Usuari eliminat del grup ${newGroupName.value}`,
      life: 3000,
    });
    await loadGroupUsers();
  } catch (error) {
    console.error("Error removing user from group:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut eliminar l'usuari del grup",
      life: 3000,
    });
  }
};

const handleSubmit = async () => {
  if (newGroupName.value.trim() === "") {
    toast.add({
      severity: "warn",
      summary: "Error",
      detail: "El nom del grup no pot estar buit",
      life: 3000,
    });
    return;
  }
  try {
    await groupStore.updateGroup(groupId, { name: newGroupName.value });
    toast.add({
      severity: "success",
      summary: "Grup actualitzat",
      detail: `Grup ${newGroupName.value} actualitzat correctament`,
      life: 3000,
    });
    router.push("/groups");
  } catch (error) {
    console.error("Error updating group:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut actualitzar el grup",
      life: 3000,
    });
  }
};

const closeModal = () => {
  loadModal.value = false;
  selectedUsers.value = [];
};
</script>
