import React from 'react';
import { motion } from 'framer-motion';

export default function AchievementCard({ achievement, progressValue }) {
  const { title, description, icon, unlocked, goal } = achievement;
  const pct = goal ? Math.min(100, Math.round(((progressValue ?? 0) / goal) * 100)) : 0;

  return (
    <motion.div
      layout
      initial={unlocked ? { scale: 0.9, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`flex items-center gap-3 rounded-2xl border p-3 ${
        unlocked ? 'border-gold-300 bg-gold-100/50' : 'border-paper-200 bg-white'
      }`}
    >
      <div
        className={`flex h-11 w-11 flex-none items-center justify-center rounded-full text-xl ${
          unlocked ? 'bg-gold-300' : 'bg-paper-200 grayscale opacity-50'
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${unlocked ? 'text-ink-900' : 'text-ink-600'}`}>{title}</p>
        <p className="truncate text-xs text-ink-600/70">{description}</p>
        {!unlocked && goal > 1 && (
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-paper-200">
            <div className="h-full rounded-full bg-sprout-400" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
