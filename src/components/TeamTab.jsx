import { useMemo, useState } from 'react';

// ─── Mock Profile Data ────────────────────────────────────────────────────────
const PROFILES = {
  'Neha Jain': {
    title: 'Managing Director',
    joined: 2016,
    location: 'Mumbai',
    bio: 'Leads Healthcare & Infrastructure verticals. 12+ years in IB with prior stints at Goldman Sachs and JPMorgan. Known for originating cross-border M&A mandates across South Asia.',
    expertise: ['Healthcare', 'Infrastructure', 'M&A'],
    email: 'neha.jain@valancedb.com',
  },
  'Rishi Kapoor': {
    title: 'Managing Director',
    joined: 2015,
    location: 'Mumbai',
    bio: 'Heads DCM coverage for large BFSI clients. Specialist in complex debt instruments, hybrid securities, and sovereign-grade transactions across India and Southeast Asia.',
    expertise: ['BFSI', 'Healthcare', 'DCM'],
    email: 'rishi.kapoor@valancedb.com',
  },
  'Vikram Patel': {
    title: 'Director',
    joined: 2017,
    location: 'Bangalore',
    bio: 'Consumer Tech & PE specialist with deep relationships across Tier-1 PE funds. Holds the highest average deal size on the team and led 3 landmark tech buyouts in 2023.',
    expertise: ['Consumer Tech', 'PE/VC', 'M&A'],
    email: 'vikram.patel@valancedb.com',
  },
  'Arjun Mehta': {
    title: 'Vice President',
    joined: 2019,
    location: 'Delhi',
    bio: 'Rising star in EdTech and BFSI coverage. Led 4 successful IPOs in the past two years. Known for sharp market-timing instincts in volatile ECM windows.',
    expertise: ['EdTech', 'BFSI', 'ECM', 'PE/VC'],
    email: 'arjun.mehta@valancedb.com',
  },
  'Rohan Gupta': {
    title: 'Vice President',
    joined: 2018,
    location: 'Mumbai',
    bio: 'Infrastructure and Fintech coverage. Maintains strong relationships with sovereign wealth funds, infra PE, and developmental finance institutions across the Gulf and Singapore.',
    expertise: ['Infrastructure', 'Fintech', 'M&A', 'ECM'],
    email: 'rohan.gupta@valancedb.com',
  },
  'Priya Sharma': {
    title: 'Associate',
    joined: 2021,
    location: 'Mumbai',
    bio: 'Fintech ECM specialist and former analyst at Morgan Stanley. Recognised for meticulous financial modelling and client-ready pitch books. Top performer in her associate cohort.',
    expertise: ['Fintech', 'ECM', 'M&A'],
    email: 'priya.sharma@valancedb.com',
  },
  'Ananya Roy': {
    title: 'Associate',
    joined: 2022,
    location: 'Bangalore',
    bio: 'EdTech and Consumer Tech coverage. IIM-A alumna with prior growth equity experience at a leading VC fund. Brings a unique operator lens to deal evaluation.',
    expertise: ['EdTech', 'Consumer Tech', 'PE/VC', 'DCM'],
    email: 'ananya.roy@valancedb.com',
  },
  'Karan Singh': {
    title: 'Analyst',
    joined: 2023,
    location: 'Delhi',
    bio: 'Energy sector specialist focused on renewable transitions and infrastructure financing. IIT-D graduate, direct campus hire. Fastest-ramping analyst in the current cohort.',
    expertise: ['Energy', 'Consumer Tech', 'DCM', 'PE/VC'],
    email: 'karan.singh@valancedb.com',
  },
};

const AVATAR_PALETTE = [
  { bg: '#dee4ff', color: '#1e3a8a' },
  { bg: '#dcfce7', color: '#166534' },
  { bg: '#ffedd5', color: '#854d0e' },
  { bg: '#fce7f3', color: '#9d174d' },
  { bg: '#fef08a', color: '#713f12' },
  { bg: '#e0f2fe', color: '#0369a1' },
  { bg: '#f3e8ff', color: '#6b21a8' },
  { bg: '#ecfdf5', color: '#065f46' },
];

const SECTOR_COLORS = {
  'Healthcare':    '#10b981',
  'BFSI':          '#3b82f6',
  'Fintech':       '#8b5cf6',
  'EdTech':        '#f59e0b',
  'Infrastructure':'#64748b',
  'Consumer Tech': '#ec4899',
  'Energy':        '#f97316',
  'Other':         '#94a3b8',
};

