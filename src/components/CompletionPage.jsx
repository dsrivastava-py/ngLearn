import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { SECTIONS, MODULE_TITLE } from '../data/retail-ops-sections.js';
import { resources } from '../data/retail-ops-resources.js';
import { Seal, Leaf, Check, DownloadIcon, FileIcon } from './icons.jsx';
import BrandLogo from './BrandLogo.jsx';

export default function CompletionPage() {
  const navigate = useNavigate();
  const { user, finalExam, completedAt, moduleCompleted } = useStore();

  const dateStr = completedAt
    ? new Date(completedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  const certId = `NG-RETAIL-OPS-${(user?.name || 'USER').slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <main className="main narrow">
      <div className="completion-container">
        {/* Certificate Card */}
        <div className="card certificate-card">
          <div className="cert-seal">
            <Seal />
          </div>

          <div className="cert-header">
            <span className="cert-badge">Official Training Certification</span>
            <h2>Certificate of Completion</h2>
            <p className="cert-sub">This is to certify that</p>
            <div className="cert-name">{user?.name || 'Team Member'}</div>
            <p className="cert-desc">
              has successfully completed all coursework, video lectures, section knowledge assessments,
              and passed the final comprehensive certification exam for
            </p>
            <div className="cert-module">{MODULE_TITLE} (Offline Sales SOP)</div>
          </div>

          <div className="cert-divider" />

          <div className="cert-meta-grid">
            <div className="cert-meta-item">
              <span>Candidate</span>
              <b>{user?.name || 'Team Member'}</b>
            </div>
            <div className="cert-meta-item">
              <span>Final Exam Score</span>
              <b>{finalExam?.score != null ? `${finalExam.score}%` : 'Passed'}</b>
            </div>
            <div className="cert-meta-item">
              <span>Date Completed</span>
              <b>{dateStr}</b>
            </div>
            <div className="cert-meta-item">
              <span>Verification ID</span>
              <b>{certId}</b>
            </div>
          </div>

          <div className="cert-footer">
            <div className="cert-brand">
              <BrandLogo height={44} showSubtitle={true} subtitle="LEARN" />
            </div>
            <div className="cert-sign">
              <span className="sign-line">Area Manager &amp; AGM Sales</span>
              <small>Process Verification Authority</small>
            </div>
          </div>
        </div>

        {/* Mastered Modules Summary */}
        <div className="card panel" style={{ marginTop: 24 }}>
          <h3>Mastered Competencies</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
            You have satisfied all procedural requirements across the 7 Retail Operations domains:
          </p>
          <div className="mastered-grid">
            {SECTIONS.map((sec) => (
              <div key={sec.id} className="mastered-item">
                <span className="mi-check"><Check size={14} /></span>
                <div>
                  <strong>{sec.order}. {sec.title}</strong>
                  <p>{sec.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Downloadable Resources Section */}
        <div className="card panel" style={{ marginTop: 24 }}>
          <div className="resources-header">
            <div>
              <h3>Handover &amp; Study Resources</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: '4px 0 0' }}>
                Download original process blueprints, SOP references, checklists, and templates to keep at your store.
              </p>
            </div>
          </div>

          <div className="resources-grid">
            {resources.map((res) => (
              <div key={res.id} className={`resource-card ${res.available ? 'active' : 'placeholder'}`}>
                <div className="rc-icon">
                  <FileIcon size={22} />
                </div>
                <div className="rc-info">
                  <div className="rc-title-row">
                    <strong>{res.name}</strong>
                    <span className="rc-type">{res.type.toUpperCase()}</span>
                  </div>
                  <p>{res.description}</p>
                  <span className="rc-size">{res.available ? res.size : 'File slot ready'}</span>
                </div>
                <div className="rc-action">
                  {res.available ? (
                    <a
                      href={res.path}
                      download={res.name}
                      target="_blank"
                      rel="noreferrer"
                      className="btn sm secondary"
                    >
                      <DownloadIcon size={14} /> Download
                    </a>
                  ) : (
                    <button className="btn sm ghost" disabled title="Will be available once uploaded to the resources folder">
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Action */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, margin: '32px 0 48px' }}>
          <button className="btn ghost" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <button className="btn" onClick={() => navigate('/section/orientation')}>
            Review Coursework
          </button>
        </div>
      </div>
    </main>
  );
}
