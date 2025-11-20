'use client';

/*
 * =================================================================
 * ES6 React Framework Platform Services
 * =================================================================
 * Unified navigation hook for React Router
 * This is the default implementation for React applications
 * =================================================================
 */

import { useCallback, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

// Type definitions for unified navigation
export type NavigationState = {
  fromApp?: boolean;
  rootPath?: string;
  sceneFile?: string;
  auxiliaryData?: string;
  [key: string]: any;
};

export type LocationState = {
  pathname: string;
  search: string;
  state?: NavigationState;
};

export type UnifiedNavigateFunction = (path: string, options?: { state?: NavigationState; replace?: boolean }) => void;

/**
 * Unified navigation hook for React Router
 * This is the default implementation for React applications
 * For Next.js support, create a separate implementation file
 */
export function useUnifiedNavigation(): {
  navigate: UnifiedNavigateFunction;
  location: LocationState;
} {
  const reactNavigate = useNavigate();
  const reactLocation = useLocation();

  const navigate: UnifiedNavigateFunction = useCallback((path: string, options?: { state?: NavigationState; replace?: boolean }) => {
    reactNavigate(path, { state: options?.state, replace: options?.replace });
  }, [reactNavigate]);

  const location: LocationState = useMemo(() => ({
    pathname: reactLocation.pathname,
    search: reactLocation.search,
    state: reactLocation.state as NavigationState | undefined
  }), [reactLocation]);

  return { navigate, location };
}

/**
 * Hook for React Router - use this in React apps
 * This is an alias for useUnifiedNavigation for explicit usage
 */
export function useReactRouterNavigation() {
  return useUnifiedNavigation();
}
