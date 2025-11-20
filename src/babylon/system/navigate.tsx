'use client';

import { useCallback, useMemo } from "react";

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

// Check if we're in a Next.js environment
const isNextJS = (): boolean => {
  try {
    // Check for Next.js specific globals or modules
    return typeof window !== 'undefined' && '__NEXT_DATA__' in window;
  } catch {
    return false;
  }
};

/**
 * Unified navigation hook that works with both React Router and Next.js
 * Automatically detects the environment and uses the appropriate router
 */
export function useUnifiedNavigation(): {
  navigate: UnifiedNavigateFunction;
  location: LocationState;
} {
  const isNext = isNextJS();

  if (isNext) {
    // Next.js implementation
    try {
      // Dynamic import to avoid errors in React Router environment
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { useRouter, usePathname, useSearchParams } = require('next/navigation');
      
      const router = useRouter();
      const pathname = usePathname();
      const searchParams = useSearchParams();

      const navigate: UnifiedNavigateFunction = useCallback((path: string, options?: { state?: NavigationState; replace?: boolean }) => {
        // Next.js doesn't support state in the same way, so we'll use query params or sessionStorage
        if (options?.state) {
          // Store state in sessionStorage for Next.js
          sessionStorage.setItem('navigationState', JSON.stringify(options.state));
        }
        
        if (options?.replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
      }, [router]);

      const location: LocationState = useMemo(() => {
        // Try to retrieve state from sessionStorage
        let state: NavigationState | undefined;
        try {
          const storedState = sessionStorage.getItem('navigationState');
          if (storedState) {
            state = JSON.parse(storedState);
          }
        } catch {
          state = undefined;
        }

        return {
          pathname: pathname || '/',
          search: searchParams?.toString() || '',
          state
        };
      }, [pathname, searchParams]);

      return { navigate, location };
    } catch (error) {
      console.warn('Next.js navigation not available, falling back to React Router');
    }
  }

  // React Router implementation (fallback)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useNavigate, useLocation } = require('react-router-dom');
    
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
  } catch (error) {
    // Fallback if neither router is available
    console.error('No router available');
    const fallbackNavigate: UnifiedNavigateFunction = () => {
      console.warn('Navigation not available');
    };
    const fallbackLocation: LocationState = {
      pathname: '/',
      search: '',
      state: undefined
    };
    return { navigate: fallbackNavigate, location: fallbackLocation };
  }
}

/**
 * Hook for Next.js App Router - use this in Next.js app directory
 */
export function useNextNavigation() {
  if (typeof window === 'undefined') {
    throw new Error('useNextNavigation must be used in a client component');
  }
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useRouter, usePathname, useSearchParams } = require('next/navigation');
    return { useRouter, usePathname, useSearchParams };
  } catch {
    throw new Error('Next.js navigation not available');
  }
}

/**
 * Hook for React Router - use this in React apps
 */
export function useReactRouterNavigation() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useNavigate, useLocation } = require('react-router-dom');
    return { useNavigate, useLocation };
  } catch {
    throw new Error('React Router not available');
  }
}
