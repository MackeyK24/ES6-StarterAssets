import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  allowDevMode?: boolean;
}

/**
 * To properly access protected routes, the user must navigate from within the app.
 * If they try to access it directly (e.g., via browser URL), they will be redirected.
 * The navigation within the app should set location state { fromApp: true }.
 * Example: navigate('/demo', { state: { fromApp: true } });
 */

export default function ProtectedRoute({ children, redirectTo = '/', allowDevMode = false }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDevMode: boolean = import.meta.env.DEV === true;
  const allowByState: boolean = Boolean(location.state?.fromApp);
  const isAllowed: boolean = allowByState || (allowDevMode && isDevMode);

  useEffect(() => {
    // If no state was passed (direct browser access), redirect
    if (!isAllowed) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAllowed, navigate, redirectTo]);

  // Only render if accessed from within app
  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
