import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import './LoginPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from "axios";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
const LoginPopup = ({ setShowLogin }) => {   //destructing the setShowlogin from app.jsx
    const [showPassword, setShowPassword] = useState(false);  //state for password visibility
    const [showRePassword, setShowRePassword] = useState(false); //state for repassword visibility
    const { url, token, setToken, loadCartData } = useContext(StoreContext);
    const [currState, setCurState] = useState("Login"); //set the current state by default login section ,it has register state also
    const [otpSent, setOTPSent] = useState(false);  //state to handle the otpsent status while register ,forgot password
    const [otp, setOTP] = useState(""); //setting the otp value when it sents
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false); //setting forgotmode or not when it is in the login state
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        repassword: ""
    });
    const [profileImage, setProfileImage] = useState(""); //state for managing the profile img
  
    //useeffect to decode the token
    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);

            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [token]);

    //useEffect to smooth scroll to top when user clicks on the login on the navbar while user in the bottom of the page
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
                setOTPSent(true); // if response is success ,it sends otp and Update state to show OTP input 
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
                password: data.password,
                repassword: data.repassword,
                otp: otp
            });
            if (response.data.success) {

                if (!forgotPasswordMode) {
                    setToken(response.data.token);  //if not forgot mode ,it set token from the response
                    localStorage.setItem("token", response.data.token); //stores the token in  the local storage
                    await loadCartData(localStorage.getItem("token"));  //loads cart data when the token available
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
        setTimeout(() => { toast.dismiss(loadingNotification) }, 6000);
        try {

            const response = await axios.post(`${url}/api/user/forgot/reset`, {
                email: data.email,
                password: data.password,
                repassword: data.repassword,
                otp: otp,
            });
            if (response.data.success) {  
                toast.success(response.data.message);
                setCurState("Login"); // Switch back to Login after resetting password
                setForgotPasswordMode(false);
                setOTPSent(false); // Reset OTP state after successful password reset
            } else {
                toast.warning(response.data.message);
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
            const response = await axios.post(`${url}/api/user/login`, {  //response for the login
                email: data.email,
                password: data.password,
            });
            if (response.data.success) {     //on succes response 
                const token = response.data.token; //sets the token from the response
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token); //sets the token in the local storage
                await loadCartData(localStorage.getItem("token"));
                setShowLogin(false); // Close the popup after successful login
                if (token) {
                    try {
                        const decodedToken = jwtDecode(token);  //decodeing the token
                        console.log(`${decodedToken.name} logged in successfully`)
                        alert(`${decodedToken.name} Log In successfully!!!`)
                    } catch (error) {
                        console.error("Error decoding token during login", error);
                    }
                }
            } else {
                toast.warning(response.data.message);
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
                    onSubmit={forgotPasswordMode   //on submission if forgotpasswordmode is true,
                        ? (otpSent ? onResetPassword : onRequestOTP) //forgot true,if otpsent true it is on resetpasword function else on requestotp function
                        : (currState === "Login" ? onLogin : otpSent ? onSubmitWithOTP : onRequestOTP)} //if not forgot mode ,and if currstate = login ,it calls onlogin funcuction if not then it checks the otpsent if it true calls on submitwithotp ,if not true it calls onrequest otp function
                    className='login-popup-container'>
                    <div className='login-popup-title'>
                        <h2>{forgotPasswordMode ? "Forgot Password" : currState}</h2>  {/**if forgotmode it shows forgot password else it shows the currstate that is login or register */}
                        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                    </div>
                    <div className='login-popup-inputs'>
                        {/**if login and  forgot mode then it shows the name field */}
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
                         {/** if not login or forgot mode it shows repassword*/}
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
                         {/**if otpsent state is true it show opt input field */}
                        {otpSent && (
                            <input name='otp' onChange={(e) => setOTP(e.target.value)} value={otp} type='text' placeholder='Enter OTP' required />
                        )}
                    </div>
                     {/** if is in registration form it shows the image upload field*/}
                    {(currState === "Register") && (
                        <input type="file" name='profileImage' value={data.file} onChange={onFileChangeHandler} />)}
                    <div className='login-popup-actions'>
                        {currState === "Login" && !forgotPasswordMode ? ( //if current state is login and not a forgot mode so,it shows the "Login and Forgot Password"
                            <>
                                <button className='login-popup-submit'>Login</button>
                                <button type="button" onClick={() => setForgotPasswordMode(true)} className='login-popup-forgot-password'>Forgot Password?</button> {/**onclicking the forgot Passeword */}
                            </>
                        ) : ( //if current state is either not login or forgotmode =>if otpsent true then (if forgotmode is true then resetmode else Register  ) if otpsent is false then it show sendOTP
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