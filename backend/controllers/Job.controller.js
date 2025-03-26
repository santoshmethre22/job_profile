// Job Controllers:
// addJob - Handles POST /jobs (adds new job)

import {Job} from "../models/Job.model.js"

import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import {ApiResponse} from "../utils/Apiresponse.js"

const addJobs=asyncHandler(async(req ,res)=>{
    if(req.user.type!="recruiter"){
        throw new ApiError(404,"you are not recruiter to add the job ");
    }
    const jobObject=req.body;
    if(!jobObject){
        throw new ApiError(404,"all the fields are required ")
    }
    const job=new Job({userId:req.user._id,...req.body})
    await job.save()
    .then(res.status(200).json(
        res.status(200).json(ApiResponse(200,job,"the job is created succcessfully"))
    ))
 })


 // getAllJobs - Handles GET /jobs (gets all jobs with filters)

 const getAllJobs=asyncHandler(async (req,res)=>{

    const allJobs =await Job.findAll()

    res.status(200).json(new ApiResponse(200,allJobs,"all the job fetched successfully"))

 })



 // getJobById - Handles GET /jobs/:id (gets single job)


 const getJobById=asyncHandler(async(req,res)=>{

    const {jobId}=req.params.id

    const job=await Job.findById(jobId);

    if(!job){
        throw new ApiError(404,"job is not found");
    }

    return res.status(200).json(
        new ApiResponse(200,job,"the job is fetch successfully")
    )


 })



 
// updateJob - Handles PUT /jobs/:id (updates job)

const updateJob=asyncHandler(async(req,res)=>{

    const {jobId}=req.params.id
    const user=req.user

    const updateObject=req.body

    if(user.type!=="recruiter")
    {

        throw new ApiError(404,"recruiter only can add update the job")
    }


    // if(user._id!=jobId){
    //     throw new ApiError(404,"you can not edit the this as ")
    // }



    const updated=await Job.findByIdAndUpdate({jobId,user},...updateObject,{
        new:true
    })// here is the error i guess-->6
    console.log(updated)
    if(!updated){
        throw 
    }
    return res.status(200).json(updated);
})


// Delete a job (Recruiter only)
/// TODO :CHECH HERE ----->
exports.deleteJob = async (req, res) => {
    try {
      const job = await Job.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
      });
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.json({ message: "Job deleted successfully" });
    } catch (err) {
      res.status(400).json(err);
    }
  };