import { Link } from "react-router-dom";
import HireWiseLogo from "../img/HireWiseLogo.png";
import './style/HomePage.css'; 

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        {/* Logo on the right */}
        <a className="navbar-brand" href="/">
          <img src={HireWiseLogo} alt="HireWise Logo" className="logo" />
        </a>
        

        {/* Dashboard button on the left */}
        <div className="d-flex">
          <Link to="/dashboard">
            <button type="button" className="btn-1">
              Dashboard
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
