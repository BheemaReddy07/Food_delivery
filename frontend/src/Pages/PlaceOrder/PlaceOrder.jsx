import React, { useContext } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
const PlaceOrder = () => {
  const {getTotalCartAmount} =useContext(StoreContext)
  return (
    <form className='place-order' id='#place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input type="text" Placeholder="First name" />
          <input type="text" Placeholder="First name" />
        </div>
        <input type="email" placeholder='Email Address'/>
        <input type="text"  placeholder='Street name'/>
        <div className="multi-fields">
          <input type="text" Placeholder="City" />
          <input type="text" Placeholder="State" />
        </div>
        <div className="multi-fields">
          <input type="text" Placeholder="Zip code" />
          <input type="text" Placeholder="Country" />
        </div>
        <input type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
      <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
          <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>

            </div>
            <hr/>
            <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{getTotalCartAmount()===0?0:40}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+40}</b>
            </div>
            <hr />
          </div>
          <button>PROCEED TO PAYMENT</button>
        </div>
      </div>
      
    </form>
  )
}

export default PlaceOrder
