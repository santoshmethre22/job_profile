
// User Controllers:

import {User} from "../models/User.models.js"
import {asyncHandler} from  "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/Apiresponse.js"
import { Recruiter } from "../models/Recuiter.model.js"
import { JobApplicant } from "../models/JobApplicant.model.js"

const generateAccessTokenAndRefreshToken=async(userId)=>{ 
    try {
        
        const user=await User.findById(user)

        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();


        user.refreshToken=refreshToken;

        await user.save({
            validateBeforeSave: false
        })


        return {
            accessToken,
            refreshToken
        }

    } catch (error) {

            throw new ApriError(500,"somthing went wrong while generating access and refresh token")
        
    }
}


// register =----

const register=asyncHandler(async(req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName,email,username,password}=req.body();
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }
    const existedUser=User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"the user is already exist please login ")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    console.log("cover image",coverImage);
    console.log("avatar Image",avatar);

    if (!avatar||!coverImage) {
        throw new ApiError(400, "Avatar file is required")
    }
    const user =await User.create({

        fullName,
        avatar:avatar.url,
        coverImage:coverImage.url,
        email,
        password,
        username:username.toLowerCase()

    })
    const createUser=await User.findById(user._id).select("-password -refreshToken");

    if(!createUser){
        throw new ApiError(400, "createUser is not find here")
    }
 
return res.status.json(
    new ApiResponse(200,createUser," the user is register successfully---->")
) 


})


// login --->



const login=asyncHandler(async(req,res)=>{

    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie


    const {email, username, password} = req.body
    console.log(email);


    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }



    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"user does not exist")
    }


    const isPasswordValid=await user.isPasswordCorrect(password)


    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }

    const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id);

    const loggedInuser=await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true

    }

    return res.
    status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInuser,
                accessToken,
                refreshToken
            }
        )
    )

})



// logout user ------------>

const logoutUser=asyncHandler(async(req,res)=>{


    await User.findByIdAndUpdate( 
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }

        },
        {
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User logged Out")
    )


})



// refreshToken 

//const refreshAccessToken=asyncHandler(asyncy)






// getUserProfile current user  - Handles GET /user (gets current user profile)
const getUserProfile = async (req, res) => {
    try {
      const user = req.user.type === "recruiter"
        ? await Recruiter.findOne({userId: req.user._id})
        : await JobApplicant.findOne({ userId: req.user._id });
      res.status(200).json(new ApiResponse(200,user,"the user pofile "));
    } catch (err) {
      throw new ApiError(400,err,"error whiile getting current user  profile") ;
    }
  };


// getUserBy job Id - Handles GET /user/:id (gets user by ID)


const getUserById=asyncHandler(async(req,res)=>{

    const userId=req.params._id

    const user=await User.findById(userId);

    const userof=(user.type=="recruiter")?
         await Recruiter.findOne(user._id):
        await JobApplicant.findOne(user._id)


        if(!user){
            throw new ApiError(403,"failed in getting user from id ")
        }


        return res.status(200).json(

            new ApiResponse(200,userof," the data fetched success fully")
        )

    }

   
)




// updateUserProfile - Handles PUT /user (updates user profile)

const updateUserProfile=asyncHandler(async(req,res)=>{
    const model=(req.user.type=="recruiter")?Recruiter:JobApplicant
    const newUser=model.findByIdAndUpdate(req.user._id,
        req.body,
        {new:true}
    );

    if(!newUser){
        throw new ApiError(402,"failed while updating the user")
    }

    return res.status(200).json(new ApiResponse(200,newUser,"the data updated successfully"))
})



// Applicant Controllers (for Recruiters):




// getApplicants - Handles GET /applicants (gets applicants for recruiter's jobs)



export {
    register,
    login,
    logoutUser,
    getUserProfile,
    getUserById,
    updateUserProfile
}






