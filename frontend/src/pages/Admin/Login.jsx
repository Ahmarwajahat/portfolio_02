import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { Lock, Mail, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid email or password. Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundImage: 'radial-gradient(ellipse at center, rgba(79, 70, 229, 0.2) 0%, transparent 70%)' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '420px', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: 0, transition: '0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>
            <ArrowLeft size={16} /> Return to Portfolio
          </button>
          <h1 style={{ fontSize: '2.5rem', textAlign: 'center', margin: 0 }} className="heading-gradient">Admin Portal</h1>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1rem', marginTop: '0.5rem' }}>Secure CMS Authentication</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
              <input 
                type="email" 
                className="input-field" 
                style={{ paddingLeft: '3rem' }} 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="administrator@example.com" 
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Secure Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
              <input 
                type="password" 
                className="input-field" 
                style={{ paddingLeft: '3rem' }} 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
