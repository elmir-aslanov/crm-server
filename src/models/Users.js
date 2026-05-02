import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['Admin', 'Manager', 'Teacher', 'Accountant', 'Student'], default: 'Manager' },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
}, {
  timestamps: true,
  versionKey: false,
});

const User = mongoose.model('User', userSchema);

export default User;
