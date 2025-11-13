import { useNavigate, NavigateFunction } from "react-router-dom";
import "./overlay.css";

function CustomOverlay() {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className="overlay">

      Custom Overlay Content
      
    </div>
  )
}

export default CustomOverlay;