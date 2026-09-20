import { Router } from "express";
import Course from "../models/Course.js";
import Student from "../models/Student.js";
import Resource from "../models/Resource.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// All available courses, flagged with whether the current student is enrolled
router.get("/", async (req, res) => {
  const [courses, student] = await Promise.all([
    Course.find().sort({ code: 1 }),
    Student.findById(req.studentId),
  ]);
  const enrolledIds = new Set(student.enrolledCourses.map((id) => id.toString()));
  res.json(
    courses.map((course) => ({
      ...course.toObject(),
      enrolled: enrolledIds.has(course._id.toString()),
    }))
  );
});

// Courses the current student is enrolled in
router.get("/mine", async (req, res) => {
  const student = await Student.findById(req.studentId).populate("enrolledCourses");
  res.json(student.enrolledCourses);
});

router.post("/:id/enroll", async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  await Student.findByIdAndUpdate(req.studentId, {
    $addToSet: { enrolledCourses: course._id },
  });
  res.status(200).json({ message: "Enrolled successfully" });
});

router.get("/:id/resources", async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const resources = await Resource.find({ course: course._id }).sort({ createdAt: 1 });
  res.json({ course, resources });
});

export default router;
