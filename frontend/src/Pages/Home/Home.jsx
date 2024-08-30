import React, { useState ,useEffect} from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import {useLocation} from 'react-router-dom'
const Home = () => {
  const[category,setCategory]=useState("All");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const target = document.querySelector(location.state.scrollTo);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  
  return (
    <div>
      <Header/>
      <ExploreMenu id='#explore-menu' category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      <AppDownload id='#app-download'/>
    </div>
  )
}

export default Home
