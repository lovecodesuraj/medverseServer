import express from "express";
import { getQuestions ,addAnswer,getQuestion,myQuestions,myAnsweredQuestions,addVote,getQuestionsBySearch, createQuestion ,updateQuestion ,deleteQuestion,likeQuestion} from "../controllers/questions.js";
const router =express.Router();
import {auth} from "../middleware/auth.js"


router.get("/",getQuestions);
router.get("/myQuestions/:_id",myQuestions);
router.get("/myAnsweredQuestions/:_id",myAnsweredQuestions);
router.get("/search",getQuestionsBySearch);
router.post("/",auth,createQuestion);
router.patch("/:id",auth,updateQuestion);
router.patch("/:id/likeQuestion",auth,likeQuestion);
router.delete("/:id",auth,deleteQuestion);
router.get("/:id",getQuestion)
router.patch("/addAnswer/:id",addAnswer);
router.patch("/addVote/:id",addVote);
router.delete("/delete/:id",deleteQuestion)


export default router;