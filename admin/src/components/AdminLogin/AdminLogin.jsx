import React, { useState } from 'react'
import "./AdminLogin.css"
import axios from "axios"
import { assets } from '../../assets/assets'
import { useNavigate } from "react-router-dom"
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
const AdminLogin = ({ url }) => {
    const [email, setEmail] = useState("");
    const [password, SetPassword] = useState("")
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [view, setview] = useState(false)



    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/user/adminlogin`,
                { email, password })
            if (response.data.success) {
                const adminToken = response.data.adminToken;
                localStorage.setItem("adminToken", adminToken);
                navigate("/");
                window.location.reload();
                alert("Login Successfully...")
            }
            else {
                console.log(response.data.message, "error during login");
                setErrorMessage(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('An error occurred during login. Please try again.');
        }
    }

    const onCrossClick = () => {
        navigate("/")
    }

    return (
        <div className='admin-login-back'>
            <div className='admin-login'>
                <div className="admin-login-header">
                    <h2>Admin Login</h2>
                    <img className='cross-icon' src={assets.cross_icon} alt="" onClick={onCrossClick} />
                </div>
                <form onSubmit={handleLogin}>
                    <label className='label'>Email</label>
                    <input required type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter the Email' />

                    <label className='label'>Password</label>
                    <div className="input-wrapper">
                        <input required name='password' value={password} onChange={(e) => SetPassword(e.target.value)} placeholder='Enter the Password' type={view ? "text" : "password"} />
                        {view
                            ? <EyeOutlined className='eye-icon' onClick={() => setview(false)} />
                            : <EyeInvisibleOutlined className='eye-icon' onClick={() => setview(true)} />
                        }
                    </div>

                    {errorMessage && <p className='error-message'>{errorMessage}</p>}
                    <button type='submit'>Login</button>
                </form>



            </div>
        </div>
    )
}


export default AdminLogin
