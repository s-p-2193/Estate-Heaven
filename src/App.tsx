import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/pages/Homepage';
import Signup from './components/authentication/Signup';
import Login from './components/authentication/Login';
import AboutUs from './components/pages/AboutUs';
import ForgotPassword from './components/authentication/ForgotPassword';
import PublicRoute from './components/PublicRoute';
import SearchProperty from './components/pages/SearchProperty';
import ListProperty from './components/pages/ListProperty';
import Dashboard from './components/pages/Dashboard'; // Ensure you import the Dashboard component
import Profile from './components/ForDashboard/Profile'; // Import the Profile component
import MyProperties from './components/ForDashboard/MyProperties'; // Import the MyProperties component
import Premium from './components/ForDashboard/Premium'; // Import the Premium component
import Settings from './components/ForDashboard/Settings'; // Import the Settings component
import Favorites from './components/ForDashboard/Favorites'; // Ensure this path is correct
import './App.css'; // Import global styles

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/search" element={<SearchProperty />} />
          <Route path="/search/:state/:city/:for" element={<SearchProperty />} />
          <Route path="/list" element={<ListProperty />} />

          {/* Dashboard route (accessible without login) */}
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="myproperties/:userId" element={<MyProperties />} />
            <Route path="premium/:userId" element={<Premium />} />
            <Route path="favorites/:userId" element={<Favorites />} />
            <Route path="settings/:userId" element={<Settings />} />
          </Route>

          {/* Public routes for signup and login wrapped in PublicRoute */}
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;