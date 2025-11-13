import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Nullable } from "@babylonjs/core/types";
import { Observer } from "@babylonjs/core/Misc/observable";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { SceneManager } from "@babylonjs-toolkit/next";
import { useCallback } from "react";
import { useLocation, useNavigate, NavigateFunction, Location } from "react-router-dom";
import BaseSceneViewer from "./viewer.tsx";
import CustomOverlay from "../custom/overlay.tsx";
import GameManager from "../global.ts";
import "./babylon.css";

export declare type SceneViewerProps = {
  rootPath?: string;
  sceneFile?: string;
  allowQueryParams?: boolean;
  enableCustomOverlay?: boolean;
};

/**
 * ES6 Interactive Babylon Toolkit Scene Viewer (GLTF)
 * Example: navigate('/babylon', { state: { fromApp: true, rootPath: '/scenes/', sceneFile: 'sampleScene.gltf' } });
 * @param fromApp navigation flag
 * @param rootPath scene location
 * @param sceneFile scene filename
 */

function BabylonSceneViewer(props: SceneViewerProps & React.CanvasHTMLAttributes<HTMLCanvasElement>) {
  const { rootPath, sceneFile, allowQueryParams, enableCustomOverlay } = props;
  const locationRef:Location = useLocation();
  const navigateTo: NavigateFunction = useNavigate();
  const createScene = useCallback(async (scene:Scene) => {
    if (scene.isDisposed) return; // Note: Strict mode safety
    let disposed = false;
    let disposeObserver = scene.onDisposeObservable.add(() => { disposed = true; });
    let assetsManager: AssetsManager | null = null;

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 1 - Initialize the global runtime scene properties and react navigation system
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    try {
      await GameManager.InitializeRuntime(scene, navigateTo, true, true, false);
      if (disposed || scene.isDisposed) return; // Note: Strict mode safety
    
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      // STEP 2 - Load the babylon scene assets (GLTF) using the toolkit assets manager
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      let isDevelopment: boolean = (import.meta.env.DEV === true);
      let defaultPageUrl: URL = new URL(window.location.href.replace("#?", "?"));
      let babylonRootPath: string = rootPath || "/scenes/";
      let babylonSceneFile: string = sceneFile || "samplescene.gltf";
      if (allowQueryParams === true) {
        babylonRootPath = locationRef?.state?.rootPath || babylonRootPath;
        babylonSceneFile = locationRef?.state?.sceneFile || babylonSceneFile;
        if (isDevelopment === true) {
          babylonRootPath = defaultPageUrl.searchParams.get("root") || babylonRootPath;
          babylonSceneFile = defaultPageUrl.searchParams.get("scene") || babylonSceneFile;
        }
      }
      assetsManager = new AssetsManager(scene);
      assetsManager.addMeshTask("BabylonScene", null, babylonRootPath, babylonSceneFile);
      await SceneManager.LoadRuntimeAssets(assetsManager, [babylonSceneFile], async () => {
      if (disposed || scene.isDisposed) return; // Note: Strict mode safety

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        // STEP 3 - Finalize scene setup after assets are loaded and hide the loading screen
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        GameManager.LocalBus.PostMessage("OnSceneReady", babylonSceneFile);
        SceneManager.HideLoadingScreen(scene.getEngine());
        SceneManager.FocusRenderCanvas(scene);
      });
    } catch (error) {
      console.error("Failed to load babylon scene assets", error);
    } finally {
      assetsManager = null;
      if (disposeObserver) scene.onDisposeObservable.remove(disposeObserver);
    }
  }, [enableCustomOverlay, allowQueryParams, locationRef, navigateTo]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // OPTIONAL: Add custom loading div over the root div and disable the default loading screen
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (    
    <div className="viewer">
      <BaseSceneViewer webgpu={true} antialias={true} adaptToDeviceRatio={true} onCreateScene={createScene} className="canvas" />
      {props.enableCustomOverlay && <CustomOverlay className="overlay" />}
    </div>
  );
}

export default BabylonSceneViewer;