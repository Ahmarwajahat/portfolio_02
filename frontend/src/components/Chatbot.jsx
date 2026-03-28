import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const Chatbot = ({ profile, projects, skills }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: `Hi there! I am ${profile?.full_name ? profile.full_name.split(' ')[0] : 'Ahmar'}'s AI Assistant. You can ask me about his projects, skills, or how to contact him!` }
  ]);
  const [inputValue, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestionChips = ["What are your skills?", "Show projects", "How to contact?"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      generateResponse(userMessage.toLowerCase());
      setIsTyping(false);
    }, 1200);
  };

  const handleChipClick = (chipText) => {
    setMessages(prev => [...prev, { sender: 'user', text: chipText }]);
    setIsTyping(true);
    setTimeout(() => {
      generateResponse(chipText.toLowerCase());
      setIsTyping(false);
    }, 1200);
  };

  const generateResponse = (message) => {
    let response = "I'm not exactly sure, but you can always drop a message in the Contact section to find out!";

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      response = `Hello! How can I help you today? I know all about ${profile?.full_name || 'Ahmar'}'s work!`;
    } 
    else if (message.includes('project') || message.includes('work') || message.includes('portfolio')) {
      if (projects && projects.length > 0) {
        response = `Ahmar has some incredible projects like "${projects[0].title}" and "${projects[1] ? projects[1].title : 'more'}". You can check them out in the Projects section above!`;
      } else {
        response = "He has done some great work, which you'll find in the Projects section above once it's populated.";
      }
    } 
    else if (message.includes('skill') || message.includes('technologies') || message.includes('stack') || message.includes('tech')) {
      if (skills && skills.length > 0) {
        const topSkills = skills.slice(0, 3).map(s => s.name).join(', ');
        response = `His top skills include ${topSkills}, and many more! He's a highly capable ${profile?.role_title || 'Full Stack Developer'}.`;
      } else {
        response = `He is an expert ${profile?.role_title || 'Full Stack Developer'} with strong coding skills. Check out the Technical Arsenal section!`;
      }
    }
    else if (message.includes('contact') || message.includes('email') || message.includes('hire') || message.includes('reach')) {
      response = `You can easily reach out directly at ${profile?.contact_email || 'the contact form below'}! He's always open to discussing new opportunities.`;
    }
    else if (message.includes('who') || message.includes('about')) {
      response = `I am his Personal AI Assistant! And as for ${profile?.full_name || 'Ahmar'}... ${profile?.about_text ? profile.about_text.substring(0, 100) + '...' : 'he is a brilliant developer.'}`;
    }
    else if (message.includes('ai') || message.includes('artificial intelligence')) {
      response = "AI is fascinating, isn't it? Just like me! I'm a custom-built AI tailored specifically for this portfolio to make your experience 'maze ka' (fun and interesting)! 😉";
    }

    setMessages(prev => [...prev, { sender: 'bot', text: response }]);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="animate-float glow-effect"
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50,
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          border: 'none', borderRadius: '50%', width: '60px', height: '60px',
          display: isOpen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', color: 'white'
        }}
      >
        <MessageSquare size={28} />
      </button>

      {isOpen && (
        <div 
          className="glass-card animate-fade-in"
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100,
            width: '90%', maxWidth: '380px', height: '500px',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'white' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem', borderRadius: '50%' }}>
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>AI Assistant</h3>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }}><X size={20} /></button>
          </div>

          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.4)' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.sender === 'bot' && <div style={{ background: 'var(--primary)', padding: '0.4rem', borderRadius: '50%', color: 'white' }}><Bot size={14} /></div>}
                
                <div style={{
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'rgba(255,255,255,0.1)',
                  padding: '0.75rem 1rem',
                  borderRadius: msg.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                  color: 'white', fontSize: '0.9rem', maxWidth: '250px', lineHeight: '1.5'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div style={{ background: 'var(--primary)', padding: '0.4rem', borderRadius: '50%', color: 'white' }}><Bot size={14} /></div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: '18px 18px 18px 0', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', animation: 'dotTyping 1.5s infinite' }}></div>
                  <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', animation: 'dotTyping 1.5s infinite 0.2s' }}></div>
                  <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', animation: 'dotTyping 1.5s infinite 0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-color)', display: 'flex', gap: '0.5rem', overflowX: 'auto', whiteSpace: 'nowrap', borderTop: '1px solid var(--border-color)' }}>
            {suggestionChips.map((chip, idx) => (
              <button 
                key={idx} 
                onClick={() => handleChipClick(chip)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--secondary)', padding: '0.5rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = 'white' }}
                onMouseOut={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = 'var(--secondary)' }}
              >
                {chip}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', padding: '1rem', background: 'var(--bg-color)' }}>
            <input 
              type="text" 
              placeholder="Ask anything..." 
              value={inputValue}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: '100px', color: 'white', outline: 'none' }}
            />
            <button type="submit" disabled={!inputValue.trim()} style={{ background: 'none', border: 'none', marginLeft: '0.5rem', color: inputValue.trim() ? 'var(--secondary)' : 'var(--text-secondary)', cursor: inputValue.trim() ? 'pointer' : 'default' }}>
              <Send size={24} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
