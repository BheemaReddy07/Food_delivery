import   mongoose   from "mongoose";


const foodSchema = new mongoose.Schema({  //creating the food item model
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:String,required:true},
    category:{type:String,required:true},
    rate:{type:Number,required:true}
})

const foodModel = mongoose.model.food || mongoose.model("food",foodSchema);

export default foodModel;