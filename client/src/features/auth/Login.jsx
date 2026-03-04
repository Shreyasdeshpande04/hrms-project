import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import useStore from '../../store/useStore';
import styles from './Auth.module.css';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setUserInfo = useStore((state) => state.setUserInfo);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', formData);
      setUserInfo(data);

      // Role-Based Auto Redirection
      if (data.role === 'CANDIDATE') {
        navigate('/jobs');
      } else if (data.role === 'HR') {
        navigate('/hr/pipeline');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Sign In</h2>
        <p className={styles.authSub}>Access your professional recruitment portal</p>
        
        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input 
            label="Email Address" 
            name="email" 
            type="email" 
            placeholder="Enter your email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Password" 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          
          <Button type="submit" fullWidth isLoading={loading} style={{ marginTop: '10px' }}>
            Login to Dashboard
          </Button>
        </form>

        <div className={styles.authFooter}>
          <span>Don't have an account? <Link to="/register">Sign Up</Link></span>
        </div>
      </div>
    </div>
  );
};

export default Login;