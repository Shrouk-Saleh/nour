// Client-side mirror of server/src/utils/gameLogic.js — used for optimistic
// UI updates so the interface reacts instantly, then reconciles with the
// server response once it arrives.

const LEVEL_XP = { 1: 100, 2: 150, 3: 200, 4: 300, 5: Infinity };

export function xpRequiredFor(level) {
  return LEVEL_XP[level] ?? 100;
}

export function applyXpLocal(companion, xpGained) {
  const next = { ...companion, currentXp: companion.currentXp + xpGained };
  let leveledUp = false;

  while (next.level < 5 && next.currentXp >= next.xpToNextLevel) {
    next.currentXp -= next.xpToNextLevel;
    next.level += 1;
    next.xpToNextLevel = xpRequiredFor(next.level);
    leveledUp = true;
  }
  if (next.level >= 5) {
    next.currentXp = Math.min(next.currentXp, next.xpToNextLevel);
  }
  return { companion: next, leveledUp };
}

export function moodFromPercent(percent) {
  if (percent >= 100) return 'celebrating';
  if (percent >= 80) return 'excited';
  if (percent >= 50) return 'happy';
  if (percent >= 20) return 'okay';
  return 'sleepy';
}

export const MOOD_LABELS = {
  sleepy: 'Sleepy',
  okay: 'Doing okay',
  happy: 'Happy',
  excited: 'Excited',
  celebrating: 'Celebrating!',
};

export const LEVEL_STAGES = {
  1: { name: 'Tiny Seed', emoji: '🌱' },
  2: { name: 'Small Sprout', emoji: '🌿' },
  3: { name: 'Growing Plant', emoji: '🪴' },
  4: { name: 'Small Tree', emoji: '🌳' },
  5: { name: 'Beautiful Tree', emoji: '🌸' },
};

export const IDLE_MESSAGES = [
  "You're doing amazing! 💕",
  'One more task?',
  "We're almost there! ⭐",
  "Let's finish today's goal!",
  'Proud of you today. 🌿',
  'Small steps add up. 🌱',
  'Ready when you are!',
  "You've got this. 💪",
];

export function randomIdleMessage(excludeLast) {
  const pool = excludeLast ? IDLE_MESSAGES.filter((m) => m !== excludeLast) : IDLE_MESSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}
