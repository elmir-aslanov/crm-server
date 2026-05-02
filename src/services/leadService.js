import Lead from "../models/Lead.js";
import LeadStatusHistory from "../models/LeadStatusHistory.js";
import Student from "../models/Student.js";

export const createLeadService = async (data) => {
  const { phone, email } = data;
  const matchers = [{ phone }];

  if (email) {
    matchers.push({ email: email.toLowerCase() });
  }

  const existing = await Lead.findOne({ $or: matchers });

  if (existing) {
    throw new Error("Lead already exists with this phone or email");
  }

  const lead = await Lead.create(data);
  return lead;
};

export const updateLeadStatusService = async (leadId, newStatus, userId, comment = "") => {
  const lead = await Lead.findById(leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }

  const oldStatus = lead.status;
  if (oldStatus === newStatus) {
    return lead;
  }

  lead.status = newStatus;
  await lead.save();

  // Record history
  await LeadStatusHistory.create({
    leadId,
    oldStatus,
    newStatus,
    changedBy: userId,
    comment
  });

  // If enrolled, create a student
  if (newStatus === 'Enrolled') {
    const existingStudent = await Student.findOne({ leadId });
    if (!existingStudent) {
      // Generate student code: STU-XXXXXX
      const count = await Student.countDocuments();
      const studentCode = `STU-${(count + 1).toString().padStart(6, '0')}`;

      await Student.create({
        leadId: lead._id,
        studentCode,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email || `${lead.phone}@academy.az`, // Fallback email if not provided
        phone: lead.phone,
        status: 'Active'
      });
    }
  }

  return lead;
};

export const getLeadsService = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.assignedTo) filter.assignedTo = query.assignedTo;

  const leads = await Lead.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('assignedTo', 'firstName lastName')
    .populate('courseInterest', 'name');

  const total = await Lead.countDocuments(filter);

  return {
    leads,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};
