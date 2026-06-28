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
      <div className="bg-popover border border-border p-3 rounded-lg shadow-xl text-left">
        <div className="text-xs font-bold text-muted-foreground mb-1">{data.label} 2026</div>
        <div className="flex items-center gap-2 text-xs text-foreground">
          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
          <span>Sales:</span>
          <span className="font-bold ml-4">{data.sales}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground mt-1">
          <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
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
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col h-full min-h-[380px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground">Performance Overview</h3>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-background rounded-lg transition-colors">
          This Year
          <ArrowDown01Icon size={14} />
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
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatY}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.4)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === activeIndex ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                  className="transition-all duration-200"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
