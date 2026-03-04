
import mongoose from 'mongoose';
import { APPLICATION_STATUS } from '../constants/status.js';

const applicationSchema = mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentStage: { 
    type: String, 
    enum: Object.values(APPLICATION_STATUS), 
    default: APPLICATION_STATUS.APPLIED 
  },
  resumeUrl: { type: String },
  scores: [{
    interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: Number,
    comment: String
  }],
  statusHistory: [{
    stage: String,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;