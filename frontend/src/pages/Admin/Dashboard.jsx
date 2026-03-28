import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { LogOut, Home, MessageSquare, Briefcase, Code, Plus, Trash2, Edit, X, User, Settings, Save, Award, BookOpen } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    full_name: '', role_title: '', hero_image_url: '', about_text: '', about_image_url: '', resume_url: '',
    contact_email: '', contact_phone: '', contact_location: '', github_url: '', linkedin_url: '', twitter_url: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [projectForm, setProjectForm] = useState({ title: '', description: '', image_url: '', live_link: '', github_link: '', tech_stack: '' });
  const [skillForm, setSkillForm] = useState({ name: '', icon: '', proficiency: 50 });
  const [certForm, setCertForm] = useState({ title: '', issuer: '', description: '', color: '#10b981' });
  const [blogForm, setBlogForm] = useState({ title: '', category: '', category_color: '#10b981', description: '', image_url: '', link: '' });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const t = await currentUser.getIdToken();
        setToken(t);
        fetchAdminData(t);
      } else {
        navigate('/admin/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchAdminData = async (authToken) => {
    try {
      const authConfig = { headers: { Authorization: `Bearer ${authToken}` } };
      
      const [projRes, skillsRes, msgRes, profileRes, certRes, blogRes] = await Promise.all([
        axios.get(`${API_URL}/projects`),
        axios.get(`${API_URL}/skills`),
        axios.get(`${API_URL}/messages`, authConfig).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/profile`).catch(() => ({ data: null })),
        axios.get(`${API_URL}/certifications`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/blogs`).catch(() => ({ data: [] }))
      ]);
      
      setProjects(projRes.data || []);
      setSkills(skillsRes.data || []);
      setMessages(msgRes.data || []);
      setCertifications(certRes.data || []);
      setBlogs(blogRes.data || []);
      if (profileRes.data) {
        setProfile(profileRes.data);
        setProfileForm({ ...profileForm, ...profileRes.data });
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // --- Profile CRUD ---
  const saveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/profile`, profileForm, config);
      fetchAdminData(token);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to save profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // --- Projects CRUD ---
  const saveProject = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...projectForm, 
        tech_stack: projectForm.tech_stack.split(',').map(s => s.trim()).filter(Boolean) 
      };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        await axios.put(`${API_URL}/projects/${editingId}`, payload, config);
      } else {
        await axios.post(`${API_URL}/projects`, payload, config);
      }
      setIsModalOpen(false);
      fetchAdminData(token);
    } catch (err) { alert('Failed to save project'); }
  };

  const deleteProject = async (id) => {
    if(!window.confirm('Delete this project?')) return;
    try {
      await axios.delete(`${API_URL}/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAdminData(token);
    } catch (err) { alert('Failed to delete project'); }
  };

  const openProjectModal = (p = null) => {
    if (p) {
      setEditingId(p.id);
      setProjectForm({ ...p, tech_stack: p.tech_stack?.join(', ') || '' });
    } else {
      setEditingId(null);
      setProjectForm({ title: '', description: '', image_url: '', live_link: '', github_link: '', tech_stack: '' });
    }
    setIsModalOpen(true);
  };

  // --- Skills CRUD ---
  const saveSkill = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        await axios.put(`${API_URL}/skills/${editingId}`, skillForm, config);
      } else {
        await axios.post(`${API_URL}/skills`, skillForm, config);
      }
      setIsModalOpen(false);
      fetchAdminData(token);
    } catch (err) { alert('Failed to save skill'); }
  };

  const deleteSkill = async (id) => {
    if(!window.confirm('Delete this skill?')) return;
    try {
      await axios.delete(`${API_URL}/skills/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAdminData(token);
    } catch (err) { alert('Failed to delete skill'); }
  };

  const openSkillModal = (s = null) => {
    if (s) {
      setEditingId(s.id);
      setSkillForm({ name: s.name, icon: s.icon, proficiency: s.proficiency });
    } else {
      setEditingId(null);
      setSkillForm({ name: '', icon: '', proficiency: 50 });
    }
    setIsModalOpen(true);
  };

  // --- Certifications CRUD ---
  const saveCertification = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) await axios.put(`${API_URL}/certifications/${editingId}`, certForm, config);
      else await axios.post(`${API_URL}/certifications`, certForm, config);
      setIsModalOpen(false);
      fetchAdminData(token);
    } catch (err) { alert('Failed to save certification'); }
  };
  const deleteCertification = async (id) => {
    if(!window.confirm('Delete this cert?')) return;
    try {
      await axios.delete(`${API_URL}/certifications/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAdminData(token);
    } catch (err) { alert('Failed'); }
  };
  const openCertModal = (c = null) => {
    if (c) { setEditingId(c.id); setCertForm({...c}); }
    else { setEditingId(null); setCertForm({ title: '', issuer: '', description: '', color: '#10b981' }); }
    setIsModalOpen(true);
  };

  // --- Blogs CRUD ---
  const saveBlog = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) await axios.put(`${API_URL}/blogs/${editingId}`, blogForm, config);
      else await axios.post(`${API_URL}/blogs`, blogForm, config);
      setIsModalOpen(false);
      fetchAdminData(token);
    } catch (err) { alert('Failed to save blog'); }
  };
  const deleteBlog = async (id) => {
    if(!window.confirm('Delete this blog?')) return;
    try {
      await axios.delete(`${API_URL}/blogs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAdminData(token);
    } catch (err) { alert('Failed'); }
  };
  const openBlogModal = (b = null) => {
    if (b) { setEditingId(b.id); setBlogForm({...b}); }
    else { setEditingId(null); setBlogForm({ title: '', category: '', category_color: '#10b981', description: '', image_url: '', link: '' }); }
    setIsModalOpen(true);
  };

  // --- Messages Delete ---
  const deleteMessage = async (id) => {
    if(!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`${API_URL}/messages/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAdminData(token);
    } catch (err) { alert('Failed to delete message'); }
  };

  if (!user) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="heading-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Authenticating...</div></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '280px', borderTop: 'none', borderLeft: 'none', borderBottom: 'none', borderRadius: 0, padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
        <div style={{ marginBottom: '4rem', paddingLeft: '0.5rem' }}>
          <h2 className="heading-gradient" style={{ margin: 0, fontSize: '2rem' }}>Portal CMS</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Admin Dashboard</p>
        </div>
        
        <nav style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button onClick={() => setActiveTab('projects')} className="btn-outline" style={{ border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', background: activeTab === 'projects' ? 'rgba(79, 70, 229, 0.15)' : 'transparent', color: activeTab === 'projects' ? 'white' : 'var(--text-secondary)' }}>
            <Briefcase size={20} color={activeTab === 'projects' ? 'var(--secondary)' : 'currentColor'} /> Manage Projects
          </button>
          <button onClick={() => setActiveTab('skills')} className="btn-outline" style={{ border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', background: activeTab === 'skills' ? 'rgba(79, 70, 229, 0.15)' : 'transparent', color: activeTab === 'skills' ? 'white' : 'var(--text-secondary)' }}>
            <Code size={20} color={activeTab === 'skills' ? 'var(--secondary)' : 'currentColor'} /> Manage Skills
          </button>
          <button onClick={() => setActiveTab('certifications')} className="btn-outline" style={{ border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', background: activeTab === 'certifications' ? 'rgba(79, 70, 229, 0.15)' : 'transparent', color: activeTab === 'certifications' ? 'white' : 'var(--text-secondary)' }}>
            <Award size={20} color={activeTab === 'certifications' ? 'var(--secondary)' : 'currentColor'} /> Certifications
          </button>
          <button onClick={() => setActiveTab('blogs')} className="btn-outline" style={{ border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', background: activeTab === 'blogs' ? 'rgba(79, 70, 229, 0.15)' : 'transparent', color: activeTab === 'blogs' ? 'white' : 'var(--text-secondary)' }}>
            <BookOpen size={20} color={activeTab === 'blogs' ? 'var(--secondary)' : 'currentColor'} /> Tech Blogs
          </button>
          <button onClick={() => setActiveTab('messages')} className="btn-outline" style={{ border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', background: activeTab === 'messages' ? 'rgba(79, 70, 229, 0.15)' : 'transparent', color: activeTab === 'messages' ? 'white' : 'var(--text-secondary)' }}>
            <MessageSquare size={20} color={activeTab === 'messages' ? 'var(--secondary)' : 'currentColor'} /> Inbox Messages
          </button>
          <button onClick={() => setActiveTab('profile')} className="btn-outline" style={{ border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', background: activeTab === 'profile' ? 'rgba(79, 70, 229, 0.15)' : 'transparent', color: activeTab === 'profile' ? 'white' : 'var(--text-secondary)' }}>
            <Settings size={20} color={activeTab === 'profile' ? 'var(--secondary)' : 'currentColor'} /> Profile Settings
          </button>
        </nav>
        
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button onClick={() => navigate('/')} className="btn-outline" style={{ border: 'none', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-start', color: 'var(--text-secondary)' }}>
            <Home size={20} /> Preview Site
          </button>
          <button onClick={handleLogout} className="btn-outline" style={{ border: 'none', color: '#f87171', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-start' }}>
            <LogOut size={20} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: '4rem', overflowY: 'auto', height: '100vh', position: 'relative' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
          <div>
            <h1 style={{ margin: 0, textTransform: 'capitalize', fontSize: '2.5rem' }}>{activeTab} Management</h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Control and overview of your {activeTab}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Admin</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</span>
              </div>
            </div>
            {activeTab !== 'messages' && activeTab !== 'profile' && (
              <button className="btn-primary" style={{ padding: '0.75rem 1.5rem' }} onClick={() => {
                if(activeTab === 'projects') openProjectModal();
                else if(activeTab === 'skills') openSkillModal();
                else if(activeTab === 'certifications') openCertModal();
                else if(activeTab === 'blogs') openBlogModal();
              }}>
                <Plus size={18} /> Create New
              </button>
            )}
          </div>
        </header>

        {/* Stats Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="glass-card animate-fade-in stagger-1" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.15)', padding: '1rem', borderRadius: '12px' }}><Briefcase size={24} color="var(--primary)" /></div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Total Projects</p>
              <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{projects.length}</h3>
            </div>
          </div>
          <div className="glass-card animate-fade-in stagger-2" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '1rem', borderRadius: '12px' }}><Code size={24} color="var(--secondary)" /></div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Total Skills</p>
              <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{skills.length}</h3>
            </div>
          </div>
          <div className="glass-card animate-fade-in stagger-3" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '1rem', borderRadius: '12px' }}><MessageSquare size={24} color="#10b981" /></div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Inbox Messages</p>
              <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{messages.length}</h3>
            </div>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="glass-card animate-fade-in" style={{ padding: '2.5rem' }}>
            <form onSubmit={saveProfile}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>Personal Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div><label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label><input type="text" className="input-field" required value={profileForm.full_name || ''} onChange={e => setProfileForm({...profileForm, full_name: e.target.value})} /></div>
                <div><label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Role/Title (Hero)</label><input type="text" className="input-field" required value={profileForm.role_title || ''} onChange={e => setProfileForm({...profileForm, role_title: e.target.value})} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Hero Image URL (Frontend Start Picture)</label><input type="url" className="input-field" value={profileForm.hero_image_url || ''} onChange={e => setProfileForm({...profileForm, hero_image_url: e.target.value})} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>CV / Resume PDF URL (Optional Download Button)</label><input type="url" className="input-field" value={profileForm.resume_url || ''} onChange={e => setProfileForm({...profileForm, resume_url: e.target.value})} placeholder="https://..." /></div>
              </div>

              <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>About Section</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div><label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>About Image URL</label><input type="url" className="input-field" value={profileForm.about_image_url || ''} onChange={e => setProfileForm({...profileForm, about_image_url: e.target.value})} /></div>
                <div><label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>About Text</label><textarea className="input-field" rows="4" required value={profileForm.about_text || ''} onChange={e => setProfileForm({...profileForm, about_text: e.target.value})}></textarea></div>
              </div>

              <h3 style={{ marginBottom: '1.5rem', color: 'var(--secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>Contact & Social</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div><label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Public Email</label><input type="email" className="input-field" value={profileForm.contact_email || ''} onChange={e => setProfileForm({...profileForm, contact_email: e.target.value})} /></div>
                <div><label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Phone Number</label><input type="text" className="input-field" value={profileForm.contact_phone || ''} onChange={e => setProfileForm({...profileForm, contact_phone: e.target.value})} /></div>
                <div><label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Location</label><input type="text" className="input-field" value={profileForm.contact_location || ''} onChange={e => setProfileForm({...profileForm, contact_location: e.target.value})} /></div>
                <div><label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>GitHub URL</label><input type="url" className="input-field" value={profileForm.github_url || ''} onChange={e => setProfileForm({...profileForm, github_url: e.target.value})} /></div>
                <div><label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>LinkedIn URL</label><input type="url" className="input-field" value={profileForm.linkedin_url || ''} onChange={e => setProfileForm({...profileForm, linkedin_url: e.target.value})} /></div>
                <div><label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Twitter URL</label><input type="url" className="input-field" value={profileForm.twitter_url || ''} onChange={e => setProfileForm({...profileForm, twitter_url: e.target.value})} /></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" disabled={isSavingProfile} style={{ padding: '0.75rem 2rem' }}>
                  <Save size={18} /> {isSavingProfile ? 'Saving...' : 'Save Profile Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="glass-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
            {projects.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Briefcase size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No projects found. Click "Create New" to add one.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <tr>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Project Title</th>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>External Links</th>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '1.5rem', fontWeight: '600' }}>{p.title}</td>
                      <td style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          {p.github_link && <a href={p.github_link} target="_blank" rel="noreferrer" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>GitHub Repo</a>}
                          {p.live_link && <a href={p.live_link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Live URL</a>}
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                         <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                           <button className="btn-outline" onClick={() => openProjectModal(p)} style={{ padding: '0.5rem', borderRadius: '8px' }} title="Edit"><Edit size={16} /></button>
                           <button className="btn-outline" onClick={() => deleteProject(p.id)} style={{ padding: '0.5rem', borderRadius: '8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} title="Delete"><Trash2 size={16} /></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="glass-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
            {skills.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Code size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No skills found. Click "Create New" to add one.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <tr>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Skill Name</th>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Proficiency</th>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '1.5rem', fontWeight: 'bold' }}>
                        <span style={{ marginRight: '1rem', fontSize: '1.2rem' }}>{s.icon}</span> {s.name}
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <div style={{ width: '100%', maxWidth: '200px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ width: `${s.proficiency}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}></div>
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                         <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                           <button className="btn-outline" onClick={() => openSkillModal(s)} style={{ padding: '0.5rem', borderRadius: '8px' }} title="Edit"><Edit size={16} /></button>
                           <button className="btn-outline" onClick={() => deleteSkill(s.id)} style={{ padding: '0.5rem', borderRadius: '8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} title="Delete"><Trash2 size={16} /></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
            {messages.length === 0 ? (
              <div className="glass-card" style={{ padding: '4rem', gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>Inbox is completely empty. New user submissions will appear here.</p>
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                     <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{m.subject}</h3>
                     <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '100px' }}>{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                  <div style={{ color: 'var(--secondary)', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontWeight: 'bold' }}>{m.name}</span>
                    <a href={`mailto:${m.email}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{m.email}</a>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', flexGrow: 1, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {m.content}
                  </div>
                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => deleteMessage(m.id)} className="btn-outline" style={{ padding: '0.5rem 1rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', fontSize: '0.9rem' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <div className="glass-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
            {certifications.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Award size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No certifications found. Click "Create New" to add one.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <tr>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Certification Title</th>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Issuer</th>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certifications.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '1.5rem', fontWeight: 'bold' }}>{c.title}</td>
                      <td style={{ padding: '1.5rem' }}>{c.issuer}</td>
                      <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                         <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                           <button className="btn-outline" onClick={() => openCertModal(c)} style={{ padding: '0.5rem', borderRadius: '8px' }} title="Edit"><Edit size={16} /></button>
                           <button className="btn-outline" onClick={() => deleteCertification(c.id)} style={{ padding: '0.5rem', borderRadius: '8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} title="Delete"><Trash2 size={16} /></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="glass-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
            {blogs.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <BookOpen size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No tech blogs found. Click "Create New" to add one.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <tr>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Blog Title</th>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Category</th>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '1.5rem', fontWeight: 'bold' }}>{b.title}</td>
                      <td style={{ padding: '1.5rem' }}><span style={{ color: b.category_color, background: `${b.category_color}20`, padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.8rem' }}>{b.category}</span></td>
                      <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                         <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                           <button className="btn-outline" onClick={() => openBlogModal(b)} style={{ padding: '0.5rem', borderRadius: '8px' }} title="Edit"><Edit size={16} /></button>
                           <button className="btn-outline" onClick={() => deleteBlog(b.id)} style={{ padding: '0.5rem', borderRadius: '8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} title="Delete"><Trash2 size={16} /></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Modal Backdrop and Content */}
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }} className="heading-gradient">
                  {editingId ? 'Edit' : 'Create'} {activeTab === 'projects' ? 'Project' : activeTab === 'skills' ? 'Skill' : activeTab === 'certifications' ? 'Certification' : 'Blog'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              
              {activeTab === 'projects' && (
                <form onSubmit={saveProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div><label>Project Title</label><input type="text" className="input-field" required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} placeholder="E-commerce App" /></div>
                  <div><label>Description</label><textarea className="input-field" required rows="3" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} placeholder="A highly scalable platform..."></textarea></div>
                  <div><label>Image URL</label><input type="url" className="input-field" value={projectForm.image_url} onChange={e => setProjectForm({...projectForm, image_url: e.target.value})} placeholder="https://..." /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div><label>Live Link</label><input type="url" className="input-field" value={projectForm.live_link} onChange={e => setProjectForm({...projectForm, live_link: e.target.value})} placeholder="https://..." /></div>
                    <div><label>GitHub Link</label><input type="url" className="input-field" value={projectForm.github_link} onChange={e => setProjectForm({...projectForm, github_link: e.target.value})} placeholder="https://..." /></div>
                  </div>
                  <div><label>Tech Stack (comma separated)</label><input type="text" className="input-field" value={projectForm.tech_stack} onChange={e => setProjectForm({...projectForm, tech_stack: e.target.value})} placeholder="React, Node, MongoDB" /></div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>Save Project</button>
                </form>
              )}
              {activeTab === 'skills' && (
                <form onSubmit={saveSkill} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div><label>Skill Name</label><input type="text" className="input-field" required value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} placeholder="JavaScript" /></div>
                  <div><label>Emoji Icon</label><input type="text" className="input-field" value={skillForm.icon} onChange={e => setSkillForm({...skillForm, icon: e.target.value})} placeholder="⚛️" /></div>
                  <div>
                    <label>Proficiency ({skillForm.proficiency}%)</label>
                    <input type="range" min="0" max="100" style={{ width: '100%', marginTop: '0.5rem', accentColor: 'var(--primary)' }} value={skillForm.proficiency} onChange={e => setSkillForm({...skillForm, proficiency: parseInt(e.target.value)})} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>Save Skill</button>
                </form>
              )}
              {activeTab === 'certifications' && (
                <form onSubmit={saveCertification} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div><label>Certification Title</label><input type="text" className="input-field" required value={certForm.title} onChange={e => setCertForm({...certForm, title: e.target.value})} placeholder="AWS Certified Architect" /></div>
                  <div><label>Issuer / Vendor</label><input type="text" className="input-field" required value={certForm.issuer} onChange={e => setCertForm({...certForm, issuer: e.target.value})} placeholder="Amazon Web Services" /></div>
                  <div><label>Description Details</label><textarea className="input-field" required rows="3" value={certForm.description} onChange={e => setCertForm({...certForm, description: e.target.value})} placeholder="Demonstrated ability to deploy..."></textarea></div>
                  <div><label>Border Hex Color (Theme)</label><input type="text" className="input-field" required value={certForm.color} onChange={e => setCertForm({...certForm, color: e.target.value})} placeholder="#ff9900" /></div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>Save Certification</button>
                </form>
              )}
              {activeTab === 'blogs' && (
                <form onSubmit={saveBlog} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div><label>Article Title</label><input type="text" className="input-field" required value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} placeholder="How to bypass a firewall in 2026" /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div><label>Category Label</label><input type="text" className="input-field" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})} placeholder="AI Security" /></div>
                    <div><label>Category Hex Color</label><input type="text" className="input-field" required value={blogForm.category_color} onChange={e => setBlogForm({...blogForm, category_color: e.target.value})} placeholder="#10b981" /></div>
                  </div>
                  <div><label>Short Description</label><textarea className="input-field" required rows="3" value={blogForm.description} onChange={e => setBlogForm({...blogForm, description: e.target.value})} placeholder="A highly technical analysis of..."></textarea></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                     <div><label>Cover Image URL</label><input type="url" className="input-field" value={blogForm.image_url} onChange={e => setBlogForm({...blogForm, image_url: e.target.value})} placeholder="https://..." /></div>
                     <div><label>Blog Link URL</label><input type="url" className="input-field" required value={blogForm.link} onChange={e => setBlogForm({...blogForm, link: e.target.value})} placeholder="https://..." /></div>
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>Save Tech Blog</button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
