import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <button onClick={logout}>Logout</button>
        </div>
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;