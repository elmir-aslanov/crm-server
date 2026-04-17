import Lead from '../models/Lead.js';

// @desc    Create a new lead
// @route   POST /api/leads
export const createLead = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email, status } = req.body;

    const lead = await Lead.create({
      firstName,
      lastName,
      phone,
      email,
      status,
    });

    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads
// @route   GET /api/leads
export const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find({});
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};
