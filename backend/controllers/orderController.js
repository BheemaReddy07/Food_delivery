import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


//placing userorder from frontend 
const placeOrder =async (req,res) =>{
    const frontend_url = "http://192.168.244.22:5173"
    try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
             
        })
        
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
            },
            quantity:item.quantity
              
        }))
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

         const session  = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:"payment",
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
         })
         res.json({success:true,session_url:session.url})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
        
    }

}




const verifyOrder = async (req,res) =>{
    const {orderId,success}  =  req.body;
    console.log("Order ID:", orderId);
    console.log("Payment Success:", success);

    try {
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
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
const userOrders = async (req,res)=>{
 
    try {
        const orders = await orderModel.find({userId:req.body.userId ,payment:true }).sort({ createdAt: -1 });
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

}



//list orders for admin panel
const listOrders = async (req,res) =>{
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
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
        
    }
}


//order delivered notifications
const updateDeliveryNotifications = async (req,res) =>{
    const {orderId} = req.body;
    try {
        await orderModel.findByIdAndUpdate(orderId,{notified:true});
        res.json({success:true,message:"Notification status updated"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating notification status." });
    
    }

}

// deleting the failed orders
const deleteFailedOrders = async (req,res) =>{
    try {
        const now =  Date.now();
        const fiveMinutes  =  new Date(now - 5 * 60 * 1000);
         const failedOrders  = await orderModel.deleteMany({
            payment:{$ne:true},
            createdAt:{$lt:fiveMinutes}
        })
        
    } catch (error) {
        console.error("Error cleaning up cancelled orders:", error);
    }

}

const cleanUp = 60*1000;
setInterval(deleteFailedOrders,cleanUp);


export  {placeOrder,verifyOrder,userOrders,listOrders,updateStatus,updateDeliveryNotifications};