import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { drawFinalExam, gradeQuiz, FINAL_PASS_MARK } from '../lib/quiz-engine.js';
import { Check, ClockIcon } from './icons.jsx';

const KEYS = ['A', 'B', 'C', 'D'];

export default function FinalExam() {
  const navigate = useNavigate();
  const { sections: sectionsState, finalExam, setFinalExam, completeModule, allSectionsComplete } = useStore();

  // If prerequisites not met, redirect
  useEffect(() => {
    if (!allSectionsComplete) {
      navigate('/dashboard', { replace: true });
    }
  }, [allSectionsComplete, navigate]);

  // Questions for the exam (either saved in finalExam state or freshly drawn)
  const questions = useMemo(() => {
    if (finalExam?.questions && finalExam.questions.length > 0) {
      return finalExam.questions;
    }
    const drawn = drawFinalExam(sectionsState, 25);
    setFinalExam({ questions: drawn, answers: {}, submitted: false, score: null, passed: false });
    return drawn;
  }, []);

  const [answers, setAnswers] = useState(() => finalExam?.answers || {});
  const [submitted, setSubmitted] = useState(!!finalExam?.submitted);
  const [result, setResult] = useState(() => {
    if (finalExam?.submitted && questions.length > 0) {
      return gradeQuiz(questions, finalExam.answers || {}, FINAL_PASS_MARK);
    }
    return null;
  });

  const answeredCount = Object.keys(answers).filter(k => answers[k] != null).length;
  const isAllAnswered = questions.length > 0 && answeredCount === questions.length;

  const handleSubmit = () => {
    const grade = gradeQuiz(questions, answers, FINAL_PASS_MARK);
    setResult(grade);
    setSubmitted(true);

    setFinalExam({
      questions,
      answers,
      submitted: true,
      score: grade.percentage,
      passed: grade.passed,
      attempted: true
    });

    if (grade.passed) {
      completeModule();
    }
  };

  const handleRetake = () => {
    const newQuestions = drawFinalExam(sectionsState, 25);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setFinalExam({
      questions: newQuestions,
      answers: {},
      submitted: false,
      score: null,
      passed: false,
      attempted: true
    });
  };

  return (
    <main className="main narrow">
      <div className="quiz-wrap">
        <div className="section-label">Final Assessment · Retail Operations</div>
        <h1 className="page-title" style={{ margin: '4px 0 6px' }}>Comprehensive Module Exam</h1>
        <p className="page-sub">
          {questions.length} questions from across all 7 Retail Ops sections · {Math.round(FINAL_PASS_MARK * 100)}% required to pass.
          These questions are drawn from the comprehensive unused question bank.
        </p>

        {submitted && result && (
          <div className={`result-banner ${result.passed ? 'pass' : 'fail'}`}>
            <div className="ring">{result.percentage}%</div>
            <div style={{ flex: 1 }}>
              <h3>{result.passed ? 'Certification Cleared! 🎓' : 'Exam Not Passed'}</h3>
              <p>
                {result.correctCount} of {result.total} questions answered correctly ({result.percentage}%).{' '}
                {result.passed
                  ? 'Congratulations! You have completed the Retail Operations training certification.'
                  : `You need at least ${Math.ceil(questions.length * FINAL_PASS_MARK)} correct (${Math.round(FINAL_PASS_MARK * 100)}%) to pass. Please review your answers below and retake.`}
              </p>
            </div>
            {result.passed ? (
              <button className="btn secondary" onClick={() => navigate('/completion')}>
                <Check size={16} /> View Certificate &amp; Resources
              </button>
            ) : (
              <button className="btn" onClick={handleRetake}>
                Retake Exam
              </button>
            )}
          </div>
        )}

        {!submitted && (
          <div className="exam-progress-bar-card">
            <div className="ep-top">
              <span>Answered {answeredCount} of {questions.length} questions</span>
              <span>{Math.round((answeredCount / (questions.length || 1)) * 100)}%</span>
            </div>
            <div className="progress">
              <i style={{ width: `${(answeredCount / (questions.length || 1)) * 100}%` }} />
            </div>
          </div>
        )}

        {questions.map((q, qi) => (
          <div className="card quiz-q" key={q.id || qi}>
            <div className="qn">Question {qi + 1} of {questions.length}</div>
            <p className="q" style={{ whiteSpace: 'pre-wrap' }}>{q.prompt}</p>
            {q.options.map((opt, oi) => {
              let cls = 'opt';
              if (submitted) {
                if (oi === q.correctIndex) cls += ' correct';
                else if (answers[q.id] === oi) cls += ' wrong';
              } else if (answers[q.id] === oi) cls += ' selected';
              return (
                <button
                  className={cls}
                  key={oi}
                  disabled={submitted}
                  onClick={() => setAnswers(a => ({ ...a, [q.id]: oi }))}
                >
                  <span className="key">{KEYS[oi]}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        ))}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12, marginBottom: 40 }}>
          <button className="btn ghost" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          {!submitted && (
            <button className="btn secondary" onClick={handleSubmit} disabled={!isAllAnswered}>
              Submit Final Exam {isAllAnswered ? '' : `(${answeredCount}/${questions.length} answered)`}
            </button>
          )}
          {submitted && !result?.passed && (
            <button className="btn" onClick={handleRetake}>
              Retake Exam
            </button>
          )}
          {submitted && result?.passed && (
            <button className="btn secondary" onClick={() => navigate('/completion')}>
              Proceed to Certification &amp; Resources →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
