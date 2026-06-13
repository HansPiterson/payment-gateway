import {
  ShoppingCart01Icon,
  UserAdd01Icon,
  RotateLeft01Icon,
  DollarCircleIcon,
} from 'hugeicons-react';

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

const defaultStatsData = [
  {
    label: 'Total Sales',
    value: '2,500',
    change: 4.9,
    lastMonth: '2,345',
    Icon: ShoppingCart01Icon,
    isPrimary: true,
    iconClass: '',
  },
  {
    label: 'New Customer',
    value: '110',
    change: 7.5,
    lastMonth: '89',
    Icon: UserAdd01Icon,
    isPrimary: false,
    iconClass: 'blue',
  },
  {
    label: 'Return Products',
    value: '72',
    change: -6.0,
    lastMonth: '60',
    Icon: RotateLeft01Icon,
    isPrimary: false,
    iconClass: 'green',
  },
  {
    label: 'Total Revenue',
    value: 'Rp 8.220.640',
    change: null,
    lastMonth: 'Rp 620.000',
    Icon: DollarCircleIcon,
    isPrimary: false,
    iconClass: 'purple',
  },
];

export default function StatsCards({ stats }) {
  const statsData = stats ? [
    {
      label: 'Total Sales',
      value: stats.totalSales.value,
      change: stats.totalSales.growth ? parseFloat(stats.totalSales.growth) : 0,
      lastMonth: stats.totalSales.lastMonth,
      Icon: ShoppingCart01Icon,
      isPrimary: true,
      iconClass: '',
    },
    {
      label: 'New Customer',
      value: stats.newCustomers.value,
      change: stats.newCustomers.growth ? parseFloat(stats.newCustomers.growth) : 0,
      lastMonth: stats.newCustomers.lastMonth,
      Icon: UserAdd01Icon,
      isPrimary: false,
      iconClass: 'blue',
    },
    {
      label: 'Return Products',
      value: stats.returnProducts.value,
      change: stats.returnProducts.growth ? parseFloat(stats.returnProducts.growth) : 0,
      lastMonth: stats.returnProducts.lastMonth,
      Icon: RotateLeft01Icon,
      isPrimary: false,
      iconClass: 'green',
    },
    {
      label: 'Total Revenue',
      value: stats.totalRevenue.value,
      change: null,
      lastMonth: stats.totalRevenue.lastMonth,
      Icon: DollarCircleIcon,
      isPrimary: false,
      iconClass: 'purple',
    },
  ] : defaultStatsData;

  return (
    <div className="stats-grid">
      {statsData.map((stat, index) => {
        const isUp = stat.change !== null && stat.change > 0;
        const isDown = stat.change !== null && stat.change < 0;

        return (
          <div
            key={stat.label}
            className={`stat-card animate-in animate-in-${index + 1} ${stat.isPrimary ? 'primary' : ''}`}
          >
            <div className="stat-card-header">
              <span className="stat-card-label">{stat.label}</span>
              <div className={`stat-card-icon ${stat.isPrimary ? '' : stat.iconClass}`}>
                <stat.Icon size={22} color={stat.isPrimary ? '#fff' : undefined} />
              </div>
            </div>

            <div className="stat-card-value-row">
              <span className="stat-card-value">{stat.value}</span>
              {stat.change !== null && stat.change !== 0 && (
                <span className={`stat-badge ${isUp ? 'up' : 'down'}`}>
                  {isUp ? <ArrowUp /> : <ArrowDown />}
                  {Math.abs(stat.change).toFixed(1)}%
                </span>
              )}
            </div>

            <span className="stat-card-compare">Last month: {stat.lastMonth}</span>
          </div>
        );
      })}
    </div>
  );
}
