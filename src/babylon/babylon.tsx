import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Nullable } from "@babylonjs/core/types";
import { Observer } from "@babylonjs/core/Misc/observable";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { SceneManager } from "@babylonjs-toolkit/next";
import { useCallback } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import BaseSceneViewer from "./viewer.tsx";
import GameManager from "../global.ts";
import "../app.css";

export declare type SceneViewerProps = {
  rootPath?: string;
  sceneFile?: string;
  allowQueryParams?: boolean;
};

/**
 * ES6 Interactive Babylon Toolkit Scene Viewer (UnityGLTF)
 * @param props scene viewer properties
 */

function BabylonSceneViewer(props: SceneViewerProps & React.CanvasHTMLAttributes<HTMLCanvasElement>) {
  const { rootPath, sceneFile, allowQueryParams } = props;
  const defaultRootPath: string = rootPath || "/scenes/";
  const defaultSceneFile: string = sceneFile || "samplescene.gltf";
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
      const babylonPageUrl = new URL(window.location.href.replace("#?", "?"));
      const babylonRootPath = (allowQueryParams === true) ? (babylonPageUrl.searchParams.get("root") || defaultRootPath) : defaultRootPath;
      const babylonSceneFile = (allowQueryParams === true) ? (babylonPageUrl.searchParams.get("scene") || defaultSceneFile) : defaultSceneFile;
      assetsManager = new AssetsManager(scene);
      assetsManager.addMeshTask("BabylonScene", null, babylonRootPath, babylonSceneFile);
      await SceneManager.LoadRuntimeAssets(assetsManager, [babylonSceneFile], async () => {
      if (disposed || scene.isDisposed) return; // Note: Strict mode safety

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        // STEP 3 - Finalize scene setup after assets are loaded and hide the loading screen
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        SceneManager.HideLoadingScreen(scene.getEngine());
        SceneManager.FocusRenderCanvas(scene);
      });
    } catch (error) {
      console.error("Failed to load babylon scene assets", error);
    } finally {
      assetsManager = null;
      if (disposeObserver) scene.onDisposeObservable.remove(disposeObserver);
    }
  }, [allowQueryParams, defaultRootPath, defaultSceneFile, navigateTo]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // OPTIONAL: Add custom loading div over the root div and disable the default loading screen
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (    
    <div className="viewer">
      <BaseSceneViewer webgpu={true} antialias={true} adaptToDeviceRatio={true} onCreateScene={createScene} className="canvas" />
    </div>
  );
}

export default BabylonSceneViewer;