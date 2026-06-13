import { useState } from 'react';
import { ArrowDown01Icon } from 'hugeicons-react';

const defaultMonths = [
  { label: 'May', value: 18000, sales: 320, revenue: 'Rp 18.000' },
  { label: 'Jun', value: 12000, sales: 210, revenue: 'Rp 12.000' },
  { label: 'Jul', value: 28000, sales: 380, revenue: 'Rp 28.000' },
  { label: 'Aug', value: 22000, sales: 440, revenue: 'Rp 22.000' },
  { label: 'Sep', value: 35000, sales: 520, revenue: 'Rp 35.000' },
  { label: 'Oct', value: 16000, sales: 280, revenue: 'Rp 16.000' },
  { label: 'Nov', value: 30000, sales: 460, revenue: 'Rp 30.000' },
  { label: 'Dec', value: 24000, sales: 350, revenue: 'Rp 24.000' },
];

export default function PerformanceChart({ chartData }) {
  const data = chartData || defaultMonths;
  const [activeBar, setActiveBar] = useState(data.length - 1); // Select last item by default

  const maxVal = Math.max(...data.map((d) => d.value), 1000);
  
  const formatY = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val;
  };

  const yLabels = [
    formatY(maxVal),
    formatY(maxVal * 0.75),
    formatY(maxVal * 0.5),
    formatY(maxVal * 0.25),
    formatY(maxVal * 0.1),
    '0',
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Performance Overview</h3>
        <button className="card-action">
          This Year
          <ArrowDown01Icon size={14} />
        </button>
      </div>

      <div className="bar-chart-container">
        {/* Y-Axis Labels */}
        <div className="bar-chart-y-axis">
          {yLabels.map((label, idx) => (
            <span key={`${label}-${idx}`} className="bar-chart-y-label">{label}</span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="bar-chart-area">
          {/* Grid Lines */}
          <div className="bar-chart-grid">
            {yLabels.map((_, i) => (
              <div key={i} className="bar-chart-grid-line" />
            ))}
          </div>

          {/* Bars */}
          <div className="bar-chart-bars">
            {data.map((month, index) => {
              const heightPercent = maxVal > 0 ? (month.value / maxVal) * 100 : 0;
              const isActive = activeBar === index;

              return (
                <div
                  key={`${month.label}-${index}`}
                  className="bar-chart-bar-wrapper"
                  onMouseEnter={() => setActiveBar(index)}
                >
                  <div
                    className="bar-chart-bar"
                    style={{
                      height: `${Math.max(heightPercent, 2)}%`, // Show a tiny bar even for 0
                      opacity: isActive ? 1 : 0.65,
                    }}
                  />

                  {/* Tooltip */}
                  <div className="bar-chart-tooltip" style={isActive ? { opacity: 1, visibility: 'visible', transform: 'translateY(0) translateX(-50%)' } : undefined}>
                    <div className="bar-chart-tooltip-title">
                      {month.label} 2026
                    </div>
                    <div className="bar-chart-tooltip-row">
                      <span className="bar-chart-tooltip-dot" style={{ background: '#00B69B' }} />
                      <span>Total Sales</span>
                      <strong style={{ marginLeft: 'auto' }}>{month.sales}</strong>
                    </div>
                    <div className="bar-chart-tooltip-row">
                      <span className="bar-chart-tooltip-dot" style={{ background: '#4880FF' }} />
                      <span>Total Revenue</span>
                      <strong style={{ marginLeft: 'auto' }}>{month.revenue}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X-Axis Labels */}
        <div className="bar-chart-x-axis">
          {data.map((month, index) => (
            <span key={`${month.label}-${index}`} className="bar-chart-x-label">{month.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
