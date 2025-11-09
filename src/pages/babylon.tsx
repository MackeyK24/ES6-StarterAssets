import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Nullable } from "@babylonjs/core/types";
import { Observer } from "@babylonjs/core/Misc/observable";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { SceneManager } from "@babylonjs-toolkit/next";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import GameManager from "../global.ts";
import SceneViewer from "../viewer.tsx";
import "../app.css";

function Babylon() {
  const navigateTo = useNavigate();
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
      const pageurl = new URL(window.location.href.replace("#?", "?"));
      const scenefile = pageurl.searchParams.get("scene") || "samplescene.gltf";
      assetsManager = new AssetsManager(scene);
      assetsManager.addMeshTask("BabylonScene", null, "/scenes/", scenefile);
      await SceneManager.LoadRuntimeAssets(assetsManager, [scenefile], async () => {
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
  }, [navigateTo]);

  return (    
    <div className="root">
      <SceneViewer webgpu={true} antialias={true} adaptToDeviceRatio={true} onCreateScene={createScene} className="canvas" />
    </div>
  );
}

export default Babylon;