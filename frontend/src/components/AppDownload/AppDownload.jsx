import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'
const AppDownload = () => {
  return (
    <div className='app-download' id="app-download">
        <p>
        For Better Experience Download <br/>Dine Now App
        </p>
        <div className='app-download-platforms'>
          <a href='https://play.google.com/store/apps/details?id=com.facebook.katana&pcampaignid=web_share' target='_blank' rel='noopener noreferrer'>  <img src= {assets.play_store} alt="" /></a>
          <a href='https://play.google.com/store/apps/details?id=com.facebook.katana&pcampaignid=web_share' target='_blank' rel='noopener noreferrer'>  <img src= {assets.app_store} alt="" /></a>
             
        </div>
      
    </div> 
  )
}

export default AppDownload
