require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const authRoutes = require("./routes/auth");
const videoRoutes = require("./routes/videos");
const categoryRoutes = require("./routes/categories");

const prisma = new PrismaClient();
const app = express();

/* ===========================
   CREATE DEFAULT ADMIN
=========================== */
async function createAdminIfNotExists() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log("⚠ ADMIN_EMAIL or ADMIN_PASSWORD not set");
      return;
    }

    const existingAdmin = await prisma.user.findFirst({
      where: { role: "admin" },
    });

    if (!existingAdmin) {
      const hashed = await bcrypt.hash(adminPassword, 10);

      await prisma.user.create({
        data: {
          name: "Super Admin",
          email: adminEmail,
          password: hashed,
          role: "admin",
        },
      });

      console.log("✅ Default admin created");
    } else {
      console.log("ℹ Admin already exists");
    }

  } catch (err) {
    console.error("❌ Admin creation failed:", err);
  }
}

/* ===========================
   MIDDLEWARE
=========================== */
app.use(cors());
app.use(express.json());

/* ===========================
   ROUTES
=========================== */
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/categories", categoryRoutes);

/* Health check */
app.get("/", (req, res) => {
  res.send("🚀 LMS API Running");
});

/* ===========================
   START SERVER PROPERLY
=========================== */
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    await createAdminIfNotExists();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
}

startServer();