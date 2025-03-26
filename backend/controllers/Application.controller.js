// Application Controllers:
import { asyncHandler } from "../utils/asyncHandler.js";
import {Application} from "../models/Application.model.js"
import { ApiResponse } from "../utils/Apiresponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Job } from "../models/Job.model.js";

// applyForJob - Handles POST /jobs/:id/applications (job application)

const applyForJob=asyncHandler(async(req , res)=>{
    const  object=req.body
    const userId=req.user._id
    const jobId=req.params.id
    if(req.user.type=="applicant")
    {const application =new Application({
        userId:userId,
        jobId:jobId,
        sop:object.sop
    })
    await application.save()
    .then(new ApiResponse(200,application,"applied successfully"))
    .catch(new ApiError(404,"application failed retry"))}
    else {
        throw new ApiError(404," you can not apply for this ")
    }
})

// getJobApplications - Handles GET /jobs/:id/applications (gets applications for a job)
const getJobApplications=asyncHandler(async(req,res)=>{
          const applications = await Application.find({
            jobId: req.params.id,
           
          }) // todo    
})


// getUserApplications - Handles GET /applications (gets user's applications)

const getUserApplications=asyncHandler(async(req,res)=>{
    const userId=req.user._id
    const applications=Job.find(userId)
    return res.status.json(
     new ApiResponse(200,applications,"success full get all the application")   
    )

})

// updateApplication - Handles PUT /applications/:id (updates application status)

const updateApplication =asyncHandler(async(req,res)=>{
    const applicationId=req.params.id
    const object=req.body
    await Application.findByIdAndUpdate(
        applicationId,
        ...object,
        {
            new :true
        }
    )
})


export {
    applyForJob,
    getJobApplications,
    getUserApplications,
    updateApplication
}