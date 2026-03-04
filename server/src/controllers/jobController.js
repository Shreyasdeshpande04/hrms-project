import Job from '../models/Job.js';

export const createJob = async (req, res) => {
  const job = new Job({ ...req.body, createdBy: req.user._id });
  const createdJob = await job.save();
  res.status(201).json(createdJob);
};

export const getJobs = async (req, res) => {
  const jobs = await Job.find({ status: 'PUBLISHED' }).populate('departmentId');
  res.json(jobs);
};

export const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (job) res.json(job);
  else res.status(404).json({ message: 'Job not found' });
};
// @desc    Update a job
// @route   PUT /api/jobs/:id
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      job.title = req.body.title || job.title;
      job.location = req.body.location || job.location;
      job.salary = req.body.salary || job.salary;
      job.workType = req.body.workType || job.workType;
      job.departmentId = req.body.departmentId || job.departmentId;
      job.description = req.body.description || job.description;
      job.hiringProcess = req.body.hiringProcess || job.hiringProcess;

      const updatedJob = await job.save();
      res.json(updatedJob);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};