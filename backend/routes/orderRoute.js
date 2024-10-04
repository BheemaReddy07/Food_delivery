import express from "express";
import authMiddleware from "../middleware/auth.js";

import { listOrders, placeOrder, updateDeliveryNotifications, updateStatus, userOrders, verifyOrder } from "../controllers/orderController.js";

const orderRouter = express.Router(); //creating the orderROuter


orderRouter.post("/place",authMiddleware,placeOrder); //router for plcaing the order
orderRouter.post("/verify",verifyOrder) //router for verifying the order
orderRouter.post("/userorders",authMiddleware,userOrders) //router to fetch the userOrders
orderRouter.get("/list",listOrders) //router to fetch the orders list
orderRouter.post("/status",updateStatus) //router to update the order status
orderRouter.post("/notify",updateDeliveryNotifications) //router to manage the notificaton of delivery notification
export default orderRouter; //exporting the orderRouter to server.js