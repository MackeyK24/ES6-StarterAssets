import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router.tsx";
import Babylon from "./pages/babylon.tsx";
import Demo from "./pages/playground.tsx";
import Home from "./home.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/babylon" element={<ProtectedRoute><Babylon allowQueryParams={true} /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App