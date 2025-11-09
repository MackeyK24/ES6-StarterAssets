import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";
import { SceneManager } from "@babylonjs-toolkit/next";

class GameManager {
    public static async InitializeRuntime(scene:Scene): Promise<void> {
        await SceneManager.InitializeRuntime(scene.getEngine(), { showDefaultLoadingScreen: true, hideLoadingUIWithEngine: false });
        await import("@babylonjs-toolkit/dlc/DebugInformation");
        await import("@babylonjs-toolkit/dlc/DefaultCameraSystem");
        await import("@babylonjs-toolkit/dlc/MobileInputController");
        if (import.meta.env.DEV) await import("@babylonjs/inspector");
        
        if (globalThis.HK == null || globalThis.HKP == null)
        {
            // @ts-ignore - This initializes fresh physics for this scene
            globalThis.HK = await HavokPhysics();
            globalThis.HKP = new HavokPlugin(false);
        }
        
        if (globalThis.HK != null && globalThis.HKP != null)
        {
            scene.enablePhysics(new Vector3(0,-9.81,0), globalThis.HKP);
        }

        // This cleans up globals when the scene is disposed
        const cleanupGlobals = () => {
            if (globalThis["HKP"]) delete globalThis["HKP"];
            if (globalThis["HK"]) delete globalThis["HK"];
        };
        scene.onDisposeObservable.addOnce(cleanupGlobals);

    }
}

export default GameManager;