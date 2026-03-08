import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import styles from './Auth.module.css';
import tableStyles from '../admin/AdminTable.module.css'; // Importing the fixed styles
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      setShowSuccessModal(true); 
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Create Account</h2>
        <p className={styles.authSub}>Join our professional recruitment network</p>
        
        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input label="Full Name *" name="name" placeholder="Shreyas Deshpande" onChange={handleChange} required />
          <Input label="Email Address *" name="email" type="email" placeholder="name@example.com" onChange={handleChange} required />
          <Input label="Password *" name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '10px' }}>Register as:</label>
            <select name="role" onChange={handleChange} className={styles.roleSelect}>
              <option value="CANDIDATE">Candidate / Student</option>
              <option value="HR">HR Professional</option>
             
           
            </select>
          </div>

          <Button type="submit" fullWidth isLoading={loading}>Sign Up</Button>
        </form>

        <div className={styles.authFooter}>
          <span>Already have an account? <Link to="/login">Sign In</Link></span>
        </div>
      </div>

      {/* --- FIXED NON-TRANSPARENT MODAL --- */}
      {showSuccessModal && (
        <div className={tableStyles.erpModalOverlay}>
          <div className={tableStyles.feedbackBox}>
            <div className={tableStyles.successIcon}>✓</div>
            <h2 style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px' }}>
                Account Created!
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '35px' }}>
                Your registration was successful. You can now access your customized dashboard.
            </p>
            <Button fullWidth onClick={() => navigate('/login')}>
                Proceed to Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
