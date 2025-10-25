import { Routes, Route } from "react-router-dom";
import Viewer from "./Viewer";
import DemoScene from "./Demo";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import "./App.css";

function App() {
  const onSceneReady = async (scene:Scene) => {
    // This creates and positions a debug camera (non-mesh)
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    scene.activeCamera = camera;

    // This creates ambient light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // This loads the demo starter assets scene
    await DemoScene.Load(scene);
  };

  return (    
    <Routes>
      <Route path="/" element={
        <div className="root">
          <Viewer webgpu={true} antialias={true} adaptToDeviceRatio={true} onSceneReady={onSceneReady} className="canvas" />
        </div>
      } />
    </Routes>
  );
}

export default App;