import { 
  createLeadService, 
  getLeadsService, 
  updateLeadStatusService 
} from '../services/leadService.js';
import Lead from '../models/Lead.js';
import LeadNote from '../models/LeadNote.js';
import LeadStatusHistory from '../models/LeadStatusHistory.js';

export const getAllLeads = async (req, res, next) => {
  try {
    const result = await getLeadsService(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName')
      .populate('courseInterest', 'name');
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req, res, next) => {
  try {
    const newLead = await createLeadService(req.body);
    res.status(201).json(newLead);
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json(updatedLead);
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status, comment } = req.body;
    const leadId = req.params.id;
    const userId = req.user._id; // From protect middleware

    const updatedLead = await updateLeadStatusService(leadId, status, userId, comment);
    res.status(200).json(updatedLead);
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addLeadNote = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const note = await LeadNote.create({
      leadId: lead._id,
      note: req.body.note,
      createBy: req.user?._id || null,
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const getLeadHistory = async (req, res, next) => {
  try {
    const history = await LeadStatusHistory.find({ leadId: req.params.id })
      .populate('changedBy', 'firstName lastName role')
      .sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};

export const getAllLeadNotes = async (req, res, next) => {
  try {
    const notes = await LeadNote.find({ leadId: req.params.id })
      .populate('createBy', 'firstName lastName role')
      .sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};
