// server/src/controllers/applicationController.js
import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Submit a new job application
export const submitApplication = async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });

    const alreadyApplied = await Application.findOne({ jobId, candidateId });
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this position." });
    }

    const application = await Application.create({
      jobId,
      candidateId,
      currentStage: 'APPLIED'
    });

    res.status(201).json({ message: "Application submitted!", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for a candidate
export const getCandidateApplications = async (req, res) => {
  try {
    const apps = await Application.find({ candidateId: req.user._id })
      .populate('jobId')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for HR Pipeline
export const getHRPipeline = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('candidateId', 'name email phone bio skills')
      .populate('jobId', 'title location salary');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { currentStage: status },
      { new: true }
    );
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Withdraw or Delete application (FIXED FOR HR)
// @route   DELETE /api/applications/:id
export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application record not found" });
    }

    // --- FIXED SECURITY LOGIC ---
    const isOwner = application.candidateId.toString() === req.user._id.toString();
    const isAdminOrHR = req.user.role === 'ADMIN' || req.user.role === 'HR';

    if (!isOwner && !isAdminOrHR) {
      return res.status(403).json({ 
        message: "Access Denied: You do not have permission to remove this record." 
      });
    }

    await application.deleteOne();
    res.json({ message: "Application record successfully removed from the system." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};