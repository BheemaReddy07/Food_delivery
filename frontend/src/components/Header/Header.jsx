import React, { useEffect, useState } from 'react';
import './Header.css';
// setting an array of images with details for animation
const headers = [
    {
      image: "/t1.jpg",
      title: "Savor Every Bite",
      description: "Experience culinary excellence with every meal. Our dishes are crafted to deliver taste and satisfaction with every bite.",
      position: { bottom: '20%', left: '5vw' },
      font:{
       titleFontSize:'3vw',
       titleFontWeight:'700',
       titleColor:'blue',
       descriptionFontSize:'1.5vw',
       descriptionFontWeight:'500',
      }
    },
    {
      image: "/t2.jpg",
      title: "Fresh and Local",
      description: "Enjoy farm-fresh ingredients sourced locally. Our commitment to quality ensures that every dish is made with the finest produce.",
      position: { bottom: '20%', left: '2vw' },
      font:{
        titleFontSize:'3vw',
        titleFontWeight:'700',
        titleColor:'blue',
        descriptionFontSize:'1.5vw',
        descriptionFontWeight:'500',
       }
    },
    {
      image: "/t3.jpg",
      title: "Deliciously Convenient",
      description: "Order your favorite meals with ease and have them delivered right to your door. Convenience meets quality in every order.",
      position: { bottom: '12%', left: '7vw' },
      font:{
        titleFontSize:'4vw',
        titleFontWeight:'700',
        titleColor:'blue',
        descriptionFontSize:'1.5vw',
        descriptionFontWeight:'500',
       }
    },
     
    {
      image: "/t5.jpg",
      title: "Gourmet Delights",
      description: "Discover gourmet dishes that bring a touch of elegance to your dining experience. Perfect for special occasions or a delightful treat.",
      position: { bottom: '20%', left: '14vw' },
      font:{
        titleFontSize:'3vw',
        titleFontWeight:'700',
        titleColor:'blue',
        descriptionFontSize:'1.5vw',
        descriptionFontWeight:'500',
       }
    },
    {
      image: "/t6.jpg",
      title: "Healthy Choices",
      description: "Make healthier choices with our menu options that cater to a variety of dietary needs. Enjoy delicious and nutritious meals.",
      position: { bottom: '18%', left: '6vw' },
      font:{
        titleFontSize:'3vw',
        titleFontWeight:'700',
        titleColor:'blue',
        descriptionFontSize:'1.5vw',
        descriptionFontWeight:'500',
       }
    },
    {
      image: "/t7.jpg",
      title: "Innovative Cuisine",
      description: "Explore a menu that pushes culinary boundaries with innovative recipes and unique flavor combinations.",
      position: { bottom: '14%', left: '6vw' },
      font:{
        titleFontSize:'3vw',
        titleFontWeight:'700',
        titleColor:'blue',
        descriptionFontSize:'1.5vw',
        descriptionFontWeight:'500',
       }
    },
    {
      image: "/t8.jpg",
      title: "Family Favorites",
      description: "Bring the family together with meals that everyone will love. From kid-friendly dishes to hearty options, we have something for everyone.",
      position: { bottom: '20%', left: '8vw' },
      font:{
        titleFontSize:'3vw',
        titleFontWeight:'700',
        titleColor:'blue',
        descriptionFontSize:'1.5vw',
        descriptionFontWeight:'500',
       }
    },
    {
      image: "/t9.jpg",
      title: "Exquisite Desserts",
      description: "End your meal on a sweet note with our exquisite desserts. Each creation is a masterpiece of taste and presentation.",
      position: { bottom: '25%', right: '5vw' },
      font:{
        titleFontSize:'3vw',
        titleFontWeight:'700',
        titleColor:'blue',
        descriptionFontSize:'1.5vw',
        descriptionFontWeight:'500',
       }
    },
    {
      image: "/t10.jpg",
      title: "Seasonal Specials",
      description: "Enjoy dishes that celebrate the flavors of the season. Our seasonal specials are crafted to highlight the best ingredients of the time.",
      position: { bottom: '12%', left: '10vw' },
      font:{
        titleFontSize:'3vw',
        titleFontWeight:'700',
        titleColor:'blue',
        descriptionFontSize:'1.5vw',
        descriptionFontWeight:'500',
       }
    },
    {
      image: "/t11.jpg",
      title: "Artisan Breads",
      description: "Experience the joy of freshly baked artisan breads. Our breads are made with care and the finest ingredients for the perfect texture and flavor.",
      position: { bottom: '10%',left: '2vw' },
      font:{
        titleFontSize:'3vw',
        titleFontWeight:'700',
        titleColor:'blue',
        descriptionFontSize:'1.5vw',
        descriptionFontWeight:'500',
       }
    },
    {
      image: "/t12.jpg",
      title: "Signature Dishes",
      description: "Try our signature dishes that define our culinary identity. Each dish is a reflection of our passion for great food.",
      position: { bottom: '16%', left: '6vw' },
      font:{
        titleFontSize:'3vw',
        titleFontWeight:'700',
        titleColor:'blue',
        descriptionFontSize:'1.5vw',
        descriptionFontWeight:'500',
       }
    }
  ];

const Header = () => {
  const [currImageIndex, setCurrImageIndex] = useState(0);  //setting the index for the header images to changes for every predifined intervel
  const [fadeIn, setFadeIn] = useState(true);   //image transition effect
 //transition between images with fadein 
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false); // Start fading out
      setTimeout(() => {
        setCurrImageIndex((prevIndex) => (prevIndex + 1) % headers.length);
        setFadeIn(true); // Start fading in
      }, 500); // Match this duration with CSS transition time
    }, 10000); // Time between image changes

    return () => clearInterval(interval);
  }, []);

  const { image, title, description, position, font } = headers[currImageIndex];

  return (
    <div className='header'>
      <div className={`transition-background ${fadeIn ? 'fade-in' : 'fade-out'}`} style={{ backgroundImage: `url('/back.png')` }}></div>
      <div className={`header-background ${fadeIn ? 'fade-in' : 'fade-out'}`} style={{ backgroundImage: `url(${image})` }}></div>
      <div className={`header-contents ${fadeIn ? 'fade-in' : 'fade-out'}`} style={position}>
        <h2 style={{ fontSize: font.titleFontSize, color: font.titleColor, fontWeight: font.titleFontWeight }}>{title}</h2>
        <p style={{ fontSize: font.descriptionFontSize, fontWeight: font.descriptionFontWeight }}>{description}</p>
        <button><a href='#food-display'>View Menu</a></button>
      </div>
    </div>
  );
}

export default Header;
