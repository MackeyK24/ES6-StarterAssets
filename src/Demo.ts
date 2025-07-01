import { Scene } from "@babylonjs/core/scene";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";
import { SceneManager } from "@babylonjs-toolkit/next";
import { ThirdPersonPlayerController } from "@babylonjs-toolkit/dlc/ThirdPersonPlayerController";

class DemoScene {
    public static async Load(scene:Scene): Promise<void> {
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        // STEP 1 - Initializes the runtime and global scene properties
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        await SceneManager.InitializeRuntime(scene.getEngine(), { showDefaultLoadingScreen: true, hideLoadingUIWithEngine: false });
        await import("@babylonjs-toolkit/dlc/DebugInformation");
        await import("@babylonjs-toolkit/dlc/DefaultCameraSystem");
        await import("@babylonjs-toolkit/dlc/MobileInputController");
        if (import.meta.env.DEV) await import("@babylonjs/inspector");
        
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
    }
}

export default DemoScene;