const MEDAL = [
  { emoji: '🥇', podiumBg: 'linear-gradient(160deg, #fef9c3, #fef08a)', border: '#fbbf24', textColor: '#713f12' },
  { emoji: '🥈', podiumBg: 'linear-gradient(160deg, #f1f5f9, #e2e8f0)', border: '#94a3b8', textColor: '#334155' },
  { emoji: '🥉', podiumBg: 'linear-gradient(160deg, #fff7ed, #fed7aa)', border: '#f97316', textColor: '#7c2d12' },
];

const SORT_OPTIONS = [
  { id: 'deals',   label: 'By Deals'    },
  { id: 'revenue', label: 'By Revenue'  },
  { id: 'winrate', label: 'By Win Rate' },
];

const SECTION_LABEL = {
  fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem',
};

// ─── Profile Drawer ───────────────────────────────────────────────────────────
function ProfileDrawer({ member, deals, onClose }) {
  if (!member) return null;

  const profile      = PROFILES[member.name] || {};
  const memberDeals  = deals.filter(d => d.team.includes(member.name));
  const closedDeals  = memberDeals.filter(d => d.status === 'Closed');
  const winRate      = memberDeals.length ? Math.round((closedDeals.length / memberDeals.length) * 100) : 0;
  const avgDeal      = memberDeals.length ? memberDeals.reduce((a, b) => a + b.value_cr, 0) / memberDeals.length : 0;
  const yearsAtFirm  = 2026 - (profile.joined || 2020);

  const sectorCounts = {};
  memberDeals.forEach(d => { sectorCounts[d.sector] = (sectorCounts[d.sector] || 0) + 1; });
  const sectorEntries  = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]);
  const maxSectorCount = sectorEntries[0]?.[1] || 1;

  const topDeals = [...memberDeals].sort((a, b) => b.value_cr - a.value_cr).slice(0, 4);

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15, 23, 42, 0.2)',
        backdropFilter: 'blur(3px)', zIndex: 100
      }} />

      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: '480px',
        background: 'var(--bg-elevated)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.08)',
        zIndex: 101, overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.22s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Header band */}
        <div style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #eef2ff 0%, #f8f9ff 100%)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          position: 'relative'
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', color: 'var(--text-muted)'
          }}>✕</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: member.avatarColor.bg, color: member.avatarColor.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', fontWeight: 700,
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)', flexShrink: 0
            }}>{member.initials}</div>

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 2px 0' }}>{member.name}</h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '6px' }}>
                {profile.title || 'Banker'}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {profile.location && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 {profile.location}</span>}
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🏢 {yearsAtFirm}y at firm</span>
                {profile.email && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>✉️ {profile.email}</span>}
              </div>
            </div>
          </div>

          {profile.bio && (
            <p style={{ margin: '1.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              {profile.bio}
            </p>
          )}

          {profile.expertise?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              {profile.expertise.map(e => (
                <span key={e} style={{
                  fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.65rem',
                  borderRadius: '99px', background: 'rgba(139,92,246,0.1)', color: '#6d28d9'
                }}>{e}</span>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
            {[
              { label: 'Total Deals', value: memberDeals.length },
              { label: 'Closed',      value: closedDeals.length },
              { label: 'Win Rate',    value: `${winRate}%` },
              { label: 'Avg Size',    value: `₹${(avgDeal / 1000).toFixed(1)}k` },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)',
                borderRadius: 'var(--radius-sm)', padding: '0.75rem 0.5rem', textAlign: 'center'
              }}>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Revenue banner */}
          <div style={{
            background: 'var(--accent-primary)', borderRadius: 'var(--radius-sm)',
            padding: '1rem 1.25rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary-text)', fontWeight: 500 }}>Revenue Attributed</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary-text)' }}>
              ₹{member.revenueAttributed.toFixed(0)} Cr
            </span>
          </div>

          {/* Sector expertise */}
          <div>
            <div style={SECTION_LABEL}>Sector Expertise</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {sectorEntries.slice(0, 6).map(([sector, count]) => (
                <div key={sector}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: SECTOR_COLORS[sector] || '#94a3b8', display: 'inline-block' }} />
                      {sector}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{count} deals</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(0,0,0,0.05)', borderRadius: '99px' }}>
                    <div style={{
                      height: '100%', width: `${(count / maxSectorCount) * 100}%`,
                      background: SECTOR_COLORS[sector] || '#94a3b8',
                      borderRadius: '99px', transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Landmark deals */}
          <div>
            <div style={SECTION_LABEL}>Landmark Deals</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {topDeals.map(deal => (
                <div key={deal.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.88rem' }}>{deal.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>
                      {deal.type} · {deal.sector} · {deal.year}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>₹{deal.value_cr.toLocaleString()} Cr</div>
                    <span style={{
                      fontSize: '0.7rem', padding: '1px 7px', borderRadius: '99px',
                      background: deal.status === 'Closed' ? '#dcfce7' : '#fef08a',
                      color:      deal.status === 'Closed' ? '#166534' : '#854d0e'
                    }}>{deal.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TeamTab({ deals }) {
  const [sortBy,   setSortBy]   = useState('deals');
  const [query,    setQuery]    = useState('');
  const [selected, setSelected] = useState(null);

  const teamStats = useMemo(() => {
    const nameOrder = Object.keys(PROFILES);
    const stats = {};

    deals.forEach(deal => {
      const rev = deal.team.length > 0 ? deal.revenue_cr / deal.team.length : 0;
      deal.team.forEach(name => {
        if (!stats[name]) {
          const idx = nameOrder.indexOf(name);
          stats[name] = {
            name,
            initials: name.split(' ').map(n => n[0]).join('').substring(0, 2),
            avatarColor: AVATAR_PALETTE[idx >= 0 ? idx % AVATAR_PALETTE.length : Object.keys(stats).length % AVATAR_PALETTE.length],
            dealCount: 0, revenueAttributed: 0, closedCount: 0, sectors: new Set()
          };
        }
        stats[name].dealCount         += 1;
        stats[name].revenueAttributed += rev;
        stats[name].sectors.add(deal.sector);
        if (deal.status === 'Closed') stats[name].closedCount += 1;
      });
    });

    return Object.values(stats);
  }, [deals]);

  const sorted = useMemo(() => {
    let list = [...teamStats];
    if (sortBy === 'deals')   list.sort((a, b) => b.dealCount - a.dealCount);
    if (sortBy === 'revenue') list.sort((a, b) => b.revenueAttributed - a.revenueAttributed);
    if (sortBy === 'winrate') list.sort((a, b) => (b.closedCount / b.dealCount) - (a.closedCount / a.dealCount));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        (PROFILES[m.name]?.title || '').toLowerCase().includes(q) ||
        (PROFILES[m.name]?.expertise || []).some(e => e.toLowerCase().includes(q))
      );
    }
    return list;
  }, [teamStats, sortBy, query]);

  // Podium: Silver (#2) | Gold (#1) | Bronze (#3)
  const podiumOrder   = [sorted[1], sorted[0], sorted[2]].filter(Boolean);
  const podiumMedals  = [MEDAL[1], MEDAL[0], MEDAL[2]];
  const podiumHeights = ['200px', '240px', '180px'];
  const podiumIsFirst = [false, true, false];

  const teamTotal = teamStats.reduce((a, b) => a + b.revenueAttributed, 0);

  return (
    <div className="flex-col gap-6">

      {/* ── Leaderboard Podium ─────────────────────────────────────────────── */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ margin: 0, marginBottom: '4px' }}>Team Leaderboard</h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Ranked by {sortBy === 'deals' ? 'total deal count' : sortBy === 'revenue' ? 'revenue attributed' : 'win rate'}
              {' '}· Click a card to view profile
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                style={{
                  padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                  background: sortBy === opt.id ? 'var(--accent-primary)' : 'rgba(0,0,0,0.04)',
                  color:      sortBy === opt.id ? 'var(--accent-primary-text)' : 'var(--text-secondary)',
                  border: 'none', transition: '0.15s'
                }}
              >{opt.label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', justifyContent: 'center' }}>
          {podiumOrder.map((member, i) => {
            const medal   = podiumMedals[i];
            const isFirst = podiumIsFirst[i];
            const winRate = Math.round((member.closedCount / member.dealCount) * 100);
            return (
              <div
                key={member.name}
                onClick={() => setSelected(member)}
                style={{
                  flex: isFirst ? '1.15' : '1', minWidth: 0,
                  height: podiumHeights[i],
                  borderRadius: 'var(--radius-md)',
                  background: medal.podiumBg,
                  border: `1.5px solid ${medal.border}50`,
                  padding: '1.25rem 1rem',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'flex-end',
                  textAlign: 'center', cursor: 'pointer', transition: '0.18s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: isFirst ? '2rem' : '1.6rem', marginBottom: '0.4rem' }}>{medal.emoji}</div>
                <div style={{
                  width: isFirst ? '52px' : '42px', height: isFirst ? '52px' : '42px',
                  borderRadius: '50%',
                  background: member.avatarColor.bg, color: member.avatarColor.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: isFirst ? '1.1rem' : '0.9rem', fontWeight: 700,
                  marginBottom: '0.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>{member.initials}</div>
                <div style={{ fontWeight: 600, fontSize: isFirst ? '0.95rem' : '0.85rem', color: medal.textColor, lineHeight: 1.2 }}>
                  {member.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: medal.textColor, opacity: 0.65, marginTop: '2px' }}>
                  {PROFILES[member.name]?.title || ''}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: medal.textColor, fontWeight: 600 }}>
                  {sortBy === 'deals'   ? `${member.dealCount} deals` :
                   sortBy === 'revenue' ? `₹${member.revenueAttributed.toFixed(0)} Cr` :
                   `${winRate}% win`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Full Ranked Table ──────────────────────────────────────────────── */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ margin: 0, marginBottom: '4px' }}>Coverage Team</h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {sorted.length} members · Click any row to view full profile
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', pointerEvents: 'none' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by name, title, expertise..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '2.2rem', width: '280px', padding: '0.55rem 1rem 0.55rem 2.2rem' }}
            />
          </div>
        </div>

        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '36px 2.5fr 1fr 1.5fr 1.1fr 2fr 70px',
          padding: '0.4rem 1rem', fontSize: '0.75rem', fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em',
          marginBottom: '0.25rem'
        }}>
          <div>#</div>
          <div>Member</div>
          <div>Deals</div>
          <div>Revenue</div>
          <div>Win Rate</div>
          <div>Top Sectors</div>
          <div />
        </div>

        {sorted.map((member, i) => {
          const winRate    = Math.round((member.closedCount / member.dealCount) * 100);
          const topSectors = Array.from(member.sectors).slice(0, 2);
          const revShare   = teamTotal > 0 ? (member.revenueAttributed / teamTotal * 100).toFixed(0) : 0;
          const rankColor  = i === 0 ? '#ca8a04' : i === 1 ? '#64748b' : i === 2 ? '#ea580c' : 'var(--text-muted)';

          return (
            <div
              key={member.name}
              onClick={() => setSelected(member)}
              style={{
                display: 'grid', gridTemplateColumns: '36px 2.5fr 1fr 1.5fr 1.1fr 2fr 70px',
                padding: '0.85rem 1rem', alignItems: 'center',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.4)',
                marginBottom: '0.4rem',
                cursor: 'pointer', transition: '0.15s',
                borderBottom: '1px solid rgba(0,0,0,0.03)'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.transform = 'translateX(2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.4)';  e.currentTarget.style.transform = 'translateX(0)'; }}
            >
              {/* Rank */}
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: rankColor }}>{i + 1}</div>

              {/* Member */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                  background: member.avatarColor.bg, color: member.avatarColor.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 600
                }}>{member.initials}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{member.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {PROFILES[member.name]?.title || '—'}
                  </div>
                </div>
              </div>

              {/* Deals */}
              <div>
                <div style={{ fontWeight: 500 }}>{member.dealCount}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{member.closedCount} closed</div>
              </div>

              {/* Revenue */}
              <div>
                <div style={{ fontWeight: 500 }}>₹{member.revenueAttributed.toFixed(0)} Cr</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{revShare}% of team</div>
              </div>

              {/* Win rate */}
              <div>
                <div style={{ fontWeight: 500, marginBottom: '3px' }}>{winRate}%</div>
                <div style={{ height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '99px', width: '56px' }}>
                  <div style={{
                    height: '100%', width: `${winRate}%`,
                    background: winRate >= 70 ? '#10b981' : winRate >= 50 ? '#f59e0b' : '#ef4444',
                    borderRadius: '99px'
                  }} />
                </div>
              </div>

              {/* Sectors */}
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {topSectors.map(s => (
                  <span key={s} style={{
                    fontSize: '0.7rem', padding: '0.15rem 0.55rem', borderRadius: '99px',
                    background: `${SECTOR_COLORS[s] || '#94a3b8'}18`,
                    color: SECTOR_COLORS[s] || '#64748b', fontWeight: 500
                  }}>{s}</span>
                ))}
                {member.sectors.size > 2 && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{member.sectors.size - 2}</span>
                )}
              </div>

              {/* View */}
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', fontWeight: 500 }}>View →</span>
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>
            No team members match your search.
          </div>
        )}
      </div>

      <ProfileDrawer member={selected} deals={deals} onClose={() => setSelected(null)} />
    </div>
  );
}
