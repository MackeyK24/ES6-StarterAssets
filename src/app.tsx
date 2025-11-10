import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router.tsx";
import Babylon from "./pages/babylon.tsx";
import Demo from "./pages/playground.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Demo />} />
        <Route path="/babylon" element={<ProtectedRoute><Babylon allowQueryParams={true} /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App