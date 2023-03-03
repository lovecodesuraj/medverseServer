import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import questionsRoutes from "./routes/questions.js"
import authRoutes from "./routes/users.js";


import dotenv from "dotenv";
dotenv.config();

const app=express();

app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors())
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
       next();
 });

 
app.use("/questions",questionsRoutes);
app.use("/users",authRoutes);

app.get("/",(req,res)=>{
    res.send("server is running.");
})

const PORT = process.env.PORT || 5000 ; 

mongoose.connect(process.env.CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{app.listen(PORT , ()=>{console.log(`sever is running at port ${PORT}`)})})
.catch((err)=>{console.log(err)});

// mongoose.set('useFindAndModify', false);
// mongoose.set('strictQuery', true)