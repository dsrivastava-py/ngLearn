import { Seal, Leaf } from './icons.jsx';

export default function Completion({ section, user, completedAt, onBackToCourses, onReview }) {
  const date = new Date(completedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="done-wrap">
      <div className="card certificate">
        <div className="seal"><Seal /></div>
        <h2>Training &amp; KT complete</h2>
        <p className="page-sub" style={{ marginBottom: 0 }}>
          This confirms completion of all topics and the section quiz.
        </p>

        <div className="course-name">{section.title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {section.videoCount} lessons covering {section.workStepCount} process steps
          {section.flowchartCount ? ' · 1 process flowchart' : ''}
        </div>

        <div className="rule" />

        <div className="cert-meta">
          <div><span>Completed by</span><b>{user}</b></div>
          <div><span>Date</span><b>{date}</b></div>
          <div><span>Reference</span><b>NG-{section.id.replace('sec-', '').slice(0, 10).toUpperCase()}</b></div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 26, flexWrap: 'wrap' }}>
          <button className="btn ghost" onClick={onReview}>Review course</button>
          <button className="btn secondary" onClick={onBackToCourses}>Back to all courses</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 26, color: 'var(--text-secondary)', fontSize: 12 }}>
          <Leaf size={15} /> NG Learn · Nurturing Green internal training
        </div>
      </div>
    </div>
  );
}
