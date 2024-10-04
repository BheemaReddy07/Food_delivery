import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const PlaceOrder = () => {
  const {getTotalCartAmount,token,food_list,cartItems,url} =useContext(StoreContext)
   const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
   })

   const onChangeHandler = (event)=>{
    const name= event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
   }
    
   const placeOrder = async  (event) =>{
    event.preventDefault();
    let orderItems = [];  //default value for the order item
    food_list.map((item)=>{    //traverse through the food_list,item refers to the each "item" in the list
      if(cartItems[item._id]>0){  //if cart has items
        let itemInfo =item;     //itemInfo assign the item,
        itemInfo["quantity"]=cartItems[item._id];
        orderItems.push(itemInfo)  //adding to the order items
      }
    })
     console.log(orderItems)
    let orderData = {   //creating the orderdata with address,item list and amount
      address:data,
      items:orderItems,
      amount:getTotalCartAmount()+40,
    } 
    let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}})  //send the data to the backend
    if(response.data.success){
      const {session_url} =response.data;  //getting the session url from the response that is from the orderController.js
      window.location.replace(session_url);
    }
    else{
      console.log(response.data.message);
      alert("Error");
    }
   }
 const navigate = useNavigate();

   useEffect(()=>{  //if user is not logged in it navigates to cart
     if(!token){
        navigate("/cart")
     }
     else if(getTotalCartAmount()==0){ //if cart is empty ,it navigates to the cart 
      navigate("/cart")
     }
   },[token])
   
  return (
    <form onSubmit={placeOrder}   className='place-order' id='#place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName}    type="text" placeholder="First name" />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName}   type="text" placeholder="Last Name" />
        </div>
        <input required name='email'  onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address'/>
        <input required name='street' onChange={onChangeHandler}  value={data.street}  type="text"  placeholder='Street name'/>
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler}  value={data.city} type="text" placeholder="City" />
          <input required name='state' onChange={onChangeHandler} value={data.state}   type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler}  value={data.zipcode}  type="text" placeholder="Zip code" />
          <input required name='country' onChange={onChangeHandler} value={data.country}   type="text" placeholder="Country" />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone}   type="text" placeholder='Phone' />
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
          <button type='submit'>PROCEED TO PAYMENT</button>
          
        </div>
      </div>
      
    </form>
  )
}

export default PlaceOrder
