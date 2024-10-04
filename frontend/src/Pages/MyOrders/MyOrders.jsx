import React, { useContext, useEffect,  useState } from 'react'
import "./MyOrders.css"
import { StoreContext } from "../../Context/StoreContext"
import axios from "axios";
import { assets } from '../../assets/assets';
const MyOrders = () => {

  const [data, setData] = useState([]);   //handling the data value state
  const { url, token } = useContext(StoreContext); //url and token from the context

 //function to fetch the orders from the database
  const fetchOrders = async () => {
    const response = await axios.post(url + "/api/order/userorders", 
      {},  // Add userId to the request body
      { headers: { token } }
    );
    setData(response.data.data); //sets the all orders of the token related
}


   

//function to format the date from UTC to IST
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  }

 //method to find the status of the order
  const getStatusClass = (status) => {
    switch (status) {
      case 'Food Processing':
        return 'processing';
      case 'Out For Delivery':
        return 'out-for-delivery';
      case 'Delivered':
        return 'delivered';
    }

  }
   
  //  // Effect to monitor the data and check for delivered orders

  useEffect(() => {
    if (token) {
      fetchOrders();
      const intervelId = setInterval(fetchOrders, 25000);  //fetchorders for every 25 seconds
      return () => clearInterval(intervelId);  //clears the interval
    }
  }, [token]) //renders when token available

  
   


  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>{formatDate(order.date)}</p>
              <p>{order.items.map((item, index) => {
                if (index === order.items.length - 1) {
                  return item.name + " x " + item.quantity
                }
                else {
                  return item.name + " x " + item.quantity + ","
                }
              })}</p>
              <p>₹{order.amount}.00</p>
              <p>Items:{order.items.length}</p>
              <p><span className={`${getStatusClass(order.status)}`}>&#x25cf;</span><b>{order.status}</b></p>
              
            </div>
          )

        })}
      </div>


    </div>
  )
}

export default MyOrders
