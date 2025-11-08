import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Router";
import Demo from "./Demo";

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