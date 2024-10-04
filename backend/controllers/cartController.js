                   
import userModel from "../models/userModel.js"


//add items to  user cart
const addToCart = async (req,res) =>{ //function to manage the cart Itmes
    try {
      let userData = await userModel.findById(req.body.userId)  //getting the userData
      if(!userData) 
      {
        return res.status(404).json({success:false,message:"user not found"})
      }
      let cartData = await userData.cartData || {};  //assigning the cartData if available
      if(!cartData[req.body.itemId]){ //if there is not item in the cart it adds count 1
        cartData[req.body.itemId] =1
      }
      else{ //if any item is availble ten it is incremented by 1
        cartData[req.body.itemId]+=1;
      }
      await userModel.findByIdAndUpdate(req.body.userId,{cartData}) //updating the userData with the cartData
      res.json({success:true,message:"Added To Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }

}

//remove items from user cart
const removeFromCart = async (req,res)=>{
    try {
        let userData = await userModel.findById(req.body.userId); //getting the userData
        
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
          }

        let cartData = await userData.cartData ||{}; //assigning the cartData if it is availabl
        if(cartData[req.body.itemId]>0){ //if any item is available then it is decremented by 1.
            cartData[req.body.itemId]-=1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData}); //and updates the cart data
        res.json({success:true,message:"removed from cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
        
    }

}

//fetchuser cart data

const getCart =  async (req,res) =>{
    try {
        let userData = await userModel.findById(req.body.userId); //getting the userData
        
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
          }
        
        let cartData = await userData.cartData  ||{};  //assigning the cartData if available
        res.json({success:true,cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }

}

export {addToCart,removeFromCart,getCart}