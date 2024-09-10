import  Mongoose  from "mongoose";

export const connectDB = async ()=>{
    await Mongoose.connect('mongodb+srv://Practicemongodb:Saaho123@cluster0.7uf6m.mongodb.net/food-del').then(()=>console.log("DB connected..."))
}