import express from 'express';
import { 
  submitApplication, 
  getCandidateApplications,
  withdrawApplication 
} from '../controllers/applicationController.js';
import { 
  updateApplicationStatus, 
  getHRPipeline 
} from '../controllers/hrController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// --- CANDIDATE ROUTES ---

// Submit a new application
router.post('/apply', protect, authorize(ROLES.CANDIDATE), submitApplication);

// Get applications for the logged-in candidate ("My Applications" page)
router.get('/my-applications', protect, authorize(ROLES.CANDIDATE), getCandidateApplications);

// Shared Delete Route: Candidate can withdraw, HR/Admin can remove from pipeline
router.delete('/:id', protect, authorize(ROLES.CANDIDATE, ROLES.HR, ROLES.ADMIN), withdrawApplication);


// --- HR & ADMIN ROUTES ---

// Get all applications for the Kanban board ("Hiring Pipeline" page)
router.get('/pipeline', protect, authorize(ROLES.HR, ROLES.ADMIN), getHRPipeline);

// Update status (Used by Journey Manager / Stepper)
router.put('/:id/status', protect, authorize(ROLES.HR, ROLES.ADMIN), updateApplicationStatus);

export default router;