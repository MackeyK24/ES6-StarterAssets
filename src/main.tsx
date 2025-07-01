import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Default Side Effects
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import '@babylonjs/core/Rendering/depthRendererSceneComponent';
import '@babylonjs/loaders/glTF';
//import '@babylonjs/inspector';

// Starter Content Side Effects
import '@babylonjs-toolkit/dlc/DebugInformation';
import '@babylonjs-toolkit/dlc/DefaultCameraSystem';
import '@babylonjs-toolkit/dlc/MobileInputController';

createRoot(document.getElementById('root')!).render(
    <App />
)
