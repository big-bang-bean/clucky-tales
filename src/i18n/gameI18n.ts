import i18n from "i18next";
import en from "@/locales/en/translation.json";
import ru from "@/locales/ru/translation.json";

let initialized = false;

export function initGameI18n(): typeof i18n {
  if (initialized) {
    return i18n;
  }
  i18n.init({
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
  });
  initialized = true;
  return i18n;
}
