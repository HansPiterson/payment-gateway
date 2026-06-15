import { useState, useEffect, useRef } from 'react';
import { Drawer } from 'vaul';
import { Copy01Icon, LinkSquare02Icon, MoreHorizontalCircle01Icon, Cancel01Icon } from 'hugeicons-react';

/* ── Icons ── */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="#71717a" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M3 5L6 8L9 5" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Sample data ── */
const defaultOrders = [
  {
    id: '#ORD-7291',
    product: 'MacBook Pro 14"',
    sku: 'SKU-MB14-256',
    image: null,
    date: 'Jun 10, 2026',
    customer: 'Sarah Johnson',
    category: 'Electronics',
    status: 'Delivered',
    items: 1,
    total: 'Rp 1.999.000',
  },
  {
    id: '#ORD-7290',
    product: 'Nike Air Max 270',
    sku: 'SKU-NK270-BK',
    image: null,
    date: 'Jun 09, 2026',
    customer: 'Michael Chen',
    category: 'Footwear',
    status: 'Pending',
    items: 2,
    total: 'Rp 320.000',
  },
  {
    id: '#ORD-7289',
    product: 'Sony WH-1000XM5',
    sku: 'SKU-SNY-XM5',
    image: null,
    date: 'Jun 08, 2026',
    customer: 'Emily Davis',
    category: 'Electronics',
    status: 'Delivered',
    items: 1,
    total: 'Rp 348.000',
  },
  {
    id: '#ORD-7288',
    product: 'Organic Cotton Tee',
    sku: 'SKU-OCT-WH-L',
    image: null,
    date: 'Jun 07, 2026',
    customer: 'James Wilson',
    category: 'Apparel',
    status: 'Cancelled',
    items: 3,
    total: 'Rp 89.970',
  },
  {
    id: '#ORD-7287',
    product: 'Kindle Paperwhite',
    sku: 'SKU-KPW-11G',
    image: null,
    date: 'Jun 06, 2026',
    customer: 'Olivia Martinez',
    category: 'Electronics',
    status: 'Pending',
    items: 1,
    total: 'Rp 139.990',
  },
];

/* ── Color palettes for product avatars (Monochrome) ── */
const avatarBgClasses = [
  'bg-zinc-800 text-zinc-200',
  'bg-zinc-700 text-zinc-100',
  'bg-zinc-600 text-zinc-100',
  'bg-zinc-900 text-zinc-300 border border-zinc-800'
];

/* ── Status badge styling ── */
const getStatusBadgeClass = (status) => {
  const s = String(status).toLowerCase();
  if (s === 'delivered' || s === 'paid' || s === 'success') {
    return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-500/30';
  }
  if (s === 'cancelled' || s === 'expired') {
    return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30';
  }
  return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30';
};

