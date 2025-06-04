<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script lang="ts" setup>
import FullCalendar from "@fullcalendar/vue3";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Calendar } from "@fullcalendar/core";
import esLocale from "@fullcalendar/core/locales/es";

const handleDateClick = (info: any) => {
  alert(info.event.title + " - " + info.start);
};

const calendarOptions = {
  plugins: [timeGridPlugin, interactionPlugin, dayGridPlugin],
  locale: esLocale,
  initialView: "dayGridMonth",
  eventClick: handleDateClick,
  events: [
    {
      title: "Reunió",
      start: "2025-06-02T10:00:00",
      end: "2025-06-02T11:30:00",
      color: "#28a745",
    },
    {
      title: "Projecte X",
      start: "2025-06-02T13:00:00",
      end: "2025-06-03T14:00:00",
      color: "#ffc107",
    },
    {
      title: "Projecte XY",
      start: "2025-06-04T13:00:00",
      end: "2025-06-07T14:00:00",
      color: "#ffc107",
    },
  ],
};
</script>
