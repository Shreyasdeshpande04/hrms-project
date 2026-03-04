import mongoose from 'mongoose';

const interviewSchema = mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  scheduledTime: { type: Date, required: true },
  duration: { type: Number, default: 30 }, // minutes
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Recruiters/Interviewers
  meetingLink: { type: String },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'], 
    default: 'Scheduled' 
  },
  feedbacks: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    notes: String
  }]
}, { timestamps: true });

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;