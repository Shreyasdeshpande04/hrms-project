
import React from 'react';
// Note: This is a wrapper. In a real app, you'd use 'recharts' or 'chart.js'
const StatsChart = ({ title, type = 'bar' }) => {
  return (
    <div style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
      <h4>{title}</h4>
      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        [ {type.toUpperCase()} CHART PLACEHOLDER ]
      </div>
    </div>
  );
};

export default StatsChart;