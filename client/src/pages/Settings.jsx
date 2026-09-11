import React, { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, Trash2, Wifi, WifiOff, ChevronRight, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ConfirmDialog from '../components/ConfirmDialog';

function SettingsRow({ icon: Icon, label, description, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-left shadow-card"
    >
      <div className={`flex h-9 w-9 flex-none items-center justify-center rounded-full ${danger ? 'bg-bloom-100' : 'bg-sprout-50'}`}>
        <Icon size={17} className={danger ? 'text-bloom-500' : 'text-sprout-600'} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${danger ? 'text-bloom-500' : 'text-ink-900'}`}>{label}</p>
        {description && <p className="truncate text-xs text-ink-600/70">{description}</p>}
      </div>
      <ChevronRight size={16} className="text-ink-600/40" />
    </button>
  );
}

export default function SettingsPage({ onGoCompanion }) {
  const { tasks, progress, companion, achievements, resetTodayProgress, resetAllProgress, online, setDisplayName, logout } = useApp();
  const [confirm, setConfirm] = useState(null); // 'today' | 'all' | null
  const [nameDraft, setNameDraft] = useState(progress.displayName || '');
  const fileInputRef = useRef(null);

  function handleExport() {
    const payload = { tasks, progress, companion, achievements, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.tasks && data.progress && data.companion) {
          localStorage.setItem(
            'sprout-study-planner-v1',
            JSON.stringify({
              tasks: data.tasks,
              progress: data.progress,
              companion: data.companion,
              achievements: data.achievements || [],
              savedAt: Date.now(),
            })
          );
          window.location.reload();
        }
      } catch {
        alert('That file could not be read as a backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="px-4 pb-6 pt-5">
      <h1 className="font-display text-xl font-semibold text-ink-900">Settings</h1>

      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm shadow-card">
        {online ? <Wifi size={16} className="text-sprout-600" /> : <WifiOff size={16} className="text-bloom-500" />}
        <span className="text-ink-600">{online ? 'Connected' : "Offline — changes are saved on your device"}</span>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-card">
        <label className="mb-1 block text-xs font-semibold text-ink-600">Your name</label>
        <div className="flex gap-2">
          <input
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            placeholder="What should we call you?"
            maxLength={40}
            className="flex-1 rounded-xl border border-paper-200 bg-paper-50 px-3 py-2 text-sm"
          />
          <button
            onClick={() => setDisplayName(nameDraft.trim())}
            className="rounded-xl bg-sprout-500 px-3 py-2 text-sm font-semibold text-white"
          >
            Save
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <p className="px-1 text-xs font-semibold uppercase tracking-wide text-ink-600/60">Companion</p>
        <SettingsRow icon={ChevronRight} label="Companion customization" description="Rename and equip cosmetics" onClick={onGoCompanion} />
      </div>

      <div className="mt-5 space-y-2">
        <p className="px-1 text-xs font-semibold uppercase tracking-wide text-ink-600/60">Data</p>
        <SettingsRow icon={Download} label="Export data" description="Save a backup file" onClick={handleExport} />
        <SettingsRow icon={Upload} label="Import data" description="Restore from a backup file" onClick={handleImportClick} />
        <input type="file" accept="application/json" ref={fileInputRef} onChange={handleImportFile} className="hidden" />
      </div>

      <div className="mt-5 space-y-2">
        <p className="px-1 text-xs font-semibold uppercase tracking-wide text-ink-600/60">Reset</p>
        <SettingsRow
          icon={RotateCcw}
          label="Reset today's progress"
          description="Clears today's checklist only"
          danger
          onClick={() => setConfirm('today')}
        />
        <SettingsRow
          icon={Trash2}
          label="Reset all progress"
          description="Clears XP, stars, streaks and achievements"
          danger
          onClick={() => setConfirm('all')}
        />
      </div>

      <div className="mt-5 space-y-2">
        <p className="px-1 text-xs font-semibold uppercase tracking-wide text-ink-600/60">Account</p>
        <SettingsRow
          icon={LogOut}
          label="Log out"
          description="Sign out from your account"
          danger
          onClick={() => setConfirm('logout')}
        />
      </div>

      <p className="mt-6 px-1 text-center text-xs text-ink-600/50">
        Sprout Study World — made with 🌸
      </p>

      <ConfirmDialog
        open={confirm === 'today'}
        title="Reset today's progress?"
        description="Today's checklist will be cleared. Nothing else changes."
        confirmLabel="Reset today"
        danger
        onConfirm={() => {
          resetTodayProgress();
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === 'all'}
        title="Reset all progress?"
        description="This clears your level, XP, stars, streaks and achievements. This can't be undone."
        confirmLabel="Reset everything"
        danger
        onConfirm={() => {
          resetAllProgress();
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === 'logout'}
        title="Log out?"
        description="You will need to log in again to access your study world."
        confirmLabel="Log out"
        danger
        onConfirm={() => {
          logout();
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
