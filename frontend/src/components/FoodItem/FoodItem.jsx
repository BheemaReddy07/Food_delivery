import React, {useContext} from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import { ThemeContext } from '../../Context/ThemeContext'
import StarRating from './StarRating'
const FoodItem = ({id,name,price,description,image,rate}) => { //getting the id,name,price,description ,image,rate from the foodDisplay.jsx

 /* const [itemCount,setItemCount]=useState(0)*/
  const {cartItems,addToCart,removeFromCart,url}= useContext(StoreContext) //getting from the StoreContext
  const {theme} = useContext(ThemeContext);
  return (
    <div className='food-item'  >
        <div className='food-item-img-container'>
            <img className='food-item-image' src={url+"/images/"+image} />
            {
               
                cartItems && cartItems[id] !== undefined ? (
                   <div className='food-item-counter' >
                       <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} />
                       <p>{cartItems[id]}</p>
                       <img onClick={()=>addToCart(id)} src={assets.add_icon_green} />
                   </div>
                ) : (
                   <img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} />
                )
             
             
            }
        </div>
      <div className='food-item-info'>
        <div className='food-item-name-rating'>
            <p>{name}</p>
            <StarRating rating={rate} />  {/**sending the rate as a prop to starRating.jsx */}
        </div>
        
        <p className='food-item-desc'>{description}</p>
        <p className='food-item-price'>₹{price}</p>
      </div> 
    </div>
  )
}

export default FoodItem
