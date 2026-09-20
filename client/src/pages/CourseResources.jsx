import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

const TYPE_LABELS = {
  slides: "Slides",
  video: "Video",
  document: "Document",
  link: "Link",
};

export default function CourseResources() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/courses/${courseId}/resources`)
      .then((res) => {
        setCourse(res.data.course);
        setResources(res.data.resources);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load resources"))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <p className="page-status">Loading resources...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="page">
      <Link to="/courses" className="back-link">
        &larr; Back to courses
      </Link>
      <h1>
        {course.code} &middot; {course.title}
      </h1>
      <p>{course.description}</p>

      <h2>Resources</h2>
      {resources.length === 0 ? (
        <p>No resources have been posted for this course yet.</p>
      ) : (
        <ul className="resource-list">
          {resources.map((resource) => (
            <li key={resource._id} className="resource-item">
              <span className="badge">{TYPE_LABELS[resource.type] || resource.type}</span>
              <a href={resource.url} target="_blank" rel="noreferrer">
                {resource.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
