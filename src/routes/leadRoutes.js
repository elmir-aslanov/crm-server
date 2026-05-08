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
    getAllLeadNotes,
    getPipeline,
    getLeadAuditTrail,
} from '../controllers/leadController.js';
import { protect, authorizeRoles } from '../middlewares/authenticationMiddleware.js';
import { checkLeadAccess } from '../middlewares/ownershipMiddleware.js';

const router = express.Router();

const crmRoles = ['Admin', 'Manager', 'SalesRep'];

// Pipeline view
router.get('/pipeline', protect, authorizeRoles(...crmRoles), getPipeline);

// Lead list & create
router.get('/', protect, authorizeRoles(...crmRoles), getAllLeads);
router.post('/', protect, authorizeRoles('Admin', 'Manager', 'SalesRep'), createLead);

// Export
router.get('/export', protect, authorizeRoles('Admin', 'Manager'), getAllLeads);

// Single lead — ownership check applied after role check
router.get('/:id', protect, authorizeRoles(...crmRoles), checkLeadAccess, getLeadById);
router.put('/:id', protect, authorizeRoles('Admin', 'Manager', 'SalesRep'), checkLeadAccess, updateLead);
router.put('/:id/status', protect, authorizeRoles(...crmRoles), checkLeadAccess, updateLeadStatus);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteLead);

// Sub-resources
router.get('/:id/history', protect, authorizeRoles(...crmRoles), checkLeadAccess, getLeadHistory);
router.get('/:id/notes', protect, authorizeRoles(...crmRoles), checkLeadAccess, getAllLeadNotes);
router.post('/:id/notes', protect, authorizeRoles(...crmRoles), checkLeadAccess, addLeadNote);
router.get('/:id/audit', protect, authorizeRoles('Admin', 'Manager'), getLeadAuditTrail);

export default router;
