import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv"
// import { objectID } from 'bson';
import { randomUUID } from 'crypto';
dotenv.config();


export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({email});
    // console.log(existingUser);
    if (!existingUser) return res.json({ message: "user not found." });
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.json({ message: "Invalid Credentials." });
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.SECRET, { expiresIn: "1h" });
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }

}
export const signup = async (req, res) => {
  const { email, picture, password, confirmPassword, firstName, lastName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    // console.log(existingUser);
    if (existingUser) return res.json({ message: "user already exists." });
    if (password != confirmPassword) return res.status(400).json({ message: "password do not match." });
    const hashedPassword = await bcrypt.hash(password, 12);
    // console.log(hashedPassword);
    const result = await User.create({
      profile: {
        name: `${firstName} ${lastName}`,
        picture,
        createdAt: new Date().toISOString(),
        activeStatus: new Date().toISOString(),
      },
      email,
      password: hashedPassword,
      _id: randomUUID(), 
    });
    const token = jwt.sign({ email: result.profile.email, id: result._id }, process.env.SECRET, { expiresIn: "1h" });
    res.status(200).json({ result, token });

  } catch (error) {
    console.log(error);
    res.json({ mesage: "something went wrong" });
  }

}
export const googleAuth = async (req, res) => {
  const { name, email, picture, sub } = req.body.result;
  const {token}=req.body;

  try {
    const existingUser = await User.findById(sub);
    if (existingUser) return res.status(200).json({result:existingUser,token});
    const result = await User.create({
      profile:{
        name,
        picture,
        createdAt: new Date().toISOString(),
        activeStatus: new Date().toISOString(),
      },
      email,
      password:"ilovecosmos",
      _id:sub,
    });

    res.status(200).json({result,token});


  } catch (error) {
    // console.log(error);
    res.status(400).json({ mesage: "something went wrong" });
  }

}
export const getUsersBySearch = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const search = new RegExp(searchQuery, 'i');
    const users = await User.find({ $or: [{ email: search }, { name: search }] });
    console.log(users.length);
    res.status(200).json(users);
  } catch (error) {
    //    res.json(404).json({message:"error.message"});
    res.json(404).json({ message: error.message });
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
}

export const getUser = async (req, res) => {
  const { id } = req.params;
  // console.log("id",id)
  try {
    const user = await User.findOne({_id:id});
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const editProfile=async(req,res)=>{
  const {_id}=req.params;
  const {picture,about}=req.body;
   try {
      const user=await User.findOneAndUpdate({_id:_id},{$set:{about:about,"profile.picture":picture}}, { new: true });
      res.status(200).json(user);      
   } catch (error) {
     console.log(error);
     res.json({message:"something went wrong."});   
   }
}