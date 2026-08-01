import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  User,
  FileText,
  MessagesSquare,
  Code2,
  Briefcase,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  CalendarDays,
  Trophy,
  Medal,
  Search,
  Bookmark,
  UsersRound,
  Bot,
  Inbox,
  Building2,
  GitPullRequest,
  Shield,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { amIAdmin } from "@/lib/admin.functions";
import { amIRecruiter } from "@/lib/recruiter.functions";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "AI Chat", url: "/chat", icon: Bot },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Resume Analyzer", url: "/resume", icon: FileText },
  { title: "Resume Builder", url: "/resume-builder", icon: FileText },
  { title: "AI Interview", url: "/interview", icon: MessagesSquare },
  { title: "LeetCode Roadmap", url: "/leetcode", icon: Code2 },
  { title: "Study Planner", url: "/planner", icon: CalendarDays },
];

const discoverItems = [
  { title: "Jobs", url: "/jobs", icon: Briefcase },
  { title: "Community", url: "/community", icon: Users },
  { title: "Code Review", url: "/code-review", icon: GitPullRequest },
  { title: "Prep Packs", url: "/prep-packs", icon: Building2 },
  { title: "Study Groups", url: "/groups", icon: UsersRound },
  { title: "Bookmarks", url: "/bookmarks", icon: Bookmark },
];

const growItems = [
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Achievements", url: "/achievements", icon: Trophy },
  { title: "Leaderboard", url: "/leaderboard", icon: Medal },
];

const adminItems = [
  { title: "Notifications", url: "/notifications", icon: Inbox },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");
  const checkAdmin = useServerFn(amIAdmin);
  const checkRecruiter = useServerFn(amIRecruiter);
  const { data: isAdmin } = useQuery({
    queryKey: ["amIAdmin"],
    queryFn: () => checkAdmin().catch(() => false),
    retry: false,
    staleTime: 60_000,
  });
  const { data: isRecruiter } = useQuery({
    queryKey: ["recruiterRole"],
    queryFn: () => checkRecruiter().catch(() => false),
    retry: false,
    staleTime: 60_000,
  });

  // Role-specific menu sets — admin and recruiter get a focused workspace,
  // not the full student curriculum.
  const adminPrepare = [{ title: "Admin Panel", url: "/admin", icon: Shield }];
  const adminWorkspace = [
    { title: "Notifications", url: "/notifications", icon: Inbox },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const recruiterPrepare = [
    { title: "Recruiter", url: "/recruiter", icon: Search },
    { title: "AI Chat", url: "/chat", icon: Bot },
  ];
  const recruiterDiscover = [
    { title: "Community", url: "/community", icon: Users },
    { title: "Bookmarks", url: "/bookmarks", icon: Bookmark },
  ];

  const grow = [
    ...growItems,
    ...(isRecruiter && !isAdmin ? [{ title: "Recruiter", url: "/recruiter", icon: Search }] : []),
  ];

  type Item = { title: string; url: string; icon: typeof Shield };
  const groups: { label: string; items: Item[] }[] = isAdmin
    ? [
        { label: "Admin", items: adminPrepare },
        { label: "Workspace", items: adminWorkspace },
      ]
    : isRecruiter
      ? [
          { label: "Recruit", items: recruiterPrepare },
          { label: "Discover", items: recruiterDiscover },
          { label: "Workspace", items: adminItems },
        ]
      : [
          { label: "Prepare", items: mainItems },
          { label: "Discover", items: discoverItems },
          { label: "Grow", items: grow },
          { label: "Workspace", items: adminItems },
        ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link
          to={isAdmin ? "/admin" : isRecruiter ? "/recruiter" : "/dashboard"}
          className="flex items-center gap-2 px-2 py-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-elegant">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">Placement AI</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {isAdmin ? "Admin Console" : isRecruiter ? "Recruiter Suite" : "Companion"}
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
