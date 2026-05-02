import express from 'express';
import { 
  createLead, 
  getAllLeads, 
  getLeadById, 
  updateLead, 
  deleteLead,
  updateLeadStatus,
  addLeadNote,
  getLeadHistory,
  getAllLeadNotes
} from '../controllers/leadController.js';
import { protect, authorizeRoles } from '../middlewares/autenticationMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('Admin', 'Manager'), createLead);
router.get('/', protect, getAllLeads);
router.get('/export', protect, authorizeRoles('Admin', 'Manager'), getAllLeads);
router.get('/:id', protect, getLeadById);
router.put('/:id', protect, authorizeRoles('Admin', 'Manager'), updateLead);
router.put('/:id/status', protect, authorizeRoles('Admin', 'Manager'), updateLeadStatus);
router.get('/:id/history', protect, authorizeRoles('Admin', 'Manager'), getLeadHistory);
router.get('/:id/notes', protect, authorizeRoles('Admin', 'Manager'), getAllLeadNotes);
router.post('/:id/notes', protect, authorizeRoles('Admin', 'Manager'), addLeadNote);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteLead);

export default router;
