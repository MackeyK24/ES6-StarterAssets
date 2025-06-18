import { Scene } from "@babylonjs/core/scene";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Tools } from "@babylonjs/core/Misc/tools";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";
import TOOLKIT from 'babylon-toolkit-next';
import Viewer from './Viewer';
import './App.css';

// Required side-effects for the starter content
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";

function App() {
  const onSceneReady = async (scene:Scene) => {
    // This configures the engine, scene and canvas references (non-mesh)
    const engine = scene.getEngine();
    const canvas = scene.getEngine().getRenderingCanvas();
    const cleanup = () => {
      if (globalThis["HKP"]) {
        delete globalThis["HKP"];
      }
      if (globalThis["HK"]) {
        delete globalThis["HK"];
      }
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

    // This initializes the runtime library (non-mesh)
    await TOOLKIT.SceneManager.InitializeRuntime(engine, { showDefaultLoadingScreen: true, hideLoadingUIWithEngine: false, loadProjectScriptBundle: false });

    // Initialize fresh physics for this scene
    // @ts-ignore
    globalThis.HK = await HavokPhysics();
    globalThis.HKP = new HavokPlugin(false);
    scene.enablePhysics(new Vector3(0,-9.81,0), globalThis.HKP);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // This loads the sample scene & player armature exported from the unity starter assets project
    // https://assetstore.unity.com/packages/essentials/starter-assets-character-controllers-urp-267961
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const assetsManager = new AssetsManager(scene);
    assetsManager.addMeshTask("samplescene", null, TOOLKIT.SceneManager.PlaygroundRepo, "samplescene.gz.gltf");
    assetsManager.addMeshTask("playerarmature", null, TOOLKIT.SceneManager.PlaygroundRepo, "playerarmature.gz.gltf");
    await TOOLKIT.SceneManager.LoadRuntimeAssets(assetsManager, ["samplescene.gz.gltf","playerarmature.gz.gltf"], ()=> {
      // This get the player armature transform node from scene hierarchy
      const player = scene.getNodeByName("PlayerArmature") as TransformNode;
      Tools.Log("Attaching player controller...");

      // This instantiates a third person player controller script component from the babylon toolkit starter content package
      // @ts-ignore
      // const controller = new PROJECT.ThirdPersonPlayerController(player, scene, { arrowKeyRotation: true, smoothMotionSpeed:true, smoothChangeRate: 25.0 });
      // controller.enableInput = true;
      // controller.attachCamera = true;
      // controller.boomPosition.set(0, 0, -5);
      // controller.moveSpeed = 5.335;
      // controller.walkSpeed = 2.0;
      // controller.jumpSpeed = 12.0;
      // TOOLKIT.SceneManager.AttachScriptComponent(controller, "PROJECT.ThirdPersonPlayerController");

      // This finally hides the screen loader
      TOOLKIT.SceneManager.HideLoadingScreen(engine);
      TOOLKIT.SceneManager.FocusRenderCanvas(scene);
    });
  };

  return (    
    <div className="root">
      <Viewer webgpu={true} antialias={true} adaptToDeviceRatio={true} onSceneReady={onSceneReady} className="canvas" id="my-canvas" />
    </div>
  );
}

export default App;