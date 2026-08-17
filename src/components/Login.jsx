import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import BrandLogo from './BrandLogo.jsx';
import { Sun, Moon, Check } from './icons.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [selectedRole, setSelectedRole] = useState('super-admin');
  const { login, user } = useStore();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');

  if (user) { return <Navigate to="/modules" replace />; }

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem('ng-theme', next);
  };

  const submit = (e) => {
    e.preventDefault();
    if (selectedRole === 'super-admin') {
      const name = email ? (email.split('@')[0] || 'Super Admin').replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Super Admin';
      login(name, email || 'admin@nurturinggreen.in', 'super-admin', 'All Operations');
    } else {
      const name = email ? (email.split('@')[0] || 'Team Member').replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Team Member';
      login(name, email || 'member@nurturinggreen.in', 'team-member', 'Retail Operations');
    }
    navigate('/modules');
  };

  return (
    <div className="login-wrap">
      <aside className="login-aside">
        <div className="glow" />
        <div className="glow two" />
        
        <div className="aside-brand">
          <BrandLogo height={72} variant="white" showSubtitle={true} subtitle="LEARN" />
        </div>

        <div className="aside-main-content">
          <span className="aside-tagline">Gift a Plant · Build the Future</span>
          
          <div className="aside-illustration-wrap">
            <img src="/premium-plants-bg.png" alt="Nurturing Green Premium Plants" className="aside-illust" />
          </div>

          <h1>NG Learn</h1>
          <p>
            The centralized training &amp; certification portal for Nurturing Green. Master standard operating procedures across Retail Outlets, Warehousing, Supply Chain, and Product Development.
          </p>
          
          <div className="stats" style={{ margin: '24px 0 32px' }}>
            <div><b>10M+</b><span>Plants Gifted</span></div>
            <div><b>30+</b><span>Retail Stores</span></div>
            <div><b>5</b><span>SOP Domains</span></div>
          </div>

          <div className="centralized-domains">
            <span className="domain-chip">🏪 Retail Operations</span>
            <span className="domain-chip">📦 Supply Chain</span>
            <span className="domain-chip">📢 Brand &amp; VM</span>
            <span className="domain-chip">🪴 NPD &amp; Design</span>
          </div>
        </div>

        <div className="aside-footer">
          Nurturing Green &middot; NG Learn Training Architecture
        </div>
      </aside>

      <div className="login-panel">
        <div className="login-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <BrandLogo height={48} variant="auto" showSubtitle={true} subtitle="LEARN" />
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
          </div>

          <h2>Sign in</h2>
          <p>Access your training portal and operational workflows.</p>

          <form onSubmit={submit}>
            <div className="field">
              <label>Select Profile Role</label>
              <div className="login-role-selector">
                <button
                  type="button"
                  className={`login-role-pill ${selectedRole === 'super-admin' ? 'active' : ''}`}
                  onClick={() => setSelectedRole('super-admin')}
                >
                  <span className="lr-icon">⚡</span>
                  <div>
                    <strong>Super Admin</strong>
                    <small>All Departments</small>
                  </div>
                  {selectedRole === 'super-admin' && <Check size={14} />}
                </button>

                <button
                  type="button"
                  className={`login-role-pill ${selectedRole === 'team-member' ? 'active' : ''}`}
                  onClick={() => setSelectedRole('team-member')}
                >
                  <span className="lr-icon">👤</span>
                  <div>
                    <strong>Team Member</strong>
                    <small>Assigned: Retail Ops</small>
                  </div>
                  {selectedRole === 'team-member' && <Check size={14} />}
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="email">Work email (optional for demo)</label>
              <input
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={selectedRole === 'super-admin' ? 'admin@nurturinggreen.in' : 'member@nurturinggreen.in'}
                autoComplete="off"
              />
            </div>
            
            <div className="field">
              <label htmlFor="pw">Password</label>
              <input
                id="pw"
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="••••••••"
                autoComplete="off"
              />
            </div>

            <button className="btn block" type="submit" style={{ marginTop: 12 }}>
              Enter as {selectedRole === 'super-admin' ? 'Super Admin' : 'Team Member'} →
            </button>
          </form>

          <div className="mock-hint">
            Direct access enabled — click Enter to explore with pre-configured permissions.
          </div>
        </div>
      </div>
    </div>
  );
}
