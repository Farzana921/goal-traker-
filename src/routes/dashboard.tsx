import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/StatCard";
import { GoalCard } from "@/components/GoalCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  CheckCircle2,
  Flame,
  Sparkles,
  Plus,
  ArrowRight,
  Trophy,
  TrendingUp,
  Award,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — GoalForge" },
      { name: "description", content: "Your productivity dashboard with goals, streaks and XP." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { goals, user, level, t } = useApp();

  const active = goals.filter((g) => g.status === "active");
  const completed = goals.filter((g) => g.status === "completed");
  const totalProgress = goals.length
    ? Math.round(goals.reduce((s, g) => s + Math.min(100, (g.current / g.target) * 100), 0) / goals.length)
    : 0;

  const last14 = useMemo(() => {
    const days: { day: string; progress: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      let count = 0;
      goals.forEach((g) => g.logs.forEach((l) => l.date.startsWith(key) && (count += l.amount)));
      days.push({ day: d.toLocaleDateString(undefined, { weekday: "short" }), progress: count });
    }
    return days;
  }, [goals]);

  const xpSeries = useMemo(() => {
    let acc = 0;
    const all = goals.flatMap((g) => g.logs.map((l) => ({ date: l.date, xp: 20 })));
    all.sort((a, b) => a.date.localeCompare(b.date));
    return all.slice(-12).map((p) => {
      acc += p.xp;
      return { date: new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }), xp: acc };
    });
  }, [goals]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    goals.forEach((g) => map.set(g.category, (map.get(g.category) ?? 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [goals]);

  const COLORS = ["#CBB89C", "#7A9B76", "#D6A95A", "#D97A7A", "#D8CFC6", "#6B6B6B"];

  const achievementsAll = [
    { id: "first_goal", icon: Target },
    { id: "streak_7", icon: Flame },
    { id: "streak_30", icon: Flame },
    { id: "goal_master", icon: Trophy },
    { id: "champion", icon: Award },
  ] as const;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-8">
      {/* Welcome */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t.dashboard.welcome}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.dashboard.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/goals">{t.dashboard.viewAll}</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link to="/goals/new">
              <Plus className="me-1.5 h-4 w-4" /> {t.nav.newGoal}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t.dashboard.totalGoals} value={goals.length} icon={Target} />
        <StatCard label={t.dashboard.activeGoals} value={active.length} icon={TrendingUp} tone="primary" />
        <StatCard label={t.dashboard.completedGoals} value={completed.length} icon={CheckCircle2} tone="success" />
        <StatCard label={t.dashboard.currentStreak} value={`${user.streak} ${t.dashboard.streakDays}`} icon={Flame} tone="warning" />
      </div>

      {/* Level + Overall */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.dashboard.overallProgress}</p>
              <p className="mt-1 text-4xl font-semibold tracking-tight">{totalProgress}%</p>
            </div>
            <Badge variant="secondary" className="rounded-full">
              {goals.length} {t.dashboard.totalGoals.toLowerCase()}
            </Badge>
          </div>
          <Progress value={totalProgress} className="mt-4 h-2 bg-secondary [&>div]:bg-primary" />
          <div className="mt-6 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last14}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CBB89C" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#CBB89C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E1DB" />
                <XAxis dataKey="day" stroke="#6B6B6B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B6B6B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #D8CFC6", background: "#fff" }} />
                <Area type="monotone" dataKey="progress" stroke="#CBB89C" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-gradient-to-br from-primary/30 to-accent/40 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card shadow-sm">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.dashboard.level}</p>
              <p className="text-2xl font-semibold">Lvl {level.level}</p>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{user.xp} XP</span>
              <span>{level.into} / {level.next}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-card/70">
              <div className="h-full rounded-full bg-foreground/80 transition-all" style={{ width: `${level.pct}%` }} />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-card/70 p-3">
              <p className="text-xs text-muted-foreground">{t.dashboard.totalXP}</p>
              <p className="mt-0.5 text-base font-semibold">{user.xp}</p>
            </div>
            <div className="rounded-xl bg-card/70 p-3">
              <p className="text-xs text-muted-foreground">{t.dashboard.currentStreak}</p>
              <p className="mt-0.5 text-base font-semibold">{user.streak}</p>
            </div>
            <div className="rounded-xl bg-card/70 p-3">
              <p className="text-xs text-muted-foreground">{t.dashboard.longestStreak}</p>
              <p className="mt-0.5 text-base font-semibold">{user.longestStreak}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
          <h2 className="text-sm font-semibold">{t.dashboard.categoryDistribution}</h2>
          <div className="mt-4 h-56">
            {categoryData.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">—</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #D8CFC6", background: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categoryData.map((c, i) => (
              <Badge key={c.name} variant="secondary" className="rounded-full">
                <span className="me-1.5 inline-block h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {c.name} · {c.value}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
          <h2 className="text-sm font-semibold">{t.dashboard.xpGrowth}</h2>
          <div className="mt-4 h-56">
            {xpSeries.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">{t.dashboard.noActivity}</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={xpSeries}>
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7A9B76" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#7A9B76" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E1DB" />
                  <XAxis dataKey="date" stroke="#6B6B6B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B6B6B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #D8CFC6", background: "#fff" }} />
                  <Area type="monotone" dataKey="xp" stroke="#7A9B76" strokeWidth={2} fill="url(#g2)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Active goals */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">{t.dashboard.activeGoalsTitle}</h2>
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/goals">
              {t.dashboard.viewAll} <ArrowRight className="ms-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {active.length === 0 ? (
          <EmptyState
            icon={Target}
            title={t.dashboard.noGoals}
            description={t.dashboard.noGoalsDesc}
            action={
              <Button asChild className="rounded-full">
                <Link to="/goals/new">
                  <Plus className="me-1.5 h-4 w-4" /> {t.nav.newGoal}
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {active.slice(0, 6).map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <h2 className="text-sm font-semibold">{t.dashboard.achievements}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {achievementsAll.map((a) => {
            const unlocked = user.achievements.includes(a.id);
            const data = (t.achievements as Record<string, string>);
            return (
              <div
                key={a.id}
                className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                  unlocked
                    ? "border-primary/40 bg-primary/10"
                    : "border-dashed border-border bg-secondary/40 opacity-60"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    unlocked ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                  }`}
                >
                  <a.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{data[a.id]}</p>
                  <p className="truncate text-xs text-muted-foreground">{data[`${a.id}_desc`]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}