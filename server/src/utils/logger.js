import AuditLog from '../models/AuditLog.js';

export const logAction = async (userId, action, targetType, targetId, changes = {}) => {
  try {
    await AuditLog.create({ userId, action, targetType, targetId, changes });
  } catch (error) {
    console.error("Logging Error:", error);
  }
};