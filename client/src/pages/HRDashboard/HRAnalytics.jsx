import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from './HRAnalytics.module.css';
import tableStyles from '../../features/admin/AdminTable.module.css'; // Using the professional vertical menu styles
import { exportData } from '../../utils/exportUtils'; // Imported Export Utility

const HRAnalytics = () => {
  const [stats, setStats] = useState({ 
    activeJobs: 0, 
    totalApplications: 0, 
    hires: 0 
  });
  const [loading, setLoading] = useState(true);
  const [showExport, setShowExport] = useState(false); // NEW: Export Toggle State

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Calls the unlocked stats route
        const { data } = await api.get('/admin/stats'); 
        
        setStats({
          activeJobs: data.activeJobs || 0,
          totalApplications: data.totalApplications || 0,
          hires: data.hires || 0
        });
      } catch (err) {
        console.error("Analytics Fetch Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className={styles.container}><h3>Loading Analytics...</h3></div>;

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Recruitment Analytics</h2>

        {/* --- NEW: VERTICAL EXPORT DROPDOWN --- */}
    
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <h4>Active Jobs</h4>
          <p className={styles.number}>{stats.activeJobs}</p>
        </div>
        <div className={styles.card}>
          <h4>Total Applicants</h4>
          <p className={styles.number}>{stats.totalApplications}</p>
        </div>
        <div className={styles.card}>
          <h4>Total Hires</h4>
          <p className={styles.number} style={{color: '#10b981'}}>{stats.hires}</p>
        </div>
      </div>
    </div>
  );
};

export default HRAnalytics;