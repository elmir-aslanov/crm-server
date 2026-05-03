import { body } from 'express-validator';

// CREATE
export const createStudentValidation = [
  body('studentCode')
    .notEmpty()
    .withMessage('Student code is required'),

  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 100 })
    .withMessage('First name must be max 100 characters'),

  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 100 })
    .withMessage('Last name must be max 100 characters'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('phone')
    .notEmpty()
    .withMessage('Phone is required')
    .isLength({ max: 20 })
    .withMessage('Phone must be max 20 characters'),

  body('status')
    .optional()
    .isIn(['Active', 'Suspended', 'Graduated', 'Dropped'])
    .withMessage('Invalid student status'),
];

// UPDATE
export const updateStudentValidation = [
  body('studentCode')
    .optional()
    .notEmpty()
    .withMessage('Student code cannot be empty'),

  body('firstName')
    .optional()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('First name must be max 100 characters'),

  body('lastName')
    .optional()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Last name must be max 100 characters'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),

  body('phone')
    .optional()
    .notEmpty()
    .withMessage('Phone cannot be empty')
    .isLength({ max: 20 })
    .withMessage('Phone must be max 20 characters'),

  body('status')
    .optional()
    .isIn(['Active', 'Suspended', 'Graduated', 'Dropped'])
    .withMessage('Invalid student status'),
];