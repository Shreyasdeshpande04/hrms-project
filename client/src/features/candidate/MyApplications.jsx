import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from '../admin/AdminTable.module.css';
import Button from '../../components/Common/Button';
import { exportData } from '../../utils/exportUtils';

const MyApplications = () => {
  const [apps, setApps] = useState([]);
  const [showExport, setShowExport] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApps = async () => {
    try {
      const { data } = await api.get('/applications/my-applications');
      setApps(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchApps(); }, []);

  const triggerWithdrawModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleFinalWithdraw = async () => {
    try {
      await api.delete(`/applications/${selectedApp._id}`);
      setIsModalOpen(false);
      fetchApps();
    } catch (err) { alert("Error withdrawing"); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.erpHeader}>
        <div>
          <h2 style={{fontSize: '2.4rem', fontWeight: '900'}}>My Journey</h2>
          <p style={{fontSize: '1.1rem', color: '#64748b'}}>Tracking your professional milestones.</p>
        </div>

      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{width: '80px'}}>SR NO.</th> {/* NEW COLUMN */}
              <th>OPPORTUNITY</th>
              <th>STATUS</th>
              <th>APPLIED DATE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a, index) => (
              <tr key={a._id}>
                <td style={{fontWeight: '700', color: '#94a3b8'}}>{index + 1}</td> {/* SR NO LOGIC */}
                <td><strong>{a.jobId?.title}</strong></td>
                <td><span className={styles.roleTag}>{a.currentStage}</span></td>
                <td>{new Date(a.createdAt).toLocaleDateString('en-GB')}</td>
                <td>
                  <button className={styles.deleteBtn} onClick={() => triggerWithdrawModal(a)}>Withdraw</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ERP DELETE MODAL */}
      {isModalOpen && (
        <div className={styles.erpModalOverlay}>
          <div className={styles.erpDeleteBox}>
            <div className={styles.warningIconCircle}>!</div>
            <h2 className={styles.deleteTitle}>Delete?</h2>
            <p className={styles.deleteText}>"{selectedApp?.jobId?.title}" will be removed.</p>
            <div className={styles.erpBtnGroup}>
              <button className={styles.erpConfirmBtn} onClick={handleFinalWithdraw}>Yes, delete it!</button>
              <button className={styles.erpCancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;