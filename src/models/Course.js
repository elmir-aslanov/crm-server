import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Programming",
        "Design",
        "Marketing",
        "Cybersecurity",
        "Analytics",
      ],
    },
    durationMonths: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    syllabus: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);