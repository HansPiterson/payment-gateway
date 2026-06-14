import { Upload04Icon, FilterIcon, ArrowDown01Icon, Refresh01Icon, Coins01Icon } from 'hugeicons-react';

export default function PageHeader({
  title = 'Sales Overview',
  subtitle = 'Your current sales summary and activity',
  onRefresh,
  isLoading,
  onWithdraw,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="text-left">
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">{title}</h1>
        <p className="text-xs md:text-sm text-zinc-400 mt-1">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {onWithdraw && (
          <button
            className="inline-flex items-center gap-2 py-2 px-4 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-bold rounded-lg transition-colors text-sm shadow-sm"
            onClick={onWithdraw}
          >
            <Coins01Icon size={16} />
            Tarik Saldo
          </button>
        )}

        {onRefresh && (
          <button
            className={`inline-flex items-center gap-2 py-2 px-4 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-zinc-100 rounded-lg transition-all text-sm disabled:opacity-50`}
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Data"
          >
            <Refresh01Icon size={16} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        )}

        <button className="inline-flex items-center gap-2 py-2 px-4 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-zinc-100 rounded-lg transition-all text-sm">
          This Month
          <ArrowDown01Icon size={16} />
        </button>



        <button className="inline-flex items-center gap-2 py-2 px-4 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-zinc-100 rounded-lg transition-all text-sm">
          <FilterIcon size={16} />
          Filter
        </button>
      </div>
    </div>
  );
}
