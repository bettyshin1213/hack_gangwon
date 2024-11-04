import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: {
        translation: {
          "Hello! Do you have any questions about drugs?": "안녕하세요! 마약에 대해 궁금한 점이 있으신가요?",
          "Hi there! How can I help?" : "안녕하세여! 도와드릴까여?"
        }
      }
    },
    lng: "ko",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

