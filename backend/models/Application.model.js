import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
     
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "accepted", "rejected", "deleted", "cancelled", "finished"],
      default: "applied",
      required: true
    },
    dateOfApplication: {
      type: Date,
      default: Date.now
    },
    dateOfJoining: {
      type: Date,
      validate: {
        validator: function(value) {
          return !value || this.dateOfApplication <= value;
        },
        message: "Joining date must be after application date"
      }
    },
    sop: {
      type: String,
      validate: {
        validator: function(v) {
          return v.split(/\s+/).length <= 250;
        },
        message: "Statement of purpose cannot exceed 250 words"
      }
    }
  },
  { 
    timestamps: true,
    collation: { locale: "en", strength: 2 },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual population
ApplicationSchema.virtual("applicant", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true
});

ApplicationSchema.virtual("recruiter", {
  ref: "Recruiter",/// here may be the error
  localField: "recruiterId",
  foreignField: "userId",
  justOne: true
});



ApplicationSchema.virtual("job", {
  ref: "Job",
  localField: "jobId",
  foreignField: "_id",
  justOne: true
});

ApplicationSchema.plugin(mongoosePaginate);

export const Application = mongoose.model("Application", ApplicationSchema);


{/* 

  Mongoose Virtuals: A Beginner's Guide
What is Mongoose?
Mongoose is an ODM (Object Data Modeling) library for MongoDB in Node.js. It helps you interact with MongoDB easily by defining schemas and using built-in query methods.

What are Virtuals in Mongoose?
Virtuals are properties that are not stored in the database.

They are dynamically computed based on other fields in the schema.

Used for computed values or populating referenced documents.

1️⃣ Simple Example: Using Virtuals for Computed Properties
🔹 Suppose you have a User model with firstName and lastName. You want to create a fullName property dynamically.

Step 1: Install Mongoose
If you haven’t installed Mongoose, do it using:


Step 2: Create a Mongoose Schema

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
});

// Virtual property for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Convert virtuals to JSON output
userSchema.set("toJSON", { virtuals: true });

const User = mongoose.model("User", userSchema);

// Create a user instance
const user = new User({ firstName: "John", lastName: "Doe" });

console.log(user.fullName); // Output: "John Doe"

How It Works
userSchema.virtual("fullName") creates a new property that is computed based on firstName and lastName.

It is not stored in the database, but it exists when you access user.fullName.


2️⃣ Virtuals for Referencing Other Collections (Populate)
🔹 Suppose you have an Application model that references a Recruiter model.
You can use virtuals to link the recruiter without storing duplicate data.

Step 1: Define Recruiter Schema

const recruiterSchema = new mongoose.Schema({
  name: String,
  company: String
});

const Recruiter = mongoose.model("Recruiter", recruiterSchema);
Step 2: Define Application Schema with a Virtual Field

const applicationSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter"  // Reference to Recruiter Model
  },
  jobTitle: String,
  applicantName: String
});

// Virtual field for populating recruiter details
applicationSchema.virtual("recruiter", {
  ref: "Recruiter",
  localField: "recruiterId",
  foreignField: "_id",
  justOne: true
});

// Ensure virtuals are included in JSON output
applicationSchema.set("toJSON", { virtuals: true });

const Application = mongoose.model("Application", applicationSchema);
Step 3: Populate Virtuals in Query
async function getApplications() {
  const applications = await Application.find().populate("recruiter");
  console.log(applications);
}
How It Works
recruiterId stores only the ID of the recruiter.

The virtual field recruiter fetches the full recruiter details dynamically using populate().



  */}