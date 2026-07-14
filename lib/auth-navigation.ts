export function safeReturnPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export function loginHref(returnTo: string) {
  return `/login?next=${encodeURIComponent(safeReturnPath(returnTo))}`;
}
