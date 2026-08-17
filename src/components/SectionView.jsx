import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { SECTIONS, getSection, getAdjacentSections } from '../data/retail-ops-sections.js';
import { SECTION_ICONS, Check, Chevron, ChevronLeft, ClockIcon } from './icons.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import { useState, useEffect } from 'react';

function formatMarkdown(text) {
  if (!text) return null;
  // Replace **bold** with <strong>
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function StepCard({ step, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const typeClass = step.type || 'step';

  return (
    <div className={`step-card type-${typeClass} ${open ? 'open' : ''}`}>
      <button className="step-header" onClick={() => setOpen(o => !o)}>
        <span className={`step-type-badge ${typeClass}`}>{typeClass}</span>
        <span className="step-title">{step.title}</span>
        {step.cadence && <span className="step-cadence">{step.cadence}</span>}
        <span className="step-chevron"><Chevron size={14} /></span>
      </button>
      {open && (
        <div className="step-body">
          <p>{formatMarkdown(step.content)}</p>
          {step.stickyNote && (
            <div className="sticky-note">
              <span className="sn-label">📝 Note</span>
              <p>{formatMarkdown(step.stickyNote)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GlossaryTable({ glossary }) {
  return (
    <div className="glossary-table">
      <table>
        <thead><tr><th>Term</th><th>Meaning</th></tr></thead>
        <tbody>
          {glossary.map(g => (
            <tr key={g.term}><td><strong>{g.term}</strong></td><td>{g.meaning}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SectionView() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { sections: sectionStates, setLectureCompleted, isSectionComplete } = useStore();

  const section = getSection(sectionId);
  const { prev, next } = getAdjacentSections(sectionId);
  const sectionState = sectionStates[sectionId] || {};
  const Icon = section ? SECTION_ICONS[section.icon] : null;

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [sectionId]);

  if (!section) {
    return (
      <main className="main narrow">
        <div className="empty-state">Section not found. <button className="btn ghost" onClick={() => navigate('/dashboard')}>Back to dashboard</button></div>
      </main>
    );
  }

  const lectureComplete = sectionState.lectureCompleted;
  const quizPassed = sectionState.quizPassed;
  const complete = isSectionComplete(sectionId);

  return (
    <main className="main">
      <div className="section-layout">
        {/* Left: Video + controls */}
        <div className="section-main">
          <VideoPlayer section={section} />

          <div className="section-title-bar">
            <div className="stb-left">
              <div className="stb-icon-wrap">
                {Icon && <Icon size={20} />}
              </div>
              <div>
                <div className="stb-num">Section {section.order} of {SECTIONS.length}</div>
                <h2>{section.title}</h2>
                <p className="stb-sub">{section.subtitle}</p>
              </div>
            </div>
            <div className="stb-right">
              <span className="pill"><ClockIcon size={12} /> {section.estimatedMinutes} min</span>
              {complete && <span className="pill done"><Check size={12} /> Completed</span>}
            </div>
          </div>

          <div className="section-overview">
            <p>{section.overview}</p>
          </div>

          <div className="section-actions">
            <button
              className={`btn ${lectureComplete ? 'ghost' : ''}`}
              onClick={() => setLectureCompleted(sectionId, !lectureComplete)}
            >
              {lectureComplete ? '✓ Lecture Completed' : 'Mark Lecture Complete'}
            </button>
            <button
              className="btn secondary"
              onClick={() => navigate(`/section/${sectionId}/quiz`)}
              disabled={!lectureComplete}
            >
              {quizPassed ? '✓ Quiz Passed — Retake' : 'Take Section Quiz'}
            </button>
          </div>

          <div className="section-nav">
            <button className="btn ghost" onClick={() => navigate(`/section/${prev.id}`)} disabled={!prev}>
              <ChevronLeft size={14} /> Previous Section
            </button>
            <button className="btn ghost" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className="btn secondary" onClick={() => navigate(`/section/${next.id}`)} disabled={!next}>
              Next Section <Chevron size={14} />
            </button>
          </div>
        </div>

        {/* Right: Notes sidebar */}
        <aside className="section-sidebar">
          {/* Key Points */}
          {section.keyPoints?.length > 0 && (
            <div className="sidebar-card key-points">
              <h4>🔑 Key Points</h4>
              <ul>
                {section.keyPoints.map((kp, i) => <li key={i}>{kp}</li>)}
              </ul>
            </div>
          )}

          {/* Steps */}
          {section.steps?.length > 0 && (
            <div className="sidebar-card">
              <h4>📋 Step-by-Step Walkthrough</h4>
              <div className="steps-list">
                {section.steps.map((step, i) => (
                  <StepCard key={i} step={step} defaultOpen={i === 0} />
                ))}
              </div>
            </div>
          )}

          {/* Side track (formulas) */}
          {section.sideTrack && (
            <div className="sidebar-card formula-card">
              <h4>📐 {section.sideTrack.title}</h4>
              <p>{section.sideTrack.content}</p>
              {section.sideTrack.formulas?.map((f, i) => (
                <div key={i} className="formula">
                  <span className="formula-name">{f.name}</span>
                  <span className="formula-def">{f.definition}</span>
                </div>
              ))}
            </div>
          )}

          {/* Diagram Legend */}
          {section.diagramLegend && (
            <div className="sidebar-card">
              <h4>🎨 Diagram Color Code</h4>
              <div className="legend-list">
                {section.diagramLegend.map((l, i) => (
                  <div key={i} className={`legend-item color-${l.color}`}>
                    <span className="legend-dot" />
                    <div>
                      <strong>{l.label}</strong>
                      <span>{l.meaning}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Glossary */}
          {section.glossary && (
            <div className="sidebar-card">
              <h4>📖 Master Glossary</h4>
              <GlossaryTable glossary={section.glossary} />
            </div>
          )}

          {/* Open Items */}
          {section.openItems && (
            <div className="sidebar-card">
              <h4>⚠️ Open Items</h4>
              {section.openItems.map((item, i) => (
                <div key={i} className="open-item">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Recap */}
          {section.recap?.length > 0 && (
            <div className="sidebar-card recap-card">
              <h4>✅ Quick Recap</h4>
              <ul>
                {section.recap.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
