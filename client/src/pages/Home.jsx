import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Companion from '../components/Companion';
import ProgressBar from '../components/ProgressBar';
import TaskCard from '../components/TaskCard';
import { LEVEL_STAGES, randomIdleMessage } from '../utils/gameLogic';
import { DAY_LABELS_FULL } from '../constants/scheduleData';
import { formatTime12, isoDate } from '../utils/dateHelpers';

function greetingWord() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home({ onGoSchedule }) {
  const { companion, house, progress, todayTasks, todayCompletedCount, todayCountable, todayPercent, nextTask, completeTask, feedPet, waterPlant, harvestPlant, today } =
    useApp();
  const [message, setMessage] = useState(null);
  const isoToday = isoDate();
  const stage = LEVEL_STAGES[companion.level] || LEVEL_STAGES[1];

  const xpPercent = companion.xpToNextLevel
    ? Math.min(100, Math.round((companion.currentXp / companion.xpToNextLevel) * 100))
    : 0;

  const upcoming = useMemo(() => {
    const iso = isoToday;
    return todayTasks.filter((t) => !t.completedDates.includes(iso)).slice(0, 5);
  }, [todayTasks, isoToday]);

  function handleTap() {
    setMessage(randomIdleMessage(message));
  }

  return (
    <div className="px-4 pb-6 pt-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-900">
            {greetingWord()}{progress.displayName ? `, ${progress.displayName}` : ''}! 🌸
          </h1>
          <p className="text-sm text-ink-600">{DAY_LABELS_FULL[today]}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-bloom-500 shadow-card">
          <Flame size={16} className="text-bloom-500" />
          {progress.currentStreak}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-white px-4 py-2.5 shadow-card">
        <span className="text-sm font-medium text-ink-600">Stars</span>
        <span className="text-base font-bold text-gold-500">⭐ {progress.totalStars}</span>
      </div>

      <div className="mt-4 flex flex-col items-center rounded-3xl bg-white px-5 py-6 shadow-card overflow-hidden">
        <Companion 
          companion={companion} 
          house={house} 
          onTap={handleTap} 
          onFeed={feedPet} 
          onWater={waterPlant}
          onHarvest={harvestPlant}
          message={message} 
        />

        <div className="mt-5 w-full">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-ink-900">Level {companion.level} — {stage.name}</span>
            <span className="text-ink-600">
              {companion.currentXp} / {companion.xpToNextLevel === Infinity ? '—' : companion.xpToNextLevel} XP
            </span>
          </div>
          <div className="mt-1.5">
            <ProgressBar percent={xpPercent} />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-3xl bg-white px-5 py-4 shadow-card">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-ink-900">Today</span>
          <span className="text-ink-600">
            {todayCompletedCount} / {todayCountable.length} tasks
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar percent={todayPercent} colorClass="bg-bloom-400" />
        </div>
      </div>

      {nextTask && (
        <div className="mt-4 rounded-3xl bg-white px-5 py-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-600/60">Next up</p>
          <div className="mt-2">
            <TaskCard task={nextTask} isoToday={isoToday} onToggle={completeTask} />
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-sm font-semibold text-ink-900">Today's checklist</p>
          <button onClick={onGoSchedule} className="flex items-center gap-0.5 text-xs font-semibold text-sprout-600">
            Full schedule <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-2">
          {todayTasks.map((task) => (
            <TaskCard key={task._id || task.id} task={task} isoToday={isoToday} onToggle={completeTask} />
          ))}
        </div>
      </div>
    </div>
  );
}
