import React, { useContext } from 'react'
import {StoreContext} from '../../Context/StoreContext'
import {useNavigate} from 'react-router-dom'
import './Cart.css'

const Cart = () => {
  const {cartItems,food_list,removeFromCart,getTotalCartAmount,url} = useContext(StoreContext) //geting this from storecontext.jsx

  const navigate = useNavigate();
   
  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">   {/** creating the header */}
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quanity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list && food_list.length >0 ? food_list.map((item,index)=>{    //traversing through the food_list
          if(cartItems[item._id]>0)        //if any item are in the cart
          { 
            return(
              <div>
              <div className='cart-items-title cart-items-item'>  {/* this cart item section*/}
                 <img src={url+"/images/"+item.image} alt="" />
                 <p>{item.name}</p>
                 <p>₹{item.price}</p>
                 <p>{cartItems[item._id]}</p>
                 <p>₹{item.price * cartItems[item._id]}</p>
                 <p onClick={()=>removeFromCart(item._id)} className='cross'>X</p>
              </div>
              <hr/>
              </div>
            )
          }
        }):<p>No items in the cart</p>}
      </div>
      <div className="cart-bottom">   {/**this is amount section */}
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>  {/**this is subtoal section ,we will get the subtotal amount from the backend*/}

            </div>
            <hr/>
            <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{getTotalCartAmount()===0?0:40}</p>  {/**this is delivery amount section,we add 40 by default */}
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+40}</b>   {/**this is total amount section ,subtotal + delivery*/}
            </div>
            <hr />
          </div>
          <button  onClick={()=>navigate('/order')} >PROCEED TO CHECKOUT</button>  {/**we navigates to the order page */}
        </div>
        <div className="cart-promocode">   {/**this is promocode template,we further develop this in future */}
          <div>
            <p>If you have promocode,Enter it here</p>
            <div className='cart-promocode-input'>
              <input type='text' placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
