import mongoose from "mongoose";

const questionSchema=mongoose.Schema({
    title :{
        type:String,
        default:""
    },
    question:{
        type:String,
        default:"",
    },
    files:[String],
    creator:String,
    createdAt:String,
    name:String,
    picture:String,
    answers:[{
        answer:String,
        files:[],
        picture:String,
        creator:String,
        createdAt:String,
        name:String,
    }],
    tags: [String],
    votes: [String],
});

 const Question = mongoose.model('Question',questionSchema);

 export default Question ;