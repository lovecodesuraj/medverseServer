import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    profile:{
        name:{type:String,required:true},
        picture:String,
        createdAt:String,
        activeStatus:String,
    },
    email:String,
    contact:[{}],
    password:{type:String,required:true},
    _id: { type: String, required: true },
    notifications:[],
    stats:{
        questions:[],
        answers:[],
        views:Number,
        reputation:Number,
    },
    about:String,
})

 var User=mongoose.model('User',userSchema);
 export default User;