import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePremium?: boolean;
}

export function ProtectedRoute({ children, requirePremium = false }: ProtectedRouteProps) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}