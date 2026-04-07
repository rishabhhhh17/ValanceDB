import { useState, useMemo } from 'react';
import { searchDeals, getFilterOptions } from '../utils/search';

export default function DealsTab({ deals }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ type: 'All', sector: 'All', status: 'All' });

  const options = useMemo(() => getFilterOptions(deals), [deals]);
  const filteredDeals = useMemo(() => searchDeals(deals, query, filters), [deals, query, filters]);

  const handleFilter = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <div className="search-wrapper" style={{maxWidth: '400px'}}>
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search deals..."
            className="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select className="btn-secondary" value={filters.type} onChange={e => handleFilter('type', e.target.value)}>
            {options.types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="btn-secondary" value={filters.sector} onChange={e => handleFilter('sector', e.target.value)}>
            {options.sectors.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="glass-card">
        <div className="flex justify-between items-center mb-6">
           <h3>Transactions</h3>
           <button className="btn-secondary">
             <span style={{marginRight:'8px'}}>▼</span> Filters
           </button>
        </div>
        
        {/* Table Header matching design */}
        <div className="list-header text-muted">
          <div>Client & Name</div>
          <div>Sector</div>
          <div>Amount</div>
          <div>Status</div>
        </div>
        
        {/* Table Rows matching design */}
        {filteredDeals.map(deal => (
          <div key={deal.id} className="list-row hover:shadow-sm" style={{transition: '0.2s', borderBottom: '1px solid rgba(0,0,0,0.03)'}}>
             <div>
               <div style={{fontWeight: 500}}>{deal.name}</div>
               <div className="text-muted text-sm">{deal.client}</div>
             </div>
             <div>
               <div className="text-muted">{deal.sector}</div>
               <div className="text-muted text-sm">{deal.type}</div>
             </div>
             <div style={{fontWeight: 500}}>₹{deal.value_cr} Cr</div>
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
          <div className="text-muted text-center p-8 w-full">No transactions match your search criteria.</div>
        )}
      </div>
    </div>
  );
}
