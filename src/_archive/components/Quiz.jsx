import { useMemo, useState } from 'react';
import { buildQuiz, PASS_MARK } from '../lib/quiz.js';
import { Check } from './icons.jsx';

const KEYS = ['A', 'B', 'C', 'D'];

export default function Quiz({ section, allSections, onPass, onBack }) {
  const questions = useMemo(() => buildQuiz(section, allSections), [section, allSections]);
  const [attempt, setAttempt] = useState(1);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="quiz-wrap">
        <div className="empty-state">
          Not enough resolved content in this section to generate a quiz.
          <div style={{ marginTop: 16 }}><button className="btn ghost" onClick={onBack}>Back to course</button></div>
        </div>
      </div>
    );
  }

  const correctCount = questions.filter((q, i) => answers[i] === q.answer).length;
  const score = correctCount / questions.length;
  const passed = score >= PASS_MARK;
  const answeredAll = questions.every((_, i) => answers[i] != null);

  const retry = () => { setAnswers({}); setSubmitted(false); setAttempt((a) => a + 1); };

  return (
    <div className="quiz-wrap">
      <div className="section-label">Section quiz · attempt {attempt}</div>
      <h1 className="page-title" style={{ margin: '4px 0 6px' }}>{section.title}</h1>
      <p className="page-sub">
        {questions.length} questions · {Math.round(PASS_MARK * 100)}% required to pass. Questions are built
        from this course's own steps, notes and real decision branches.
      </p>

      {submitted && (
        <div className={'result-banner ' + (passed ? 'pass' : 'fail')}>
          <div className="ring">{Math.round(score * 100)}%</div>
          <div style={{ flex: 1 }}>
            <h3>{passed ? 'Passed' : 'Not passed'}</h3>
            <p>
              {correctCount} of {questions.length} correct.{' '}
              {passed ? 'Section quiz cleared — you can now finish the KT.' : `You need ${Math.ceil(questions.length * PASS_MARK)} correct. Review the answers below and retake.`}
            </p>
          </div>
          {passed
            ? <button className="btn secondary" onClick={onPass}><Check size={15} /> Continue</button>
            : <button className="btn" onClick={retry}>Retake quiz</button>}
        </div>
      )}

      {questions.map((q, qi) => (
        <div className="card quiz-q" key={q.id}>
          <div className="qn">Q{qi + 1} · {q.tag}</div>
          <p className="q" style={{ whiteSpace: 'pre-wrap' }}>{q.prompt}</p>
          {q.options.map((opt, oi) => {
            let cls = 'opt';
            if (submitted) {
              if (oi === q.answer) cls += ' correct';
              else if (answers[qi] === oi) cls += ' wrong';
            } else if (answers[qi] === oi) cls += ' selected';
            return (
              <button className={cls} key={oi} disabled={submitted}
                onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}>
                <span className="key">{KEYS[oi]}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
        <button className="btn ghost" onClick={onBack}>Back to course</button>
        {!submitted && (
          <button className="btn" onClick={() => setSubmitted(true)} disabled={!answeredAll}>
            Submit answers {answeredAll ? '' : `(${Object.keys(answers).length}/${questions.length})`}
          </button>
        )}
        {submitted && !passed && <button className="btn" onClick={retry}>Retake quiz</button>}
        {submitted && passed && <button className="btn secondary" onClick={onPass}>Continue</button>}
      </div>
    </div>
  );
}
