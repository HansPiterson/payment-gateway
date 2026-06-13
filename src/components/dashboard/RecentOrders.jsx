import React, { useState } from 'react';

/* ── Icons ── */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="#9CA3AF" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M3 5L6 8L9 5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Sample data ── */
const orders = [
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
    total: '$1,999.00',
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
    total: '$320.00',
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
    total: '$348.00',
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
    total: '$89.97',
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
    total: '$139.99',
  },
];

/* ── Color palettes for product avatars ── */
const avatarColors = ['#4880FF', '#00B69B', '#F93C65', '#F59E0B', '#8B5CF6'];

/* ── Status badge styles ── */
const statusStyles = {
  Delivered: {
    backgroundColor: 'rgba(0,182,155,0.12)',
    color: '#00B69B',
  },
  Cancelled: {
    backgroundColor: 'rgba(249,60,101,0.12)',
    color: '#F93C65',
  },
  Pending: {
    backgroundColor: 'rgba(245,158,11,0.12)',
    color: '#D97706',
  },
};

/* ── Styles ── */
const s = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    padding: '24px 0',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#202224',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  searchWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    padding: '7px 12px 7px 32px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    color: '#202224',
    backgroundColor: '#FFFFFF',
    width: '180px',
    transition: 'border-color 0.2s',
  },
  sortBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 14px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    color: '#6B7280',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
  },
  tableWrap: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '820px',
  },
  th: {
    textAlign: 'left',
    padding: '10px 16px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #F0F0F4',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '14px 16px',
    fontSize: '13px',
    color: '#202224',
    borderBottom: '1px solid #F8F8FB',
    verticalAlign: 'middle',
  },
  tr: {
    transition: 'background-color 0.15s',
    cursor: 'default',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    accentColor: '#4880FF',
    cursor: 'pointer',
  },
  productCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 0,
  },
  productName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#202224',
    lineHeight: '1.3',
  },
  productSku: {
    fontSize: '11px',
    color: '#9CA3AF',
    fontWeight: '400',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
};

export default function RecentOrders() {
  const [checkedRows, setCheckedRows] = useState([]);

  const toggleRow = (id) => {
    setCheckedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (checkedRows.length === orders.length) {
      setCheckedRows([]);
    } else {
      setCheckedRows(orders.map((o) => o.id));
    }
  };

  return (
    <div style={s.card} className="recent-orders-card">
      {/* Header */}
      <div style={s.header}>
        <span style={s.title}>Recent orders</span>
        <div style={s.headerRight}>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search orders..."
              style={s.searchInput}
              aria-label="Search orders"
            />
          </div>
          <button style={s.sortBtn}>
            Sort by
            <ChevronDown />
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{ ...s.th, paddingLeft: '24px', width: '40px' }}>
                <input
                  type="checkbox"
                  style={s.checkbox}
                  checked={checkedRows.length === orders.length}
                  onChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th style={s.th}>Product</th>
              <th style={s.th}>Order Id</th>
              <th style={s.th}>Date</th>
              <th style={s.th}>Customer</th>
              <th style={s.th}>Category</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Items</th>
              <th style={{ ...s.th, paddingRight: '24px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={order.id}
                style={s.tr}
                className="orders-table-row"
              >
                <td style={{ ...s.td, paddingLeft: '24px', width: '40px' }}>
                  <input
                    type="checkbox"
                    style={s.checkbox}
                    checked={checkedRows.includes(order.id)}
                    onChange={() => toggleRow(order.id)}
                    aria-label={`Select ${order.product}`}
                  />
                </td>
                <td style={s.td}>
                  <div style={s.productCell}>
                    <div
                      style={{
                        ...s.avatar,
                        backgroundColor: avatarColors[i % avatarColors.length],
                      }}
                    >
                      {order.product.charAt(0)}
                    </div>
                    <div>
                      <div style={s.productName}>{order.product}</div>
                      <div style={s.productSku}>{order.sku}</div>
                    </div>
                  </div>
                </td>
                <td style={{ ...s.td, fontWeight: '500', color: '#4880FF' }}>
                  {order.id}
                </td>
                <td style={{ ...s.td, color: '#6B7280' }}>{order.date}</td>
                <td style={s.td}>{order.customer}</td>
                <td style={{ ...s.td, color: '#6B7280' }}>{order.category}</td>
                <td style={s.td}>
                  <span
                    style={{
                      ...s.statusBadge,
                      ...statusStyles[order.status],
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td style={{ ...s.td, textAlign: 'center' }}>{order.items}</td>
                <td style={{ ...s.td, fontWeight: '600', paddingRight: '24px' }}>
                  {order.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .orders-table-row:hover {
          background-color: #F8F9FF !important;
        }
        .recent-orders-card input[type="text"]:focus {
          border-color: #4880FF;
        }
        @media (max-width: 600px) {
          .recent-orders-card {
            padding: 16px 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
