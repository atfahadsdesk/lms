import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Courses from "./pages/Courses";
import CourseResources from "./pages/CourseResources";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/resources"
            element={
              <ProtectedRoute>
                <CourseResources />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/courses" replace />} />
        </Routes>
      </main>
    </>
  );
}
