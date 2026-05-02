import mongoose from 'mongoose';

const leadStatusHistorySchema = new mongoose.Schema(
    {
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lead',
            required: true,
        },
        oldStatus: {
            type: String,
            enum: ['New', 'Contacted', 'Interested', 'Trial', 'Enrolled', 'Lost'],
            required: true,
        },
        newStatus: {
            type: String,
            enum: ['New', 'Contacted', 'Interested', 'Trial', 'Enrolled', 'Lost'],
            required: true,
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comment: {
            type: String,
            trim: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const LeadStatusHistory = mongoose.model('LeadStatusHistory', leadStatusHistorySchema);

export default LeadStatusHistory;
