import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router.tsx";
import Demo from "./pages/playground.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Demo />} />
        <Route path="/babylon" element={<ProtectedRoute><Babylon /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App