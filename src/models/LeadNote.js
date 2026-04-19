import mongoose from 'mongoose';

const leadNoteSchema = new mongoose.Schema(
    {
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lead',
            required: true,
        },
        note: {
            type: String,
            required: [true, 'Note is required'],
            default: null,
        },
        createBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamp: true,
    }
);

const LeadNote = mongoose.model('LeadNote', leadNoteSchema);

export default LeadNote;