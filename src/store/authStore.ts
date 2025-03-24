import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import i18n from '../lib/i18n';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const getEmailTemplate = (lang: string) => {
  const templates = {
    fr: {
      subject: "🌱 Bienvenue sur Nutri'Fertile - Activez votre compte",
      content: `
Bonjour,

Merci d'avoir rejoint Nutri'Fertile ! Pour activer votre compte et commencer votre parcours vers une meilleure fertilité naturelle, suivez ces étapes simples :

1. Cliquez sur le bouton "Activer mon compte" ci-dessous
2. Vous serez redirigé(e) vers notre plateforme
3. Connectez-vous avec votre email et mot de passe

👉 Activer mon compte :
%confirmation_url%

⚠️ Important : Ce lien d'activation expire dans 24 heures.

Pourquoi activer votre compte ?
- Accéder à tous nos contenus gratuits
- Recevoir des conseils personnalisés
- Suivre votre progression

Si vous ne parvenez pas à cliquer sur le lien, copiez-collez l'URL complète dans votre navigateur.

Besoin d'aide ? Répondez simplement à cet email.

À très vite !

L'équipe Nutri'Fertile
--
Cet email a été envoyé par Nutri'Fertile
Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.
      `.trim(),
      senderName: "Nutri'Fertile",
      replyTo: "contact@nutrifertile.com"
    },
    en: {
      subject: "🌱 Welcome to Nutri'Fertile - Activate Your Account",
      content: `
Hello,

Thank you for joining Nutri'Fertile! To activate your account and begin your journey towards better natural fertility, follow these simple steps:

1. Click the "Activate my account" button below
2. You'll be redirected to our platform
3. Log in with your email and password

👉 Activate my account:
%confirmation_url%

⚠️ Important: This activation link expires in 24 hours.

Why activate your account?
- Access all our free content
- Receive personalized advice
- Track your progress

If you can't click the link, copy and paste the complete URL into your browser.

Need help? Simply reply to this email.

See you soon!

The Nutri'Fertile Team
--
This email was sent by Nutri'Fertile
If you didn't create an account, you can ignore this email.
      `.trim(),
      senderName: "Nutri'Fertile",
      replyTo: "contact@nutrifertile.com"
    },
    pl: {
      subject: "🌱 Witamy w Nutri'Fertile - Aktywuj swoje konto",
      content: `
Cześć,

Dziękujemy za dołączenie do Nutri'Fertile! Aby aktywować konto i rozpocząć swoją podróż ku lepszej naturalnej płodności, wykonaj te proste kroki:

1. Kliknij przycisk "Aktywuj moje konto" poniżej
2. Zostaniesz przekierowany(a) na naszą platformę
3. Zaloguj się używając swojego emaila i hasła

👉 Aktywuj moje konto:
%confirmation_url%

⚠️ Ważne: Ten link aktywacyjny wygasa za 24 godziny.

Dlaczego warto aktywować konto?
- Dostęp do wszystkich darmowych treści
- Otrzymywanie spersonalizowanych porad
- Śledzenie postępów

Jeśli nie możesz kliknąć w link, skopiuj i wklej pełny adres URL do przeglądarki.

Potrzebujesz pomocy? Po prostu odpowiedz na tego emaila.

Do zobaczenia wkrótce!

Zespół Nutri'Fertile
--
Ten email został wysłany przez Nutri'Fertile
Jeśli nie utworzyłeś konta, możesz zignorować ten email.
      `.trim(),
      senderName: "Nutri'Fertile",
      replyTo: "contact@nutrifertile.com"
    }
  };

  return templates[lang as keyof typeof templates] || templates.fr;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          return { error: new Error('Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception et vos spams.') };
        }
        return { error };
      }

      set({ user: data.user });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },
  signUp: async (email, password) => {
    try {
      const currentLang = i18n.language || 'fr';
      const emailTemplate = getEmailTemplate(currentLang);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/today`,
          data: {
            preferred_language: currentLang,
            name: email.split('@')[0]
          },
          emailTemplate: {
            ...emailTemplate,
            emailHeaders: {
              "List-Unsubscribe": "<mailto:unsubscribe@nutrifertile.com>",
              "X-Entity-Ref-ID": new Date().getTime().toString(),
              "Precedence": "Bulk"
            }
          }
        }
      });
      
      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
}));