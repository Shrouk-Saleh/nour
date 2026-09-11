import React from 'react';
import { motion } from 'framer-motion';
import useReducedMotion from '../hooks/useReducedMotion';

export default function ProgressBar({ percent, colorClass = 'bg-sprout-400', trackClass = 'bg-paper-200', height = 10 }) {
  const reducedMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div
      className={`w-full overflow-hidden rounded-full ${trackClass}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        initial={false}
        animate={{ width: `${clamped}%` }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
