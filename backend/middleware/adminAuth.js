import jwt from "jsonwebtoken"

const adminAuthMiddleware = async (req,res,next) =>{
   const {adminToken} = req.headers;
   if(!adminToken){
    return res.json({success:false,message:"Not Authorized Login again"})
   }
   try {
    const adminToken_decode = jwt.verify(adminToken,process.env.JWT_SECRET);
    req.body.userID = adminToken_decode.id;
    next();
   } catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"})
   }
}

export default adminAuthMiddleware;