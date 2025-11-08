import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router.tsx";
import Demo from "./pages/demo.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Demo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App