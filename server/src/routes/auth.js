import { Router } from "express";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function signToken(studentId) {
  return jwt.sign({ studentId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await Student.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const student = await Student.create({ name, email, password });
    const token = signToken(student._id);
    res.status(201).json({ token, student });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student || !(await student.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(student._id);
    res.json({ token, student });
  } catch (err) {
    res.status(500).json({ message: "Signin failed", error: err.message });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  const student = await Student.findById(req.studentId);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json({ student });
});

export default router;
