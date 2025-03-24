import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { signIn, signUp } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setShowSuccessMessage(false);
  };

  const getErrorMessage = (error: Error) => {
    const errorMessage = error.message.toLowerCase();
    
    // Messages spécifiques pour l'inscription
    if (!isLogin) {
      if (errorMessage.includes('password')) {
        return 'Le mot de passe doit contenir au moins 6 caractères';
      }
      if (errorMessage.includes('email')) {
        return 'Veuillez entrer une adresse email valide';
      }
      if (errorMessage.includes('already registered')) {
        return 'Cette adresse email est déjà utilisée';
      }
    }
    
    // Messages généraux
    if (errorMessage.includes('invalid login credentials')) {
      return 'Email ou mot de passe incorrect';
    }
    if (errorMessage.includes('rate limit')) {
      return 'Trop de tentatives, veuillez réessayer plus tard';
    }
    if (errorMessage.includes('confirmer votre email')) {
      return error.message;
    }
    
    return 'Une erreur est survenue, veuillez réessayer';
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    return null;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Veuillez entrer une adresse email valide';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowSuccessMessage(false);

    try {
      // Validation des champs
      const emailError = validateEmail(email);
      if (emailError) {
        setError(emailError);
        return;
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        return;
      }

      if (isLogin) {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(getErrorMessage(signInError));
          return;
        }
        onClose();
        navigate('/today', { replace: true });
      } else {
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return;
        }

        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(getErrorMessage(signUpError));
          return;
        }

        setShowSuccessMessage(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Une erreur inattendue est survenue');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{isLogin ? t('auth.login') : t('auth.register')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {showSuccessMessage ? (
          <div className="text-center">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Merci pour ton inscription !</h3>
            <p className="text-gray-700 mb-4">
              Ton inscription a bien été prise en compte. Pour finaliser la création de ton compte Nutri' Fertile, nous t'avons envoyé un email d'activation à l'adresse que tu as renseignée.
            </p>
            <p className="text-gray-700 mb-6">
              👉 Vérifie ta boîte de réception dès maintenant ! Si tu ne vois pas l'email, pense à vérifier dans tes spams ou courriers indésirables.
            </p>
            <p className="text-gray-700 italic">
              Nous avons hâte de t'accueillir et de partager avec toi des ressources inspirantes et adaptées à ton parcours.<br />
              À très vite sur Nutri' Fertile 🌱 !<br /><br />
              Magdalena
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#7AB80E] focus:border-[#7AB80E]"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#7AB80E] focus:border-[#7AB80E]"
                required
                minLength={6}
              />
            </div>
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.confirmPassword')}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#7AB80E] focus:border-[#7AB80E]"
                  required
                  minLength={6}
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-[#7AB80E] text-white py-2 rounded-lg hover:bg-[#689A0D] transition-colors"
            >
              {isLogin ? t('auth.login') : t('auth.register')}
            </button>
          </form>
        )}

        {!showSuccessMessage && (
          <p className="mt-4 text-center text-sm text-gray-600">
            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                resetForm();
              }}
              className="ml-1 text-[#7AB80E] hover:text-[#689A0D]"
            >
              {isLogin ? t('auth.register') : t('auth.login')}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}