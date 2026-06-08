import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Target, FolderKanban, Settings as SettingsIcon, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useApp } from "@/context/AppContext";

export function AppSidebar() {
  const { t, level, user } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = [
    { title: t.nav.dashboard, url: "/dashboard", icon: LayoutDashboard },
    { title: t.nav.goals, url: "/goals", icon: Target },
    { title: t.nav.categories, url: "/categories", icon: FolderKanban },
    { title: t.nav.settings, url: "/settings", icon: SettingsIcon },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">{t.appName}</span>
            <span className="text-[11px] text-muted-foreground">{t.tagline}</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t.nav.dashboard}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t group-data-[collapsible=icon]:hidden">
        <div className="rounded-xl bg-secondary/60 p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t.dashboard.level} {level.level}</span>
            <span>{user.xp} XP</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${level.pct}%` }} />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}