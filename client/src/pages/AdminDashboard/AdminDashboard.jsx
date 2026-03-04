// client/src/pages/AdminDashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../services/api';
import styles from './AdminDashboard.module.css';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'];

const AdminDashboard = () => {
  const [data, setData] = useState({ totalUsers: 0, activeJobs: 0, totalDepts: 0, pieData: [], lineData: [] });

  useEffect(() => {
    api.get('/admin/stats').then(res => setData(res.data));
  }, []);

  return (
    <div className={styles.container}>
      <h2>Enterprise Insights</h2>

      {/* SUMMARY CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}><h3>{data.totalUsers}</h3><p>Registered Users</p></div>
        <div className={styles.statCard}><h3>{data.activeJobs}</h3><p>Active Jobs</p></div>
        <div className={styles.statCard}><h3>{data.totalDepts}</h3><p>Departments</p></div>
      </div>

      <div className={styles.chartGrid}>
        {/* PIE CHART */}
        <div className={styles.chartCard}>
          <h4>User Distribution by Role</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.pieData} innerRadius={60} outerRadius={90} dataKey="value" nameKey="name" paddingAngle={5}>
                {data.pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className={styles.chartCard}>
          <h4>Hiring/Application Trends ({new Date().getFullYear()})</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;