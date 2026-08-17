import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { getSection } from '../data/retail-ops-sections.js';
import { getOrCreateQuizSnapshot, resolveQuestions, gradeQuiz, SECTION_PASS_MARK } from '../lib/quiz-engine.js';
import { Check } from './icons.jsx';

const KEYS = ['A', 'B', 'C', 'D'];

export default function SectionQuiz() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { sections: sectionStates, setSectionQuiz, setSectionQuizPassed, resetSectionQuiz } = useStore();

  const section = getSection(sectionId);
  const sectionState = sectionStates[sectionId] || {};

  // Create or load snapshot
  const snapshot = useMemo(() => {
    return getOrCreateQuizSnapshot(sectionId, sectionState.quizSnapshot);
  }, [sectionId, sectionState.quizSnapshot]);

  const questions = useMemo(() => resolveQuestions(snapshot.questionIds), [snapshot.questionIds]);

  const [answers, setAnswers] = useState(() => snapshot.answers || {});
  const [submitted, setSubmitted] = useState(!!snapshot.submitted);
  const [result, setResult] = useState(() => {
    if (snapshot.submitted) return gradeQuiz(questions, snapshot.answers || {}, SECTION_PASS_MARK);
    return null;
  });

  if (!section) {
    return <main className="main narrow"><div className="empty-state">Section not found.</div></main>;
  }

  const answeredAll = questions.every(q => answers[q.id] != null);

  const handleSubmit = () => {
    const grade = gradeQuiz(questions, answers, SECTION_PASS_MARK);
    setResult(grade);
    setSubmitted(true);

    const snap = { ...snapshot, answers, submitted: true, score: grade.percentage, passed: grade.passed };
    setSectionQuiz(sectionId, snap);

    if (grade.passed) {
      setSectionQuizPassed(sectionId);
    }
  };

  const handleRetake = () => {
    resetSectionQuiz(sectionId);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  };

  return (
    <main className="main narrow">
      <div className="quiz-wrap">
        <div className="section-label">Section Quiz · {section.title}</div>
        <h1 className="page-title" style={{ margin: '4px 0 6px' }}>{section.title}</h1>
        <p className="page-sub">
          {questions.length} questions · {Math.round(SECTION_PASS_MARK * 100)}% required to pass.
          Questions are randomly drawn from this section's question pool.
        </p>

        {submitted && result && (
          <div className={`result-banner ${result.passed ? 'pass' : 'fail'}`}>
            <div className="ring">{result.percentage}%</div>
            <div style={{ flex: 1 }}>
              <h3>{result.passed ? 'Passed! 🎉' : 'Not passed'}</h3>
              <p>
                {result.correctCount} of {result.total} correct.{' '}
                {result.passed
                  ? 'Section quiz cleared — this section is now complete.'
                  : `You need ${Math.ceil(questions.length * SECTION_PASS_MARK)} correct. Review answers below and retake.`}
              </p>
            </div>
            {result.passed
              ? <button className="btn secondary" onClick={() => navigate(`/section/${sectionId}`)}><Check size={15} /> Back to Section</button>
              : <button className="btn" onClick={handleRetake}>Retake Quiz</button>}
          </div>
        )}

        {questions.map((q, qi) => (
          <div className="card quiz-q" key={q.id}>
            <div className="qn">Q{qi + 1}</div>
            <p className="q" style={{ whiteSpace: 'pre-wrap' }}>{q.prompt}</p>
            {q.options.map((opt, oi) => {
              let cls = 'opt';
              if (submitted) {
                if (oi === q.correctIndex) cls += ' correct';
                else if (answers[q.id] === oi) cls += ' wrong';
              } else if (answers[q.id] === oi) cls += ' selected';
              return (
                <button className={cls} key={oi} disabled={submitted}
                  onClick={() => setAnswers(a => ({ ...a, [q.id]: oi }))}>
                  <span className="key">{KEYS[oi]}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        ))}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
          <button className="btn ghost" onClick={() => navigate(`/section/${sectionId}`)}>Back to Section</button>
          {!submitted && (
            <button className="btn" onClick={handleSubmit} disabled={!answeredAll}>
              Submit Answers {answeredAll ? '' : `(${Object.keys(answers).length}/${questions.length})`}
            </button>
          )}
          {submitted && !result?.passed && <button className="btn" onClick={handleRetake}>Retake Quiz</button>}
          {submitted && result?.passed && (
            <button className="btn secondary" onClick={() => navigate('/dashboard')}><Check size={15} /> Dashboard</button>
          )}
        </div>
      </div>
    </main>
  );
}
