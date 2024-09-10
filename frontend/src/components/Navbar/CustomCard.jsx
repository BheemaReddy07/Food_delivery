import React, { useEffect, useState, useContext } from 'react';
import { Card } from 'antd';
import {jwtDecode} from 'jwt-decode';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import './CustomCard.css'
const { Meta } = Card;

const CustomCard = () => {
  const { token } = useContext(StoreContext);
  const [name, setName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(assets.profile_icon);
  const [userEmail,setUserEmail] = useState('');
  const {url} = useContext(StoreContext)

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const img = decodedToken.profileImage;
        const userName = decodedToken.name;
        const mail = decodedToken.email;
        const baseUrl = `${url}/profiles`;
        const imageUrl = img ? `${baseUrl}/${img}` : assets.profile_icon;
        
        setName(userName);
        setProfileImageUrl(imageUrl);
        setUserEmail(mail);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  return (
    <Card
    className="custom-card"
    hoverable
    cover={<img alt="Profile" src={profileImageUrl} className="custom-image" />}
  >
    <Meta
      className="details"
      title={<span className="custom-title">{name}</span>}
      description={<span className="custom-description">{userEmail}</span>}
    />
  </Card>
  );
};

export default CustomCard;
