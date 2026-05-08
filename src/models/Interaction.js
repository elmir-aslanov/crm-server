import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema(
    {
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lead',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['Call', 'Email', 'Meeting', 'Note'],
            required: true,
        },
        direction: {
            type: String,
            enum: ['Inbound', 'Outbound'],
            default: 'Outbound',
        },
        summary: {
            type: String,
            required: [true, 'Interaction summary is required'],
            trim: true,
        },
        duration: {
            type: Number, // minutes
            default: null,
        },
        scheduledAt: { type: Date, default: null },
        completedAt: { type: Date, default: null },
        outcome: {
            type: String,
            enum: ['Positive', 'Neutral', 'Negative'],
            default: 'Neutral',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

interactionSchema.index({ leadId: 1, createdAt: -1 });

const Interaction = mongoose.model('Interaction', interactionSchema);

export default Interaction;
