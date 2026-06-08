import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { GoalCard } from "@/components/GoalCard";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Target, LayoutGrid, List } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/goals/")({
  head: () => ({
    meta: [
      { title: "Goals — GoalForge" },
      { name: "description", content: "Browse, search and manage all your goals." },
    ],
  }),
  component: GoalsPage,
});

type Filter = "all" | "active" | "completed" | "paused";
type Sort = "newest" | "oldest" | "progress" | "category";

function GoalsPage() {
  const { goals, t } = useApp();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let arr = goals.filter((g) => g.title.toLowerCase().includes(q.toLowerCase()));
    if (filter !== "all") arr = arr.filter((g) => g.status === filter);
    arr = [...arr].sort((a, b) => {
      if (sort === "newest") return b.createdAt.localeCompare(a.createdAt);
      if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
      if (sort === "progress") return b.current / b.target - a.current / a.target;
      return a.category.localeCompare(b.category);
    });
    return arr;
  }, [goals, q, filter, sort]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t.goals.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.goals.subtitle}</p>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/goals/new">
            <Plus className="me-1.5 h-4 w-4" /> {t.goals.newGoal}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.goals.search}
            className="rounded-xl border-transparent bg-secondary/60 ps-9"
          />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList className="rounded-xl bg-secondary/60">
            <TabsTrigger value="all" className="rounded-lg">{t.goals.filterAll}</TabsTrigger>
            <TabsTrigger value="active" className="rounded-lg">{t.goals.filterActive}</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg">{t.goals.filterCompleted}</TabsTrigger>
            <TabsTrigger value="paused" className="rounded-lg">{t.goals.filterPaused}</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
          <SelectTrigger className="w-[150px] rounded-xl border-transparent bg-secondary/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t.goals.sortNewest}</SelectItem>
            <SelectItem value="oldest">{t.goals.sortOldest}</SelectItem>
            <SelectItem value="progress">{t.goals.sortProgress}</SelectItem>
            <SelectItem value="category">{t.goals.sortCategory}</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 rounded-xl bg-secondary/60 p-1">
          <Button
            size="icon"
            variant={view === "grid" ? "default" : "ghost"}
            className="h-8 w-8 rounded-lg"
            onClick={() => setView("grid")}
            aria-label={t.goals.grid}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={view === "list" ? "default" : "ghost"}
            className="h-8 w-8 rounded-lg"
            onClick={() => setView("list")}
            aria-label={t.goals.list}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Target}
          title={t.goals.empty}
          action={
            <Button asChild className="rounded-full">
              <Link to="/goals/new">
                <Plus className="me-1.5 h-4 w-4" /> {t.goals.newGoal}
              </Link>
            </Button>
          }
        />
      ) : (
        <div className={view === "grid" ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-3"}>
          {filtered.map((g) => (
            <GoalCard key={g.id} goal={g} view={view} />
          ))}
        </div>
      )}
    </div>
  );
}