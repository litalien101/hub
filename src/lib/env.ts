export function parseEmailList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toLowerCase());
}

export const ADMIN_EMAILS = parseEmailList(process.env.ADMIN_EMAILS);
export const CONTRIBUTOR_EMAILS = parseEmailList(process.env.CONTRIBUTOR_EMAILS);
export const ALLOW_IFRAME_EMBEDS = (process.env.ALLOW_IFRAME_EMBEDS ?? "false").toLowerCase() === "true";
