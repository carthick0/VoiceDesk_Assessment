import mongoose from "mongoose";

const knowledgeSchema=new mongoose.Schema({
    question:{type:String,required:true},
    answer:{type:String,required:true},
})

export default mongoose.model("Knowledge",knowledgeSchema);