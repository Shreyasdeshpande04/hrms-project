import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = ({ role }) => {
  const menuItems = {
    ADMIN: [
      { name: 'Dashboard', path: '/admin/dashboard' },
      { name: 'User Management', path: '/admin/users' },
      { name: 'Departments', path: '/admin/departments' },
      { name: 'System Logs', path: '/admin/logs' },
    ],
    HR: [
      { name: 'Hiring Pipeline', path: '/hr/pipeline' },
      { name: 'Job Openings', path: '/hr/jobs' },
      { name: 'Interviews', path: '/hr/interviews' },
      { name: 'Analytics', path: '/hr/analytics' },
      { name: 'Profile Settings', path: '/hr/profile' }, // ADDED THIS TAB
    ],
CANDIDATE: [
  { name: 'Find Jobs', path: '/jobs' },
  { name: 'My Applications', path: '/candidate/applications' },
  { name: 'Resume Builder', path: '/candidate/resume' }, // NEW TAB
  { name: 'Profile Settings', path: '/candidate/profile' },
]
  };

  const currentMenu = menuItems[role] || [];

  return (
    <aside className={styles.sidebar}>
      <ul className={styles.menuList}>
        {currentMenu.map((item) => (
          <li key={item.path} className={styles.menuItem}>
            <NavLink 
              to={item.path} 
              className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;