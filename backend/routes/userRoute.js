import express from "express";
import { loginUser, requestOTP, verifyOTPAndRegister,requestForgetPasswordOTP,resetPassword, adminLoginCheck } from "../controllers/userController.js";
import multer from "multer";


const userRouter = express.Router();



const storage = multer.diskStorage({
    destination : "uploads/profile",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({
    storage:storage,
    limits:1024 * 1024 * 3, // 3 mb file
})


userRouter.post("/register/request-otp",upload.single('profileImage'),requestOTP);
userRouter.post("/register/verify-otp", verifyOTPAndRegister);
userRouter.post("/login", loginUser);
userRouter.post("/forgot/request-otp",requestForgetPasswordOTP);
userRouter.post("/forgot/reset",resetPassword);
userRouter.post("/adminlogin",adminLoginCheck);
export default userRouter;
