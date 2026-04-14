import { useState } from 'react';

const OPPS = [
  {
    id: 1, title: "Deal Credential Retrieval", category: "Knowledge", effort: "Low", impact: "High", saving: "95%",
    current: "Bankers spend 30-60 minutes searching shared drives and email chains.",
    automated: "Semantic search engine over structured deal corpus returns exact matches.", active: true
  },
  {
    id: 2, title: "Pipeline Reporting", category: "Reporting", effort: "Low", impact: "Medium", saving: "100%",
    current: "Junior analysts manually update a PowerPoint deck with pipeline status.",
    automated: "Live dashboard connects directly to CRM/deal database and auto-refreshes.", active: true
  },
  {
    id: 3, title: "Comparable Company Analysis", category: "Valuation", effort: "Low", impact: "High", saving: "85%",
    current: "Sourcing trading comps requires 2-4 hours of Bloomberg terminal extraction.",
    automated: "Python script pulls live market data via NSE/BSE API.", active: false
  },
  {
    id: 4, title: "NDA Drafting & Routing", category: "Legal", effort: "Medium", impact: "High", saving: "70%",
    current: "NDAs sit in legal queue for 2-3 days before being sent via email.",
    automated: "AI-generated drafts from standard templates routed instantly.", active: false
  }
];

export default function AutomationTab() {
  const [filter, setFilter] = useState("All");
  
  const categories = ["All", ...new Set(OPPS.map(o => o.category))];
  const filteredOpps = filter === "All" ? OPPS : OPPS.filter(o => o.category === filter);

  return (
    <div className="flex-col gap-6">
      <div className="flex gap-2">
        {categories.map(c => (
          <button 
            key={c}
            onClick={() => setFilter(c)}
            className={`badge ${filter === c ? 'badge-gold' : 'badge-outline'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid-2">
        {filteredOpps.map(opp => (
          <div key={opp.id} className="glass-card flex-col justify-between" style={{position: 'relative'}}>
            {opp.active && (
              <div 
                style={{position: 'absolute', top: '16px', right: '16px'}}
                className="badge badge-green"
              >
                LIVE
              </div>
            )}
            
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 style={{margin: 0, paddingRight: '60px'}}>{opp.title}</h3>
              </div>
              <div className="text-muted text-sm mb-4">
                {opp.category} • {opp.saving} Saving
                <div style={{marginTop: '6px', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4}}>
                  Metric info: "Effort" evaluates engineering time vs ROI. "Impact" evaluates the expected operational efficiency gain across the firm.
                </div>
              </div>
              
              <div className="flex gap-4 mb-4">
                <div>
                  <span className="text-muted text-sm mr-2">Effort:</span>
                  <span className="badge badge-outline">{opp.effort}</span>
                </div>
                <div>
                  <span className="text-muted text-sm mr-2">Impact:</span>
                  <span className="badge badge-outline">{opp.impact}</span>
                </div>
              </div>

              <div className="flex-col gap-2 mt-4 pt-4" style={{borderTop: '1px solid rgba(0,0,0,0.05)'}}>
                <div style={{background: '#fef2f2', padding: '0.75rem', borderRadius: 'var(--radius-sm)'}}>
                  <strong style={{color: '#b91c1c', display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem'}}>Current State</strong>
                  <div className="text-sm" style={{color: '#7f1d1d'}}>{opp.current}</div>
                </div>
                <div style={{background: '#f0fdf4', padding: '0.75rem', borderRadius: 'var(--radius-sm)'}}>
                  <strong style={{color: '#15803d', display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem'}}>Automated State</strong>
                  <div className="text-sm" style={{color: '#166534'}}>{opp.automated}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
