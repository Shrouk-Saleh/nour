// Client-side mirror of the exact weekly schedule. Used as the offline /
// first-load fallback so the app is usable even before the backend has
// been seeded or while briefly offline. The backend (server/src/utils/seedData.js)
// is the source of truth once connected.

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

export const TASK_TYPES = Object.values(T);
export const COUNTABLE_TYPES = [T.study, T.online, T.offline, T.review, T.solve];
export const DAYS = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
export const DAY_LABELS = {
  saturday: 'Sat',
  sunday: 'Sun',
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
};
export const DAY_LABELS_FULL = {
  saturday: 'Saturday',
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
};

function minutesBetween(start, end) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let mins = eh * 60 + em - (sh * 60 + sm);
  if (mins < 0) mins += 24 * 60;
  return mins;
}
function xpFor(m) {
  if (m <= 60) return 10;
  if (m <= 120) return 15;
  if (m <= 180) return 20;
  return 25;
}
function it(startTime, endTime, subject, title, type) {
  const minutes = minutesBetween(startTime, endTime);
  const countable = COUNTABLE_TYPES.includes(type);
  return {
    id: `${startTime}-${title}`.replace(/\s+/g, '-').toLowerCase(),
    startTime,
    endTime,
    subject,
    title,
    type,
    xp: countable ? xpFor(minutes) : 0,
    stars: countable ? xpFor(minutes) : 0,
    completedDates: [],
  };
}

