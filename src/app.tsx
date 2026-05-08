import { BrowserRouter, Routes, Route, NavigateFunction, useNavigate } from "react-router-dom";
import { SceneManager, ScriptComponent, Utilities } from "@babylonjs-toolkit/next";
import BabylonSceneViewer from "./babylon/system/babylon";
import ApplicationRoute from "./babylon/system/routing";
import { ReactRouterNavAdapter } from "./router";
import babylonLogo from './assets/babylon.png'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './app.css'

function Home() {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div id="vite">
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://babylonjs.com" target="_blank">
          <img src={babylonLogo} className="logo babylon" alt="Babylon logo" />
        </a>
      </div>
      <h1>Vite + React + BabylonJS</h1>
      <div className="card">
        <button onClick={() => navigate("/play", { state: { fromApp: true, rootPath: SceneManager.PlaygroundRepo, sceneFile: "samplescene.gltf" } })}>Play Demo</button>
      </div>
      <p className="read-the-docs">
        Click on the Vite or React or BabylonJS logos to learn more
      </p>
      <p>
       <small><a href="https://www.babylontoolkit.com" target="_blank">Babylon Toolkit Game Development</a></small>
      </p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ReactRouterNavAdapter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={
            <ApplicationRoute allowDevMode={true}>
              <BabylonSceneViewer fullPage={true} rootPath="/scenes/" sceneFile="mainmenu.gltf" allowQueryParams={true} enableCustomOverlay={false} />
            </ApplicationRoute>} />
        </Routes>
      </ReactRouterNavAdapter>
    </BrowserRouter>
  )
}

export default App
