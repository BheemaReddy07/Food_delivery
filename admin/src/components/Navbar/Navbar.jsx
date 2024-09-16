import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify"
const Navbar = () => {
  const adminToken = localStorage.getItem("adminToken");
  const navigate = useNavigate();
  const homeGo = () =>{
    navigate("/")
  }
  const handleProfileClick = () =>{
    navigate("/admin-login")
  }
  const handleLogout =  () =>{
    localStorage.removeItem("adminToken");
    navigate("/");
    window.location.reload();
    alert("Logout successfully");
  }
  return (
    <div className='navbar'>
        <img className='logo' src={assets.logo} alt="" onClick={homeGo}  />
        <h2 className="font-effect-emboss">DineNow Admin</h2>
        {adminToken ? (
        <button onClick={handleLogout} className="logout-button">Logout</button>
      ) : (
        <img className="profile" src={assets.profile_icon} alt="" onClick={handleProfileClick} />
      )}
         
      
    </div>
  )
}

export default Navbar
