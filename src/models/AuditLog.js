import mongoose from 'mongoose';

const changeSchema = new mongoose.Schema(
    {
        field: { type: String, required: true },
        oldValue: { type: mongoose.Schema.Types.Mixed },
        newValue: { type: mongoose.Schema.Types.Mixed },
    },
    { _id: false }
);

const auditLogSchema = new mongoose.Schema(
    {
        entityType: { type: String, required: true, index: true },
        entityId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
        action: {
            type: String,
            enum: ['create', 'update', 'delete'],
            required: true,
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        changes: [changeSchema],
        ip: { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
