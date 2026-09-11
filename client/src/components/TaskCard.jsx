import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Coffee, Utensils, Moon, ClipboardList, BookOpen, Video, Users, RotateCcw, PenLine } from 'lucide-react';
import { formatTime12 } from '../utils/dateHelpers';
import useReducedMotion from '../hooks/useReducedMotion';

const TYPE_META = {
  study: { icon: BookOpen, label: 'Study' },
  'online-class': { icon: Video, label: 'Online class' },
  'offline-class': { icon: Users, label: 'Offline class' },
  review: { icon: RotateCcw, label: 'Review' },
  'problem-solving': { icon: PenLine, label: 'Problem solving' },
  break: { icon: Coffee, label: 'Break' },
  meal: { icon: Utensils, label: 'Meal' },
  preparation: { icon: ClipboardList, label: 'Prep' },
  sleep: { icon: Moon, label: 'Sleep' },
};

const COUNTABLE = ['study', 'online-class', 'offline-class', 'review', 'problem-solving'];

export default function TaskCard({ task, isoToday, onToggle, onEdit }) {
  const reducedMotion = useReducedMotion();
  const [burst, setBurst] = useState(false);
  const countable = COUNTABLE.includes(task.type);
  const completed = task.completedDates.includes(isoToday);
  const meta = TYPE_META[task.type] || TYPE_META.study;
  const Icon = meta.icon;

  function handleToggle() {
    if (!countable) return;
    if (!completed) {
      setBurst(true);
      setTimeout(() => setBurst(false), 900);
    }
    onToggle(task, !completed);
  }

  if (!countable) {
    return (
      <div className="flex items-center gap-3 rounded-2xl px-3 py-2.5 opacity-70">
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-paper-200 text-ink-600">
          <Icon size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-ink-600">{task.title}</p>
        </div>
        <span className="flex-none text-xs text-ink-600/70">{formatTime12(task.startTime)}</span>
      </div>
    );
  }

  return (
    <motion.div
      layout
      onClick={() => onEdit?.(task)}
      className={`relative flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors ${
        completed ? 'border-sprout-200 bg-sprout-50' : 'border-paper-200 bg-white shadow-card'
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        aria-pressed={completed}
        aria-label={completed ? `Mark ${task.title} as not done` : `Mark ${task.title} as done`}
        className={`relative flex h-9 w-9 flex-none items-center justify-center rounded-full border-2 transition-colors ${
          completed ? 'border-sprout-400 bg-sprout-400' : 'border-paper-200 bg-paper-50'
        }`}
      >
        <AnimatePresence>
          {completed && (
            <motion.span
              initial={reducedMotion ? {} : { scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Check size={18} className="text-white" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {burst && !reducedMotion && (
            <>
              <motion.span
                className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-sprout-500"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -22 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                +{task.xp}
              </motion.span>
            </>
          )}
        </AnimatePresence>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink-600/70">
          <Icon size={12} />
          <span className="truncate">{meta.label}</span>
        </div>
        <p className={`truncate text-sm font-semibold ${completed ? 'text-sprout-700' : 'text-ink-900'}`}>
          {task.subject ? `${task.subject} — ${task.title}` : task.title}
        </p>
        <p className="text-xs text-ink-600/70">
          {formatTime12(task.startTime)} – {formatTime12(task.endTime)}
        </p>
      </div>

      <div className="flex-none text-right">
        <p className="text-xs font-semibold text-sprout-600">+{task.xp} XP</p>
        <p className="text-xs font-semibold text-gold-500">+{task.stars} ⭐</p>
      </div>
    </motion.div>
  );
}
