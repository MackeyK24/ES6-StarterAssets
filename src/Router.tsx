import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * To properly access protected routes, the user must navigate from within the app.
 * If they try to access it directly (e.g., via browser URL), they will be redirected.
 * The navigation within the app should set location state { fromApp: true }.
 * Example: navigate('/demo', { state: { fromApp: true } });
 */

export default function ProtectedRoute({ children, redirectTo = '/' }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If no state was passed (direct browser access), redirect
    if (!location.state || !location.state.fromApp) {
      navigate(redirectTo, { replace: true });
    }
  }, [location, navigate, redirectTo]);

  // Only render if accessed from within app
  if (!location.state || !location.state.fromApp) {
    return null;
  }

  return <>{children}</>;
}
