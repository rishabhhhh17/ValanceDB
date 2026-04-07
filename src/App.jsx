import { useState, useMemo } from 'react';
import dealsData from './data/deals.json';
import DealsTab from './components/DealsTab';
import AnalyticsTab from './components/AnalyticsTab';
import TeamTab from './components/TeamTab';
import AutomationTab from './components/AutomationTab';
import AIAdvisorTab from './components/AIAdvisorTab';

function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const deals = dealsData;

  const totalVolume = useMemo(() => deals.reduce((acc, obj) => acc + (obj.value_cr || 0), 0), [deals]);
  const totalRevenue = useMemo(() => deals.reduce((acc, obj) => acc + (obj.revenue_cr || 0), 0), [deals]);

  const navItems = [
    { id: 'Overview', name: 'Dashboard', icon: '◫', component: <AnalyticsTab deals={deals} /> },
    { id: 'Deals', name: 'Sales & Deals', icon: '▮▮', component: <DealsTab deals={deals} /> },
    { id: 'Team', name: 'Team Coverage', icon: '👥', component: <TeamTab deals={deals} /> },
    { id: 'Automation', name: 'Automation', icon: '☰', component: <AutomationTab /> },
    { id: 'AI', name: 'AI Advisor', icon: '◉', component: <AIAdvisorTab deals={deals} /> },
  ];

  const ActiveComponent = navItems.find(i => i.id === activeTab)?.component;
  const ActiveName = navItems.find(i => i.id === activeTab)?.name;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <span>Valance DB</span>
        </div>
        
        <div className="flex-col gap-2">
          {navItems.map(item => (
            <div 
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span style={{ fontSize: '1.2rem', minWidth: '24px' }}>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="topbar">
          <h2 className="page-title">{ActiveName}</h2>
          
          <div className="flex gap-4 items-center">
            {/* Top right pills matching the design */}
            <div className="btn-secondary" style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem', border: 'none', background: 'transparent' }}>
               🔍
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffedd5', overflow: 'hidden' }}>
              {/* Fake avatar using emoji since we have no image */}
              <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem'}}>👨🏽</div>
            </div>
          </div>
        </div>
        
        <div className="content-area animate-fade-in">
          {ActiveComponent}
        </div>
      </div>
    </div>
  );
}

export default App;
