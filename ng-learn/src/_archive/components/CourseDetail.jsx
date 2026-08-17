import { Chevron, Check, FlowIcon, VideoIcon } from './icons.jsx';

const INFO_LABEL = {
  responsibility: 'Responsibility',
  sla: 'SLA',
  cadence: 'Cadence',
  reference: 'Reference',
};

export default function CourseDetail({ section, progress, onOpenTopic, onQuiz, onFinish }) {
  const doneIds = progress.done;
  const allDone = section.topics.length > 0 && section.topics.every((t) => doneIds.includes(t.id));
  const pct = section.topics.length ? Math.round((doneIds.length / section.topics.length) * 100) : 0;
  const infoKeys = Object.keys(INFO_LABEL).filter((k) => section.courseInfo[k] && section.courseInfo[k].length);

  return (
    <>
      <div className="detail-head">
        <div className="grow">
          <div className="section-label">
            Course {String(section.order).padStart(2, '0')} · source frame “{section.rawLabel}”
          </div>
          <h1 className="page-title" style={{ margin: '4px 0 8px' }}>{section.title}</h1>
          {section.summary && <p className="page-sub" style={{ marginBottom: 10 }}>{section.summary}</p>}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="pill video"><VideoIcon size={11} /> {section.videoCount} lessons</span>
            {section.flowchartCount > 0 && <span className="pill flow"><FlowIcon size={11} /> 1 flowchart</span>}
            <span className="pill">{section.workStepCount} source steps merged</span>
            {progress.quizPassed && <span className="pill done"><Check size={11} /> Quiz passed</span>}
          </div>
        </div>
        <div style={{ minWidth: 190 }}>
          <div className="progress-row">
            <div className="progress"><i className={allDone ? 'complete' : ''} style={{ width: `${pct}%` }} /></div>
            <span className="progress-val">{pct}%</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
            {doneIds.length} of {section.topics.length} lessons complete
          </div>
        </div>
      </div>

      {section.needsClarification && (
        <div className="clarify-banner">
          <span className="pill thin">Needs clarification</span>
          <div>{section.clarificationNote}</div>
        </div>
      )}

      {infoKeys.length > 0 && (
        <div className="card panel info-panel">
          <h4>Course information (from the diagram)</h4>
          <div className="info-grid">
            {infoKeys.map((k) => (
              <div key={k}>
                <span className="section-label">{INFO_LABEL[k]}</span>
                {section.courseInfo[k].map((x, i) => <div key={i} className="info-line">{x.text}</div>)}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="topic-list">
        {section.topics.map((t, i) => {
          const done = doneIds.includes(t.id);
          return (
            <button className={'topic-row' + (done ? ' done' : '')} key={t.id} onClick={() => onOpenTopic(t)}>
              <span className="idx">{done ? <Check size={13} /> : i + 1}</span>
              <span className="body">
                <strong>{t.title}</strong>
                <span className="sub">
                  {t.type === 'video'
                    ? `${t.stepCount} step${t.stepCount === 1 ? '' : 's'}${t.notes.length ? ` · ${t.notes.length} note${t.notes.length > 1 ? 's' : ''}` : ''}`
                    : `${t.nodes.length} decision/end nodes · ${t.edges.length} real connections${t.standalone.length ? ` · ${t.standalone.length} unconnected` : ''}`}
                </span>
              </span>
              <span className={'pill ' + (t.type === 'video' ? 'video' : 'flow')}>
                {t.type === 'video' ? <VideoIcon size={11} /> : <FlowIcon size={11} />}
              </span>
              <span className="chev"><Chevron /></span>
            </button>
          );
        })}
      </div>

      {section.sectionNotes.length > 0 && (
        <div className="card panel" style={{ marginTop: 18 }}>
          <h4>Course-level reference notes ({section.sectionNotes.length})</h4>
          {section.sectionNotes.map((n, i) => (
            <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
              <b style={{ color: 'var(--primary)', fontSize: 10.5, letterSpacing: '.06em', textTransform: 'uppercase' }}>{n.kind}</b>
              <div>{n.text}</div>
            </div>
          ))}
        </div>
      )}

      <div className="gate-banner">
        <div className="grow">
          {allDone
            ? progress.quizPassed
              ? 'All lessons complete and the section quiz is passed. You can close out the KT.'
              : 'All lessons complete. Pass the section quiz to unlock Finish Training & KT.'
            : `Complete all ${section.topics.length} lessons to unlock the section quiz.`}
        </div>
        <button className="btn ghost" onClick={onQuiz} disabled={!allDone}>Section quiz</button>
        <button className="btn secondary" onClick={onFinish} disabled={!allDone || !progress.quizPassed}>
          Finish Training &amp; KT
        </button>
      </div>
    </>
  );
}
