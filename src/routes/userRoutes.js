import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middlewares/autenticationMiddleware.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('Admin'), getAllUsers);
router.get('/:id', protect, authorizeRoles('Admin'), getUserById);
router.put('/:id', protect, authorizeRoles('Admin'), updateUser);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteUser);

export default router;
