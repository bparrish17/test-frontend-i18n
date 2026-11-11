import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@src/locales/en.json';
import fr from '@src/locales/fr.json';
import de from '@src/locales/de.json';

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'de'];

const storedLanguage = typeof localStorage === 'undefined' ? null : localStorage.getItem('lng');

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    de: { translation: de }
  },
  lng: SUPPORTED_LANGUAGES.includes(storedLanguage) ? storedLanguage : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
