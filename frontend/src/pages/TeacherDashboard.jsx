import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function TeacherDashboard() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");

  /* ===========================
     FETCH TEACHER VIDEOS
  =========================== */
  const fetchVideos = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/videos/my-videos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVideos(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  /* ===========================
     UPLOAD VIDEO
  =========================== */
  const uploadVideo = async () => {
    if (!file || !title.trim()) {
      alert("Please provide title and file");
      return;
    }

    try {
      setUploading(true);

      // Step 1: Get presigned URL
      const res = await axios.post(
        "http://localhost:5000/api/videos/get-upload-url",
        {
          fileName: file.name,
          fileType: file.type,
          title,
          description: "Uploaded from frontend",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Step 2: Upload directly to S3
      await axios.put(res.data.uploadUrl, file, {
        headers: { "Content-Type": "video/mp4" },
      });

      // Direct copy to processed bucket
      await axios.post(
        "http://localhost:5000/api/videos/complete-upload",
        { videoId: res.data.videoId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      alert("Upload successful!");

      setTitle("");
      setFile(null);

      fetchVideos(); // refresh list

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ===========================
     DELETE VIDEO
  =========================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/videos/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Video deleted successfully");
      fetchVideos();

    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h2>Teacher Dashboard</h2>

        {/* ================= Upload Section ================= */}
        <div className="video-card">
          <h3>Upload New Lecture</h3>

          <input
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={uploadVideo} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
        </div>

        {/* ================= My Videos ================= */}
        <h3 style={{ marginTop: "40px" }}>My Videos</h3>

        {videos.length === 0 && (
          <p>No videos uploaded yet.</p>
        )}

        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <h4>{video.title}</h4>
            <p>{video.description}</p>

            {/* Status Badge */}
            <span
              className={`status-badge ${video.status === "processed"
                ? "status-processed"
                : "status-uploaded"
                }`}
            >
              {video.status.toUpperCase()}
            </span>

            {/* Raw Key */}
            <p style={{ fontSize: "12px", marginTop: "10px" }}>
              Raw Key: {video.rawKey}
            </p>

            {/* Delete Button */}
            <button
              style={{
                marginTop: "15px",
                backgroundColor: "#ef4444",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => handleDelete(video.id)}
            >
              Delete Video
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default TeacherDashboard;
