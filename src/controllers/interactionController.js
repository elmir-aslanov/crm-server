import Interaction from '../models/Interaction.js';
import Lead from '../models/Lead.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const createInteraction = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) throw new ApiError(404, 'Lead not found');

    const interaction = await Interaction.create({
        ...req.body,
        leadId: lead._id,
        createdBy: req.user._id,
    });

    await interaction.populate('createdBy', 'firstName lastName role');
    res.status(201).json(interaction);
});

export const getInteractionsByLead = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = { leadId: req.params.leadId };
    if (req.query.type) filter.type = req.query.type;

    const [interactions, total] = await Promise.all([
        Interaction.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'firstName lastName role')
            .lean(),
        Interaction.countDocuments(filter),
    ]);

    res.status(200).json({ interactions, total, page, pages: Math.ceil(total / limit) });
});

export const updateInteraction = asyncHandler(async (req, res) => {
    const interaction = await Interaction.findById(req.params.id);
    if (!interaction) throw new ApiError(404, 'Interaction not found');

    if (
        req.user.role !== 'Admin' &&
        req.user.role !== 'Manager' &&
        interaction.createdBy.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(403, 'Access denied: not your interaction');
    }

    Object.assign(interaction, req.body);
    await interaction.save();
    await interaction.populate('createdBy', 'firstName lastName role');

    res.status(200).json(interaction);
});

export const deleteInteraction = asyncHandler(async (req, res) => {
    const interaction = await Interaction.findById(req.params.id);
    if (!interaction) throw new ApiError(404, 'Interaction not found');

    if (req.user.role !== 'Admin' && interaction.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Access denied');
    }

    await interaction.deleteOne();
    res.status(200).json({ message: 'Interaction deleted' });
});
