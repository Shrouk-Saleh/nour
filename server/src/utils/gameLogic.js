// Shared gamification math for the backend. Mirrors client-side utils/gameLogic.js
// so optimistic UI updates match what the server eventually computes.

const LEVELS = [
  { level: 1, xpToNext: 100 },
  { level: 2, xpToNext: 150 },
  { level: 3, xpToNext: 200 },
  { level: 4, xpToNext: 300 },
  { level: 5, xpToNext: Infinity }, // max level
];

function xpRequiredFor(level) {
  const entry = LEVELS.find((l) => l.level === level);
  return entry ? entry.xpToNext : 100;
}

// Applies XP to a companion doc, handling level-ups (possibly multiple).
// Mutates and returns { companion, leveledUp, newLevel }.
function applyXp(companion, xpGained) {
  let leveledUp = false;
  companion.currentXp += xpGained;

  while (companion.level < 5 && companion.currentXp >= companion.xpToNextLevel) {
    companion.currentXp -= companion.xpToNextLevel;
    companion.level += 1;
    companion.xpToNextLevel = xpRequiredFor(companion.level);
    leveledUp = true;
  }

  // At max level, cap currentXp at xpToNextLevel for a "full bar" look
  if (companion.level >= 5) {
    companion.currentXp = Math.min(companion.currentXp, companion.xpToNextLevel);
  }

  return { leveledUp, newLevel: companion.level };
}

function moodFromPercent(percent) {
  if (percent >= 100) return 'celebrating';
  if (percent >= 80) return 'excited';
  if (percent >= 50) return 'happy';
  if (percent >= 20) return 'okay';
  return 'sleepy';
}

// "YYYY-MM-DD" for a given Date, using local calendar date.
function isoDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function daysBetweenIso(a, b) {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

// Updates streak fields on a progress doc given today's date string.
// Call this the first time a countable task is completed on a given day.
function registerStudyDay(progress, todayIso) {
  if (progress.lastStudyDate === todayIso) {
    return; // already counted today
  }

  if (progress.lastStudyDate) {
    const gap = daysBetweenIso(progress.lastStudyDate, todayIso);
    if (gap === 1) {
      progress.currentStreak += 1;
    } else if (gap > 1) {
      progress.currentStreak = 1;
    }
    // gap <= 0 (shouldn't happen): leave streak untouched
  } else {
    progress.currentStreak = 1;
  }

  progress.lastStudyDate = todayIso;
  if (progress.currentStreak > progress.bestStreak) {
    progress.bestStreak = progress.currentStreak;
  }
}

module.exports = { xpRequiredFor, applyXp, moodFromPercent, isoDate, daysBetweenIso, registerStudyDay };
