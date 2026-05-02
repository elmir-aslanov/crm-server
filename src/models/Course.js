import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    durationMonths: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    syllabus: {
        type: mongoose.Schema.Types.Mixed, // JSON structure for topics
        default: []
    }
}, {
    timestamps: true,
    versionKey: false
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
