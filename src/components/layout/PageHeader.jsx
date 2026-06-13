import { Upload04Icon, FilterIcon, ArrowDown01Icon, Refresh01Icon, Coins01Icon } from 'hugeicons-react';

export default function PageHeader({
  title = 'Sales Overview',
  subtitle = 'Your current sales summary and activity',
  onRefresh,
  isLoading,
  onWithdraw,
}) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="page-header-actions">
        {onWithdraw && (
          <button 
            className="btn-filter" 
            onClick={onWithdraw} 
            style={{ 
              backgroundColor: '#00B69B', 
              color: '#FFFFFF', 
              border: 'none', 
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Coins01Icon size={16} />
            Tarik Saldo
          </button>
        )}
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
