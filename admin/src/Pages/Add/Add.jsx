import React, { useEffect, useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

//adding the ADD function
const Add = ({url}) => {          //destructing the url from the app.jsx
    const [image,setImage] = useState(false);    //state for the image
    const [data,setData] = useState({            //state for the data storage ,predined set the empty
        name:"",
        description:"", 
        price:"",
        category:"Salad",
        rate:""
    });

    //changes made in the form reflects 
    const onChangeHandler=(event)=>{
         const name = event.target.name;
         const value = event.target.value;
         if (value >= 0.5 && value <= 5) {
            setData(prevState => ({
              ...prevState,
              [name]: parseFloat(value) // Convert the input to a floating-point number
            }));
          }
        setData(data=>({...data,[name]:value}))        //assigning the data to the values.
    }

    //function for on submission
    const onSubmitHandler = async (event) =>{
           event.preventDefault();
           if (!data.name || !data.description || !data.price || !image) {    //checking the all values are entered or not
            toast.error("Please fill all fields and upload an image");
            return;
        }
           const formData = new FormData();      // creating the form data
           formData.append("name",data.name)                   //adding the data to the form data
           formData.append("description",data.description)     //adding the data to the form data
           formData.append("price",Number(data.price))         //adding the data to the form data
           formData.append("category",data.category)
           formData.append("image",image)
           formData.append("rate", Number(data.rate));

           const response = await axios.post(`${url}/api/food/add`,formData);
           if(response.data.success){          //changes made after successful submission
                setData({
                    name:"",
                    description:"",
                    price:"",
                    category:"Salad",
                    rate:""
                })
                setImage(false)       //changed to false state after submission          
                toast.success(response.data.message)
           }
           else{
            toast.error(response.data.message)

           }
    }
  return (
    <div className='add'>
        <form className='flex-col' onSubmit={onSubmitHandler}>
            <div className="add-img-upload flex-col">
                <p>Upload Image</p>
                <label htmlFor="image">
                    <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
                </label>
                <input  onChange={(e)=>setImage(e.target.files[0])}type="file"  id='image' hidden required/>
            </div>
            <div className="add-product-name flex-col">
                <p>Product name</p>
                <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='type here...' required />

            </div>
            <div className="add-product-description flex-col">
                <p>Product description</p>
                <textarea onChange={onChangeHandler} value={data.description} name="description"   rows="6" placeholder='Write Description' required></textarea>
            </div>
            <div className="add-category-price">
                <div className="add-category flex-col">
                    <p>Product Category</p>
                    <select onChange={onChangeHandler} name="category">
                        <option value="Salad">Salad</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Deserts">Deserts</option>
                        <option value="Sandwich">Sandwich</option>
                        <option value="Cake">Cake</option>
                        <option value="Pure Veg">Pure Veg</option>
                        <option value="Pasta">Pasta</option>
                        <option value="Noodles">Noodles</option>
                        <option value="Biryani">Biryani</option>
                        <option value="Fish">Fish</option>
                        <option value="Prawns">Prawns</option>
                        <option value="Sweets">Sweets</option>
                        <option value="Juice">Juice</option>
                        
                    </select>
                </div>
                <div className="add-price flex-col">
                    <p>Product price</p>
                    <input onChange={onChangeHandler} value={data.price} type="Number" name='price'placeholder='price' required/>
                </div>
               <div className='add-price flex-col'>
               <p>Product Rating</p>
                    <input onChange={onChangeHandler} value={data.rate} type="Number" name='rate'placeholder='Rating' required  min="0.5" max="5"  step="0.5" />
                

               </div>
            </div>
            <button type='submit' className='add-btn'>ADD</button>
        </form>
       
    </div>
  )
}

export default Add
