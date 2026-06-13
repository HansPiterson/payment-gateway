import { Upload04Icon, FilterIcon, ArrowDown01Icon, Refresh01Icon } from 'hugeicons-react';

export default function PageHeader({
  title = 'Sales Overview',
  subtitle = 'Your current sales summary and activity',
  onRefresh,
  isLoading,
}) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="page-header-actions">
        {onRefresh && (
          <button 
            className={`btn-export ${isLoading ? 'loading' : ''}`} 
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Data"
          >
            <Refresh01Icon size={16} className={isLoading ? 'spin' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        )}
        <button className="btn-dropdown">
          This Month
          <ArrowDown01Icon size={16} />
        </button>
        <button className="btn-export">
          <Upload04Icon size={16} />
          Export
        </button>
        <button className="btn-filter">
          <FilterIcon size={16} />
          Filter
        </button>
      </div>
      
      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
