/*
 * Stage 3 — merge build/parsed.json with scripts/curation.js into the single
 * file the front-end renders from, and emit the flowchart debug artifact.
 *
 * Fails loudly if a section is uncurated, or if any work step is unassigned or
 * assigned to two lessons. Coverage is the whole point: no content may vanish
 * into a merge, and no lesson may exist without steps behind it.
 *
 * Run: node scripts/build-content.js   (after scripts/parse.js)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const parsed = JSON.parse(fs.readFileSync(path.join(ROOT, 'build', 'parsed.json'), 'utf8'));
const curation = require('./curation.js');
const OUT_DIR = path.join(ROOT, 'ng-learn', 'src', 'data');

// --------------------------------------------------- diagram-metadata detection
// Shapes that carry ownership / SLA / cadence rather than a task to demonstrate.
const RESP = /^(primary|secondary)\s+responsibility/i;
const SLA = /^sla\s*[-–—:?]?\s*/i;
// "Every alternative day and deal/special days. SLA - within 1 hour" — the SLA
// marker is not always leading, so match it anywhere.
const SLA_INLINE = /\bsla\s*[-–—:]/i;
const REFERENCE = /^attach\b/i;
const CADENCE = /^(daily|weekly|monthly|fortnightly|every|once in every|by \d|by monday|within \+?\d|t\+\d|as and when|repeat weekly|duration \d|timelines|each saturday|on monthly basis|on tentative|reviewed monthly|\d+(st|nd|rd|th) (of )?every month)/i;
// guard: real work steps can begin with a cadence word ("Weekly Stock Review",
// "Within 24 hours of sales invoice generation")
const CADENCE_EXCLUDE = /\b(review|check|process|plan|planning|stock|report|invoice)\b/i;

function metaKind(text) {
  if (RESP.test(text)) return 'responsibility';
  if (SLA.test(text) || SLA_INLINE.test(text)) return 'sla';
  if (REFERENCE.test(text)) return 'reference';
  if (text.length <= 60 && CADENCE.test(text) && !CADENCE_EXCLUDE.test(text)) return 'cadence';
  return null;
}

const byId = new Map(curation.map((c) => [c.id, c]));
const problems = [];

const sections = parsed.sections.map((sec, si) => {
  const cur = byId.get(sec.id);
  if (!cur) {
    problems.push(`${sec.id}: no curation entry`);
    return null;
  }

  const bySeq = new Map(sec.steps.map((s) => [s.seq, s]));
  const explicitMeta = new Set(cur.metaSteps || []);

  // ---------------------------------------------------------------- course info
  const courseInfo = { responsibility: [], sla: [], cadence: [], reference: [] };
  const workSteps = [];
  sec.steps.forEach((s) => {
    if (s.kind !== 'step') return;
    const kind = explicitMeta.has(s.seq) ? 'reference' : metaKind(s.text);
    if (kind) {
      courseInfo[kind].push({ text: s.text, notes: s.notes });
      return;
    }
    workSteps.push(s);
  });

  // ------------------------------------------------------------- coverage check
  const assigned = new Map();
  (cur.lessons || []).forEach((l, li) => {
    l.steps.forEach((seq) => {
      if (!bySeq.has(seq)) problems.push(`${sec.id}: lesson "${l.title}" references seq ${seq}, which does not exist`);
      else if (bySeq.get(seq).kind !== 'step') problems.push(`${sec.id}: lesson "${l.title}" references seq ${seq}, a ${bySeq.get(seq).flowShape} node (flowchart-only)`);
      else if (explicitMeta.has(seq) || metaKind(bySeq.get(seq).text)) problems.push(`${sec.id}: lesson "${l.title}" references seq ${seq}, which is course metadata`);
      if (assigned.has(seq)) problems.push(`${sec.id}: seq ${seq} assigned to both "${assigned.get(seq)}" and "${l.title}"`);
      assigned.set(seq, l.title);
    });
    if (!l.steps.length) problems.push(`${sec.id}: lesson "${l.title}" has no steps`);
  });
  const missed = workSteps.filter((s) => !assigned.has(s.seq));
  if (missed.length) {
    problems.push(`${sec.id}: ${missed.length} unassigned work step(s): ` +
      missed.map((s) => `${s.seq}="${s.text.slice(0, 46)}"`).join(' | '));
  }

  // ------------------------------------------------------------------- lessons
  const topics = (cur.lessons || []).map((l, li) => {
    const steps = l.steps
      .map((seq) => bySeq.get(seq))
      .filter((s) => s && s.kind === 'step')
      .sort((a, b) => a.seq - b.seq);
    return {
      id: `${sec.id}-l${li + 1}`,
      type: 'video',
      title: l.title,
      stepCount: steps.length,
      steps: steps.map((s) => ({
        text: s.text,
        detail: s.extraText,
        shapeName: s.shapeName,
        shapeId: s.shapeId,
        rowId: s.rowId,
      })),
      notes: steps.flatMap((s) => s.notes.map((n) => ({ ...n, step: s.text }))),
      images: steps.flatMap((s) => s.images.map((im) => ({ ...im, step: s.text }))),
    };
  });

  // ----------------------------------------------------------------- flowchart
  // Nodes: every Decision / Terminator / Delay of the section. Context process
  // nodes are added ONLY where a real edge connects them to one of those nodes.
  const flowNodes = sec.steps.filter((s) => s.kind === 'flow');
  const flowIds = new Set(flowNodes.map((s) => s.shapeId));
  const touching = sec.edges.filter((e) => flowIds.has(e.from) || flowIds.has(e.to));

  const contextIds = new Set();
  touching.forEach((e) => {
    if (!flowIds.has(e.from)) contextIds.add(e.from);
    if (!flowIds.has(e.to)) contextIds.add(e.to);
  });
  const contextNodes = sec.steps.filter((s) => s.kind === 'step' && contextIds.has(s.shapeId));

  const nodeIds = new Set([...flowIds, ...contextNodes.map((s) => s.shapeId)]);
  const flowEdges = touching.filter((e) => nodeIds.has(e.from) && nodeIds.has(e.to));

  const degree = new Map();
  flowEdges.forEach((e) => {
    degree.set(e.from, (degree.get(e.from) || 0) + 1);
    degree.set(e.to, (degree.get(e.to) || 0) + 1);
  });

  let flowTopic = null;
  if (flowNodes.length) {
    flowTopic = {
      id: `${sec.id}-flow`,
      type: 'flowchart',
      title: `${cur.title} — Decision Flow`,
      nodes: flowNodes.map((s) => ({
        id: s.shapeId,
        rowId: s.rowId,
        shape: s.flowShape,
        text: s.text,
        detail: s.extraText,
        edgeCount: degree.get(s.shapeId) || 0,
      })),
      contextNodes: contextNodes.map((s) => ({
        id: s.shapeId,
        rowId: s.rowId,
        shape: 'process',
        text: s.text,
        edgeCount: degree.get(s.shapeId) || 0,
      })),
      edges: flowEdges.map((e) => ({ from: e.from, to: e.to, label: e.label, lineId: e.lineId })),
      standalone: flowNodes.filter((s) => !degree.get(s.shapeId)).map((s) => s.shapeId),
      notes: flowNodes.flatMap((s) => s.notes.map((n) => ({ ...n, step: s.text }))),
      images: flowNodes.flatMap((s) => s.images.map((im) => ({ ...im, step: s.text }))),
    };
    topics.push(flowTopic);
  }

  return {
    id: sec.id,
    order: si + 1,
    title: cur.title,
    rawLabel: sec.rawLabel,
    summary: cur.summary || null,
    needsClarification: !!cur.needsClarification,
    clarificationNote: cur.clarificationNote || null,
    topicCount: topics.length,
    videoCount: topics.filter((t) => t.type === 'video').length,
    flowchartCount: flowTopic ? 1 : 0,
    rawShapeCount: sec.steps.length,
    workStepCount: workSteps.length,
    courseInfo,
    sectionNotes: sec.sectionNotes,
    sectionImages: sec.sectionImages,
    topics,
  };
}).filter(Boolean);

