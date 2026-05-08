import AuditLog from '../models/AuditLog.js';

/**
 * Computes field-level diff between two plain objects.
 * Returns only fields that changed.
 */
const diff = (oldObj, newObj) => {
    const changes = [];
    const keys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);
    keys.forEach((field) => {
        const oldVal = oldObj?.[field];
        const newVal = newObj?.[field];
        const oldStr = JSON.stringify(oldVal);
        const newStr = JSON.stringify(newVal);
        if (oldStr !== newStr) {
            changes.push({ field, oldValue: oldVal, newValue: newVal });
        }
    });
    return changes;
};

export const logCreate = async ({ entityType, entityId, changedBy, ip }) => {
    await AuditLog.create({ entityType, entityId, action: 'create', changedBy, ip, changes: [] });
};

export const logUpdate = async ({ entityType, entityId, changedBy, oldData, newData, ip }) => {
    const changes = diff(oldData, newData);
    if (changes.length === 0) return;
    await AuditLog.create({ entityType, entityId, action: 'update', changedBy, ip, changes });
};

export const logDelete = async ({ entityType, entityId, changedBy, ip }) => {
    await AuditLog.create({ entityType, entityId, action: 'delete', changedBy, ip, changes: [] });
};

export const getAuditTrail = async (entityType, entityId) => {
    return AuditLog.find({ entityType, entityId })
        .populate('changedBy', 'firstName lastName email role')
        .sort({ createdAt: -1 })
        .lean();
};
