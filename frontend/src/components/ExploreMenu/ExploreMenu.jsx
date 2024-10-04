import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'   //getting the menu list array from assets.js file
const ExploreMenu = ({category,setCategory}) => {   //  destrcuting the category and setCategory from the home.jsx
  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore our menu</h1>
        <p className='explore-menu-text'>Choose form a diverse menu featuring a 
        delecable array of dishes crafted with the finest ingrediants and 
        culinary expertise .Our mission is to satisfy your carvings and elevate 
        your dining  experience, one delicious meal at a time .</p>
        <div className='explore-menu-list'>
             {menu_list.map((item,index)=>{    // traversing the menu_list and index represents the position and item indication each "item" in the array
                return(
                    <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className="explore-menu-list-item">
                        <img className={category===item.menu_name?"active":""} src={item.menu_image} alt=""/>
                        <p>{item.menu_name}</p>
                    </div>
                )
             })}
        </div>
      <hr/>
    </div>
  )
}

export default ExploreMenu
