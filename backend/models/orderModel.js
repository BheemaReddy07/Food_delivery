import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({  //creating the order schema
    userId:{type:String,required:true},
    items:{type:Array,required:true},
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String,default:"Food Processing"},
    notified:{type:Boolean,default:"false"},
    date:{type:Date,default:Date.now},
    payment:{type:Boolean,default:false}
}, { timestamps: true })   //creates a timestamp on creating the order,useful when we want to get the latest orders 1st

const orderModel = mongoose.models.order || mongoose.model("order",orderSchema);


export default orderModel;