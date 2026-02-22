import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );
      alert("Registration successful");
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>

        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />

        <select name="role" onChange={handleChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <button onClick={handleRegister}>Register</button>

        <div className="auth-footer">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;