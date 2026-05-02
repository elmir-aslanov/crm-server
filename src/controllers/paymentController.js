import Payment from '../models/Payment.js';
import PaymentPlan from '../models/PaymentPlan.js';

export const getOverduePayments = async (req, res, next) => {
    try {
        const today = new Date();
        const payments = await Payment.find({
            dueDate: { $lt: today },
            status: { $in: ['Pending', 'Overdue'] },
        })
            .populate({ path: 'paymentPlanId', populate: { path: 'enrollmentId', populate: [{ path: 'studentId' }, { path: 'groupId' }] } })
            .populate('recordedBy', 'firstName lastName role')
            .sort({ dueDate: 1 });

        res.status(200).json(payments);
    } catch (error) {
        next(error);
    }
};

export const createPayment = async (req, res, next) => {
    try {
        const { paymentPlanId, amount, dueDate, paidDate, paymentMethod, receiptNumber, status } = req.body;

        const paymentPlan = await PaymentPlan.findById(paymentPlanId);
        if (!paymentPlan) {
            return res.status(404).json({ message: 'Payment plan not found' });
        }

        const payment = await Payment.create({
            paymentPlanId,
            amount,
            dueDate,
            paidDate: paidDate || null,
            status: status || (paidDate ? 'Paid' : 'Pending'),
            paymentMethod: paymentMethod || 'Cash',
            receiptNumber,
            recordedBy: req.user?._id || null,
        });

        res.status(201).json(payment);
    } catch (error) {
        next(error);
    }
};

export const updatePaymentStatus = async (req, res, next) => {
    try {
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        next(error);
    }
};