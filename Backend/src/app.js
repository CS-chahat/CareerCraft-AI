const express=require("express")
const cookieParser=require("cookie-parser")
const cors = require("cors")
const app=express()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const interviewRouter=require("./routes/interview.routes")
const authRouter=require("./routes/auth.routes")
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)
module.exports=app
