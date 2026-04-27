import Course from "../models/Course.js";

// CREATE
export const createCourseService = async (data) => {
  return await Course.create(data);
};

// GET ALL
export const getCoursesService = async () => {
  return await Course.find().sort({ createdAt: -1 });
};

// GET BY ID
export const getCourseByIdService = async (id) => {
  return await Course.findById(id);
};

// UPDATE
export const updateCourseService = async (id, data) => {
  return await Course.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// DELETE
export const deleteCourseService = async (id) => {
  return await Course.findByIdAndDelete(id);
};