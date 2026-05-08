import Lead from '../models/Lead.js';
import LeadStatusHistory from '../models/LeadStatusHistory.js';
import Student from '../models/Student.js';
import ApiError from '../utils/ApiError.js';

// Valid pipeline transitions
const PIPELINE_TRANSITIONS = {
    'New':           ['Contacted', 'Lost'],
    'Contacted':     ['Proposal Sent', 'New', 'Lost'],
    'Proposal Sent': ['Won', 'Contacted', 'Lost'],
    'Won':           [],
    'Lost':          ['New'],
};

export const createLeadService = async (data) => {
    const { phone, email } = data;
    const matchers = [{ phone }];
    if (email) matchers.push({ email: email.toLowerCase() });

    const existing = await Lead.findOne({ $or: matchers });
    if (existing) {
        throw new ApiError(409, 'Lead already exists with this phone or email');
    }

    return Lead.create(data);
};

export const updateLeadStatusService = async (leadId, newStatus, userId, comment = '') => {
    const lead = await Lead.findById(leadId);
    if (!lead) throw new ApiError(404, 'Lead not found');

    const oldStatus = lead.status;
    if (oldStatus === newStatus) return lead;

    const allowed = PIPELINE_TRANSITIONS[oldStatus] ?? [];
    if (!allowed.includes(newStatus)) {
        throw new ApiError(
            422,
            `Invalid transition: ${oldStatus} → ${newStatus}. Allowed: ${allowed.join(', ') || 'none'}`
        );
    }

    lead.status = newStatus;
    await lead.save();

    await LeadStatusHistory.create({ leadId, oldStatus, newStatus, changedBy: userId, comment });

    // Auto-create student when lead is Won
    if (newStatus === 'Won') {
        const existingStudent = await Student.findOne({ leadId });
        if (!existingStudent) {
            const count = await Student.countDocuments();
            const studentCode = `STU-${(count + 1).toString().padStart(6, '0')}`;
            await Student.create({
                leadId: lead._id,
                studentCode,
                firstName: lead.firstName,
                lastName: lead.lastName,
                email: lead.email || `${lead.phone}@academy.az`,
                phone: lead.phone,
                status: 'Active',
            });
        }
    }

    return lead;
};

export const getLeadsService = async (query, user) => {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = {};

    // SalesRep only sees their assigned leads
    if (user?.role === 'SalesRep') {
        filter.assignedTo = user._id;
    } else if (query.assignedTo) {
        filter.assignedTo = query.assignedTo;
    }

    if (query.status) filter.status = query.status;
    if (query.source) filter.source = query.source;

    // Full-text search across name, phone, email
    if (query.search) {
        const rx = { $regex: query.search.trim(), $options: 'i' };
        filter.$or = [
            { firstName: rx },
            { lastName: rx },
            { phone: rx },
            { email: rx },
        ];
    }

    // Date range filter
    if (query.dateFrom || query.dateTo) {
        filter.createdAt = {};
        if (query.dateFrom) filter.createdAt.$gte = new Date(query.dateFrom);
        if (query.dateTo) filter.createdAt.$lte = new Date(query.dateTo);
    }

    const sort = query.sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const [leads, total] = await Promise.all([
        Lead.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('assignedTo', 'firstName lastName role')
            .populate('courseInterest', 'name')
            .lean(),
        Lead.countDocuments(filter),
    ]);

    return { leads, total, page, pages: Math.ceil(total / limit), limit };
};

export const getPipelineService = async (user) => {
    const matchStage = {};
    if (user?.role === 'SalesRep') {
        matchStage.assignedTo = user._id;
    }

    const pipeline = await Lead.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                leads: {
                    $push: {
                        _id: '$_id',
                        firstName: '$firstName',
                        lastName: '$lastName',
                        phone: '$phone',
                        source: '$source',
                        assignedTo: '$assignedTo',
                        updatedAt: '$updatedAt',
                    },
                },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    // Return all stages in order even if empty
    const stages = ['New', 'Contacted', 'Proposal Sent', 'Won', 'Lost'];
    const map = Object.fromEntries(pipeline.map((s) => [s._id, s]));

    return stages.map((stage) => ({
        status: stage,
        count: map[stage]?.count ?? 0,
        leads: map[stage]?.leads ?? [],
        transitions: PIPELINE_TRANSITIONS[stage],
    }));
};
