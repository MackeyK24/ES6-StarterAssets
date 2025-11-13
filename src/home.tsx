import { useNavigate, NavigateFunction } from "react-router-dom";
import babylonLogo from './assets/babylon.png'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './app.css'

function HomePage() {
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
        <button onClick={() => navigate("/babylon", { state: { fromApp: true, rootPath: "/scenes/", sceneFile: "samplescene.gltf" } })}>Sample Scene</button>
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

export default HomePage
