import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FolderKanban } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "Categories — GoalForge" }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { goals, t } = useApp();

  const cats = useMemo(() => {
    return t.categoriesList.map((name) => {
      const items = goals.filter((g) => g.category === name);
      const completed = items.filter((g) => g.status === "completed").length;
      const total = items.length;
      const avg = total
        ? Math.round(items.reduce((s, g) => s + Math.min(100, (g.current / g.target) * 100), 0) / total)
        : 0;
      return { name, total, completed, avg };
    });
  }, [goals, t]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t.categories.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.categories.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cats.map((c) => (
          <Card key={c.name} className="rounded-2xl border-border/60 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <FolderKanban className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="mt-3 text-base font-semibold">{c.name}</h3>
              </div>
              <Badge variant="secondary" className="rounded-full">{c.total} {t.categories.totalGoals}</Badge>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-secondary/60 p-3">
                <dt className="text-xs text-muted-foreground">{t.categories.completed}</dt>
                <dd className="mt-0.5 text-lg font-semibold">{c.completed}</dd>
              </div>
              <div className="rounded-xl bg-secondary/60 p-3">
                <dt className="text-xs text-muted-foreground">{t.categories.progress}</dt>
                <dd className="mt-0.5 text-lg font-semibold">{c.avg}%</dd>
              </div>
            </dl>

            <Progress value={c.avg} className="mt-4 h-2 bg-secondary [&>div]:bg-primary" />

            {c.total === 0 ? (
              <p className="mt-4 text-xs text-muted-foreground">{t.categories.noGoals}</p>
            ) : (
              <Link to="/goals" className="mt-4 inline-block text-xs font-medium text-foreground hover:underline">
                {t.dashboard.viewAll} →
              </Link>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}