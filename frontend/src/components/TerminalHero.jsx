import React, { useState, useEffect } from 'react';

const TerminalHero = () => {
  const [lines, setLines] = useState([]);
  
  useEffect(() => {
    const sequence = [
      { text: "ahmar@kali-linux:~$ ./init_portfolio.sh", delay: 500, type: 'cmd' },
      { text: "[+] Booting systems...", delay: 1000, type: 'log' },
      { text: "[+] Loading cybersecurity modules... [OK]", delay: 1500, type: 'log' },
      { text: "[+] Bypassing firewalls... [DONE]", delay: 2000, type: 'log' },
      { text: "[+] Establishing secure connection to UI...", delay: 2800, type: 'log' },
      { text: "ahmar@kali-linux:~$ access granted. welcome to the mainframe.", delay: 4000, type: 'success' }
    ];

    let timeouts = [];
    sequence.forEach((line) => {
      const t = setTimeout(() => {
        setLines(prev => [...prev, line]);
      }, line.delay);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="glass-card terminal-card" style={{ 
      background: 'rgba(3, 7, 18, 0.9)', 
      border: '1px solid rgba(16, 185, 129, 0.3)', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      width: '100%', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.7), 0 0 20px rgba(16, 185, 129, 0.1)',
      marginTop: '2rem'
    }}>
      <div style={{ 
        background: '#111827', padding: '0.6rem 1rem', 
        display: 'flex', gap: '0.5rem', alignItems: 'center', 
        borderBottom: '1px solid rgba(255,255,255,0.05)' 
      }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
        <span style={{ color: '#6b7280', fontSize: '0.75rem', marginLeft: '1rem', fontFamily: "'Courier New', Courier, monospace" }}>
          bash - root@ahmar
        </span>
      </div>
      
      <div style={{ 
        padding: '1.5rem', fontFamily: "'Courier New', Courier, monospace", 
        minHeight: '220px', display: 'flex', flexDirection: 'column', gap: '0.75rem',
        backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px)',
        backgroundSize: '100% 4px'
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ 
            color: line.type === 'cmd' ? '#f3f4f6' : line.type === 'success' ? '#10b981' : '#0ea5e9',
            fontSize: '0.9rem',
            lineHeight: '1.4',
            animation: 'fadeInUp 0.3s ease-out',
            textShadow: line.type === 'success' ? '0 0 8px rgba(16,185,129,0.4)' : 'none'
          }}>
            {line.text}
          </div>
        ))}
        {lines.length < 6 && (
          <div style={{ width: '8px', height: '15px', background: '#10b981', animation: 'dotTyping 1s infinite' }}></div>
        )}
      </div>
    </div>
  );
};

export default TerminalHero;
