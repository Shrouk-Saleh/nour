export const DAYS = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export function isoDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayName() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
}

export function currentTimeMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function toMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(' ');
  const time = parts[0];
  const period = parts[1] || 'AM';
  let [h, m] = time.split(':').map(Number);
  if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
  if (period.toUpperCase() === 'AM' && h === 12) h = 0;
  return h * 60 + (m || 0);
}

export function formatTime12(timeStr) {
  if (!timeStr) return '';
  if (timeStr.toUpperCase().includes('AM') || timeStr.toUpperCase().includes('PM')) {
    return timeStr;
  }
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

// Returns true if `time` (HH:MM) falls within a start–end range, handling
// ranges that cross midnight (e.g. sleep 22:00 -> 05:00).
export function isWithinRange(minutesNow, start, end) {
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (e > s) return minutesNow >= s && minutesNow < e;
  return minutesNow >= s || minutesNow < e; // crosses midnight
}
