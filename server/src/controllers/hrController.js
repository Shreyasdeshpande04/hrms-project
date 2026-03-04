import Application from '../models/Application.js';

export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // e.g., "INTERVIEW"

  const application = await Application.findByIdAndUpdate(
    id,
    { currentStage: status },
    { new: true }
  );
  res.json(application);
};

export const getHRPipeline = async (req, res) => {
  const applications = await Application.find().populate('candidateId jobId');
  res.json(applications);
};