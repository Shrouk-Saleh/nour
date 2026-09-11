import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import ToastContainer from './components/ToastContainer';
import LevelUpModal from './components/LevelUpModal';
import CelebrationOverlay from './components/CelebrationOverlay';
import Home from './pages/Home';
import Schedule from './pages/Schedule';

import ProgressPage from './pages/Progress';
import SettingsPage from './pages/Settings';
import EditTaskSheet from './pages/EditTaskSheet';
import Login from './pages/Login';
import Register from './pages/Register';
import MyWorld from './pages/MyWorld';
import FlowerBook from './pages/FlowerBook';

function Shell() {
  const [tab, setTab] = useState('home');
  const [editTask, setEditTask] = useState(null); // task object or null
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetDefaultDay, setSheetDefaultDay] = useState('saturday');

  const {
    loading,
    toast,
    levelUpInfo,
    setLevelUpInfo,
    celebration,
    setCelebration,
    unlockedAchievement,
    setUnlockedAchievement,
    addTask,
    editTask: saveEditedTask,
    removeTask,
    user,
  } = useApp();

  function openAddTask(day) {
    setEditTask(null);
    setSheetDefaultDay(day);
    setSheetOpen(true);
  }

  function openEditTask(task) {
    setEditTask(task);
    setSheetOpen(true);
  }

  function handleSaveTask(data) {
    if (editTask) {
      saveEditedTask(editTask._id || editTask.id, data);
    } else {
      addTask(data);
    }
  }

  function handleDeleteTask(task) {
    if (task) removeTask(task._id || task.id);
  }

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-pulse rounded-full bg-sprout-300" />
          <p className="text-sm text-ink-600">Waking up your study world…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authMode === 'login') {
      return <Login onSwitch={() => setAuthMode('register')} />;
    }
    return <Register onSwitch={() => setAuthMode('login')} />;
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-paper-50 pb-24">
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
      <LevelUpModal level={levelUpInfo?.level} onClose={() => setLevelUpInfo(null)} />
      <CelebrationOverlay show={celebration} onDone={() => setCelebration(false)} />

      {unlockedAchievement && (
        <div
          className="fixed inset-x-4 top-16 z-50 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card"
          onClick={() => setUnlockedAchievement(null)}
        >
          <span className="text-2xl">{unlockedAchievement.icon}</span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-500">Achievement unlocked</p>
            <p className="truncate text-sm font-semibold text-ink-900">{unlockedAchievement.title}</p>
          </div>
        </div>
      )}

      {tab === 'home' && <Home onGoSchedule={() => setTab('schedule')} />}
      {tab === 'schedule' && <Schedule onEditTask={openEditTask} onAddTask={openAddTask} />}

      {tab === 'myworld' && <MyWorld />}
      {tab === 'garden' && <FlowerBook />}
      {tab === 'progress' && <ProgressPage />}
      {tab === 'settings' && <SettingsPage onGoCompanion={() => setTab('myworld')} />}

      <EditTaskSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        task={editTask}
        defaultDay={sheetDefaultDay}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
