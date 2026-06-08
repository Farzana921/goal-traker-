import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { lsGet, lsSet, STORAGE_KEYS } from "@/lib/storage";
import { getDict, type Dict } from "@/lib/i18n";
import { levelFromXP } from "@/lib/xp";
import { isoDay, daysBetween } from "@/lib/utils-date";
import type { Goal, Language, ProgressLog, Settings, Theme, UserState } from "@/types";

interface AppContextValue {
  goals: Goal[];
  user: UserState;
  settings: Settings;
  t: Dict;
  setLanguage: (l: Language) => void;
  setTheme: (t: Theme) => void;
  createGoal: (g: Omit<Goal, "id" | "createdAt" | "logs" | "status" | "current">) => Goal;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  pauseGoal: (id: string) => void;
  resumeGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  addProgress: (id: string, amount: number, notes?: string) => void;
  resetAll: () => void;
  level: ReturnType<typeof levelFromXP>;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_USER: UserState = { xp: 0, streak: 0, longestStreak: 0, achievements: [] };
const DEFAULT_SETTINGS: Settings = { language: "en", theme: "light" };

function seed(): Goal[] {
  const today = isoDay();
  return [
    {
      id: crypto.randomUUID(),
      title: "Read 30 minutes daily",
      description: "Build a steady reading habit.",
      category: "Reading",
      type: "daily",
      target: 30,
      current: 18,
      startDate: today,
      color: "#7A9B76",
      icon: "BookOpen",
      status: "active",
      createdAt: new Date().toISOString(),
      logs: [
        { id: crypto.randomUUID(), date: new Date(Date.now() - 86400000 * 2).toISOString(), amount: 8, notes: "" },
        { id: crypto.randomUUID(), date: new Date(Date.now() - 86400000).toISOString(), amount: 10, notes: "Great chapter" },
      ],
    },
    {
      id: crypto.randomUUID(),
      title: "Run 50 km this month",
      category: "Fitness",
      type: "count",
      target: 50,
      current: 22,
      startDate: today,
      color: "#CBB89C",
      icon: "Activity",
      status: "active",
      createdAt: new Date().toISOString(),
      logs: [
        { id: crypto.randomUUID(), date: new Date(Date.now() - 86400000 * 3).toISOString(), amount: 5 },
        { id: crypto.randomUUID(), date: new Date(Date.now() - 86400000).toISOString(), amount: 7 },
      ],
    },
    {
      id: crypto.randomUUID(),
      title: "Learn TypeScript basics",
      category: "Education",
      type: "count",
      target: 10,
      current: 10,
      startDate: today,
      color: "#D6A95A",
      icon: "GraduationCap",
      status: "completed",
      completedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      logs: [],
    },
  ];
}

function checkAchievements(prev: UserState, goals: Goal[]): string[] {
  const set = new Set(prev.achievements);
  if (goals.length >= 1) set.add("first_goal");
  if (prev.streak >= 7) set.add("streak_7");
  if (prev.streak >= 30) set.add("streak_30");
  if (goals.filter((g) => g.status === "completed").length >= 10) set.add("goal_master");
  if (levelFromXP(prev.xp).level >= 10) set.add("champion");
  return Array.from(set);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(() => lsGet<Goal[] | null>(STORAGE_KEYS.goals, null) ?? seed());
  const [user, setUser] = useState<UserState>(() => lsGet<UserState>(STORAGE_KEYS.user, DEFAULT_USER));
  const [settings, setSettings] = useState<Settings>(() => lsGet<Settings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS));

  // persistence
  useEffect(() => lsSet(STORAGE_KEYS.goals, goals), [goals]);
  useEffect(() => lsSet(STORAGE_KEYS.user, user), [user]);
  useEffect(() => lsSet(STORAGE_KEYS.settings, settings), [settings]);

  // theme + dir
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", settings.theme === "dark");
    root.setAttribute("dir", settings.language === "fa" ? "rtl" : "ltr");
    root.setAttribute("lang", settings.language);
  }, [settings]);

  const t = getDict(settings.language);
  const level = useMemo(() => levelFromXP(user.xp), [user.xp]);

  function awardXP(delta: number, opts: { activity?: boolean } = {}) {
    setUser((u) => {
      let { xp, streak, longestStreak, lastActivityDate } = u;
      xp += delta;
      if (opts.activity) {
        const today = isoDay();
        if (lastActivityDate !== today) {
          const diff = lastActivityDate ? daysBetween(lastActivityDate, today) : 1;
          if (diff === 1) {
            streak += 1;
            xp += 10;
          } else {
            streak = 1;
          }
          longestStreak = Math.max(longestStreak, streak);
          lastActivityDate = today;
        }
      }
      const next: UserState = { ...u, xp, streak, longestStreak, lastActivityDate };
      next.achievements = checkAchievements(next, goals);
      return next;
    });
  }

  const value: AppContextValue = {
    goals,
    user,
    settings,
    t,
    level,
    setLanguage: (l) => setSettings((s) => ({ ...s, language: l })),
    setTheme: (th) => setSettings((s) => ({ ...s, theme: th })),
    createGoal: (g) => {
      const goal: Goal = {
        ...g,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        logs: [],
        status: "active",
        current: 0,
      };
      setGoals((arr) => [goal, ...arr]);
      setUser((u) => ({ ...u, achievements: checkAchievements(u, [goal, ...goals]) }));
      return goal;
    },
    updateGoal: (id, patch) => setGoals((arr) => arr.map((g) => (g.id === id ? { ...g, ...patch } : g))),
    deleteGoal: (id) => setGoals((arr) => arr.filter((g) => g.id !== id)),
    pauseGoal: (id) => setGoals((arr) => arr.map((g) => (g.id === id ? { ...g, status: "paused" } : g))),
    resumeGoal: (id) => setGoals((arr) => arr.map((g) => (g.id === id ? { ...g, status: "active" } : g))),
    completeGoal: (id) => {
      setGoals((arr) =>
        arr.map((g) => (g.id === id ? { ...g, status: "completed", completedAt: new Date().toISOString(), current: g.target } : g)),
      );
      awardXP(100);
    },
    addProgress: (id, amount, notes) => {
      const log: ProgressLog = { id: crypto.randomUUID(), date: new Date().toISOString(), amount, notes };
      setGoals((arr) =>
        arr.map((g) => {
          if (g.id !== id) return g;
          const newCurrent = Math.min(g.target, g.current + amount);
          const completed = newCurrent >= g.target;
          return {
            ...g,
            current: newCurrent,
            logs: [log, ...g.logs],
            status: completed ? "completed" : g.status,
            completedAt: completed ? new Date().toISOString() : g.completedAt,
          };
        }),
      );
      awardXP(20, { activity: true });
      const goal = goals.find((x) => x.id === id);
      if (goal && goal.current + amount >= goal.target && goal.status !== "completed") {
        awardXP(100);
      }
    },
    resetAll: () => {
      setGoals([]);
      setUser(DEFAULT_USER);
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}