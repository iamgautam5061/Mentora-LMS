import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [newUniversity, setNewUniversity] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  /* ===========================
     FETCH CATEGORY TREE
  =========================== */
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
      setUniversities(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ===========================
     ADD UNIVERSITY
  =========================== */
  const createUniversity = async () => {
    if (!newUniversity) return alert("Enter university name");

    await axios.post(
      "http://localhost:5000/api/categories/university",
      { name: newUniversity },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewUniversity("");
    fetchCategories();
  };

  /* ===========================
     ADD COURSE
  =========================== */
  const createCourse = async () => {
    if (!newCourse || !selectedUniversity)
      return alert("Select university and enter course");

    await axios.post(
      "http://localhost:5000/api/categories/course",
      {
        name: newCourse,
        universityId: selectedUniversity,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewCourse("");
    fetchCategories();
  };

  /* ===========================
     ADD SUBJECT
  =========================== */
  const createSubject = async () => {
    if (!newSubject || !selectedCourse || !year || !semester)
      return alert("Fill all subject details");

    await axios.post(
      "http://localhost:5000/api/categories/subject",
      {
        name: newSubject,
        year: parseInt(year),
        semester: parseInt(semester),
        courseId: selectedCourse,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewSubject("");
    setYear("");
    setSemester("");
    fetchCategories();
  };

  /* ===========================
     HANDLE DROPDOWNS
  =========================== */
  const handleUniversityChange = (e) => {
    const id = e.target.value;
    setSelectedUniversity(id);
    setSelectedCourse("");

    const uni = categories.find((u) => u.id === id);
    setCourses(uni ? uni.courses : []);
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Admin Dashboard</h1>

      {/* ===========================
         ADD UNIVERSITY
      =========================== */}
      <div className="card">
        <h3>Add University</h3>

        <input
          placeholder="University Name"
          value={newUniversity}
          onChange={(e) => setNewUniversity(e.target.value)}
        />

        <button onClick={createUniversity}>Add University</button>
      </div>

      {/* ===========================
         ADD COURSE
      =========================== */}
      <div className="card">
        <h3>Add Course</h3>

        <select value={selectedUniversity} onChange={handleUniversityChange}>
          <option value="">Select University</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Course Name"
          value={newCourse}
          onChange={(e) => setNewCourse(e.target.value)}
        />

        <button onClick={createCourse}>Add Course</button>
      </div>

      {/* ===========================
         ADD SUBJECT
      =========================== */}
      <div className="card">
        <h3>Add Subject</h3>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Subject Name"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
        />

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <input
          type="number"
          placeholder="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />

        <button onClick={createSubject}>Add Subject</button>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;