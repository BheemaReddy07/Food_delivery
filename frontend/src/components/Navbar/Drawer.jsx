import React, { useContext, useEffect, useState } from 'react'
import './Drawer.css'
import { CloseOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import {   HomeOutlined, MobileOutlined, ShopOutlined,LogoutOutlined ,ShoppingCartOutlined,ShoppingOutlined,InboxOutlined} from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';

const Drawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {token,setToken} = useContext(StoreContext)
  const [accountOut,setAccountOut] = useState(false);



  const handleNavigation = (path, scrollTo) => {
    navigate(path, { state: { scrollTo } });
    onClose();

  }

  useEffect(() => {
    if (token) {
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







  
const logout = ()=>{
   
   if(token)
   {
     
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
    setAccountOut(false);
}
  return (
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
          {(accountOut)   && ( 
            <>
          <li><InboxOutlined />orders</li>
          <li><Link to="/" onClick={()=>{onClose(),logout();}}><LogoutOutlined />Logout</Link></li>
          </> 
          )}
       
        </ul>
      </div>
    </>
  )
}

export default Drawer
