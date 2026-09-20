import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    instructor: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
