import express from 'express';
import { createLead, getLeads } from '../controllers/leadController.js';

const router = express.Router();

router.post('/', createLead);
router.get('/', getLeads);

export default router;
