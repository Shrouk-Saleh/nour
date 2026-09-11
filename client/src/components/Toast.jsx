import React from 'react';
import { motion } from 'framer-motion';

const STYLES = {
  xp: 'bg-sprout-500 text-white',
  stars: 'bg-gold-400 text-ink-900',
  achievement: 'bg-dusk-500 text-white',
  info: 'bg-ink-700 text-white',
};

export default function Toast({ toast, onDismiss }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      onClick={() => onDismiss(toast.id)}
      className={`pointer-events-auto rounded-full px-4 py-2 text-sm font-semibold shadow-soft ${STYLES[toast.kind] || STYLES.info}`}
    >
      {toast.message}
    </motion.div>
  );
}
