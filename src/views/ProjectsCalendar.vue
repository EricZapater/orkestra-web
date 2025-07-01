<template>
  <AppBreadCrumb :home="home" :model="breadcrumbItems" class="mb-3" />
  <div class="card">
    <h2>Projectes</h2>
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
    <ProjectFormDialog
      v-model:visible="createProjectModal"
      :editMode="editMode"
      :project="newProject"
      :customers="customerStore.customers"
      @submit="handleAddProject"
    />
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
import {
  formatURLDate,
  formatDate,
  setStartOfDay,
  setEndOfDay,
} from "../utils/date";
import { extractErrorMessage } from "../utils/errormessage";
import type {
  ProjectCalendarResponse,
  ProjectRequest,
  Project,
} from "../types";
import { useCustomerStore } from "../stores/customerStore";
import type { DateClickArg } from "@fullcalendar/interaction";
import ProjectFormDialog from "../components/ProjectFormDialog.vue";
import Decimal from "decimal.js";

const projectStore = useProjectStore();
const customerStore = useCustomerStore();
const toast = useToast();

const handleDateClick = (info: any) => {
  editMode.value = false;
  newProject.value.start_date = info.date;
  createProjectModal.value = true;
};

const handleEventClick = async (info: any) => {
  editMode.value = true;
  createProjectModal.value = true;
  await projectStore.fetchProjectById(info.event.id);
  newProject.value = {
    description: projectStore.selectedProject?.description ?? "",
    start_date: projectStore.selectedProject?.start_date
      ? new Date(projectStore.selectedProject.start_date)
      : null,
    end_date: projectStore.selectedProject?.end_date
      ? new Date(projectStore.selectedProject.end_date)
      : null,
    color: projectStore.selectedProject?.color ?? "",
    customer_id: projectStore.selectedProject?.customer_id ?? "",
    amount: "0",
    estimated_cost: "0",
  };
};

const calendarRef = ref();
const projects = ref<ProjectCalendarResponse[]>();
const createProjectModal = ref(false);
const editMode = ref(false);

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
const zero = new Decimal(0);

const newProject = ref<ProjectRequest>({
  description: "",
  start_date: null,
  end_date: null,
  color: "",
  customer_id: "",
  amount: "0",
  estimated_cost: "0",
});

const handleAddProject = async () => {
  try {
    if (!editMode.value) {
      newProject.value.start_date = setStartOfDay(newProject.value.start_date);
      newProject.value.end_date = setEndOfDay(newProject.value.end_date);
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
    } else {
      newProject.value.start_date = setStartOfDay(newProject.value.start_date);
      newProject.value.end_date = setEndOfDay(newProject.value.end_date);
      const Project = ref<Project>({
        id: projectStore.selectedProject?.id ?? "",
        description: newProject.value.description,
        start_date: newProject.value.start_date?.toISOString() ?? "",
        end_date: newProject.value.end_date?.toISOString() ?? "",
        color: newProject.value.color,
        customer_id: projectStore.selectedProject?.customer_id ?? "",
        amount: zero,
        estimated_cost: zero,
      });

      const res = await projectStore.updateProject(Project.value);
      toast.add({
        severity: "success",
        summary: "Projecte actualitzat",
        detail: `${newProject.value.description} - ${res.data.id}`,
        life: 3000,
      });
      const calendarApi = calendarRef.value.getApi();
      const existingEvent = calendarApi.getEventById(
        projectStore.selectedProject?.id!
      );

      if (existingEvent) {
        existingEvent.setProp("title", newProject.value.description);
        existingEvent.setStart(newProject.value.start_date);
        existingEvent.setEnd(newProject.value.end_date);
        existingEvent.setProp("color", `#${newProject.value.color}`);
      }
    }
    createProjectModal.value = false;
    newProject.value = {
      description: "",
      start_date: null,
      end_date: null,
      color: "",
      customer_id: "",
      amount: "0",
      estimated_cost: "0",
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
    amount: "0",
    estimated_cost: "0",
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
