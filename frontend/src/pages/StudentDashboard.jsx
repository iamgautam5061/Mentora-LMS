import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/videos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVideos(res.data);
      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h2>Browse Lectures</h2>

        {loading && <p>Loading videos...</p>}

        {!loading && videos.length === 0 && (
          <p>No videos available yet.</p>
        )}

        <div className="video-grid">
          {videos.map((video) => (
            <div
              key={video.id}
              className="video-thumbnail"
              onClick={() => setSelectedVideo(video)}
            >
              <img
                src="https://media.licdn.com/dms/image/sync/v2/D4D27AQFH_F5mJm6Ckw/articleshare-shrink_800/articleshare-shrink_800/0/1711534397506?e=2147483647&v=beta&t=kXiVc8PT70_N5o7CtALby3xIhQ8kESk47Gk-D5jo7rU"
                alt="thumbnail"
                className="thumbnail-image"
              />

              <div className="play-icon">▶</div>

              <div className="thumbnail-overlay">
                <h3>{video.title}</h3>
                {/* <p>{video.description}</p> */}
              </div>
            </div>

          ))}
        </div>
      </div>

      {selectedVideo && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              width="100%"
              controls
              controlsList="nodownload"
              disablePictureInPicture
              autoPlay
            >
              <source src={selectedVideo.videoUrl} />
            </video>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentDashboard;
