import Question from "../models/question.js"
import User from "../models/user.js"
import mongoose from "mongoose";

export const getQuestions = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Question.countDocuments({});
    const questions = await Question.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
    const numberOfPages = Math.ceil(total / LIMIT);
    // console.log(numberOfPages)
    res.status(200).json({ data: questions, currentPage: Number(page) || 1, numberOfPages });

  } catch (err) {
    res.status(404).json({ mesage: err.message });
  }
}

export const addAnswer = async (req, res) => {
  const { id } = req.params;
  const { answer, creator } = req.body;
  const userId=(creator.sub || creator._id);
  try {
    const question = await Question.findById(id);
    const response = await Question.findOneAndUpdate({ _id: id },
      {
        $set: {
          answers: [...question.answers,
          {
            answer: answer.answer,
            files: answer.files,
            creator: userId,
            name: creator.name,
            picture:creator.picture,
            createdAt: new Date().toISOString()
          }]
        }
      },
      { new: true });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
}
export const addVote = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  console.log(req.body);

  try {
    const question = await Question.findById(id);
    if (question.votes.find(vote => vote === userId)) {
      const response = await Question.findOneAndUpdate({ _id: id }, { $set: { votes: question.votes.filter(vote => vote !== userId) } }, { new: true });
      res.json(response);
    } else {
      const response = await Question.findOneAndUpdate({ _id: id }, { $set: { votes: [...question.votes, userId] } }, { new: true });
      res.json(response);
    }

  } catch (error) {
    console.log(error);
  }
}
export const getQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findById(id);
    res.status(200).json(question);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}



export const getQuestionsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  try {
    const search = new RegExp(searchQuery, 'i');
    const questions = await Question.find({ $or: [{ title: search }, { name: search }, { tags: { $in: tags.split(',') } }] });
    res.json({ data: questions });
  } catch (error) {
    res.json(404).json({ message: "error.message" });
  }
}

export const createQuestion = async (req, res) => {
  const body = req.body;
  const newQuestion = new Question({
    title: body.title,
    question: body.question,
    files: body.files,
    creator: req.userId,
    name: body.name,
    picture: body.picture,
    answers: [],
    createdAt: new Date().toISOString(),
    tags: body.tags,
    votes: [],
  });
  try {
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
}

export const updateQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const question = req.body;
  // if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(_id, question, { new: true })
    res.json(updatedQuestion);
  } catch (err) {
    console.log(err);
  }

}

export const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    await Question.findByIdAndRemove(id);
    res.json({ message: "question deleted successfully" });
  } catch (err) {
    console.log(err);
  }
}

export const likeQuestion = async (req, res) => {
  const { id } = req.params;
  if (!req.userId) return res.status(200).json({ message: "Unauthenticated" });
  const question = await Question.findById(id);
  const index = question.votes.findIndex((id) => id === String(req.userId));
  if (index === -1) {
    question.votes.push(req.userId);
  } else {
    question.votes = question.votes.filter((id) => id !== String(req.userId));
  }
  const updatedQuestion = await Question.findByIdAndUpdate(id, question, { new: true });
  res.json(updateQuestion);
}



export const myQuestions=async(req,res)=>{
  const {_id} =req.params;
  try {
    const questions=await Question.find({creator:_id});
    res.status(200).json(questions);; 

  } catch (error) {
    console.log(error);
    res.status(500).json({message:"something went wrong."});
  }
}

export const myAnsweredQuestions=async(req,res)=>{
  const {_id} =req.params;
  try {
    const questions=await Question.find({"answers.creator":_id});
    res.status(200).json(questions);
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"something went wrong."});
  }
}