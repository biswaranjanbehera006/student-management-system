const express = require("express");

const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Get all students
router.get("/", protect, getStudents);

// Get single student
router.get("/:id", protect, getStudent);

// Create student with optional profile photo
router.post("/", protect, upload.single("profilePhoto"), createStudent);

// Update student with optional profile photo
router.put("/:id", protect, upload.single("profilePhoto"), updateStudent);

// Delete student
router.delete("/:id", protect, deleteStudent);

module.exports = router;