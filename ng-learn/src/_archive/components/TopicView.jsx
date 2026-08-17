import { useEffect, useRef, useState } from 'react';
import Flowchart from './Flowchart.jsx';
import { Play, Check, Chevron, FlowIcon, VideoIcon } from './icons.jsx';

function Skeleton() {
  return (
    <div className="skeleton">
      <div className="sk-block" style={{ left: '6%', top: '14%', width: '52%', height: 16 }} />
      <div className="sk-block" style={{ left: '6%', top: '26%', width: '34%', height: 12 }} />
      <div className="sk-block" style={{ left: '50%', top: '44%', width: 62, height: 62, borderRadius: '50%', transform: 'translate(-50%,-50%)' }} />
      <div className="sk-block" style={{ left: '6%', bottom: '12%', right: '6%', height: 8 }} />
    </div>
  );
}

function MockPlayer({ title, stepCount }) {
  const [playing, setPlaying] = useState(false);
  const [pct, setPct] = useState(0);
  const timer = useRef(null);
  const total = Math.max(90, stepCount * 45);

  useEffect(() => {
    if (!playing) return undefined;
    timer.current = setInterval(() => setPct((p) => (p >= 100 ? 100 : p + 1.4)), 320);
    return () => clearInterval(timer.current);
  }, [playing]);

  useEffect(() => { setPlaying(false); setPct(0); }, [title]);

  const secs = Math.round((pct / 100) * total);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="player">
      <div className="frame-bg" />
      <div className="badge">Lesson · {stepCount} step{stepCount === 1 ? '' : 's'}</div>
      <div className="center">
        <button className="play" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}>
          {playing
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            : <Play />}
        </button>
        <h4>{title}</h4>
        <p>Screen recording placeholder — no media file in this demo build.</p>
      </div>
      <div className="player-bar">
        <span className="t">{fmt(secs)}</span>
        <div className="scrub"><i style={{ width: `${pct}%` }} /></div>
        <span className="t">{fmt(total)}</span>
      </div>
    </div>
  );
}

function Note({ note, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={'note' + (open ? ' open' : '')}>
      <button onClick={() => setOpen((o) => !o)}>
        <span className="kind">{note.kind || 'Note'}</span>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {note.text.slice(0, 46)}
        </span>
        <span className="caret"><Chevron size={14} /></span>
      </button>
      {open && (
        <div className="body">
          {note.step && <div className="note-step">on: {note.step}</div>}
          {note.text}
          {(note.extra || []).map((x, i) => <div key={i} style={{ marginTop: 8 }}>{x}</div>)}
        </div>
      )}
    </div>
  );
}

export default function TopicView({ section, topic, done, onToggleDone, onPrev, onNext, hasPrev, hasNext, onOpenMap }) {
  const [loading, setLoading] = useState(topic.type === 'video');

  useEffect(() => {
    if (topic.type !== 'video') { setLoading(false); return undefined; }
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, [topic.id, topic.type]);

  const notes = topic.notes || [];
  const images = topic.images || [];
  const idx = section.topics.findIndex((t) => t.id === topic.id);

  return (
    <div className="topic-layout">
      <div>
        {topic.type === 'video' ? (
          <div style={{ position: 'relative' }}>
            <MockPlayer title={topic.title} stepCount={topic.stepCount} />
            {loading && <Skeleton />}
          </div>
        ) : (
          <Flowchart topic={topic} onOpenMap={onOpenMap} />
        )}

        <div className="topic-title-row">
          <span className="pill">{`Lesson ${idx + 1} of ${section.topics.length}`}</span>
          <span className={'pill ' + (topic.type === 'video' ? 'video' : 'flow')}>
            {topic.type === 'video' ? <VideoIcon size={11} /> : <FlowIcon size={11} />}
            {' '}{topic.type === 'video' ? 'Video lesson' : 'Interactive flowchart'}
          </span>
          {done && <span className="pill done">Completed</span>}
        </div>
        <h2 style={{ margin: '0 0 4px', fontSize: 20, letterSpacing: '-.02em' }}>{topic.title}</h2>
        <p className="page-sub" style={{ marginBottom: 0 }}>{section.title}</p>

        {topic.type === 'video' && (
          <div className="card panel" style={{ marginTop: 14 }}>
            <h4>What this lesson covers ({topic.steps.length} step{topic.steps.length === 1 ? '' : 's'} from the process map)</h4>
            <ol className="step-list">
              {topic.steps.map((s, i) => (
                <li key={s.rowId}>
                  <span className="step-n">{i + 1}</span>
                  <span>
                    {s.text}
                    {(s.detail || []).map((d, j) => <div key={j} className="step-detail">{d}</div>)}
                  </span>
                  <span className="step-shape">{s.shapeName}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="topic-nav">
          <button className="btn ghost" onClick={onPrev} disabled={!hasPrev}>← Previous</button>
          <button className={'btn ' + (done ? 'ghost' : '')} onClick={onToggleDone}>
            {done ? 'Mark as not done' : <><Check size={15} /> Mark complete</>}
          </button>
          <button className="btn secondary" onClick={onNext} disabled={!hasNext}>Next lesson →</button>
        </div>
      </div>

      <aside className="side">
        <div className="card panel">
          <h4>Notes {notes.length ? `(${notes.length})` : ''}</h4>
          {notes.length ? (
            notes.map((n, i) => <Note key={i} note={n} defaultOpen={i === 0 && notes.length === 1} />)
          ) : (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              No reference notes attached to these steps in the source diagram.
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className="card panel">
            <h4>Reference images ({images.length})</h4>
            {images.map((im, i) => (
              <div className="ref-image" key={i} style={{ marginBottom: 8 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="4" width="18" height="16" rx="2.5" />
                  <circle cx="9" cy="10" r="1.8" /><path d="m4 18 5.5-5 4 3.4L17 13l3 3.2" />
                </svg>
                <span>{im.text || 'Screenshot from process map'}</span>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
