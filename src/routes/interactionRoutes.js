import express from 'express';
import {
    createInteraction,
    getInteractionsByLead,
    updateInteraction,
    deleteInteraction,
} from '../controllers/interactionController.js';
import { protect, authorizeRoles } from '../middlewares/authenticationMiddleware.js';
import { checkLeadAccess } from '../middlewares/ownershipMiddleware.js';

const router = express.Router({ mergeParams: true });

const crmRoles = ['Admin', 'Manager', 'SalesRep'];

// Mounted at /api/leads/:leadId/interactions
router.get('/', protect, authorizeRoles(...crmRoles), checkLeadAccess, getInteractionsByLead);
router.post('/', protect, authorizeRoles(...crmRoles), checkLeadAccess, createInteraction);

// Mounted at /api/interactions
router.put('/:id', protect, authorizeRoles(...crmRoles), updateInteraction);
router.delete('/:id', protect, authorizeRoles('Admin', 'Manager'), deleteInteraction);

export default router;
