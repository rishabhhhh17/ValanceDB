import { useMemo, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, LineController
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, LineController);

const REGION_FLAGS  = { India: '🇮🇳', US: '🇺🇸', UK: '🇬🇧', Singapore: '🇸🇬' };
const REGION_COLORS = { India: '#3b82f6', US: '#8b5cf6', UK: '#10b981', Singapore: '#f59e0b' };

export default function AnalyticsTab({ deals }) {
  const allYears = useMemo(() => [...new Set(deals.map(d => d.year))].sort(), [deals]);

  const [yearFrom, setYearFrom] = useState(() => Math.min(...deals.map(d => d.year)));
  const [yearTo,   setYearTo]   = useState(() => Math.max(...deals.map(d => d.year)));

  const isFiltered = yearFrom !== allYears[0] || yearTo !== allYears[allYears.length - 1];

  const filteredDeals = useMemo(
    () => deals.filter(d => d.year >= yearFrom && d.year <= yearTo),
    [deals, yearFrom, yearTo]
  );

  const { sectorData, typeVolume, yearData, regionData } = useMemo(() => {
    const sData = {};
    const tData = {};
    const yData = {};
    const rData = {};

    filteredDeals.forEach(d => {
      sData[d.sector] = (sData[d.sector] || 0) + 1;
      tData[d.type]   = (tData[d.type]   || 0) + d.revenue_cr;

      if (!yData[d.year]) yData[d.year] = { vol: 0, count: 0 };
      yData[d.year].vol   += d.value_cr;
      yData[d.year].count += 1;

      if (!rData[d.region]) rData[d.region] = { count: 0, vol: 0 };
      rData[d.region].count += 1;
      rData[d.region].vol   += d.value_cr;
    });

    return { sectorData: sData, typeVolume: tData, yearData: yData, regionData: rData };
  }, [filteredDeals]);

  const globalOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { display: false } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(0,0,0,0.05)', borderDash: [5, 5] } }
    }
  };

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#475569', usePointStyle: true, boxWidth: 8 } }
    },
    cutout: '70%'
  };

  const sectorChart = {
    labels: Object.keys(sectorData),
    datasets: [{
      label: 'Deal Count',
      data: Object.values(sectorData),
      backgroundColor: '#dee4ff',
      hoverBackgroundColor: '#8b5cf6',
      borderRadius: 4
    }]
  };

  const typeChart = {
    labels: Object.keys(typeVolume),
    datasets: [{
      data: Object.values(typeVolume),
      backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#c3ccff'],
      borderWidth: 0,
    }]
  };

  const sortedYears = Object.keys(yearData).sort();
  const yearChart = {
    labels: sortedYears,
    datasets: [{
      type: 'line',
      label: 'Deal Count',
      data: sortedYears.map(y => yearData[y].count),
      borderColor: '#3b82f6',
      backgroundColor: '#3b82f6',
      borderWidth: 2,
      tension: 0.4,
      yAxisID: 'y1',
    }, {
      type: 'bar',
      label: 'Volume (₹ Cr)',
      data: sortedYears.map(y => yearData[y].vol),
      backgroundColor: '#dee4ff',
      borderRadius: 4,
      yAxisID: 'y',
    }]
  };

  const maxRegionCount = Math.max(...Object.values(regionData).map(s => s.count), 1);

  return (
    <div className="flex-col gap-6">

      {/* Year Range Filter */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Year Range</span>
        <select
          className="btn-secondary"
          value={yearFrom}
          onChange={e => {
            const v = Number(e.target.value);
            setYearFrom(v);
            if (v > yearTo) setYearTo(v);
          }}
          style={{ padding: '0.4rem 0.75rem' }}
        >
          {allYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>to</span>
        <select
          className="btn-secondary"
          value={yearTo}
          onChange={e => {
            const v = Number(e.target.value);
            setYearTo(v);
            if (v < yearFrom) setYearFrom(v);
          }}
          style={{ padding: '0.4rem 0.75rem' }}
        >
          {allYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        {isFiltered && (
          <button
            onClick={() => { setYearFrom(allYears[0]); setYearTo(allYears[allYears.length - 1]); }}
            style={{ color: 'var(--accent-blue)', fontSize: '0.85rem', textDecoration: 'underline' }}
          >
            Reset
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid-metrics">
        <div className="glass-card flex-col gap-2">
          <div className="text-muted">Total Indexed Deals</div>
          <div className="flex items-end gap-3">
            <div className="page-title" style={{ fontSize: '2rem' }}>{filteredDeals.length}</div>
            {isFiltered && (
              <div className="text-sm" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                of {deals.length}
              </div>
            )}
          </div>
          <div className="text-sm mt-2 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', color: '#64748b' }}>
            Purpose: Number of pending & completed deals recognized by Valance DB.
          </div>
        </div>
        <div className="glass-card flex-col gap-2">
          <div className="text-muted">Files Processed</div>
          <div className="flex items-end gap-3">
            <div className="page-title" style={{ fontSize: '2rem' }}>{filteredDeals.reduce((a, b) => a + b.files.length, 0)}</div>
          </div>
          <div className="text-sm mt-2 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', color: '#64748b' }}>
            Purpose: Total number of unstructured documents successfully extracted.
          </div>
        </div>
        <div className="glass-card flex-col gap-2">
          <div className="text-muted">Total Volume</div>
          <div className="flex items-end gap-3">
            <div className="page-title" style={{ fontSize: '2rem' }}>
              ₹{(filteredDeals.reduce((a, b) => a + b.value_cr, 0) / 1000).toFixed(1)}k Cr
            </div>
          </div>
          <div className="text-sm mt-2 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', color: '#64748b' }}>
            Purpose: Tracks aggregate pipeline Enterprise Value scale.
          </div>
        </div>
        <div className="glass-card flex-col gap-2">
          <div className="text-muted">Advisory Revenue</div>
          <div className="flex items-end gap-3">
            <div className="page-title" style={{ fontSize: '2rem' }}>
              ₹{filteredDeals.reduce((a, b) => a + b.revenue_cr, 0).toFixed(0)} Cr
            </div>
          </div>
          <div className="text-sm mt-2 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', color: '#64748b' }}>
            Purpose: Live estimation of firm fee pool based on margin data.
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2">
        <div className="glass-card" style={{ height: '380px' }}>
          <h3 className="mb-1">Historical Cash Flow (Volume)</h3>
          <p className="text-sm text-muted mb-4">Metric info: Tracks liquidity trends & velocity.</p>
          <div style={{ height: '250px' }}>
            <Bar data={yearChart} options={{
              ...globalOpts,
              scales: {
                y:  { type: 'linear', display: true,  position: 'left',  ticks: { color: '#64748b', maxTicksLimit: 5 }, grid: { color: 'rgba(0,0,0,0.05)', borderDash: [5, 5] } },
                y1: { type: 'linear', display: false, position: 'right' }
              }
            }} />
          </div>
        </div>
        <div className="glass-card" style={{ height: '380px' }}>
          <h3 className="mb-1">Revenue Sources</h3>
          <p className="text-sm text-muted mb-4">Metric info: Highlights which transaction typologies generate the most fees.</p>
          <div style={{ height: '250px' }}>
            <Doughnut data={typeChart} options={doughnutOpts} />
          </div>
        </div>
      </div>

      {/* Sector + Region Row */}
      <div className="grid-2">
        <div className="glass-card" style={{ height: '380px' }}>
          <h3 className="mb-1">Sector Distribution</h3>
          <p className="text-sm text-muted mb-4">Metric info: Visualizes current pipeline risk concentration and diversification.</p>
          <div style={{ height: '250px' }}>
            <Bar data={sectorChart} options={{ ...globalOpts, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Regional Breakdown */}
        <div className="glass-card flex-col gap-4">
          <div>
            <h3 className="mb-1">Regional Breakdown</h3>
            <p className="text-sm text-muted">Metric info: Geographic concentration of deal pipeline and revenue sources.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {Object.entries(regionData)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([region, stats]) => (
                <div key={region} style={{
                  background: 'rgba(0,0,0,0.02)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{REGION_FLAGS[region] || '🌍'}</span>
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{region}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '1.4rem', lineHeight: 1 }}>{stats.count}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.6rem' }}>
                    ₹{(stats.vol / 1000).toFixed(1)}k Cr
                  </div>
                  <div style={{ height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '99px' }}>
                    <div style={{
                      height: '100%',
                      width: `${(stats.count / maxRegionCount) * 100}%`,
                      background: REGION_COLORS[region] || '#8b5cf6',
                      borderRadius: '99px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

    </div>
  );
}
