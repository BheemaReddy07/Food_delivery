import React, { useContext,useEffect ,useState } from 'react'
import "./Verify.css"
import { useSearchParams,useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import {toast} from "react-toastify"
const Verify = () => {
    const [searchParams,setSearchParams] = useSearchParams();
    const success = searchParams.get("success");  //this is searching the params from the url bar in the browser with success attribute
    const orderId = searchParams.get("orderId");  //this is searching the params from the url bar in the browser with orderId attribute
    const {url} =useContext(StoreContext);
    const navigate = useNavigate();
    const [isVerified,setIsVerified] = useState(false);  //state to check the order is verif
    const [error, setError] = useState(null);
    
    //function to play the notification sound on order placing
    const playNotificationSound = () =>{
        console.log('Playing order placed notification sound'); 
        const audio = new Audio(assets.notification);
        audio.loop = false;
        audio.volume = 1.0;
        audio.play().catch(error => {
            console.error('Error playing the notification sound:', error);
          });
    }

    //function to verify the payment
    const verifyPayment = async () =>{
      try {
        const response = await  axios.post(url+"/api/order/verify",{success,orderId});
        
        console.log('Payment verification response:', response.data); 
        if(response.data.success){
            setIsVerified(true);   //if payment is success the verified is set to true
           toast.success("Order Placed...")
        }
        else{
            setError("Verification failed. Redirecting...");
            setTimeout(() => navigate("/"), 3000); // Redirect after a delay if verification fails
        }
      } catch (error) {
        setError("Error verifying the order. Redirecting...");
        console.error('Error during payment verification:', error);
        setTimeout(() => navigate("/"), 3000);
      }
    }

    useEffect(()=>{
        verifyPayment();
    },[])

    const handleProceedClick = () => {
        playNotificationSound();  // Play the sound after user clicks to proceed
        navigate("/myorders");    // Redirect to My Orders
    };
  return ( 
    <div className='verify'>
        <div className='verify-check'>
            {isVerified ? (
                <div className='confirmation'>
                    <h2>Order placed successfully!</h2>
                    <button onClick={handleProceedClick} className='proceed-button'>
                        Proceed to My Orders
                    </button>
                </div>
            ) : error ? (
                <div className='error'>
                    <h2>{error}</h2>
                </div>
            ) : (
                <div className='spinner'></div> // Show loading spinner while verifying
            )}
        </div>
      
    </div>
  )
}

export default Verify
