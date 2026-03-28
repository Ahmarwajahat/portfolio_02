import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, Mail, User, Code, Briefcase, ChevronRight, Send, Terminal, MapPin, Phone, Linkedin, Twitter, Download, Award, BookOpen } from 'lucide-react';
import Chatbot from '../components/Chatbot';
import Navbar from '../components/Navbar';
import TerminalHero from '../components/TerminalHero';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', content: '' });
  const [formStatus, setFormStatus] = useState('');
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [typedRole, setTypedRole] = useState('');

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [projects, skills, profile]);

  useEffect(() => {
    if (!profile) return;
    const fullText = profile.role_title || 'Full Stack Developer';
    let i = 0;
    setTypedRole('');
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedRole(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, [profile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, skillsRes, profileRes, certRes, blogRes] = await Promise.all([
          axios.get(`${API_URL}/projects`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/skills`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/profile`).catch(() => ({ data: null })),
          axios.get(`${API_URL}/certifications`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/blogs`).catch(() => ({ data: [] }))
        ]);
        setProjects(projRes.data || []);
        setSkills(skillsRes.data || []);
        setCertifications(certRes.data || []);
        setBlogs(blogRes.data || []);
        if (profileRes.data) setProfile(profileRes.data);
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
      <Navbar />
      <div 
        style={{
          position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 0,
          width: '800px', height: '800px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, transparent 60%)',
          transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`,
          transition: 'transform 0.15s ease-out'
        }}
      />
      {/* Hero Section */}
      <section id="home" className="hero-section container reveal" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4rem', paddingTop: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center', width: '100%' }}>
          <div className="animate-fade-in stagger-1">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1.5rem' }}>
              <Terminal size={18} color="#10b981" />
              <span style={{ color: '#10b981', fontWeight: '600', fontSize: '0.9rem', borderRight: '2px solid #10b981', paddingRight: '4px' }}>
                {typedRole || '\u00A0'}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {profile?.hero_image_url && (
                <img src={profile.hero_image_url} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10b981' }} className="animate-float" />
              )}
              <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: '1.05', margin: 0, textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                {profile?.full_name ? <>Hi, I'm <br/><span className="heading-gradient">{profile.full_name}.</span></> : <>Crafting digital <br/><span className="heading-gradient">masterpieces.</span></>}
              </h1>
            </div>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem', lineHeight: '1.7' }}>
              Expert Developer specializing in scalable architectures, pristine user interfaces, and robust cybersecurity principles. Welcome to my command center.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a href="#projects" className="btn-primary glow-effect">
                Explore Core <ChevronRight size={18} />
              </a>
              <a href={profile?.resume_url || '#'} target={profile?.resume_url ? "_blank" : "_self"} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: '#10b981', color: '#10b981', textDecoration: 'none' }}>
                <Download size={18} /> {profile?.resume_url ? 'View CV' : 'CV Coming Soon'}
              </a>
            </div>
          </div>
          
          <div className="animate-fade-in stagger-2" style={{ display: 'flex', justifyContent: 'center' }}>
            <TerminalHero />
          </div>
        </div>
      </section>

      {/* About Section */}
      {profile?.about_text && (
        <section id="about" className="container reveal" style={{ paddingBottom: '4rem' }}>
          <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', padding: '4rem' }}>
            {profile.about_image_url && (
              <div style={{ flex: '1', minWidth: '300px' }}>
                <img src={profile.about_image_url} alt="About Me" style={{ width: '100%', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
              </div>
            )}
            <div style={{ flex: '2', minWidth: '300px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}><User className="heading-gradient" size={32} /> About Me</h2>
              <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', marginBottom: '2rem' }}></div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                {profile.about_text}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      <section id="projects" className="container reveal">
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
      <section id="skills" className="container reveal">
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

      {/* Certifications Section */}
      <section id="certifications" className="container reveal">
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', display: 'inline-flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <Award className="heading-gradient" size={40} /> Certifications & Labs
          </h2>
          <div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, #10b981, var(--primary))', margin: '1rem auto' }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {certifications.length > 0 ? certifications.map((cert) => (
            <div key={cert.id} className="glass-card" style={{ padding: '2rem', borderLeft: `4px solid ${cert.color}` }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'white' }}>{cert.title}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{cert.description}</p>
              <span style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', background: `${cert.color}20`, color: cert.color, borderRadius: '100px' }}>{cert.issuer}</span>
            </div>
          )) : (
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
              Certifications & Labs will dynamically appear here once added in the CMS.
            </div>
          )}
        </div>
      </section>

      {/* Blog & Insights Section */}
      <section id="blog" className="container reveal" style={{ paddingBottom: '8rem' }}>
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', display: 'inline-flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <BookOpen className="heading-gradient" size={40} /> Technical Insights
          </h2>
          <div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, var(--secondary), var(--primary))', margin: '1rem auto' }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {blogs.length > 0 ? blogs.map((blog) => (
            <div key={blog.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', backgroundImage: `url(${blog.image_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid var(--border-color)' }}></div>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{ color: blog.category_color, fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{blog.category}</span>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{blog.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1 }}>{blog.description}</p>
                <a href={blog.link || '#'} target={blog.link ? "_blank" : "_self"} rel="noreferrer" className="btn-outline" style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', textDecoration: 'none' }}>Read Article <ChevronRight size={16}/></a>
              </div>
            </div>
          )) : (
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
              Technical insights will dynamically appear here once published in the CMS.
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container reveal">
         <div className="glass-card" style={{ padding: '4rem', margin: '0 auto', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Let's Connect</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
              Ready to bring your visionary project to life? Drop me a message!
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
              {profile?.contact_email && <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}><Mail size={20} color="var(--primary)" /> <span>{profile.contact_email}</span></div>}
              {profile?.contact_phone && <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}><Phone size={20} color="var(--primary)" /> <span>{profile.contact_phone}</span></div>}
              {profile?.contact_location && <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}><MapPin size={20} color="var(--primary)" /> <span>{profile.contact_location}</span></div>}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {profile?.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '0.75rem', borderRadius: '50%' }}><Github size={20} /></a>}
              {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '0.75rem', borderRadius: '50%' }}><Linkedin size={20} /></a>}
              {profile?.twitter_url && <a href={profile.twitter_url} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '0.75rem', borderRadius: '50%' }}><Twitter size={20} /></a>}
            </div>
          </div>
          
          <form onSubmit={handleContactSubmit} style={{ flex: '2', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

      <Chatbot profile={profile} projects={projects} skills={skills} />

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>© {new Date().getFullYear()} Protected by Advanced Developer Architecture. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
