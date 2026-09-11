import React from 'react';
import { Flame, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';
import AchievementCard from '../components/AchievementCard';

export default function ProgressPage() {
  const { progress, achievements, todayCountable, todayCompletedCount } = useApp();

  const dailyGoalMet = todayCountable.length > 0 && todayCompletedCount >= todayCountable.length;
  const weeklyPercent = progress.weeklyQuestTarget
    ? Math.min(100, Math.round((progress.weeklyQuestProgress / progress.weeklyQuestTarget) * 100))
    : 0;

  function achievementValue(a) {
    if (a.metric === 'tasksCompleted') return progress.totalTasksCompleted;
    if (a.metric === 'streak') return progress.currentStreak;
    if (a.metric === 'stars') return progress.totalStars;
    if (a.metric === 'daysActive') return progress.dailyLogs.length;
    if (a.metric === 'perfectWeeks') return progress.dailyLogs.filter((d) => d.perfectDay).length >= 7 ? 1 : 0;
    return 0;
  }

  return (
    <div className="px-4 pb-6 pt-5">
      <h1 className="font-display text-xl font-semibold text-ink-900">Progress</h1>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 text-center shadow-card">
          <Flame className="mx-auto text-bloom-500" size={22} />
          <p className="mt-1 text-2xl font-bold text-ink-900">{progress.currentStreak}</p>
          <p className="text-xs text-ink-600">day streak</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-card">
          <Trophy className="mx-auto text-gold-500" size={22} />
          <p className="mt-1 text-2xl font-bold text-ink-900">{progress.bestStreak}</p>
          <p className="text-xs text-ink-600">best streak</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-900">Today's goal</p>
          {dailyGoalMet && <span className="text-xs font-semibold text-sprout-600">🎉 Complete!</span>}
        </div>
        <p className="mb-2 text-xs text-ink-600">
          Complete {todayCountable.length} study task{todayCountable.length === 1 ? '' : 's'}
        </p>
        <div className="flex items-center gap-2">
          <ProgressBar percent={todayCountable.length ? (todayCompletedCount / todayCountable.length) * 100 : 0} />
          <span className="flex-none text-xs font-semibold text-ink-600">
            {todayCompletedCount}/{todayCountable.length}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-900">Weekly quest</p>
          {progress.weeklyQuestClaimed && <span className="text-xs font-semibold text-gold-500">🏆 Complete!</span>}
        </div>
        <p className="mb-2 text-xs text-ink-600">
          Complete {progress.weeklyQuestTarget} study tasks · reward +100 ⭐ +75 XP
        </p>
        <div className="flex items-center gap-2">
          <ProgressBar percent={weeklyPercent} colorClass="bg-dusk-500" />
          <span className="flex-none text-xs font-semibold text-ink-600">
            {progress.weeklyQuestProgress}/{progress.weeklyQuestTarget}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 px-1 text-sm font-semibold text-ink-900">Achievements</p>
        <div className="space-y-2">
          {achievements.map((a) => (
            <AchievementCard key={a.key} achievement={a} progressValue={achievementValue(a)} />
          ))}
        </div>
      </div>
    </div>
  );
}
