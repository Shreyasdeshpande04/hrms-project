import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './AdminTable.module.css';
import Button from '../../components/Common/Button';

const DepartmentManagement = () => {
  const [depts, setDepts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [name, setName] = useState(""); 
  const [selectedDept, setSelectedDept] = useState(null); 

  // --- STYLES (To ensure inputs look correct even if CSS is missing) ---
  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    marginTop: '5px'
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#444',
    fontSize: '14px'
  };

  // --- API CALLS ---

  const fetchDepts = async () => {
    try {
      const { data } = await api.get('/admin/departments');
      setDepts(data);
    } catch (err) { 
      console.error("Fetch error:", err); 
    }
  };

  useEffect(() => { fetchDepts(); }, []);

  // 1. CREATE
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.post('/admin/departments', { name });
      setName(""); 
      setShowAddModal(false);
      fetchDepts();
    } catch (err) { 
      alert(err.response?.data?.message || "Failed to create department"); 
    }
  };

  // 2. UPDATE (Fixed Logic)
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Safety check
    if (!selectedDept || !selectedDept._id) {
        alert("Error: No department selected.");
        return;
    }

    try {
      // NOTE: If this returns 404, your Backend is missing the router.put('/departments/:id') route
      await api.put(`/admin/departments/${selectedDept._id}`, { name: selectedDept.name });
      setShowEditModal(false);
      fetchDepts();
    } catch (err) { 
        console.error("Update Error:", err);
        alert(err.response?.data?.message || "Update failed. Check console for 404/500 errors."); 
    }
  };

  // 3. DELETE
  const handleFinalDelete = async () => {
    if (!selectedDept || !selectedDept._id) return;
    try {
      await api.delete(`/admin/departments/${selectedDept._id}`);
      setShowDeleteModal(false);
      fetchDepts();
    } catch (err) { 
        console.error("Delete Error:", err);
        alert("Delete failed.");
    }
  };

  // --- HELPERS FOR MODAL ---
  const openEditModal = (dept) => {
      setSelectedDept(dept);
      setShowEditModal(true);
  };

  const openDeleteModal = (dept) => {
      setSelectedDept(dept);
      setShowDeleteModal(true);
  };

  return (
    <div className={styles.container}>
      <header className={styles.erpHeader}>
        <div>
            <h1 className={styles.mainTitle}>Department Management</h1>
            <p className={styles.subTitle}>Configure and organize company business units.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>+ Create New Department</Button>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>SR NO.</th>
              <th>DEPARTMENT NAME</th>
              <th>CREATED DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {depts.length > 0 ? (
              depts.map((d, index) => (
                <tr key={d._id}>
                  <td>{index + 1}</td>
                  <td><strong>{d.name}</strong></td>
                  <td>{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '-'}</td>
                  <td className={styles.actionBtns}>
                    <button className={styles.proEditBtn} onClick={() => openEditModal(d)}>Edit</button>
                    <button className={styles.proDeleteBtn} onClick={() => openDeleteModal(d)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className={styles.emptyRow}>No departments found. Click create to start.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- 1. ADD MODAL --- */}
      {showAddModal && (
        <div className={styles.erpModalOverlay}>
          <div className={styles.erpModalBox} style={{maxWidth: '500px'}}>
            <h2>Add New Department</h2>
            <form onSubmit={handleCreate} style={{marginTop: '20px'}}>
              <div style={{marginBottom: '15px'}}>
                <label style={labelStyle}>Department Name</label>
                <input 
                  type="text"
                  style={inputStyle}
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Marketing" 
                  required 
                  autoFocus
                />
              </div>
              <div className={styles.modalActions}>
                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 2. EDIT MODAL --- */}
      {showEditModal && selectedDept && (
        <div className={styles.erpModalOverlay}>
          <div className={styles.erpModalBox} style={{maxWidth: '500px'}}>
            <h2>Rename Department</h2>
            <form onSubmit={handleUpdate} style={{marginTop: '20px'}}>
              <div style={{marginBottom: '15px'}}>
                <label style={labelStyle}>New Name</label>
                <input 
                  type="text"
                  style={inputStyle}
                  value={selectedDept.name} 
                  onChange={e => setSelectedDept({...selectedDept, name: e.target.value})} 
                  required
                  autoFocus
                />
              </div>
              <div className={styles.modalActions}>
                <Button variant="outline" type="button" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 3. DELETE MODAL --- */}
      {showDeleteModal && selectedDept && (
        <div className={styles.erpModalOverlay}>
          <div className={styles.erpDeleteBox}>
            <div className={styles.warningIconCircle}>!</div>
            <h2 className={styles.deleteTitle}>Remove Department?</h2>
            <p className={styles.deleteText}>Are you sure you want to delete <strong>{selectedDept.name}</strong>?</p>
            <div className={styles.erpBtnGroup}>
              <button className={styles.erpConfirmBtn} onClick={handleFinalDelete}>Yes, delete it!</button>
              <button className={styles.erpCancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;