import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    paymentPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentPlan',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    paidDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Transfer', 'Online'],
        default: 'Cash'
    },
    receiptNumber: {
        type: String,
        trim: true
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
