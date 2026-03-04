import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './JobPortal.module.css';
import tableStyles from '../admin/AdminTable.module.css';
import Button from '../../components/Common/Button';
import { exportData } from '../../utils/exportUtils';

const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' or 'apply'
  const [feedback, setFeedback] = useState(null); // Success/Error state
  const [showExport, setShowExport] = useState(false);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/applications/my-applications')
      ]);
      setJobs(jobsRes.data);
      setMyApplications(appsRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApplyFinal = async () => {
    try {
      await api.post('/applications/apply', { jobId: selectedJob._id });
      setModalMode(null);
      // REPLACED ALERT WITH FEEDBACK MODAL
      setFeedback({ type: 'success', msg: `Application for ${selectedJob.title} has been successfully transmitted to HR.` });
      fetchData();
    } catch (err) {
      setFeedback({ type: 'error', msg: err.response?.data?.message || "Failed to submit application." });
    }
  };

  const getStatus = (id) => {
    const found = myApplications.find(a => (a.jobId?._id === id || a.jobId === id));
    return found ? found.currentStage : null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1>Open Career Opportunities</h1>

      </div>

      <div className={styles.jobGrid}>
        {jobs.map(job => {
          const status = getStatus(job._id);
          return (
            <div key={job._id} className={styles.jobCard}>
              <div className={styles.deptBadge}>{job.departmentId?.name}</div>
              <h3>{job.title}</h3>
              <p className={styles.infoLine}>📍 {job.location} • 💼 {job.workType}</p>
              {/* SALARY SHOWN ON CARD */}
              <p className={styles.salaryText}>💰 {job.salary}</p>
              <div className={styles.cardFooter}>
                <Button variant="outline" size="sm" onClick={() => { setSelectedJob(job); setModalMode('view'); }}>View Details</Button>
                {status ? <span className={styles.statusLabel}>{status}</span> : <Button size="sm" onClick={() => { setSelectedJob(job); setModalMode('apply'); }}>Apply Now</Button>}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- PROFESSIONAL DUAL MODAL --- */}
      {selectedJob && modalMode && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContentLarge}>
            <div className={styles.modalHeader}>
              <div>
                <h2>{selectedJob.title}</h2>
                <p className={styles.modalSub}>{selectedJob.departmentId?.name} • {selectedJob.location}</p>
              </div>
              <button className={styles.closeX} onClick={() => setModalMode(null)}>×</button>
            </div>
            
            <div className={styles.modalBodyScroll}>
              {modalMode === 'view' ? (
                <div className={styles.jdContainer}>
                  {/* SALARY ADDED TO DETAILS */}
                  <div className={styles.detailStrip}>
                      <span><strong>Salary:</strong> {selectedJob.salary}</span>
                      <span><strong>Work Type:</strong> {selectedJob.workType}</span>
                  </div>
                  <div className={styles.sectionHeading}>📋 Job Description</div>
                  <div className={styles.jdText}>{selectedJob.description}</div>
                </div>
              ) : (
                <div className={styles.applyConfirm}>
                  <h3>Confirm Submission</h3>
                  <div className={styles.infoBox}>
                    <p>Job: <strong>{selectedJob.title}</strong></p>
                    <p>Package: <strong>{selectedJob.salary}</strong></p>
                  </div>
                  <Button fullWidth onClick={handleApplyFinal}>Confirm & Submit Application</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SUCCESS / ERROR FEEDBACK MODAL --- */}
      {feedback && (
        <div className={tableStyles.erpModalOverlay}>
          <div className={tableStyles.feedbackBox}>
            <div className={feedback.type === 'success' ? tableStyles.successIcon : tableStyles.warningIconCircle}>
              {feedback.type === 'success' ? '✓' : '!'}
            </div>
            <h2>{feedback.type === 'success' ? 'Submission Successful' : 'System Alert'}</h2>
            <p style={{margin: '20px 0', color: '#64748b'}}>{feedback.msg}</p>
            <Button fullWidth onClick={() => setFeedback(null)}>Continue Browsing</Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default JobPortal;