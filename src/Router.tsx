import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

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
