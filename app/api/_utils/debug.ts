export function isDebug(req: Request) {
  const u = new URL(req.url);
  return u.searchParams.get("debug") === "1" || req.headers.get("x-debug") === "1";
}
