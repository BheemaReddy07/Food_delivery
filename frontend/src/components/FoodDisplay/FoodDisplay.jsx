import React, { useContext, useState } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {    //destructing the
    const { food_list, searchQuery } = useContext(StoreContext);  //getting the food_list from the Storecontext
    const [sortOrder,setSortOrder] = useState("");   //for the sorting based on the price

    // Filter items based on category and search query\
     
    const filteredItems = (food_list || []).filter((item) => {     
        const matchesCategory = category === "All" || item.category.toLowerCase().includes(category.toLowerCase());  //it for onclicking on the menu list 
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()); //it is for the searchbar
        return matchesCategory && matchesSearch;
    });
   
    //function to sort the item based on the price
    const sortedItems = [...filteredItems].sort((a,b)=>{
         if(sortOrder==='lowToHigh'){
            return a.price - b.price;
         }
         else if(sortOrder==='highToLow'){
             return b.price - a.price;
         }
         else{
            return 0;
         }
    });

    
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    return (
        <div className='food-display' id='food-display'>
            <h2>Top Dishes Near You</h2>
            <div className='sort-dropdown'>
                <label htmlFor="sort">Filter by: </label>
                <select id="sort" value={sortOrder} onChange={handleSortChange}>
                    <option value="">Select</option>
                    <option value="lowToHigh">Low to High</option>
                    <option value="highToLow">High to Low</option>
                </select>
            </div>
            <div className='food-display-list'>
                {sortedItems.length > 0 ? (
                    sortedItems.map((item, index) => (
                        <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} rate={item.rate} /> /** sending the id,name,description,price,image,rate as props for the FoodItem.jsx */
                    )) 
                ) : (
                    <p>No items found</p>
                )}
            </div>
        </div>
    );
}

export default FoodDisplay;
