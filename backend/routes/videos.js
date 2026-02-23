const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");
const { generateUploadUrl } = require("../utils/s3");
const { generateSignedUrl } = require("../utils/cloudfront");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/* SLUG HELPER */
const slugify = (text) =>
  text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

/* ===========================
   TEACHER: GET PRESIGNED URL
=========================== */
router.post(
  "/get-upload-url",
  verifyToken,
  verifyRole("teacher"),
  async (req, res) => {
    try {
      const { fileName, fileType, title, subjectId } = req.body;

      if (!fileName || !fileType || !title || !subjectId) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        include: {
          course: { include: { university: true } },
        },
      });

      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }

      const universitySlug = slugify(subject.course.university.name);
      const courseSlug = slugify(subject.course.name);
      const subjectSlug = slugify(subject.name);

      const uniqueFileName = `${uuidv4()}_${fileName}`;

      const s3Key = `videos/${subject.course.university.id}_${universitySlug}/${subject.course.id}_${courseSlug}/${subject.year}/${subject.semester}/${subject.id}_${subjectSlug}/${uniqueFileName}`;

      const uploadUrl = await generateUploadUrl(s3Key, fileType);

      const video = await prisma.video.create({
        data: {
          title,
          s3Key,
          userId: req.user.id,
          subjectId,
        },
      });

      res.json({
        uploadUrl,
        videoId: video.id,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
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
        where: { userId: req.user.id },
        include: {
          subject: {
            include: {
              course: {
                include: { university: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json(videos);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Fetch failed" });
    }
  }
);

/* ===========================
   STUDENT: GET VIDEOS (SIGNED URL)
=========================== */
router.get(
  "/",
  verifyToken,
  verifyRole("student"),
  async (req, res) => {
    try {
      const videos = await prisma.video.findMany({
        include: {
          user: true,
          subject: {
            include: {
              course: {
                include: { university: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const formatted = videos.map((video) => ({
        id: video.id,
        title: video.title,
        teacherName: video.user.name,
        university: video.subject.course.university.name,
        course: video.subject.course.name,
        year: video.subject.year,
        semester: video.subject.semester,
        subject: video.subject.name,
        videoUrl: generateSignedUrl(video.s3Key), // ✅ SIGNED URL
      }));

      res.json(formatted);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Fetch failed" });
    }
  }
);

// /* ===========================
//    DELETE VIDEO
// =========================== */
router.delete(
  "/:id",
  verifyToken,
  verifyRole("teacher"),
  async (req, res) => {
    try {
      const video = await prisma.video.findUnique({
        where: { id: req.params.id },
      });

      if (!video) return res.status(404).json({ error: "Not found" });
      if (video.userId !== req.user.id)
        return res.status(403).json({ error: "Unauthorized" });

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: video.s3Key,
        })
      );

      await prisma.video.delete({
        where: { id: req.params.id },
      });

      res.json({ message: "Deleted successfully" });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Delete failed" });
    }
  }
);

module.exports = router;