// Only allow redirects to pages on our own site (stops open-redirect tricks)
export function safeNext(next?: string) {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  return next;
}