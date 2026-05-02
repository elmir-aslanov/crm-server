import express from 'express';
import { createPayment, getOverduePayments, updatePaymentStatus } from '../controllers/paymentController.js';
import { protect, authorizeRoles } from '../middlewares/autenticationMiddleware.js';

const router = express.Router();

router.get('/overdue', protect, authorizeRoles('Admin', 'Manager', 'Accountant'), getOverduePayments);
router.post('/', protect, authorizeRoles('Admin', 'Manager', 'Accountant'), createPayment);
router.put('/:id', protect, authorizeRoles('Admin', 'Manager', 'Accountant'), updatePaymentStatus);

export default router;