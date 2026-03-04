import express from 'express';
import { 
  getAllUsers, 
  createDepartment, 
  updateDepartment, // <--- 1. ADDED THIS IMPORT
  deleteUser, 
  deleteDepartment,
  updateUser 
} from '../controllers/adminController.js';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { ROLES } from '../constants/roles.js';
import Department from '../models/Department.js';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

// ==========================================
// 1. SHARED ROUTES (Allowed for Admin, HR, and CANDIDATES)
// These MUST be above the "ADMIN ONLY" wall
// ==========================================

// Allow all roles to see stats and departments (needed for HR dashboards/Job posts)
router.get('/stats', protect, authorize(ROLES.ADMIN, ROLES.HR), getDashboardStats);

router.get('/departments', protect, authorize(ROLES.ADMIN, ROLES.HR), async (req, res) => {
  try {
    const depts = await Department.find().sort({ createdAt: -1 });
    res.json(depts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// FIXED: Move updateUser here so CANDIDATES can update their own profiles
router.put('/users/:id', protect, authorize(ROLES.ADMIN, ROLES.HR, ROLES.CANDIDATE), updateUser);


// ==========================================
// 2. THE WALL (Middleware)
// Everything below this line is strictly for ADMIN only
// ==========================================
router.use(protect, authorize(ROLES.ADMIN));

// User Management (Admin can view all and delete)
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Department Writing/Deleting (Admin only)
router.post('/departments', createDepartment);
router.put('/departments/:id', updateDepartment); // <--- 2. ADDED THIS ROUTE
router.delete('/departments/:id', deleteDepartment);

// Audit Logs (Admin only)
router.get('/logs', async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;