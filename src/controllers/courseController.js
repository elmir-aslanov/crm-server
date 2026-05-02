import Course from '../models/Course.js';
import Category from '../models/Category.js';

// Categories
export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

// Courses
export const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().populate('categoryId', 'name');
        res.status(200).json(courses);
    } catch (error) {
        next(error);
    }
};

export const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate('categoryId', 'name');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json(course);
    } catch (error) {
        next(error);
    }
};

export const createCourse = async (req, res, next) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
};

export const updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json(course);
    } catch (error) {
        next(error);
    }
};
