import { Scene } from "@babylonjs/core/scene";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Tools } from "@babylonjs/core/Misc/tools";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";
import Viewer from './Viewer';
import './App.css';

// Babylon Side-Effects
import "@babylonjs/inspector";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";

// Babylon Toolkit Next
import { SceneManager } from "@babylonjs-toolkit/next";

// Project Script Bundle
// import "../unity/YourUnityFolder/Assets/[Import]/Project";

function App() {
  const onSceneReady = async (scene:Scene) => {
    // This configures the engine, scene and canvas references (non-mesh)
    const engine = scene.getEngine();
    const canvas = scene.getEngine().getRenderingCanvas();
    const cleanup = () => {
      if (globalThis["HKP"]) delete globalThis["HKP"];
      if (globalThis["HK"]) delete globalThis["HK"];
    };
    scene.onDisposeObservable.add(cleanup);

    // This creates and positions a debug camera (non-mesh)
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);
    scene.activeCamera = camera;

    // This creates ambient light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.8;

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 1 - Initializes the runtime library global scene properties
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    await SceneManager.InitializeRuntime(engine, { showDefaultLoadingScreen: true, hideLoadingUIWithEngine: false });

    // Initialize fresh physics for this scene
    // @ts-ignore
    globalThis.HK = await HavokPhysics();
    globalThis.HKP = new HavokPlugin(false);
    scene.enablePhysics(new Vector3(0,-9.81,0), globalThis.HKP);

    // This is for scene level debugging purposes
    globalThis.scene = scene;
    globalThis.engine = engine;
    globalThis.canvas = canvas;

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 2 - Loads the sample scene & player armature exported from the unity starter assets project
    // https://assetstore.unity.com/packages/essentials/starter-assets-character-controllers-urp-267961
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    const assetsManager = new AssetsManager(scene);
    assetsManager.addMeshTask("samplescene", null, "/scenes/", "samplescene.gltf");
    assetsManager.addMeshTask("playerarmature", null, "/scenes/", "playerarmature.gltf");
    await SceneManager.LoadRuntimeAssets(assetsManager, ["samplescene.gltf","playerarmature.gltf"], ()=> {
      /////////////////////////////////////////////////////////////////////////////////////////////////////
      // STEP 3 - Attach the player controller to the player armature
      /////////////////////////////////////////////////////////////////////////////////////////////////////
      const player = scene.getNodeByName("PlayerArmature") as TransformNode;
      Tools.Log("Attaching player controller...");
      try
      {
        // This instantiates a third person player controller script component from the babylon toolkit starter content package
        // @ts-ignore
        // const controller = new PROJECT.ThirdPersonPlayerController(player, scene, { arrowKeyRotation: true, smoothMotionSpeed:true, smoothChangeRate: 25.0 });
        // controller.enableInput = true;
        // controller.attachCamera = true;
        // controller.boomPosition.set(0, 0, -5);
        // controller.moveSpeed = 5.335;
        // controller.walkSpeed = 2.0;
        // controller.jumpSpeed = 12.0;
        // SceneManager.AttachScriptComponent(controller, "PROJECT.ThirdPersonPlayerController");
      }
      catch (e)
      {
        console.error("Failed to attach player controller", e);
      } 
      finally
      {
        SceneManager.HideLoadingScreen(engine);
        SceneManager.FocusRenderCanvas(scene);
      }
    });
  };

  return (    
    <div className="root">
      <Viewer webgpu={true} antialias={true} adaptToDeviceRatio={true} onSceneReady={onSceneReady} className="canvas" id="my-canvas" />
    </div>
  );
}

export default App;