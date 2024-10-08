import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config.js'
import cartRouter from "./routes/cartRoute.js" 
import orderRouter from "./routes/orderRoute.js"



//app config
const app =  express()
const port = 4000

//middlwware
app.use(express.json())
app.use(cors())


//db connection
connectDB();


//api endpoint
app.use('/api/food',foodRouter)  //foodRouter api call
app.use('/profiles',express.static('uploads/profile/')) //profile photo management
app.use("/images",express.static('uploads')) 
app.use("/api/user",userRouter) //userRouter api call
app.use("/api/cart",cartRouter) //cartRouter api call
app.use("/api/order",orderRouter) //orderRouter api call 
app.get('/',(req,res)=>{
    res.send('API working...')

})

app.listen(port,()=>{
    console.log(`server  started on http://localhost:${port}`)
})

//mongodb+srv://Practicemongodb:<password>@cluster0.7uf6m.mongodb.net/?