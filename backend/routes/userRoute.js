import express from "express"; //used to connect to frontend and backend
import { loginUser, requestOTP, verifyOTPAndRegister,requestForgetPasswordOTP,resetPassword, adminLoginCheck } from "../controllers/userController.js";
import multer from "multer"; //for the image storage management


const userRouter = express.Router(); //creating the userRouter


//creating the storage for the image saving 
const storage = multer.diskStorage({
    destination : "uploads/profile", //destination where this images is stored
    filename: (req, file, cb) => {  //how the file would be saved
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({
    storage:storage,
    limits:1024 * 1024 * 3, // 3 mb file
})


userRouter.post("/register/request-otp",upload.single('profileImage'),requestOTP); //requsting otp during resgistration
userRouter.post("/register/verify-otp", verifyOTPAndRegister); //verifying the otp during registration
userRouter.post("/login", loginUser); //userLogin
userRouter.post("/forgot/request-otp",requestForgetPasswordOTP); //requesting otp in forgot mode
userRouter.post("/forgot/reset",resetPassword); //resetting the password
userRouter.post("/adminlogin",adminLoginCheck); //adminLogin call
export default userRouter; //exporting the userRouter to server.js
