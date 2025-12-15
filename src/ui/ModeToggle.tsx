"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const isLight = theme === "light";

  return (
    <button
      className="btn"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label="Toggle theme"
      title="Toggle theme"
      type="button"
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
