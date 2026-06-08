import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Plus, Pause, Play, CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/goals/$id")({
  head: () => ({ meta: [{ title: "Goal — GoalForge" }] }),
  component: GoalDetailPage,
});

function GoalDetailPage() {
  const { id } = Route.useParams();
  const { goals, t, addProgress, pauseGoal, resumeGoal, completeGoal, deleteGoal } = useApp();
  const navigate = useNavigate();
  const goal = goals.find((g) => g.id === id);
  const [amount, setAmount] = useState(1);
  const [logNote, setLogNote] = useState("");
  const [open, setOpen] = useState(false);

  if (!goal) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <p className="text-muted-foreground">Goal not found.</p>
        <Button asChild variant="outline" className="mt-4 rounded-full">
          <Link to="/goals">Back</Link>
        </Button>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));

  const series = (() => {
    const map = new Map<string, number>();
    [...goal.logs].reverse().forEach((l) => {
      const k = l.date.slice(0, 10);
      map.set(k, (map.get(k) ?? 0) + l.amount);
    });
    let acc = 0;
    return Array.from(map.entries()).map(([date, v]) => {
      acc += v;
      return { date: new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" }), value: acc };
    });
  })();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/goals">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: goal.color }} />
          <h1 className="text-2xl font-semibold tracking-tight">{goal.title}</h1>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full">{goal.category}</Badge>
            <Badge variant="outline" className="rounded-full">{t.goal[goal.status]}</Badge>
            <Badge variant="outline" className="rounded-full">{t.goal[`type${goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}` as "typeDaily"]}</Badge>
          </div>
          {goal.description && <p className="mt-3 text-sm text-muted-foreground">{goal.description}</p>}
          <div className="mt-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.goal.progress}</p>
                <p className="mt-1 text-4xl font-semibold tabular-nums">{pct}%</p>
              </div>
              <p className="text-sm text-muted-foreground tabular-nums">{goal.current} / {goal.target}</p>
            </div>
            <Progress value={pct} className="mt-3 h-2 bg-secondary [&>div]:bg-primary" />
          </div>

          <div className="mt-6 h-48">
            {series.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">{t.goal.noLogs}</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={goal.color} stopOpacity={0.6} />
                      <stop offset="100%" stopColor={goal.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E1DB" />
                  <XAxis dataKey="date" stroke="#6B6B6B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B6B6B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #D8CFC6", background: "#fff" }} />
                  <Area type="monotone" dataKey="value" stroke={goal.color} strokeWidth={2} fill="url(#gd)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
          <p className="text-sm font-semibold">{t.goal.summary}</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">{t.goal.created}</dt><dd>{new Date(goal.createdAt).toLocaleDateString()}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t.goal.startDate}</dt><dd>{goal.startDate}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t.goal.endDate}</dt><dd>{goal.endDate || t.goal.noDeadline}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t.goal.target}</dt><dd>{goal.target}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t.goal.progress}</dt><dd>{goal.current}</dd></div>
          </dl>

          <div className="mt-6 flex flex-col gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full" disabled={goal.status === "completed"}>
                  <Plus className="me-1.5 h-4 w-4" /> {t.goal.addProgress}
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle>{t.goal.addProgress}</DialogTitle>
                  <DialogDescription>{goal.title}</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>{t.goal.amount}</Label>
                    <Input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.goal.logNotes}</Label>
                    <Textarea value={logNote} onChange={(e) => setLogNote(e.target.value)} className="rounded-xl" rows={2} />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      addProgress(goal.id, amount, logNote || undefined);
                      setAmount(1);
                      setLogNote("");
                      setOpen(false);
                      toast.success(t.toast.progressAdded);
                    }}
                    className="rounded-full"
                  >
                    {t.goal.add}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {goal.status === "paused" ? (
              <Button variant="outline" className="rounded-full" onClick={() => { resumeGoal(goal.id); toast(t.toast.resumed); }}>
                <Play className="me-1.5 h-4 w-4" /> {t.goal.resume}
              </Button>
            ) : (
              <Button variant="outline" className="rounded-full" onClick={() => { pauseGoal(goal.id); toast(t.toast.paused); }} disabled={goal.status === "completed"}>
                <Pause className="me-1.5 h-4 w-4" /> {t.goal.pause}
              </Button>
            )}

            <Button
              variant="outline"
              className="rounded-full"
              disabled={goal.status === "completed"}
              onClick={() => { completeGoal(goal.id); toast.success(t.toast.completed); }}
            >
              <CheckCircle2 className="me-1.5 h-4 w-4" /> {t.goal.complete}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="rounded-full text-destructive hover:text-destructive">
                  <Trash2 className="me-1.5 h-4 w-4" /> {t.goal.delete}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.goal.confirmDelete}</AlertDialogTitle>
                  <AlertDialogDescription>{t.goal.confirmDeleteDesc}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">{t.goal.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      deleteGoal(goal.id);
                      toast(t.toast.deleted);
                      navigate({ to: "/goals" });
                    }}
                  >
                    {t.goal.delete}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <h2 className="text-sm font-semibold">{t.goal.timeline}</h2>
        {goal.logs.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t.goal.noLogs}</p>
        ) : (
          <ol className="relative mt-4 space-y-4 border-s border-border ps-5">
            {goal.logs.map((l) => (
              <li key={l.id} className="relative">
                <span className="absolute -start-[27px] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary" />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium">+{l.amount}</span>
                  <span className="text-xs text-muted-foreground">{new Date(l.date).toLocaleString()}</span>
                </div>
                {l.notes && <p className="mt-0.5 text-xs text-muted-foreground">{l.notes}</p>}
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}