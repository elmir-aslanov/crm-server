import mongoose from 'mongoose';

const leadStatusHistorySchema = new mongoose.Schema(
    {
        leadIt: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lead',
            required: true,
        },
        oldStatus: {
type: String,
enum: ['New', 'Contacted', 'Interested', 'Trial', 'Enrolled', 'Lost' ],
required:'True',
        },
        

    }
)