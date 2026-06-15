import { Upload04Icon, FilterIcon, ArrowDown01Icon, Refresh01Icon, Coins01Icon } from 'hugeicons-react';

export default function PageHeader({
  title = 'Sales Overview',
  subtitle = 'Your current sales summary and activity',
  onRefresh,
  isLoading,
  onWithdraw,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-2">
      <div className="text-left">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
        <p className="text-[15px] text-muted-foreground mt-1 font-medium">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {onWithdraw && (
          <button
            className="inline-flex items-center gap-2 py-2.5 px-5 bg-primary text-primary-foreground hover:opacity-90 font-semibold rounded-full transition-ios active:scale-95 shadow-sm"
            onClick={onWithdraw}
          >
            <Coins01Icon size={18} />
            Tarik Saldo
          </button>
        )}

        {onRefresh && (
          <button
            className={`inline-flex items-center gap-2 py-2.5 px-5 bg-secondary text-foreground hover:bg-secondary/80 font-medium rounded-full transition-ios active:scale-95 disabled:opacity-50`}
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Data"
          >
            <Refresh01Icon size={18} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        )}

        <button className="inline-flex items-center gap-2 py-2.5 px-5 bg-secondary text-foreground hover:bg-secondary/80 font-medium rounded-full transition-ios active:scale-95">
          This Month
          <ArrowDown01Icon size={18} />
        </button>

        <button className="inline-flex items-center gap-2 py-2.5 px-5 bg-secondary text-foreground hover:bg-secondary/80 font-medium rounded-full transition-ios active:scale-95">
          <FilterIcon size={18} />
          Filter
        </button>
      </div>
    </div>
  );
}
