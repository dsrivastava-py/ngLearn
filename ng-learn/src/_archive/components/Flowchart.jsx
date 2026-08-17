import { useMemo, useRef, useState } from 'react';
import { layoutFlow } from '../lib/layout.js';

/*
 * Renders ONLY what the source data contains. Nodes are the section's real
 * Decision / Terminator / Delay shapes plus the process shapes they are actually
 * connected to; every edge comes from a JSON items.lines[] entry (lineId shown
 * in the inspector). Nodes with no captured connection are never wired up to
 * make the picture look complete — they are listed separately as unconnected.
 */

const FILL = {
  decision: { fill: 'var(--tint)', stroke: 'var(--primary)' },
  terminator: { fill: 'color-mix(in srgb, var(--secondary) 16%, transparent)', stroke: 'var(--secondary)' },
  delay: { fill: 'color-mix(in srgb, var(--fail) 10%, transparent)', stroke: 'var(--fail)' },
  process: { fill: 'var(--surface)', stroke: 'var(--border-strong)' },
};

function wrap(text, width, size) {
  const max = Math.max(8, Math.floor(width / (size * 0.53)));
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const next = line ? line + ' ' + w : w;
    if (next.length > max && line) { lines.push(line); line = w; } else line = next;
  }
  if (line) lines.push(line);
  if (lines.length > 4) { lines.length = 4; lines[3] = lines[3].slice(0, max - 1) + '…'; }
  return lines;
}

function NodeShape({ n, selected, dim, onSelect }) {
  const c = FILL[n.shape] || FILL.process;
  const size = n.shape === 'process' ? 11.5 : 12;
  const lines = wrap(n.text, n.w - 26, size);
  const cx = n.x + n.w / 2;
  const cy = n.y + n.h / 2;
  const stroke = selected ? 'var(--primary)' : c.stroke;
  const sw = selected ? 2.4 : 1.5;

  let shape;
  if (n.shape === 'decision') {
    shape = <polygon className="shape" points={`${cx},${n.y} ${n.x + n.w},${cy} ${cx},${n.y + n.h} ${n.x},${cy}`} fill={c.fill} stroke={stroke} strokeWidth={sw} />;
  } else if (n.shape === 'terminator') {
    shape = <rect className="shape" x={n.x} y={n.y} width={n.w} height={n.h} rx={n.h / 2} fill={c.fill} stroke={stroke} strokeWidth={sw} />;
  } else if (n.shape === 'delay') {
    const r = n.h / 2;
    shape = <path className="shape" d={`M ${n.x} ${n.y} H ${n.x + n.w - r} A ${r} ${r} 0 0 1 ${n.x + n.w - r} ${n.y + n.h} H ${n.x} Z`} fill={c.fill} stroke={stroke} strokeWidth={sw} />;
  } else {
    shape = <rect className="shape" x={n.x} y={n.y} width={n.w} height={n.h} rx="10" fill={c.fill} stroke={stroke} strokeWidth={sw} />;
  }

  return (
    <g className="fnode" opacity={dim ? 0.3 : 1} onClick={() => onSelect(n)}>
      {shape}
      {lines.map((ln, i) => (
        <text key={i} x={cx} y={cy - ((lines.length - 1) * (size + 3)) / 2 + i * (size + 3) + size / 3}
          textAnchor="middle" fontSize={size} fontWeight={n.shape === 'process' ? 500 : 600} fill="var(--text)">{ln}</text>
      ))}
    </g>
  );
}

