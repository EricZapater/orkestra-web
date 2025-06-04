<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" />
  <div class="card">
    <h2>Reunions</h2>
    <div class="three-columns">
      <div>
        <Button
          label="Crear reunió"
          class="p-button"
          icon="pi pi-plus"
          @click="handleCreate"
        />
      </div>
      <div></div>
      <div class="card flex justify-center">
        <DatePicker
          v-model="dates"
          selectionMode="range"
          :manualInput="false"
        />
        <Button
          icon="pi pi-filter"
          aria-label="Filter"
          @click="fetchFiltered"
        />
      </div>
    </div>
    <DataTable
      dataKey="id"
      :value="meetings"
      tableStyle="min-width: 50rem"
      :showGridlines="true"
      :paginator="true"
      :rows="10"
    >
      <Column field="title" header="Titol" />
      <Column field="start_time" header="Data">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.start_time) }}
        </template>
      </Column>
      <Column field="num_topics" header="Num. temes" />
      <Column field="num_participants" header="Participants" />
      <Column field="has_agreements" header="Te acords?" />
      <Column header="Accions" style="width: 10rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-eye"
            class="p-button-text p-button-sm"
            @click="handleEdit(slotProps.data)"
            title="Veure"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-text p-button-sm"
            severity="danger"
            @click="handleDelete(slotProps.data)"
            title="Eliminar"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { formatURLDate, formatDate } from "../utils/date";
import { FilterMatchMode } from "@primevue/core/api";
import { useRouter } from "vue-router";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";
import type { MeetingSummaryResponse } from "../types";
import { useMeetingStore } from "../stores/meetingStore";

const toast = useToast();
const router = useRouter();
const meetingStore = useMeetingStore();

const dates = ref();
const meetings = ref<MeetingSummaryResponse[]>([]);

const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});

const breadcrumbItems = ref([
  {
    label: "Reunions",
    icon: "pi pi-calendar",
  },
]);
const groupId = ref();

onMounted(async () => {});

async function handleCreate() {
  router.push("/meeting");
}

const fetchFiltered = async () => {
  if (!dates.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "L'interval de dates no pot estar buit",
      life: 3000,
    });
    return false;
  }
  await meetingStore.fetchMeetingsBetweenDates(
    "",
    formatURLDate(dates.value[0]),
    formatURLDate(dates.value[1])
  );
  meetings.value = meetingStore.meetings;
};
const handleEdit = (data: MeetingSummaryResponse) => {
  router.push(`/meeting/${data.id}`);
};

async function handleDelete(data: MeetingSummaryResponse) {
  const confirm = window.confirm(
    `Segur que vols eliminar la reunió "${data.title}"?`
  );
  if (!confirm) return;

  try {
    await meetingStore.deleteMeeting(data.id);
    toast.add({
      severity: "success",
      summary: "Reunió eliminada",
      detail: `Reunió "${
        (data.title, data.start_time)
      }" eliminada correctament`,
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `No s'ha pogut eliminar la reunio`,
      life: 3000,
    });
    console.error("Error eliminant la reunió", error);
  }
}
</script>
