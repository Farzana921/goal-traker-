export type GoalStatus = "active" | "completed" | "paused";
export type GoalType = "daily" | "count" | "time";

export interface ProgressLog {
  id: string;
  date: string; // ISO
  amount: number;
  notes?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: GoalType;
  target: number;
  current: number;
  startDate: string;
  endDate?: string;
  color: string;
  icon: string;
  notes?: string;
  status: GoalStatus;
  createdAt: string;
  completedAt?: string;
  logs: ProgressLog[];
}

export interface UserState {
  xp: number;
  streak: number;
  longestStreak: number;
  lastActivityDate?: string;
  achievements: string[];
}

export type Language = "en" | "fa";
export type Theme = "light" | "dark";

export interface Settings {
  language: Language;
  theme: Theme;
}