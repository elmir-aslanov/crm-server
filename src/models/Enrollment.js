import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Withdrawn', 'Transferred'],
        default: 'Active'
    },
    finalGrade: {
        type: Number,
        default: null
    },
    certificateIssued: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
