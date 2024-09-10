// src/App.jsx
import React, { useState } from 'react';
import {  Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import Cart from './Pages/Cart/Cart';
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import ThemeProvider from './Context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import Verify from './Pages/Verify/Verify';
import MyOrders from './Pages/MyOrders/MyOrders';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
   

  return (
    <ThemeProvider>
        <ToastContainer />
      
       
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div>
        <div className="app">
            <Navbar setShowLogin={setShowLogin} />
            <hr />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<PlaceOrder />} />
              <Route path="/verify" element={<Verify/>}/>
              <Route path="/myorders" element={<MyOrders/>}/>
            </Routes>
        
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
