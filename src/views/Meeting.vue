<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" class="mb-3" />
  <div class="card">
    <h2>{{ title }}</h2>
    <div class="header flex justify-between items-center">
      <div class="flex items-center gap-2"></div>
      <div>
        <form @submit.prevent="handleSubmit">
          <div class="p-field six-columns">
            <label for="group_id">Grup:</label>
            <Select
              v-model="newMeeting.group_id"
              :options="groups"
              optionLabel="name"
              optionValue="id"
              placeholder="Escull un grup"
              class="w-full md:w-56"
            />
            <label for="title">Titol:</label>
            <InputText
              v-model="newMeeting.title"
              id="title"
              type="text"
              class="input"
              required
              style="width: 30rem"
            />
            <label for="start_time">Data sessió:</label>
            <DatePicker v-model="date" required />
          </div>
          <div class="p-field three-columns">
            <div><label for="description">Descripció:</label></div>
            <div>
              <Textarea
                v-model="newMeeting.description"
                rows="5"
                style="width: 75rem"
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
                @click="router.push('/users')"
              >
                Cancel·la
              </Button>
              <Button type="submit" class="btn-primary">
                {{ editMode ? "Actualitza" : "Crea" }}
              </Button>
            </div>
          </div>
          <div></div>

          <div v-if="editMode">
            <Tabs value="0">
              <TabList>
                <Tab value="0">Participants</Tab>
                <Tab value="1">Temes</Tab>
              </TabList>
              <TabPanels>
                <TabPanel value="0">
                  <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                </TabPanel>
                <TabPanel value="1">
                  <div>
                    <Button
                      icon="pi pi-plus"
                      label="Afegir temes"
                      class="p-button"
                      @click="
                        () => {
                          console.log('obrir dialog');
                          loadTopicsModal = true;
                        }
                      "
                    />
                  </div>
                  <!--:value="meetingStore.selectedMeeting.topics"-->
                  <DataTable
                    v-if="meetingStore.selectedMeeting?.topics"
                    v-model:expandedRows="expandedRows"
                    :value="meetingStore.selectedMeeting.topics"
                    dataKey="id"
                    tableStyle="min-width: 50rem"
                    :showGridlines="true"
                    :paginator="true"
                    :rows="10"
                  >
                    <Column expander style="width: 5rem" />
                    <Column field="title" header="Títol" sortable />
                    <Column field="topic_agreements.length" header="Acords" />
                    <Column header="Accions" style="width: 10rem">
                      <template #body="slotProps">
                        <Button
                          icon="pi pi-pencil"
                          class="p-button-text p-button-sm"
                          severity="success"
                          @click="loadTopicAgreementModal(slotProps.data.id)"
                          title="Eliminar"
                        />
                        <Button
                          icon="pi pi-trash"
                          class="p-button-text p-button-sm"
                          severity="danger"
                          @click="handleDeleteTopic(slotProps.data.id)"
                          title="Eliminar"
                        />
                      </template>
                    </Column>
                    <template #expansion="slotProps">
                      <div class="p-4">
                        <h5 class="mb-2">
                          Acords del tema: {{ slotProps.data.title }}
                        </h5>
                        <DataTable :value="slotProps.data.topic_agreements">
                          <Column field="title" header="Acord" />
                        </DataTable>
                      </div>
                    </template>
                  </DataTable>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </form>
      </div>
      <Dialog
        v-model:visible="loadTopicsModal"
        modal
        header="Afegir temes"
        :style="{ width: '30rem' }"
      >
        <div class="field two-columns" style="margin-bottom: 0.5em">
          <label for="title">Titol:</label>
          <InputText
            v-model="newMeetingTopic.title"
            id="title"
            type="text"
            class="input"
            style="width: 20rem"
          />
        </div>

        <div class="mt-3 p-field">
          <div class="flex justify-end gap-2">
            <Button type="button" severity="danger" @click="closeTopicModal">
              Cancel·la
            </Button>
            <Button type="submit" class="btn-primary" @click="handleAddTopic">
              Afegir
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog
        v-model:visible="loadTopicAgreementsModal"
        modal
        header="Afegir acords"
        :style="{ width: '50rem' }"
      >
        <div class="field two-columns" style="margin-bottom: 0.5em">
          <label for="agreement">Acord:</label>
          <Textarea
            id="agreement"
            v-model="newMeetingTopicAgreement.title"
            rows="5"
            style="width: 40rem"
            maxlength="250"
          />
        </div>

        <div class="mt-3 p-field">
          <div class="flex justify-end gap-2">
            <Button
              type="button"
              severity="danger"
              @click="closeTopicAgreementModal"
            >
              Cancel·la
            </Button>
            <Button
              type="submit"
              class="btn-primary"
              @click="handleAddTopicAgreement"
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
import { ref, onMounted, computed, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useMeetingStore } from "../stores/meetingStore";

import { useRouter, useRoute } from "vue-router";
import type {
  MeetingRequest,
  GroupResponse,
  MeetingTopicsRequest,
  MeetingTopicAgreementRequest,
} from "../types";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";
import { useGroupStore } from "../stores/groupStore";
import { Select } from "primevue";
import { formatDate } from "../utils/date";
import { extractErrorMessage } from "../utils/errormessage";

const meetingStore = useMeetingStore();
const groupStore = useGroupStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const expandedRows = ref({});
const newMeeting = ref<MeetingRequest>({
  group_id: "",
  title: "",
  description: "",
  start_time: "",
  created_by: "",
});

