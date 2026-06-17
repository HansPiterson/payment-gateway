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

export default function StatsCards({ stats, onBalanceClick }) {
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

        const isBalanceCard = stat.label === 'Balance';
        return (
          <div
            key={stat.label}
            onClick={isBalanceCard ? onBalanceClick : undefined}
            className={`rounded-xl p-5 border transition-all hover:scale-[1.01] ${isBalanceCard && onBalanceClick ? 'cursor-pointer' : ''} ${
              stat.isPrimary
                ? 'bg-gradient-to-b from-zinc-200 to-white dark:from-zinc-800 dark:to-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-lg'
                : 'bg-card text-card-foreground border-border shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                stat.isPrimary ? 'text-zinc-500' : 'text-zinc-400'
              }`}>
                {stat.label}
              </span>
              <div className={`p-1.5 rounded-lg ${
                stat.isPrimary ? 'bg-zinc-200 text-zinc-950' : 'bg-zinc-800 text-zinc-300'
              }`}>
                <stat.Icon size={18} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-4">
              <span className="text-xl md:text-2xl font-black tracking-tight">{stat.value}</span>
              {stat.change !== null && stat.change !== 0 && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                  isUp
                    ? 'bg-zinc-200 text-zinc-950'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                }`}>
                  {isUp ? <ArrowUp /> : <ArrowDown />}
                  {Math.abs(stat.change).toFixed(1)}%
                </span>
              )}
            </div>

            <span className={`text-[10px] mt-2 block font-medium text-zinc-500`}>
              {stat.label === 'Balance' || stat.label === 'Total Revenue' ? stat.lastMonth : `Last month: ${stat.lastMonth}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
