import { useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function AnalyticsTab({ deals }) {
  const { sectorData, typeVolume, yearData } = useMemo(() => {
    const sData = {};
    const tData = {};
    const yData = {};

    deals.forEach(d => {
      sData[d.sector] = (sData[d.sector] || 0) + 1;
      tData[d.type] = (tData[d.type] || 0) + d.revenue_cr;
      
      if (!yData[d.year]) {
        yData[d.year] = { vol: 0, count: 0 };
      }
      yData[d.year].vol += d.value_cr;
      yData[d.year].count += 1;
    });

    return { sectorData: sData, typeVolume: tData, yearData: yData };
  }, [deals]);

  const globalOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
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
      backgroundColor: [
        '#3b82f6',
        '#8b5cf6',
        '#10b981',
        '#c3ccff'
      ],
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

  return (
    <div className="flex-col gap-6">
      {/* Top row matching image 1 KPI style */}
      <div className="grid-metrics">
        <div className="glass-card flex-col gap-2">
          <div className="text-muted">Total Indexed Deals</div>
          <div className="flex items-end gap-3">
             <div className="page-title" style={{fontSize: '2rem'}}>{deals.length}</div>
             <div className="text-sm" style={{color: '#10b981', marginBottom: '0.5rem'}}>↗ 100%</div>
          </div>
        </div>
        <div className="glass-card flex-col gap-2">
          <div className="text-muted">Files Processed</div>
          <div className="flex items-end gap-3">
             <div className="page-title" style={{fontSize: '2rem'}}>{deals.reduce((a,b) => a + b.files.length, 0)}</div>
          </div>
        </div>
        <div className="glass-card flex-col gap-2">
          <div className="text-muted">Total Volume</div>
          <div className="flex items-end gap-3">
             <div className="page-title" style={{fontSize: '2rem'}}>₹{(deals.reduce((a,b) => a + b.value_cr, 0) / 1000).toFixed(1)}k Cr</div>
          </div>
        </div>
        <div className="glass-card flex-col gap-2">
          <div className="text-muted">Advisory Revenue</div>
          <div className="flex items-end gap-3">
             <div className="page-title" style={{fontSize: '2rem'}}>₹{deals.reduce((a,b) => a + b.revenue_cr, 0).toFixed(0)} Cr</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card" style={{height: '350px'}}>
          <h3 className="mb-4">Historical Cash Flow (Volume)</h3>
          <div style={{height: '250px'}}>
             <Bar data={yearChart} options={{
               ...globalOpts,
               scales: {
                 y: { type: 'linear', display: true, position: 'left', ticks: {color: '#64748b', maxTicksLimit: 5}, grid: { color: 'rgba(0,0,0,0.05)', borderDash: [5, 5] } },
                 y1: { type: 'linear', display: false, position: 'right' }
               }
             }} />
          </div>
        </div>
        <div className="glass-card" style={{height: '350px'}}>
          <h3 className="mb-4">Revenue Sources</h3>
          <div style={{height: '250px'}}>
             <Doughnut data={typeChart} options={doughnutOpts} />
          </div>
        </div>
      </div>
      
      <div className="glass-card" style={{height: '350px'}}>
        <h3 className="mb-4">Sector Distribution</h3>
        <div style={{height: '250px'}}>
           <Bar data={sectorChart} options={{...globalOpts, maintainAspectRatio: false}} />
        </div>
      </div>
    </div>
  );
}
