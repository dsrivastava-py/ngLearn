import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { SECTIONS, MODULE_TITLE, MODULE_SUBTITLE } from '../data/retail-ops-sections.js';
import { resources } from '../data/retail-ops-resources.js';
import ResourceModal from './ResourceModal.jsx';
import {
  Leaf,
  ClockIcon,
  Check,
  BookIcon,
  PackageIcon,
  LayoutIcon,
  UsersIcon,
  FileIcon,
  DownloadIcon,
} from './icons.jsx';

export default function ModulesCatalog() {
  const navigate = useNavigate();
  const {
    user,
    sections: sectionStates,
    isSectionComplete,
    completedSectionCount,
    overallProgress,
    moduleCompleted,
    switchRole,
  } = useStore();

  const [selectedDept, setSelectedDept] = useState('all');
  const [showArchivedDetails, setShowArchivedDetails] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const isSuperAdmin = user?.role === 'super-admin';
  const totalMinutes = SECTIONS.reduce((sum, s) => sum + s.estimatedMinutes, 0);

  // Find next incomplete section for quick resume
  const nextIncompleteSection = SECTIONS.find(s => !isSectionComplete(s.id)) || SECTIONS[0];

  const handleQuickResume = () => {
    if (moduleCompleted) {
      navigate('/retail-ops/completion');
    } else if (completedSectionCount === SECTIONS.length) {
      navigate('/retail-ops/final-exam');
    } else if (nextIncompleteSection) {
      navigate(`/retail-ops/section/${nextIncompleteSection.id}`);
    } else {
      navigate('/retail-ops');
    }
  };

  const upcomingModules = [
    {
      id: 'quick-commerce',
      title: 'Quick Commerce Operations',
      dept: 'q-comm',
      category: 'Marketplaces',
      subtitle: 'Blinkit, Zepto, Instamart & BigBasket end-to-end O2C, DOC checks & fill-rate tracking',
      sectionsCount: 8,
      status: 'Pipeline',
      estHours: '3.5 hrs',
      icon: '⚡',
    },
    {
      id: 'warehouse-inward',
      title: 'Inward Logistics & Warehousing',
      dept: 'supply-chain',
      category: 'Supply Chain',
      subtitle: 'Raw material procurement, production movement, RTV discrepancy handling & gate pass SOPs',
      sectionsCount: 6,
      status: 'Pipeline',
      estHours: '2.8 hrs',
      icon: '📦',
    },
    {
      id: 'npd-process',
      title: 'New Product Development (NPD)',
      dept: 'npd',
      category: 'Product & Design',
      subtitle: 'From ideation, vendor allocation, spec sheets, visual merchandising to retail store rollout',
      sectionsCount: 5,
      status: 'Pipeline',
      estHours: '2.0 hrs',
      icon: '🪴',
    },
    {
      id: 'e-commerce-marketplace',
      title: 'E-Commerce & Amazon Last-Mile',
      dept: 'ecom',
      category: 'E-Commerce',
      subtitle: 'Amazon DF stock upload, listing suppression RCA, deal planning & master catalogue pricing',
      sectionsCount: 7,
      status: 'Pipeline',
      estHours: '3.0 hrs',
      icon: '🛒',
    },
  ];

  const filteredUpcoming = selectedDept === 'all'
    ? upcomingModules
    : upcomingModules.filter(m => m.dept === selectedDept || (selectedDept === 'retail' && false));

  // ==========================================
  // VIEW A: TEAM MEMBER DASHBOARD (RETAIL OPS)
  // ==========================================
  if (!isSuperAdmin) {
    return (
      <main className="main dashboard-main-content">
        {selectedResource && (
          <ResourceModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
        )}

        {/* Minimal Hero Header */}
        <section className="member-hero-banner">
          <div className="mhb-left">
            <div className="mhb-role-pill">
              <span className="live-pulse" />
              <span>Assigned Track &middot; Retail Operations</span>
            </div>
            <h1 className="mhb-title">Welcome back, {user?.name || 'Team Member'}</h1>
            <p className="mhb-subtitle">
              Complete your mandatory SOP training and knowledge certifications for offline retail store operations.
            </p>
          </div>

          <div className="mhb-stats-cluster">
            <div className="mhb-stat-card">
              <span className="stat-label">Progress</span>
              <div className="stat-val-row">
                <span className="stat-number">{overallProgress}%</span>
                <span className="stat-sub">{completedSectionCount}/7 Done</span>
              </div>
              <div className="mini-progress-bar">
                <div className="mini-progress-fill" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>

            <div className="mhb-stat-card">
              <span className="stat-label">Estimated Time</span>
              <div className="stat-val-row">
                <span className="stat-number">{totalMinutes}m</span>
                <span className="stat-sub">SOP Runtime</span>
              </div>
              <span className="stat-tag-pill">Self-Paced</span>
            </div>
          </div>
        </section>

        {/* Featured Assigned Module Hub */}
        <section className="member-track-container">
          <div className="section-eyebrow">
            <h2>Active Training Module</h2>
            <span className="live-track-badge">● In Progress</span>
          </div>

          <div className="luxury-module-card">
            <div className="lmc-glow-bg" />
            <div className="lmc-top-bar">
              <div className="lmc-badges">
                <span className="lmc-dept-tag">🏪 Retail Operations SOP</span>
                <span className="lmc-time-tag"><ClockIcon size={13} /> {totalMinutes} min runtime</span>
                {moduleCompleted ? (
                  <span className="lmc-status-tag completed"><Check size={12} /> Certified Master</span>
                ) : (
                  <span className="lmc-status-tag active">● Live Course</span>
                )}
              </div>

              <div className="lmc-switch-hint">
                <button
                  className="link-btn-subtle"
                  onClick={() => switchRole('super-admin')}
                  title="Switch to Super Admin view"
                >
                  View as Super Admin →
                </button>
              </div>
            </div>

            <div className="lmc-hero-content">
              <div className="lmc-title-group">
                <h3>{MODULE_TITLE}</h3>
                <p className="lmc-lead">{MODULE_SUBTITLE}</p>
                <p className="lmc-description">
                  Master the four foundational pillars of offline retail operations: <strong>Stock</strong> (replenishment &amp; MDQ), <strong>Staff</strong> (hiring, training tracks &amp; rating), <strong>Display</strong> (planogram QC &amp; RTV), and <strong>Communication</strong> (brand, category, product &amp; offer signage).
                </p>
              </div>

              <div className="lmc-radial-card">
                <div className="radial-wrapper">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--track)" strokeWidth="7" />
                    <circle
                      cx="50" cy="50" r="42" fill="none" stroke="var(--primary)" strokeWidth="7"
                      strokeDasharray={`${overallProgress * 2.64} 264`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                  </svg>
                  <div className="radial-text">
                    <span className="radial-pct">{overallProgress}%</span>
                    <span className="radial-sub">Completed</span>
                  </div>
                </div>

                <button className="btn primary lmc-cta-btn" onClick={handleQuickResume}>
                  {moduleCompleted ? (
                    'View Certificate →'
                  ) : completedSectionCount > 0 ? (
                    `Continue: Sec ${nextIncompleteSection.order} →`
                  ) : (
                    'Start First Section →'
                  )}
                </button>
              </div>
            </div>

            {/* 4 Core Pillars Overview */}
            <div className="lmc-pillars-strip">
              <div className="pillar-tile">
                <div className="pillar-tile-icon"><PackageIcon size={16} /></div>
                <div className="pillar-tile-content">
                  <strong>Stock Flow</strong>
                  <small>Replenishment, Indents &amp; MDQ</small>
                </div>
              </div>

              <div className="pillar-tile">
                <div className="pillar-tile-icon"><UsersIcon size={16} /></div>
                <div className="pillar-tile-content">
                  <strong>Staff Tracks</strong>
                  <small>Hiring, Training &amp; Rating</small>
                </div>
              </div>

              <div className="pillar-tile">
                <div className="pillar-tile-icon"><LayoutIcon size={16} /></div>
                <div className="pillar-tile-content">
                  <strong>Display &amp; VM</strong>
                  <small>Planograms, Hygiene &amp; RTV</small>
                </div>
              </div>

              <div className="pillar-tile">
                <div className="pillar-tile-icon"><BookIcon size={16} /></div>
                <div className="pillar-tile-content">
                  <strong>Communication</strong>
                  <small>Brand, Category &amp; Offers</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Curriculum & Fast Jump */}
        <section className="curriculum-preview-section">
          <div className="section-eyebrow">
            <h2>Course Modules ({SECTIONS.length} Sections)</h2>
            <button className="btn ghost sm" onClick={() => navigate('/retail-ops')}>
              Detailed Syllabus View →
            </button>
          </div>

          <div className="curriculum-grid">
            {SECTIONS.map((sec) => {
              const done = isSectionComplete(sec.id);
              const inProg = sectionStates[sec.id]?.lectureCompleted && !sectionStates[sec.id]?.quizPassed;
              return (
                <div
                  key={sec.id}
                  className={`curriculum-card ${done ? 'is-done' : inProg ? 'is-in-progress' : ''}`}
                  onClick={() => navigate(`/retail-ops/section/${sec.id}`)}
                >
                  <div className="cc-num-row">
                    <span className="cc-order">Section {sec.order}</span>
                    {done ? (
                      <span className="cc-badge done"><Check size={12} /> Passed</span>
                    ) : inProg ? (
                      <span className="cc-badge prog">In Progress</span>
                    ) : (
                      <span className="cc-badge todo"><ClockIcon size={11} /> {sec.estimatedMinutes}m</span>
                    )}
                  </div>
                  <h4 className="cc-title">{sec.title}</h4>
                  <p className="cc-subtitle">{sec.subtitle}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Rich SOP & Downloadable Tools Section */}
        <section className="quick-resources-section">
          <div className="section-eyebrow">
            <h2>Standard Operating Procedures &amp; Tools</h2>
            <span className="pill done">{resources.length} Downloadable PDFs</span>
          </div>

          <div className="resources-enhanced-grid">
            {resources.map((r) => (
              <div key={r.id} className="resource-pro-card">
                <div className="rpc-top">
                  <div className="rpc-icon"><FileIcon size={20} /></div>
                  <div className="rpc-tags">
                    <span className="rpc-category-tag">{r.tag}</span>
                    <span className="rpc-size-tag">{r.size}</span>
                  </div>
                </div>

                <h4 className="rpc-title">{r.name}</h4>
                <p className="rpc-subtitle">{r.subtitle}</p>

                <div className="rpc-footer">
                  <button
                    className="btn ghost sm rpc-preview-btn"
                    onClick={() => setSelectedResource(r)}
                  >
                    👁 Preview SOP
                  </button>
                  <a
                    href={r.path}
                    download
                    className="btn primary sm rpc-download-btn"
                    title={`Download ${r.name}`}
                  >
                    <DownloadIcon size={13} /> Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  // ==========================================
  // VIEW B: SUPER ADMIN DASHBOARD
  // ==========================================
  return (
    <main className="main dashboard-main-content">
      {/* Minimalist Executive Hero */}
      <section className="admin-hero-banner">
        <div className="ahb-left">
          <div className="ahb-badge-row">
            <span className="admin-status-pill">
              <span className="live-pulse" />
              <span>Operations Training Architecture</span>
            </span>
            <span className="admin-role-tag">Super Admin Perspective</span>
          </div>

          <h1 className="ahb-title">NG Learn</h1>
          <p className="ahb-subtitle">
            Central operational training matrix mapped directly from Nurturing Green master SOP architecture. Manage department-specific curricula, track compliance certifications, and configure operational tracks.
          </p>
        </div>

        {/* Admin Metric Overview */}
        <div className="admin-kpis-grid">
          <div className="kpi-card">
            <span className="kpi-label">Active Modules</span>
            <span className="kpi-value">1 <small>/ 5</small></span>
            <span className="kpi-desc">Retail Operations Live</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-label">Process Sub-Flows</span>
            <span className="kpi-value">34</span>
            <span className="kpi-desc">Cross-Domain SOPs</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-label">Course Coverage</span>
            <span className="kpi-value">100%</span>
            <span className="kpi-desc">Standardized Audits</span>
          </div>
        </div>
      </section>

      {/* Filter Navigation Bar */}
      <section className="admin-filter-bar">
        <div className="filter-pills-group">
          <button
            className={`filter-tab ${selectedDept === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedDept('all')}
          >
            All Departments <span className="ft-count">5</span>
          </button>

          <button
            className={`filter-tab ${selectedDept === 'retail' ? 'active' : ''}`}
            onClick={() => setSelectedDept('retail')}
          >
            🏪 Retail Operations <span className="ft-count active-dot">1 Live</span>
          </button>

          <button
            className={`filter-tab ${selectedDept === 'q-comm' ? 'active' : ''}`}
            onClick={() => setSelectedDept('q-comm')}
          >
            ⚡ Quick Commerce <span className="ft-count">1</span>
          </button>

          <button
            className={`filter-tab ${selectedDept === 'supply-chain' ? 'active' : ''}`}
            onClick={() => setSelectedDept('supply-chain')}
          >
            📦 Supply Chain <span className="ft-count">1</span>
          </button>

          <button
            className={`filter-tab ${selectedDept === 'npd' ? 'active' : ''}`}
            onClick={() => setSelectedDept('npd')}
          >
            🪴 Product &amp; Design <span className="ft-count">1</span>
          </button>

          <button
            className={`filter-tab ${selectedDept === 'ecom' ? 'active' : ''}`}
            onClick={() => setSelectedDept('ecom')}
          >
            🛒 E-Commerce <span className="ft-count">1</span>
          </button>
        </div>
      </section>

      {/* Primary Active Module Showcase */}
      {(selectedDept === 'all' || selectedDept === 'retail') && (
        <section className="admin-showcase-section">
          <div className="section-eyebrow">
            <h2>Active Production Course</h2>
            <span className="pill done"><Check size={11} /> 1 Live Module Deployed</span>
          </div>

          <div className="luxury-module-card admin-featured">
            <div className="lmc-glow-bg" />
            <div className="lmc-top-bar">
              <div className="lmc-badges">
                <span className="lmc-dept-tag">🏪 Retail Operations Track</span>
                <span className="lmc-time-tag"><ClockIcon size={13} /> {totalMinutes} min</span>
                <span className="pill done">Operational Track Live</span>
              </div>

              <span className="admin-scope-pill">Target: Store Staff &amp; Area Managers</span>
            </div>

            <div className="lmc-hero-content">
              <div className="lmc-title-group">
                <h3>{MODULE_TITLE}</h3>
                <p className="lmc-lead">{MODULE_SUBTITLE}</p>
                <p className="lmc-description">
                  Master the four foundational pillars of offline retail operations: <strong>Stock</strong> (replenishment &amp; MDQ), <strong>Staff</strong> (hiring, training tracks &amp; rating), <strong>Display</strong> (planogram QC &amp; RTV), and <strong>Communication</strong> (brand, category, product &amp; offer signage).
                </p>
              </div>

              <div className="lmc-radial-card">
                <div className="admin-launch-box">
                  <div className="alb-stat">
                    <span>Your Completion</span>
                    <b>{overallProgress}%</b>
                  </div>
                  <button className="btn primary lmc-cta-btn" onClick={() => navigate('/retail-ops')}>
                    Inspect Module &amp; SOP Tools →
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Pillars Summary */}
            <div className="lmc-pillars-strip">
              <div className="pillar-tile">
                <div className="pillar-tile-icon"><PackageIcon size={16} /></div>
                <div className="pillar-tile-content">
                  <strong>Stock Process</strong>
                  <small>Replenishment, Indents &amp; MDQ</small>
                </div>
              </div>

              <div className="pillar-tile">
                <div className="pillar-tile-icon"><UsersIcon size={16} /></div>
                <div className="pillar-tile-content">
                  <strong>Staff Process</strong>
                  <small>Hiring, Training Tracks &amp; Rating</small>
                </div>
              </div>

              <div className="pillar-tile">
                <div className="pillar-tile-icon"><LayoutIcon size={16} /></div>
                <div className="pillar-tile-content">
                  <strong>Display Process</strong>
                  <small>Planograms, Hygiene &amp; RTV Discard</small>
                </div>
              </div>

              <div className="pillar-tile">
                <div className="pillar-tile-icon"><BookIcon size={16} /></div>
                <div className="pillar-tile-content">
                  <strong>Communication</strong>
                  <small>Brand, Category, Product &amp; Offers</small>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming / Pipeline Modules */}
      {filteredUpcoming.length > 0 && (
        <section className="admin-pipeline-section">
          <div className="section-eyebrow">
            <h2>Course Development Pipeline ({filteredUpcoming.length} Modules)</h2>
            <span className="pill">In Master Process Archive</span>
          </div>

          <div className="admin-pipeline-grid">
            {filteredUpcoming.map((m) => (
              <div key={m.id} className="pipeline-card">
                <div className="pc-top">
                  <span className="pc-icon">{m.icon}</span>
                  <span className="pc-dept-pill">{m.category}</span>
                  <span className="pc-status-tag">{m.status}</span>
                </div>

                <h4>{m.title}</h4>
                <p>{m.subtitle}</p>

                <div className="pc-footer">
                  <span className="pc-sections-meta">{m.sectionsCount} process sub-flows</span>
                  <span className="pc-time-est">{m.estHours}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Refined Minimal Archive Accordion */}
      <section className="admin-archive-footer">
        <div
          className="admin-archive-banner"
          onClick={() => setShowArchivedDetails(v => !v)}
        >
          <div className="aab-left">
            <span className="aab-tag">Master Archive</span>
            <p className="aab-text">
              All 34 marketplace, warehouse inward, and store operation workflows are mapped and cataloged in the core architecture.
            </p>
          </div>
          <button className="btn ghost sm">
            {showArchivedDetails ? 'Hide Architecture Notes ▲' : 'View Master Architecture ▼'}
          </button>
        </div>

        {showArchivedDetails && (
          <div className="admin-archive-details">
            <div className="aad-col">
              <strong>Offline Retail (Active)</strong>
              <ul>
                <li>Indent &amp; Replenishment Flow</li>
                <li>MDQ Logic &amp; Safety Stock</li>
                <li>Staff Hiring, Scorecard &amp; Grooming</li>
                <li>Planogram Standard &amp; RTV Protocols</li>
              </ul>
            </div>
            <div className="aad-col">
              <strong>Quick Commerce &amp; Marketplaces</strong>
              <ul>
                <li>Blinkit, Zepto, Instamart O2C SOP</li>
                <li>Amazon Direct Fulfillment Upload</li>
                <li>Listing Suppression Root Cause Analysis</li>
                <li>DOC Inspection &amp; Fill Rate SLAs</li>
              </ul>
            </div>
            <div className="aad-col">
              <strong>Supply Chain &amp; NPD</strong>
              <ul>
                <li>Raw Material Procurement Gatepass</li>
                <li>QC Discrepancy &amp; Vendor Return</li>
                <li>NPD Ideation to Store Launch Track</li>
              </ul>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
