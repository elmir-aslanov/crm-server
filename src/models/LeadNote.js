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
            trim: true,
        },
        createBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
     }
);

const LeadNote = mongoose.model('LeadNote', leadNoteSchema);

export default LeadNote;