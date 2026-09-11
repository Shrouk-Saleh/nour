import React from 'react';
import { Home, CalendarDays, Sparkles, Trophy, Settings } from 'lucide-react';

// Custom Flower icon using emoji in a span
function FlowerIcon({ size, className }) {
  return <span className={className} style={{ fontSize: size - 4, lineHeight: 1 }}>🌸</span>;
}

const TABS = [
  { key: 'home',     label: 'Home',     icon: Home },
  { key: 'schedule', label: 'Schedule', icon: CalendarDays },
  { key: 'myworld',  label: 'My World', icon: Sparkles },
  { key: 'garden',   label: 'Garden',   icon: FlowerIcon },
  { key: 'progress', label: 'Progress', icon: Trophy },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-paper-200 bg-paper-50/95 backdrop-blur safe-bottom"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between px-1">
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex flex-1 flex-col items-center gap-0.5 py-2 min-w-0"
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.4 : 1.9}
                className={isActive ? 'text-sprout-600' : 'text-ink-600/60'}
              />
              <span
                className={`text-[9px] leading-none truncate ${
                  isActive ? 'text-sprout-600 font-semibold' : 'text-ink-600/60'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
