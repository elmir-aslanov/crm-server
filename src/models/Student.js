import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    studentCode: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        trim: true
    },
    birthDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['Active', 'Suspended', 'Graduated', 'Dropped'],
        default: 'Active'
    }
}, {
    timestamps: true,
    versionKey: false
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
