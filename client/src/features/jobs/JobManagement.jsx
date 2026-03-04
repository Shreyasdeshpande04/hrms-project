import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from '../admin/AdminTable.module.css'; // Shared ERP styles
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { exportData } from '../../utils/exportUtils';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [depts, setDepts] = useState([]);
  
  // Modal & Feedback States
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedback, setFeedback] = useState(null); 
  const [showExport, setShowExport] = useState(false); 
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [formData, setFormData] = useState({
    title: '', location: '', departmentId: '', workType: 'Remote',
    salary: '', hiringProcess: '', description: '', jdFileName: ''
  });

  const fetchData = async () => {
    try {
      const [jobsRes, deptsRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/admin/departments')
      ]);
      setJobs(jobsRes.data);
      setDepts(deptsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => setFormData({ 
        ...formData, 
        description: event.target.result,
        jdFileName: file.name 
      });
      reader.readAsText(file);
    }
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData({ title: '', location: '', departmentId: '', workType: 'Remote', salary: '', hiringProcess: '', description: '', jdFileName: '' });
    setShowFormModal(true);
  };

  const handleEditClick = (job) => {
    setIsEditMode(true);
    setSelectedJob(job);
    setFormData({
      title: job.title,
      location: job.location,
      departmentId: job.departmentId?._id || job.departmentId,
      workType: job.workType || 'Remote',
      salary: job.salary,
      hiringProcess: job.hiringProcess,
      description: job.description,
      jdFileName: job.jdFileName || 'existing_document.txt'
    });
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description) {
        setFeedback({ type: 'error', msg: 'Please upload a Job Description file (.txt).' });
        return;
    }
    try {
      if (isEditMode) {
        await api.put(`/jobs/${selectedJob._id}`, formData);
        setFeedback({ type: 'success', msg: 'Job details updated and synchronized.' });
      } else {
        const jobData = { ...formData, status: 'PUBLISHED', stages: [
          { name: 'Applied', order: 1 }, { name: 'Screening', order: 2 },
          { name: 'Interview', order: 3 }, { name: 'Hired', order: 4 }
        ]};
        await api.post('/jobs', jobData);
        setFeedback({ type: 'success', msg: 'Job successfully published to the portal.' });
      }
      setShowFormModal(false);
      fetchData(); 
    } catch (err) { 
      setFeedback({ type: 'error', msg: 'Failed to process request.' });
    }
  };

  const triggerDeleteModal = (job) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const handleFinalDelete = async () => {
    try {
      await api.delete(`/jobs/${selectedJob._id}`);
      setFeedback({ type: 'success', msg: 'Job posting has been removed.' });
      setShowDeleteModal(false);
      fetchData();
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Deletion failed.' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.erpHeader} style={{ marginBottom: '40px' }}>
        <div>
          <h1 className={styles.mainTitle}>Active Job Openings</h1>
          <p className={styles.subTitle}>Enterprise Recruitment Control Panel</p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Button onClick={handleOpenCreate}>+ Post New Job</Button>
        
        </div>
      </div>

      {showFormModal && (
        <div className={styles.erpModalOverlay}>
          <div className={styles.erpModalBox} style={{ width: '850px', padding: '50px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                {isEditMode ? "Edit Position Details" : "Create New Position"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div className={styles.inputWrapper}>
                  <label className={styles.customLabel}>Job Title *</label>
                  <input className={styles.erpInput} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className={styles.inputWrapper}>
                  <label className={styles.customLabel}>Salary Range *</label>
                  <input className={styles.erpInput} value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '10px' }}>
                <div className={styles.inputWrapper}>
                  <label className={styles.customLabel}>Location *</label>
                  <input className={styles.erpInput} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                </div>
                <div className={styles.inputWrapper}>
                  <label className={styles.customLabel}>Work Type</label>
                  <select className={styles.erpInput} style={{height:'55px'}} value={formData.workType} onChange={e => setFormData({...formData, workType: e.target.value})}>
                    <option value="Remote">Remote</option><option value="On-site">On-site</option><option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '10px' }}>
                <div className={styles.inputWrapper}>
                  <label className={styles.customLabel}>Target Department *</label>
                  <select className={styles.erpInput} style={{height:'55px'}} value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} required>
                    <option value="">-- Select --</option>
                    {depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
                <div className={styles.inputWrapper}>
                  <label className={styles.customLabel}>JD File (.txt) *</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="file" accept=".txt" onChange={handleFileUpload} />
                    {isEditMode && <span style={{fontSize:'11px', color:'#10b981', fontWeight:'700'}}>✅ {formData.jdFileName}</span>}
                  </div>
                </div>
              </div>
              <div className={styles.inputWrapper} style={{marginTop: '10px'}}>
                <label className={styles.customLabel}>Hiring Process Timeline</label>
                <textarea className={styles.proTextarea} value={formData.hiringProcess} onChange={e => setFormData({...formData, hiringProcess: e.target.value})} />
              </div>
              <div className={styles.modalActions}>
                <Button variant="outline" onClick={() => setShowFormModal(false)}>Discard</Button>
                <Button type="submit">{isEditMode ? "Save Changes" : "Publish Job"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.erpModalOverlay}>
          <div className={styles.erpDeleteBox}>
            <div className={styles.warningIconCircle}>!</div>
            <h2>Delete Opening?</h2>
            <p>"{selectedJob?.title}" will be removed.</p>
            <div className={styles.erpBtnGroup}>
              <button className={styles.erpConfirmBtn} onClick={handleFinalDelete}>Yes, delete it!</button>
              <button className={styles.erpCancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {feedback && (
        <div className={styles.erpModalOverlay}>
          <div className={styles.feedbackBox}>
            <div className={feedback.type === 'success' ? styles.successIcon : styles.warningIconCircle}>
              {feedback.type === 'success' ? '✓' : '!'}
            </div>
            <h2>{feedback.type === 'success' ? 'Success!' : 'Error'}</h2>
            <p style={{margin:'20px 0', fontSize:'1.1rem'}}>{feedback.msg}</p>
            <Button fullWidth onClick={() => setFeedback(null)}>Continue</Button>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr><th>SR NO.</th><th>JOB TITLE</th><th>DEPARTMENT</th><th>SALARY</th><th>ACTIONS</th></tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr key={job._id}>
                <td>{index + 1}</td>
                <td><strong>{job.title}</strong></td>
                <td><span className={styles.roleTag}>{job.departmentId?.name || 'General'}</span></td>
                <td>{job.salary}</td>
                <td className={styles.actionBtns}>
                  <button className={styles.proEditBtn} onClick={() => handleEditClick(job)}>Edit</button>
                  <button className={styles.proDeleteBtn} onClick={() => triggerDeleteModal(job)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobManagement;