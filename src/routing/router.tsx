'use client';

//import { ReactNode, useCallback, useEffect, useMemo } from 'react';
//import { useLocation, useNavigate } from 'react-router-dom';
//import { LocationState, NavigationProvider, UnifiedNavigateFunction } from '../babylon/system/platform';
import BabylonSceneViewer from '../babylon/system/babylon';
import ApplicationRoute from '../babylon/system/routing';
import GameManager from '../babylon/globals';
import { ReactRouterNavAdapter } from "./adpter";

export default function PlayRoute() {
  return (
    <ReactRouterNavAdapter>
      <ApplicationRoute allowDevMode={true}>
        <BabylonSceneViewer
          sceneUrl={GameManager.PlaygroundRepo + 'samplescene.gltf'}
          fullPage={true}
          allowQueryParams={true}
          enableCustomOverlay={false}
        />
      </ApplicationRoute>
    </ReactRouterNavAdapter>
  );
}
