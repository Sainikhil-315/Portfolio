/**
 * Preloader → page handoff gate.
 * The preloader calls release() at curtain-lift start; components that build
 * paused entrance timelines call onReveal(cb) — fired immediately if already
 * released (repeat visits / late mounts).
 */
let released = false;
const listeners = new Set<() => void>();

export const releaseReveal = () => {
  if (released) return;
  released = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
};

export const onReveal = (cb: () => void): (() => void) => {
  if (released) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const isRevealed = () => released;

const SESSION_KEY = 'seen-intro';

export const hasSeenIntro = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
};

export const markIntroSeen = () => {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* private mode — ignore */
  }
};
