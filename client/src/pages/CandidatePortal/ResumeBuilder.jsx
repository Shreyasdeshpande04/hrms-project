import React, { useState, useEffect } from 'react';
import styles from './ResumeBuilder.module.css';
import api from '../../services/api';
import useStore from '../../store/useStore';
import tableStyles from '../../features/admin/AdminTable.module.css';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { jsPDF } from "jspdf";

const ResumeBuilder = () => {
  const { userInfo, setUserInfo } = useStore();
  const [feedback, setFeedback] = useState(null);
  
  // --- STATE INITIALIZATION ---
  // We strictly use userInfo data. If not present, we use "" (Empty String)
  const [data, setData] = useState({
    name: userInfo?.name || "", 
    location: userInfo?.location || "",
    mobile: userInfo?.phone || "",
    email: userInfo?.email || "",
    linkedin: userInfo?.linkedinLink || "",
    github: userInfo?.githubLink || "",
    portfolio: userInfo?.portfolioLink || "",
    summary: userInfo?.bio || "",
    skills: userInfo?.skills || "",
    
    // Arrays start empty so new users don't see someone else's data
    experience: [],
    internships: [],
    training: [],
    projects: [],
    certifications: "",
    education: []
  });

  // Update state if userInfo loads slightly later (e.g. on page refresh)
  useEffect(() => {
    if (userInfo) {
      setData(prev => ({
        ...prev,
        name: prev.name || userInfo.name || "",
        email: prev.email || userInfo.email || "",
        mobile: prev.mobile || userInfo.phone || "",
        location: prev.location || userInfo.location || "",
        linkedin: prev.linkedin || userInfo.linkedinLink || "",
        github: prev.github || userInfo.githubLink || "",
        portfolio: prev.portfolio || userInfo.portfolioLink || "",
        summary: prev.summary || userInfo.bio || "",
        skills: prev.skills || userInfo.skills || ""
      }));
    }
  }, [userInfo]);

  // --- Dynamic Handlers ---
  const addEntry = (key, template) => setData({ ...data, [key]: [...data[key], template] });
  
  const updateEntry = (key, index, field, value) => {
    const list = [...data[key]];
    list[index][field] = value;
    setData({ ...data, [key]: list });
  };

  // --- Logic 1: Save to Profile (Database Sync) ---
  const handleSaveToProfile = async () => {
    try {
      const payload = {
        name: data.name,
        phone: data.mobile,
        location: data.location,
        bio: data.summary,
        skills: data.skills,
        linkedinLink: data.linkedin,
        githubLink: data.github,
        portfolioLink: data.portfolio
      };
      const { data: updatedUser } = await api.put(`/admin/users/${userInfo._id}`, payload);
      setUserInfo({ ...updatedUser, token: userInfo.token });
      setFeedback({ type: 'success', msg: 'Your Professional Profile has been synchronized with the database!' });
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Sync failed. Check connection.' });
    }
  };

  // --- Logic 2: Download PDF (Executive Format) ---
  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    let y = 15;

    const addHeading = (text) => {
        doc.setFont("times", "bold");
        doc.setFontSize(12);
        doc.text(text, margin, y);
        y += 1;
        doc.line(margin, y, 195, y);
        y += 6;
        doc.setFont("times", "normal");
        doc.setFontSize(10);
    };

    // Header Area
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text((data.name || "").toUpperCase(), 105, y, { align: 'center' });
    y += 5;
    doc.line(margin, y, 195, y);
    y += 7;

    // Contact Block (2 Column)
    doc.setFontSize(9);
    doc.setFont("times", "normal");
    doc.text(`Location: ${data.location}`, margin, y);
    doc.text(`Contact: ${data.mobile}`, 195, y, { align: 'right' }); y += 4;
    doc.text(`LinkedIn: ${data.linkedin}`, margin, y);
    doc.text(`GitHub: ${data.github}`, 195, y, { align: 'right' }); y += 4;
    doc.text(`Portfolio: ${data.portfolio}`, margin, y);
    doc.text(`Email: ${data.email}`, 195, y, { align: 'right' }); y += 10;

    // Content Sections
    if (data.summary) {
        addHeading("PROFESSIONAL SUMMARY");
        const summ = doc.splitTextToSize(data.summary, 180);
        doc.text(summ, margin, y);
        y += (summ.length * 5) + 5;
    }

    if (data.skills) {
        addHeading("TECHNICAL SKILLS");
        const sk = doc.splitTextToSize(data.skills, 180);
        doc.text(sk, margin, y);
        y += (sk.length * 5) + 5;
    }

    const renderList = (title, list, field1, field2, field3) => {
        if(!list || list.length === 0) return;
        addHeading(title);
        list.forEach(item => {
            doc.setFont("times", "bold");
            doc.text(item[field1] || "", margin, y);
            doc.text(item[field2] || "", 195, y, { align: 'right' }); y += 4;
            doc.setFont("times", "italic");
            doc.text(item[field3] || "", margin, y); y += 5;
            doc.setFont("times", "normal");
            const work = doc.splitTextToSize(item.work || item.desc || "", 175);
            doc.text(work, margin + 5, y);
            y += (work.length * 5) + 5;
        });
    };

    renderList("EXPERIENCE", data.experience, 'title', 'duration', 'company');
    renderList("INTERNSHIPS", data.internships, 'title', 'duration', 'company');
    renderList("TRAINING", data.training, 'title', 'duration', 'provider');

    if (data.certifications) {
        addHeading("CERTIFICATIONS");
        const certs = doc.splitTextToSize(data.certifications, 180);
        doc.text(certs, margin, y);
        y += (certs.length * 5) + 8;
    }

    if (data.education.length > 0) {
        addHeading("EDUCATION");
        data.education.forEach(edu => {
            doc.setFont("times", "bold");
            doc.text(edu.degree || "", margin, y);
            doc.text(edu.year || "", 195, y, { align: 'right' }); y += 4;
            doc.setFont("times", "normal");
            doc.text(`${edu.school || ""} | ${edu.university || ""} | ${edu.marks || ""}`, margin, y);
            y += 8;
        });
    }

    doc.save(`${data.name || "Resume"}.pdf`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.editor}>
        <h2 className={styles.title}>Resume Intelligence Tool</h2>
        
        {/* 1. Contacts */}
        <div className={styles.section}>
            <h4>1. Personal & Social Links</h4>
            <div className={styles.grid}>
                <Input label="Name" value={data.name} onChange={e=>setData({...data, name:e.target.value})}/>
                <Input label="Location" value={data.location} onChange={e=>setData({...data, location:e.target.value})}/>
                <Input label="Mobile" value={data.mobile} onChange={e=>setData({...data, mobile:e.target.value})}/>
                <Input label="Email" value={data.email} onChange={e=>setData({...data, email:e.target.value})}/>
                <Input label="LinkedIn" value={data.linkedin} onChange={e=>setData({...data, linkedin:e.target.value})}/>
                <Input label="GitHub" value={data.github} onChange={e=>setData({...data, github:e.target.value})}/>
                <Input label="Portfolio" value={data.portfolio} onChange={e=>setData({...data, portfolio:e.target.value})}/>
            </div>
        </div>

        {/* 2. Summary */}
        <div className={styles.section}>
            <h4>2. Summary</h4>
            <textarea className={styles.textareaLarge} value={data.summary} onChange={e=>setData({...data, summary:e.target.value})} placeholder="Write a brief professional summary..."/>
        </div>

        {/* 3. Skills */}
        <div className={styles.section}>
            <h4>3. Skills</h4>
            <textarea className={styles.textareaLarge} value={data.skills} onChange={e=>setData({...data, skills:e.target.value})} placeholder="e.g. React, Java, Python, Communication..."/>
        </div>

        {/* 4. Experience */}
        <div className={styles.section}>
            <div className={styles.flexRow}><h4>4. Experience</h4> <button className={styles.addBtn} onClick={()=>addEntry('experience', {company:'', title:'', duration:'', work:''})}>+ Add</button></div>
            {data.experience.length > 0 ? (
                data.experience.map((exp, i) => (
                    <div key={i} className={styles.itemBox}>
                        <Input placeholder="Company" value={exp.company} onChange={e=>updateEntry('experience', i, 'company', e.target.value)}/>
                        <Input placeholder="Title" value={exp.title} onChange={e=>updateEntry('experience', i, 'title', e.target.value)}/>
                        <Input placeholder="Duration" value={exp.duration} onChange={e=>updateEntry('experience', i, 'duration', e.target.value)}/>
                        <textarea className={styles.textareaLarge} placeholder="Describe work..." value={exp.work} onChange={e=>updateEntry('experience', i, 'work', e.target.value)}/>
                    </div>
                ))
            ) : (
                <p style={{color:'#888', fontStyle:'italic', fontSize:'0.9rem'}}>No experience added yet. Click + Add.</p>
            )}
        </div>

        {/* 5. Education */}
        <div className={styles.section}>
            <div className={styles.flexRow}><h4>5. Education</h4> <button className={styles.addBtn} onClick={()=>addEntry('education', {university:'', school:'', degree:'', marks:'', year:''})}>+ Add</button></div>
            {data.education.length > 0 ? (
                data.education.map((edu, i) => (
                    <div key={i} className={styles.itemBox}>
                        <Input placeholder="University" value={edu.university} onChange={e=>updateEntry('education', i, 'university', e.target.value)}/>
                        <Input placeholder="School" value={edu.school} onChange={e=>updateEntry('education', i, 'school', e.target.value)}/>
                        <Input placeholder="Degree" value={edu.degree} onChange={e=>updateEntry('education', i, 'degree', e.target.value)}/>
                        <Input placeholder="Marks" value={edu.marks} onChange={e=>updateEntry('education', i, 'marks', e.target.value)}/>
                        <Input placeholder="Year" value={edu.year} onChange={e=>updateEntry('education', i, 'year', e.target.value)}/>
                    </div>
                ))
            ) : (
                <p style={{color:'#888', fontStyle:'italic', fontSize:'0.9rem'}}>No education added yet. Click + Add.</p>
            )}
        </div>

        <div className={styles.stickyActions}>
            <Button variant="outline" onClick={handleSaveToProfile}>💾 Save to Profile</Button>
            <Button onClick={generatePDF}>📥 Download Executive PDF</Button>
        </div>
      </div>

      {/* --- PREVIEW SIDE --- */}
      <div className={styles.preview}>
        <div className={styles.paper}>
            <h1 className={styles.prevName}>{data.name || "Your Name"}</h1>
            <div className={styles.prevLine}></div>
            <div className={styles.prevContact}>
                <span>Location: {data.location} | Mob: {data.mobile}</span>
                <span>LinkedIn: {data.linkedin} | GitHub: {data.github}</span>
                <span>Email: {data.email} | Portfolio: {data.portfolio}</span>
            </div>

            {data.summary && (
                <>
                    <h5 className={styles.prevHeading}>PROFESSIONAL SUMMARY</h5>
                    <p className={styles.prevText}>{data.summary}</p>
                </>
            )}

            {data.skills && (
                <>
                    <h5 className={styles.prevHeading}>TECHNICAL SKILLS</h5>
                    <p className={styles.prevText}>{data.skills}</p>
                </>
            )}

            {data.experience.length > 0 && <h5 className={styles.prevHeading}>EXPERIENCE</h5>}
            {data.experience.map((exp, i) => (
                <div key={i} style={{marginBottom:'10px'}}>
                    <div className={styles.flexRow}><strong>{exp.title}</strong><span>{exp.duration}</span></div>
                    <div className={styles.prevItalic}>{exp.company}</div>
                    <p className={styles.prevText}>{exp.work}</p>
                </div>
            ))}

            {data.education.length > 0 && <h5 className={styles.prevHeading}>EDUCATION</h5>}
            {data.education.map((edu, i) => (
                <div key={i} style={{marginBottom:'10px'}}>
                    <div className={styles.flexRow}><strong>{edu.degree}</strong><span>{edu.year}</span></div>
                    <div className={styles.prevText}>{edu.school} | {edu.university} | {edu.marks}</div>
                </div>
            ))}
        </div>
      </div>

      {/* FEEDBACK MODAL */}
      {feedback && (
        <div className={tableStyles.erpModalOverlay}>
          <div className={tableStyles.feedbackBox}>
            <div className={feedback.type === 'success' ? tableStyles.successIcon : tableStyles.warningIconCircle}>
              {feedback.type === 'success' ? '✓' : '!'}
            </div>
            <h3>{feedback.type === 'success' ? 'Success' : 'Error'}</h3>
            <p>{feedback.msg}</p>
            <Button fullWidth onClick={() => setFeedback(null)}>Continue</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
