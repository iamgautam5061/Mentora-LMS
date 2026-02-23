import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

function StudentDashboard() {
  const token = localStorage.getItem("token");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/videos",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVideos(res.data);
    };

    fetchVideos();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="page-title">All Lectures</h1>

      <div className="video-grid">
        {videos.map((video) => (
          <div
            key={video.id}
            className="video-card"
            onClick={() => setSelectedVideo(video)}
          >
            {/* Thumbnail */}
            <div className="video-thumbnail-wrapper">
              <img
                src="https://willpittman.net:8080/images/5/57/Aws.png?20200717183155"
                alt="thumbnail"
                className="video-thumbnail"
              />
            </div>

            {/* Info Section */}
            <div className="video-info">
              <div className="video-title">{video.title}</div>

              <div className="video-teacher">
                👤 {video.teacherName}
              </div>

              <div className="video-meta">
                {video.university} • {video.course}
              </div>

              <div className="video-meta">
                Year {video.year} - Semester {video.semester}
              </div>

              <div className="video-meta">
                {video.subject}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VIDEO MODAL */}
      {selectedVideo && (
        <div
          className="video-modal"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "15px" }}>
              {selectedVideo.title}
            </h2>

            <video
              controls
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              autoPlay
              style={{ width: "100%" }}
            >
              <source src={selectedVideo.videoUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default StudentDashboard;