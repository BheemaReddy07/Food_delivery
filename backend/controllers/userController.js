import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt, { genSalt } from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";

// Function to create JWT token
const createToken = (id,name,profileImage,email) => {
    return jwt.sign({ id,name,profileImage,email }, process.env.JWT_SECRET);
};
//Function to create the Admin JWT token
const createAdminToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}
// Function to generate a random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP email
const sendOTPEmail = async (email, otp,name) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user:  process.env.USER_EMAIL,
            pass:  process.env.USER_APPCODE,
        },
    });

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: 'Your OTP code',
        text: `Hi ${name}!! Greetings from the dineNow ,here is Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};

// Request OTP for registration
const requestOTP = async (req, res) => {
    const { email, name, password } = req.body;
    const profileImage = req.file ? req.file.filename:"";
    try {
        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Check if the user already exists
        const user = await userModel.findOne({ email });
        if (user && user.verified) {
            return res.json({ success: false, message: "User already exists" });
        }
        if(user && !user.verified){
             try {
                const otp = generateOTP();
             const otpExpiration = Date.now() + 3*60*1000;
             user.otp = otp;
             user.otpExpiration = otpExpiration;
             await user.save();
             await sendOTPEmail(email,otp,name);
             return res.json({success:true,message:"new OTP sent to mail..."})
             } catch (error) {
                console.log(error);
               return res.json({success:false,message:"error in sending OTP"})
             }
        }

        // Generate OTP and store it temporarily
        const otp = generateOTP();
        const otpExpiration = Date.now() + 3 * 60 * 1000; // 3 minutes expiry time

        // Create a temporary user record with OTP
        const tempUser = new userModel({
            name,
            email:req.body.email,
            password, // We'll hash it later during registration
            otp,
            otpExpiration,
            verified:false,
            profileImage,
        });

        await tempUser.save();
        await sendOTPEmail(email, otp,name);

        res.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error sending OTP" });
    }
};

// Verify OTP and register user
const verifyOTPAndRegister = async (req, res) => {
    const { email, otp, name, password, repassword } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (user.otp !== otp || Date.now() > user.otpExpiration) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }
        if (password !== repassword) {
            return res.json({ success: false, message: "Passwords do not match" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const profileImage = user.profileImage;
        // Update user with hashed password and clear OTP
        await userModel.findByIdAndUpdate(user._id, {
            name,
            password: hashedPassword,
            otp:null,
            otpExpiration:null,
            verified:true,
            profileImage:profileImage,
           
        });

        // Create a token and respond
        const token = createToken(user._id,user.name,user.profileImage,user.email);
        res.json({ success: true, token, message: 'Registration successful' });
    } catch (error) {
        console.error("Error verifying OTP!!:", error);
        res.json({ success: false, message: 'Error verifying OTP!!!' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const token = createToken(user._id,user.name,user.profileImage,user.email);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error logging in" });
    }
};


//requwst forgot password otp
const requestForgetPasswordOTP = async (req,res) =>{
    const {name,email,password,repassword}=  req.body;
    try {
        const user = await userModel.findOne({email});
        const now = Date.now();
        if(!user){
             
            return res.json({success:false,message:"no user existed"});

        }
         
        if(user.otpRequestCount>=3 && now-user.lastOtpRequest <= 5 * 60 * 1000){
            return res.json({success:false,message:"Too Many OTP requests .please try again some times"})

        }
        if(now-user.lastOtpRequest>=5*60*1000){
                user.otpRequestCount=0;
        }
        if(password !== repassword){
            return res.json({success:false,message:"password not matching with repassword"});
        }

        const otp = generateOTP();
        console.log("otp is",otp)
        user.otp = otp;
        user.otpExpiration = Date.now() + 3 *60 *1000;
        user.otpRequestCount+=1;
        user.lastOtpRequest = now;
        await user.save();
        
        await sendOTPEmail(email,otp,name);
        
        res.json({success:true,message:"otp sent successfully"});
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
        
    }

}

 

const resetPassword = async (req,res) =>{
    const {email,password,repassword,otp} = req.body;
    try {
        const user =  await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"no user found"})
        }
         
        if(password !== repassword){
            return res.json({success:false,message:"password not matching with repassword"});
        }
        if(user.otp !== otp || Date.now()>user.otpExpiration){
            console.log("Invalid or expired OTP");
            return res.json({success:false,message:"invalid or expired OTP"});
        }
        
        const salt =  await bcrypt.genSalt(10);
        const hashedPassword =  await bcrypt.hash(password,salt);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiration = null;
        
        
        await user.save();
        
        res.json({success:true,message:"password reset successfully!!"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
        
    }
}

const cleanupExpiredUsers = async (req,res) =>{
    try {
        const now = Date.now();
        const expiredUser = await userModel.find({
            otp:{$ne:null},
            otpExpiration:{$lt:now},
        });
        if(expiredUser.length>0){
            await userModel.deleteMany({
                otp:{$ne:null},
            otpExpiration:{$lt:now},

            });
        }
        
    } catch (error) {
        console.error("Error cleaning up expired users:", error);
    }
}

const HOUR = 5 * 60 *1000;
setInterval(cleanupExpiredUsers,HOUR);

//admin login check


const adminLoginCheck = async (req, res) => {
    const { email, password } = req.body;
    try {
        if ( process.env.ADMIN_EMAIL === email && process.env.ADMIN_PASSWORD === password) {
            const adminToken = createAdminToken(email); // Using admin email as ID
            res.json({ success: true,  adminToken, message: 'Login successful' });
        } else {
            res.json({ success: false, message: 'Login failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Login failed' });
    }
};


export { loginUser, requestOTP, verifyOTPAndRegister,requestForgetPasswordOTP ,resetPassword ,adminLoginCheck };