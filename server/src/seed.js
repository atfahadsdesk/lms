import "dotenv/config";
import { connectDB } from "./config/db.js";
import Course from "./models/Course.js";
import Resource from "./models/Resource.js";
import mongoose from "mongoose";

const courses = [
  {
    code: "CS101",
    title: "Introduction to Programming",
    description: "Foundations of programming using JavaScript.",
    instructor: "Dr. Ada Lovelace",
  },
  {
    code: "CS201",
    title: "Data Structures & Algorithms",
    description: "Core data structures, algorithms, and complexity analysis.",
    instructor: "Dr. Alan Turing",
  },
  {
    code: "WEB301",
    title: "Full-Stack Web Development",
    description: "Building web applications with the MERN stack.",
    instructor: "Prof. Grace Hopper",
  },
];

const resourcesByCode = {
  CS101: [
    { title: "Lecture 1 Slides - Getting Started", type: "slides", url: "https://example.com/cs101/lecture1.pdf" },
    { title: "Lecture 2 Slides - Variables & Types", type: "slides", url: "https://example.com/cs101/lecture2.pdf" },
    { title: "Course Syllabus", type: "document", url: "https://example.com/cs101/syllabus.pdf" },
  ],
  CS201: [
    { title: "Lecture 1 Slides - Arrays & Lists", type: "slides", url: "https://example.com/cs201/lecture1.pdf" },
    { title: "Sorting Algorithms Video", type: "video", url: "https://example.com/cs201/sorting.mp4" },
  ],
  WEB301: [
    { title: "Lecture 1 Slides - MERN Overview", type: "slides", url: "https://example.com/web301/lecture1.pdf" },
    { title: "React Docs", type: "link", url: "https://react.dev" },
    { title: "Express Docs", type: "link", url: "https://expressjs.com" },
  ],
};

async function seed() {
  await connectDB(process.env.MONGO_URI);

  await Resource.deleteMany({});
  await Course.deleteMany({});

  const createdCourses = await Course.insertMany(courses);

  const resourceDocs = createdCourses.flatMap((course) =>
    (resourcesByCode[course.code] || []).map((resource) => ({ ...resource, course: course._id }))
  );
  await Resource.insertMany(resourceDocs);

  console.log(`Seeded ${createdCourses.length} courses and ${resourceDocs.length} resources.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});
