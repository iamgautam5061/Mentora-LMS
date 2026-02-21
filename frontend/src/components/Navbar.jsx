import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.logo}>🎓 Video Platform</div>

      <div style={styles.rightSection}>
        <span style={styles.roleBadge}>
          {role?.toUpperCase()}
        </span>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    height: "60px",
    backgroundColor: "#111827",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "18px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  roleBadge: {
    backgroundColor: "#2563eb",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "12px",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
};

export default Navbar;
