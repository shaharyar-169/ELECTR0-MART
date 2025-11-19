// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ur: {
    translation: {
      Hello: "ہیلو",
      Goodbye: "الوداع",
      // Add other translations as needed
    },
  },
  // Add other languages if needed
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ur", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export default i18n;
