import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Department from '../models/Department.js';

export const getDashboardStats = async (req, res) => {
  try {
    const roleStats = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
    const pieData = roleStats.map(item => ({ name: item._id, value: item.count }));

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0 = Jan, 1 = Feb, etc.

    const monthlyStats = await Application.aggregate([
      { $match: { createdAt: { $gte: new Date(`${currentYear}-01-01`) } } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // ONLY include months up to the current month
    const lineData = months.slice(0, currentMonth + 1).map((month, index) => {
      const found = monthlyStats.find(item => item._id === index + 1);
      return { month, value: found ? found.count : 0 };
    });

    res.json({
      totalUsers: await User.countDocuments(),
      totalDepts: await Department.countDocuments(),
      activeJobs: await Job.countDocuments({ status: 'PUBLISHED' }),
      pieData,
      lineData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};