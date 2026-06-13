import { Upload04Icon, FilterIcon, ArrowDown01Icon } from 'hugeicons-react';

export default function PageHeader({
  title = 'Sales Overview',
  subtitle = 'Your current sales summary and activity',
}) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="page-header-actions">
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
    </div>
  );
}
