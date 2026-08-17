import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { SECTIONS, MODULE_TITLE, MODULE_SUBTITLE } from '../data/retail-ops-sections.js';
import { resources } from '../data/retail-ops-resources.js';
import ResourceModal from './ResourceModal.jsx';
import {
  SECTION_ICONS,
  Check,
  ClockIcon,
  LockIcon,
  Leaf,
  BookIcon,
  FileIcon,
  DownloadIcon,
} from './icons.jsx';

function ProgressRing({ percent, size = 120 }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="progress-ring-wrap">
      <svg width={size} height={size} className="progress-ring">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth="8" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="ring-label">
        <span className="ring-pct">{percent}%</span>
        <span className="ring-sub">complete</span>
      </div>
    </div>
  );
}

function SectionCard({ section, sectionState, isComplete, onClick }) {
  const Icon = SECTION_ICONS[section.icon];
  const inProgress = sectionState?.lectureCompleted && !sectionState?.quizPassed;
  let status = 'not-started';
  if (isComplete) status = 'completed';
  else if (inProgress || sectionState?.lectureCompleted) status = 'in-progress';

  return (
    <button className={`section-card status-${status}`} onClick={onClick}>
      <div className="sc-top">
        <div className={`sc-icon icon-${section.icon}`}>
          {Icon && <Icon size={22} />}
        </div>
        <span className="sc-num">{String(section.order).padStart(2, '0')}</span>
      </div>
      <h3>{section.title}</h3>
      <p className="sc-sub">{section.subtitle}</p>
      <div className="sc-meta">
        <span className="sc-time"><ClockIcon size={13} /> {section.estimatedMinutes} min</span>
        {status === 'completed' && <span className="sc-badge done"><Check size={12} /> Done</span>}
        {status === 'in-progress' && <span className="sc-badge progress">In progress</span>}
        {status === 'not-started' && <span className="sc-badge">Not started</span>}
      </div>
      {!section.hasVideo && <span className="sc-video-tag">Video coming soon</span>}
    </button>
  );
}

function LearningPath({ sections, isSectionComplete }) {
  return (
    <div className="learning-path">
      {sections.map((s, i) => {
        const done = isSectionComplete(s.id);
        return (
          <div key={s.id} className="lp-step">
            <span className={`lp-dot ${done ? 'done' : ''}`}>
              {done ? <Check size={14} /> : s.order}
            </span>
            {i < sections.length - 1 && (
              <span className={`lp-line ${done ? 'done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ModuleDashboard() {
  const navigate = useNavigate();
  const {
    sections: sectionStates,
    isSectionComplete,
    completedSectionCount,
    allSectionsComplete,
    overallProgress,
    moduleCompleted,
  } = useStore();

  const [selectedResource, setSelectedResource] = useState(null);

  const totalMinutes = SECTIONS.reduce((sum, s) => sum + s.estimatedMinutes, 0);
  const quizzesPassed = SECTIONS.filter(s => sectionStates[s.id]?.quizPassed).length;

  return (
    <main className="main narrow">
      {selectedResource && (
        <ResourceModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}

      <div style={{ marginBottom: 14 }}>
        <button className="btn ghost sm" onClick={() => navigate('/modules')}>
          ← Back to All Modules
        </button>
      </div>

      {/* Hero with Progress Meter on the Right */}
      <div className="dashboard-hero">
        <div className="dh-left">
          <div className="module-badge"><Leaf size={16} /> Retail Operations Module</div>
          <h1 className="page-title">{MODULE_TITLE}</h1>
          <p className="page-sub">{MODULE_SUBTITLE}</p>
          <div className="dh-stats">
            <div className="dh-stat">
              <b>{completedSectionCount}</b><span>of {SECTIONS.length} sections</span>
            </div>
            <div className="dh-stat">
              <b>{quizzesPassed}</b><span>quizzes passed</span>
            </div>
            <div className="dh-stat">
              <b>{totalMinutes}</b><span>min total</span>
            </div>
          </div>
        </div>
        <ProgressRing percent={overallProgress} />
      </div>

      <LearningPath sections={SECTIONS} isSectionComplete={isSectionComplete} />

      <div className="section-grid">
        {SECTIONS.map(s => (
          <SectionCard
            key={s.id}
            section={s}
            sectionState={sectionStates[s.id]}
            isComplete={isSectionComplete(s.id)}
            onClick={() => navigate(`/retail-ops/section/${s.id}`)}
          />
        ))}
      </div>

      {/* Final Exam Gate */}
      <div className="final-exam-gate">
        <div className="feg-content">
          <BookIcon size={28} />
          <div>
            <h3>Final Module Exam</h3>
            <p>
              {allSectionsComplete
                ? moduleCompleted
                  ? 'You\'ve passed the final exam! View your completion certificate and resources.'
                  : 'All sections complete — you\'re ready for the final exam. 25 questions, 70% to pass.'
                : `Complete all ${SECTIONS.length} sections to unlock the final exam. ${SECTIONS.length - completedSectionCount} remaining.`}
            </p>
          </div>
        </div>
        {moduleCompleted ? (
          <button className="btn secondary" onClick={() => navigate('/retail-ops/completion')}>
            View Certificate →
          </button>
        ) : (
          <button className="btn" onClick={() => navigate('/retail-ops/final-exam')} disabled={!allSectionsComplete}>
            {allSectionsComplete ? 'Start Final Exam →' : <><LockIcon size={14} /> Locked</>}
          </button>
        )}
      </div>

      {/* Standard Operating Procedures & Tools hosted inside Retail Ops */}
      <section className="quick-resources-section" style={{ marginTop: 36 }}>
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

      <div className="dash-footer" style={{ marginTop: 28, textAlign: 'center' }}>
        <a
          href="/resources/Nurturing-Green-Master-Process-Map.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn ghost sm"
        >
          View Full Master Process Blueprint (PDF) ↗
        </a>
      </div>
    </main>
  );
}
