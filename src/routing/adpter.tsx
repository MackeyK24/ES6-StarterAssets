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

import { createElement, ReactNode, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  NavigationProvider,
  UnifiedNavigateFunction,
  LocationState,
  NavigationState,
} from "../babylon/system/platform";

export function ReactRouterNavAdapter({ children }: { children: ReactNode }) {
  const rrNavigate = useNavigate();
  const rrLocation = useLocation();

  const navigate: UnifiedNavigateFunction = useCallback(
    (path, options) => {
      rrNavigate(path, { state: options?.state, replace: options?.replace });
    },
    [rrNavigate]
  );

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