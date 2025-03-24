import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleClose = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const cookieText = {
    fr: {
      title: "🍪 Nous utilisons des cookies",
      description: "Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre site.",
      accept: "Accepter",
      close: "Fermer"
    },
    en: {
      title: "🍪 We use cookies",
      description: "We use cookies and similar technologies to enhance your experience on our site.",
      accept: "Accept",
      close: "Close"
    },
    pl: {
      title: "🍪 Używamy plików cookie",
      description: "Używamy plików cookie i podobnych technologii, aby ulepszyć Twoje doświadczenia na naszej stronie.",
      accept: "Akceptuj",
      close: "Zamknij"
    }
  };

  const currentLang = i18n.language as keyof typeof cookieText;
  const text = cookieText[currentLang] || cookieText.fr;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-white rounded-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{text.title}</h3>
              <p className="text-gray-600">{text.description}</p>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <button
                onClick={handleAccept}
                className="bg-[#7AB80E] text-white px-6 py-2 rounded-lg hover:bg-[#689A0D] transition-colors"
              >
                {text.accept}
              </button>
              <button
                onClick={handleClose}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}