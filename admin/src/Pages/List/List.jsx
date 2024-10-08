import React, { useEffect, useState } from 'react'
import {toast} from "react-toastify"
import axios from "axios"
import './List.css'
const List = ({url}) => {    //destructing the url from the app.jsx
    const [list,setList] = useState([]);

    //fuction to the list the all food items that are availble
     const fecthList = async () =>{
    const response = await axios.get(`${url}/api/food/list`);  //get method to gather the data from the database
     
      if(response.data.success){
        setList(response.data.data)         //if response is success ,it set the response to the setList
      }
      else{
        toast.error("Error")
      }
    }

    //funtion to remove the item form the list or database 
   const removeFood = async (foodId)=>{
     const response = await axios.post(`${url}/api/food/remove`,{id:foodId});
     await fecthList();
     if(response.data.success){
      toast.success(response.data.message)
     }
     else{
      toast.error("Error")
     }

   }
    useEffect(()=>{     //automatically fetches the list again and again after every change is made
      fecthList();
    },[])

  return (
    <div className='list add flex-col'>
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b className='name1'>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {/*here list is any array which contain the foodList,
        takes the list from the fetchlist function,and navigates to every item using map method,index means looping like "i"*/}
        {list.map((item,index)=>{    {/**item=current foodItem,index = current fooditem position */}
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/`+item.image}   />
              <p className='name1'>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p onClick={()=>removeFood(item._id)} className='cursor'>X</p>
            </div>
          )
        })}
      </div>
         
      
    </div>
  )
}

export default List
