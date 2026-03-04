import mongoose from 'mongoose';

const auditLogSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., "UPDATE_JOB", "DELETE_CANDIDATE"
  targetType: { type: String, required: true }, // e.g., "Application", "Job"
  targetId: { type: mongoose.Schema.Types.ObjectId },
  changes: { type: Object }, // Before and After state
  ipAddress: { type: String }
}, { timestamps: true });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;