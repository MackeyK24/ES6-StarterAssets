import { useEffect, useRef } from "react";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine";
import { EngineStore } from "@babylonjs/core/Engines/engineStore";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";

export declare type BabylonjsProps = {
  webgpu?: boolean;
  antialias?: boolean;
  engineOptions?: any;
  adaptToDeviceRatio?: boolean;
  renderChildrenWhenReady?: boolean;
  sceneOptions?: any;
  onCreateScene: (scene: Scene) => void;
  /**
   * Automatically trigger engine resize when the canvas resizes (default: true)
   */
  observeCanvasResize?: boolean;
  onRender?: (scene: Scene) => void;
  children?: React.ReactNode;
};

function SceneViewer(props: BabylonjsProps & React.CanvasHTMLAttributes<HTMLCanvasElement>) {
  const { webgpu, antialias, engineOptions = {}, adaptToDeviceRatio, sceneOptions, onRender, onCreateScene, ...rest } = props;
  const reactCanvas = useRef(null);

  useEffect(() => {
      let engine: AbstractEngine;
      let scene: Scene;
      let resizeListener: (() => void) | null = null;

      const initializeEngineAndScene = async () => {
          const { current: canvas } = reactCanvas;
          if (!canvas) return;

          if (navigator.gpu && webgpu) {
              // const webGPUSupported = await WebGPUEngine.IsSupportedAsync;            
              // You can decide which WebGPU extensions to load when creating the engine. I am loading all of them            
              // await import("@babylonjs/core/Engines/WebGPU/Extensions/");            
              const webgpuEngine = new WebGPUEngine(canvas, {
                ...engineOptions,
                antialias,
                adaptToDeviceRatio,
                setMaximumLimits: true,
                enableAllFeatures:true,
              });
              await webgpuEngine.initAsync( { jsPath: "scripts/glslang.js", wasmPath: "scripts/glslang.wasm" }, { jsPath: "scripts/twgsl.js", wasmPath: "scripts/twgsl.wasm" } );
              engine = (webgpuEngine as any);
          } else {
              engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
          }

          // Create new scene with default camera
          scene = new Scene(engine, sceneOptions);
          const defaultCamera = new FreeCamera("defaultCamera", new Vector3(0, 5, -10), scene);
          defaultCamera.setTarget(Vector3.Zero());
          scene.activeCamera = defaultCamera;

          if (scene.isReady()) {
              onCreateScene(scene);
          } else {
              scene.onReadyObservable.addOnce((scene) => onCreateScene(scene));
          }

          engine.runRenderLoop(() => {
              if (typeof onRender === "function") onRender(scene);
              scene.render();
          });

          resizeListener = () => {
              engine.resize();
          };

          if (window) {
              window.addEventListener("resize", resizeListener);
          }
      };

      initializeEngineAndScene();

      // Cleanup function
      return () => {
          // Remove resize listener
          if (resizeListener && window) {
              window.removeEventListener("resize", resizeListener);
              resizeListener = null;
          }

          // Get the engine from store as a fallback
          const storeEngine = EngineStore.LastCreatedEngine;
          const engineToDispose = engine || storeEngine;

          if (engineToDispose) {
              // Stop the render loop
              engineToDispose.stopRenderLoop();

              // Dispose the scene if it exists
              if (scene) {
                  scene.dispose();
                  scene = null as any;
              }

              // Dispose the engine
              engineToDispose.dispose();
              engine = null as any;
          }
      };
  }, [webgpu, antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onCreateScene]);

  return <canvas ref={reactCanvas} {...rest} />;
}

export default SceneViewer;