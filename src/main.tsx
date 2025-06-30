import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// ES6 Side Effects
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Debug/debugLayer.js"; // Augments the scene with the debug methods
import "@babylonjs/inspector";

// Starter Content
import "@babylonjs-toolkit/dlc/DefaultCameraSystem";
import "@babylonjs-toolkit/dlc/DebugInformation";
import "@babylonjs-toolkit/dlc/MobileInputController";

createRoot(document.getElementById('root')!).render(
    <App />
)
