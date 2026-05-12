'use client';

/*
 * =================================================================
 * Host Navigation Adapter - React Router DOM
 * =================================================================
 * Bridges react-router-dom hooks into the babylon toolkit's
 * UnifiedNavigation context. Replace this file (or pick a different
 * adapter) when porting to TanStack Router, Next.js, etc.
 * =================================================================
 */

import { createElement, ReactNode, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  NavigationProvider,
  UnifiedNavigateFunction,
  LocationState,
  NavigationState,
} from "../babylon/system/platform";
import GameManager from "../babylon/globals";

export function ReactRouterNavAdapter({ children }: { children: ReactNode }) {
  const rrNavigate = useNavigate();
  const rrLocation = useLocation();

  const navigate: UnifiedNavigateFunction = useCallback(
    (path, options) => {
      rrNavigate(path, { state: options?.state, replace: options?.replace });
    },
    [rrNavigate]
  );

  // Register the navigation hook globally so GameManager.NavigateTo works on
  // every page (Home, etc.), even before the Babylon runtime has initialized.
  // Note: Since ReactRouterNavAdapter wraps your whole app (inside BrowserRouter) and already owns the navigate function. Then it's set once, app-wide, before any page renders.
  useEffect(() => {
    GameManager.SetReactNavigationHook(navigate);
    return () => GameManager.DeleteReactNavigationHook();
  }, [navigate]);

  const location: LocationState = useMemo(
    () => ({
      pathname: rrLocation.pathname,
      search: rrLocation.search,
      state: rrLocation.state as NavigationState | undefined,
    }),
    [rrLocation]
  );

  const value = useMemo(() => ({ navigate, location }), [navigate, location]);

  return createElement(NavigationProvider, { value }, children);
}