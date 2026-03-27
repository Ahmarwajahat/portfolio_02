import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, Mail, User, Code, Briefcase, ChevronRight, Send, Terminal } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', content: '' });
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, skillsRes] = await Promise.all([
          axios.get(`${API_URL}/projects`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/skills`).catch(() => ({ data: [] }))
        ]);
        setProjects(projRes.data || []);
        setSkills(skillsRes.data || []);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      await axios.post(`${API_URL}/messages`, formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', content: '' });
      setTimeout(() => setFormStatus(''), 4000);
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 4000);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '0' }}>
        <div className="animate-fade-in stagger-1">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(79, 70, 229, 0.15)', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid var(--primary-glow)', marginBottom: '1.5rem' }}>
            <Terminal size={18} color="var(--secondary)" />
            <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.9rem' }}>Full Stack Developer</span>
          </div>
          
          <h1 className="animate-float" style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', lineHeight: '1.05', margin: '0 0 1.5rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            Crafting digital <br/>
            <span className="heading-gradient">masterpieces.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem', lineHeight: '1.7' }}>
            Elevating ideas through beautiful, high-performance web applications with uncompromised attention to detail and premium aesthetics.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href="#projects" className="btn-primary glow-effect">
              View My Work <ChevronRight size={18} />
            </a>
            <a href="#contact" className="btn-outline">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="container">
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', display: 'inline-flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <Briefcase className="heading-gradient" size={40} /> Featured Projects
          </h2>
          <div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', margin: '1rem auto' }}></div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {projects.length > 0 ? projects.map((project) => (
            <div key={project.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ height: '220px', background: 'rgba(0,0,0,0.4)', backgroundImage: `url(${project.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid var(--border-color)' }}></div>
              <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{project.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1, lineHeight: '1.6' }}>{project.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  {project.tech_stack?.map((tech, i) => (
                    <span key={i} style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--secondary)' }}>{tech}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  {project.github_link && (
                    <a href={project.github_link} target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='var(--primary)'} onMouseOut={e => e.target.style.color='var(--text-primary)'}>
                      <Github size={18} /> Code
                    </a>
                  )}
                  {project.live_link && (
                    <a href={project.live_link} target="_blank" rel="noreferrer" style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: 'bold' }}>
                      <ExternalLink size={18} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>
              Projects will dynamically appear here once added in the CMS.
            </div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="container">
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', display: 'inline-flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <Code className="heading-gradient" size={40} /> Technical Arsenal
          </h2>
          <div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', margin: '1rem auto' }}></div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {skills.length > 0 ? skills.map((skill) => (
            <div key={skill.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'var(--secondary)' }}>{skill.icon || '🚀'}</div>
              <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>{skill.name}</span>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${skill.proficiency}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '10px' }}></div>
              </div>
            </div>
          )) : (
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
              Skills will be populated from the database.
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container">
         <div className="glass-card" style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>Let's Connect</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
            Ready to bring your visionary project to life? Let's talk about it!
          </p>
          
          <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                  <input type="text" className="input-field" style={{ paddingLeft: '3rem' }} required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                  <input type="email" className="input-field" style={{ paddingLeft: '3rem' }} required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="hello@example.com" />
                </div>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Subject Line</label>
              <input type="text" className="input-field" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="Project Inquiry" />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your Message</label>
              <textarea className="input-field" required rows="6" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="Tell me about your amazing ideas..." style={{ resize: 'vertical' }}></textarea>
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1rem' }} disabled={formStatus === 'sending'}>
              {formStatus === 'sending' ? 'Transmitting...' : <><Send size={20} /> Launch Message</>}
            </button>
            
            {formStatus === 'success' && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>Message transmitted successfully! I'll respond shortly.</div>}
            {formStatus === 'error' && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Failed to send message. Please check the network.</div>}
          </form>
         </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>© {new Date().getFullYear()} Premium Portfolio. All rights reserved.</p>
        <div style={{ marginTop: '1.5rem' }}>
          <a href="/admin/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.5, transition: '0.3s' }} onMouseOver={e => e.target.style.opacity=1} onMouseOut={e => e.target.style.opacity=0.5}>Admin Access</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
