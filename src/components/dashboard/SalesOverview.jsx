/* Segmented ring chart built from SVG arcs */
const SEGMENTS = 60;
const FILLED = Math.round(SEGMENTS * 0.708); // 70.8%
const RADIUS = 80;
const CENTER = 100;
const SEGMENT_GAP = 1.2;
const SEGMENT_ARC = 360 / SEGMENTS - SEGMENT_GAP;

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

const SegmentedRing = () => {
  const segments = [];
  for (let i = 0; i < SEGMENTS; i++) {
    const startAngle = i * (360 / SEGMENTS);
    const endAngle = startAngle + SEGMENT_ARC;
    const isFilled = i < FILLED;
    segments.push(
      <path
        key={i}
        d={describeArc(CENTER, CENTER, RADIUS, startAngle, endAngle)}
        fill="none"
        stroke={isFilled ? 'url(#ringGradient)' : '#F0F0F4'}
        strokeWidth="10"
        strokeLinecap="round"
      />
    );
  }

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4880FF" />
          <stop offset="100%" stopColor="#6BA3FF" />
        </linearGradient>
      </defs>
      {segments}
      <text x={CENTER} y={CENTER - 6} textAnchor="middle" fill="#202224" fontSize="28" fontWeight="700" fontFamily="Poppins, sans-serif">
        70.8%
      </text>
      <text x={CENTER} y={CENTER + 16} textAnchor="middle" fill="#6B7280" fontSize="12" fontWeight="500" fontFamily="Poppins, sans-serif">
        Sales Growth
      </text>
    </svg>
  );
};

const ArrowUp = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
  </svg>
);

export default function SalesOverview() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h3 className="card-title">Sales Overview</h3>
        <button className="card-action-icon" aria-label="More options">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="4" cy="10" r="1.5" fill="#6B7280" />
            <circle cx="10" cy="10" r="1.5" fill="#6B7280" />
            <circle cx="16" cy="10" r="1.5" fill="#6B7280" />
          </svg>
        </button>
      </div>

      <div className="sales-ring-container" style={{ flex: 1 }}>
        <SegmentedRing />
      </div>

      <div className="sales-stats-row">
        <div className="sales-stat-box">
          <div className="sales-stat-box-label">Number of Sales</div>
          <div className="sales-stat-box-value">
            2,343
            <span className="stat-badge up">
              <ArrowUp /> 4.5%
            </span>
          </div>
        </div>
        <div className="sales-stat-box">
          <div className="sales-stat-box-label">Total Revenue</div>
          <div className="sales-stat-box-value">
            $30.9k
            <span className="stat-badge up">
              <ArrowUp /> 4.5%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
