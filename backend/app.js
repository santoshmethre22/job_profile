import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
// app.use(express.static("public"))
app.use(cookieParser())


//routes import

// routers will be here


import userRouter from "./routers/user.router.js"
import jobRouter from "./routers/job.router.js"

app.use("/api/v1/user",userRouter)

app.use("/api/v1/job",jobRouter)


app.get("/",(req,res)=>{
    res.send("hello santosh")
})





export { app }