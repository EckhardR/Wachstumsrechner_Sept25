// TranslationContext.js
import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const { t } = useTranslation();

  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useGlobalTranslation = () => {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error('useGlobalTranslation must be used within a TranslationProvider');
  }

  return context;
};
