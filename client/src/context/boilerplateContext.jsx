// Estructura base para contextos en un sistema moderno con React

// ✅ ThemeContext.js
// import { createContext, useContext, useState } from 'react';
export const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => useContext(ThemeContext);

// ✅ ModalContext.js
// import { createContext, useContext, useState } from 'react';
export const ModalContext = createContext();
export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const showModal = (content) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  return (
    <ModalContext.Provider value={{ modalContent, showModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
export const useModal = () => useContext(ModalContext);

// ✅ SettingsContext.js
// import { createContext, useContext, useState } from 'react';
export const SettingsContext = createContext();
export const SettingsProvider = ({ children }) => {
  const [compactMode, setCompactMode] = useState(false);

  return (
    <SettingsContext.Provider value={{ compactMode, setCompactMode }}>
      {children}
    </SettingsContext.Provider>
  );
};
export const useSettings = () => useContext(SettingsContext);

// ✅ LanguageContext.js
// import { createContext, useContext, useState } from 'react';
export const LanguageContext = createContext();
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
export const useLanguage = () => useContext(LanguageContext);

// ✅ ToastContext.js (como vimos antes)
// [Reutilizar código de ToastProvider]

// 🧠 Ejemplo de uso en main.jsx
/*
<ThemeProvider>
  <ToastProvider>
    <AuthProvider>
      <SettingsProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </SettingsProvider>
    </AuthProvider>
  </ToastProvider>
</ThemeProvider>
*/
