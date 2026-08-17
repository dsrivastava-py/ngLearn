/*
 * Stage 1 — join the Lucidchart CSV (structure) with the JSON (shape classes +
 * line connectivity) and emit an ORDERED per-section step list.
 *
 * Output: build/parsed.json      machine-readable, consumed by build-content.js
 *         build/steps-dump.md    human-readable, used to author lesson grouping
 *         src/data/unsorted.json unresolved rows (never guessed into a section)
 *
 * Run: node scripts/parse.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'Nurturing green.csv');
const JSON_PATH = path.join(ROOT, 'Nurturing green.json');
const BUILD_DIR = path.join(ROOT, 'build');
const DATA_DIR = path.join(ROOT, 'ng-learn', 'src', 'data');

// ---------------------------------------------------------------- CSV parser
function parseCsv(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') { inQuotes = true; continue; }
    if (ch === ',') { row.push(field); field = ''; continue; }
    if (ch === '\r') continue;
    if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
    field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const strip = (s) => (s == null ? '' : String(s).replace(/​/g, '').trim());
const clean = (s) => strip(s).replace(/\s+/g, ' ');

// ------------------------------------------------------------------- read in
const csvRows = parseCsv(fs.readFileSync(CSV_PATH, 'utf8'));
const header = csvRows[0].map((h) => h.trim());
const col = {};
header.forEach((h, i) => { if (!(h in col)) col[h] = i; });
const textAreaCols = header
  .map((h, i) => ({ h, i }))
  .filter((x) => /^Text Area \d+$/.test(x.h))
  .sort((a, b) => Number(a.h.slice(10)) - Number(b.h.slice(10)))
  .map((x) => x.i);

const rows = [];
for (let r = 1; r < csvRows.length; r++) {
  const raw = csvRows[r];
  if (!raw || raw.length < 3) continue;
  const id = strip(raw[col['Id']]);
  if (!id) continue;
  const texts = textAreaCols.map((i) => clean(raw[i])).filter(Boolean);
  rows.push({
    id,
    idNum: Number(id),
    name: strip(raw[col['Name']]),
    containedBy: strip(raw[col['Contained By']]),
    shapeId: strip(raw[col['Shape ID']]),
    texts,
    text: texts[0] || '',
  });
}

const jsonDoc = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const jsonShapes = jsonDoc.pages[0].items.shapes || [];
const jsonLines = jsonDoc.pages[0].items.lines || [];
const shapeById = new Map(jsonShapes.map((s) => [strip(s.id), s]));

const csvShapeIds = new Set(rows.map((r) => r.shapeId).filter(Boolean));
const joined = jsonShapes.filter((s) => csvShapeIds.has(strip(s.id))).length;

// ------------------------------------------------ section resolution by chain
const byRowId = new Map(rows.map((r) => [r.id, r]));

const SECTION_FIX = {
  'Ouick Com': 'Quick Com',
  'Purchase Planing': 'Purchase Planning',
  'Dicount Process': 'Discount Process',
};
const fixSection = (n) => SECTION_FIX[n] || n;

const isRealFrame = (r) =>
  r.name === 'SparkFrameBlock' && r.text && r.text.toLowerCase() !== 'add title';

function resolveFrame(row) {
  let cur = row;
  for (let depth = 0; depth < 20; depth++) {
    const parentId = cur.containedBy;
    if (!parentId) return null;
    const parent = byRowId.get(parentId);
    if (!parent) return null;
    if (parent.name === 'SparkFrameBlock') return isRealFrame(parent) ? parent : null;
    cur = parent;
  }
  return null;
}

// --------------------------------------------------------- type classification
const VIDEO_NAMES = new Set(['Process', 'Preparation', 'Database', 'Internal storage', 'Manual input', 'Display', 'Block']);
const FLOW_NAMES = new Set(['Decision', 'Terminator', 'Delay']);
const NOTE_NAMES = new Set(['Sticky note', 'Text', 'MinimalTextBlock']);
const IMAGE_NAMES = new Set(['User Image']);
const SKIP_NAMES = new Set(['Document', 'Page', 'Line', 'SparkFrameBlock']);

const flowShape = (name) => (name === 'Decision' ? 'decision' : name === 'Terminator' ? 'terminator' : 'delay');

function classify(name) {
  if (VIDEO_NAMES.has(name)) return 'step';
  if (FLOW_NAMES.has(name)) return 'flow';
  if (NOTE_NAMES.has(name)) return 'note';
  if (IMAGE_NAMES.has(name)) return 'image';
  return null;
}

// ------------------------------------------------------------- build sections
const sectionOrder = [];
const sections = new Map();

function getSection(frameRow) {
  const nameClean = fixSection(frameRow.text);
  if (!sections.has(nameClean)) {
    const sec = {
      id: 'sec-' + nameClean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      rawLabel: nameClean,
      firstRowId: frameRow.idNum,
      items: [],
    };
    sections.set(nameClean, sec);
    sectionOrder.push(sec);
  }
  const sec = sections.get(nameClean);
  sec.firstRowId = Math.min(sec.firstRowId, frameRow.idNum);
  return sec;
}

const sorted = rows.slice().sort((a, b) => a.idNum - b.idNum);
const unsorted = [];
const stats = { skipped: 0, resolved: 0, unresolved: 0, ignoredShapeNames: {} };

for (const row of sorted) {
  if (SKIP_NAMES.has(row.name)) { stats.skipped++; continue; }
  const kind = classify(row.name);
  if (!kind) {
    stats.skipped++;
    stats.ignoredShapeNames[row.name] = (stats.ignoredShapeNames[row.name] || 0) + 1;
    continue;
  }
  if (!row.text) { stats.skipped++; continue; }

  const frame = resolveFrame(row);
  if (!frame) {
    stats.unresolved++;
    unsorted.push({ rowId: row.id, shapeId: row.shapeId, name: row.name, kind, text: row.text, extraText: row.texts.slice(1), containedBy: row.containedBy });
    continue;
  }
  stats.resolved++;
  getSection(frame).items.push({
    rowId: row.id,
    rowNum: row.idNum,
    shapeId: row.shapeId,
    shapeName: row.name,
    kind,
    text: row.text,
    extraText: row.texts.slice(1),
  });
}

// ------------------------------------------------------- real edges (JSON only)
// PROBLEM 3: connectivity comes exclusively from items.lines[].endpointN.connectedTo.
// Nothing is inferred, nothing is merged in from elsewhere.
const rawEdges = [];
for (const ln of jsonLines) {
  const from = strip(ln.endpoint1 && ln.endpoint1.connectedTo);
  const to = strip(ln.endpoint2 && ln.endpoint2.connectedTo);
  if (!from || !to) continue;
  const label = ((ln.textAreas || []).map((t) => clean(t.text)).filter(Boolean)[0]) || '';
  rawEdges.push({ lineId: strip(ln.id), from, to, label });
}

// ------------------------------------------------------------ order + assemble
sectionOrder.sort((a, b) => a.firstRowId - b.firstRowId);

const outSections = sectionOrder.map((sec) => {
  const own = new Set(sec.items.map((i) => i.shapeId).filter(Boolean));
  const edges = rawEdges
    .filter((e) => own.has(e.from) && own.has(e.to) && e.from !== e.to)
    .map((e) => ({ from: e.from, to: e.to, label: e.label, lineId: e.lineId }));

  // ordering: connected chains stay contiguous and in flow order.
  // key = (component's smallest row id, longest-path rank, row id)
  const flowables = sec.items.filter((i) => i.kind === 'step' || i.kind === 'flow');
  const idx = new Map(flowables.map((i) => [i.shapeId, i]));
  const liveEdges = edges.filter((e) => idx.has(e.from) && idx.has(e.to));

  const parent = new Map(flowables.map((i) => [i.shapeId, i.shapeId]));
  const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent.set(ra, rb); };
  liveEdges.forEach((e) => union(e.from, e.to));

  const compMin = new Map();
  flowables.forEach((i) => {
    const r = find(i.shapeId);
    compMin.set(r, Math.min(compMin.get(r) ?? Infinity, i.rowNum));
  });

  const indeg = new Map(flowables.map((i) => [i.shapeId, 0]));
  const out = new Map(flowables.map((i) => [i.shapeId, []]));
  liveEdges.forEach((e) => { indeg.set(e.to, indeg.get(e.to) + 1); out.get(e.from).push(e.to); });
  const rank = new Map();
  const q = flowables.filter((i) => indeg.get(i.shapeId) === 0).map((i) => i.shapeId);
  q.forEach((id) => rank.set(id, 0));
  const deg = new Map(indeg);
  for (let h = 0; h < q.length; h++) {
    for (const nx of out.get(q[h])) {
      rank.set(nx, Math.max(rank.get(nx) ?? 0, (rank.get(q[h]) ?? 0) + 1));
      deg.set(nx, deg.get(nx) - 1);
      if (deg.get(nx) === 0) q.push(nx);
    }
  }
  let maxRank = 0; rank.forEach((v) => { maxRank = Math.max(maxRank, v); });
  flowables.forEach((i) => { if (!rank.has(i.shapeId)) rank.set(i.shapeId, maxRank + 1); });

  const ordered = flowables.slice().sort((a, b) => {
    const ca = compMin.get(find(a.shapeId));
    const cb = compMin.get(find(b.shapeId));
    if (ca !== cb) return ca - cb;
    const ra = rank.get(a.shapeId), rb = rank.get(b.shapeId);
    if (ra !== rb) return ra - rb;
    return a.rowNum - b.rowNum;
  });
  ordered.forEach((it, i) => { it.seq = i; });

  // notes / images attach to the nearest preceding ordered item by row id
  const attach = (items) => {
    const orphans = [];
    for (const it of items) {
      let target = null;
      for (const o of ordered) if (o.rowNum <= it.rowNum) target = o; else break;
      if (!target) target = ordered[0];
      if (!target) { orphans.push(it); continue; }
      (target.attached = target.attached || []).push(it);
    }
    return orphans;
  };
  const orphanNotes = attach(sec.items.filter((i) => i.kind === 'note').sort((a, b) => a.rowNum - b.rowNum));
  const orphanImages = attach(sec.items.filter((i) => i.kind === 'image').sort((a, b) => a.rowNum - b.rowNum));

  const connectedShapeIds = new Set();
  liveEdges.forEach((e) => { connectedShapeIds.add(e.from); connectedShapeIds.add(e.to); });

  return {
    id: sec.id,
    rawLabel: sec.rawLabel,
    firstRowId: sec.firstRowId,
    edges,
    steps: ordered.map((it) => ({
      seq: it.seq,
      rowId: it.rowId,
      shapeId: it.shapeId,
      shapeName: it.shapeName,
      kind: it.kind,
      flowShape: it.kind === 'flow' ? flowShape(it.shapeName) : null,
      connected: connectedShapeIds.has(it.shapeId),
      text: it.text,
      extraText: it.extraText,
      notes: (it.attached || []).filter((a) => a.kind === 'note').map((a) => ({ kind: a.shapeName, text: a.text, extra: a.extraText })),
      images: (it.attached || []).filter((a) => a.kind === 'image').map((a) => ({ shapeId: a.shapeId, text: a.text })),
    })),
    sectionNotes: orphanNotes.map((n) => ({ kind: n.shapeName, text: n.text, extra: n.extraText })),
    sectionImages: orphanImages.map((n) => ({ shapeId: n.shapeId, text: n.text })),
  };
});

// -------------------------------------------------------------- empty frames
const emptyFrames = [];
const seenFrameName = new Set();
sorted.forEach((r) => {
  if (!isRealFrame(r)) return;
  const n = fixSection(r.text);
  if (seenFrameName.has(n)) return;
  seenFrameName.add(n);
  if (!sections.has(n)) emptyFrames.push({ name: n, rowId: r.id, containedBy: r.containedBy || null });
});

// -------------------------------------------------------------------- output
fs.mkdirSync(BUILD_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

const parsed = {
  stats: {
    csvRows: rows.length,
    jsonShapes: jsonShapes.length,
    jsonLines: jsonLines.length,
    shapeIdJoinMatched: joined,
    resolvedItems: stats.resolved,
    unresolvedItems: stats.unresolved,
    sectionCount: outSections.length,
    rawEdges: rawEdges.length,
    edgesInSections: outSections.reduce((n, s) => n + s.edges.length, 0),
  },
  emptySections: emptyFrames,
  sections: outSections,
};
fs.writeFileSync(path.join(BUILD_DIR, 'parsed.json'), JSON.stringify(parsed, null, 2));

fs.writeFileSync(path.join(DATA_DIR, 'unsorted.json'), JSON.stringify({
  count: unsorted.length,
  byKind: unsorted.reduce((a, u) => { a[u.kind] = (a[u.kind] || 0) + 1; return a; }, {}),
  items: unsorted,
}, null, 2));

// human-readable dump used to author the lesson grouping
const lines = ['# Ordered steps per section', ''];
outSections.forEach((s, si) => {
  lines.push(`## ${si + 1}. ${s.rawLabel}  (id ${s.id})`);
  lines.push(`steps=${s.steps.length} edges=${s.edges.length} sectionNotes=${s.sectionNotes.length}`);
  lines.push('');
  s.steps.forEach((st) => {
    const tag = st.kind === 'flow' ? st.flowShape.toUpperCase() : st.shapeName;
    const link = st.connected ? '' : ' [no-edges]';
    lines.push(`${String(st.seq).padStart(3)} | ${tag}${link} | ${st.text}`);
    st.notes.forEach((n) => lines.push(`      note: ${n.text.slice(0, 300)}`));
  });
  const labelled = s.edges.filter((e) => e.label);
  if (labelled.length) {
    lines.push('');
    lines.push('  labelled edges:');
    const byId = new Map(s.steps.map((x) => [x.shapeId, x]));
    labelled.forEach((e) => {
      const a = byId.get(e.from), b = byId.get(e.to);
      lines.push(`   ${a ? a.seq : '?'} -[${e.label}]-> ${b ? b.seq : '?'}  (${a ? a.text.slice(0, 40) : '?'} → ${b ? b.text.slice(0, 40) : '?'})`);
    });
  }
  lines.push('');
});
fs.writeFileSync(path.join(BUILD_DIR, 'steps-dump.md'), lines.join('\n'));

console.log('CSV rows                :', rows.length);
console.log('Shape ID join           :', joined, '/', jsonShapes.length, `(${((joined / jsonShapes.length) * 100).toFixed(1)}%)`);
console.log('Resolved / unresolved   :', stats.resolved, '/', stats.unresolved);
console.log('Sections                :', outSections.length);
console.log('JSON edges total        :', rawEdges.length, '| kept inside a section:', parsed.stats.edgesInSections);
console.log('');
outSections.forEach((s, i) => {
  const steps = s.steps.filter((x) => x.kind === 'step').length;
  const flow = s.steps.filter((x) => x.kind === 'flow').length;
  const orphanFlow = s.steps.filter((x) => x.kind === 'flow' && !x.connected).length;
  console.log(
    String(i + 1).padStart(3) + '. ' + s.rawLabel.padEnd(28) +
    ` steps=${String(steps).padStart(3)} flow=${String(flow).padStart(2)}` +
    ` (unconnected flow nodes=${orphanFlow})` +
    ` edges=${String(s.edges.length).padStart(3)}`
  );
});
console.log('\nEmpty frames:', emptyFrames.map((f) => f.name).join(', '));
console.log('Ignored shape names:', JSON.stringify(stats.ignoredShapeNames));
