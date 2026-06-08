import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, Pause, Play, Pencil, Trash2, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/context/AppContext";
import type { Goal } from "@/types";
import { toast } from "sonner";

export function GoalCard({ goal, view = "grid" }: { goal: Goal; view?: "grid" | "list" }) {
  const { t, pauseGoal, resumeGoal, deleteGoal, addProgress } = useApp();
  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));

  const statusColors = {
    active: "bg-success/15 text-success border-success/30",
    completed: "bg-primary/20 text-foreground border-primary/40",
    paused: "bg-warning/20 text-warning border-warning/30",
  } as const;

  return (
    <Card
      className={`group relative overflow-hidden rounded-2xl border-border/60 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        view === "list" ? "flex items-center gap-6" : ""
      }`}
    >
      <div className={view === "list" ? "flex-1" : ""}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: goal.color }} />
              <Badge variant="secondary" className="rounded-full text-[10px] font-medium">
                {goal.category}
              </Badge>
              <Badge variant="outline" className={`rounded-full text-[10px] ${statusColors[goal.status]}`}>
                {t.goal[goal.status]}
              </Badge>
            </div>
            <Link to="/goals/$id" params={{ id: goal.id }} className="mt-2 block">
              <h3 className="truncate text-base font-semibold tracking-tight hover:underline">{goal.title}</h3>
            </Link>
            {goal.description && (
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{goal.description}</p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  addProgress(goal.id, 1);
                  toast.success(t.toast.progressAdded);
                }}
              >
                <Plus className="me-2 h-4 w-4" /> {t.goal.addProgress}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/goals/$id" params={{ id: goal.id }}>
                  <Pencil className="me-2 h-4 w-4" /> {t.goal.edit}
                </Link>
              </DropdownMenuItem>
              {goal.status === "paused" ? (
                <DropdownMenuItem
                  onSelect={() => {
                    resumeGoal(goal.id);
                    toast(t.toast.resumed);
                  }}
                >
                  <Play className="me-2 h-4 w-4" /> {t.goal.resume}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onSelect={() => {
                    pauseGoal(goal.id);
                    toast(t.toast.paused);
                  }}
                >
                  <Pause className="me-2 h-4 w-4" /> {t.goal.pause}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => {
                  if (confirm(t.goal.confirmDelete)) {
                    deleteGoal(goal.id);
                    toast(t.toast.deleted);
                  }
                }}
              >
                <Trash2 className="me-2 h-4 w-4" /> {t.goal.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t.goal.progress}</span>
            <span className="font-medium tabular-nums">
              {goal.current} / {goal.target} · {pct}%
            </span>
          </div>
          <Progress value={pct} className="h-2 bg-secondary [&>div]:bg-primary" />
        </div>
      </div>
    </Card>
  );
}