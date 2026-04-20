import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    courseInterest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    source: {
      type: String,
      enum: ['Website', 'Phone', 'Facebook', 'Instagram', 'Referral', 'Walk-in'],
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
    utmSource: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  },{
    versionKey: false,
  }
);

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;