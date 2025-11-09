import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Nullable } from "@babylonjs/core/types";
import { Observer } from "@babylonjs/core/Misc/observable";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { SceneManager } from "@babylonjs-toolkit/next";
import { ThirdPersonPlayerController } from "@babylonjs-toolkit/dlc/ThirdPersonPlayerController";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import GameManager from "../global.ts";
import SceneViewer from "../viewer.tsx";
import "../app.css";

function Demo() {
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
      // STEP 2 - Load the sample scene & player armature exported from the unity starter assets
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      assetsManager = new AssetsManager(scene);
      assetsManager.addMeshTask("samplescene", null, "/scenes/", "samplescene.gltf");
      assetsManager.addMeshTask("playerarmature", null, "/scenes/", "playerarmature.gltf");
      await SceneManager.LoadRuntimeAssets(assetsManager, ["samplescene.gltf", "playerarmature.gltf"], async () => {
      if (disposed || scene.isDisposed) return; // Note: Strict mode safety

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        // STEP 3 - Attach the third person player controller to the player armature transform node
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        try {
            const player = scene.getNodeByName("PlayerArmature") as TransformNode;
            const controller = new ThirdPersonPlayerController(player, scene, { arrowKeyRotation: true, smoothMotionSpeed:true, smoothChangeRate: 25.0 });
            controller.enableInput = true;
            controller.attachCamera = true;
            controller.moveSpeed = 5.335;
            controller.walkSpeed = 2.0;
            controller.jumpSpeed = 12.0;
        } catch (e) {
            console.error("Failed to attach player controller", e);
        } finally {
            SceneManager.HideLoadingScreen(scene.getEngine());
            SceneManager.FocusRenderCanvas(scene);
        }
      });
    } catch (error) {
      console.error("Failed to create runtime scene", error);
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

export default Demo;