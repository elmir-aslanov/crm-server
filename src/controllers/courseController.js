import asyncHandler from "../utils/asyncHandler.js";
import {
  createCourseService,
  deleteCourseService,
  getCourseByIdService,
  getCoursesService,
  updateCourseService,
} from "../services/courseService.js";

export const createCourse = asyncHandler(async (req, res) => {
  const course = await createCourseService(req.body);
  res.status(201).json(course);
});

export const getCourses = asyncHandler(async (req, res) => {
  const courses = await getCoursesService();
  res.json(courses);
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await getCourseByIdService(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.json(course);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await updateCourseService(req.params.id, req.body);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.json(course);
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await deleteCourseService(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.json({ message: "Course deleted successfully" });
});