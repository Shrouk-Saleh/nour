import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { scheduleApi } from '../api/schedule';
import { progressApi } from '../api/progress';
import { companionApi } from '../api/companion';
import { achievementsApi } from '../api/achievements';
import { houseApi } from '../api/house';
import { authApi } from '../api/auth';
import { flattenSchedule, COUNTABLE_TYPES } from '../constants/scheduleData';
import { ACHIEVEMENT_DEFINITIONS } from '../constants/achievements';
import { applyXpLocal, moodFromPercent } from '../utils/gameLogic';
import { isoDate, todayName } from '../utils/dateHelpers';
import useToast from '../hooks/useToast';

const STORAGE_KEY = 'sprout-study-planner-v1';

const DEFAULT_PROGRESS = {
  displayName: '',
  totalXp: 0,
  totalStars: 0,
  starsSpent: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastStudyDate: null,
  weeklyQuestTarget: 30,
  weeklyQuestProgress: 0,
  weeklyQuestClaimed: false,
  totalTasksCompleted: 0,
  dailyLogs: [],
  ownedShopItems: [],
  equippedShopItems: [],
};

const DEFAULT_COMPANION = {
  name: 'Sprout',
  animalType: 'dog',
  level: 1,
  currentXp: 0,
  xpToNextLevel: 100,
  foodBalance: 0,
  mood: 'sleepy',
  equippedCosmetics: [],
};

const DEFAULT_HOUSE = {
  shape: 'cottage',
  roof: 'triangle',
  door: 'classic',
  windows: 'square',
  colorScheme: 'wood',
  decorations: [],
  dogAccessories: [],
};

function loadCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCache(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        tasks: state.tasks,
        progress: state.progress,
        companion: state.companion,
        achievements: state.achievements,
        house: state.house,
        savedAt: Date.now(),
      })
    );
  } catch {
    // storage full or unavailable — fail silently, in-memory state still works
  }
}

function taskKey(task) {
  return task._id || task.id;
}

