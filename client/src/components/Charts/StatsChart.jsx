import React from 'react';

const StatsChart = ({ title, type = 'bar' }) => {
  return (
    <div className="chart-card">
      
      {/* Title */}
      <h4 className="chart-title">{title}</h4>

      {/* Chart Area */}
      <div className="chart-box">
        <span>[ {type.toUpperCase()} CHART PLACEHOLDER ]</span>
      </div>

    </div>
  );
};

export default StatsChart;