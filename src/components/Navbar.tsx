import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user info from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user.id : null; // Extract the user id

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { isAuthenticated, userName, avatarColor, logout } = authContext;

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    document.body.style.overflow = isOpen ? "auto" : "hidden";
  };

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [location]);

  useEffect(() => {
    setShowDropdown(false);
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home page after logout
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleListPropertyClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault(); // Prevent default link behavior
      navigate("/login"); // Redirect to login page immediately
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="brand-logo">
            <Link to="/">Estate Heaven</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/search">Search Properties</Link>
            <Link to="/list" onClick={handleListPropertyClick}>
              List Property
            </Link>
            <Link to="/aboutus">About Us</Link>
          </div>
          <div className="auth-section">
            {isAuthenticated ? (
              <>
                <div
                  className="user-profile"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="user-name">Welcome, {userName}</span>
                  <div
                    className="user-avatar"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {userName[0]?.toUpperCase()}
                  </div>
                  {showDropdown && (
                    <div className="user-dropdown" ref={dropdownRef}>
                      {/* Append the user ID in the URLs */}
                      <Link to={`/dashboard/profile/${userId}`}>Profile</Link>
                      <Link to={`/dashboard/myproperties/${userId}`}>
                        My Properties
                      </Link>
                      <Link to={`/dashboard/premium/${userId}`}>
                        Premium
                      </Link>
                      <Link to={`/dashboard/favorites/${userId}`}>
                        Favorites
                      </Link>
                      <Link to={`/dashboard/settings/${userId}`}>
                        Settings
                      </Link>
                      <button onClick={handleLogout} className="logout-btn">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons-desktop">
                <Link to="/signup" className="nav-btn signup">
                  Sign Up
                </Link>
                <Link to="/login" className="nav-btn login">
                  Login
                </Link>
              </div>
            )}
          </div>
          <div className="menu-icon" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </nav>
      <div className={`side-panel ${isOpen ? "open" : ""}`}>
        <div className="side-panel-close" onClick={toggleMenu}>
          <FaTimes />
        </div>
        <div className="side-panel-content">
          <Link to="/">Home</Link>
          <Link to="/search">Search Properties</Link>
          <Link to="/list" onClick={handleListPropertyClick}>
            List Property
          </Link>
          <Link to="/aboutus">About Us</Link>
        </div>
        {!isAuthenticated ? (
          <div className="auth-buttons">
            <Link to="/signup" className="nav-btn signup">
              Sign Up
            </Link>
            <Link to="/login" className="nav-btn login">
              Login
            </Link>
          </div>
        ) : (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Navbar;