function isCountable(task) {
  return COUNTABLE_TYPES.includes(task.type);
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const cache = useRef(loadCache()).current;

  const [tasks, setTasks] = useState(cache?.tasks || flattenSchedule());
  const [progress, setProgress] = useState(cache?.progress || DEFAULT_PROGRESS);
  const [companion, setCompanion] = useState(cache?.companion || DEFAULT_COMPANION);
  const [house, setHouse] = useState(cache?.house || DEFAULT_HOUSE);
  const [achievements, setAchievements] = useState(cache?.achievements || ACHIEVEMENT_DEFINITIONS.map((a) => ({ ...a, unlocked: false, unlockedAt: null })));
  
  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem('sprout-user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const userId = user?._id;

  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(navigator.onLine);
  const [usingServer, setUsingServer] = useState(false);
  const pendingQueue = useRef(new Set());

  const toast = useToast();
  const [levelUpInfo, setLevelUpInfo] = useState(null); // { level, name, emoji }
  const [celebration, setCelebration] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);

  // ---- initial load ----
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [scheduleRes, progressRes, companionRes, achievementsRes, houseRes] = await Promise.all([
          scheduleApi.getAll(),
          progressApi.get(),
          companionApi.get(),
          achievementsApi.getAll(),
          houseApi.get(),
        ]);
        if (cancelled) return;

        setTasks(scheduleRes);
        setProgress(progressRes.progress);
        setCompanion(companionRes);
        setHouse(houseRes);
        setAchievements(achievementsRes.length ? achievementsRes : achievements);
        setUsingServer(true);
      } catch (err) {
        if (!cancelled) setUsingServer(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // ---- persist to localStorage on every change ----
  useEffect(() => {
    saveCache({ tasks, progress, companion, achievements, house });
  }, [tasks, progress, companion, achievements, house]);

  // ---- online/offline tracking + retry queue ----
  useEffect(() => {
    function goOnline() {
      setOnline(true);
      retryPending();
    }
    function goOffline() {
      setOnline(false);
    }
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retryPending = useCallback(async () => {
    const ids = Array.from(pendingQueue.current);
    for (const id of ids) {
      const task = tasks.find((t) => taskKey(t) === id);
      if (!task) {
        pendingQueue.current.delete(id);
        continue;
      }
      const today = isoDate();
      const completedNow = task.completedDates.includes(today);
      try {
        const res = await scheduleApi.complete(id, completedNow);
        reconcileFromServer(res);
        pendingQueue.current.delete(id);
      } catch {
        // still offline / still failing, leave queued
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  function reconcileFromServer(res) {
    setTasks((prev) => prev.map((t) => (taskKey(t) === taskKey(res.task) ? res.task : t)));
    setProgress(res.progress);
    setCompanion(res.companion);
    setUsingServer(true);
  }

  // ---- local achievement check (mirrors server logic, best-effort offline) ----
  function checkAchievementsLocal(nextProgress) {
    let newlyUnlocked = null;
    const updated = achievements.map((a) => {
      if (a.unlocked) return a;
      let value = 0;
      if (a.metric === 'tasksCompleted') value = nextProgress.totalTasksCompleted;
      if (a.metric === 'streak') value = nextProgress.currentStreak;
      if (a.metric === 'stars') value = nextProgress.totalStars;
      if (a.metric === 'daysActive') value = nextProgress.dailyLogs.length;
      if (a.metric === 'perfectWeeks') {
        value = nextProgress.dailyLogs.filter((d) => d.perfectDay).length >= 7 ? 1 : 0;
      }
      if (value >= a.goal) {
        newlyUnlocked = { ...a, unlocked: true, unlockedAt: new Date().toISOString() };
        return newlyUnlocked;
      }
      return a;
    });
    if (newlyUnlocked) setAchievements(updated);
    return newlyUnlocked;
  }

  // ---- core action: complete / uncomplete a task ----
  const completeTask = useCallback(
    async (task, completed = true) => {
      const id = taskKey(task);
      const today = isoDate();
      const alreadyDone = task.completedDates.includes(today);
      if (completed === alreadyDone) return; // no-op

      // ---- optimistic local update ----
      const nextTasks = tasks.map((t) => {
        if (taskKey(t) !== id) return t;
        const dates = completed ? [...t.completedDates, today] : t.completedDates.filter((d) => d !== today);
        return { ...t, completedDates: dates };
      });

      let nextProgress = { ...progress, dailyLogs: progress.dailyLogs.map((l) => ({ ...l })) };
      let foodGained = 0;
      let starsGained = 0;
      let perfectDay = false;

      let log = nextProgress.dailyLogs.find((d) => d.date === today);
      if (!log) {
        log = { date: today, completedTaskIds: [], foodEarned: 0, xpEarned: 0, starsEarned: 0, perfectDay: false };
        nextProgress.dailyLogs = [...nextProgress.dailyLogs, log];
        log = nextProgress.dailyLogs[nextProgress.dailyLogs.length - 1];
      }

      let nextCompanion = { ...companion };

      if (completed) {
        if (isCountable(task)) {
          foodGained = 1;
          nextCompanion.foodBalance += foodGained;
        }
        starsGained = task.stars;
        
        nextProgress.totalStars += starsGained;
        nextProgress.totalTasksCompleted += 1;
        nextProgress.weeklyQuestProgress += 1;
        log.completedTaskIds = [...log.completedTaskIds, id];
        log.foodEarned = (log.foodEarned || 0) + foodGained;
        log.starsEarned += starsGained;

        if (isCountable(task)) {
          if (nextProgress.lastStudyDate !== today) {
            if (nextProgress.lastStudyDate) {
              const gapDays = Math.round(
                (new Date(today) - new Date(nextProgress.lastStudyDate)) / 86400000
              );
              nextProgress.currentStreak = gapDays === 1 ? nextProgress.currentStreak + 1 : 1;
            } else {
              nextProgress.currentStreak = 1;
            }
            nextProgress.lastStudyDate = today;
            if (nextProgress.currentStreak > nextProgress.bestStreak) {
              nextProgress.bestStreak = nextProgress.currentStreak;
            }
          }
        }

        const dayName = task.day;
        const countableToday = nextTasks.filter((t) => t.day === dayName && isCountable(t));
        const allDone = countableToday.every((t) => t.completedDates.includes(today));
        if (allDone && !log.perfectDay) {
          log.perfectDay = true;
          perfectDay = true;
          nextCompanion.foodBalance += 3;
          nextProgress.totalStars += 50;
          log.foodEarned = (log.foodEarned || 0) + 3;
          log.starsEarned += 50;
          foodGained += 3;
          starsGained += 50;
        }

        if (
          nextProgress.weeklyQuestProgress >= nextProgress.weeklyQuestTarget &&
          !nextProgress.weeklyQuestClaimed
        ) {
          nextProgress.weeklyQuestClaimed = true;
          nextCompanion.foodBalance += 5;
          nextProgress.totalStars += 100;
          foodGained += 5;
          starsGained += 100;
        }
      } else {
        nextProgress.totalTasksCompleted = Math.max(0, nextProgress.totalTasksCompleted - 1);
        nextProgress.weeklyQuestProgress = Math.max(0, nextProgress.weeklyQuestProgress - 1);
        
        nextProgress.totalStars = Math.max(0, nextProgress.totalStars - task.stars);
        nextCompanion.foodBalance = Math.max(0, nextCompanion.foodBalance - (isCountable(task) ? 1 : 0));
        
        if (log) {
          log.completedTaskIds = log.completedTaskIds.filter((tid) => tid !== id);
          log.foodEarned = Math.max(0, (log.foodEarned || 0) - (isCountable(task) ? 1 : 0));
          log.starsEarned = Math.max(0, log.starsEarned - task.stars);
          log.perfectDay = false;
        }
      }



      const dayName = task.day;
      const countableTodayAll = nextTasks.filter((t) => t.day === dayName && isCountable(t));
      const doneTodayCount = countableTodayAll.filter((t) => t.completedDates.includes(today)).length;
      const percent = countableTodayAll.length ? Math.round((doneTodayCount / countableTodayAll.length) * 100) : 0;
      nextCompanion = { ...nextCompanion, mood: moodFromPercent(percent) };

      setTasks(nextTasks);
      setProgress(nextProgress);
      setCompanion(nextCompanion);

      if (completed) {
        if (foodGained > 0) toast.push({ kind: 'info', message: `+${foodGained} 🍖 Pet Food` });
        if (starsGained > 0) toast.push({ kind: 'stars', message: `+${starsGained} ⭐` });
        
        if (perfectDay) setCelebration(true);
        const unlocked = checkAchievementsLocal(nextProgress);
        if (unlocked) setUnlockedAchievement(unlocked);
      }

      // ---- sync with backend ----
      try {
        const res = await scheduleApi.complete(id, completed);
        reconcileFromServer(res);
        if (res.perfectDay && !perfectDay) setCelebration(true);
        if (res.unlockedAchievements?.length) {
          setAchievements((prev) =>
            prev.map((a) => res.unlockedAchievements.find((u) => u.key === a.key) || a)
          );
          setUnlockedAchievement(res.unlockedAchievements[0]);
        }
      } catch {
        pendingQueue.current.add(id);
        toast.push({ kind: 'info', message: "Saved on your device — we'll sync when you're back online." });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks, progress, companion, achievements]
  );

  // ---- schedule editing ----
  const addTask = useCallback(async (taskData) => {
    const tempId = `local-${Date.now()}`;
    const optimistic = { ...taskData, _id: tempId, id: tempId, completedDates: [] };
    setTasks((prev) => [...prev, optimistic]);
    try {
      const created = await scheduleApi.create(taskData);
      setTasks((prev) => prev.map((t) => (taskKey(t) === tempId ? created : t)));
    } catch {
      toast.push({ kind: 'info', message: 'Task saved locally — will sync when online.' });
    }
  }, [toast]);

  const editTask = useCallback(async (id, updates) => {
    setTasks((prev) => prev.map((t) => (taskKey(t) === id ? { ...t, ...updates } : t)));
    try {
      const updated = await scheduleApi.update(id, updates);
      setTasks((prev) => prev.map((t) => (taskKey(t) === id ? updated : t)));
    } catch {
      toast.push({ kind: 'info', message: 'Changes saved locally — will sync when online.' });
    }
  }, [toast]);

  const removeTask = useCallback(async (id) => {
    setTasks((prev) => prev.filter((t) => taskKey(t) !== id));
    try {
      await scheduleApi.remove(id);
    } catch {
      toast.push({ kind: 'info', message: 'Deleted locally — will sync when online.' });
    }
  }, [toast]);

  // ---- settings actions ----
  const resetTodayProgress = useCallback(async () => {
    const today = isoDate();
    setTasks((prev) =>
      prev.map((t) => ({ ...t, completedDates: t.completedDates.filter((d) => d !== today) }))
    );
    setProgress((prev) => ({ ...prev, dailyLogs: prev.dailyLogs.filter((d) => d.date !== today) }));
    try {
      const updated = await progressApi.resetToday();
      setProgress(updated);
    } catch {
      /* local reset already applied */
    }
  }, []);

  const resetAllProgress = useCallback(async () => {
    setTasks((prev) => prev.map((t) => ({ ...t, completedDates: [] })));
    setProgress(DEFAULT_PROGRESS);
    setCompanion(DEFAULT_COMPANION);
    setHouse(DEFAULT_HOUSE);
    setAchievements(ACHIEVEMENT_DEFINITIONS.map((a) => ({ ...a, unlocked: false, unlockedAt: null })));
    try {
      await progressApi.resetAll();
    } catch {
      /* local reset already applied */
    }
  }, []);

  const buyShopItem = useCallback(
    async (item) => {
      if (progress.ownedShopItems.includes(item.key)) return;
      if (progress.totalStars < item.cost) {
        toast.push({ kind: 'info', message: `Not enough stars yet — need ${item.cost - progress.totalStars} more.` });
        return;
      }
      const nextProgress = {
        ...progress,
        totalStars: progress.totalStars - item.cost,
        starsSpent: progress.starsSpent + item.cost,
        ownedShopItems: [...progress.ownedShopItems, item.key],
      };
      setProgress(nextProgress);
      toast.push({ kind: 'stars', message: `Unlocked ${item.name}!` });
      try {
        await progressApi.update({
          totalStars: nextProgress.totalStars,
          ownedShopItems: nextProgress.ownedShopItems,
        });
      } catch {
        /* stays local, synced later via full progress reload */
      }
    },
    [progress, toast]
  );

  const equipCosmetic = useCallback(
    async (key) => {
      const has = companion.equippedCosmetics.includes(key);
      const nextCosmetics = has
        ? companion.equippedCosmetics.filter((k) => k !== key)
        : [...companion.equippedCosmetics, key];
      setCompanion((prev) => ({ ...prev, equippedCosmetics: nextCosmetics }));
      try {
        await companionApi.update({ equippedCosmetics: nextCosmetics });
      } catch {
        /* stays local */
      }
    },
    [companion]
  );

  const setDisplayName = useCallback(async (displayName) => {
    setProgress((prev) => ({ ...prev, displayName }));
    try {
      await progressApi.update({ displayName });
    } catch {
      /* stays local */
    }
  }, []);

  const renameCompanion = useCallback(async (name) => {
    setCompanion((prev) => ({ ...prev, name }));
    try {
      await companionApi.update({ name });
    } catch {
      /* stays local */
    }
  }, []);

  const changeAnimal = useCallback(async (animalType) => {
    setCompanion((prev) => ({ ...prev, animalType }));
    try {
      await companionApi.update({ animalType });
    } catch {
      /* stays local */
    }
  }, []);

  const feedPet = useCallback(async () => {
    if (companion.foodBalance <= 0) return;
    
    // Optimistic UI update
    let nextCompanion = { ...companion, foodBalance: companion.foodBalance - 1 };
    const xpGained = 25;
    const result = applyXpLocal(nextCompanion, xpGained);
    nextCompanion = result.companion;
    
    setCompanion(nextCompanion);
    toast.push({ kind: 'xp', message: `+${xpGained} XP` });
    if (result.leveledUp) {
      setLevelUpInfo({ level: nextCompanion.level });
    }

    try {
      const res = await companionApi.feed();
      setCompanion(res);
    } catch (err) {
      // Revert if it fails or just show toast
      toast.push({ kind: 'error', message: 'Failed to feed pet online' });
    }
  }, [companion, toast]);

  const waterPlant = useCallback(async () => {
    try {
      const res = await companionApi.water();
      setCompanion(res);
      toast.push({ kind: 'info', message: 'Watered! 💧' });
    } catch (err) {
      toast.push({ kind: 'error', message: err.message || 'Error watering' });
    }
  }, [toast]);

  const harvestPlant = useCallback(async () => {
    try {
      const res = await companionApi.harvest();
      // The apiClient returns the parsed body directly
      // Server sends: { success: true, data: companion, reward: { food, flower, isNew } }
      // apiClient returns body?.data ?? body, so we need to check shape
      const companion = res._id ? res : (res.data || res);
      const reward = res.reward || {};
      setCompanion(companion);

      if (reward.flower) {
        const isNew = reward.isNew;
        toast.push({
          kind: 'xp',
          message: `${isNew ? '🆕 جديدة! ' : ''}${reward.flower.emoji} ${reward.flower.arabicName} + 10 أكل ✨`,
        });
      } else {
        toast.push({ kind: 'info', message: `تم الحصاد! +10 أكل ✨` });
      }
    } catch (err) {
      toast.push({ kind: 'error', message: err.message || 'Error harvesting' });
    }
  }, [toast]);

  const updateHouse = useCallback(async (updates) => {
    setHouse((prev) => ({ ...prev, ...updates }));
    try {
      await houseApi.update(updates);
    } catch {
      /* stays local */
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem('sprout-token', res.token);
      localStorage.setItem('sprout-user', JSON.stringify(res));
      setUser(res);
      return true;
    } catch {
      return false;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const res = await authApi.register(name, email, password);
      localStorage.setItem('sprout-token', res.token);
      localStorage.setItem('sprout-user', JSON.stringify(res));
      setUser(res);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sprout-token');
    localStorage.removeItem('sprout-user');
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setTasks([]);
    setProgress(DEFAULT_PROGRESS);
    setCompanion(DEFAULT_COMPANION);
    setHouse(DEFAULT_HOUSE);
  }, []);

  // ---- derived data ----
  const today = todayName();
  const todayTasks = useMemo(
    () => tasks.filter((t) => t.day === today).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [tasks, today]
  );
  const todayCountable = useMemo(() => todayTasks.filter(isCountable), [todayTasks]);
  const todayCompletedCount = useMemo(() => {
    const iso = isoDate();
    return todayCountable.filter((t) => t.completedDates.includes(iso)).length;
  }, [todayCountable]);
  const todayPercent = todayCountable.length
    ? Math.round((todayCompletedCount / todayCountable.length) * 100)
    : 0;

  const nextTask = useMemo(() => {
    const iso = isoDate();
    return todayTasks.find((t) => isCountable(t) && !t.completedDates.includes(iso)) || null;
  }, [todayTasks]);

  const value = {
    tasks,
    progress,
    companion,
    house,
    achievements,
    loading,
    online,
    usingServer,
    today,
    todayTasks,
    todayCountable,
    todayCompletedCount,
    todayPercent,
    nextTask,
    toast,
    levelUpInfo,
    setLevelUpInfo,
    celebration,
    setCelebration,
    unlockedAchievement,
    setUnlockedAchievement,
    completeTask,
    addTask,
    editTask,
    removeTask,
    resetTodayProgress,
    resetAllProgress,
    buyShopItem,
    equipCosmetic,
    renameCompanion,
    changeAnimal,
    feedPet,
    waterPlant,
    harvestPlant,
    setDisplayName,
    updateHouse,
    user,
    login,
    register,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
