import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enUS from './enUS.json';
import ko from './ko.json';

const resources = {
  'en-US': { translation: enUS },
  ko: { translation: ko },
};

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    // lng: 'en-US',
    fallbackLng: 'en-US',
    saveMissing: true,
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    // https://github.com/i18next/i18next-browser-languageDetector
    detection: {
      order: ['navigator'],
    },
  });

export default i18n;
