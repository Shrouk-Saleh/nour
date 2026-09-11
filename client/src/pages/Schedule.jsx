import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DaySelector from '../components/DaySelector';
import TaskCard from '../components/TaskCard';
import { isoDate } from '../utils/dateHelpers';
import { DAY_LABELS_FULL } from '../constants/scheduleData';

export default function Schedule({ onEditTask, onAddTask }) {
  const { tasks, completeTask, today } = useApp();
  const [activeDay, setActiveDay] = useState(today);
  const isoToday = isoDate();

  const dayTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.day === activeDay)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.startTime.localeCompare(b.startTime)),
    [tasks, activeDay]
  );

  return (
    <div className="pb-6 pt-5">
      <div className="px-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-semibold text-ink-900">Schedule</h1>
          <button
            onClick={() => onAddTask(activeDay)}
            className="flex items-center gap-1 rounded-full bg-sprout-500 px-3 py-1.5 text-sm font-semibold text-white"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        <p className="text-sm text-ink-600">{DAY_LABELS_FULL[activeDay]}</p>
      </div>

      <div className="mt-3">
        <DaySelector activeDay={activeDay} onSelect={setActiveDay} />
      </div>

      <div className="mt-3 space-y-2 px-4">
        {dayTasks.map((task) => (
          <TaskCard
            key={task._id || task.id}
            task={task}
            isoToday={isoToday}
            onToggle={completeTask}
            onEdit={onEditTask}
          />
        ))}
        {dayTasks.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-600">No tasks yet for this day.</p>
        )}
      </div>
    </div>
  );
}
