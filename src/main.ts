import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";

import Aura from "@primeuix/themes/aura";
import "./style.css";
import "primeicons/primeicons.css";
import App from "./App.vue";
import router from "./router";

import {
  Button,
  DataTable,
  Column,
  InputText,
  Select,
  Password,
  Card,
  Menu,
  Dialog,
  ToggleSwitch,
  Listbox,
  Breadcrumb,
  DatePicker,
  Textarea,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Tooltip,
  IconField,
  InputIcon,
  InputGroup,
  InputGroupAddon,
  Chip,
  ColorPicker,
} from "primevue";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";

const app = createApp(App);
const pinia = createPinia();
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(pinia);
app.use(router);
app.use(ToastService);

app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Button", Button);
app.component("InputText", InputText);
app.component("Select", Select);
app.component("Password", Password);
app.component("Card", Card);
app.component("Toast", Toast);
app.component("Menu", Menu);
app.component("Dialog", Dialog);
app.component("ToggleSwitch", ToggleSwitch);
app.component("Listbox", Listbox);
app.component("Breadcrumb", Breadcrumb);
app.component("DatePicker", DatePicker);
app.component("Textarea", Textarea);
app.component("Tabs", Tabs);
app.component("Tab", Tab);
app.component("TabList", TabList);
app.component("TabPanels", TabPanels);
app.component("TabPanel", TabPanel);
app.component("IconField", IconField);
app.component("InputIcon", InputIcon);
app.component("InputGroup", InputGroup);
app.component("InputGroupAddon", InputGroupAddon);
app.component("Chip", Chip);
app.component("ColorPicker", ColorPicker);

app.directive("Tooltip", Tooltip);

app.mount("#app");
