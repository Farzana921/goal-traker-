import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Download, Trash2, Sun, Moon, Globe } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — GoalForge" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, setLanguage, setTheme, t, goals, user, resetAll } = useApp();

  function exportData() {
    const blob = new Blob([JSON.stringify({ goals, user, settings }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `goalforge-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t.toast.exported);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t.settings.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.settings.subtitle}</p>
      </div>

      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
            <Globe className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold">{t.settings.language}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{t.settings.languageDesc}</p>
            <RadioGroup
              value={settings.language}
              onValueChange={(v) => setLanguage(v as "en" | "fa")}
              className="mt-4 grid grid-cols-2 gap-3"
            >
              <Label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${settings.language === "en" ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-secondary/40"}`}>
                <RadioGroupItem value="en" />
                <span className="text-sm font-medium">{t.settings.english}</span>
              </Label>
              <Label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${settings.language === "fa" ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-secondary/40"}`}>
                <RadioGroupItem value="fa" />
                <span className="text-sm font-medium">{t.settings.persian}</span>
              </Label>
            </RadioGroup>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
            {settings.theme === "dark" ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold">{t.settings.theme}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{t.settings.themeDesc}</p>
            <RadioGroup
              value={settings.theme}
              onValueChange={(v) => setTheme(v as "light" | "dark")}
              className="mt-4 grid grid-cols-2 gap-3"
            >
              <Label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${settings.theme === "light" ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-secondary/40"}`}>
                <RadioGroupItem value="light" />
                <Sun className="h-4 w-4" />
                <span className="text-sm font-medium">{t.settings.light}</span>
              </Label>
              <Label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${settings.theme === "dark" ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-secondary/40"}`}>
                <RadioGroupItem value="dark" />
                <Moon className="h-4 w-4" />
                <span className="text-sm font-medium">{t.settings.dark}</span>
              </Label>
            </RadioGroup>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <h2 className="text-base font-semibold">{t.settings.data}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.settings.dataDesc}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={exportData} variant="outline" className="rounded-full">
            <Download className="me-1.5 h-4 w-4" /> {t.settings.export}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="rounded-full text-destructive hover:text-destructive">
                <Trash2 className="me-1.5 h-4 w-4" /> {t.settings.reset}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>{t.settings.resetConfirm}</AlertDialogTitle>
                <AlertDialogDescription>{t.settings.resetConfirmDesc}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">{t.goal.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    resetAll();
                    toast(t.toast.reset);
                  }}
                >
                  {t.settings.reset}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
}