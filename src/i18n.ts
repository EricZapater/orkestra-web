import { createI18n } from "vue-i18n";
import ca from "./locales/ca.ts";
import en from "./locales/en.ts";
import es from "./locales/es.ts";

export const i18n = createI18n({
  legacy: false,
  locale: "ca",
  fallbackLocale: "en",
  messages: {
    ca,
    en,
    es,
  },
});
