import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import './LoginPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from "axios";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import {toast} from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
const LoginPopup = ({ setShowLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const { url, token, setToken, loadCartData  } = useContext(StoreContext);
    const [currState, setCurState] = useState("Login");
    const [otpSent, setOTPSent] = useState(false);
    const [otp, setOTP] = useState("");
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        repassword: ""
    });
    const [profileImage,setProfileImage] = useState("");

    useEffect(() => {
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            setUserName(decodedToken.name);
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
      }, [token]);
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onFileChangeHandler = (event) => {
        setProfileImage(event.target.files[0]);
    };

    // Function to request OTP for registration or forgot password
    const onRequestOTP = async (event) => {
        event.preventDefault();
        const loadingNotification = toast.loading("Loading....");
        setTimeout(() => { toast.dismiss(loadingNotification) }, 6000);
        const endPoint = forgotPasswordMode ? "/forgot/request-otp" : "/register/request-otp";
        
        try {
            let response;
            if (forgotPasswordMode) {
                response = await axios.post(`${url}/api/user/forgot/request-otp`, {
                    name: data.name,
                    email: data.email,
                    password: undefined,
                });
            } else {
                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('email', data.email);
                formData.append('password', data.password);
    
                if (!forgotPasswordMode && profileImage) {
                    formData.append('profileImage', profileImage);
                }
                response = await axios.post(`${url}/api/user${endPoint}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
    
            if (response.data.success) {
                setOTPSent(true); // Update state to show OTP input
                toast.success(response.data.message);
            } else {
                toast.warning(response.data.message);
            }
        } catch (error) {
            console.error("Error requesting OTP:", error);
            toast.error(error.response.data.message);
        }
    };
    

    // Function to handle OTP verification and complete registration or password reset
    const onSubmitWithOTP = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${url}/api/user/register/verify-otp`, {
                name: data.name,
                email: data.email,
                password:data.password,
                repassword: data.repassword,
                otp:otp
            });
            if (response.data.success) {
                 
                if (!forgotPasswordMode) {
                    setToken(response.data.token);
                    localStorage.setItem("token", response.data.token);
                    await loadCartData(localStorage.getItem("token"));
                }
               
                setShowLogin(false); // Close the popup after successful registration
                toast.success(response.data.message);
            } else {
                
                toast.warning(response.data.message);
                console.log(response.data.message);
            }
        } catch (error) {
            
            console.error("Error verifying OTP:", error);
            toast.error(error.response.data.message);
        }
    };

    // Function to handle password reset after OTP verification
    const onResetPassword = async (event) => {
        event.preventDefault();
        const loadingNotification = toast.loading("Loading....");
        setTimeout(()=>{toast.dismiss(loadingNotification)},6000);
        try {
           
            const response = await axios.post(`${url}/api/user/forgot/reset`, {
                email: data.email,
                password: data.password,
                repassword: data.repassword,
                otp:otp,
            });
            if (response.data.success) {
                toast.success(response.data.message );
                setCurState("Login"); // Switch back to Login after resetting password
                setForgotPasswordMode(false);
                setOTPSent(false); // Reset OTP state after successful password reset
            } else {
                toast.warning(response.data.message );
            }
        } catch (error) {
            console.error("Error resetting password:", error);
             toast.error(error.response.data.message);
        }
    };

    // Login user
    const onLogin = async (event) => {
        event.preventDefault();
        
        try {
            const response = await axios.post(`${url}/api/user/login`, {
                email: data.email,
                password: data.password,
            });
            if (response.data.success) {
                const token  =  response.data.token;
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                await loadCartData(localStorage.getItem("token"));
                setShowLogin(false); // Close the popup after successful login
                if(token){
                    try {
                      const decodedToken = jwtDecode(token);
                      console.log(`${decodedToken.name} logged in successfully`)
                      alert(`${decodedToken.name} Log In successfully!!!`)
                    } catch (error) {
                      console.error("Error decoding token during login", error);
                    }
                  }
            } else {
               toast.warning(response.data.message );
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response.data.message);
        }
    };

    return (
         <>
        <div className='login-popup'>
           <form 
  onSubmit={forgotPasswordMode 
    ? (otpSent ? onResetPassword : onRequestOTP) 
    : (currState === "Login" ? onLogin : otpSent ? onSubmitWithOTP : onRequestOTP)} 
  className='login-popup-container'>
  <div className='login-popup-title'>
                    <h2>{forgotPasswordMode ? "Forgot Password" : currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                <div className='login-popup-inputs'>
                    {currState === "Login" && !forgotPasswordMode ? null : (
                        <input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Your Name' required={!forgotPasswordMode} />
                    )}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <div className='login-popup-input-password'>
                        <input name='password' onChange={onChangeHandler} value={data.password} type={showPassword ? 'text' : 'password'} placeholder='Your Password' required />
                        {showPassword ? (
                            <EyeInvisibleOutlined className="eye-icon" onClick={() => setShowPassword(false)} />
                        ) : (
                            <EyeOutlined className="eye-icon" onClick={() => setShowPassword(true)} />
                        )}
                    </div>
                    {(currState !== "Login" || forgotPasswordMode) && (
                        <div className='login-popup-input-password'>
                            <input name='repassword' onChange={onChangeHandler} value={data.repassword} type={showRePassword ? 'text' : 'password'} placeholder='Re-enter Password' required />
                            {showRePassword ? (
                                <EyeInvisibleOutlined className="eye-icon" onClick={() => setShowRePassword(false)} />
                            ) : (
                                <EyeOutlined className="eye-icon" onClick={() => setShowRePassword(true)} />
                            )}
                        </div>
                    )}
                    {otpSent && (
                        <input name='otp' onChange={(e) => setOTP(e.target.value)} value={otp} type='text' placeholder='Enter OTP' required />
                    )}
                </div>
                {(currState === "Register") && (
                    <input type="file" name='profileImage'  value={data.file} onChange={onFileChangeHandler}   />)}
                <div className='login-popup-actions'>
                    {currState === "Login" && !forgotPasswordMode ? (
                        <>
                            <button className='login-popup-submit'>Login</button>
                            <button type="button" onClick={() => setForgotPasswordMode(true)} className='login-popup-forgot-password'>Forgot Password?</button>
                        </>
                    ) : (
                        <button className='login-popup-submit'>{otpSent ? (forgotPasswordMode ? 'Reset Password' : 'Register') : 'Send OTP'}</button>
                    )}
                </div>
                <div className='login-popup-toggle'>
                    {currState === "Login" ? (
                        <p>New user? <span onClick={() => setCurState("Register")}>Register</span></p>
                    ) : (
                        <p>Already have an account? <span onClick={() => setCurState("Login")}>Login</span></p>
                    )}
                </div>
            </form>
        </div>
        </>
    );
   

};

export default LoginPopup;