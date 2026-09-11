import React, { useRef, useEffect } from 'react';
import { DAYS, DAY_LABELS } from '../constants/scheduleData';

export default function DaySelector({ activeDay, onSelect }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeDay]);

  return (
    <div ref={containerRef} className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1 pt-1">
      {DAYS.map((day) => {
        const isActive = day === activeDay;
        return (
          <button
            key={day}
            ref={isActive ? activeRef : null}
            onClick={() => onSelect(day)}
            className={`flex-none rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isActive ? 'bg-sprout-500 text-white' : 'bg-white text-ink-600 border border-paper-200'
            }`}
          >
            {DAY_LABELS[day]}
          </button>
        );
      })}
    </div>
  );
}
