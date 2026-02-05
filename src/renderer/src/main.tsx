import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { persister, store } from './redux-config/store'
import { PersistGate } from 'redux-persist/integration/react'
import '/src/assets/globalStyle.scss'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import I18NextHttpBackend from 'i18next-http-backend'
import CustomThemeProvider from './theme/customThemeProvider'
import { ThemeProvider } from './theme/ThemeContext'
import Loader from './components/loader'

// import "src/assets/globalStyle.scss";

const fallbackLng = import.meta.env.VITE_FALLBACK_LNG

// Import translation resources directly
import enTranslations from './locales/en/translation.json'
import arTranslations from './locales/ar/translation.json'

const resources = {
  en: {
    translation: enTranslations
  },
  ar: {
    translation: arTranslations
  }
}

i18next
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .init({
    resources,
    fallbackLng: 'ar',
    lng: 'ar', // Force default language to Arabic
    debug: false,
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie']
    },
    interpolation: {
      escapeValue: false
    }
  })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <Provider store={store}>
        <PersistGate loading={<>loading...</>} persistor={persister}>
          <CustomThemeProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </CustomThemeProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  </React.StrictMode>
)
