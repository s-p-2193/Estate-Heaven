import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import '../../styles/Dashboard/Dashboard.css';
import { FaHome, FaUser, FaCrown, FaSlidersH, FaBuilding, FaBars, FaTimes, FaHeart } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null; 
  const userId = user ? user.id : null;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    document.body.style.overflow = isSidebarOpen ? 'auto' : 'hidden';
  };

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto';
  }, [isSidebarOpen]);

  return (
    <>
      <div className="dashboard-menu-icon" onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </div>
      <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="dashboard-sidebar">
          <h2 className="sidebar-title"> User Dashboard</h2>
          <ul className="dashboard-sidebar-links">
            <li>
              <Link to={`/dashboard/profile/${userId}`} className={`dashboard-sidebar-link ${location.pathname.includes('/dashboard/profile') ? 'active' : ''}`}><FaUser /> Profile</Link>
            </li>
            <li>
              <Link to={`/dashboard/myproperties/${userId}`} className={`dashboard-sidebar-link ${location.pathname.includes('/dashboard/myproperties') ? 'active' : ''}`}><FaBuilding /> My Properties</Link>
            </li>
            <li>
              <Link to={`/dashboard/premium/${userId}`} className={`dashboard-sidebar-link ${location.pathname.includes('/dashboard/premium') ? 'active' : ''}`}><FaCrown /> Premium</Link>
            </li>
            <li>
              <Link to={`/dashboard/settings/${userId}`} className={`dashboard-sidebar-link ${location.pathname.includes('/dashboard/settings') ? 'active' : ''}`}><FaSlidersH /> Settings</Link>
            </li>
            <li>
              <Link to={`/dashboard/favorites/${userId}`} className={`dashboard-sidebar-link ${location.pathname.includes('/dashboard/favorites') ? 'active' : ''}`}><FaHeart /> Favorites</Link>
            </li>
            <li>
              <Link to="/" className={`dashboard-sidebar-link ${location.pathname === '/' ? 'active' : ''}`}><FaHome /> Home</Link>
            </li>
          </ul>
        </div>
        <div className="dashboard-main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
