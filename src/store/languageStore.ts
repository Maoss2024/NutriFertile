import { create } from 'zustand';
import i18n from '../lib/i18n';

interface LanguageState {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLanguage: i18n.language || 'fr',
  setLanguage: (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      set({ currentLanguage: lang });
      window.location.reload();
    });
  },
}));