// --------------------------------------------------------------------- output
if (problems.length) {
  console.error('COVERAGE PROBLEMS (' + problems.length + '):');
  problems.forEach((p) => console.error('  - ' + p));
  process.exit(1);
}

const content = {
  generatedFrom: ['Nurturing green.csv', 'Nurturing green.json'],
  stats: {
    ...parsed.stats,
    lessonCount: sections.reduce((n, s) => n + s.videoCount, 0),
    flowchartCount: sections.reduce((n, s) => n + s.flowchartCount, 0),
    workStepCount: sections.reduce((n, s) => n + s.workStepCount, 0),
    flowchartEdges: sections.reduce((n, s) => n + (s.topics.find((t) => t.type === 'flowchart')?.edges.length || 0), 0),
    standaloneFlowNodes: sections.reduce((n, s) => n + (s.topics.find((t) => t.type === 'flowchart')?.standalone.length || 0), 0),
  },
  emptySections: parsed.emptySections,
  sections,
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'content.json'), JSON.stringify(content, null, 2));

// flowchart debug artifact — node list + edge list per section, straight from the data
const debug = sections
  .map((s) => {
    const f = s.topics.find((t) => t.type === 'flowchart');
    if (!f) return { sectionId: s.id, title: s.title, flowchart: null, reason: 'no Decision/Terminator/Delay shapes in this frame' };
    const label = new Map([...f.nodes, ...f.contextNodes].map((n) => [n.id, n.text]));
    return {
      sectionId: s.id,
      title: s.title,
      decisionNodes: f.nodes.map((n) => ({ shapeId: n.id, rowId: n.rowId, shape: n.shape, text: n.text, edges: n.edgeCount })),
      contextNodes: f.contextNodes.map((n) => ({ shapeId: n.id, rowId: n.rowId, text: n.text, edges: n.edgeCount })),
      edges: f.edges.map((e) => ({ lineId: e.lineId, from: e.from, to: e.to, label: e.label, fromText: label.get(e.from), toText: label.get(e.to) })),
      standalone: f.standalone.map((id) => label.get(id)),
    };
  });
fs.writeFileSync(path.join(ROOT, 'build', 'flowchart-debug.json'), JSON.stringify(debug, null, 2));

console.log('Sections            :', sections.length);
console.log('Lessons (videos)    :', content.stats.lessonCount, 'from', content.stats.workStepCount, 'raw work steps');
console.log('Flowcharts          :', content.stats.flowchartCount, '| real edges drawn:', content.stats.flowchartEdges,
  '| standalone (unconnected) nodes:', content.stats.standaloneFlowNodes);
console.log('');
console.log('  # lessons  steps  flow(nodes/edges/standalone)  course');
sections.forEach((s) => {
  const f = s.topics.find((t) => t.type === 'flowchart');
  console.log(
    String(s.order).padStart(3) + '  ' +
    String(s.videoCount).padStart(6) + '  ' +
    String(s.workStepCount).padStart(5) + '  ' +
    (f ? `${f.nodes.length}/${f.edges.length}/${f.standalone.length}` : '—').padStart(27) + '  ' +
    s.title + (s.needsClarification ? '  [NEEDS CLARIFICATION]' : '')
  );
});
console.log('\nDebug artifact: build/flowchart-debug.json');
