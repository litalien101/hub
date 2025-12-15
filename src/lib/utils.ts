import { clsx } from "clsx";

export function cn(...args: any[]) {
  return clsx(args);
}

export function safeUrl(url: string) {
  try {
    const u = new URL(url);
    return u.toString();
  } catch {
    return "";
  }
}
