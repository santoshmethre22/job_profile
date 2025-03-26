import mongoose from "mongoose";

const recruiterSchema=mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    name:{
        type:String,
        require:true,

    }
    ,
    company:{

        type:String,
        require:true

    },
    bio:{

        type:String,

    }
},
{

    timestamps: true,
    collation: { locale: "en" },

})


export const Recruiter=mongoose.model("Recruiter",recruiterSchema)
