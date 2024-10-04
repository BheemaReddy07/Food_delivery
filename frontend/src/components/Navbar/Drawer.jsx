import React, { useContext, useEffect, useState } from 'react'
import './Drawer.css'
import { CloseOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import {   HomeOutlined, MobileOutlined, ShopOutlined,LogoutOutlined ,ShoppingCartOutlined,ShoppingOutlined,InboxOutlined} from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';

const Drawer = ({ isOpen, onClose }) => {   //destructing the isOpen and onCLose from the Navbar.jsx
  const navigate = useNavigate();
  const {token,setToken} = useContext(StoreContext)    //token and setToken is taking from the StoreContext
  const [accountOut,setAccountOut] = useState(false);


//function to move for a particular place that is located in another page
  const handleNavigation = (path, scrollTo) => {
   navigate(path, { state: { scrollTo } });
    onClose();

  }

  //useeffect to find user is logged in or not
  useEffect(() => {
    if (token) {  //if token is available
      try {
        const decodedToken = jwtDecode(token);
        setAccountOut(true); // User is logged in, show orders and logout
      } catch (error) {
        console.error("Error decoding token:", error);
        setAccountOut(false); // In case of an invalid token
      }
    } else {
      setAccountOut(false); // No token, hide orders and logout
    }
  }, [token]);






//function to logout using the drawer component
  
const logout = ()=>{
   
   if(token) 
   {    //if token available
     
    try {
      const decodedToken = jwtDecode(token);  //decodeing the token
        alert(`${decodedToken.name} Logout Successfully!! `)  //creating the alert with userName is logout
      
    } catch (error) {
      console.error("Error decoding token during logout:", error);
    }

   }
   localStorage.removeItem("token");  //removing the token from the localstorage
    setToken("");//changing the token value
    navigate("/");   //navigating to the home page after loguot
    setCartItems({});  //emptying the cart
    setAccountOut(false);  
}
  return ( //using the "isOpen and onClose" from the navbar.jsx
    <>
      {isOpen && <div className={`drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose}></div>}
      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <button className="close-drawer" onClick={onClose}>
            <CloseOutlined /> Close
          </button>
        </div>
        <ul>
          <li><Link to="/" onClick={onClose}><HomeOutlined /> Home</Link></li>
          <li> <a onClick={() => handleNavigation('/', "#explore-menu")}><ShopOutlined />ExploreMenu</a></li>
          <li><a href='#footer' onClick={onClose}><MobileOutlined />Contact us</a></li>
          <li><Link to="/Cart" onClick={onClose}><ShoppingCartOutlined />Cart</Link></li>
          <li><Link to="/Order" onClick={onClose}><ShoppingOutlined />Place Order</Link></li>
          {(accountOut)   && ( //it only display when user is logged in,when user is logged out it doesnot display
            <>  
          <li><Link to="/myorders" onClick={onClose}><InboxOutlined />My Orders</Link></li>
          <li><Link to="/" onClick={()=>{onClose(),logout();}}><LogoutOutlined />Logout</Link></li>
          </> 
          )}
       
        </ul>
      </div>
    </>
  )
}

export default Drawer
