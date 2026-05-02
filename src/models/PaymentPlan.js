import mongoose from 'mongoose';

const paymentPlanSchema = new mongoose.Schema({
    enrollmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    discountReason: {
        type: String,
        trim: true
    },
    netAmount: {
        type: Number,
        required: true
    },
    installmentCount: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true,
    versionKey: false
});

const PaymentPlan = mongoose.model('PaymentPlan', paymentPlanSchema);

export default PaymentPlan;
