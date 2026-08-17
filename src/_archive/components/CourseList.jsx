import { useMemo, useState } from 'react';
import { FlowIcon, VideoIcon, Check } from './icons.jsx';

function AdminNote({ stats, unsorted, emptySections }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card" style={{ marginBottom: 22, padding: 0 }}>
      <div className="admin-note" style={{ margin: 0, border: 0 }}>
        <span className="tag">Data coverage</span>
        <span>Resolved items <b>{stats.resolvedItems}</b></span>
        <span>Unsorted / unresolved <b>{unsorted.count}</b></span>
        <span>Courses <b>{stats.sectionCount}</b></span>
        <span>Lessons <b>{stats.lessonCount}</b> from <b>{stats.workStepCount}</b> steps</span>
        <span>Flowchart edges <b>{stats.flowchartEdges}</b></span>
        <span>Empty frames <b>{emptySections.length}</b></span>
        <button onClick={() => setOpen((o) => !o)}>{open ? 'Hide detail' : 'Show detail'}</button>
      </div>
      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 10 }}>
            CSV→JSON shape-ID join {((stats.shapeIdJoinMatched / stats.jsonShapes) * 100).toFixed(1)}%
            ({stats.shapeIdJoinMatched}/{stats.jsonShapes}). {unsorted.count} shapes never reached a named frame
            through their containment chain ({Object.entries(unsorted.byKind).map(([k, v]) => `${v} ${k}`).join(', ')}) —
            left unassigned rather than guessed into a nearby course.
            Flowcharts use {stats.flowchartEdges} connections read from <code>items.lines[]</code>;
            {' '}{stats.standaloneFlowNodes} node(s) had no captured connection and are shown unconnected.
          </div>
          <div className="section-label">Frames present in the diagram with zero resolved content</div>
          <div className="gap-list">
            {emptySections.map((f) => (
              <div className="gap-item" key={f.rowId}>
                <span className="pill thin">thin</span>
                <b style={{ fontWeight: 600 }}>{f.name}</b>
                <code>row {f.rowId}{f.containedBy ? ` · inside row ${f.containedBy}` : ''}</code>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 10 }}>
            Known gap: <b style={{ color: 'var(--text)' }}>Outward</b> has no resolved content — its steps sit in
            unattached containers in the source file. Left thin on purpose, not padded.
          </div>
        </div>
      )}
    </div>
  );
}

export default function CourseList({ sections, stats, unsorted, emptySections, progressOf, onOpen, onOpenMap }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sections.filter((s) => {
      if (needle && !(s.title.toLowerCase().includes(needle) || s.rawLabel.toLowerCase().includes(needle))) return false;
      const p = progressOf(s);
      if (filter === 'progress') return p.pct > 0 && !p.complete;
      if (filter === 'done') return p.complete;
      if (filter === 'o2c') return /order-to-cash|order-to-delivery/i.test(s.title);
      if (filter === 'flag') return s.needsClarification;
      return true;
    });
  }, [sections, q, filter, progressOf]);

  const flagged = sections.filter((s) => s.needsClarification).length;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <h1 className="page-title">Training courses</h1>
          <p className="page-sub">
            {sections.length} process areas mapped from the Nurturing Green master flow,
            grouped into {stats.lessonCount} lessons. Pick a course to start.
          </p>
        </div>
        <button className="btn ghost" onClick={onOpenMap}>View original process map</button>
      </div>

      <AdminNote stats={stats} unsorted={unsorted} emptySections={emptySections} />

      <div className="toolbar">
        <input className="search" placeholder="Search courses…" value={q} onChange={(e) => setQ(e.target.value)} />
        {[['all', 'All'], ['o2c', 'Marketplace O2C'], ['progress', 'In progress'], ['done', 'Completed'],
          ['flag', `Needs clarification (${flagged})`]].map(([k, label]) => (
          <button key={k} className={'btn sm ' + (filter === k ? '' : 'ghost')} onClick={() => setFilter(k)}>{label}</button>
        ))}
      </div>

      <div className="course-grid">
        {shown.map((s) => {
          const p = progressOf(s);
          return (
            <button className="course-card" key={s.id} onClick={() => onOpen(s)}>
              <div className="top">
                <span className="num">{String(s.order).padStart(2, '0')}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3>{s.title}</h3>
                  <div className="raw-tag" title="Original label in the source diagram">{s.rawLabel}</div>
                  <div className="meta">
                    <span className="pill video"><VideoIcon size={11} /> {s.videoCount} lessons</span>
                    {s.flowchartCount > 0 && <span className="pill flow"><FlowIcon size={11} /> flowchart</span>}
                    {s.needsClarification && <span className="pill thin">needs clarification</span>}
                    {p.complete && <span className="pill done"><Check size={11} /> KT done</span>}
                  </div>
                </div>
              </div>
              <div className="progress-row">
                <div className="progress"><i className={p.complete ? 'complete' : ''} style={{ width: `${p.pct}%` }} /></div>
                <span className="progress-val">{p.doneCount}/{s.topicCount}</span>
              </div>
            </button>
          );
        })}
      </div>

      {shown.length === 0 && <div className="empty-state">No courses match “{q}”.</div>}

      <div className="admin-note" style={{ marginTop: 26 }}>
        <span className="tag">Not a course</span>
        <span>
          <b>{unsorted.count}</b> unsorted content items could not be resolved to any section and are excluded
          from the course list above.
        </span>
      </div>
    </>
  );
}
