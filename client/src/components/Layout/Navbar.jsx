import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../../store/useStore';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { userInfo, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if we are on an auth page (Login/Register) to simplify UI
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        
        {/* LEFT SIDE: BRAND LOGO */}
        <div className={styles.logo} onClick={() => navigate('/')}>
          <div className={styles.logoCircle}>M</div>
          <span className={styles.logoText}>Modern<span className={styles.blue}>HR</span></span>
        </div>

        {/* RIGHT SIDE: LARGE ACTION BUTTONS */}
        <div className={styles.navRight}>
          {userInfo ? (
            // LOGGED IN VIEW
            <div className={styles.userSection}>
              <span className={styles.welcomeText}>
                Logged in as <strong>{userInfo.name.split(' ')[0]}</strong>
              </span>
              <button className={styles.ghostBtn} onClick={handleLogout}>
                Sign Out
              </button>
              
            </div>
          ) : (
            // LOGGED OUT VIEW
            <div className={styles.authGroup}>
              {!isAuthPage && (
                <>
                  <button className={styles.largeSecondary} onClick={() => navigate('/login')}>
                    Sign In
                  </button>
                  <button className={styles.largePrimary} onClick={() => navigate('/register')}>
                    Sign Up
                  </button>
                </>
              )}
              {/* If on Login page, show Sign Up button and vice versa */}
              {location.pathname === '/login' && (
                <button className={styles.largePrimary} onClick={() => navigate('/register')}>
                  Sign Up
                </button>
              )}
              {location.pathname === '/register' && (
                <button className={styles.largeSecondary} onClick={() => navigate('/login')}>
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;