import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from './lib/store.jsx';
import { SECTIONS } from './data/retail-ops-sections.js';
import Login from './components/Login.jsx';
import ModulesCatalog from './components/ModulesCatalog.jsx';
import ModuleDashboard from './components/ModuleDashboard.jsx';
import SectionView from './components/SectionView.jsx';
import SectionQuiz from './components/SectionQuiz.jsx';
import FinalExam from './components/FinalExam.jsx';
import CompletionPage from './components/CompletionPage.jsx';
import BrandLogo from './components/BrandLogo.jsx';
import { Sun, Moon, LogoutIcon, Chevron, UsersIcon, Check } from './components/icons.jsx';

function Header() {
  const { user, logout, overallProgress, switchRole } = useStore();
  const [theme, setTheme] = useState(() => localStorage.getItem('ng-theme') || 'light');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ng-theme', theme);
  }, [theme]);

  // Close role dropdown on outside click
  useEffect(() => {
    const handleOutside = () => setShowRoleMenu(false);
    if (showRoleMenu) {
      window.addEventListener('click', handleOutside);
      return () => window.removeEventListener('click', handleOutside);
    }
  }, [showRoleMenu]);

  const path = location.pathname;
  if (!user || path === '/') return null;

  const isModulesCatalog = path === '/modules';
  const isRetailOpsDashboard = path === '/retail-ops' || path === '/dashboard';
  
  let sectionId = null;
  if (path.includes('/section/')) {
    const parts = path.split('/section/');
    sectionId = parts[1]?.split('/')[0];
  }
  const section = sectionId ? SECTIONS.find(s => s.id === sectionId) : null;
  const isQuiz = path.endsWith('/quiz');
  const isFinal = path.includes('/final-exam');
  const isCompletion = path.includes('/completion');

  const isSuperAdmin = user.role === 'super-admin';

  return (
    <header className="header">
      <Link to="/" className="brand" title="NG Learn — Nurturing Green">
        <BrandLogo height={46} showSubtitle={true} subtitle="LEARN" />
      </Link>

      <nav className="crumbs">
        {isModulesCatalog ? (
          <span className="current">
            {isSuperAdmin ? 'NG Learn Modules' : 'My Assigned Module'}
          </span>
        ) : (
          <>
            <Link to="/modules" className="crumb-link">
              {isSuperAdmin ? 'NG Learn' : 'Dashboard'}
            </Link>
            <span className="sep">/</span>
            {isRetailOpsDashboard ? (
              <span className="current">Retail Ops</span>
            ) : (
              <Link to="/retail-ops" className="crumb-link">Retail Ops</Link>
            )}
          </>
        )}

        {section && (
          <>
            <span className="sep">/</span>
            {isQuiz ? (
              <Link to={`/retail-ops/section/${section.id}`} className="crumb-link">{section.title}</Link>
            ) : (
              <span className="current">{section.title}</span>
            )}
          </>
        )}

        {isQuiz && section && (
          <><span className="sep">/</span><span className="current">Quiz</span></>
        )}
        {isFinal && (
          <><span className="sep">/</span><span className="current">Final Exam</span></>
        )}
        {isCompletion && (
          <><span className="sep">/</span><span className="current">Completion</span></>
        )}
      </nav>

      <div className="header-right">
        {/* Role Quick Switcher */}
        <div className="role-switcher-wrap" onClick={e => e.stopPropagation()}>
          <button
            className={`role-badge-btn ${isSuperAdmin ? 'is-admin' : 'is-member'}`}
            onClick={() => setShowRoleMenu(v => !v)}
            title="Click to switch role preview"
          >
            <span className="role-dot" />
            <span className="role-text">{isSuperAdmin ? 'Super Admin' : 'Team Member'}</span>
            <span className="role-dept-label">({isSuperAdmin ? 'All Ops' : 'Retail'})</span>
            <span className="role-chevron"><Chevron size={12} /></span>
          </button>

          {showRoleMenu && (
            <div className="role-dropdown-menu">
              <div className="rd-header">
                <span>Active Perspective</span>
                <small>Switch view mode</small>
              </div>
              
              <button
                className={`rd-item ${isSuperAdmin ? 'active' : ''}`}
                onClick={() => { switchRole('super-admin'); setShowRoleMenu(false); }}
              >
                <div className="rd-item-icon admin-icon">⚡</div>
                <div className="rd-item-info">
                  <span className="rd-item-title">Super Admin</span>
                  <span className="rd-item-desc">Global catalog, all departments &amp; pipeline</span>
                </div>
                {isSuperAdmin && <Check size={14} className="rd-check" />}
              </button>

              <button
                className={`rd-item ${!isSuperAdmin ? 'active' : ''}`}
                onClick={() => { switchRole('team-member'); setShowRoleMenu(false); }}
              >
                <div className="rd-item-icon member-icon">👤</div>
                <div className="rd-item-info">
                  <span className="rd-item-title">Team Member</span>
                  <span className="rd-item-desc">Assigned Track: Retail Operations SOP</span>
                </div>
                {!isSuperAdmin && <Check size={14} className="rd-check" />}
              </button>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="progress-chip" title="Retail Operations Completion">
          <div className="mini-ring">
            <svg width="22" height="22" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="9" fill="none" stroke="var(--track)" strokeWidth="2.5" />
              <circle cx="11" cy="11" r="9" fill="none" stroke="var(--primary)" strokeWidth="2.5"
                strokeDasharray={`${overallProgress * 0.565} 56.5`}
                strokeLinecap="round" transform="rotate(-90 11 11)" />
            </svg>
          </div>
          <span>{overallProgress}%</span>
        </div>

        {/* User profile info */}
        <div className="user-chip" title={`${user.name} (${user.email || 'Nurturing Green'})`}>
          <span className="uname">{user.name}</span>
          <span className="avatar">
            {user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </span>
        </div>

        {/* Theme toggle */}
        <button className="icon-btn" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} aria-label="Toggle theme" title="Toggle theme">
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>

        {/* Logout */}
        <button className="icon-btn" onClick={() => { logout(); navigate('/'); }} aria-label="Sign out" title="Sign out">
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useStore();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/modules" element={<ProtectedRoute><ModulesCatalog /></ProtectedRoute>} />
        
        {/* Retail Ops module routes */}
        <Route path="/retail-ops" element={<ProtectedRoute><ModuleDashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<Navigate to="/retail-ops" replace />} />
        
        <Route path="/retail-ops/section/:sectionId" element={<ProtectedRoute><SectionView /></ProtectedRoute>} />
        <Route path="/section/:sectionId" element={<ProtectedRoute><SectionView /></ProtectedRoute>} />
        
        <Route path="/retail-ops/section/:sectionId/quiz" element={<ProtectedRoute><SectionQuiz /></ProtectedRoute>} />
        <Route path="/section/:sectionId/quiz" element={<ProtectedRoute><SectionQuiz /></ProtectedRoute>} />
        
        <Route path="/retail-ops/final-exam" element={<ProtectedRoute><FinalExam /></ProtectedRoute>} />
        <Route path="/final-exam" element={<ProtectedRoute><FinalExam /></ProtectedRoute>} />
        
        <Route path="/retail-ops/completion" element={<ProtectedRoute><CompletionPage /></ProtectedRoute>} />
        <Route path="/completion" element={<ProtectedRoute><CompletionPage /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
