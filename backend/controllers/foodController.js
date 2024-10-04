import foodModel from "../models/foodModel.js";
import fs from 'fs'; //import the file system

//add food item ,,admin oane
const addFood = async (req,res)=>{ //functon to the add food into the database
    let image_filename = req.file.filename; //image filename

    const food = new foodModel({  //creating the new foodModel
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename,
        rate:req.body.rate
    })
    try{
        await food.save(); //saving the foodModel
        res.json({success:true,message:"Food Added"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"error"})

    }

}
// all food list
const listFood = async (req,res) =>{
            try{ //finding the all foodd items
                const foods = await foodModel.find({})
                res.json({success:true,data:foods})
            }
            catch(error){
                console.log(error);
                res.json({success:false,message:error})
            }

}
// remove food item
const removeFood = async (req,res) =>{
    try {
        const food =await foodModel.findById(req.body.id); //finding the particular foodItem
        fs.unlink(`uploads/${food.image}`,()=>{})  //unlinking the fooditem

        await foodModel.findByIdAndDelete(req.body.id); //finding the foodItem with the id and deleting the foodItem
        res.json({success:true,message:"food removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:'error'})
        
    }

}
export {addFood,listFood,removeFood}