export default function Flowchart({ topic, onOpenMap }) {
  const all = useMemo(() => [...topic.nodes, ...topic.contextNodes], [topic]);
  const standaloneIds = useMemo(() => new Set(topic.standalone), [topic]);
  const drawn = useMemo(() => all.filter((n) => !standaloneIds.has(n.id)), [all, standaloneIds]);
  const orphans = useMemo(() => all.filter((n) => standaloneIds.has(n.id)), [all, standaloneIds]);

  const { nodes: laid, paths, height } = useMemo(() => layoutFlow(drawn, topic.edges), [drawn, topic.edges]);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [sel, setSel] = useState(null);
  const [showData, setShowData] = useState(false);
  const drag = useRef(null);
  const [dragging, setDragging] = useState(false);

  const neighbours = useMemo(() => {
    if (!sel) return null;
    const set = new Set([sel.id]);
    topic.edges.forEach((e) => {
      if (e.from === sel.id) set.add(e.to);
      if (e.to === sel.id) set.add(e.from);
    });
    return set;
  }, [sel, topic.edges]);

  const label = useMemo(() => new Map(all.map((n) => [n.id, n.text])), [all]);

  const onDown = (e) => { drag.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }; setDragging(true); e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = (e) => { if (drag.current) setPan({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y }); };
  const onUp = () => { drag.current = null; setDragging(false); };
  const reset = () => { setZoom(1); setPan({ x: 0, y: 0 }); setSel(null); };
  const fit = () => { setZoom(Math.min(1, 520 / Math.max(height, 1))); setPan({ x: 0, y: 0 }); };

  return (
    <>
      <div className={'flow-wrap' + (dragging ? ' dragging' : '')}>
        <div className="flow-tools">
          <button onClick={() => setZoom((z) => Math.min(2, +(z + 0.15).toFixed(2)))} title="Zoom in">+</button>
          <button onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.15).toFixed(2)))} title="Zoom out">−</button>
          <button onClick={fit} title="Fit height" style={{ fontSize: 12 }}>fit</button>
          <button onClick={reset} title="Reset" style={{ fontSize: 12 }}>⟲</button>
        </div>

        <svg width="100%" height="560" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-secondary)" />
            </marker>
            <marker id="arrow-hl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary)" />
            </marker>
          </defs>

          <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
            {paths.map((p) => {
              const hl = sel && (p.from === sel.id || p.to === sel.id);
              const dim = sel && !hl;
              return (
                <g key={p.id} opacity={dim ? 0.18 : 1}>
                  <path d={p.d} fill="none" stroke={hl ? 'var(--primary)' : 'var(--text-secondary)'}
                    strokeWidth={hl ? 2.2 : 1.3} strokeOpacity={hl ? 1 : 0.55}
                    markerEnd={hl ? 'url(#arrow-hl)' : 'url(#arrow)'} />
                  {p.label && (
                    <>
                      <rect x={p.labelAt.x - p.label.length * 3.3 - 5} y={p.labelAt.y - 11}
                        width={p.label.length * 6.6 + 10} height={16} rx="5" fill="var(--surface)" stroke="var(--border)" />
                      <text x={p.labelAt.x} y={p.labelAt.y + 1} textAnchor="middle" fontSize="10.5" fontWeight="700"
                        fill={hl ? 'var(--primary)' : 'var(--text-secondary)'}>{p.label}</text>
                    </>
                  )}
                </g>
              );
            })}

            {laid.map((n) => (
              <NodeShape key={n.id} n={n} selected={sel && sel.id === n.id}
                dim={neighbours && !neighbours.has(n.id)}
                onSelect={(x) => setSel(sel && sel.id === x.id ? null : x)} />
            ))}
          </g>
        </svg>

        <div className="flow-legend">
          <span><i style={{ background: 'var(--primary)' }} /> Decision</span>
          <span><i style={{ background: 'var(--secondary)' }} /> Start / End</span>
          <span><i style={{ background: 'var(--fail)' }} /> Wait / Delay</span>
          <span><i style={{ background: 'var(--text-secondary)' }} /> Process step</span>
          <span>· drag to pan, click a node to trace it</span>
        </div>
      </div>

      {orphans.length > 0 && (
        <div className="card panel orphan-panel">
          <h4>Unconnected nodes ({orphans.length})</h4>
          <p className="orphan-note">
            These shapes exist in the source diagram for this section but no line in the export connects
            them to anything. They are shown as-is — no edge has been invented to join them up.
          </p>
          {orphans.map((n) => (
            <div className="orphan-node" key={n.id}>
              <span className={'pill ' + (n.shape === 'decision' ? 'flow' : '')}>{n.shape}</span>
              <span>{n.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="card panel flow-detail">
        {sel ? (
          <>
            <h4>{sel.shape === 'decision' ? 'Decision' : sel.shape === 'terminator' ? 'Start / End' : sel.shape === 'delay' ? 'Wait condition' : 'Process step'}</h4>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{sel.text}</div>
            {(sel.detail || []).map((d, i) => <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{d}</div>)}
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
              {topic.edges.filter((e) => e.from === sel.id).length} outgoing ·{' '}
              {topic.edges.filter((e) => e.to === sel.id).length} incoming
              {topic.edges.filter((e) => e.from === sel.id).map((e) => (
                <div key={e.lineId}>→ {e.label ? <b>{e.label}: </b> : ''}{label.get(e.to) || '—'}</div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {laid.length} nodes and {paths.length} connections, all read from the source export.
            Click any node to trace its branches.
          </div>
        )}
      </div>

      <div className="card panel" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h4 style={{ margin: 0 }}>Source data</h4>
          <span className="pill">{topic.nodes.length} decision/end/delay</span>
          <span className="pill">{topic.contextNodes.length} connected process</span>
          <span className="pill">{topic.edges.length} edges</span>
          {orphans.length > 0 && <span className="pill thin">{orphans.length} unconnected</span>}
          <button className="btn ghost sm" style={{ marginLeft: 'auto' }} onClick={() => setShowData((s) => !s)}>
            {showData ? 'Hide extracted data' : 'Show extracted data'}
          </button>
          {onOpenMap && <button className="btn ghost sm" onClick={onOpenMap}>View original process map</button>}
        </div>
        {showData && (
          <div className="edge-table">
            {topic.edges.map((e) => (
              <div className="edge-row" key={e.lineId + e.from + e.to}>
                <code>{e.lineId}</code>
                <span>{label.get(e.from) || e.from}</span>
                <b>{e.label ? `—${e.label}→` : '—→'}</b>
                <span>{label.get(e.to) || e.to}</span>
              </div>
            ))}
            {topic.edges.length === 0 && <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No connections captured for this section.</div>}
          </div>
        )}
      </div>
    </>
  );
}
