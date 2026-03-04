import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './HRDashboard.module.css';
import tableStyles from '../../features/admin/AdminTable.module.css';
import Stepper from '../../components/Common/Stepper';
import Button from '../../components/Common/Button';

const HRDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tempStatus, setTempStatus] = useState(null); 
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type, msg }

  const stages = ['APPLIED', 'SCREENING', 'INTERVIEW', 'HIRED'];

  const fetchApps = async () => {
    try {
      const { data } = await api.get('/applications/pipeline');
      setApplications(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchApps(); }, []);

  const handleOpenManager = (app) => {
    setSelectedApp(app);
    setTempStatus(app.currentStage); 
  };

  // --- LOGIC 1: SUCCESS MODAL FOR JOURNEY CHANGE ---
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await api.put(`/applications/${selectedApp._id}/status`, { status: tempStatus });
      const candidateName = selectedApp.candidateId?.name;
      const newStatus = tempStatus;
      
      setSelectedApp(null);
      fetchApps();
      
      // TRIGGER THE SUCCESS MODAL
      setFeedback({ 
        type: 'success', 
        msg: `Status of ${candidateName} successfully changed to ${newStatus}.` 
      });
    } catch (err) {
      setFeedback({ type: 'error', msg: "Failed to update journey stage." });
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOGIC 2: FIX FOR 403 DELETE ERROR ---
  const handleFinalDelete = async () => {
    try {
      await api.delete(`/applications/${selectedApp._id}`);
      setShowDeleteModal(false);
      setSelectedApp(null);
      fetchApps();
      setFeedback({ type: 'success', msg: "Candidate removed from pipeline successfully." });
    } catch (err) { 
      setFeedback({ 
        type: 'error', 
        msg: err.response?.data?.message || "System error: Permission denied for removal." 
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1>Candidate Management</h1>
      
      <div className={tableStyles.tableContainer}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>CANDIDATE</th>
              <th>APPLIED FOR</th>
              <th>STAGE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td><strong>{app.candidateId?.name}</strong></td>
                <td>{app.jobId?.title}</td>
                <td><span className={tableStyles.roleTag}>{app.currentStage}</span></td>
                <td className={tableStyles.actionBtns}>
                  <button className={tableStyles.proEditBtn} onClick={() => handleOpenManager(app)}>
                    Edit Journey
                  </button>
                  <button className={tableStyles.proDeleteBtn} onClick={() => { setSelectedApp(app); setShowDeleteModal(true); }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* JOURNEY EDIT MODAL */}
      {selectedApp && !showDeleteModal && (
        <div className={styles.erpModalOverlay}>
          <div className={tableStyles.erpModalBox} style={{maxWidth:'700px'}}>
            <h2>Journey Manager: {selectedApp.candidateId?.name}</h2>
            <div className={styles.stepperBox}>
              <Stepper stages={stages} currentStage={tempStatus} onStageClick={setTempStatus} />
            </div>
            <div className={tableStyles.modalActions}>
              <Button variant="outline" onClick={() => setSelectedApp(null)}>Cancel</Button>
              <Button onClick={handleSaveChanges} isLoading={isSaving}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className={tableStyles.erpModalOverlay}>
          <div className={tableStyles.erpDeleteBox}>
            <div className={tableStyles.warningIconCircle}>!</div>
            <h2>Remove Application?</h2>
            <p>Delete application of <strong>{selectedApp?.candidateId?.name}</strong>?</p>
            <div className={tableStyles.erpBtnGroup}>
              <button className={tableStyles.erpConfirmBtn} onClick={handleFinalDelete}>Yes, Remove</button>
              <button className={tableStyles.erpCancelBtn} onClick={() => {setShowDeleteModal(false); setSelectedApp(null);}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* --- FEEDBACK SUCCESS MODAL --- */}
      {feedback && (
        <div className={tableStyles.erpModalOverlay}>
          <div className={tableStyles.feedbackBox}>
            <div className={feedback.type === 'success' ? tableStyles.successIcon : tableStyles.warningIconCircle}>
              {feedback.type === 'success' ? '✓' : '!'}
            </div>
            <h3>{feedback.type === 'success' ? 'Update Successful' : 'Error'}</h3>
            <p style={{margin: '20px 0'}}>{feedback.msg}</p>
            <Button fullWidth onClick={() => setFeedback(null)}>Continue</Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default HRDashboard;