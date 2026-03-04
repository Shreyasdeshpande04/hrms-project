import React, { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import api from '../../services/api';
import styles from './Profile.module.css';
import tableStyles from '../../features/admin/AdminTable.module.css'; 
import Button from '../../components/Common/Button';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { userInfo, setUserInfo, logout } = useStore();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    jobTitle: userInfo?.jobTitle || '',
    company: userInfo?.company || '',
    location: userInfo?.location || '',
    bio: userInfo?.bio || '',
    skills: userInfo?.skills || '',
    linkedinLink: userInfo?.linkedinLink || '',
    githubLink: userInfo?.githubLink || '',
  });

  // Re-sync data if global state changes
  useEffect(() => {
    if (userInfo) {
        setProfileData({
            name: userInfo.name || '',
            email: userInfo.email || '',
            phone: userInfo.phone || '',
            jobTitle: userInfo.jobTitle || '',
            company: userInfo.company || '',
            location: userInfo.location || '',
            bio: userInfo.bio || '',
            skills: userInfo.skills || '',
            linkedinLink: userInfo.linkedinLink || '',
            githubLink: userInfo.githubLink || '',
        });
    }
  }, [userInfo]);
const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Save to DB
      const { data } = await api.put(`/admin/users/${userInfo._id}`, profileData);
      
      // 2. IMPORTANT: We must keep the TOKEN in the global state
      const updatedUserWithToken = { ...data, token: userInfo.token };
      
      // 3. Update local storage and global state
      setUserInfo(updatedUserWithToken);
      
      setIsEditing(false);
      setFeedback({ type: 'success', msg: 'Profile strictly synchronized and saved.' });
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Update failed.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTerminate = async () => {
    try {
      await api.delete('/auth/me');
      logout();
      navigate('/login');
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Account termination failed.' });
    }
  };

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.mainGrid}>
        
        {/* LEFT IDENTITY CARD */}
        <div className={styles.sideCard}>
          <div className={styles.avatarLarge}>{userInfo?.name?.charAt(0)}</div>
          <h2 className={styles.userName}>{userInfo?.name}</h2>
          <span className={styles.userRoleBadge}>{userInfo?.role}</span>
          
          <div className={styles.socialQuickLinks}>
            {profileData.linkedinLink && <a href={profileData.linkedinLink} target="_blank" rel="noreferrer">LinkedIn Profile</a>}
            {profileData.githubLink && <a href={profileData.githubLink} target="_blank" rel="noreferrer">GitHub Portfolio</a>}
          </div>

          <div className={styles.dangerZone}>
            <button className={styles.terminateBtn} onClick={() => setShowDeleteModal(true)}>
              Terminate Account
            </button>
          </div>
        </div>

        {/* RIGHT DATA CARD */}
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h3>Professional Identity</h3>
            <button 
                className={isEditing ? styles.discardBtn : styles.editToggle} 
                onClick={() => setIsEditing(!isEditing)}
                type="button"
            >
              {isEditing ? 'Discard Changes' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleUpdate}>
            <div className={styles.formGrid}>
                
                <div className={styles.inputGroup}>
                    <label>Full Name</label>
                    <input className={styles.strictInput} value={profileData.name} disabled={!isEditing} 
                           onChange={e => setProfileData({...profileData, name: e.target.value})} />
                </div>

                <div className={styles.inputGroup}>
                    <label>Email Address</label>
                    <input className={styles.strictInput} value={profileData.email} disabled={!isEditing} 
                           onChange={e => setProfileData({...profileData, email: e.target.value})} />
                </div>

                <div className={styles.inputGroup}>
                    <label>Contact Number</label>
                    <input className={styles.strictInput} value={profileData.phone} disabled={!isEditing} 
                           placeholder="Not provided" onChange={e => setProfileData({...profileData, phone: e.target.value})} />
                </div>

                <div className={styles.inputGroup}>
                    <label>Professional Headline</label>
                    <input className={styles.strictInput} value={profileData.jobTitle} disabled={!isEditing} 
                           placeholder="e.g. HR Manager" onChange={e => setProfileData({...profileData, jobTitle: e.target.value})} />
                </div>

                <div className={styles.inputGroup}>
                    <label>Current Company</label>
                    <input className={styles.strictInput} value={profileData.company} disabled={!isEditing} 
                           placeholder="e.g. ModernHR" onChange={e => setProfileData({...profileData, company: e.target.value})} />
                </div>

                <div className={styles.inputGroup}>
                    <label>Location</label>
                    <input className={styles.strictInput} value={profileData.location} disabled={!isEditing} 
                           placeholder="e.g. Pune" onChange={e => setProfileData({...profileData, location: e.target.value})} />
                </div>

                <div className={styles.fullWidth}>
                    <label>Biography</label>
                    <textarea className={styles.strictTextarea} value={profileData.bio} disabled={!isEditing}
                              placeholder="Write your bio..." onChange={e => setProfileData({...profileData, bio: e.target.value})} />
                </div>

                <div className={styles.fullWidth}>
                    <label>Technical Competencies (Skills)</label>
                    <input className={styles.strictInput} value={profileData.skills} disabled={!isEditing}
                           placeholder="Skills..." onChange={e => setProfileData({...profileData, skills: e.target.value})} />
                </div>
            </div>

            {isEditing && (
              <div className={styles.saveBar}>
                <Button type="submit" isLoading={isSaving}>Synchronize Profile</Button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* FEEDBACK MODAL */}
      {feedback && (
        <div className={tableStyles.erpModalOverlay}>
          <div className={tableStyles.feedbackBox}>
            <div className={feedback.type === 'success' ? tableStyles.successIcon : tableStyles.warningIconCircle}>
              {feedback.type === 'success' ? '✓' : '!'}
            </div>
            <h2>{feedback.type === 'success' ? 'Success!' : 'Error'}</h2>
            <p>{feedback.msg}</p>
            <Button fullWidth onClick={() => setFeedback(null)}>Continue</Button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className={tableStyles.erpModalOverlay}>
          <div className={tableStyles.erpDeleteBox}>
            <div className={tableStyles.warningIconCircle}>!</div>
            <h2>Delete Account?</h2>
            <p>This will permanently remove your profile.</p>
            <div className={tableStyles.erpBtnGroup}>
              <button className={tableStyles.erpConfirmBtn} onClick={handleTerminate}>Yes, Delete</button>
              <button className={tableStyles.erpCancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;