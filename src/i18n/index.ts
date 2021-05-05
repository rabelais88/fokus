import i18n, { FormatFunction } from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enUS from './enUS.json';
import ko from './ko.json';
import _padStart from 'lodash/padStart';

const resources = {
  'en-US': { translation: enUS },
  ko: { translation: ko },
};

const paddit = (num: number, digit: number = 2) => {
  return _padStart(num.toString(), digit, '0');
};

const formatters: { [key: string]: FormatFunction } = {
  pad2digit(_value, _, lng) {
    return paddit(_value);
  },
};

const format: FormatFunction = (value, format, lng) => {
  if (!format) return value;
  if (formatters[format]) return formatters[format](value, format, lng);
  return value;
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
      format,
    },
    // https://github.com/i18next/i18next-browser-languageDetector
    detection: {
      order: ['navigator'],
    },
  });

export default i18n;
