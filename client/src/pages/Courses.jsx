import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);

  async function loadCourses() {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function handleEnroll(courseId) {
    setEnrollingId(courseId);
    try {
      await api.post(`/courses/${courseId}/enroll`);
      await loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll");
    } finally {
      setEnrollingId(null);
    }
  }

  if (loading) return <p className="page-status">Loading courses...</p>;

  return (
    <div className="page">
      <h1>Courses</h1>
      {error && <p className="error">{error}</p>}
      <div className="card-grid">
        {courses.map((course) => (
          <div className="card" key={course._id}>
            <h2>
              {course.code} &middot; {course.title}
            </h2>
            <p>{course.description}</p>
            {course.instructor && <p className="muted">Instructor: {course.instructor}</p>}
            <div className="card-actions">
              <Link to={`/courses/${course._id}/resources`}>View resources</Link>
              {course.enrolled ? (
                <span className="badge">Enrolled</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleEnroll(course._id)}
                  disabled={enrollingId === course._id}
                >
                  {enrollingId === course._id ? "Enrolling..." : "Enroll"}
                </button>
              )}
            </div>
          </div>
        ))}
        {courses.length === 0 && <p>No courses available yet.</p>}
      </div>
    </div>
  );
}
