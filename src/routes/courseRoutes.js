import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from "../controllers/courseController.js";
import { protect } from "../middlewares/authenticationMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createCourse)
  .get(getCourses);

router.route("/:id")
  .get(getCourseById)
  .put(updateCourse)
  .delete(deleteCourse);

export default router;