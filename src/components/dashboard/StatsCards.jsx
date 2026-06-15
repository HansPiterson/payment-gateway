import {
  UserAdd01Icon,
  RotateLeft01Icon,
  DollarCircleIcon,
} from 'hugeicons-react';

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

const defaultStatsData = [
  {
    label: 'Balance',
    value: 'Rp 2.000',
    change: null,
    lastMonth: 'Rp 2.000',
    Icon: DollarCircleIcon,
    isPrimary: true,
  },
  {
    label: 'New Customer',
    value: '110',
    change: 7.5,
    lastMonth: '89',
    Icon: UserAdd01Icon,
    isPrimary: false,
  },
  {
    label: 'Return Products',
    value: '72',
    change: -6.0,
    lastMonth: '60',
    Icon: RotateLeft01Icon,
    isPrimary: false,
  },
  {
    label: 'Total Revenue',
    value: 'Rp 8.220.640',
    change: null,
    lastMonth: 'Rp 620.000',
    Icon: DollarCircleIcon,
    isPrimary: false,
  },
];

export default function StatsCards({ stats }) {
  const statsData = stats ? [
    {
      label: 'Balance',
      value: stats.balance?.value || stats.totalSales?.value || 'Rp 0',
      change: null,
      lastMonth: stats.balance?.lastMonth || stats.totalSales?.lastMonth || 'Rp 0',
      Icon: DollarCircleIcon,
      isPrimary: true,
    },
    {
      label: 'New Customer',
      value: stats.newCustomers?.value || '0',
      change: stats.newCustomers?.growth ? parseFloat(stats.newCustomers.growth) : 0,
      lastMonth: stats.newCustomers?.lastMonth || '0',
      Icon: UserAdd01Icon,
      isPrimary: false,
    },
    {
      label: 'Return Products',
      value: stats.returnProducts?.value || '0',
      change: stats.returnProducts?.growth ? parseFloat(stats.returnProducts.growth) : 0,
      lastMonth: stats.returnProducts?.lastMonth || '0',
      Icon: RotateLeft01Icon,
      isPrimary: false,
    },
    {
      label: 'Total Revenue',
      value: stats.totalRevenue?.value || 'Rp 0',
      change: null,
      lastMonth: stats.totalRevenue?.lastMonth || 'Rp 0',
      Icon: DollarCircleIcon,
      isPrimary: false,
    },
  ] : defaultStatsData;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {statsData.map((stat) => {
        const isUp = stat.change !== null && stat.change > 0;
        const isDown = stat.change !== null && stat.change < 0;

        return (
          <div
            key={stat.label}
            className={`rounded-[1.5rem] p-6 transition-ios hover:scale-[1.02] active:scale-[0.98] ${
              stat.isPrimary
                ? 'bg-gradient-to-br from-primary to-blue-400 text-primary-foreground shadow-[0_8px_30px_rgba(0,122,255,0.2)] border border-white/20'
                : 'glass-panel text-foreground'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                stat.isPrimary ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl shadow-sm ${
                stat.isPrimary ? 'bg-white/20 text-white backdrop-blur-sm' : 'bg-secondary text-foreground'
              }`}>
                <stat.Icon size={20} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-5">
              <span className="text-2xl md:text-3xl font-black tracking-tight">{stat.value}</span>
              {stat.change !== null && stat.change !== 0 && (
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm ${
                  isUp
                    ? (stat.isPrimary ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400')
                    : (stat.isPrimary ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400')
                }`}>
                  {isUp ? <ArrowUp /> : <ArrowDown />}
                  {Math.abs(stat.change).toFixed(1)}%
                </span>
              )}
            </div>

            <span className={`text-[12px] mt-2 block font-medium ${
              stat.isPrimary ? 'text-primary-foreground/70' : 'text-muted-foreground'
            }`}>
              {stat.label === 'Balance' || stat.label === 'Total Revenue' ? stat.lastMonth : `Bulan lalu: ${stat.lastMonth}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
