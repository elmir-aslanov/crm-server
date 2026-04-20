import Lead from '../models/Lead.js';


export const getAllLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
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
    const newLead = new Lead(req.body);
    await newLead.save();
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
