import express from "express";

import { addFood,listFood, removeFood } from "../controllers/foodController.js";

import multer from "multer"
import adminAuthMiddleware from "../middleware/adminAuth.js";

const foodRouter = express.Router();

//Image storage engine


const storage = multer.diskStorage({
    destination:"uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
    
})

const upload = multer({storage:storage})
foodRouter.post("/add",upload.single("image") ,addFood) //router to route the add the foodItem from the admin panel
foodRouter.get("/list" ,listFood) //router to fetch the list of food items in the admin panel
foodRouter.post("/remove" ,removeFood) //router to remove the food item from the admin panel

export default foodRouter; //exporting the foodRouter to server.js