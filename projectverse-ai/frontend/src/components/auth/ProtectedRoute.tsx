import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/auth.service';

/**
 * ProtectedRoute - Redirects to /login if user is not authenticated
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
