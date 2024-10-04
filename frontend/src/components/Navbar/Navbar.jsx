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
 
 

const Navbar = ({ setShowLogin }) => {  //destructing the setshowlogin from the app.jsx
  const navigate = useNavigate();
  
  const [menu, setMenu] = useState("home");  //state for the menu management
  const [searchTerm, setSearchTerm] = useState("");  //state for searchterm
  const { getTotalCartAmount, setSearchQuery, token, setToken, cartItems, setCartItems,url } = useContext(StoreContext); //geting from the storeContext
  const { theme, toggleTheme } = useContext(ThemeContext);  //getting the theme and toggleTheme
  const [menuVisible, setMenuVisible] = useState(false); //state for menu visible format
  const [drawerVisible, setDrawerVisible] = useState(false);  //state for drawer component handling
  const [userName, setUserName] = useState("");       //state for managing the username
  const [profileImage, setProfileImage] = useState("");  //state for setting the profileImg
  const [cardVisible,setCardVisible] = useState(false);  //state for handling the userProfilecard component

  //useeffect to fetch the name,profileImage,token
  useEffect(() => {
    if (token) {   //if token is available
      try {
        const decodedToken = jwtDecode(token);    //decodeing the token to get the id,name,image
        const img = decodedToken.profileImage;   //decoded the token to get the profileImg
        setUserName(decodedToken.name);           //setting the userName from using the decodedtoken
        const baseUrl = `${url}/profiles`;
        const profileImageUrl = img ? `${baseUrl}/${img}` : assets.profile_icon;   //setting the profile image or default image.
        setProfileImage(profileImageUrl);   //setting the profileImagee
  
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);
  
//logout function 
  const logout = () => {
    if(token){
      try {
        const decodedToken = jwtDecode(token);
        alert(`${decodedToken.name} Logout Successfully!! `)
      } catch (error) {
        console.error("Error decoding token during logout:", error);
      }
    }
    localStorage.removeItem("token");  //removing the token from the localstorage
    setToken(""); //changing the tokem value
    navigate("/");  //navigating to the home page after logout
    setCartItems({});  //emptying the cart items to null after logout
  };

  //function for handling the search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  //function to toggle the drawercomponent
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  //function for handling the navigation
  const handleNavigation = (path, scrollTo) => {
    navigate(path, { state: { scrollTo } });
    setDrawerVisible(false);
  };

  //function to scroll to the desired location 
  const handleMenuClick = (menuItem, path, scrollTo) => {
    setMenu(menuItem);
    handleNavigation(path, scrollTo);
  };

  //function to handle profile visiblity
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
               {cardVisible &&  <CustomCard isOpen={cardVisible} onClose={handleProfileClick}/> }{/**it is to show the profile card when user clicked on the  profile icon */}
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
      <Drawer isOpen={drawerVisible} onClose={toggleDrawer} />  {/**this is drawer component */}
      
    </div>
  );
};

export default Navbar;
