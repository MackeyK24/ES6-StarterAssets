import { Scene } from "@babylonjs/core/scene";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Tools } from "@babylonjs/core/Misc/tools";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";

// Babylon Toolkit Imports
import { SceneManager } from "@babylonjs-toolkit/next";
import { ThirdPersonPlayerController } from "@babylonjs-toolkit/dlc/ThirdPersonPlayerController";

class DemoScene {
    public static async Load(scene:Scene, setHardwareScaling:boolean = true): Promise<void> {
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        // STEP 1 - Initializes the runtime library and global scene properties
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        const engine:AbstractEngine = scene.getEngine();
        await SceneManager.InitializeRuntime(engine, { showDefaultLoadingScreen: true, hideLoadingUIWithEngine: false });
        if (setHardwareScaling === true) engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
        
        // @ts-ignore - This initializes fresh physics for this scene
        globalThis.HK = await HavokPhysics();
        globalThis.HKP = new HavokPlugin(false);
        scene.enablePhysics(new Vector3(0,-9.81,0), globalThis.HKP);

        // This cleans up globals when the scene is disposed
        const cleanupGlobals = () => {
            if (globalThis["HKP"]) delete globalThis["HKP"];
            if (globalThis["HK"]) delete globalThis["HK"];
        };
        scene.onDisposeObservable.addOnce(cleanupGlobals);
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // STEP 2 - The loads the sample scene & player armature exported from the unity starter assets project
        // https://assetstore.unity.com/packages/essentials/starter-assets-character-controllers-urp-267961
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        const assetsManager = new AssetsManager(scene);
        assetsManager.addMeshTask("samplescene", null, "/scenes/", "samplescene.gltf");
        assetsManager.addMeshTask("playerarmature", null, "/scenes/", "playerarmature.gltf");
        await SceneManager.LoadRuntimeAssets(assetsManager, ["samplescene.gltf", "playerarmature.gltf"], ()=> {

            /////////////////////////////////////////////////////////////////////////////////////////////////////
            // STEP 3 - Attach the player controller to the player armature
            /////////////////////////////////////////////////////////////////////////////////////////////////////
            Tools.Log("Attaching player controller...");
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
                SceneManager.HideLoadingScreen(engine);
                SceneManager.FocusRenderCanvas(scene);
            }
        });
    }
}

export default DemoScene;