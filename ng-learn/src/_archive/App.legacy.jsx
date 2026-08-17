import { useCallback, useEffect, useMemo, useState } from 'react';
import content from './data/content.json';
import unsorted from './data/unsorted.json';
import Login from './components/Login.jsx';
import CourseList from './components/CourseList.jsx';
import CourseDetail from './components/CourseDetail.jsx';
import TopicView from './components/TopicView.jsx';
import Quiz from './components/Quiz.jsx';
import Completion from './components/Completion.jsx';
import ProcessMap from './components/ProcessMap.jsx';
import { Leaf, Sun, Moon } from './components/icons.jsx';

const SECTIONS = content.sections;

// All state is in-memory by design for this demo build — a refresh resets it.
const emptyProgress = () => ({ done: [], quizPassed: false, completedAt: null });

export default function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [view, setView] = useState({ name: 'courses' });
  const [progress, setProgress] = useState({});

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [view.name, view.courseId, view.topicId]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const getProgress = useCallback((id) => progress[id] || emptyProgress(), [progress]);

  const progressOf = useCallback((section) => {
    const p = getProgress(section.id);
    const doneCount = p.done.length;
    const pct = section.topics.length ? Math.round((doneCount / section.topics.length) * 100) : 0;
    return { doneCount, pct, complete: !!p.completedAt };
  }, [getProgress]);

  const totals = useMemo(() => ({
    sectionCount: SECTIONS.length,
    topicCount: SECTIONS.reduce((n, s) => n + s.topicCount, 0),
  }), []);

  const section = view.courseId ? SECTIONS.find((s) => s.id === view.courseId) : null;
  const topic = section && view.topicId ? section.topics.find((t) => t.id === view.topicId) : null;

  const toggleDone = (sectionId, topicId) => {
    setProgress((prev) => {
      const cur = prev[sectionId] || emptyProgress();
      const done = cur.done.includes(topicId)
        ? cur.done.filter((x) => x !== topicId)
        : [...cur.done, topicId];
      return { ...prev, [sectionId]: { ...cur, done } };
    });
  };

  const markQuizPassed = (sectionId) => {
    setProgress((prev) => ({ ...prev, [sectionId]: { ...(prev[sectionId] || emptyProgress()), quizPassed: true } }));
  };

  const finish = (sectionId) => {
    const at = new Date().toISOString();
    setProgress((prev) => ({ ...prev, [sectionId]: { ...(prev[sectionId] || emptyProgress()), completedAt: at } }));
    setView({ name: 'done', courseId: sectionId });
  };

  if (!user) {
    return (
      <Login theme={theme} onToggleTheme={toggleTheme} stats={totals}
        onLogin={(name) => { setUser(name); setView({ name: 'courses' }); }} />
    );
  }

  const topicIndex = topic ? section.topics.findIndex((t) => t.id === topic.id) : -1;
  const goTopic = (i) => setView({ name: 'topic', courseId: section.id, topicId: section.topics[i].id });

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="leaf"><Leaf /></span>
          <span>NG&nbsp;<em>Learn</em></span>
        </div>

        <nav className="crumbs">
          <button onClick={() => setView({ name: 'courses' })}>Courses</button>
          {section && <><span className="sep">/</span>
            <button onClick={() => setView({ name: 'course', courseId: section.id })}>{section.title}</button></>}
          {view.name === 'topic' && topic && <><span className="sep">/</span><span className="current">{topic.title}</span></>}
          {view.name === 'quiz' && <><span className="sep">/</span><span className="current">Section quiz</span></>}
          {view.name === 'done' && <><span className="sep">/</span><span className="current">Completion</span></>}
          {view.name === 'map' && <><span className="sep">/</span><span className="current">Original process map</span></>}
        </nav>

        <div className="header-right">
          <button className="btn ghost sm map-link" onClick={() => setView({ name: 'map', back: view })}>
            Original map
          </button>
          <div className="user-chip">
            <span className="uname">{user}</span>
            <span className="avatar">{user.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}</span>
          </div>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>
          <button className="icon-btn" onClick={() => { setUser(null); setView({ name: 'courses' }); }} aria-label="Sign out" title="Sign out">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2M18 15l3-3-3-3M10.5 12H21" />
            </svg>
          </button>
        </div>
      </header>

      <main className={'main' + (view.name === 'topic' ? '' : ' narrow')}>
        {view.name === 'courses' && (
          <CourseList
            sections={SECTIONS}
            stats={content.stats}
            unsorted={unsorted}
            emptySections={content.emptySections}
            progressOf={progressOf}
            onOpen={(s) => setView({ name: 'course', courseId: s.id })}
            onOpenMap={() => setView({ name: 'map', back: view })}
          />
        )}

        {view.name === 'map' && (
          <ProcessMap onBack={() => setView(view.back && view.back.name !== 'map' ? view.back : { name: 'courses' })} />
        )}

        {view.name === 'course' && section && (
          <CourseDetail
            section={section}
            progress={getProgress(section.id)}
            onOpenTopic={(t) => setView({ name: 'topic', courseId: section.id, topicId: t.id })}
            onQuiz={() => setView({ name: 'quiz', courseId: section.id })}
            onFinish={() => finish(section.id)}
          />
        )}

        {view.name === 'topic' && section && topic && (
          <TopicView
            section={section}
            topic={topic}
            done={getProgress(section.id).done.includes(topic.id)}
            onToggleDone={() => toggleDone(section.id, topic.id)}
            hasPrev={topicIndex > 0}
            hasNext={topicIndex < section.topics.length - 1}
            onPrev={() => goTopic(topicIndex - 1)}
            onNext={() => goTopic(topicIndex + 1)}
            onOpenMap={() => setView({ name: 'map', back: view })}
          />
        )}

        {view.name === 'quiz' && section && (
          <Quiz
            section={section}
            allSections={SECTIONS}
            onBack={() => setView({ name: 'course', courseId: section.id })}
            onPass={() => { markQuizPassed(section.id); setView({ name: 'course', courseId: section.id }); }}
          />
        )}

        {view.name === 'done' && section && (
          <Completion
            section={section}
            user={user}
            completedAt={getProgress(section.id).completedAt || new Date().toISOString()}
            onReview={() => setView({ name: 'course', courseId: section.id })}
            onBackToCourses={() => setView({ name: 'courses' })}
          />
        )}
      </main>
    </div>
  );
}
