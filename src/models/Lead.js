import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    courseInterest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null
    },
    source: {
      type: String,
      enum: ['Website', 'Phone', 'Facebook', 'Instagram', 'Refarral', 'Walk-in'],
      default: 'Website',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Interested', 'Trial', 'Enrolled', 'Lost'],
      default: 'New',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    utmSource:{
      type: String,
      trim: true,
      deafult:null,
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
