import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEVEL_STAGES } from '../utils/gameLogic';
import useReducedMotion from '../hooks/useReducedMotion';

export default function LevelUpModal({ level, onClose }) {
  const reducedMotion = useReducedMotion();
  const stage = LEVEL_STAGES[level] || LEVEL_STAGES[1];

  return (
    <AnimatePresence>
      {level && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-card"
          >
            <motion.div
              className="mx-auto mb-3 text-6xl"
              animate={reducedMotion ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              {stage.emoji}
            </motion.div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-500">Level up</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink-900">
              Level {level} — {stage.name}
            </h2>
            <p className="mt-2 text-sm text-ink-600">Your companion grew because of you. Keep going!</p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-full bg-sprout-500 py-2.5 text-sm font-semibold text-white active:bg-sprout-600"
            >
              Nice!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
