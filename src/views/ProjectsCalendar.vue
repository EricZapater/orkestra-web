<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" class="mb-3" />
  <div class="card">
    <h2>Projectes</h2>
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
    <Dialog
      v-model:visible="createProjectModal"
      modal
      header="Afegir projectes"
      :style="{ width: '60rem' }"
    >
      <div class="field" style="margin-bottom: 0.5em">
        <label for="description">Descripció:</label>
        <Textarea
          id="description"
          v-model="newProject.description"
          rows="5"
          style="width: 40rem"
          maxlength="250"
        />
      </div>
      <div class="field three-columns" style="margin-bottom: 0.5em">
        <div>
          <label for="start_date">Inici:</label>
          <DatePicker v-model="newProject.start_date" dateFormat="dd/mm/yy" />
        </div>
        <div>
          <label for="end_date">Final:</label>
          <DatePicker v-model="newProject.end_date" dateFormat="dd/mm/yy" />
        </div>
        <div>
          <label for="color">Color:</label>
          <ColorPicker v-model="newProject.color" />
        </div>
      </div>
      <div class="field gap-2 four-columns" style="margin-bottom: 0.5em">
        <div><label for="customer_id">Client</label></div>
        <div>
          <Select
            v-model="newProject.customer_id"
            :options="customerStore.customers"
            optionLabel="comercial_name"
            optionValue="id"
            placeholder="Escull un client"
            class="w-full md:w-56"
          />
        </div>
      </div>
      <div class="mt-3 p-field">
        <div class="flex justify-end gap-2">
          <Button type="button" severity="danger" @click="closeProjectModal">
            Cancel·la
          </Button>
          <Button type="submit" class="btn-primary" @click="handleAddProject">
            Afegir
          </Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import FullCalendar from "@fullcalendar/vue3";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import AppBreadCrumb from "../components/AppBreadCrumb.vue";
import esLocale from "@fullcalendar/core/locales/es";
import { useProjectStore } from "../stores/projectStore";
import { formatURLDate, formatDate } from "../utils/date";
import { extractErrorMessage } from "../utils/errormessage";
import type { ProjectCalendarResponse, ProjectRequest } from "../types";
import { useCustomerStore } from "../stores/customerStore";

const projectStore = useProjectStore();
const customerStore = useCustomerStore();
const toast = useToast();

const handleDateClick = (info: any) => {
  createProjectModal.value = true;
};

const handleEventClick = (info: any) => {
  alert(info.event.title);
};

const calendarRef = ref();
const projects = ref<ProjectCalendarResponse[]>();
const createProjectModal = ref(false);

const home = ref({
  label: "Inici",
  icon: "pi pi-home",
  route: "/",
});

const breadcrumbItems = computed(() => [
  {
    label: "Projectes",
    icon: "pi pi-calendar",
  },
]);

const calendarOptions = {
  plugins: [timeGridPlugin, interactionPlugin, dayGridPlugin],
  locale: esLocale,
  initialView: "dayGridMonth",
  dateClick: handleDateClick,
  eventClick: handleEventClick,
  events: projects.value,
};

const newProject = ref<ProjectRequest>({
  description: "",
  start_date: null,
  end_date: null,
  color: "",
  customer_id: "",
});

const handleAddProject = async () => {
  try {
    const res = await projectStore.createProject(newProject.value);
    toast.add({
      severity: "success",
      summary: "Projecte creat",
      detail: `${newProject.value.description} - ${res.data.id}`,
      life: 3000,
    });
    const calendarApi = calendarRef.value.getApi();

    calendarApi.addEvent({
      id: res.data.id,
      title: newProject.value.description,
      start: newProject.value.start_date,
      end: newProject.value.end_date,
      color: `#${newProject.value.color}`,
    });
    createProjectModal.value = false;
    newProject.value = {
      description: "",
      start_date: null,
      end_date: null,
      color: "",
      customer_id: "",
    };
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: extractErrorMessage(error),
      life: 3000,
    });
  }
};

const closeProjectModal = () => {
  createProjectModal.value = false;
  newProject.value = {
    description: "",
    start_date: null,
    end_date: null,
    color: "",
    customer_id: "",
  };
};

onMounted(async () => {
  const calendarApi = calendarRef.value.getApi();
  const startDate = calendarApi.view.currentStart;
  const endDate = calendarApi.view.currentEnd;

  await customerStore.fetchCustomers();
  await projectStore.fetchProjectCalendarBetweenDates(
    formatURLDate(startDate),
    formatURLDate(endDate)
  );
  calendarApi.removeAllEvents();
  calendarApi.addEventSource(
    projectStore.projectsCalendar.map((p) => ({
      id: p.id,
      title: p.title,
      start: p.start_date,
      end: p.end_date,
      color: `#${p.color}`,
    }))
  );
});
</script>
