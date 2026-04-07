import { useState, useRef, useEffect } from 'react';
import { callGemini } from '../utils/gemini';

export default function AIAdvisorTab({ deals }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am the IB Deal Intelligence Advisor. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const suggestions = [
    "Who led the most Fintech deals?",
    "Find me ECM deals > ₹5000 Cr in 2023",
    "Show deals where Ananya Roy was involved"
  ];

  const systemContext = `You are a highly analytical Investment Banking Deal Advisor AI.
You have access to the following firm deal corpus (JSON format). 
When asked a question, compute the answer based strictly on this data.`;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSubmit = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const respText = await callGemini(text, systemContext + JSON.stringify(deals.slice(0, 150).map(d => ({name: d.name, type: d.type, sector: d.sector, year: d.year, val: d.value_cr, team: d.team})), null, 2));
      setMessages(prev => [...prev, { role: 'assistant', content: respText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col" style={{height: 'calc(100vh - 160px)'}}>
      <div className="glass-card flex-col flex-1 pb-0 mb-4" style={{overflow: 'hidden'}}>
        <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{padding: '0 1rem 1rem 0'}}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                style={{
                  maxWidth: '70%', padding: '1.2rem',
                  background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                  color: msg.role === 'user' ? 'var(--accent-primary-text)' : 'var(--text-primary)',
                  borderRadius: 'var(--radius-lg)',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : 'var(--radius-lg)',
                  borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : 'var(--radius-lg)',
                  boxShadow: msg.role === 'assistant' ? 'var(--shadow-sm)' : 'none',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  border: msg.role === 'assistant' ? '1px solid rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <div style={{background: 'var(--bg-elevated)', padding: '1.2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,0,0,0.05)'}}>
                <span className="text-muted">Analyzing deals...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        {suggestions.map((s, i) => (
          <button 
            key={i} 
            className="btn-secondary text-sm" 
            onClick={() => handleSubmit(s)}
            style={{padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.5)'}}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2 relative">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit(input)}
          placeholder="Ask a question about the deals database..."
          className="search-input"
          style={{paddingLeft: '1.5rem', paddingRight: '4rem', padding: '1rem 4rem 1rem 1.5rem'}}
          disabled={loading}
        />
        <button 
          onClick={() => handleSubmit(input)}
          disabled={loading || !input.trim()}
          style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            background: 'var(--accent-primary)', color: 'var(--accent-primary-text)', width: '36px', height: '36px', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: loading || !input.trim() ? 0.5 : 1, transition: '0.2s', fontWeight: 'bold'
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
