import { useMemo } from 'react';

export default function TeamTab({ deals }) {
  
  const teamStats = useMemo(() => {
    const stats = {};

    deals.forEach(deal => {
      const revenuePerMember = deal.team.length > 0 ? (deal.revenue_cr / deal.team.length) : 0;
      
      deal.team.forEach(member => {
        if (!stats[member]) {
          stats[member] = {
            name: member,
            initials: member.split(' ').map(n => n[0]).join('').substring(0,2),
            dealCount: 0,
            revenueAttributed: 0,
            sectors: new Set()
          };
        }
        stats[member].dealCount += 1;
        stats[member].revenueAttributed += revenuePerMember;
        stats[member].sectors.add(deal.sector);
      });
    });

    return Object.values(stats).sort((a, b) => b.dealCount - a.dealCount);
  }, [deals]);

  return (
    <div className="flex-col gap-6">
      
      <div className="flex justify-between items-center mb-2">
        <h3 style={{margin: 0}}>Coverage Team Performance</h3>
        <div className="search-wrapper" style={{width: '250px'}}>
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search team..." className="search-input" />
        </div>
      </div>

      <div className="glass-card">
        <div className="list-header text-muted" style={{gridTemplateColumns: '3fr 1fr 2fr 3fr 1fr'}}>
          <div>Team Member</div>
          <div>Deals</div>
          <div>Revenue</div>
          <div>Primary Sectors</div>
          <div style={{textAlign: 'right'}}>Details</div>
        </div>

        {teamStats.map((member, i) => (
          <div key={member.name} className="list-row hover:shadow-sm" style={{gridTemplateColumns: '3fr 1fr 2fr 3fr 1fr', transition: '0.2s', borderBottom: '1px solid rgba(0,0,0,0.03)'}}>
             <div className="flex items-center gap-3">
               <div 
                  className="flex items-center justify-center font-bold"
                  style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: i === 0 ? '#dee4ff' : i === 1 ? '#dcfce7' : i === 2 ? '#ffedd5' : 'rgba(0,0,0,0.05)',
                    color: i === 0 ? '#1e3a8a' : i === 1 ? '#166534' : i === 2 ? '#854d0e' : '#475569',
                    fontSize: '0.8rem'
                  }}
                >
                  {member.initials}
                </div>
               <div style={{fontWeight: 500}}>{member.name}</div>
             </div>
             
             <div className="text-muted">{member.dealCount}</div>
             
             <div style={{fontWeight: 500}}>₹{member.revenueAttributed.toFixed(0)} Cr</div>
             
             <div className="text-muted text-sm">{Array.from(member.sectors).slice(0, 2).join(', ')} {member.sectors.size > 2 ? `+${member.sectors.size - 2}` : ''}</div>
             
             <div style={{textAlign: 'right'}}>
               <button className="text-sm" style={{color: '#64748b', textDecoration: 'underline'}}>View</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
