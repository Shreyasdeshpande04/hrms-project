import mongoose from 'mongoose';

const departmentSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Dept Head
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);
export default Department;