import React from 'react'
import './Drawer.css'
import { CloseOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
const Drawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path, scrollTo) => {
    navigate(path, { state: { scrollTo } });
    onClose();

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
          <li><Link to="/" onClick={onClose}>Home</Link></li>
          <li> <a onClick={() => handleNavigation('/', "#explore-menu")}>ExploreMenu</a></li>
          <li><a href='#footer' onClick={onClose}>Contact us</a></li>
          <li><Link to="/Cart" onClick={onClose}>Cart</Link></li>
          <li><Link to="/Order" onClick={onClose}>Place Order</Link></li>
        </ul>
      </div>
    </>
  )
}

export default Drawer
