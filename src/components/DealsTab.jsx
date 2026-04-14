import { useState, useMemo } from 'react';
import { searchDeals, getFilterOptions } from '../utils/search';

const FILE_ICONS = { pdf: '📄', xlsx: '📊', pptx: '📑', docx: '📝' };
const REGION_FLAGS = { India: '🇮🇳', US: '🇺🇸', UK: '🇬🇧', Singapore: '🇸🇬' };
const AVATAR_COLORS = [
  { bg: '#dee4ff', color: '#1e3a8a' },
  { bg: '#dcfce7', color: '#166534' },
  { bg: '#ffedd5', color: '#854d0e' },
  { bg: '#fce7f3', color: '#9d174d' },
];

const SECTION_LABEL = {
  fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem'
};

function DealDrawer({ deal, onClose }) {
  if (!deal) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15, 23, 42, 0.2)',
          backdropFilter: 'blur(3px)',
          zIndex: 100
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0,
        width: '440px',
        background: 'var(--bg-elevated)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.08)',
        zIndex: 101,
        overflowY: 'auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        animation: 'slideIn 0.22s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, marginBottom: '4px' }}>{deal.name}</h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{deal.client}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', color: 'var(--text-muted)', flexShrink: 0
            }}
          >✕</button>
        </div>

        {/* Status */}
        <div>
          {deal.status === 'Closed' ? (
            <span className="badge badge-blue">CLOSED</span>
          ) : deal.status === 'In Progress' ? (
            <span className="badge badge-purple">PENDING</span>
          ) : (
            <span className="badge badge-outline">PIPELINE</span>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { label: 'Deal Value', value: `₹${deal.value_cr.toLocaleString()} Cr` },
            { label: 'Advisory Revenue', value: `₹${deal.revenue_cr} Cr` },
            { label: 'Type', value: deal.type },
            { label: 'Year', value: deal.year },
            { label: 'Region', value: `${REGION_FLAGS[deal.region] || ''} ${deal.region}` },
            { label: 'Sector', value: deal.sector },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'rgba(0,0,0,0.02)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              border: '1px solid rgba(0,0,0,0.04)'
            }}>
              <div style={{ ...SECTION_LABEL, marginBottom: '4px' }}>{label}</div>
              <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }} />

        {/* Team */}
        <div>
          <div style={SECTION_LABEL}>Team ({deal.team.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {deal.team.map((member, i) => {
              const initials = member.split(' ').map(n => n[0]).join('').substring(0, 2);
              const c = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <div key={member} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: c.bg, color: c.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 600, flexShrink: 0
                  }}>{initials}</div>
                  <span style={{ fontSize: '0.9rem' }}>{member}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Files */}
        <div>
          <div style={SECTION_LABEL}>Files ({deal.files.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {deal.files.map(file => {
              const ext = file.split('.').pop().toLowerCase();
              return (
                <div key={file} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  background: 'rgba(0,0,0,0.02)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(0,0,0,0.04)',
                  fontSize: '0.85rem'
                }}>
                  <span>{FILE_ICONS[ext] || '📁'}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{file}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        {deal.tags?.length > 0 && (
          <div>
            <div style={SECTION_LABEL}>Tags</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {deal.tags.map(tag => (
                <span key={tag} className="badge badge-outline">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function DealsTab({ deals }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ type: 'All', sector: 'All', status: 'All' });
  const [selectedDeal, setSelectedDeal] = useState(null);

  const options = useMemo(() => getFilterOptions(deals), [deals]);
  const filteredDeals = useMemo(() => searchDeals(deals, query, filters), [deals, query, filters]);

  const handleFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const exportCSV = () => {
    const headers = ['Name', 'Client', 'Type', 'Sector', 'Status', 'Value (Cr)', 'Revenue (Cr)', 'Year', 'Region', 'Team'];
    const rows = filteredDeals.map(d => [
      d.name, d.client, d.type, d.sector, d.status,
      d.value_cr, d.revenue_cr, d.year, d.region,
      d.team.join('; ')
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'valance_deals.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-col gap-6">

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="search-wrapper" style={{ maxWidth: '380px' }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search deals, team, tags..."
            className="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select className="btn-secondary" value={filters.type} onChange={e => handleFilter('type', e.target.value)}>
            {options.types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="btn-secondary" value={filters.sector} onChange={e => handleFilter('sector', e.target.value)}>
            {options.sectors.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="btn-secondary" value={filters.status} onChange={e => handleFilter('status', e.target.value)}>
            {options.statuses.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button className="btn-primary" onClick={exportCSV}>
            ↓ Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h3 className="mb-1">Transactions</h3>
            <div className="text-sm text-muted" style={{ maxWidth: '500px', lineHeight: 1.4 }}>
              Metric info: Displays pipeline sector distribution, exact transaction values mapping to liquidity, and current execution status to prioritize action.
            </div>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>
            {filteredDeals.length} of {deals.length}
          </div>
        </div>

        <div className="list-header text-muted">
          <div>Client & Name</div>
          <div>Sector</div>
          <div>Amount</div>
          <div>Status</div>
        </div>

        {filteredDeals.map(deal => (
          <div
            key={deal.id}
            className="list-row"
            onClick={() => setSelectedDeal(deal)}
            style={{ transition: '0.15s', borderBottom: '1px solid rgba(0,0,0,0.03)', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.transform = 'translateX(2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateX(0)'; }}
          >
            <div>
              <div style={{ fontWeight: 500 }}>{deal.name}</div>
              <div className="text-muted text-sm">{deal.client}</div>
            </div>
            <div>
              <div className="text-muted">{deal.sector}</div>
              <div className="text-muted text-sm">{deal.type}</div>
            </div>
            <div style={{ fontWeight: 500 }}>₹{deal.value_cr.toLocaleString()} Cr</div>
            <div>
              {deal.status === 'Closed' ? (
                <span className="badge badge-blue">CLOSED</span>
              ) : deal.status === 'In Progress' ? (
                <span className="badge badge-purple">PENDING</span>
              ) : (
                <span className="badge badge-outline">PIPELINE</span>
              )}
            </div>
          </div>
        ))}

        {filteredDeals.length === 0 && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem', width: '100%' }}>
            No transactions match your search criteria.
          </div>
        )}
      </div>

      <DealDrawer deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
    </div>
  );
}
