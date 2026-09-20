import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["slides", "video", "document", "link"], default: "slides" },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);
