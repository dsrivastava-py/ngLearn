/*
 * Quiz engine for Retail Ops module.
 * - Section quizzes: 4 random questions from that section's 10-question pool
 * - Final exam: ~25 questions from the unused pool (questions not in any section quiz)
 */
import { questionPool, getQuestionsForSection } from '../data/retail-ops-questions.js';

export const SECTION_QUIZ_COUNT = 4;
export const FINAL_EXAM_COUNT = 25;
export const SECTION_PASS_MARK = 0.70;
export const FINAL_PASS_MARK = 0.70;

/** Fisher-Yates shuffle (non-mutating) */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Draw a random section quiz.
 * Returns an array of question objects (4 by default).
 */
export function drawSectionQuiz(sectionId, count = SECTION_QUIZ_COUNT) {
  const pool = getQuestionsForSection(sectionId);
  const shuffled = shuffle(pool);
  return shuffled.slice(0, Math.min(count, pool.length));
}

/**
 * Get or create a quiz snapshot for a section.
 * If a snapshot already exists in the store, return it unchanged.
 * Otherwise, generate a new one.
 */
export function getOrCreateQuizSnapshot(sectionId, existingSnapshot) {
  if (existingSnapshot && existingSnapshot.questionIds?.length > 0) {
    return existingSnapshot;
  }
  const questions = drawSectionQuiz(sectionId);
  return {
    questionIds: questions.map(q => q.id),
    answers: {},
    submitted: false,
    score: null,
    passed: false,
  };
}

/**
 * Resolve question IDs back to full question objects.
 */
export function resolveQuestions(questionIds) {
  const byId = new Map(questionPool.map(q => [q.id, q]));
  return questionIds.map(id => byId.get(id)).filter(Boolean);
}

/**
 * Draw the final exam from unused questions.
 * Excludes any question IDs that were used in section quizzes.
 */
export function drawFinalExam(sectionsState, count = FINAL_EXAM_COUNT) {
  const usedIds = new Set();
  Object.values(sectionsState).forEach(sec => {
    if (sec.quizSnapshot?.questionIds) {
      sec.quizSnapshot.questionIds.forEach(id => usedIds.add(id));
    }
  });

  const available = questionPool.filter(q => !usedIds.has(q.id));
  const shuffled = shuffle(available);
  // Take up to `count` but at least whatever's available
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Grade a quiz/exam.
 * @param {Array} questions - array of question objects
 * @param {Object} answers - { questionId: selectedIndex }
 * @param {number} passMark - required score to pass (0-1)
 */
export function gradeQuiz(questions, answers, passMark = SECTION_PASS_MARK) {
  let correct = 0;
  questions.forEach(q => {
    if (answers[q.id] === q.correctIndex) correct++;
  });
  const score = questions.length > 0 ? correct / questions.length : 0;
  return {
    correctCount: correct,
    total: questions.length,
    score,
    percentage: Math.round(score * 100),
    passed: score >= passMark,
  };
}
