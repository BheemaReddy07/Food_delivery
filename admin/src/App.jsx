import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Add from './Pages/Add/Add';
import { Route, Routes, Navigate } from 'react-router-dom';
import Orders from './Pages/Orders/Order';
import List from './Pages/List/List';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Pages/Home/Home';
import AdminLogin from './components/AdminLogin/AdminLogin';
import { useNavigate } from "react-router-dom";

const App = () => {
  const [adminToken, setAdminToken] = useState(null);  // Track loading state with null
  const url = "http://localhost:4000";
  const navigate = useNavigate();

  // Fetch the token from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setAdminToken(token || '');  // Set token or empty string if no token exists
  }, []);

  // Handle login success and update token
  const handleLoginSuccess = (token) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token); // Update the state to reflect the token change
    navigate('/'); // Navigate to home or some default protected page
    window.location.reload();
  };

  // Handle logout by clearing the token from state and localStorage
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken('');  // Set to empty string to indicate logged out
    navigate('/admin-login');
  };

  // Check if token is present and update the UI accordingly
  const isAuthenticated = () => {
    return adminToken && adminToken !== '';  // Returns true if token is present
  };

  // While checking the token, display a loading state
  if (adminToken === null) {
    return <div>Loading...</div>;  // Render this while token is being checked
  }

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          {/* Public Route */}
          <Route path='/admin-login' element={<AdminLogin url={url} onLoginSuccess={handleLoginSuccess} />} />
          <Route path='/' element={<Home url={url} />} />

          {/* Protected Routes */}
          {isAuthenticated() ? (
            <>
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/list" element={<List url={url} />} />
              <Route path="/orders" element={<Orders url={url} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/admin-login" />} />
          )}

        </Routes>
      </div>
    </div>
  );
};

export default App;
