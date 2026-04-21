import express from 'express';
import { createLead, getAllLeads, getLeadById, updateLead, deleteLead } from '../controllers/leadController.js';
import { protect,authorizeRoles } from '../middlewares/autenticationMiddleware.js';


const router = express.Router();
router.post('/', protect,authorizeRoles('admin','Manager'), createLead);
router.get('/', protect, getAllLeads);
router.get('/:id', protect, getLeadById);
router.put('/:id', protect,authorizeRoles('Manager'), updateLead);
router.delete('/:id', protect,authorizeRoles('admin'), deleteLead);

export default router;
