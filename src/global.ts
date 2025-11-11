import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";
import { SceneManager } from "@babylonjs-toolkit/next";

class GameManager {
    public static get IsDevelopmentMode(): boolean { return import.meta.env.DEV; }
    public static async InitializeRuntime(scene:Scene, navigateToFunction:any = null, enablePhysics:boolean = true, showLoadingScreen:boolean = true, hideEngineLoadingUI:boolean = false): Promise<void> {
        if (scene.isDisposed) return; // Note: Strict mode safety
        await SceneManager.InitializeRuntime(scene.getEngine(), { showDefaultLoadingScreen: showLoadingScreen, hideLoadingUIWithEngine: hideEngineLoadingUI });
        await import("@babylonjs-toolkit/dlc/DebugInformation");
        await import("@babylonjs-toolkit/dlc/DefaultCameraSystem");
        await import("@babylonjs-toolkit/dlc/MobileInputController");
        await import("@babylonjs-toolkit/dlc/ThirdPersonPlayerController");
        if (GameManager.IsDevelopmentMode) await import("@babylonjs/inspector");
        if (scene.isDisposed) return; // Note: Strict mode safety

        // Set React Navigation Hook (Note: Remark or remove to disable navigation from scene)
        SceneManager.SetReactNavigationHook(scene, navigateToFunction);

        // Havok is only loaded once globally AFTER SceneManager.InitializeRuntime
        if (enablePhysics)
        {
            if (globalThis.HK == null || globalThis.HKP == null)
            {
                // @ts-ignore - This initializes fresh physics for this scene
                globalThis.HK = await HavokPhysics();
                globalThis.HKP = new HavokPlugin(false);
            }
            if (!scene.isDisposed && globalThis.HK != null && globalThis.HKP != null)
            {
                scene.enablePhysics(new Vector3(0,-9.81,0), globalThis.HKP);
            }
            const cleanupGlobals = () =>
            {
                if (globalThis["HKP"]) delete globalThis["HKP"];
                if (globalThis["HK"]) delete globalThis["HK"];
            };
            if (!scene.isDisposed)
            {
                scene.onDisposeObservable.addOnce(cleanupGlobals);
            }
            else
            {
                cleanupGlobals(); // Note: Force clean up if scene was disposed already
            }
        }
    }
}

export default GameManager;