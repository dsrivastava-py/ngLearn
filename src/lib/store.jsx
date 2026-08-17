/*
 * localStorage-backed state manager for the Retail Ops module.
 * Provides a React context + hook for read/write with automatic persistence.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SECTIONS } from '../data/retail-ops-sections.js';

const STORAGE_KEY = 'ng-learn-retail-ops';

function emptySection() {
  return { lectureCompleted: false, quizAttempted: false, quizPassed: false, quizSnapshot: null };
}

const DEFAULT_SUPER_ADMIN = {
  name: 'Super Admin',
  email: 'admin@nurturinggreen.in',
  role: 'super-admin',
  department: 'All Operations',
};

const DEFAULT_TEAM_MEMBER = {
  name: 'Team Member',
  email: 'member@nurturinggreen.in',
  role: 'team-member',
  department: 'Retail Operations',
};

function defaultState() {
  const sections = {};
  SECTIONS.forEach(s => { sections[s.id] = emptySection(); });
  return {
    user: null,
    sections,
    finalExam: { attempted: false, passed: false, score: null, questionIds: [], answers: {} },
    moduleCompleted: false,
    completedAt: null,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    
    // Explicit safety checks to prevent runtime crashes from legacy storage data
    if (!parsed || typeof parsed !== 'object') return defaultState();
    if (parsed.sections && typeof parsed.sections !== 'object') {
      parsed.sections = {};
    }
    
    const def = defaultState();
    SECTIONS.forEach(s => {
      if (!parsed.sections?.[s.id]) {
        parsed.sections = parsed.sections || {};
        parsed.sections[s.id] = emptySection();
      }
    });

    let user = parsed.user || null;
    if (user && typeof user === 'object') {
      if (!user.role) {
        user.role = user.name?.toLowerCase().includes('admin') ? 'super-admin' : 'team-member';
        user.department = user.role === 'super-admin' ? 'All Operations' : 'Retail Operations';
      }
    }

    return { ...def, ...parsed, user };
  } catch { return defaultState(); }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadState);
  const debounce = useRef(null);

  // Persist to localStorage (debounced)
  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 300);
    return () => clearTimeout(debounce.current);
  }, [state]);

  const value = useMemo(() => ({ state, setState }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const { state, setState } = useContext(StoreContext);

  const login = useCallback((name, email, role, department) => {
    const isSuper = role ? role === 'super-admin' : (name.toLowerCase().includes('admin') || !name || name === 'Super Admin');
    const userRole = isSuper ? 'super-admin' : 'team-member';
    const userDept = department || (isSuper ? 'All Operations' : 'Retail Operations');
    setState(prev => ({
      ...prev,
      user: {
        name: name || (isSuper ? 'Super Admin' : 'Team Member'),
        email: email || (isSuper ? 'admin@nurturinggreen.in' : 'member@nurturinggreen.in'),
        role: userRole,
        department: userDept,
        loginAt: new Date().toISOString(),
      },
    }));
  }, [setState]);

  const switchRole = useCallback((newRole) => {
    setState(prev => {
      const isSuper = newRole === 'super-admin';
      return {
        ...prev,
        user: {
          ...prev.user,
          name: isSuper ? 'Super Admin' : 'Team Member',
          email: isSuper ? 'admin@nurturinggreen.in' : 'member@nurturinggreen.in',
          role: newRole,
          department: isSuper ? 'All Operations' : 'Retail Operations',
        },
      };
    });
  }, [setState]);

  const updateProfile = useCallback((profileData) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, ...profileData },
    }));
  }, [setState]);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, user: null }));
  }, [setState]);

  const setLectureCompleted = useCallback((sectionId, val = true) => {
    setState(prev => ({
      ...prev,
      sections: { ...prev.sections, [sectionId]: { ...prev.sections[sectionId], lectureCompleted: val } },
    }));
  }, [setState]);

  const setSectionQuiz = useCallback((sectionId, snapshot) => {
    setState(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: { ...prev.sections[sectionId], quizSnapshot: snapshot, quizAttempted: true },
      },
    }));
  }, [setState]);

  const setSectionQuizPassed = useCallback((sectionId) => {
    setState(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: { ...prev.sections[sectionId], quizPassed: true },
      },
    }));
  }, [setState]);

  const resetSectionQuiz = useCallback((sectionId) => {
    setState(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: { ...prev.sections[sectionId], quizSnapshot: null, quizAttempted: false, quizPassed: false },
      },
    }));
  }, [setState]);

  const setFinalExam = useCallback((examData) => {
    setState(prev => ({ ...prev, finalExam: { ...prev.finalExam, ...examData } }));
  }, [setState]);

  const completeModule = useCallback(() => {
    setState(prev => ({ ...prev, moduleCompleted: true, completedAt: new Date().toISOString() }));
  }, [setState]);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState());
  }, [setState]);

  // Computed values
  const isSectionComplete = useCallback((sectionId) => {
    const s = state.sections[sectionId];
    return s && s.lectureCompleted && s.quizPassed;
  }, [state.sections]);

  const completedSectionCount = useMemo(() => {
    return SECTIONS.filter(s => isSectionComplete(s.id)).length;
  }, [isSectionComplete]);

  const allSectionsComplete = completedSectionCount === SECTIONS.length;

  const overallProgress = useMemo(() => {
    // Each section contributes equally; lecture = 50%, quiz = 50%
    let total = 0;
    SECTIONS.forEach(s => {
      const sec = state.sections[s.id];
      if (sec?.lectureCompleted) total += 0.5;
      if (sec?.quizPassed) total += 0.5;
    });
    return Math.round((total / SECTIONS.length) * 100);
  }, [state.sections]);

  return {
    state,
    user: state.user,
    sections: state.sections,
    finalExam: state.finalExam,
    moduleCompleted: state.moduleCompleted,
    completedAt: state.completedAt,
    login, logout, switchRole, updateProfile,
    setLectureCompleted, setSectionQuiz, setSectionQuizPassed, resetSectionQuiz,
    setFinalExam, completeModule, resetAll,
    isSectionComplete, completedSectionCount, allSectionsComplete, overallProgress,
  };
}
