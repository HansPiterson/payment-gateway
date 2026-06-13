/* Segmented ring chart built from SVG arcs */
const SEGMENTS = 60;
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

const SegmentedRing = ({ progress = 70.8 }) => {
  const filledCount = Math.round(SEGMENTS * (progress / 100));
  const segments = [];
  for (let i = 0; i < SEGMENTS; i++) {
    const startAngle = i * (360 / SEGMENTS);
    const endAngle = startAngle + SEGMENT_ARC;
    const isFilled = i < filledCount;
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
      <text x={CENTER} y={CENTER - 6} textAnchor="middle" fill="#202224" fontSize="26" fontWeight="700" fontFamily="Poppins, sans-serif">
        {progress}%
      </text>
      <text x={CENTER} y={CENTER + 16} textAnchor="middle" fill="#6B7280" fontSize="12" fontWeight="500" fontFamily="Poppins, sans-serif">
        Target Progress
      </text>
    </svg>
  );
};

const ArrowUp = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
  </svg>
);

const ArrowDown = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M5 8L2 4H8L5 8Z" fill="currentColor" />
  </svg>
);

const defaultOverview = {
  growth: 70.8,
  salesCount: 2343,
  salesGrowth: '+4.5%',
  revenue: 'Rp 30.900.000',
  revenueGrowth: '+4.5%',
};

export default function SalesOverview({ overview }) {
  const data = overview || defaultOverview;
  
  const isSalesUp = !data.salesGrowth.startsWith('-');
  const isRevenueUp = !data.revenueGrowth.startsWith('-');

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
        <SegmentedRing progress={data.growth} />
      </div>

      <div className="sales-stats-row">
        <div className="sales-stat-box">
          <div className="sales-stat-box-label">Number of Sales</div>
          <div className="sales-stat-box-value">
            {data.salesCount.toLocaleString("id-ID")}
            {data.salesGrowth !== '0%' && data.salesGrowth !== '+0%' && (
              <span className={`stat-badge ${isSalesUp ? 'up' : 'down'}`}>
                {isSalesUp ? <ArrowUp /> : <ArrowDown />} {data.salesGrowth.replace('+', '').replace('-', '')}
              </span>
            )}
          </div>
        </div>
        <div className="sales-stat-box">
          <div className="sales-stat-box-label">Total Revenue</div>
          <div className="sales-stat-box-value" style={{ fontSize: '13px', fontWeight: '700' }}>
            {data.revenue}
            {data.revenueGrowth !== '0%' && data.revenueGrowth !== '+0%' && (
              <span className={`stat-badge ${isRevenueUp ? 'up' : 'down'}`}>
                {isRevenueUp ? <ArrowUp /> : <ArrowDown />} {data.revenueGrowth.replace('+', '').replace('-', '')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
