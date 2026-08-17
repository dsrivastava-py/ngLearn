/*
 * Deterministic mock quiz built from each course's own content — real decision
 * branches from the diagram, real step text, real attached notes. Seeded per
 * section so a retake shows the same paper.
 */

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const shuffle = (arr, rand) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const trim = (s, n = 110) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

export const PASS_MARK = 0.7;

export function buildQuiz(section, allSections) {
  const rand = rng(hash(section.id));
  const lessons = section.topics.filter((t) => t.type === 'video');
  const flow = section.topics.find((t) => t.type === 'flowchart');

  const lessonTitles = lessons.map((t) => t.title);
  const ownStepText = lessons.flatMap((t) => t.steps.map((s) => s.text));
  const foreignLessonTitles = allSections
    .filter((s) => s.id !== section.id)
    .flatMap((s) => s.topics.filter((t) => t.type === 'video').map((t) => t.title));

  const questions = [];
  const usedAnswers = new Set();

  const make = (prompt, correct, pool, tag) => {
    if (!correct || usedAnswers.has(correct)) return;
    const distractors = shuffle(pool.filter((p) => p && p !== correct), rand)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 3);
    if (distractors.length < 3) return;
    usedAnswers.add(correct);
    const options = shuffle([correct, ...distractors], rand).map((o) => trim(o));
    questions.push({
      id: `${section.id}-q${questions.length + 1}`,
      tag,
      prompt,
      options,
      answer: options.indexOf(trim(correct)),
    });
  };

  // 1) branch questions straight off the real labelled edges
  if (flow) {
    const label = new Map([...flow.nodes, ...flow.contextNodes].map((n) => [n.id, n.text]));
    const decisions = new Set(flow.nodes.filter((n) => n.shape === 'decision').map((n) => n.id));
    const branchEdges = flow.edges.filter((e) => decisions.has(e.from) && e.label && label.has(e.to));
    for (const e of shuffle(branchEdges, rand).slice(0, 2)) {
      make(
        `At the decision "${trim(label.get(e.from), 80)}", what happens on "${e.label}"?`,
        label.get(e.to),
        [...ownStepText, ...flow.nodes.map((n) => n.text)],
        'Decision logic'
      );
    }
  }

  // 2) sequencing off real unlabelled connectivity
  if (flow) {
    const label = new Map([...flow.nodes, ...flow.contextNodes].map((n) => [n.id, n.text]));
    const plain = flow.edges.filter((e) => !e.label && label.has(e.from) && label.has(e.to));
    for (const e of shuffle(plain, rand).slice(0, 1)) {
      make(
        `Which step immediately follows "${trim(label.get(e.from), 80)}"?`,
        label.get(e.to),
        [...ownStepText, ...foreignLessonTitles],
        'Process order'
      );
    }
  }

  // 3) note attribution — which lesson do these working instructions belong to
  const noted = lessons.filter((t) => t.notes.length && t.notes[0].text.length > 60);
  for (const t of shuffle(noted, rand).slice(0, 2)) {
    make(
      `These working instructions come from which lesson?\n\n"${trim(t.notes[0].text, 220)}"`,
      t.title,
      [...lessonTitles, ...foreignLessonTitles],
      'Reference notes'
    );
  }

  // 4) which lesson covers a given real step
  for (const t of shuffle(lessons.filter((l) => l.steps.length > 1), rand).slice(0, 2)) {
    if (questions.length >= 5) break;
    const step = t.steps[Math.floor(rand() * t.steps.length)];
    make(
      `Which lesson covers the step "${trim(step.text, 90)}"?`,
      t.title,
      [...lessonTitles, ...foreignLessonTitles],
      'Lesson scope'
    );
  }

  // 5) membership — tops the paper up to five
  const framings = [
    `Which of the following is part of "${section.title}"?`,
    `Which lesson belongs to the "${section.title}" course?`,
  ];
  let f = 0;
  for (const t of shuffle(lessons, rand)) {
    if (questions.length >= 5 || f >= framings.length) break;
    const before = questions.length;
    make(framings[f], t.title, foreignLessonTitles, 'Scope');
    if (questions.length > before) f++;
  }

  return questions.slice(0, 5);
}
