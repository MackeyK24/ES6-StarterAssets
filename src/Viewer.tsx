import { useEffect, useRef } from "react";
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
  onSceneReady: (scene: Scene) => void;
  /**
   * Automatically trigger engine resize when the canvas resizes (default: true)
   */
  observeCanvasResize?: boolean;
  onRender?: (scene: Scene) => void;
  children?: React.ReactNode;
};

function Viewer(props: BabylonjsProps & React.CanvasHTMLAttributes<HTMLCanvasElement>) {
  const { webgpu, antialias, engineOptions = {}, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest } = props;
  const reactCanvas = useRef(null);

  useEffect(() => {
      let engine: AbstractEngine;
      let scene: Scene;
      let resizeListener: (() => void) | null = null;

      const initializeEngineAndScene = async () => {
          const { current: canvas } = reactCanvas;
          if (!canvas) return;

          if (navigator.gpu && webgpu) {
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

          scene = new Scene(engine, sceneOptions);
          if (scene.isReady()) {
              onSceneReady(scene);
          } else {
              scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
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
  }, [webgpu, antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

  return <canvas ref={reactCanvas} {...rest} />;
}

export default Viewer;