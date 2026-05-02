import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    schedule: {
        type: mongoose.Schema.Types.Mixed, // e.g., { days: ['Mon', 'Wed', 'Fri'], time: '19:00-21:00' }
        required: true
    },
    maxCapacity: {
        type: Number,
        default: 15
    },
    status: {
        type: String,
        enum: ['Forming', 'Active', 'Completed', 'Cancelled'],
        default: 'Forming'
    },
    room: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
