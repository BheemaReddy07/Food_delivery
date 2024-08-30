import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
    return (
      <div className='footer' id='footer'>
          <div className='footer-content'>
              <div className='footer-content-left'>
                  <img className='logo-design' src={assets.logo} />
                  <p> <h3>Dine Now - Order Now</h3> <br/> A recipe has no soul. You, as the cook, must bring soul to the recipe..Life is uncertain. Eat dessert first...Food is symbolic of love when words are inadequate.I watch cooking change the cook, just as it transforms the food.Food brings people together on many different levels. It’s nourishment of the soul and body; it’s truly love The best comfort food will always be greens, cornbread, and fried chicken</p>
                  <div className='footer-social-icons'>
                     <a href='https://www.facebook.com' target='_blank' rel='noopener noreferrer' ><img src= {assets.facebook_icon} alt="" /></a>
                     <a href='https://www.twitter.com' target='_blank' rel='noopener noreferrer' >   <img src= {assets.twitter_icon} alt="" /></a>
                     <a href='https://www.linkedin.com' target='_blank' rel='noopener noreferrer' >   <img src= {assets.linkedin_icon} alt="" /></a>
                  </div>
              </div>
              <div className='footer-content-center'>  
              <h2>COMPANY</h2>
              <ul>
                  <li>Home</li>
                  <li>About us</li>
                  <li>Delivery</li>
                  <li>Privacy Policy</li>
              </ul>
  
              </div>
              <div className='footer-content-right'>
                  <h2>GET IN TOUCH</h2>
                  <ul>
                      <li><a href='mailto:r@rguktong.ac.in'>yaswanth@gmail.com</a></li>
                      <li> +91 99921 12345</li>
                      <li><a href='mailto:r@rguktong.ac.in'>Gnana@gmail.com</a></li>
                      <li><a href='mailto:r@rguktong.ac.in'>Charishma@gmail.com</a></li>
                      <li><a href='mailto:r@rguktong.ac.in'>Sravani@gmail.com</a></li>
                      <li><a href='mailto:r@rguktong.ac.in'>BheemaReddy@gmail.com</a></li>
                     
                      
                      <li>company@DineNow.com</li>
                  </ul>
                  
              </div>
          </div>
        <hr />
        <p className='footer-copyright'>Copyright 2024 © DineNow.com - All Rights Reserved.</p>
      </div>
    )
  }
  
  export default Footer
  
