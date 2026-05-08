import {
    createLeadService,
    getLeadsService,
    updateLeadStatusService,
    getPipelineService,
} from '../services/leadService.js';
import Lead from '../models/Lead.js';
import LeadNote from '../models/LeadNote.js';
import LeadStatusHistory from '../models/LeadStatusHistory.js';
import { logCreate, logUpdate, logDelete } from '../services/auditService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const getAllLeads = asyncHandler(async (req, res) => {
    const result = await getLeadsService(req.query, req.user);
    res.status(200).json(result);
});

export const getPipeline = asyncHandler(async (req, res) => {
    const stages = await getPipelineService(req.user);
    res.status(200).json(stages);
});

export const getLeadById = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id)
        .populate('assignedTo', 'firstName lastName role')
        .populate('courseInterest', 'name');
    if (!lead) throw new ApiError(404, 'Lead not found');
    res.status(200).json(lead);
});

export const createLead = asyncHandler(async (req, res) => {
    const newLead = await createLeadService(req.body);
    await logCreate({ entityType: 'Lead', entityId: newLead._id, changedBy: req.user._id, ip: req.ip });
    res.status(201).json(newLead);
});

export const updateLead = asyncHandler(async (req, res) => {
    const old = await Lead.findById(req.params.id).lean();
    if (!old) throw new ApiError(404, 'Lead not found');

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    await logUpdate({
        entityType: 'Lead',
        entityId: updated._id,
        changedBy: req.user._id,
        oldData: old,
        newData: updated.toObject(),
        ip: req.ip,
    });

    res.status(200).json(updated);
});

export const updateLeadStatus = asyncHandler(async (req, res) => {
    const { status, comment } = req.body;
    if (!status) throw new ApiError(400, 'status is required');

    const updatedLead = await updateLeadStatusService(req.params.id, status, req.user._id, comment);
    res.status(200).json(updatedLead);
});

export const deleteLead = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new ApiError(404, 'Lead not found');

    await lead.deleteOne();
    await logDelete({ entityType: 'Lead', entityId: lead._id, changedBy: req.user._id, ip: req.ip });

    res.status(200).json({ message: 'Lead deleted successfully' });
});

export const addLeadNote = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new ApiError(404, 'Lead not found');
    if (!req.body.note?.trim()) throw new ApiError(400, 'note is required');

    const note = await LeadNote.create({
        leadId: lead._id,
        note: req.body.note.trim(),
        createdBy: req.user._id,
    });

    res.status(201).json(note);
});

export const getLeadHistory = asyncHandler(async (req, res) => {
    const history = await LeadStatusHistory.find({ leadId: req.params.id })
        .populate('changedBy', 'firstName lastName role')
        .sort({ createdAt: -1 });
    res.status(200).json(history);
});

export const getAllLeadNotes = asyncHandler(async (req, res) => {
    const notes = await LeadNote.find({ leadId: req.params.id })
        .populate('createdBy', 'firstName lastName role')
        .sort({ createdAt: -1 });
    res.status(200).json(notes);
});

export const getLeadAuditTrail = asyncHandler(async (req, res) => {
    const { getAuditTrail } = await import('../services/auditService.js');
    const trail = await getAuditTrail('Lead', req.params.id);
    res.status(200).json(trail);
});
