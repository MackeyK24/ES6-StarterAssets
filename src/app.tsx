import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavigateFunction, useNavigate } from "react-router-dom";
import { SceneManager, ScriptComponent, Utilities } from "@babylonjs-toolkit/next";
import BabylonSceneViewer from "./babylon/system/babylon";
import ApplicationRoute from "./babylon/system/routing";
import { ReactRouterNavAdapter } from "./router";
import babylonLogo from './assets/babylon.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './app.css'

function Home() {
  const [count, setCount] = useState(0)
  const navigate: NavigateFunction = useNavigate();

  return (
    <div id="home">
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </div>
  )
}

// function Home() {
//   const navigate: NavigateFunction = useNavigate();
//   return (
//     <div id="vite">
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//         <a href="https://babylonjs.com" target="_blank">
//           <img src={babylonLogo} className="logo babylon" alt="Babylon logo" />
//         </a>
//       </div>
//       <h1>Vite + React + BabylonJS</h1>
//       <div className="card">
//         <button onClick={() => navigate("/play", { state: { fromApp: true, gameMode: "PlayerControllerDemo", rootPath: SceneManager.PlaygroundRepo, sceneFile: "samplescene.gltf", importMeshes: ["playerarmature.gltf"] } })}>Play Demo</button>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite or React or BabylonJS logos to learn more
//       </p>
//       <p>
//        <small><a href="https://www.babylontoolkit.com" target="_blank">Babylon Toolkit Game Development</a></small>
//       </p>
//     </div>
//   )
// }

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
