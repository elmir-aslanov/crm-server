import express from 'express';
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getMyTasks,
} from '../controllers/taskController.js';
import { protect, authorizeRoles } from '../middlewares/authenticationMiddleware.js';
import { checkTaskAccess } from '../middlewares/ownershipMiddleware.js';

const router = express.Router();

// My open tasks shortcut (any authenticated user)
router.get('/me', protect, getMyTasks);

// Full task list — Admin/Manager see all, SalesRep filtered in controller
router.get('/', protect, getTasks);
router.post('/', protect, authorizeRoles('Admin', 'Manager', 'SalesRep'), createTask);

router.get('/:id', protect, checkTaskAccess, getTaskById);
router.put('/:id', protect, checkTaskAccess, updateTask);
router.delete('/:id', protect, authorizeRoles('Admin', 'Manager'), deleteTask);

export default router;
