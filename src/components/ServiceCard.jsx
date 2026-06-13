export default function ServiceCard({ service, selected, onSelect }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className={`service-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(service)}
      id={`service-${service.id}`}
    >
      <div className="service-card-check" />
      <div className="service-card-header">
        <span className="service-card-name">{service.name}</span>
        <span className="service-card-price">{formatPrice(service.price)}</span>
      </div>
      <p className="service-card-desc">{service.description}</p>
      {service.features && (
        <ul style={{
          marginTop: '10px',
          paddingLeft: '16px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          lineHeight: '1.7'
        }}>
          {service.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
