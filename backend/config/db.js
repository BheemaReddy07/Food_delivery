import  Mongoose  from "mongoose";

export const connectDB = async ()=>{
    await Mongoose.connect('mongodb+srv://Practicemongodb:<practicepassword>@cluster0.17uf6m.mongodb.net/foodd-del').then(()=>console.log("DB connected..."))
}