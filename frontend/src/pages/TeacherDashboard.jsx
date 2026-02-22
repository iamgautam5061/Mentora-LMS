import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

function TeacherDashboard() {
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [videos, setVideos] = useState([]);

  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* FETCH CATEGORIES */
  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data);
    setUniversities(res.data);
  };

  /* FETCH MY VIDEOS */
  const fetchMyVideos = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/videos/my-videos",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setVideos(res.data);
  };

  useEffect(() => {
    fetchCategories();
    fetchMyVideos();
  }, []);

  /* DROPDOWN LOGIC */
  const handleUniversityChange = (e) => {
    const id = e.target.value;
    setSelectedUniversity(id);
    setSelectedCourse("");
    setSelectedSubject("");

    const uni = categories.find((u) => u.id === id);
    setCourses(uni ? uni.courses : []);
    setSubjects([]);
  };

  const handleCourseChange = (e) => {
    const id = e.target.value;
    setSelectedCourse(id);
    setSelectedSubject("");

    const course = courses.find((c) => c.id === id);
    setSubjects(course ? course.subjects : []);
  };

  /* UPLOAD */
  const uploadVideo = async () => {
    if (!file || !title || !selectedSubject) {
      alert("Fill all fields");
      return;
    }

    try {
      setUploading(true);

      const res = await axios.post(
        "http://localhost:5000/api/videos/get-upload-url",
        {
          fileName: file.name,
          fileType: file.type,
          title,
          subjectId: selectedSubject,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.put(res.data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      await fetchMyVideos();

      setTitle("");
      setFile(null);
      setSelectedSubject("");

      alert("Upload successful");

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteVideo = async (id) => {
    if (!window.confirm("Delete this video?")) return;

    await axios.delete(
      `http://localhost:5000/api/videos/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchMyVideos();
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Teacher Dashboard</h1>

      <div className="card">
        <h3>Upload Lecture</h3>

        <select value={selectedUniversity} onChange={handleUniversityChange}>
          <option value="">Select University</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <select value={selectedCourse} onChange={handleCourseChange}>
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} (Year {s.year}, Sem {s.semester})
            </option>
          ))}
        </select>

        <input
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button onClick={uploadVideo} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </div>

      <div className="card">
        <h3>My Uploaded Videos</h3>

        {videos.length === 0 && <p>No videos uploaded yet.</p>}

        {videos.map((video) => (
          <div
            key={video.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div>
              <strong>{video.title}</strong>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                {video.subject?.name}
              </div>
            </div>

            <button
              style={{ background: "#ef4444" }}
              onClick={() => deleteVideo(video.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default TeacherDashboard;