export default function RecentOrders({ orders: propOrders }) {
  const ordersList = propOrders || defaultOrders;
  const [checkedRows, setCheckedRows] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const dialogRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop && selectedOrder) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [selectedOrder, isDesktop]);

  const toggleRow = (id) => {
    setCheckedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (checkedRows.length === ordersList.length) {
      setCheckedRows([]);
    } else {
      setCheckedRows(ordersList.map((o) => o.id));
    }
  };

  const paymentLink = selectedOrder && selectedOrder.paymentId 
    ? `${window.location.origin}/pay/${selectedOrder.paymentId}` 
    : '';

  const handleCopy = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const ActionContent = () => (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1 mb-2 text-left">
        <h3 className="text-lg font-bold text-foreground">Detail Link Pembayaran</h3>
        <p className="text-sm text-muted-foreground">Order: {selectedOrder?.id} - {selectedOrder?.product}</p>
      </div>
      <div className="bg-secondary/50 border border-border rounded-lg p-3 flex items-center justify-between gap-3 overflow-hidden">
        <span className="text-xs text-foreground truncate select-all">{paymentLink || 'Link tidak tersedia'}</span>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleCopy}
          disabled={!paymentLink}
          className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground py-3 rounded-xl text-[14px] font-semibold transition-ios disabled:opacity-50 active:scale-95"
        >
          <Copy01Icon size={18} />
          {copied ? 'Tersalin!' : 'Salin Link'}
        </button>
        <a
          href={paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl text-[14px] font-bold transition-ios active:scale-95 ${!paymentLink ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <LinkSquare02Icon size={18} />
          Buka Link
        </a>
      </div>
    </div>
  );

  return (
    <div className="glass-panel rounded-[1.5rem] py-6 flex flex-col w-full shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 mb-5 gap-4">
        <span className="text-xl font-bold text-foreground text-left tracking-tight">Recent orders</span>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex items-center flex-1 sm:flex-none">
            <span className="absolute left-3 pointer-events-none flex items-center">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-9 pr-4 py-2.5 border border-border rounded-full text-sm bg-secondary text-foreground outline-none w-full sm:w-56 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
              aria-label="Search orders"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-full bg-secondary text-foreground hover:bg-secondary/80 text-sm font-semibold transition-ios active:scale-95">
            Sort by
            <ChevronDown />
          </button>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto w-full border-t border-border/50">
        <table className="w-full border-collapse min-w-[800px] text-left">
          <thead>
            <tr className="border-b border-border/50 bg-secondary/20">
              <th className="pl-6 py-4 w-10">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-primary border-border bg-secondary accent-primary cursor-pointer"
                  checked={ordersList.length > 0 && checkedRows.length === ordersList.length}
                  onChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th className="py-4 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Product</th>
              <th className="py-4 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Order Id</th>
              <th className="py-4 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="py-4 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Customer</th>
              <th className="py-4 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Category</th>
              <th className="py-4 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="py-4 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">Items</th>
              <th className="py-4 pr-6 pl-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Total</th>
              <th className="py-4 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {ordersList.map((order, i) => (
              <tr
                key={order.id}
                className="hover:bg-secondary/30 transition-colors cursor-default"
              >
                <td className="pl-6 py-4 w-10">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-primary border-border bg-secondary accent-primary cursor-pointer"
                    checked={checkedRows.includes(order.id)}
                    onChange={() => toggleRow(order.id)}
                    aria-label={`Select ${order.product}`}
                  />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 ${
                      avatarBgClasses[i % avatarBgClasses.length]
                    }`}>
                      {(order.product || 'P').charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground leading-tight">{order.product || 'Unknown Product'}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{order.sku || '-'}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm font-bold text-foreground">
                  {order.id}
                </td>
                <td className="py-4 px-4 text-[13px] text-muted-foreground">{order.date}</td>
                <td className="py-4 px-4 text-[13px] text-foreground font-medium">{order.customer}</td>
                <td className="py-4 px-4 text-[13px] text-muted-foreground">{order.category}</td>
                <td className="py-4 px-4 text-[13px]">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-[13px] text-muted-foreground text-center">{order.items}</td>
                <td className="py-4 pr-6 pl-4 text-sm font-extrabold text-foreground text-right">
                  {order.total}
                </td>
                <td className="py-4 px-4 text-center">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-ios active:scale-95 inline-flex items-center justify-center"
                    aria-label="Aksi"
                  >
                    <MoreHorizontalCircle01Icon size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {ordersList.length === 0 && (
              <tr>
                <td colSpan="10" className="py-12 text-center text-xs text-zinc-500 font-medium">
                  Tidak ada transaksi baru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Desktop Native Dialog */}
      <dialog
        ref={dialogRef}
        className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl text-card-foreground backdrop:bg-background/80 backdrop:backdrop-blur-sm focus:outline-none outline-none animate-in fade-in zoom-in duration-200"
      >
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => setSelectedOrder(null)}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <Cancel01Icon size={20} />
          </button>
        </div>
        {selectedOrder && <ActionContent />}
      </dialog>

      {/* Mobile Draggable Drawer via Vaul */}
      {!isDesktop && (
        <Drawer.Root open={!!selectedOrder && !isDesktop} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]" />
            <Drawer.Content className="bg-card text-card-foreground flex flex-col rounded-t-[20px] h-auto mt-24 fixed bottom-0 left-0 right-0 outline-none z-[101] border-t border-border">
              <div className="p-4 bg-card rounded-t-[20px] flex-1">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/30 mb-6" />
                <div className="max-w-md mx-auto">
                  {selectedOrder && <ActionContent />}
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </div>
  );
}
