import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './AdminTable.module.css';
import Button from '../../components/Common/Button';
// We removed the missing Input import and will use standard HTML inputs below

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [feedback, setFeedback] = useState(null); 
  
  // 1. Fetch Users
  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Update User Logic
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${editingUser._id}`, editingUser);
      setEditingUser(null);
      setFeedback({ type: 'success', msg: 'User profile updated successfully!' });
      fetchUsers();
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Update failed. Check permissions.' });
    }
  };

  // 3. Delete Logic
  const handleFinalDelete = async () => {
    try {
      const { data } = await api.delete(`/admin/users/${deletingUser._id}`);
      setFeedback({ type: 'success', msg: data.message || 'User deleted successfully.' });
      setDeletingUser(null);
      fetchUsers();
    } catch (err) {
      setFeedback({ 
        type: 'error', 
        msg: err.response?.data?.message || 'Delete operation failed.' 
      });
      setDeletingUser(null);
    }
  };

  // 4. Render Table Helper
  const renderTable = (title, roleFilter) => {
    const filtered = users.filter(u => u.role === roleFilter);
    return (
      <div className={styles.section}>
        <h3 className={styles.tableTitle}>{title} ({filtered.length})</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SR NO.</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((u, index) => (
                  <tr key={u._id}>
                    <td>{index + 1}</td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                        <div className={styles.statusCell}>
                            <span className={styles.activeDot}></span> Active
                        </div>
                    </td>
                    <td className={styles.actionBtns}>
                      <button className={styles.proEditBtn} onClick={() => setEditingUser(u)}>Edit</button>
                      <button className={styles.proDeleteBtn} onClick={() => setDeletingUser(u)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className={styles.emptyRow}>No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Inline styles for the inputs to make them look good without the Input component
  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#555'
  };

  return (
    <div className={styles.container}>
      <div className={styles.erpHeader}>
        <div>
          <h1 className={styles.mainTitle}>User Management Center</h1>
          <p className={styles.subTitle}>Organize and manage system access.</p>
        </div>
      </div>

      {renderTable("Administrative Team", "ADMIN")}
      {renderTable("HR Team", "HR")}
      {renderTable("Job Candidates", "CANDIDATE")}

      {/* --- EDIT MODAL (FIXED) --- */}
      {editingUser && (
        <div className={styles.erpModalOverlay}>
          <div className={styles.erpModalBox}>
            <h2>Edit User Profile</h2>
            
            <form onSubmit={handleUpdate} style={{marginTop: '20px'}}>
              
              {/* Fixed: Replaced <Input> with standard HTML input */}
              <div style={{marginBottom: '10px'}}>
                <label style={labelStyle}>Full Name</label>
                <input 
                    type="text"
                    value={editingUser.name} 
                    onChange={e => setEditingUser({...editingUser, name: e.target.value})} 
                    required 
                    style={inputStyle}
                />
              </div>

              {/* Fixed: Replaced <Input> with standard HTML input */}
              <div style={{marginBottom: '10px'}}>
                <label style={labelStyle}>Email Address</label>
                <input 
                    type="email"
                    value={editingUser.email} 
                    onChange={e => setEditingUser({...editingUser, email: e.target.value})} 
                    required 
                    style={inputStyle}
                />
              </div>

              <div className={styles.modalActions}>
                {/* Added type="button" to prevent form submission on Cancel */}
                <Button variant="outline" type="button" onClick={() => setEditingUser(null)}>
                    Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {deletingUser && (
        <div className={styles.erpModalOverlay}>
          <div className={styles.erpDeleteBox}>
            <div className={styles.warningIconCircle}>!</div>
            <h2 className={styles.deleteTitle}>Delete User?</h2>
            <p className={styles.deleteText}>Are you sure you want to remove <strong>{deletingUser.name}</strong>?</p>
            <div className={styles.erpBtnGroup}>
              <button className={styles.erpConfirmBtn} onClick={handleFinalDelete}>
                Yes, delete it!
              </button>
              <button className={styles.erpCancelBtn} onClick={() => setDeletingUser(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FEEDBACK MODAL --- */}
      {feedback && (
        <div className={styles.erpModalOverlay}>
          <div className={styles.feedbackBox}>
            <div className={feedback.type === 'success' ? styles.successIcon : styles.warningIconCircle}>
              {feedback.type === 'success' ? '✓' : '!'}
            </div>
            <h3>{feedback.type === 'success' ? 'Operation Successful' : 'Action Blocked'}</h3>
            <p style={{margin: '20px 0', color: '#64748b'}}>{feedback.msg}</p>
            <Button fullWidth onClick={() => setFeedback(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;