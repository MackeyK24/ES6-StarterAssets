import { BrowserRouter, Routes, Route } from "react-router-dom";
import BabylonSceneViewer from "./babylon/babylon.tsx";
import ProtectedRoute from "./babylon/routing.tsx";
import HomePage from "./home.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/babylon" element={
          <ProtectedRoute allowDevMode={true}>
            <BabylonSceneViewer rootPath="/scenes/" sceneFile="mainmenu.gltf" allowQueryParams={true} />
          </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App