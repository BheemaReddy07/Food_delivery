import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    otp: { type: String },
    otpExpiration: { type: Date },
    otpRequestCount:{type:Number,default:0},
    lastOtpRequest:{type:Date},
    verified:{type:Boolean,default:false},
    profileImage:{type:String,default:""},

}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;