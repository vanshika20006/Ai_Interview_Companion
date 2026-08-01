import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
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
  CalendarDays,
  Trophy,
  Medal,
  Search,
  Bookmark,
  UsersRound,
  Sparkles,
  Bot,
  Inbox,
  Building2,
  GitPullRequest,
} from "lucide-react";

const ROUTES = [
  { group: "Prepare", title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { group: "Prepare", title: "AI Chat", url: "/chat", icon: Bot },
  { group: "Prepare", title: "Profile", url: "/profile", icon: User },
  { group: "Prepare", title: "Resume Analyzer", url: "/resume", icon: FileText },
  { group: "Prepare", title: "Resume Builder", url: "/resume-builder", icon: FileText },
  { group: "Prepare", title: "AI Interview", url: "/interview", icon: MessagesSquare },
  { group: "Prepare", title: "LeetCode Roadmap", url: "/leetcode", icon: Code2 },
  { group: "Prepare", title: "Study Planner", url: "/planner", icon: CalendarDays },
  { group: "Discover", title: "Jobs", url: "/jobs", icon: Briefcase },
  { group: "Discover", title: "Community", url: "/community", icon: Users },
  { group: "Discover", title: "Code Review", url: "/code-review", icon: GitPullRequest },
  { group: "Discover", title: "Prep Packs", url: "/prep-packs", icon: Building2 },
  { group: "Discover", title: "Study Groups", url: "/groups", icon: UsersRound },
  { group: "Discover", title: "Bookmarks", url: "/bookmarks", icon: Bookmark },
  { group: "Grow", title: "Analytics", url: "/analytics", icon: BarChart3 },
  { group: "Grow", title: "Achievements", url: "/achievements", icon: Trophy },
  { group: "Grow", title: "Leaderboard", url: "/leaderboard", icon: Medal },
  { group: "Grow", title: "Recruiter Search", url: "/recruiter", icon: Search },
  { group: "Workspace", title: "Notifications", url: "/notifications", icon: Inbox },
  { group: "Workspace", title: "Settings", url: "/settings", icon: Settings },
] as const;

const ACTIONS = [
  { title: "Ask the AI assistant", url: "/chat", icon: Bot },
  { title: "Start a new mock interview", url: "/interview", icon: MessagesSquare },
  { title: "Analyze my resume", url: "/resume", icon: FileText },
  { title: "Today's coding problem", url: "/leetcode", icon: Sparkles },
  { title: "Submit code for review", url: "/code-review", icon: GitPullRequest },
] as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (url: string) => {
    setOpen(false);
    navigate({ to: url });
  };

  const grouped = ROUTES.reduce<Record<string, (typeof ROUTES)[number][]>>((acc, r) => {
    (acc[r.group] ??= []).push(r);
    return acc;
  }, {});

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2 rounded-md border bg-background/60 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search…</span>
        <kbd className="ml-2 hidden rounded border bg-muted px-1.5 text-[10px] font-mono lg:inline">
          ⌘K
        </kbd>
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
        aria-label="Open command palette"
      >
        <Search className="h-4 w-4" />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, jump to anywhere…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick actions">
            {ACTIONS.map((a) => (
              <CommandItem key={a.title} onSelect={() => go(a.url)}>
                <a.icon className="mr-2 h-4 w-4" />
                {a.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          {Object.entries(grouped).map(([heading, items]) => (
            <CommandGroup key={heading} heading={heading}>
              {items.map((r) => (
                <CommandItem key={r.url} onSelect={() => go(r.url)}>
                  <r.icon className="mr-2 h-4 w-4" />
                  {r.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
