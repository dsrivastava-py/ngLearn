/* Server-renders every screen for every course to catch render-time crashes. */
import { renderToString } from 'react-dom/server';
import content from '../src/data/content.json';
import unsorted from '../src/data/unsorted.json';
import Login from '../src/components/Login.jsx';
import CourseList from '../src/components/CourseList.jsx';
import CourseDetail from '../src/components/CourseDetail.jsx';
import TopicView from '../src/components/TopicView.jsx';
import Quiz from '../src/components/Quiz.jsx';
import Completion from '../src/components/Completion.jsx';
import ProcessMap from '../src/components/ProcessMap.jsx';

const sections = content.sections;
const noop = () => {};
const prog = { done: [], quizPassed: false, completedAt: null };
let screens = 0;
const counts = {};

const check = (label, el) => {
  const html = renderToString(el);
  screens++;
  counts[label] = (counts[label] || 0) + 1;
  if (html.length < 80) throw new Error(`${label} rendered almost nothing (${html.length} chars)`);
  if (/undefined|NaN/.test(html.replace(/undefined-/g, ''))) {
    const m = html.match(/.{0,60}(undefined|NaN).{0,60}/);
    throw new Error(`${label} leaked a placeholder value: …${m[0]}…`);
  }
};

check('login', <Login theme="light" onToggleTheme={noop} onLogin={noop}
  stats={{ sectionCount: sections.length, topicCount: content.stats.lessonCount }} />);

check('courses', <CourseList sections={sections} stats={content.stats} unsorted={unsorted}
  emptySections={content.emptySections} progressOf={() => ({ doneCount: 0, pct: 0, complete: false })}
  onOpen={noop} onOpenMap={noop} />);

check('process-map', <ProcessMap onBack={noop} />);

for (const s of sections) {
  check('course-detail', <CourseDetail section={s} progress={prog} onOpenTopic={noop} onQuiz={noop} onFinish={noop} />);
  check('quiz', <Quiz section={s} allSections={sections} onPass={noop} onBack={noop} />);
  check('completion', <Completion section={s} user="Demo User" completedAt={new Date(0).toISOString()} onBackToCourses={noop} onReview={noop} />);
  for (const t of s.topics) {
    check('topic-' + t.type, <TopicView section={s} topic={t} done={false} onToggleDone={noop}
      onPrev={noop} onNext={noop} hasPrev hasNext onOpenMap={noop} />);
  }
}

console.log('screens rendered OK :', screens);
Object.entries(counts).forEach(([k, v]) => console.log('  ' + k.padEnd(18), v));
