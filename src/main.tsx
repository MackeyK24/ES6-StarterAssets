import { MemoryRouter, Routes, Route } from "react-router-dom"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <MemoryRouter>
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  </MemoryRouter>
)
