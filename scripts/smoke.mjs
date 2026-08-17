// Exercises the pure app logic against every course so layout/quiz/data
// problems surface here rather than in the browser.
import { readFileSync } from 'fs';
import { layoutFlow } from '../ng-learn/src/lib/layout.js';
import { buildQuiz } from '../ng-learn/src/lib/quiz.js';

const content = JSON.parse(readFileSync(new URL('../ng-learn/src/data/content.json', import.meta.url)));
const sections = content.sections;

const fail = (m) => { throw new Error(m); };
let flowOk = 0, overlaps = 0, biggest = null, invented = 0;
const quizWarn = [];

for (const s of sections) {
  if (!s.title || !s.rawLabel) fail(`${s.id}: missing title/rawLabel`);
  if (s.videoCount < 1) fail(`${s.id}: no lessons`);
  if (s.videoCount > 8 && !['sec-npd', 'sec-inward-logistics', 'sec-deals-ads', 'sec-sales-outward', 'sec-rtv', 'sec-communication-process'].includes(s.id)) {
    quizWarn.push(`${s.title}: ${s.videoCount} lessons — above the 3–8 target`);
  }

  const q = buildQuiz(s, sections);
  if (q.length < 3 && s.videoCount >= 3) quizWarn.push(`${s.title}: only ${q.length} questions`);
  for (const qq of q) {
    if (qq.answer < 0 || qq.answer > 3) fail(`${s.title}: bad answer index ${qq.answer}`);
    if (new Set(qq.options).size !== qq.options.length) quizWarn.push(`${s.title}: duplicate options`);
  }

  const flow = s.topics.find((t) => t.type === 'flowchart');
  if (!flow) continue;

  // every edge endpoint must be a node that exists in this section
  const ids = new Set([...flow.nodes, ...flow.contextNodes].map((n) => n.id));
  for (const e of flow.edges) {
    if (!ids.has(e.from) || !ids.has(e.to)) fail(`${s.title}: edge ${e.lineId} points outside the section`);
    if (!e.lineId) invented++;
  }
  // standalone nodes must genuinely have no edges
  for (const id of flow.standalone) {
    if (flow.edges.some((e) => e.from === id || e.to === id)) fail(`${s.title}: node ${id} marked standalone but has edges`);
  }

  const drawn = [...flow.nodes, ...flow.contextNodes].filter((n) => !flow.standalone.includes(n.id));
  const out = layoutFlow(drawn, flow.edges);
  if (out.nodes.length !== drawn.length) fail(`${s.title}: lost nodes in layout`);
  if (!Number.isFinite(out.width) || !Number.isFinite(out.height)) fail(`${s.title}: bad canvas`);
  if (out.paths.length !== flow.edges.length) fail(`${s.title}: layout drew ${out.paths.length} paths for ${flow.edges.length} edges`);
  for (let i = 0; i < out.nodes.length; i++) {
    for (let j = i + 1; j < out.nodes.length; j++) {
      const a = out.nodes[i], b = out.nodes[j];
      if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) overlaps++;
    }
  }
  if (!biggest || out.height > biggest.h) biggest = { name: s.title, h: out.height, w: out.width, n: drawn.length, e: out.paths.length };
  flowOk++;
}

if (invented) fail(`${invented} edges have no source lineId`);

const lessonCounts = sections.map((s) => s.videoCount);
console.log('courses             :', sections.length);
console.log('lessons             :', lessonCounts.reduce((a, b) => a + b, 0),
  `(min ${Math.min(...lessonCounts)}, max ${Math.max(...lessonCounts)}, median ${lessonCounts.slice().sort((a, b) => a - b)[Math.floor(lessonCounts.length / 2)]})`);
console.log('flowcharts          :', flowOk, '| node overlaps:', overlaps, '| every edge carries a source lineId');
console.log('largest chart       :', biggest.name, `${biggest.n} nodes / ${biggest.e} edges / ${Math.round(biggest.w)}x${Math.round(biggest.h)}px`);
console.log('quizzes             :', sections.map((s) => buildQuiz(s, sections).length).join(','));
console.log('warnings            :', quizWarn.length ? quizWarn : 'none');
console.log('flagged unclear     :', sections.filter((s) => s.needsClarification).map((s) => s.rawLabel).join(', ') || 'none');
