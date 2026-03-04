import mongoose from 'mongoose';
import { JOB_STATUS } from '../constants/status.js';

const jobSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  location: { type: String, required: true },
  workType: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'On-site' },
  experienceLevel: { type: String },
  // Add this line to your jobSchema
jdFileName: { type: String, default: '' },
  salary: { type: String, required: true },
hiringProcess: { type: String }, // e.g. "1. Screening 2. Technical 3. HR"
description: { type: String }, // This will store the text from the uploaded .txt file
  salaryRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  openings: { type: Number, default: 1 },
  status: { 
    type: String, 
    enum: Object.values(JOB_STATUS), 
    default: JOB_STATUS.DRAFT 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stages: [{
    name: { type: String, required: true },
    order: { type: Number, required: true }
  }]
}, { timestamps: true });


const Job = mongoose.model('Job', jobSchema);
export default Job;