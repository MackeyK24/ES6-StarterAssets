import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { SceneManager } from "@babylonjs-toolkit/next";
import { ThirdPersonPlayerController } from "@babylonjs-toolkit/dlc/ThirdPersonPlayerController";
import { useCallback } from "react";
import GameManager from "./Global";
import Viewer from "./Viewer";
import "./App.css";

function App() {
  const onSceneReady = useCallback(async (scene:Scene) => {
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 1 - Initialize the global runtime with the default camera and scene properties
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    const defaultCamera = new FreeCamera("defaultCamera", new Vector3(0, 5, -10), scene);
    defaultCamera.setTarget(Vector3.Zero());
    await GameManager.InitializeRuntime(scene, defaultCamera);
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 2 - Load the sample scene & player armature exported from the unity starter assets
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    const assetsManager = new AssetsManager(scene);
    assetsManager.addMeshTask("samplescene", null, "/scenes/", "samplescene.gltf");
    assetsManager.addMeshTask("playerarmature", null, "/scenes/", "playerarmature.gltf");
    await SceneManager.LoadRuntimeAssets(assetsManager, ["samplescene.gltf", "playerarmature.gltf"], ()=> {

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        // STEP 3 - Attach the third person player controller to the player armature transform node
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        try {
            const player = scene.getNodeByName("PlayerArmature") as TransformNode;
            if (player != null) {
                const controller = new ThirdPersonPlayerController(player, scene, { arrowKeyRotation: true, smoothMotionSpeed:true, smoothChangeRate: 25.0 });
                controller.enableInput = true;
                controller.attachCamera = true;
                controller.moveSpeed = 5.335;
                controller.walkSpeed = 2.0;
                controller.jumpSpeed = 12.0;
            }
        } catch (e) {
            console.error("Failed to attach player controller", e);
        } finally {
            SceneManager.HideLoadingScreen(scene.getEngine());
            SceneManager.FocusRenderCanvas(scene);
        }
    });
  }, []);

  return (    
    <div className="root">
      <Viewer webgpu={true} antialias={true} adaptToDeviceRatio={true} onSceneReady={onSceneReady} className="canvas" />
    </div>
  );
}

export default App;