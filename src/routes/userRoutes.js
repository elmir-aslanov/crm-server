import express from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/userController.js';
import { authorizeRoles, protect } from '../middlewares/authenticationMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import { createUserSchema, updateUserSchema } from '../validations/userValidation.js';

const router = express.Router();

router.use(protect, authorizeRoles('user'));

router.route('/').post(validate(createUserSchema), createUser).get(getUsers);
router.route('/:id').get(getUserById).put(validate(updateUserSchema), updateUser).delete(deleteUser);

export default router;
