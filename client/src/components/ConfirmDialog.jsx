import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', danger, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/40 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-3xl bg-white p-5 shadow-card"
          >
            <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
            {description && <p className="mt-1.5 text-sm text-ink-600">{description}</p>}
            <div className="mt-5 flex gap-2">
              <button
                onClick={onCancel}
                className="flex-1 rounded-full border border-paper-200 py-2.5 text-sm font-semibold text-ink-700"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 rounded-full py-2.5 text-sm font-semibold text-white ${
                  danger ? 'bg-bloom-500' : 'bg-sprout-500'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
