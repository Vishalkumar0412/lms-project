import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {
  deleteMediaFromCloudinary,
  uploadMedia,
} from "../utills/cloudinary.js";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "Course title and category are required",
        success: false,
      });
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });
    return res.status(201).json({
      message: "Course created successfully!",
      success: true,
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course",
      success: false,
    });
  }
};

// Get all courses by creator
export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses || courses.length === 0) {
      return res.status(200).json({
        courses: [],
        message: "No courses found for this creator",
        success: true,
      });
    }
    return res.status(200).json({
      courses,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch courses",
      success: false,
    });
  }
};

// Edit an existing course
export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId; // Should match your route parameter
    console.log("courseId:", courseId); // Debug to check value

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required",
        success: false,
      });
    }

    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        // Fixed typo: couseThumbnail -> courseThumbnail
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId); // Delete old image
      }
      // Upload new thumbnail to Cloudinary
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    // Prepare update data
    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      ...(courseThumbnail && { courseThumbnail: courseThumbnail.secure_url }), // Only update if new thumbnail exists
    };

    // Update the course
    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      course,
      message: "Course updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error editing course:", error);
    return res.status(500).json({
      message: "Failed to edit course",
      success: false,
    });
  }
};
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    return res.status(200).json({
      course,
    });
  } catch (error) {
    console.error("Error editing course:", error);
    return res.status(500).json({
      message: "Failed to get course by id",
      success: false,
    });
  }
};
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;
    if (!lectureTitle || courseId) {
      return res.status(400).json({
        message: "Lecture title is required",
      });
    }
    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);
    if (course) {
      course.lecture.push(lecture._id);
      await course.save();
    }

    return res.status(201).json({
        lecture,
        message:"Lecture created successfully "
    }
    )
  } catch (error) {
    console.error("Error editing course:", error);
    return res.status(500).json({
      message: "Failed to get course by id",
      success: false,
    });
  }
};
