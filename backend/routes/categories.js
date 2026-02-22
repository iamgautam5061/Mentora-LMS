const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

const prisma = new PrismaClient();

/* ===========================
   CREATE UNIVERSITY
=========================== */
router.post(
  "/university",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    try {
      const { name } = req.body;

      const university = await prisma.university.create({
        data: { name },
      });

      res.json(university);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not create university" });
    }
  }
);

/* ===========================
   CREATE COURSE
=========================== */
router.post(
  "/course",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    try {
      const { name, universityId } = req.body;

      const course = await prisma.course.create({
        data: {
          name,
          universityId,
        },
      });

      res.json(course);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not create course" });
    }
  }
);

/* ===========================
   CREATE SUBJECT
=========================== */
router.post(
  "/subject",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    try {
      const { name, year, semester, courseId } = req.body;

      const subject = await prisma.subject.create({
        data: {
          name,
          year: Number(year),
          semester: Number(semester),
          courseId,
        },
      });

      res.json(subject);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not create subject" });
    }
  }
);

/* ===========================
   GET FULL CATEGORY TREE
=========================== */
router.get("/", async (req, res) => {
  try {
    const universities = await prisma.university.findMany({
      include: {
        courses: {
          include: {
            subjects: true,
          },
        },
      },
    });

    res.json(universities);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch categories" });
  }
});

module.exports = router;