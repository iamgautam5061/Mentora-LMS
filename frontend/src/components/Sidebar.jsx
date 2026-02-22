import { Link } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role");

  return (
    <div className="sidebar">
      <h2>Mentora LMS</h2>

      {role === "admin" && <Link to="/admin">Admin</Link>}
      {role === "teacher" && <Link to="/teacher">Teacher</Link>}
      {role === "student" && <Link to="/student">Student</Link>}
    </div>
  );
}

export default Sidebar;