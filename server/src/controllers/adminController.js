import User from '../models/User.js';
import Department from '../models/Department.js';
import { logAction } from '../utils/logger.js';

// @desc    Get all users (excluding passwords)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new department
// @route   POST /api/admin/departments
export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const dept = await Department.create({ name });
    
    // Detailed Audit Log
    await logAction(req, "CREATE", "Department", `Created new department: ${name}`);
    
    res.status(201).json(dept);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an existing department
// @route   PUT /api/admin/departments/:id
export const updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (dept) {
      const oldName = dept.name;
      dept.name = req.body.name || dept.name;
      const updatedDept = await dept.save();
      
      await logAction(req, "UPDATE", "Department", `Renamed department from ${oldName} to ${dept.name}`);
      res.json(updatedDept);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a department
// @route   DELETE /api/admin/departments/:id
export const deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (dept) {
      const deptName = dept.name;
      await dept.deleteOne();
      
      await logAction(req, "DELETE", "Department", `Deleted department: ${deptName}`);
      res.json({ message: 'Department removed' });
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a user profile (Admin or Self)
// @route   PUT /api/admin/users/:id
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Security Check: Only Admin or the specific User can edit this profile
      if (req.user.role !== 'ADMIN' && req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "Access Denied: Not authorized to update this profile." });
      }

      // 1. Update basic information
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // 2. Map all Professional/ERP fields strictly
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;
      user.jobTitle = req.body.jobTitle !== undefined ? req.body.jobTitle : user.jobTitle;
      user.company = req.body.company !== undefined ? req.body.company : user.company;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.linkedinLink = req.body.linkedinLink !== undefined ? req.body.linkedinLink : user.linkedinLink;
      user.githubLink = req.body.githubLink !== undefined ? req.body.githubLink : user.githubLink;
      user.portfolioLink = req.body.portfolioLink !== undefined ? req.body.portfolioLink : user.portfolioLink;

      const updatedUser = await user.save();
      
      // Detailed Audit Log
      await logAction(req, "UPDATE", "User", `Updated profile details for: ${updatedUser.email}`);

      // 3. Return the full updated object so frontend local storage stays in sync
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        jobTitle: updatedUser.jobTitle,
        company: updatedUser.company,
        location: updatedUser.location,
        linkedinLink: updatedUser.linkedinLink,
        githubLink: updatedUser.githubLink,
        portfolioLink: updatedUser.portfolioLink
      });
    } else {
      res.status(404).json({ message: 'User record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user account
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Safety Lock: Prevent an Admin from deleting their own active session
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        message: "Security Protocol: You cannot delete your own Administrative account while logged in." 
      });
    }

    const userName = user.name;
    const userEmail = user.email;
    
    await user.deleteOne();

    // Log the high-level action
    await logAction(req, "DELETE", "User", `Admin permanently removed user: ${userName} (${userEmail})`);

    res.json({ message: 'User record successfully removed from the system.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};