const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");
const { generateUploadUrl } = require("../utils/s3");

const { 
  S3Client, 
  DeleteObjectCommand, 
  CopyObjectCommand 
} = require("@aws-sdk/client-s3");

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/* ===========================
   TEACHER: GET PRESIGNED URL
=========================== */
router.post(
  "/get-upload-url",
  verifyToken,
  verifyRole("teacher"),
  async (req, res) => {
    const { fileName, fileType, title, description } = req.body;

    if (!fileName || !fileType || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const uniqueKey = `raw/${uuidv4()}_${fileName}`;
      const uploadUrl = await generateUploadUrl(uniqueKey, fileType);

      const video = await prisma.video.create({
        data: {
          title,
          description,
          rawKey: uniqueKey,
          status: "uploaded",
          uploadedBy: req.user.id,
        },
      });

      return res.json({
        uploadUrl,
        videoId: video.id,
      });

    } catch (err) {
      console.error("UPLOAD URL ERROR:", err);
      return res.status(500).json({ error: "Could not generate upload URL" });
    }
  }
);

/* ===========================
   COMPLETE UPLOAD (AUTO COPY)
=========================== */
router.post(
  "/complete-upload",
  verifyToken,
  verifyRole("teacher"),
  async (req, res) => {
    try {
      const { videoId } = req.body;

      const video = await prisma.video.findUnique({
        where: { id: videoId },
      });

      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      const processedKey = video.rawKey.replace("raw/", "processed/");

      await s3.send(
        new CopyObjectCommand({
          CopySource: `${process.env.RAW_BUCKET}/${video.rawKey}`,
          Bucket: process.env.PROCESSED_BUCKET,
          Key: processedKey,
        })
      );

      await prisma.video.update({
        where: { id: videoId },
        data: {
          status: "processed",
          processedKey: processedKey,
        },
      });

      return res.json({ message: "Upload completed & processed" });

    } catch (err) {
      console.error("AUTO COPY ERROR:", err);
      return res.status(500).json({ error: "Processing failed" });
    }
  }
);

/* ===========================
   STUDENT: GET VIDEOS
=========================== */
router.get(
  "/",
  verifyToken,
  verifyRole("student"),
  async (req, res) => {
    try {
      const videos = await prisma.video.findMany({
        where: { status: "processed" },
        orderBy: { createdAt: "desc" },
      });

      const formatted = videos.map((video) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        videoUrl: `${process.env.CLOUDFRONT_URL}/${video.processedKey}`,
      }));

      return res.json(formatted);

    } catch (err) {
      console.error("FETCH VIDEOS ERROR:", err);
      return res.status(500).json({ error: "Could not fetch videos" });
    }
  }
);

/* ===========================
   TEACHER: GET MY VIDEOS
=========================== */
router.get(
  "/my-videos",
  verifyToken,
  verifyRole("teacher"),
  async (req, res) => {
    try {
      const videos = await prisma.video.findMany({
        where: { uploadedBy: req.user.id },
        orderBy: { createdAt: "desc" },
      });

      return res.json(videos);

    } catch (err) {
      console.error("FETCH TEACHER VIDEOS ERROR:", err);
      return res.status(500).json({ error: "Could not fetch videos" });
    }
  }
);

/* ===========================
   TEACHER: DELETE VIDEO
=========================== */
router.delete(
  "/:id",
  verifyToken,
  verifyRole("teacher"),
  async (req, res) => {
    try {
      const video = await prisma.video.findUnique({
        where: { id: req.params.id },
      });

      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      if (video.uploadedBy !== req.user.id) {
        return res.status(403).json({ error: "Not authorized" });
      }

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.RAW_BUCKET,
          Key: video.rawKey,
        })
      );

      if (video.processedKey) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.PROCESSED_BUCKET,
            Key: video.processedKey,
          })
        );
      }

      await prisma.video.delete({
        where: { id: req.params.id },
      });

      return res.json({ message: "Video deleted successfully" });

    } catch (err) {
      console.error("DELETE ERROR:", err);
      return res.status(500).json({ error: "Could not delete video" });
    }
  }
);

module.exports = router;
