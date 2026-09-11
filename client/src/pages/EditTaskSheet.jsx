import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import BottomSheet from '../components/BottomSheet';
import ConfirmDialog from '../components/ConfirmDialog';
import { DAYS, DAY_LABELS_FULL, TASK_TYPES } from '../constants/scheduleData';

const TYPE_LABELS = {
  study: 'Study',
  'online-class': 'Online class',
  'offline-class': 'Offline class',
  review: 'Review',
  'problem-solving': 'Problem solving',
  break: 'Break',
  meal: 'Meal',
  preparation: 'Preparation',
  sleep: 'Sleep',
};

const EMPTY = {
  day: 'saturday',
  startTime: '05:00',
  endTime: '06:00',
  subject: '',
  title: '',
  type: 'study',
  xp: 10,
  stars: 10,
};

export default function EditTaskSheet({ open, onClose, task, defaultDay, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        day: task.day,
        startTime: task.startTime,
        endTime: task.endTime,
        subject: task.subject || '',
        title: task.title,
        type: task.type,
        xp: task.xp,
        stars: task.stars,
      });
    } else {
      setForm({ ...EMPTY, day: defaultDay || 'saturday' });
    }
  }, [task, defaultDay, open]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...form,
      xp: Number(form.xp) || 0,
      stars: Number(form.stars) || 0,
    });
    onClose();
  }

  return (
    <>
      <BottomSheet open={open} onClose={onClose} title={task ? 'Edit task' : 'Add task'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-600">Day</label>
            <select
              value={form.day}
              onChange={(e) => set('day', e.target.value)}
              className="w-full rounded-xl border border-paper-200 bg-paper-50 px-3 py-2.5 text-sm"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {DAY_LABELS_FULL[d]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-600">Start time</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => set('startTime', e.target.value)}
                className="w-full rounded-xl border border-paper-200 bg-paper-50 px-3 py-2.5 text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-600">End time</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => set('endTime', e.target.value)}
                className="w-full rounded-xl border border-paper-200 bg-paper-50 px-3 py-2.5 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-600">Subject (optional)</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => set('subject', e.target.value)}
              placeholder="e.g. Mathematics"
              maxLength={60}
              className="w-full rounded-xl border border-paper-200 bg-paper-50 px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-600">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Study + problem solving"
              maxLength={120}
              className="w-full rounded-xl border border-paper-200 bg-paper-50 px-3 py-2.5 text-sm"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-600">Type</label>
            <select
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
              className="w-full rounded-xl border border-paper-200 bg-paper-50 px-3 py-2.5 text-sm"
            >
              {TASK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-600">XP reward</label>
              <input
                type="number"
                min={0}
                max={500}
                value={form.xp}
                onChange={(e) => set('xp', e.target.value)}
                className="w-full rounded-xl border border-paper-200 bg-paper-50 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-600">Stars reward</label>
              <input
                type="number"
                min={0}
                max={500}
                value={form.stars}
                onChange={(e) => set('stars', e.target.value)}
                className="w-full rounded-xl border border-paper-200 bg-paper-50 px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            {task && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center justify-center rounded-full border border-bloom-300 px-4 py-2.5 text-bloom-500"
                aria-label="Delete task"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button type="submit" className="flex-1 rounded-full bg-sprout-500 py-2.5 text-sm font-semibold text-white">
              {task ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </BottomSheet>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this task?"
        description="This removes it from the schedule for good."
        confirmLabel="Delete"
        danger
        onConfirm={() => {
          onDelete(task);
          setConfirmDelete(false);
          onClose();
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
