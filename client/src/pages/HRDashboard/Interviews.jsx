import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from '../../features/admin/AdminTable.module.css'; 
import Button from '../../components/Common/Button';
import { jsPDF } from "jspdf";
import { exportData } from '../../utils/exportUtils';

const Interviews = () => {
  const [candidates, setCandidates] = useState([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [offerText, setOfferText] = useState("");
  const [showExport, setShowExport] = useState(false);

  const fetchCandidates = async () => {
    try {
      const { data } = await api.get('/applications/pipeline');
      const activeStages = ['APPLIED', 'SCREENING', 'INTERVIEW', 'HIRED'];
      const filtered = data.filter(app => activeStages.includes(app.currentStage));
      setCandidates(filtered);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleAppliedEmail = (app) => {
    const subject = encodeURIComponent(`Application Received: ${app.jobId?.title}`);
    const body = encodeURIComponent(`Dear ${app.candidateId?.name},\n\nThank you for applying. We have received your resume successfully.\n\nBest Regards,\nHR Team`);
    window.location.href = `mailto:${app.candidateId?.email}?subject=${subject}&body=${body}`;
  };

  const handleScreeningEmail = (app) => {
    const subject = encodeURIComponent(`Screening Scheduled: ${app.jobId?.title}`);
    const body = encodeURIComponent(`Dear ${app.candidateId?.name},\n\nWe are pleased to move you to Screening.\n\nDate: [Date]\nTime: [Time]\n\nBest Regards,\nHR Team`);
    window.location.href = `mailto:${app.candidateId?.email}?subject=${subject}&body=${body}`;
  };

  const handleInterviewEmail = (app) => {
    const subject = encodeURIComponent(`Interview Call: ${app.jobId?.title}`);
    const body = encodeURIComponent(`Dear ${app.candidateId?.name},\n\nWe invite you for an INTERVIEW.\n\nDate: [Date]\nTime: [Time]\nLink: [Link]\n\nBest Regards,\nHR Team`);
    window.location.href = `mailto:${app.candidateId?.email}?subject=${subject}&body=${body}`;
  };

  const handleOpenOfferModal = (app) => {
    setSelectedApp(app);
    const template = 
`LETTER OF OFFER

Date: ${new Date().toLocaleDateString()}

To: ${app.candidateId?.name}
Subject: Offer for ${app.jobId?.title}

Dear ${app.candidateId?.name},

We are delighted to offer you a full-time position as ${app.jobId?.title}. 

Position Details:
- Department: ${app.jobId?.departmentId?.name || 'General'}
- Location: ${app.jobId?.location}
- Salary: ${app.jobId?.salary}

Please find the attached PDF for full terms.

Sincerely,
ModernHR Team`;

    setOfferText(template);
    setShowOfferModal(true);
  };

  // --- FIXED LOGIC: DOWNLOAD + AUTO-OPEN EMAIL ---
  const generateAndSendOffer = () => {
    // 1. Generate and Download PDF
    const doc = new jsPDF();
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text("ModernHR Global Inc.", 105, 20, { align: 'center' }); 
    doc.line(20, 25, 190, 25);
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    const splitText = doc.splitTextToSize(offerText, 170);
    doc.text(splitText, 20, 40);
    
    // Trigger Download
    doc.save(`Offer_Letter_${selectedApp.candidateId?.name}.pdf`);

    // 2. WAIT 1.5 SECONDS THEN OPEN EMAIL APP
    // This delay prevents the browser from blocking the "mailto:" command
    setTimeout(() => {
      const subject = encodeURIComponent(`Congratulations! Official Offer: ${selectedApp.jobId?.title}`);
      const body = encodeURIComponent(
        `Dear ${selectedApp.candidateId?.name},\n\n` +
        `Congratulations! We are thrilled to welcome you to the team.\n\n` +
        `Your official Offer Letter has just been downloaded to your computer. PLEASE ATTACH THAT PDF FILE TO THIS EMAIL before sending.\n\n` +
        `We look forward to your response!\n\n` +
        `Warm Regards,\nHR Recruitment Team`
      );
      
      window.location.href = `mailto:${selectedApp.candidateId?.email}?subject=${subject}&body=${body}`;
      setShowOfferModal(false);
    }, 1500); 
  };

  return (
    <div className={styles.container}>
      <div className={styles.erpHeader}>
        <div>
          <h2>Recruitment Communication Center</h2>
          <p className={styles.subTitle}>Direct engagement and document generation hub.</p>
        </div>

     
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>CANDIDATE</th>
              <th>STATUS</th>
              <th>TARGET ROLE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length > 0 ? candidates.map(app => (
              <tr key={app._id}>
                <td><strong>{app.candidateId?.name}</strong><br/><small>{app.candidateId?.email}</small></td>
                <td>
                  <span className={styles.roleTag} style={{ background: '#f1f5f9', color: '#475569' }}>
                    ● {app.currentStage}
                  </span>
                </td>
                <td>{app.jobId?.title}</td>
                <td className={styles.actionBtns}>
                  
                  {app.currentStage === 'APPLIED' && (
                    <Button size="sm" onClick={() => handleAppliedEmail(app)}>Send "Thanks" Email</Button>
                  )}

                  {app.currentStage === 'SCREENING' && (
                    <Button size="sm" style={{backgroundColor: '#2563eb', color:'white'}} onClick={() => handleScreeningEmail(app)}>Schedule Rounds</Button>
                  )}
                  
                  {app.currentStage === 'INTERVIEW' && (
                    <button 
                      onClick={() => handleInterviewEmail(app)}
                      style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Schedule Interview
                    </button>
                  )}

                  {app.currentStage === 'HIRED' && (
                    <Button size="sm" style={{backgroundColor:'#10b981'}} onClick={() => handleOpenOfferModal(app)}>Generate PDF Offer</Button>
                  )}
                </td>
              </tr>
            )) : (
                <tr><td colSpan="4" style={{textAlign:'center', padding:'40px'}}>No active candidates.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* OFFER LETTER MODAL */}
      {showOfferModal && (
        <div className={styles.erpModalOverlay}>
          <div className={styles.erpModalBox} style={{width:'700px'}}>
            <h3>Finalize Professional Employment Offer</h3>
            <textarea 
              className={styles.proTextarea}
              style={{height:'400px', marginTop:'15px'}}
              value={offerText}
              onChange={(e) => setOfferText(e.target.value)}
            />
            <div className={styles.modalActions}>
               <Button variant="outline" onClick={() => setShowOfferModal(false)}>Cancel</Button>
               <Button onClick={generateAndSendOffer}>Download PDF & Open Email</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interviews;