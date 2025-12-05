import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, Users, Boxes, Tag, LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import ThemeButton from "./ThemeButton";

export function AppSidebar() {
  const { authUser, logout, isLogoutLoading } = useAuth();
  const { state: sidebarState } = useSidebar();
  const isAdmin = authUser?.role === "ADMIN";

  const items = [
    { label: "Dashboard", to: "/dashboard", icon: <Home className="h-4 w-4" /> },
    ...(isAdmin
      ? [{ label: "Users", to: "/users", icon: <Users className="h-4 w-4" /> }]
      : []),
    { label: "Assets", to: "/assets", icon: <Boxes className="h-4 w-4" /> },
    { label: "Category", to: "/category", icon: <Tag className="h-4 w-4" /> },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {sidebarState === "collapsed" ? (
          <div className="flex h-8 w-8 items-center justify-center px-2 py-1">
            <Boxes className="h-6 w-6" />

          </div>
        ) : (
          <div className="px-2 py-1 text-base font-semibold">Kloudtech IAAT</div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="hidden md:flex">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <Link to={item.to as any} activeOptions={{ exact: true }}>
                    {({ isActive }) => (
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <a>
                          {item.icon}
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <Button
          variant="destructive"
          className="w-full justify-start gap-2"
          onClick={async () => {
            try {
              await logout();
            } finally {
              // Redirect handled by route guard
            }
          }}
          disabled={isLogoutLoading}
        >
          <LogOut className="h-4 w-4" />
          {isLogoutLoading ? "Logging out…" : "Logout"}
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b bg-background px-2">
            <div className="flex flex-1 justify-center items-center gap-2 md:justify-start">
              <SidebarTrigger />
              <div className="text-sm text-muted-foreground">Main</div>
            </div>
            <div>
              <ThemeButton className="bg-transparent text-foreground"/>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
