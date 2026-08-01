import { Link, useRouterState } from "@tanstack/react-router";
import { Bot } from "lucide-react";

export function ChatFab() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/chat")) return null;
  return (
    <Link
      to="/chat"
      aria-label="Open AI chat"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Bot className="h-6 w-6" />
      <span className="sr-only">AI assistant</span>
    </Link>
  );
}
