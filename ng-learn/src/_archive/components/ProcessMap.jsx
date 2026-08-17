import { useRef, useState } from 'react';

/*
 * Global reference screen: the original, unedited Lucidchart export, full canvas.
 * There is no data linking a section to a region of this file, so it is never
 * cropped or filtered — it exists so any generated flowchart can be checked
 * against the real diagram.
 */
const SRC = '/original-process-map.svg';

export default function ProcessMap({ onBack }) {
  const [zoom, setZoom] = useState(0.35);
  const [loaded, setLoaded] = useState(false);
  const box = useRef(null);
  const drag = useRef(null);

  const onDown = (e) => {
    if (!box.current) return;
    drag.current = { x: e.clientX, y: e.clientY, l: box.current.scrollLeft, t: box.current.scrollTop };
    box.current.style.cursor = 'grabbing';
  };
  const onMove = (e) => {
    if (!drag.current || !box.current) return;
    box.current.scrollLeft = drag.current.l - (e.clientX - drag.current.x);
    box.current.scrollTop = drag.current.t - (e.clientY - drag.current.y);
  };
  const onUp = () => { drag.current = null; if (box.current) box.current.style.cursor = 'grab'; };

  return (
    <>
      <div className="detail-head">
        <div className="grow">
          <div className="section-label">Reference</div>
          <h1 className="page-title" style={{ margin: '4px 0 8px' }}>Original Process Map</h1>
          <p className="page-sub" style={{ margin: 0 }}>
            The complete, unedited Lucidchart export (<code>Nurturing green.svg</code>), full canvas.
            Use it to verify any generated flowchart against the real diagram.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a className="btn ghost sm" href={SRC} target="_blank" rel="noreferrer">Open in new tab</a>
          <a className="btn ghost sm" href={SRC} download="Nurturing-green-process-map.svg">Download</a>
          <button className="btn sm" onClick={onBack}>Back</button>
        </div>
      </div>

      <div className="map-tools">
        <button className="btn ghost sm" onClick={() => setZoom((z) => Math.max(0.05, +(z - 0.1).toFixed(2)))}>−</button>
        <span className="progress-val">{Math.round(zoom * 100)}%</span>
        <button className="btn ghost sm" onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}>+</button>
        <button className="btn ghost sm" onClick={() => setZoom(0.35)}>Reset</button>
        <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Drag to pan · 10.6 MB file, first load takes a moment</span>
      </div>

      <div className="map-frame" ref={box} onPointerDown={onDown} onPointerMove={onMove}
        onPointerUp={onUp} onPointerLeave={onUp}>
        {!loaded && (
          <div className="map-loading">
            <div className="spinner" />
            Loading the full diagram…
          </div>
        )}
        <img src={SRC} alt="Nurturing Green original process map"
          onLoad={() => setLoaded(true)}
          style={{ width: `${zoom * 100}%`, minWidth: `${zoom * 100}%`, display: loaded ? 'block' : 'none' }} />
      </div>
    </>
  );
}
