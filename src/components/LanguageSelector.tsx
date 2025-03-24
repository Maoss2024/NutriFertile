import React from 'react';
import { useLanguageStore } from '../store/languageStore';

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polski' },
];

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguageStore();

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
        <span className="text-sm font-medium">{currentLanguage.toUpperCase()}</span>
      </button>
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
              currentLanguage === lang.code ? 'text-[#7AB80E] font-medium' : 'text-gray-700'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}