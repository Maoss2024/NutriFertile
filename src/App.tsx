import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, Search, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthModal } from './components/AuthModal';
import { VideoModal } from './components/VideoModal';
import { useAuthStore } from './store/authStore';
import { useAuthModalStore } from './store/authModalStore';
import { Logo } from './components/Logo';
import { LanguageSelector } from './components/LanguageSelector';
import { HomePage } from './pages/Home';
import { CoursesPage } from './pages/Courses';
import { TodayPage } from './pages/Today';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CookieConsent } from './components/CookieConsent';

function App() {
  const { user, signOut } = useAuthStore();
  const { isOpen, openAuthModal, closeAuthModal } = useAuthModalStore();
  const { t } = useTranslation();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm fixed w-full z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-24">
              <div className="flex items-center">
                <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <Menu className="h-6 w-6" />
                </button>
                <Link to="/" className="ml-4">
                  <Logo />
                </Link>
              </div>
              <div className="flex items-center space-x-8">
                <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <Search className="h-5 w-5" />
                </button>
                <LanguageSelector />
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">{user.email}</span>
                    <button
                      onClick={() => signOut()}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={openAuthModal}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <User className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/today" 
            element={
              <ProtectedRoute>
                <TodayPage />
              </ProtectedRoute>
            } 
          />
        </Routes>

        <AuthModal isOpen={isOpen} onClose={closeAuthModal} />
        <CookieConsent />
      </div>
    </Router>
  );
}

export default App;