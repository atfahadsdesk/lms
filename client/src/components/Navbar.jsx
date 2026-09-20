import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { student, token, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/signin");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Student LMS
      </Link>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/courses">Courses</Link>
            <span className="nav-user">{student?.name}</span>
            <button type="button" onClick={handleLogout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/signin">Sign in</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
