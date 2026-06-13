import { useState } from 'react';
import { ArrowDown01Icon } from 'hugeicons-react';

const months = [
  { label: 'May', value: 18000, sales: 320, revenue: '$3.2k' },
  { label: 'Jun', value: 12000, sales: 210, revenue: '$2.1k' },
  { label: 'Jul', value: 28000, sales: 380, revenue: '$3.8k' },
  { label: 'Aug', value: 22000, sales: 440, revenue: '$4.5k' },
  { label: 'Sep', value: 35000, sales: 520, revenue: '$5.2k' },
  { label: 'Oct', value: 16000, sales: 280, revenue: '$2.8k' },
  { label: 'Nov', value: 30000, sales: 460, revenue: '$4.6k' },
  { label: 'Dec', value: 24000, sales: 350, revenue: '$3.5k' },
];

const yLabels = ['40k', '30k', '20k', '10k', '5k', '0k'];
const MAX_VALUE = 40000;

export default function PerformanceChart() {
  const [activeBar, setActiveBar] = useState(3); // August by default

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Performance Overview</h3>
        <button className="card-action">
          This Week
          <ArrowDown01Icon size={14} />
        </button>
      </div>

      <div className="bar-chart-container">
        {/* Y-Axis Labels */}
        <div className="bar-chart-y-axis">
          {yLabels.map((label) => (
            <span key={label} className="bar-chart-y-label">{label}</span>
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
            {months.map((month, index) => {
              const heightPercent = (month.value / MAX_VALUE) * 100;
              const isActive = activeBar === index;

              return (
                <div
                  key={month.label}
                  className="bar-chart-bar-wrapper"
                  onMouseEnter={() => setActiveBar(index)}
                >
                  <div
                    className="bar-chart-bar"
                    style={{
                      height: `${heightPercent}%`,
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
          {months.map((month) => (
            <span key={month.label} className="bar-chart-x-label">{month.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
