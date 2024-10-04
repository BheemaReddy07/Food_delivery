import React, { useEffect, useState, useContext } from 'react';
import { Card } from 'antd';
import {jwtDecode} from 'jwt-decode';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import './CustomCard.css'
const { Meta } = Card;

const CustomCard = (isOpen,onClose) => {
  const { token } = useContext(StoreContext);   //taking the token from the storeContext
  const [name, setName] = useState('');  //to manage the username
  const [profileImageUrl, setProfileImageUrl] = useState(assets.profile_icon); //to manage the profileImg
  const [userEmail,setUserEmail] = useState(''); //to manage the userEmail
  const {url} = useContext(StoreContext)   //getting the url from the storeContext

  //useEffect to decode the name,Email,ProfileImg from the token
  useEffect(() => {
    if (token) {   //if token is available
      try {
        const decodedToken = jwtDecode(token);  //decoding the token by using the jwt token
        const img = decodedToken.profileImage;   //decoding the profileIMg
        const userName = decodedToken.name;   //decoding the userName
        const mail = decodedToken.email;    //decodeing the email
        const baseUrl = `${url}/profiles`;    //setting the image path
        const imageUrl = img ? `${baseUrl}/${img}` : assets.profile_icon;  //if user uploads the image ,it sets the uploaded img unless it shows the default profile img
        
        setName(userName);   //setting the username that is decoded from the token
        setProfileImageUrl(imageUrl);  //setting the profileImg that is decoded from the token
        setUserEmail(mail);     //setting the userEmail that is decoded from the token
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);   //render when the token is available

  return isOpen ? (
      <Card
    className="custom-card"
    hoverable
    cover={<img alt="Profile" src={profileImageUrl} className="custom-image" />}
    onClick={onclose}
  >
    <Meta
      className="details"
      title={<span className="custom-title">{name}</span>}
      description={<span className="custom-description">{userEmail}</span>}
    />
  </Card>
   
  
  ):null;
};

export default CustomCard;
