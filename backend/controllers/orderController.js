import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY) //creating the stripe with stipe api key


//placing userorder from frontend 
const placeOrder =async (req,res) =>{
    const frontend_url = "http://localhost:5173"  //to connect with the frontend  
    try {
        const newOrder = new orderModel({ //creating the neworder with userId,items,amount,address
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
             
        })
        
        await newOrder.save(); //saving the order
   //     await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}}); //updating the cart and emptying the cart after successful saving
        //creating the line items for the strip
        const line_items = req.body.items.map((item)=>({ //taking the items from the user and travsering through the each item
            price_data:{ //creating the price method
                currency:"inr", //price mode India
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100 //amount for each item
            },
            quantity:item.quantity //quanity of the items
              
        }))
        //pushing the delivery charges into the line item
         line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:40*100
            },
            quantity:1
         })
         //creating the stripe session 
         const session  = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:"payment",
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
         })
         res.json({success:true,session_url:session.url}) //this is sending to the frontend that is placeOrder.jsx
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
        
    }

}



//function to verify the order
const verifyOrder = async (req,res) =>{
    const {orderId,success}  =  req.body; //getting the success and orderId from the queryParams from the browserUrl bar
    

    try {
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true}); //if payment is success then payment status is true
             // Empty the cart only after successful payment
             const order = await orderModel.findById(orderId);
             await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
            res.json({success:true,message:"Payment Successful, Order Confirmed"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Payment Failed, Order Canceled"});
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error verifying order." })
    }

}

//user order for frontend
const userOrders = async (req,res)=>{ //order for the user that user placed and the orders are arranged in the descending order and payment is verified only
 
    try {
        const orders = await orderModel.find({userId:req.body.userId ,payment:true }).sort({ createdAt: -1 });
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

}



//list orders for admin panel
const listOrders = async (req,res) =>{ //finding the all orders with payment status is true and the orders are in the descending orders
    try {
        const orders = await orderModel.find({payment:true}).sort({ createdAt: -1 });
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }

}




//api for updating order status
const updateStatus = async (req,res) =>{ 

    try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status}) //updating the status based on the data that gets from the adminpanel order.jsx
    res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
        
    }
}


//order delivered notifications
const updateDeliveryNotifications = async (req,res) =>{
    const {orderId} = req.body;  //getting the orderId from the user 
    try {
        await orderModel.findByIdAndUpdate(orderId,{notified:true}); //change the status to the notified value to true when it is notifed
        res.json({success:true,message:"Notification status updated"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating notification status." });
    
    }

}

// deleting the failed orders
const deleteFailedOrders = async (req,res) =>{
    try {
        const now =  Date.now(); //creating the current time with variable now 
        const fiveMinutes  =  new Date(now - 5 * 60 * 1000); //This subtracts 5 minutes (5 * 60 seconds * 1000 milliseconds) from the current time (now), creating a timestamp for five minutes ago.
         const failedOrders  = await orderModel.deleteMany({ //deleting the failed orders
            payment:{$ne:true},
            createdAt:{$lt:fiveMinutes} // Orders created more than five minutes ago
        })
        
    } catch (error) {
        console.error("Error cleaning up cancelled orders:", error);
    }

}
//checking for every
const cleanUp = 60*1000;
setInterval(deleteFailedOrders,cleanUp);


export  {placeOrder,verifyOrder,userOrders,listOrders,updateStatus,updateDeliveryNotifications};