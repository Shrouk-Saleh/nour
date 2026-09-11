import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useReducedMotion from '../hooks/useReducedMotion';

const CONFETTI_COLORS = ['#8FBD84', '#F0B7B8', '#E4B54D', '#8D82A6', '#B4D2AC'];

export default function CelebrationOverlay({ show, onDone }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => onDone?.(), 2200);
    return () => clearTimeout(timer);
  }, [show, onDone]);

  const pieces = Array.from({ length: reducedMotion ? 0 : 18 });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            {pieces.map((_, i) => {
              const left = Math.random() * 100;
              const delay = Math.random() * 0.4;
              const duration = 1.4 + Math.random() * 0.8;
              const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
              return (
                <motion.span
                  key={i}
                  className="absolute top-[-5%] h-2.5 w-2.5 rounded-sm"
                  style={{ left: `${left}%`, backgroundColor: color }}
                  initial={{ y: 0, rotate: 0, opacity: 1 }}
                  animate={{ y: '110vh', rotate: 360, opacity: 0.9 }}
                  transition={{ duration, delay, ease: 'easeIn' }}
                />
              );
            })}
          </div>
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="rounded-3xl bg-white px-6 py-5 text-center shadow-card"
          >
            <p className="text-3xl">🎉</p>
            <p className="mt-1 font-display text-xl font-semibold text-ink-900">Perfect Day!</p>
            <p className="text-sm text-ink-600">Every study task, done.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