const newMeetingTopic = ref<MeetingTopicsRequest>({
  meeting_id: "",
  title: "",
});

const newMeetingTopicAgreement = ref<MeetingTopicAgreementRequest>({
  meeting_topic_id: "",
  created_by: "",
  title: "",
});

const editMode = ref(false);
const loadTopicsModal = ref(false);
const loadTopicAgreementsModal = ref(false);
const selectedTopicId = ref("");
const groups = ref<GroupResponse[]>([]);
const date = ref();
const title = ref("");

const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});

const breadcrumbItems = computed(() => [
  {
    label: "Reunions",
    icon: "pi pi-calendar",
    route: "/meetings",
  },
  {
    label: editMode.value ? "Editar reunió" : "Crear reunió",
    icon: editMode.value ? "pi pi-pencil" : "pi pi-plus",
  },
]);

const meetingId = ref("");
meetingId.value = route.params.id as string;
const user = JSON.parse(localStorage.getItem("acorda.user")?.toString() || "");

onMounted(async () => {
  await groupStore.fetchGroups();
  groups.value = groupStore.groups ?? [];
  if (meetingId.value !== undefined) {
    editMode.value = true;
    title.value = "Editar reunió";
    try {
      await loadData();
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: extractErrorMessage(error),
        life: 3000,
      });
      return false;
    }
  } else {
    editMode.value = false;
    title.value = "Crear reunió";
  }
});

const handleSubmit = async () => {
  newMeeting.value.start_time = date.value;
  newMeeting.value.created_by = user.id;
  try {
    const res = await meetingStore.createMeeting(newMeeting.value);
    meetingId.value = res.data.id;
    toast.add({
      severity: "success",
      summary: "Reunió creada",
      detail: `${newMeeting.value.title} ${newMeeting.value.start_time}`,
      life: 3000,
    });
    clearData();
    setTimeout(() => {
      router.push(`/meeting/${res.data.id}`);
    }, 500);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: extractErrorMessage(error),
      life: 3000,
    });
    return false;
  }
};

const handleAddTopic = async () => {
  try {
    newMeetingTopic.value.meeting_id = meetingId.value;
    await meetingStore.addTopicToMeeting(newMeetingTopic.value);

    toast.add({
      severity: "success",
      summary: "Tema afegit",
      detail: `Tema ${newMeetingTopic.value.title} afegit`,
      life: 3000,
    });
    closeTopicModal();
    clearData();
    await loadData();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: extractErrorMessage(error),
      life: 3000,
    });
    return false;
  }
};

const handleDeleteTopic = async (id: string) => {
  const confirm = window.confirm("Segur que vols eliminar aquest tema?");
  if (!confirm) return;
  try {
    await meetingStore.removeTopicFromMeeting(id);
    toast.add({
      severity: "success",
      summary: "Tema eliminat",
      detail: `Tema eliminat `,
      life: 3000,
    });
    await loadData();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No s'ha pogut eliminar el tema",
      life: 3000,
    });
  }
};

const loadTopicAgreementModal = async (id: string) => {
  selectedTopicId.value = id;
  loadTopicAgreementsModal.value = true;
};

const handleAddTopicAgreement = async () => {
  try {
    newMeetingTopicAgreement.value.meeting_topic_id = selectedTopicId.value;
    newMeetingTopicAgreement.value.created_by = user.id;
    await meetingStore.addTopicAgreementToMeeting(
      newMeetingTopicAgreement.value
    );
    toast.add({
      severity: "success",
      summary: "Acord afegit",
      detail: "Acord afegit correctament",
      life: 3000,
    });
    await loadData();
    closeTopicAgreementModal();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: extractErrorMessage(error),
      life: 3000,
    });
    return false;
  }
};

async function loadData() {
  await meetingStore.fectchMeetingById(meetingId.value);
  if (meetingStore.selectedMeeting) {
    newMeeting.value.group_id = meetingStore.selectedMeeting.group_id;
    newMeeting.value.title = meetingStore.selectedMeeting.title;
    newMeeting.value.description = meetingStore.selectedMeeting.description;
    newMeeting.value.start_time = meetingStore.selectedMeeting.start_time;
    date.value = meetingStore.selectedMeeting.start_time;
    console.log("meetingStore.selectedMeeting", meetingStore.selectedMeeting);
  }
}

function closeTopicModal() {
  loadTopicsModal.value = false;
  clearTopicModalData();
}

function closeTopicAgreementModal() {
  loadTopicAgreementsModal.value = false;
  selectedTopicId.value = "";
  newMeetingTopicAgreement.value.created_by = "";
  newMeetingTopicAgreement.value.meeting_topic_id = "";
  newMeetingTopicAgreement.value.title = "";
}

function clearData() {
  newMeeting.value.group_id = "";
  newMeeting.value.title = "";
  newMeeting.value.description = "";
  newMeeting.value.start_time = "";
  newMeeting.value.created_by = "";
}

function clearTopicModalData() {
  newMeetingTopic.value.meeting_id = "";
  newMeetingTopic.value.title = "";
}
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      // S'ha navegat a una nova reunió
      await groupStore.fetchGroups();
      groups.value = groupStore.groups ?? [];
      editMode.value = true;
      title.value = "Editar reunió";
      meetingId.value = route.params.id as string;
      try {
        await loadData();
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: extractErrorMessage(error),
          life: 3000,
        });
      }
    }
  },
  { immediate: false }
);
</script>
