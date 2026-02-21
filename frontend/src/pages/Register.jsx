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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
  <div className="container">
    <h2>Register</h2>

    <input
      name="name"
      placeholder="Name"
      value={form.name}
      onChange={handleChange}
    />

    <input
      name="email"
      placeholder="Email"
      value={form.email}
      onChange={handleChange}
    />

    <input
      type="password"
      name="password"
      placeholder="Password"
      value={form.password}
      onChange={handleChange}
    />

    <select
      name="role"
      value={form.role}
      onChange={handleChange}
    >
      <option value="student">Student</option>
      <option value="teacher">Teacher</option>
    </select>

    <button onClick={handleRegister}>Register</button>

    <div className="link-text">
      Already have an account? <Link to="/">Login</Link>
    </div>
  </div>
);

}

export default Register;
