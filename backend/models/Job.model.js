import mongoose from "mongoose";

import mongoosePaginate from 'mongoose-paginate-v2';



const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"]
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true
    },
    requirements: {
      type: [String],
      required: [true, "Job requirements are required"],
      validate: {
        validator: function(v) {
          return v.length > 0;
        },
        message: "At least one requirement is required"
      }
    },
    maxApplicants: {
      type: Number,
      required: [true, "Maximum applicants is required"],
      min: [1, "Maximum applicants must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Maximum applicants must be an integer"
      }
    },
    maxPositions: {
      type: Number,
      required: [true, "Maximum positions is required"],
      min: [1, "Maximum positions must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Maximum positions must be an integer"
      }
    },
    activeApplications: {
      type: Number,
      default: 0,
      min: [0, "Active applications cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Active applications must be an integer"
      }
    },
    acceptedCandidates: {
      type: Number,
      default: 0,
      min: [0, "Accepted candidates cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Accepted candidates must be an integer"
      }
    },
    dateOfPosting: {
      type: Date,
      default: Date.now
    },
    deadline: {
      type: Date,
      required: [true, "Application deadline is required"],
      // validate: {
      //   validator: function(value) {
      //     return value > this.dateOfPosting;
      //   },
      //   message: "Deadline must be after the posting date"
      // }
    },
    skillsets: {
      type: [String],
      required: [true, "Skillsets are required"],
      validate: {
        validator: function(v) {
          return v.length > 0;
        },
        message: "At least one skillset is required"
      }
    },
    jobType: {
      type: String,
      required: [true, "Job type is required"],
      enum: {
        values: ["full-time", "part-time", "contract", "internship", "remote"],
        message: "Invalid job type"
      }
    },
    duration: {
      type: Number,
      min: [0, "Duration cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Duration must be an integer"
      }
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Salary must be an integer"
      }
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    rating: {
      type: Number,
      default: -1,
      min: [-1, "Rating cannot be less than -1"],
      max: [5, "Rating cannot exceed 5"]
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "closed"],
        message: "Invalid job status"
      },
      default: "active"
    }
  },
  { 
    timestamps: true,
    collation: { 
      locale: "en",
      strength: 2 // Case-insensitive sorting
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add index for better performance
jobSchema.index({ title: "text", description: "text" });
jobSchema.index({ userId: 1 });
jobSchema.index({ deadline: 1 });
jobSchema.index({ jobType: 1 });

// Virtual population of applications
jobSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId"
});


jobSchema.plugin(mongoosePaginate);

export const Job = mongoose.model("Job", jobSchema);