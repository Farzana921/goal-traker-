import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, Activity, Brain, Briefcase, DollarSign, Heart, Sparkles } from "lucide-react";
import type { GoalType } from "@/types";

export const Route = createFileRoute("/goals/new")({
  head: () => ({
    meta: [
      { title: "New Goal — GoalForge" },
      { name: "description", content: "Create a new goal." },
    ],
  }),
  component: NewGoalPage,
});

const COLORS = ["#CBB89C", "#7A9B76", "#D6A95A", "#D97A7A", "#D8CFC6", "#6B6B6B"];
const ICONS = [
  { name: "BookOpen", icon: BookOpen },
  { name: "Activity", icon: Activity },
  { name: "Brain", icon: Brain },
  { name: "Briefcase", icon: Briefcase },
  { name: "DollarSign", icon: DollarSign },
  { name: "Heart", icon: Heart },
  { name: "Sparkles", icon: Sparkles },
];

function NewGoalPage() {
  const { createGoal, t } = useApp();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<GoalType>("daily");
  const [target, setTarget] = useState(10);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState("Sparkles");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = t.goal.requiredTitle;
    if (!category) errs.category = t.goal.requiredCategory;
    if (target <= 0) errs.target = t.goal.requiredTarget;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const g = createGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      type,
      target,
      startDate,
      endDate: endDate || undefined,
      color,
      icon,
      notes: notes.trim() || undefined,
    });
    toast.success(t.toast.created);
    navigate({ to: "/goals/$id", params: { id: g.id } });
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/goals">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t.goal.create}</h1>
        </div>
      </div>

      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label>{t.goal.title}</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t.goal.description}</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl" rows={2} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t.goal.category}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  {t.categoriesList.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t.goal.type}</Label>
              <Select value={type} onValueChange={(v) => setType(v as GoalType)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t.goal.typeDaily}</SelectItem>
                  <SelectItem value="count">{t.goal.typeCount}</SelectItem>
                  <SelectItem value="time">{t.goal.typeTime}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t.goal.target}</Label>
              <Input
                type="number"
                min={1}
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="rounded-xl"
              />
              {errors.target && <p className="text-xs text-destructive">{errors.target}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t.goal.startDate}</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-xl" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t.goal.endDate}</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.goal.color}</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-9 w-9 rounded-full ring-offset-2 transition ${color === c ? "ring-2 ring-foreground" : ""}`}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.goal.icon}</Label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(({ name, icon: I }) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setIcon(name)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                    icon === name ? "border-foreground bg-secondary" : "border-border bg-card hover:bg-secondary/60"
                  }`}
                >
                  <I className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.goal.notes}</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-xl" rows={3} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/goals">{t.goal.cancel}</Link>
            </Button>
            <Button type="submit" className="rounded-full">{t.goal.create}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}