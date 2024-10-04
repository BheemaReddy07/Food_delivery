import express from "express"
import { addToCart,removeFromCart,getCart } from "../controllers/cartController.js"
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();



cartRouter.post("/add",authMiddleware,addToCart) //router to add the food item into the cart
cartRouter.post("/remove",authMiddleware,removeFromCart) //router to remove the food item from the cart
cartRouter.post("/get",authMiddleware,getCart) //router to get list of items from the cart 

export default cartRouter; //router is exported to server.js