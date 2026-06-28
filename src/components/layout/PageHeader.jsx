import { FilterIcon, ArrowDown01Icon, Refresh01Icon } from 'hugeicons-react';

export default function PageHeader({
  title = 'Sales Overview',
  subtitle = 'Your current sales summary and activity',
  onRefresh,
  isLoading,
  onWithdraw,
}) {
  const btnBase =
    'inline-flex items-center gap-2 py-2 px-3.5 bg-card border border-border text-foreground/80 hover:text-foreground hover:bg-secondary rounded-lg transition-colors text-sm font-medium disabled:opacity-50';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="text-left">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">{title}</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onRefresh && (
          <button className={btnBase} onClick={onRefresh} disabled={isLoading} title="Refresh Data">
            <Refresh01Icon size={16} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Memuat...' : 'Refresh'}
          </button>
        )}

        <button className={btnBase}>
          This Month
          <ArrowDown01Icon size={16} />
        </button>

        <button className={btnBase}>
          <FilterIcon size={16} />
          Filter
        </button>
      </div>
    </div>
  );
}
