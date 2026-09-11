// Exact weekly schedule as specified. Do not alter times, days, or ordering.
// type must be one of Task.TASK_TYPES. xp/stars are only meaningful for
// countable types (study, online-class, offline-class, review, problem-solving)
// but we set sensible defaults for everything for consistency.

const T = {
  study: 'study',
  online: 'online-class',
  offline: 'offline-class',
  review: 'review',
  solve: 'problem-solving',
  brk: 'break',
  meal: 'meal',
  prep: 'preparation',
  sleep: 'sleep',
};

// XP/star weighting by duration (in minutes) for countable tasks.
function xpFor(minutes) {
  if (minutes <= 60) return 10;
  if (minutes <= 120) return 15;
  if (minutes <= 180) return 20;
  return 25;
}
function starsFor(minutes) {
  if (minutes <= 60) return 10;
  if (minutes <= 120) return 15;
  if (minutes <= 180) return 20;
  return 25;
}

function parseTime12(timeStr) {
  const parts = timeStr.trim().split(' ');
  const time = parts[0];
  const period = parts[1] || 'AM';
  let [h, m] = time.split(':').map(Number);
  if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
  if (period.toUpperCase() === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function minutesBetween(start, end) {
  let mins = parseTime12(end) - parseTime12(start);
  if (mins < 0) mins += 24 * 60; // handles items crossing midnight (sleep)
  return mins;
}

function item(startTime, endTime, subject, title, type) {
  const minutes = minutesBetween(startTime, endTime);
  const countable = [T.study, T.online, T.offline, T.review, T.solve].includes(type);
  return {
    startTime,
    endTime,
    subject,
    title,
    type,
    xp: countable ? xpFor(minutes) : 0,
    stars: countable ? starsFor(minutes) : 0,
  };
}

const RAW_SCHEDULE = {
  saturday: [
    item('05:00 AM', '05:30 AM', '', 'Wake up + breakfast', T.meal),
    item('05:30 AM', '07:30 AM', 'Mathematics', 'Study + problem solving', T.study),
    item('07:30 AM', '08:00 AM', '', 'Break', T.brk),
    item('08:00 AM', '10:00 AM', 'Chemistry', 'Study', T.study),
    item('10:00 AM', '10:30 AM', '', 'Break', T.brk),
    item('10:30 AM', '12:30 PM', 'Physics', 'Study + problem solving', T.study),
    item('12:30 PM', '01:30 PM', '', 'Lunch + break', T.meal),
    item('01:30 PM', '03:30 PM', 'Arabic', 'Study + problem solving', T.study),
    item('03:30 PM', '04:00 PM', '', 'Break', T.brk),
    item('04:00 PM', '06:00 PM', 'English', 'Study + problem solving', T.study),
    item('06:00 PM', '06:30 PM', '', 'Break', T.brk),
    item('06:30 PM', '08:00 PM', 'Weekly Review', 'Weekly mistakes review + problem solving', T.review),
    item('08:00 PM', '09:00 PM', '', 'Dinner + break', T.meal),
    item('09:00 PM', '10:00 PM', '', 'Light review / prepare tomorrow', T.prep),
    item('10:00 PM', '05:00 AM', '', 'Sleep', T.sleep),
  ],
  sunday: [
    item('05:00 AM', '05:30 AM', '', 'Breakfast + preparation', T.meal),
    item('05:30 AM', '07:30 AM', 'Mathematics', 'Preparation + review', T.study),
    item('07:30 AM', '08:30 AM', '', 'Break + breakfast', T.brk),
    item('08:30 AM', '09:15 AM', '', 'Prepare / travel', T.prep),
    item('09:30 AM', '12:00 PM', 'Mathematics', 'Offline class', T.offline),
    item('12:00 PM', '01:00 PM', '', 'Lunch + break', T.meal),
    item('01:00 PM', '02:30 PM', 'Mathematics', 'Review + solve class problems', T.review),
    item('02:30 PM', '03:30 PM', '', 'Break', T.brk),
    item('04:00 PM', '09:00 PM', 'Arabic', 'Online class + listening + writing + studying', T.online),
    item('09:00 PM', '10:00 PM', '', 'Dinner + break', T.meal),
    item('10:00 PM', '05:00 AM', '', 'Sleep', T.sleep),
  ],
  monday: [
    item('05:00 AM', '05:30 AM', '', 'Breakfast', T.meal),
    item('05:30 AM', '07:30 AM', 'Chemistry', 'Preparation + review previous material', T.study),
    item('07:30 AM', '08:00 AM', '', 'Break', T.brk),
    item('08:00 AM', '10:00 AM', 'Physics', 'Study + problem solving', T.study),
    item('10:00 AM', '10:30 AM', '', 'Break', T.brk),
    item('10:30 AM', '12:00 PM', 'Mathematics', 'Problem solving', T.solve),
    item('12:00 PM', '01:00 PM', '', 'Lunch + break', T.meal),
    item('01:00 PM', '01:45 PM', 'Chemistry', 'Prepare for Chemistry', T.prep),
    item('02:00 PM', '07:00 PM', 'Chemistry', 'Online class + listening + writing + studying', T.online),
    item('07:00 PM', '08:00 PM', '', 'Dinner + break', T.meal),
    item('08:00 PM', '09:00 PM', 'Chemistry', 'Quick review', T.review),
    item('09:00 PM', '10:00 PM', '', 'Relax + prepare for sleep', T.prep),
    item('10:00 PM', '05:00 AM', '', 'Sleep', T.sleep),
  ],
  tuesday: [
    item('05:00 AM', '05:30 AM', '', 'Breakfast', T.meal),
    item('05:30 AM', '07:30 AM', 'Mathematics', 'Problem solving', T.solve),
    item('07:30 AM', '08:00 AM', '', 'Break', T.brk),
    item('08:00 AM', '10:00 AM', 'Chemistry', 'Solve questions from Monday', T.solve),
    item('10:00 AM', '10:30 AM', '', 'Break', T.brk),
    item('10:30 AM', '12:30 PM', 'Physics', 'Study + problem solving', T.study),
    item('12:30 PM', '01:30 PM', '', 'Lunch + break', T.meal),
    item('01:30 PM', '03:30 PM', 'Arabic', 'Study + problem solving', T.study),
    item('03:30 PM', '04:00 PM', '', 'Break', T.brk),
    item('04:00 PM', '06:00 PM', 'English', 'Study + problem solving', T.study),
    item('06:00 PM', '06:30 PM', '', 'Break', T.brk),
    item('06:30 PM', '08:00 PM', 'Mixed', 'Mixed test / problem solving', T.solve),
    item('08:00 PM', '09:00 PM', '', 'Dinner', T.meal),
    item('09:00 PM', '10:00 PM', '', 'Review mistakes only', T.review),
    item('10:00 PM', '05:00 AM', '', 'Sleep', T.sleep),
  ],
  wednesday: [
    item('05:00 AM', '05:30 AM', '', 'Breakfast', T.meal),
    item('05:30 AM', '07:30 AM', 'Mathematics', 'Preparation', T.study),
    item('07:30 AM', '08:30 AM', '', 'Break', T.brk),
    item('08:30 AM', '09:15 AM', '', 'Prepare / travel', T.prep),
    item('09:30 AM', '12:00 PM', 'Mathematics', 'Offline class', T.offline),
    item('12:00 PM', '01:00 PM', '', 'Lunch + break', T.meal),
    item('01:00 PM', '02:30 PM', 'Mathematics', 'Solve class problems', T.solve),
    item('02:30 PM', '03:00 PM', '', 'Break', T.brk),
    item('03:00 PM', '05:00 PM', 'Chemistry', 'Solve + review', T.review),
    item('05:00 PM', '05:30 PM', '', 'Break', T.brk),
    item('05:30 PM', '07:30 PM', 'Physics', 'Study + problem solving', T.study),
    item('07:30 PM', '08:30 PM', '', 'Dinner + break', T.meal),
    item('08:30 PM', '09:30 PM', 'Mathematics', 'Review', T.review),
    item('09:30 PM', '10:00 PM', '', 'Prepare for sleep', T.prep),
    item('10:00 PM', '05:00 AM', '', 'Sleep', T.sleep),
  ],
  thursday: [
    item('05:00 AM', '05:30 AM', '', 'Breakfast', T.meal),
    item('05:30 AM', '07:30 AM', 'English', 'Preparation + review', T.study),
    item('07:30 AM', '08:00 AM', '', 'Break', T.brk),
    item('08:00 AM', '10:00 AM', 'Mathematics', 'Problem solving', T.solve),
    item('10:00 AM', '10:30 AM', '', 'Break', T.brk),
    item('10:30 AM', '12:00 PM', 'Chemistry', 'Solve questions', T.solve),
    item('12:00 PM', '01:00 PM', '', 'Lunch + break', T.meal),
    item('01:00 PM', '01:45 PM', '', 'Prepare', T.prep),
    item('02:00 PM', '07:00 PM', 'English', 'Online class + listening + writing + studying', T.online),
    item('07:00 PM', '08:00 PM', '', 'Dinner + break', T.meal),
    item('08:00 PM', '09:00 PM', 'English', "Review today's class", T.review),
    item('09:00 PM', '10:00 PM', '', 'Relax', T.prep),
    item('10:00 PM', '05:00 AM', '', 'Sleep', T.sleep),
  ],
  friday: [
    item('05:00 AM', '05:30 AM', '', 'Breakfast', T.meal),
    item('05:30 AM', '07:30 AM', 'Physics', 'Preparation', T.study),
    item('07:30 AM', '08:00 AM', '', 'Break', T.brk),
    item('08:00 AM', '10:00 AM', 'Chemistry', 'Study + problem solving', T.study),
    item('10:00 AM', '10:30 AM', '', 'Break', T.brk),
    item('10:30 AM', '12:00 PM', 'Arabic', 'Problem solving + practice', T.solve),
    item('12:00 PM', '01:00 PM', '', 'Lunch + break', T.meal),
    item('01:00 PM', '01:30 PM', '', 'Prepare / travel', T.prep),
    item('02:00 PM', '05:00 PM', 'Physics', 'Offline class', T.offline),
    item('05:00 PM', '06:00 PM', '', 'Break + food', T.brk),
    item('06:00 PM', '08:00 PM', 'Physics', "Solve problems from today's class", T.solve),
    item('08:00 PM', '08:30 PM', '', 'Break', T.brk),
    item('08:30 PM', '09:30 PM', 'Weekly Review', 'Weekly review — mistakes + weak points', T.review),
    item('09:30 PM', '10:00 PM', '', 'Relax + prepare for sleep', T.prep),
    item('10:00 PM', '05:00 AM', '', 'Sleep', T.sleep),
  ],
};

// Flatten into an array of Task-ready documents with day + order attached.
// Requires userId to be passed in to scope the seed data.
function buildSeedTasks(userId) {
  const tasks = [];
  Object.entries(RAW_SCHEDULE).forEach(([day, items]) => {
    items.forEach((it, index) => {
      tasks.push({ day, order: index, user: userId, ...it });
    });
  });
  return tasks;
}

const ACHIEVEMENT_DEFINITIONS = [
  { key: 'first-step', title: 'First Step', description: 'Complete your first task.', icon: '🌱', goal: 1, metric: 'tasksCompleted' },
  { key: 'getting-serious', title: 'Getting Serious', description: 'Study 3 days in a row.', icon: '🔥', goal: 3, metric: 'streak' },
  { key: 'on-fire', title: 'On Fire', description: 'Study 7 days in a row.', icon: '🔥🔥', goal: 7, metric: 'streak' },
  { key: 'star-collector', title: 'Star Collector', description: 'Earn 500 stars.', icon: '⭐', goal: 500, metric: 'stars' },
  { key: 'bookworm', title: 'Bookworm', description: 'Complete 50 study tasks.', icon: '📚', goal: 50, metric: 'tasksCompleted' },
  { key: 'perfect-week', title: 'Perfect Week', description: 'Complete all scheduled study tasks for a week.', icon: '🏆', goal: 1, metric: 'perfectWeeks' },
  { key: 'consistent', title: 'Consistent', description: 'Complete at least one task for 14 days.', icon: '🎯', goal: 14, metric: 'daysActive' },
];

const SHOP_ITEMS = [
  { key: 'flower', name: 'Flower', icon: '🌸', cost: 50, type: 'accessory' },
  { key: 'bow', name: 'Bow', icon: '🎀', cost: 100, type: 'accessory' },
  { key: 'sparkle', name: 'Sparkle effect', icon: '✨', cost: 150, type: 'effect' },
  { key: 'rainbow-bg', name: 'Rainbow background', icon: '🌈', cost: 250, type: 'background' },
  { key: 'butterfly', name: 'Butterfly companion', icon: '🦋', cost: 300, type: 'companion-extra' },
];

module.exports = { buildSeedTasks, ACHIEVEMENT_DEFINITIONS, SHOP_ITEMS, minutesBetween, parseTime12 };
