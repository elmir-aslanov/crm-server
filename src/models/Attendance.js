import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    enrollmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Excused'],
        required: true
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    note: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
