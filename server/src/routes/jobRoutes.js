// server/src/routes/jobRoutes.js
import express from 'express';
import { createJob, getJobs, getJobById, updateJob } from '../controllers/jobController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { ROLES } from '../constants/roles.js';
import Job from '../models/Job.js'; 

const router = express.Router();

// Routes for /api/jobs
router.route('/')
  .get(getJobs) // PUBLIC: No 'protect' here so jobs always show up for candidates
  .post(protect, authorize(ROLES.ADMIN, ROLES.HR), createJob);

// Routes for /api/jobs/:id
router.route('/:id')
  .get(getJobById) // PUBLIC
  .put(protect, authorize(ROLES.HR, ROLES.ADMIN), updateJob) // FIXED: Added Edit route
  .delete(protect, authorize(ROLES.HR, ROLES.ADMIN), async (req, res) => {
     try {
       const job = await Job.findById(req.params.id);
       if (job) {
         await job.deleteOne();
         res.json({ message: 'Job opening removed successfully' });
       } else {
         res.status(404).json({ message: 'Job post not found' });
       }
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
  });

export default router;