// src/Components/Navbar/Navbar.jsx
import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { ThemeContext } from '../../Context/ThemeContext';
import { MenuOutlined, CloseOutlined, HomeFilled, MobileFilled, PhoneFilled, ShopFilled, MoonFilled, SunFilled } from '@ant-design/icons';
import Drawer from './Drawer';
import { jwtDecode } from 'jwt-decode';
import {toast} from 'react-toastify'
import CustomCard from './CustomCard';
 
 

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate();
  
  const [menu, setMenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState(""); 
  const { getTotalCartAmount, setSearchQuery, token, setToken, cartItems, setCartItems,url } = useContext(StoreContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [cardVisible,setCardVisible] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
         
        
        const img = decodedToken.profileImage;   
        setUserName(decodedToken.name);
  
        const baseUrl = `${url}/profiles`;
        
        const profileImageUrl = img ? `${baseUrl}/${img}` : assets.profile_icon; 
        setProfileImage(profileImageUrl);
  
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);
  

  const logout = () => {
    if(token){
      try {
        const decodedToken = jwtDecode(token);
        alert(`${decodedToken.name} Logout Successfully!! `)
      } catch (error) {
        console.error("Error decoding token during logout:", error);
      }
    }
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
    setCartItems({});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const handleNavigation = (path, scrollTo) => {
    navigate(path, { state: { scrollTo } });
    setDrawerVisible(false);
  };

  const handleMenuClick = (menuItem, path, scrollTo) => {
    setMenu(menuItem);
    handleNavigation(path, scrollTo);
  };
  const handleProfileClick = () => {
    setCardVisible(!cardVisible);
  };
   

   

  return (
    <div className={`navbar ${theme}`}>
      <Link to='/'><img src={assets.logo} alt="Logo" className='logo' /></Link>
      <ul className={`navbar-menu ${menuVisible ? 'show' : ''}`}>
        <li><Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}><HomeFilled />Home</Link></li>
        <li><a onClick={() => handleMenuClick("menu", "/", "#explore-menu")} className={menu === "menu" ? "active" : ""}><ShopFilled />Menu</a></li>
        <li><a href="#app-download" onClick={() => handleMenuClick("mobile", "/", "#app-download")} className={menu === "mobile" ? "active" : ""}><MobileFilled />Mobile-app</a></li>
        <li><a href='#footer' onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}><PhoneFilled />Contact us</a></li>
      </ul>

      <div className="navbar-right">
        <div className='search-container'>
          <form className='search-bar-form' onSubmit={handleSearch}>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search...'
            />
            <img
              src={assets.search_icon}
              alt='Search Icon'
              className='search-icon'
            />
          </form>
        </div>
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="Basket Icon" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        <div className="dark-button">
          {!token ? 
            <button className='signinbutton' onClick={() => setShowLogin(true)}>SignIn</button>
            : 
            <div className='navbar-profile' onClick={handleProfileClick} >
              <img className='profileimg' src={profileImage} onClick={handleProfileClick} alt="" />
              <div className={`username-card ${cardVisible ? 'visible' : ''}`}>
                <CustomCard/>
              </div>
              <div className='mobile'><p>{userName}</p></div>
             </div>
          }
          <button className='darkmode' onClick={toggleTheme}>
            {theme === 'dark' ? <SunFilled /> : <MoonFilled />}
          </button>
          <button className='menu-toggle' onClick={toggleDrawer}>
            {drawerVisible ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>
      </div>
      <Drawer isOpen={drawerVisible} onClose={toggleDrawer} />
      
    </div>
  );
};

export default Navbar;
