import React, { useState } from 'react';
import { FileIcon, DownloadIcon, Check, Leaf } from './icons.jsx';

export default function ResourceModal({ resource, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!resource) return null;

  const { name, subtitle, path, format, size, tag, description, previewDetails } = resource;

  const handleCopy = () => {
    const text = `${name}\n${subtitle}\n\n${description}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog resource-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="rm-header">
          <div className="rm-header-left">
            <span className="rm-tag">{tag}</span>
            {previewDetails?.docId && <span className="rm-docid">{previewDetails.docId}</span>}
            <h2 className="rm-title">{name}</h2>
            <p className="rm-sub">{subtitle}</p>
          </div>
          <button className="rm-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {/* Modal Body Preview */}
        <div className="rm-body">
          <div className="rm-meta-strip">
            <span className="rm-meta-item"><strong>Format:</strong> {format}</span>
            <span className="rm-meta-item"><strong>File Size:</strong> {size}</span>
            <span className="rm-meta-item"><strong>Status:</strong> Available for Download</span>
          </div>

          <p className="rm-desc">{description}</p>

          {/* Structured Preview Rendering */}
          {previewDetails?.formula && (
            <div className="rm-section">
              <h4>Primary Replenishment Formula</h4>
              <div className="rm-formula-box">
                <code>{previewDetails.formula}</code>
              </div>
            </div>
          )}

          {previewDetails?.tableHeaders && previewDetails?.tableRows && (
            <div className="rm-section">
              <h4>Replenishment &amp; Dispatch Matrix</h4>
              <div className="rm-table-wrap">
                <table>
                  <thead>
                    <tr>
                      {previewDetails.tableHeaders.map((h, i) => <th key={i}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {previewDetails.tableRows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => <td key={j}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {previewDetails?.tiers && (
            <div className="rm-section">
              <h4>Visual Display Tier Hierarchy</h4>
              <div className="rm-tiers-list">
                {previewDetails.tiers.map((t, i) => (
                  <div key={i} className="rm-tier-card">
                    <strong>{t.name}</strong>
                    <p>{t.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {previewDetails?.rtvRules && (
            <div className="rm-section">
              <h4>RTV Defect &amp; SLA Protocol</h4>
              <div className="rm-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Defect Type</th>
                      <th>Visual Criteria</th>
                      <th>Resolution SLA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewDetails.rtvRules.map((r, i) => (
                      <tr key={i}>
                        <td><strong>{r.defect}</strong></td>
                        <td>{r.criteria}</td>
                        <td><span className="rm-sla-pill">{r.sla}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {previewDetails?.benchmarks && (
            <div className="rm-section">
              <h4>Candidate Evaluation Matrix</h4>
              <div className="rm-benchmarks-list">
                {previewDetails.benchmarks.map((b, i) => (
                  <div key={i} className="rm-benchmark-item">
                    <strong>{b.area}</strong>
                    <p>{b.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {previewDetails?.checklist && (
            <div className="rm-section">
              <h4>Daily Store Opening 15-Minute Checklist</h4>
              <div className="rm-checklist">
                {previewDetails.checklist.map((item, i) => (
                  <div key={i} className="rm-check-item">
                    <span className="rm-check-icon"><Check size={14} /></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {previewDetails?.terms && (
            <div className="rm-section">
              <h4>Core Terminology Definitions</h4>
              <div className="rm-terms-grid">
                {previewDetails.terms.map((t, i) => (
                  <div key={i} className="rm-term-card">
                    <strong>{t.term}</strong>
                    <p>{t.def}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {previewDetails?.isSvg && (
            <div className="rm-section">
              <div className="rm-svg-notice">
                <Leaf size={24} />
                <div>
                  <strong>Full Vector Process Architecture Available</strong>
                  <p>Contains 34 cross-domain process maps exported directly from master Lucidchart schema.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="rm-footer">
          <button className="btn ghost sm" onClick={handleCopy}>
            {copied ? '✓ Copied Summary' : '📋 Copy SOP Text'}
          </button>
          
          <div className="rm-footer-right">
            <a
              href={path}
              target="_blank"
              rel="noopener noreferrer"
              className="btn ghost sm"
            >
              Open in New Window ↗
            </a>
            <a
              href={path}
              download
              className="btn primary sm"
            >
              <DownloadIcon size={14} /> Download File ({size})
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