export const FALLBACK_SCHEDULE = {
  saturday: [
    it('05:00', '05:30', '', 'Wake up + breakfast', T.meal),
    it('05:30', '07:30', 'Mathematics', 'Study + problem solving', T.study),
    it('07:30', '08:00', '', 'Break', T.brk),
    it('08:00', '10:00', 'Chemistry', 'Study', T.study),
    it('10:00', '10:30', '', 'Break', T.brk),
    it('10:30', '12:30', 'Physics', 'Study + problem solving', T.study),
    it('12:30', '13:30', '', 'Lunch + break', T.meal),
    it('13:30', '15:30', 'Arabic', 'Study + problem solving', T.study),
    it('15:30', '16:00', '', 'Break', T.brk),
    it('16:00', '18:00', 'English', 'Study + problem solving', T.study),
    it('18:00', '18:30', '', 'Break', T.brk),
    it('18:30', '20:00', 'Weekly Review', 'Weekly mistakes review + problem solving', T.review),
    it('20:00', '21:00', '', 'Dinner + break', T.meal),
    it('21:00', '22:00', '', 'Light review / prepare tomorrow', T.prep),
    it('22:00', '05:00', '', 'Sleep', T.sleep),
  ],
  sunday: [
    it('05:00', '05:30', '', 'Breakfast + preparation', T.meal),
    it('05:30', '07:30', 'Mathematics', 'Preparation + review', T.study),
    it('07:30', '08:30', '', 'Break + breakfast', T.brk),
    it('08:30', '09:15', '', 'Prepare / travel', T.prep),
    it('09:30', '12:00', 'Mathematics', 'Offline class', T.offline),
    it('12:00', '13:00', '', 'Lunch + break', T.meal),
    it('13:00', '14:30', 'Mathematics', 'Review + solve class problems', T.review),
    it('14:30', '15:30', '', 'Break', T.brk),
    it('16:00', '21:00', 'Arabic', 'Online class + listening + writing + studying', T.online),
    it('21:00', '22:00', '', 'Dinner + break', T.meal),
    it('22:00', '05:00', '', 'Sleep', T.sleep),
  ],
  monday: [
    it('05:00', '05:30', '', 'Breakfast', T.meal),
    it('05:30', '07:30', 'Chemistry', 'Preparation + review previous material', T.study),
    it('07:30', '08:00', '', 'Break', T.brk),
    it('08:00', '10:00', 'Physics', 'Study + problem solving', T.study),
    it('10:00', '10:30', '', 'Break', T.brk),
    it('10:30', '12:00', 'Mathematics', 'Problem solving', T.solve),
    it('12:00', '13:00', '', 'Lunch + break', T.meal),
    it('13:00', '13:45', 'Chemistry', 'Prepare for Chemistry', T.prep),
    it('14:00', '19:00', 'Chemistry', 'Online class + listening + writing + studying', T.online),
    it('19:00', '20:00', '', 'Dinner + break', T.meal),
    it('20:00', '21:00', 'Chemistry', 'Quick review', T.review),
    it('21:00', '22:00', '', 'Relax + prepare for sleep', T.prep),
    it('22:00', '05:00', '', 'Sleep', T.sleep),
  ],
  tuesday: [
    it('05:00', '05:30', '', 'Breakfast', T.meal),
    it('05:30', '07:30', 'Mathematics', 'Problem solving', T.solve),
    it('07:30', '08:00', '', 'Break', T.brk),
    it('08:00', '10:00', 'Chemistry', 'Solve questions from Monday', T.solve),
    it('10:00', '10:30', '', 'Break', T.brk),
    it('10:30', '12:30', 'Physics', 'Study + problem solving', T.study),
    it('12:30', '13:30', '', 'Lunch + break', T.meal),
    it('13:30', '15:30', 'Arabic', 'Study + problem solving', T.study),
    it('15:30', '16:00', '', 'Break', T.brk),
    it('16:00', '18:00', 'English', 'Study + problem solving', T.study),
    it('18:00', '18:30', '', 'Break', T.brk),
    it('18:30', '20:00', 'Mixed', 'Mixed test / problem solving', T.solve),
    it('20:00', '21:00', '', 'Dinner', T.meal),
    it('21:00', '22:00', '', 'Review mistakes only', T.review),
    it('22:00', '05:00', '', 'Sleep', T.sleep),
  ],
  wednesday: [
    it('05:00', '05:30', '', 'Breakfast', T.meal),
    it('05:30', '07:30', 'Mathematics', 'Preparation', T.study),
    it('07:30', '08:30', '', 'Break', T.brk),
    it('08:30', '09:15', '', 'Prepare / travel', T.prep),
    it('09:30', '12:00', 'Mathematics', 'Offline class', T.offline),
    it('12:00', '13:00', '', 'Lunch + break', T.meal),
    it('13:00', '14:30', 'Mathematics', 'Solve class problems', T.solve),
    it('14:30', '15:00', '', 'Break', T.brk),
    it('15:00', '17:00', 'Chemistry', 'Solve + review', T.review),
    it('17:00', '17:30', '', 'Break', T.brk),
    it('17:30', '19:30', 'Physics', 'Study + problem solving', T.study),
    it('19:30', '20:30', '', 'Dinner + break', T.meal),
    it('20:30', '21:30', 'Mathematics', 'Review', T.review),
    it('21:30', '22:00', '', 'Prepare for sleep', T.prep),
    it('22:00', '05:00', '', 'Sleep', T.sleep),
  ],
  thursday: [
    it('05:00', '05:30', '', 'Breakfast', T.meal),
    it('05:30', '07:30', 'English', 'Preparation + review', T.study),
    it('07:30', '08:00', '', 'Break', T.brk),
    it('08:00', '10:00', 'Mathematics', 'Problem solving', T.solve),
    it('10:00', '10:30', '', 'Break', T.brk),
    it('10:30', '12:00', 'Chemistry', 'Solve questions', T.solve),
    it('12:00', '13:00', '', 'Lunch + break', T.meal),
    it('13:00', '13:45', '', 'Prepare', T.prep),
    it('14:00', '19:00', 'English', 'Online class + listening + writing + studying', T.online),
    it('19:00', '20:00', '', 'Dinner + break', T.meal),
    it('20:00', '21:00', 'English', "Review today's class", T.review),
    it('21:00', '22:00', '', 'Relax', T.prep),
    it('22:00', '05:00', '', 'Sleep', T.sleep),
  ],
  friday: [
    it('05:00', '05:30', '', 'Breakfast', T.meal),
    it('05:30', '07:30', 'Physics', 'Preparation', T.study),
    it('07:30', '08:00', '', 'Break', T.brk),
    it('08:00', '10:00', 'Chemistry', 'Study + problem solving', T.study),
    it('10:00', '10:30', '', 'Break', T.brk),
    it('10:30', '12:00', 'Arabic', 'Problem solving + practice', T.solve),
    it('12:00', '13:00', '', 'Lunch + break', T.meal),
    it('13:00', '13:30', '', 'Prepare / travel', T.prep),
    it('14:00', '17:00', 'Physics', 'Offline class', T.offline),
    it('17:00', '18:00', '', 'Break + food', T.brk),
    it('18:00', '20:00', 'Physics', "Solve problems from today's class", T.solve),
    it('20:00', '20:30', '', 'Break', T.brk),
    it('20:30', '21:30', 'Weekly Review', 'Weekly review — mistakes + weak points', T.review),
    it('21:30', '22:00', '', 'Relax + prepare for sleep', T.prep),
    it('22:00', '05:00', '', 'Sleep', T.sleep),
  ],
};

export function flattenSchedule() {
  const tasks = [];
  DAYS.forEach((day) => {
    FALLBACK_SCHEDULE[day].forEach((task, order) => {
      tasks.push({ ...task, day, order });
    });
  });
  return tasks;
}
