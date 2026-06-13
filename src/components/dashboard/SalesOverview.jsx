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
        stroke={isFilled ? 'url(#ringGradient)' : '#18181b'}
        strokeWidth="10"
        strokeLinecap="round"
      />
    );
  }

  return (
    <svg width="180" height="180" viewBox="0 0 200 200" className="mx-auto block">
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4f4f5" />
          <stop offset="100%" stopColor="#3f3f46" />
        </linearGradient>
      </defs>
      {segments}
      <text x={CENTER} y={CENTER - 6} textAnchor="middle" fill="#f4f4f5" fontSize="28" fontWeight="800" fontFamily="Poppins, sans-serif">
        {progress}%
      </text>
      <text x={CENTER} y={CENTER + 16} textAnchor="middle" fill="#71717a" fontSize="11" fontWeight="600" fontFamily="Poppins, sans-serif" letterSpacing="0.5px">
        TARGET PROGRESS
      </text>
    </svg>
  );
};

const ArrowUp = () => (
  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="inline-block">
    <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
  </svg>
);

const ArrowDown = () => (
  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="inline-block">
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col h-full justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-100 text-left">Sales Overview</h3>
        <button className="text-zinc-500 hover:text-zinc-350 p-1 rounded-lg transition-colors" aria-label="More options">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="4" cy="10" r="1.5" fill="currentColor" />
            <circle cx="10" cy="10" r="1.5" fill="currentColor" />
            <circle cx="16" cy="10" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center my-6">
        <SegmentedRing progress={data.growth} />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-850">
        <div className="text-left">
          <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider block">Number of Sales</span>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-lg font-black text-zinc-100">{data.salesCount.toLocaleString("id-ID")}</span>
            {data.salesGrowth !== '0%' && data.salesGrowth !== '+0%' && (
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                isSalesUp ? 'bg-zinc-200 text-zinc-950' : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
              }`}>
                {isSalesUp ? <ArrowUp /> : <ArrowDown />}
                {data.salesGrowth.replace('+', '').replace('-', '')}
              </span>
            )}
          </div>
        </div>

        <div className="text-left border-l border-zinc-850 pl-4">
          <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider block">Total Revenue</span>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-sm font-black text-zinc-150 truncate max-w-[100px]">{data.revenue}</span>
            {data.revenueGrowth !== '0%' && data.revenueGrowth !== '+0%' && (
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                isRevenueUp ? 'bg-zinc-200 text-zinc-950' : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
              }`}>
                {isRevenueUp ? <ArrowUp /> : <ArrowDown />}
                {data.revenueGrowth.replace('+', '').replace('-', '')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
