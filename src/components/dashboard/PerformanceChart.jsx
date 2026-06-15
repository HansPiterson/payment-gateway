import { useState } from 'react';
import { ArrowDown01Icon } from 'hugeicons-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-panel p-3 rounded-xl shadow-xl text-left border border-border/50">
        <div className="text-[11px] font-bold text-muted-foreground mb-1">{data.label} 2026</div>
        <div className="flex items-center gap-2 text-xs text-foreground">
          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
          <span>Sales:</span>
          <span className="font-bold ml-4">{data.sales}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground mt-1">
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          <span>Revenue:</span>
          <span className="font-bold ml-4">{data.revenue}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ chartData }) {
  const data = chartData || defaultMonths;
  const [activeIndex, setActiveIndex] = useState(data.length - 1);

  const formatY = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val;
  };

  return (
    <div className="glass-panel rounded-[1.5rem] p-6 flex flex-col h-full min-h-[380px] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground tracking-tight">Performance Overview</h3>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary/80 border border-border bg-secondary rounded-full transition-ios active:scale-95">
          This Year
          <ArrowDown01Icon size={16} />
        </button>
      </div>

      <div className="w-full flex-1 min-h-[260px] min-w-0 text-muted-foreground">
        <ResponsiveContainer width="100%" height={260} minWidth={0}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) {
                setActiveIndex(state.activeTooltipIndex);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#a1a1aa" opacity={0.2} vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatY}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === activeIndex ? '#007AFF' : '#71717a'}
                  fillOpacity={index === activeIndex ? 1 : 0.3}
                  className="transition-all duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
