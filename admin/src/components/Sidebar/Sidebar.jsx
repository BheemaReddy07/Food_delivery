import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to= "/add" className="sidebar-option">
          <img src={assets.add_icon_white} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <img src={assets.bag_icon} alt="" />
          <p>list Items</p>
        </NavLink>
        <NavLink to="/orders"  className="sidebar-option">
          <img src={assets.bag_icon} alt="" />
          <p>orders</p>
        </NavLink>
        
      </div>
      
    </div>
  )
}

export default Sidebar
