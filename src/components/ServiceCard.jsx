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
      className={`border rounded-xl p-5 cursor-pointer relative transition-all text-left flex flex-col justify-between h-full ${
        selected
          ? 'bg-zinc-900 border-zinc-100 ring-1 ring-zinc-100 shadow-lg'
          : 'bg-zinc-900 border-zinc-850 hover:border-zinc-700'
      }`}
      onClick={() => onSelect(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(service)}
      id={`service-${service.id}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`text-xs font-bold uppercase tracking-wider ${
            selected ? 'text-zinc-300' : 'text-zinc-400'
          }`}>
            {service.name}
          </span>
          <span className="text-xl font-extrabold text-zinc-100 mt-1 block">
            {formatPrice(service.price)}
          </span>
        </div>
        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
          selected ? 'border-zinc-100 bg-zinc-100' : 'border-zinc-700 bg-zinc-950'
        }`}>
          {selected && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
        </div>
      </div>

      <p className="text-xs text-zinc-450 leading-relaxed mb-4">{service.description}</p>
      
      {service.features && (
        <ul className="space-y-1 text-[11px] text-zinc-400 border-t border-zinc-850 pt-4 list-disc list-inside">
          {service.features.map((f, i) => (
            <li key={i} className="truncate">{f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
