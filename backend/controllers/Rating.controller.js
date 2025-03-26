// Rating Controllers:

import { asyncHandler } from "../utils/asyncHandler";

import { Recruiter } from "../models/Recuiter.model.js";
import { JobApplicant } from "../models/JobApplicant.model.js";

import { Rating } from "../models/Rating.model.js";

import {
  ApiResponse
}

from "../utils/Apiresponse.js"

import {ApiError} from "../utils/ApiError.js"

const addorUpdateRating=asyncHandler(async()=>{

  const {rating, applicantId, jobId }=req.body

  const catagory=req.user.type=="recruiter"?"applicant":"job"

  const receiverId= catagory=="applicant"?applicantId:jobId


  await Rating.findOneAndUpdate({
    senderId:req.user._id , receiverId,category
  },

  {
    rating
  }
  ,{
    new:true
  }


)
.then(new ApiResponse() )
.catch()


})


const getRating=asyncHandler(async()=>{
  
  try {
    const rating = await Rating.findOne({
      senderId: req.user._id,
      receiverId: req.query.id,
      category: req.user.type === "recruiter" ? "applicant" : "job",
    });
    res.json({ rating: rating?.rating || -1 });
  } catch (err) {
    res.status(400).json(err);
  }



})


// Add/update a rating
exports.addOrUpdateRating = async (req, res) => {
  try {
    const { rating, applicantId, jobId } = req.body;
    const category = req.user.type === "recruiter" ? "applicant" : "job";
    const receiverId = category === "applicant" ? applicantId : jobId;

    // Upsert rating
    await Rating.findOneAndUpdate(
      { senderId: req.user._id, receiverId, category },
      { rating },
      { upsert: true, new: true }
    );

    // Update average rating (for job/applicant)
    const avgResult = await Rating.aggregate([
      { $match: { receiverId: mongoose.Types.ObjectId(receiverId), category } },
      { $group: { _id: null, average: { $avg: "$rating" } } },
    ]);



    const avg = avgResult[0]?.average || 0;
    const model = category === "applicant" ? JobApplicant : Job;
    await model.updateOne(
      { _id: receiverId },
      { rating: avg }
    );

    res.json({ message: "Rating saved" });
  } catch (err) {
    res.status(400).json(err);
  }
};

// Get a user's rating


// addOrUpdateRating - Handles PUT /rating (adds/updates rating)

// getRating - Handles GET /rating (gets user's rating)