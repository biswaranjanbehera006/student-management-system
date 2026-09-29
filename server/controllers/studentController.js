const Student = require("../models/Student");
const cloudinary = require("../config/cloudinary");

// Upload image buffer to Cloudinary
const uploadToCloudinary = async (file) => {
  if (!file) {
    return null;
  }

  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  const result = await cloudinary.uploader.upload(base64Image, {
    folder: "student-management/students",
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(
      "Cloudinary image deletion error:",
      error.message
    );
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Get students error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

// Get single student
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Get student error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student",
    });
  }
};

// Create student
const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      age,
      course,
      phone,
      address,
    } = req.body;

    // Required field validation
    if (
      !name ||
      !email ||
      !age ||
      !course ||
      !phone ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "All student fields are required",
      });
    }

    // Age validation
    if (Number(age) <= 16) {
      return res.status(400).json({
        success: false,
        message: "Student age must be greater than 16",
      });
    }

    // Check duplicate email
    const existingStudent = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "A student with this email already exists",
      });
    }

    // Upload profile photo if provided
    let profilePhoto = {
      url: "",
      publicId: "",
    };

    if (req.file) {
      profilePhoto = await uploadToCloudinary(req.file);
    }

    const student = await Student.create({
      name,
      email,
      age,
      course,
      phone,
      address,
      profilePhoto,
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error("Create student error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A student with this email already exists",
      });
    }

    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0];

      return res.status(400).json({
        success: false,
        message: firstError?.message || "Invalid student data",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create student",
    });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      age,
      course,
      phone,
      address,
    } = req.body;

    // Required field validation
    if (
      !name ||
      !email ||
      !age ||
      !course ||
      !phone ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "All student fields are required",
      });
    }

    // Age validation
    if (Number(age) <= 16) {
      return res.status(400).json({
        success: false,
        message: "Student age must be greater than 16",
      });
    }

    // Find existing student
    const existingStudent = await Student.findById(
      req.params.id
    );

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check duplicate email excluding current student
    const duplicateStudent = await Student.findOne({
      email: email.toLowerCase(),
      _id: { $ne: req.params.id },
    });

    if (duplicateStudent) {
      return res.status(409).json({
        success: false,
        message: "A student with this email already exists",
      });
    }

    let profilePhoto = existingStudent.profilePhoto;

    // Upload new profile photo if provided
    if (req.file) {
      const uploadedPhoto = await uploadToCloudinary(
        req.file
      );

      // Delete old Cloudinary image
      if (existingStudent.profilePhoto?.publicId) {
        await deleteFromCloudinary(
          existingStudent.profilePhoto.publicId
        );
      }

      profilePhoto = uploadedPhoto;
    }

    existingStudent.name = name;
    existingStudent.email = email;
    existingStudent.age = age;
    existingStudent.course = course;
    existingStudent.phone = phone;
    existingStudent.address = address;
    existingStudent.profilePhoto = profilePhoto;

    await existingStudent.save();

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: existingStudent,
    });
  } catch (error) {
    console.error("Update student error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A student with this email already exists",
      });
    }

    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0];

      return res.status(400).json({
        success: false,
        message: firstError?.message || "Invalid student data",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update student",
    });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Delete profile photo from Cloudinary
    if (student.profilePhoto?.publicId) {
      await deleteFromCloudinary(
        student.profilePhoto.publicId
      );
    }

    await Student.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete student",
    });
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};