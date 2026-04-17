import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Interested', 'Trial', 'Enrolled', 'Lost'],
      default: 'New',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
