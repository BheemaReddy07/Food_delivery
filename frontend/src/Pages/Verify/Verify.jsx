import React, { useContext,useEffect } from 'react'
import "./Verify.css"
import { useSearchParams,useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import {toast} from "react-toastify"
const Verify = () => {
    const [searchParams,setSearchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const {url} =useContext(StoreContext);
    const navigate = useNavigate();
    const playNotificationSound = () =>{
        const audio = new Audio(assets.notification);
        audio.loop = false;
        audio.volume = 1.0;
        audio.play().catch(error => {
            console.error('Error playing the notification sound:', error);
          });
    }
    const verifyPayment = async () =>{
        const response = await  axios.post(url+"/api/order/verify",{success,orderId});
        if(response.data.success){
           playNotificationSound();
           toast.success("Order Placed...")
           navigate("/myorders");

        }
        else{
            navigate("/")
        }
    }

    useEffect(()=>{
        verifyPayment();
    },[])
  return ( 
    <div className='verify'>
        <div className="spinner">

        </div>
      
    </div>
  )
}

export default Verify
