import mongoose from 'mongoose';

const candidateSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phone: { type: String },
  resumeUrl: { type: String },
  parsedData: {
    skills: [String],
    experienceYears: Number,
    education: String,
    linkedInProfile: String
  },
  // ... existing fields
resumeData: {
    summary: String,
    experience: [{ title: String, company: String, duration: String, desc: String }],
    education: [{ school: String, degree: String, year: String }],
    skills: [String],
    links: { linkedin: String, github: String, portfolio: String }
},
// ... rest of model
  tags: [String],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
}, { timestamps: true });

const Candidate = mongoose.model('Candidate', candidateSchema);
export default Candidate;