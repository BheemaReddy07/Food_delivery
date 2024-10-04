import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt, { genSalt } from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer"; //it used to send the email

// Function to create JWT token
const createToken = (id, name, profileImage, email) => {
  //creating the token that contains the id,name ,profileImage and email
  return jwt.sign({ id, name, profileImage, email }, process.env.JWT_SECRET);
};
//Function to create the Admin JWT token
const createAdminToken = (id) => {
  //creting the admin token with the jusst id
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
// Function to generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); //it generates a 6 digit numerical number
};

// Function to send OTP email
const sendOTPEmail = async (email, otp, name) => {
  const transporter = nodemailer.createTransport({
    //creatng the transport
    service: "Gmail", //choosing gmail as a service
    auth: {
      //providing the credentials ,that are stored in the .env file
      user: process.env.USER_EMAIL,
      pass: process.env.USER_APPCODE,
    },
  });
  //providing the details
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Your OTP code",
    text: `Hi ${name}!! Greetings from the dineNow ,here is Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions); //sending the email
};

// Request OTP for registration
const requestOTP = async (req, res) => {
  //creating the api call
  const { email, name, password } = req.body; //taking the email,name,password from the user ,they are sending through the axios
  const profileImage = req.file ? req.file.filename : ""; //taking the profileimage from the user if he uploads .
  try {
    // Validate email format
    if (!validator.isEmail(email)) {
      //validator is used to validate the things
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Check if the user already exists
    const user = await userModel.findOne({ email });
    if (user && user.verified) {
      //checking if email is available and email status is verified or not
      return res.json({ success: false, message: "User already exists" });
    }
    if (user && !user.verified) {
      //if user is available and    not verified then
      try {
        const otp = generateOTP(); //creating the otp
        const otpExpiration = Date.now() + 3 * 60 * 1000; //otp will expire after 3 mins from the creation time
        user.otp = otp;   //assigning the otp to user model.otp  that is created just now
        user.otpExpiration = otpExpiration; //assignning the otpexpiration time to the useModel
        await user.save(); //saving the userModel
        await sendOTPEmail(email, otp, name); //calling the function to send the otp to the email .
        return res.json({ success: true, message: "new OTP sent to mail..." }); //returning the response
      } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "error in sending OTP" });
      }
    }

    // Generate OTP and store it temporarily
    const otp = generateOTP();
    const otpExpiration = Date.now() + 3 * 60 * 1000; // 3 minutes expiry time

    // Create a temporary user record with OTP
    const tempUser = new userModel({
      name,
      email: req.body.email,
      password, // We'll hash it later during registration
      otp,
      otpExpiration,
      verified: false,
      profileImage,
    });

    await tempUser.save();
    await sendOTPEmail(email, otp, name);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error sending OTP" });
  }
};

// Verify OTP and register user
const verifyOTPAndRegister = async (req, res) => {
  const { email, otp, name, password, repassword } = req.body;  //taking the email,otp,name,password,repassword from the user through the axios

  try {
    const user = await userModel.findOne({ email });  //finds the user is available or not
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }  
    if (user.otp !== otp || Date.now() > user.otpExpiration) {   //checks the user entered otp and expiration time 
      return res.json({ success: false, message: "Invalid or expired OTP" });
    } 
    if (password !== repassword) {  //checks the password and repassword matches or not
      return res.json({ success: false, message: "Passwords do not match" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);   //uses to encrypt the password into hashed format
    const hashedPassword = await bcrypt.hash(password, salt);
    const profileImage = user.profileImage;
    // Update user with hashed password and clear OTP
    await userModel.findByIdAndUpdate(user._id, {  //after hasing the password we find the user id and updates the values of password and otp and otp expiration
      name,
      password: hashedPassword,
      otp: null,
      otpExpiration: null,
      verified: true,
      profileImage: profileImage,
    });

    // Create a token and respond
    const token = createToken(   
      user._id,
      user.name,
      user.profileImage,
      user.email
    );
    res.json({ success: true, token, message: "Registration successful" });
  } catch (error) {
    console.error("Error verifying OTP!!:", error);
    res.json({ success: false, message: "Error verifying OTP!!!" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;  //taking the email and password through axios
  try {
    const user = await userModel.findOne({ email });   //checks whether the email is available or  not 
    if (!user) {  //if email is not availble then
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);  //checking the user entered password with the password that is stored in the database in hashed format,using the bcrypt to decrypt
    if (!isMatch) { //if they are not matched returns invalid
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = createToken( //if login credentials are true ,then it creates the token with the id,name,profile,email
      user._id,
      user.name,
      user.profileImage,
      user.email
    );
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error logging in" });
  }
};

//requwst forgot password otp
const requestForgetPasswordOTP = async (req, res) => {
  const { name, email, password, repassword } = req.body;  //taking the name,email,password and repassword from the user through the axios
  try {
    const user = await userModel.findOne({ email }); //checks the email is available or not in the database
    const now = Date.now(); //creating the current date 
    if (!user) { //if user is not found
      return res.json({ success: false, message: "no user existed" });
    }

    if ( //if otp count is greater than 3 with in the timespan of 3 minutes
      user.otpRequestCount >= 3 &&
      now - user.lastOtpRequest <= 5 * 60 * 1000
    ) {
      return res.json({
        success: false,
        message: "Too Many OTP requests .please try again some times",
      });
    }
    if (now - user.lastOtpRequest >= 5 * 60 * 1000) { //if time exceeds the more than 5 mins ,then otpcount sets to 0
      user.otpRequestCount = 0;
    }
    if (password !== repassword) { //checks if entered password and repassword same or not
      return res.json({
        success: false,
        message: "password not matching with repassword",
      });
    }

    const otp = generateOTP(); //generating the otp
    user.otp = otp; //assign the generated otp to the database usermode
    user.otpExpiration = Date.now() + 3 * 60 * 1000; //adding 3 mins to the expiration time
    user.otpRequestCount += 1; //incrementing the request count
    user.lastOtpRequest = now;
    await user.save(); //saving the user model

    await sendOTPEmail(email, otp, name); //send the otp to the email

    res.json({ success: true, message: "otp sent successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

//function to reset the password
const resetPassword = async (req, res) => {
  const { email, password, repassword, otp } = req.body; //taking the email and password and repasswird and otp from the user
  try {
    const user = await userModel.findOne({ email }); //finds the user
    if (!user) {
      return res.json({ success: false, message: "no user found" });
    }

    if (password !== repassword) {
      return res.json({
        success: false,
        message: "password not matching with repassword",
      });
    }
    if (user.otp !== otp || Date.now() > user.otpExpiration) { //checks if user entered otp and  otp in the database matches or not
      console.log("Invalid or expired OTP");
      return res.json({ success: false, message: "invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10); //encrypting the password
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiration = null;

    await user.save(); //saving the user

    res.json({ success: true, message: "password reset successfully!!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};
//function to clean the user that are saved in the database but they are not verified through the email
const cleanupExpiredUsers = async (req, res) => {
  try {
    const now = Date.now(); //creating the now variable with present time
    const expiredUser = await userModel.find({ //find the expired users that otp not equals to null and otpexpiration less than now
      otp: { $ne: null },
      otpExpiration: { $lt: now },
    });
    if (expiredUser.length > 0) { //if there are any expireduuser then delete that user
      await userModel.deleteMany({
        otp: { $ne: null },
        otpExpiration: { $lt: now },
      });
    }
  } catch (error) {
    console.error("Error cleaning up expired users:", error);
  }
};

//creating an intervel to check for every five mins
const HOUR = 5 * 60 * 1000;
setInterval(cleanupExpiredUsers, HOUR);

//admin login check

const adminLoginCheck = async (req, res) => {
  const { email, password } = req.body; //taking the email and password 
  try {
    if ( //checks whether email and password matches or not 
      process.env.ADMIN_EMAIL === email && 
      process.env.ADMIN_PASSWORD === password
    ) { //if they match create the admin  token with the email
      const adminToken = createAdminToken(email); // Using admin email as ID
      res.json({ success: true, adminToken, message: "Login successful" });
    } else {
      res.json({ success: false, message: "Login failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Login failed" });
  }
};

export {
  loginUser,
  requestOTP,
  verifyOTPAndRegister,
  requestForgetPasswordOTP,
  resetPassword,
  adminLoginCheck,
};
