
import mongoose from "mongoose"

const RatingSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["job", "applicant"],
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      // add refrance
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      // add refrance 
      required: true,
    },
    rating: {
      type: Number,
      max: 5.0,
      default: -1.0,
      validate: {
        validator: function (v) {
          return v >= -1.0 && v <= 5.0;
        },
        msg: "Invalid rating",
      },
    },
  },
  { 
    timestamps:true,
    collation: { locale: "en" } 
  }
);

RatingSchema.index({ category: 1, receiverId: 1, senderId: 1 }, { unique: true });


export const Rating = mongoose.model("Rating", RatingSchema);
