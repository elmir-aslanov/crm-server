import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Müəllimin adı vacibdir'],
        trim: true
    },
    surname: {
        type: String,
        required: [true, 'Müəllimin soyadı vacibdir'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email ünvanı vacibdir'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Düzgün email formatı daxil edin']
    },
    subject: {
        type: String,
        required: [true, 'Tədris etdiyi fənn qeyd edilməlidir']
    },
    experienceYears: {
        type: Number,
        required: [true, 'Təcrübə ili vacibdir'],
        min: [0, 'Təcrübə ili mənfi ola bilməz']
    },
    salary: {
        type: Number,
        required: [true, 'Maaş qeyd edilməlidir']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;